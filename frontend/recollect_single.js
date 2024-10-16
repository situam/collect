import { pb } from "./database";

import { i18next } from "./src/i18n";

function hydrateContributionDisplay(documentElement, rec) {
  documentElement.innerHTML = `
    <pre>CO#${rec.entry_id}</pre>
    <h3>${rec.description}</h3>
    <div class="preview-image-grid">
      ${rec.expand?.files
        ?.map(
          (el) => `
        <a href="${pb.files.getUrl(el, el.processed_file)}"><img src="${pb.files.getUrl(el, el.thumb)}"></img></a>
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

function hydrateFileDisplay(documentElement, rec) {
  documentElement.innerHTML = `
    <pre>FILE#${rec.entry_id}</pre>
    <a href="${pb.files.getUrl(rec, rec.processed_file)}"><img src="${pb.files.getUrl(rec, rec.thumb)}"></img></a>
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
        img {
         width: 100%;
        }
      `;
    }
  }
}

init();
