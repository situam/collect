import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";

import PocketBase from "pocketbase";

import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const uppy = new Uppy().use(Dashboard, {
  inline: true,
  target: "#uppy-dashboard",

  /*
metaFields: [
  { id: 'name', name: 'Name', placeholder: 'file name' },
  { id: 'tags', name: 'Keywords', placeholder: 'specify extra keywords (comma separated)' },
  {
    id: 'public',
    name: 'Public',
    render({ value, onChange, required, form }, h) {
      return h('input', {
        type: 'text',
        form,
        onChange: (ev) => {
          console.log("onChange:", ev.target.value)
          onChange(ev.target.value)
        },
        defaultValue: value
        //defaultChecked: value === 'on',
      });
    },
  },
],
*/
});
window.uppy = uppy;

const pb = new PocketBase("http://127.0.0.1:8090");
pb.autoCancellation(false);

/**
Setup Tagify given a collection name and document element
*/
async function initTagField(collectionName, documentElement) {
  const tagRecords = await pb.collection(collectionName).getFullList();
  let tagList = tagRecords.map((rec) => ({
    value: rec.display_name,
    name: rec.id,
  }));
  const tags = new Tagify(documentElement, {
    whitelist: tagList,
    maxTags: 10,
    dropdown: {
      maxItems: 20, // <- mixumum allowed rendered suggestions
      classname: "tags-look", // <- custom classname for this dropdown, so it could be targeted
      enabled: 0, // <- show suggestions on focus
      closeOnSelect: false, // <- do not hide the suggestions dropdown once an item has been selected
    },
  });
}

await initTagField("tags", document.querySelector("input#tags"));
await initTagField("locations", document.querySelector("input#location"));
await initTagField(
  "contributors",
  document.querySelector("input#contributors"),
);
await initTagField("authors", document.querySelector("input#authors"));

/**
Given a list of tags (name, value),
get the record ids, creating records if they dont exist

@param {string} collectionName
@param {TagifyValue} tagifyValue
@returns {Future<string[]>} recordIds
*/
async function getTagRecordIds(collectionName, tagifyValue) {
  if (!tagifyValue) {
    // empty
    return [];
  }

  let ids = [];
  await Promise.all(
    JSON.parse(tagifyValue).map(async (tag) => {
      if (!tag.name) {
        // new tag, need to create
        const record = await pb.collection(collectionName).create({
          display_name: tag.value,
        }); // TODO: handle error creating in case record already exists
        ids = [...ids, record.id];
      } else {
        ids = [...ids, tag.name];
      }
    }),
  );
  return ids;
}

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // validate at least 3 tags
  if (
    document.querySelector("input#tags").tagifyValue === "" ||
    JSON.parse(document.querySelector("input#tags").tagifyValue).length < 3
  ) {
    // tags empty
    alert("please select at least 3 tags");
    return;
  }

  // validate at least 1 contributor
  if (document.querySelector("input#contributors").tagifyValue === "") {
    alert("please enter at least one contributor");
    return;
  }

  const tagRecordIds = await getTagRecordIds(
    "tags",
    document.querySelector("input#tags").tagifyValue,
  );
  const locationRecordIds = await getTagRecordIds(
    "locations",
    document.querySelector("input#location").tagifyValue,
  );
  const authorRecordIds = await getTagRecordIds(
    "authors",
    document.querySelector("input#authors").tagifyValue,
  );
  const contributorRecordIds = await getTagRecordIds(
    "contributors",
    document.querySelector("input#contributors").tagifyValue,
  );

  // upload files, get file records
  let fileRecordIds = [];
  let files = uppy.getFiles().map((uppyFile) => uppyFile.data);
  for (const file of files) {
    //for (const file of fileInput.files) {
    let formData = new FormData();
    formData.append("file", file);
    const createdRecord = await pb.collection("files").create(formData);
    fileRecordIds = [...fileRecordIds, createdRecord.id];
  }
  console.log("fileRecordIds", fileRecordIds);

  // add contribution
  const record = await pb.collection("contributions").create({
    description: document.querySelector("input#description").value,
    authors: authorRecordIds,
    contributors: contributorRecordIds,
    tags: tagRecordIds,
    location: locationRecordIds,
    //contributor_name: document.querySelector("input#contributor_name").value,
    //author: document.querySelector("input#author").value,
    physical: document.querySelector("input#physical").checked,
    date_created: document.querySelector("input#date_created").value,
    files: fileRecordIds,
  });

  console.log("Saved contribution", record);
  alert("Submission saved to collection.");
  //window.location.reload();
});
