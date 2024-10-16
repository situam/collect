import Tagify from "@yaireo/tagify";
import "@yaireo/tagify/dist/tagify.css";
import { pb } from "./database";

/**
Setup Tagify given a collection name and document element
*/
export async function initTagField(
  collectionName,
  documentElement,
  tagifyOptions = {},
) {
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
    ...tagifyOptions,
  });
}

/**
Given a list of tags (name, value),
get the record ids, optionally creating records if they dont exist

@param {string} collectionName
@param {TagifyValue} tagifyValue
@param {bool} createIfNotExist - create records if they dont exist
@returns {Future<string[]>} recordIds
*/
export async function getTagRecordIds(
  collectionName,
  tagifyValue,
  createIfNotExist,
) {
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
