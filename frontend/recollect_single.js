import { pb } from "./database";

import { i18next, getLocaleParam } from "./src/i18n";

function hydrateContributionDisplay(documentElement, rec) {
  documentElement.innerHTML = `
    <pre>CO#${rec.entry_id}</pre>
    <h3>${rec.description}</h3>
    <div class="preview-image-grid">
      ${rec.expand?.files
        ?.map(
          (el) => `
        <a href="recollect_single.html?file=${el.entry_id}&embed=true&${getLocaleParam()}"><img src="${pb.files.getUrl(el, el.thumb)}"></img></a>
         ${el.processed_file.split(".")?.pop()}
        `,
        )
        .join("")}
    </div>
    <table>
      <tr>
        <td>${i18next.t("contribution.long_description")}</td>
        <td>${rec.long_description || i18next.t("misc.notApplicable")}</td>
      </tr>
      <tr>
        <td>${i18next.t("contribution.tags")}</td>
        <td>${rec.expand?.tags?.map((el) => `${el.display_name}`).join(", ") || i18next.t("misc.notApplicable")}</td>
      </tr>
      <tr>
        <td>${i18next.t("contribution.location")}</td>
        <td>${rec.expand?.location?.map((el) => `${el.display_name}`).join(", ") || i18next.t("misc.notApplicable")}</td>
      </tr>
      <tr>
        <td>${i18next.t("contribution.contributors")}</td>
        <td>${rec.expand?.contributors?.map((el) => `${el.display_name}`).join(", ") || i18next.t("misc.notApplicable")}</td>
      </tr>
      <tr>
        <td>${i18next.t("contribution.authors")}</td>
        <td>${rec.expand?.authors?.map((el) => `${el.display_name}`).join(", ") || i18next.t("misc.notApplicable")}</td>
      </tr>
      <tr>
        <td>${i18next.t("contribution.date_created")}</td>
        <td>${rec.date_created || i18next.t("misc.notApplicable")}</td>
      </tr>
      <tr>
        <td>${i18next.t("contribution.date_added")}</td>
        <td>${rec.created || i18next.t("misc.notApplicable")}</td>
      </tr>
      <tr>
        <td>${i18next.t("contribution.physical")}</td>
        <td>${rec.physical ? i18next.t("misc.yes") : i18next.t("misc.no")}</td>
      </tr>
    </table>`;
}

async function getContributionData(entryId) {
  const record = await pb
    .collection("contributions")
    .getFirstListItem(`entry_id = '${entryId}'`, {
      expand: "tags,files,location,contributors,authors",
    });
  console.log("getContributionData", entryId, record);
  return record;
}

function renderFileByType(url) {
  const fileType = url.split(".").pop().toLowerCase(); // Get the file extension

  switch (fileType) {
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return `<img src="${url}" alt="Image file" />`;

    case "mp4":
      return `
        <video controls>
          <source src="${url}" type="video/mp4">
          Your browser does not support the video tag.
        </video>`;

    case "mp3":
      return `
        <audio controls>
          <source src="${url}" type="audio/mpeg">
          Your browser does not support the audio element.
        </audio>`;

    case "pdf":
      return `<embed src="${url}" type="application/pdf" width="100%" height="600px" />`;

    default:
      return "<pre>Unsupported file type</pre>";
  }
}

function hydrateFileDisplay(documentElement, rec) {
  documentElement.innerHTML = `
    <pre>FILE#${rec.entry_id}</pre>
    ${renderFileByType(pb.files.getUrl(rec, rec.processed_file))}
    <p>${rec.caption}</p>
  `;
}

async function getFileData(entryId) {
  const record = await pb
    .collection("files")
    .getFirstListItem(`entry_id = '${entryId}'`, {
      //expand: "tags",
    });
  console.log("getFileData", entryId, record);
  return record;
}

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const contributionId = urlParams.get("contribution");
  const fileId = urlParams.get("file");
  const embed = urlParams.get("embed");

  if (contributionId) {
    console.log("Show contribution #", contributionId);
    document.title = `CO#${contributionId}`;
    /*
    document.querySelector("h1").innerText =
      `Re-Collection - CO#${contributionId}`;
      */
    hydrateContributionDisplay(
      document.querySelector("#root"),
      await getContributionData(contributionId),
    );
  } else if (fileId) {
    console.log("Show contribution #", fileId);
    document.title = `FILE#${fileId}`;
    hydrateFileDisplay(
      document.querySelector("#root"),
      await getFileData(fileId),
    );
  } else {
    document.querySelector("#root").innerText =
      "error - must provide either ?contribution=X or ?file=X";
  }

  if (embed) {
    const stylesheet = document.createElement("style");
    document.head.appendChild(stylesheet);
    stylesheet.innerHTML = `
      html, body {
        margin: 0;
      }
      body {
        margin: 15px;
      }
    `;

    if (fileId) {
      stylesheet.innerHTML += `
        img,video {
         width: 100%;
        }
      `;
    }
  }
}

init();
