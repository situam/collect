/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvmrvovdzrvrrew")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_Z7tTAXS` ON `tags` (`display_name`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ximoutj4",
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
  const collection = dao.findCollectionByNameOrId("uvmrvovdzrvrrew")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_Z7tTAXS` ON `tags` (`tag`)"
  ]

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ximoutj4",
    "name": "tag",
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
