/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    console.log("Init contributors, init authors");
    migrateContributorsAuthors(db);
    console.log("Migration complete");
  },
  (db) => {
    // Optional revert logic (if needed)
  },
);

function migrateContributorsAuthors(db) {
  const dao = new Dao(db);
  const contributorsCollection = dao.findCollectionByNameOrId("contributors");
  const authorsCollection = dao.findCollectionByNameOrId("authors");

  // Fetch records where `contributor_name` is not empty or `author` is not empty.
  const recordsToMigrate = dao.findRecordsByExpr(
    "contributions",
    $dbx.or($dbx.exp("contributor_name != ''"), $dbx.exp("author != ''")),
  );

  for (const record of recordsToMigrate) {
    // Handle contributors
    if (record.get("contributor_name")) {
      const contributorNames = record
        .get("contributor_name")
        .split(",")
        .map((name) => name.trim());
      const contributorRecordIds = [];

      for (const name of contributorNames) {
        let contributorRecord;
        try {
          contributorRecord = dao.findFirstRecordByData(
            "contributors",
            "display_name",
            name,
          );
        } catch (err) {
          // Create a new contributor record if it doesn't exist
          const record = new Record(contributorsCollection, {
            display_name: name,
          });
          dao.saveRecord(record);
          contributorRecord = record;
        }
        contributorRecordIds.push(contributorRecord.id);
      }

      record.set("contributors", contributorRecordIds);
    }

    // Handle authors
    if (record.get("author")) {
      const authorNames = record
        .get("author")
        .split(",")
        .map((name) => name.trim());
      const authorRecordIds = [];

      for (const name of authorNames) {
        let authorRecord;

        try {
          authorRecord = dao.findFirstRecordByData(
            "authors",
            "display_name",
            name,
          );
        } catch (error) {
          // Create a new author record if it doesn't exist
          const record = new Record(authorsCollection, {
            display_name: name,
          });
          dao.saveRecord(record);

          authorRecord = record;
        }

        authorRecordIds.push(authorRecord.id);
      }

      record.set("authors", authorRecordIds);
    }

    // Save the updated record with the contributor and author IDs.
    dao.saveRecord(record);
    console.log("updated contribution", record.entry_id);
  }
}
