import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import { initTagField, getTagRecordIds } from "./tagify";

import { pb } from "./database";

import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { getLocaleFromUrl, hydrateText, i18next } from "./src/i18n";

function updateUppyCssContent() {
  const translatedCaption = i18next.t("collector.formUploadCaptionButton"); // Get the translated value
  const styleElement = document.createElement("style"); // Create a new style element
  styleElement.innerHTML = `
    .uppy-Dashboard-Item-action--edit::after {
      content: "${translatedCaption}";
    }
  `;
  document.head.appendChild(styleElement); // Append the new style to the document
}

const uppy = new Uppy().use(Dashboard, {
  inline: true,
  target: "#uppy-dashboard",
  //autoOpen: "metaEditor",
  locale: {
    strings: {
      dropPasteFiles: i18next.t("collector.formUploadHint"),
      browseFiles: i18next.t("collector.formUploadHintBrowseFiles"),
      addMore: i18next.t("collector.formUploadAddMore"),
      saveChanges: i18next.t("collector.formUploadSaveChanges"),
      cancel: i18next.t("collector.formUploadCancel"),
      editing: i18next.t("collector.formUploadEditing"),
      xFilesSelected: {
        0: i18next.t("collector.formUploadXFilesSelected.0"),
        1: i18next.t("collector.formUploadXFilesSelected.1"),
      },
    },
  },
  metaFields: [
    /*{ id: "name", name: "Name", placeholder: "file name abcxyz" },*/
    {
      id: "caption",
      name: i18next.t("collector.formUploadCaption"), // "Caption",
      placeholder: i18next.t("collector.formUploadCaptionHint"), //"Add a caption (optional)",
    },
    /*{
      id: "caption",
      name: "Caption (optional)",
      render({ value, onChange, required, form }, h) {
        return h("input", {
          type: "text",
          form,
          onChange: (ev) => {,
            console.log("onChange:", ev.target.value);
            onChange(ev.target.value);
          },
          defaultValue: value,
          //defaultChecked: value === 'on',
        });
      },
    },*/
  ],
});
window.uppy = uppy;
hydrateText();
updateUppyCssContent();

await initTagField("tags", document.querySelector("input#tags"));
await initTagField("locations", document.querySelector("input#location"));
await initTagField(
  "contributors",
  document.querySelector("input#contributors"),
);
await initTagField("authors", document.querySelector("input#authors"));

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // validate at least 3 tags
  if (
    document.querySelector("input#tags").tagifyValue === "" ||
    JSON.parse(document.querySelector("input#tags").tagifyValue).length < 3
  ) {
    // tags empty
    alert(i18next.t("collector.formKeywordsValidate"));
    return;
  }

  // validate at least 1 contributor
  if (document.querySelector("input#contributors").tagifyValue === "") {
    alert(i18next.t("collector.formContributorsValidate"));
    return;
  }

  const tagRecordIds = await getTagRecordIds(
    "tags",
    document.querySelector("input#tags").tagifyValue,
    true,
  );
  const locationRecordIds = await getTagRecordIds(
    "locations",
    document.querySelector("input#location").tagifyValue,
    true,
  );
  const authorRecordIds = await getTagRecordIds(
    "authors",
    document.querySelector("input#authors").tagifyValue,
    true,
  );
  const contributorRecordIds = await getTagRecordIds(
    "contributors",
    document.querySelector("input#contributors").tagifyValue,
    true,
  );

  // upload files, get file records
  let fileRecordIds = [];
  let files = uppy.getFiles().map((uppyFile) => ({
    file: uppyFile.data,
    caption: uppyFile.meta?.caption || undefined, // Capture the caption if it exists
  }));
  for (const { file, caption } of files) {
    //for (const file of fileInput.files) {
    let formData = new FormData();
    formData.append("file", file);
    if (caption) {
      formData.append("caption", caption);
    }

    const createdRecord = await pb.collection("files").create(formData);
    fileRecordIds = [...fileRecordIds, createdRecord.id];
  }

  // add contribution
  const record = await pb.collection("contributions").create({
    description: document.querySelector("input#description").value,
    long_description: document.querySelector("#long_description").value,
    authors: authorRecordIds,
    contributors: contributorRecordIds,
    tags: tagRecordIds,
    location: locationRecordIds,
    physical: document.querySelector("input#physical").checked,
    date_created: document.querySelector("input#date_created").value,
    files: fileRecordIds,
  });

  //console.log("Saved contribution", record);
  alert(i18next.t("collector.alertContributionSaved"));
  window.location.reload();
});
