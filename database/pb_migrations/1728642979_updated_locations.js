/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("graokygszgx06vu")

  collection.indexes = [
    "CREATE UNIQUE INDEX `idx_up6D01E` ON `locations` (`location`)"
  ]

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("graokygszgx06vu")

  collection.indexes = []

  return dao.saveCollection(collection)
})
