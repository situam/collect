/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("graokygszgx06vu")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_up6D01E` ON `locations` (`display_name`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s0ltltsy",
    "name": "display_name",
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
  const collection = dao.findCollectionByNameOrId("graokygszgx06vu")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_up6D01E` ON `locations` (`location`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "s0ltltsy",
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

  return dao.saveCollection(collection)
})
