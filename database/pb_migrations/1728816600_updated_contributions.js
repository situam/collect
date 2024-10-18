/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6xv6cfwyt2ius5")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "kyxenyhx",
    "name": "long_description",
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

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6xv6cfwyt2ius5")

  // remove
  collection.schema.removeField("kyxenyhx")

  return dao.saveCollection(collection)
})
