import PocketBase from "pocketbase";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";
import mime from "mime-types";
import axios from "axios";
import FormData from "form-data";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize PocketBase client
const pb = new PocketBase("http://127.0.0.1:8090");

async function processAllFiles() {
  // Query for files collection
  const records = await pb.collection("files").getFullList();
  await processFiles(records);
}

/*
Usage:
- first create a test record in the files collection (with just a file field)
- pass in the record id
*/
async function processTestFile(recordId) {
  let record = await pb.collection("files").getOne(recordId);

  if (record.processed_file || record.thumb) {
    throw "Record already has processed_file or thumb";
  }

  await processFiles([record]);

  record = await pb.collection("files").getOne(recordId);
  if (!record.processed_file || !record.thumb) {
    throw "Record missing processed_file or thumb";
  }
}

// Helper function to remove the original file extension
function getFileNameWithoutExt(filename) {
  return path.parse(filename).name; // Removes the extension (e.g., "file.pdf" -> "file")
}

async function processFiles(records) {
  for (const record of records) {
    const filePath = path.join(
      __dirname,
      `../database/pb_data/storage/${record.collectionId}/${record.id}`,
      record.file,
    ); // Adjust the file path as per your setup

    const attrsFilePath = `${filePath}.attrs`; // The .attrs file path

    if (fs.existsSync(attrsFilePath)) {
      // Read and parse the .attrs file to get the content type
      const attrsData = JSON.parse(fs.readFileSync(attrsFilePath, "utf8"));
      const contentType = attrsData["user.content_type"];

      if (!record.processed_file || !record.thumb) {
        try {
          if (contentType.startsWith("image/")) {
            await processFile(filePath, record, {
              processedExt: ".jpg",
              processCmd: (inputFilePath, outputFilePath) =>
                `convert ${inputFilePath} -resize 1500x1500 -quality 70 ${outputFilePath}`,
              thumbCmd: (inputFilePath, outputFilePath) =>
                `convert ${inputFilePath} -resize 150x150 -quality 70 ${outputFilePath}`,
            });
          } else if (contentType.startsWith("video/")) {
            await processFile(filePath, record, {
              processedExt: ".mp4",
              processCmd: (inputFilePath, outputFilePath) =>
                `ffmpeg -y -i ${inputFilePath} -vcodec libx264 -crf 23 -preset medium -acodec aac -b:a 128k -vf  "scale=1280:720:force_original_aspect_ratio=decrease, pad=ceil(iw/2)*2:ceil(ih/2)*2" -movflags +faststart ${outputFilePath}`,
              thumbCmd: (inputFilePath, outputFilePath) =>
                `ffmpeg -y -i ${inputFilePath} -ss 00:00:01.000 -vframes 1 -vf "scale=150:150:force_original_aspect_ratio=decrease, pad=ceil(iw/2)*2:ceil(ih/2)*2" ${outputFilePath}`,
            });
          }
          else if (contentType.startsWith("audio/")) {
            await processFile(filePath, record, {
              processedExt: ".mp3",
              processCmd: (inputFilePath, outputFilePath) =>
                `ffmpeg -y -i ${inputFilePath} -acodec libmp3lame -b:a 128k ${outputFilePath}`,
              thumbCmd: (inputFilePath, outputFilePath) =>
                `ffmpeg -y -i ${inputFilePath} -filter_complex "showwavespic=s=150x150" -frames:v 1 ${outputFilePath}`,
            });
          }
          else if (contentType === "application/pdf") {
            await processFile(filePath, record, {
              processedExt: ".pdf",
              processCmd: (inputFilePath, outputFilePath) =>
                `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/default -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputFilePath} ${inputFilePath}`,
              thumbCmd: (inputFilePath, outputFilePath) =>
                `convert -thumbnail x150 "${inputFilePath}[0]" ${outputFilePath}`,
            });
          } else {
            throw new Error(`Unhandled contentType: ${contentType}`);
          }
        } catch (error) {
          console.error(`Error processing file ${record.file}:`, error);
          process.exit(1); // Abort script on error
        }
      }
    } else {
      console.error(`Attributes file for ${record.file} not found.`);
      process.exit(1); // Abort script on error
    }
  }
}

function processFile(filePath, record, commands) {
  console.log("Starting file processing", { filePath, recordId: record.id });
  return new Promise((resolve, reject) => {
    const tmpDir = os.tmpdir();
    const baseFileName = getFileNameWithoutExt(record.file);

    const outputFileName = `processed_${baseFileName}${commands.processedExt}`;
    const outputFilePath = path.join(tmpDir, outputFileName);
    const thumbFileName = `thumb_${baseFileName}.jpg`;
    const thumbFilePath = path.join(tmpDir, thumbFileName);

    console.log(
      "Running process command:",
      commands.processCmd(filePath, outputFilePath),
    );

    // Execute main file processing command using spawn
    const processCmd = spawn("sh", [
      "-c",
      commands.processCmd(filePath, outputFilePath),
    ]);

    processCmd.stdout.on("data", (data) => {
      console.log(`Process stdout: ${data}`);
    });

    processCmd.stderr.on("data", (data) => {
      console.log(`Process stderr: ${data}`);
    });

    processCmd.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Process command failed with code ${code}`));
      }

      console.log(
        "Running thumbnail command:",
        commands.thumbCmd(filePath, thumbFilePath),
      );

      // Execute thumbnail command using spawn
      const thumbCmd = spawn("sh", [
        "-c",
        commands.thumbCmd(filePath, thumbFilePath),
      ]);

      thumbCmd.stdout.on("data", (data) => {
        console.log(`thumbCmd stdout: ${data}`);
      });

      thumbCmd.stderr.on("data", (data) => {
        console.log(`thumbCmd stderr: ${data}`);
      });

      thumbCmd.on("close", (code) => {
        if (code !== 0) {
          return reject(
            new Error(`Thumbnail command failed with code ${code}`),
          );
        }

        // Get MIME types for the processed file and thumbnail
        const outputMimeType =
          mime.lookup(outputFilePath) || "application/octet-stream";
        const thumbMimeType = mime.lookup(thumbFilePath) || "image/jpeg";

        console.log("Uploading files to PocketBase...");
        const formData = new FormData();

        formData.append("processed_file", fs.createReadStream(outputFilePath), {
          filename: outputFileName,
          contentType: outputMimeType,
        });
        formData.append("thumb", fs.createReadStream(thumbFilePath), {
          filename: thumbFileName,
          contentType: thumbMimeType,
        });

        axios({
          method: "patch",
          url: `http://127.0.0.1:8090/api/collections/files/records/${record.id}`,
          headers: {
            ...formData.getHeaders(),
            Authorization: `Bearer ${pb.authStore.token}`,
          },
          data: formData,
        })
          .then((response) => {
            console.log("Record updated successfully:", response.data);
            fs.unlinkSync(outputFilePath);
            fs.unlinkSync(thumbFilePath);
            resolve(response.data);
          })
          .catch((err) => {
            console.error(
              "Error updating record in PocketBase:",
              err.response?.data || err,
            );
            fs.unlinkSync(outputFilePath);
            fs.unlinkSync(thumbFilePath);
            reject(err);
          });
      });
    });
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function main() {
  console.log("Start Co-llection backend");
  while (true) {
    try {
      await processAllFiles();
      await sleep(10000);
    } catch (err) {
      console.log("Error: ", err);
      process.exit(1);
    }
  }
}
main();

//processTestFile("p4fnv0vi6akkv4a").catch(console.error);
