/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mb77rvszsywgo82")

  collection.name = "contributors"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("mb77rvszsywgo82")

  collection.name = "people"

  return dao.saveCollection(collection)
})
