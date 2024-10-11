/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvl5a55vlag1cnw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i3sxyjlw",
    "name": "entry_id",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvl5a55vlag1cnw")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "i3sxyjlw",
    "name": "humanReadableId",
    "type": "number",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "noDecimal": true
    }
  }))

  return dao.saveCollection(collection)
})
