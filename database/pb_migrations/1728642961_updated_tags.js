/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvmrvovdzrvrrew")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_Z7tTAXS` ON `tags` (`tag`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("uvmrvovdzrvrrew")

  collection.indexes = []

  return dao.saveCollection(collection)
})
