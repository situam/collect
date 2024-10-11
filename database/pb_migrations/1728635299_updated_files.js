/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvl5a55vlag1cnw")

  // add
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
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvl5a55vlag1cnw")

  // remove
  collection.schema.removeField("i3sxyjlw")

  return dao.saveCollection(collection)
})
