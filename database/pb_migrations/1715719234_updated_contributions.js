/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6xv6cfwyt2ius5")

  // remove
  collection.schema.removeField("ygosgpxe")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "9fj4ifyc",
    "name": "location",
    "type": "relation",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "collectionId": "graokygszgx06vu",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6xv6cfwyt2ius5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ygosgpxe",
    "name": "location",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // remove
  collection.schema.removeField("9fj4ifyc")

  return dao.saveCollection(collection)
})
