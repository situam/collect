/// <reference path="../pb_data/types.d.ts" />
migrate(
  (db) => {
    console.log("Init entry_id");
    assignEntryIds(db, "files");
    assignEntryIds(db, "contributions");
    console.log("Entry ID assignment complete for both collections.");
  },
  (db) => {
    // Optional revert logic (if needed)
  },
);

function assignEntryIds(db, collectionName) {
  const dao = new Dao(db);
  try {
    // Fetch all existing records from the collection
    const records = dao.findRecordsByExpr(collectionName);

    // Sort records by their creation date to ensure logical ordering
    records.sort((a, b) => new Date(a.created) - new Date(b.created));

    // Iterate over the records and assign entry_ids
    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const newEntryId = i + 1;

      // Update the record with the new entry_id
      record.set("entry_id", newEntryId);

      // Save the updated record using the Dao
      dao.saveRecord(record);

      console.log(
        `Updated ${collectionName} record ${record.id} with entry_id: ${newEntryId}`,
      );
    }

    console.log(
      `All records in ${collectionName} have been assigned entry_ids.`,
    );
  } catch (error) {
    console.error(`Error updating ${collectionName}:`, error);
  }
}
