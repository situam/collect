/**
Auto-increment entry_id for records added to files and contributions
*/
onRecordBeforeCreateRequest(
  (e) => {
    const result = new DynamicModel({
      entry_id: 0,
    });

    const tableName = e.collection.name || e.collection;

    // Query the latest entry_id from the specified table
    $app
      .dao()
      .db()
      .newQuery(
        `SELECT entry_id FROM ${tableName} ORDER BY entry_id DESC LIMIT 1`,
      )
      .one(result); // TODO: Handle error if no rows are found

    // Determine the next entry_id
    const lastId = result.entry_id;
    const newEntryId = lastId + 1;

    // Assign the new entry_id to the record being created
    e.record.set("entry_id", newEntryId);
    $app.logger().debug(`[assignEntryId] assigned entry_id ${newEntryId}`);
  },
  "files",
  "contributions",
);
