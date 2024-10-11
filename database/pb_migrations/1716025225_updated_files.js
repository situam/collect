/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvl5a55vlag1cnw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lododaha",
    "name": "file",
    "type": "file",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 10000000000,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvl5a55vlag1cnw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lododaha",
    "name": "file",
    "type": "file",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "mimeTypes": [],
      "thumbs": [],
      "maxSelect": 1,
      "maxSize": 1000000000,
      "protected": false
    }
  }))

  return dao.saveCollection(collection)
})
