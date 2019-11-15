import React, {useState, useEffect} from 'react';
import SQLite from 'react-native-sqlite-storage';
SQLite.enablePromise(true);

async function openDB() {
  try {
    return await SQLite.openDatabase({name: "storage.db", location: 'Documents'});
  } catch (error) {
   console.log(error); 
  }
}

async function runQueries(db, queries) {
  await db.transaction(tx => {
    queries.forEach((query) => {
      tx.executeSql(query);
      console.log(query);
    });
  });
}

async function runQueryWithResults(db, query, queryArgs) {
  let results, fullQuery;
  try {
    await db.transaction(async (tx) => {
      const [, res] = await tx.executeSql(query, queryArgs);
      results = await res;
    });
  } catch (error) {
    console.log(error);
  }
  fullQuery = query;
  queryArgs ? queryArgs.forEach((queryArg) => {
    fullQuery = fullQuery.replace('?', queryArg);
  }): fullQuery = fullQuery.replace('?/g', ' ');
  console.log(fullQuery);
  console.log("Rows Raw test: " + JSON.stringify(results.rows.raw()));
  console.log("Rows Affected test: " + results.rowsAffected);
  return results;
}

// Check the database to find which product was added last
export function useDBToGetLastID () {
  const [lastID, setLastID] = useState(-1);
  useEffect(() => (async () => {
    const db = await openDB();
    const query = `
    SELECT id FROM Product ORDER BY id DESC LIMIT 1
    `;
    const results = await runQueryWithResults(db, query);
    setLastID(results.rows.item(0)?results.rows.item(0).id:-1);
  }));
  return lastID;
}

export async function useDBToSaveTitle(index, title) {
  title = title || "New List " + index;
  const db = await openDB();
  const updateQuery = `
  UPDATE List SET title=? where id=?
  `;
  const selectQuery = `
  SELECT id, title from List where id=?
  `;
  const insertQuery = `
  INSERT INTO List(id, title) VALUES (?, ?)
  `;

  try { 
    const updateResults = await runQueryWithResults(db, updateQuery, [title, index]);
    const selectResults = await runQueryWithResults(db, selectQuery, [index]);

    if (updateResults.rowsAffected === 0 && selectResults.rows.raw().length === 0) {
      await runQueryWithResults(db, insertQuery, [index, title]);
    }
  } catch (error) {
    console.warn(error);
  }
}

export function useDBToLoadTitle(index) {
  console.log("index is " + index);
  const [title, setTitle] = useState("");
  useEffect(() => {
    SQLite.openDatabase({name: "storage.db", location: 'Documents'}).then((db) => {
      db.transaction(
        tx => {
          tx.executeSql('SELECT title FROM List WHERE id=?', [index]).then(([tx, results]) => {
            if (results.rows.item(0)) {
              setTitle(results.rows.item(0).title);
              console.log("Retrieved title#" + index + ": " + results.rows.item(0).title);
            } else {
              setTitle("New List");
            }
          }).catch((error) => {
            console.log("While Loading Title: " + error);
          });
        }).catch((error) => {
        console.log("While Loading title(outer): " + error);
      });
    });
  });
  return title;
}

export function useDBToAddBarcode(sku) {
  const [rowsAffected, setRowsAffected] = useState(0);
  useEffect(() => {
    SQLite.openDatabase({name: "storage.db", location: 'Documents'}).then((db) => {
      db.transaction(
        tx => {
          let lastAddedSku = "";
          tx.executeSql('SELECT sku FROM Product ORDER BY id DESC LIMIT 1').then(([tx, results]) => {
            lastAddedSku = results.rows.item(0) ? results.rows.item(0).sku : "";
          }).catch((error) => {
            console.log("While adding barcode: " + error);
          });
          if (sku && sku != lastAddedSku) {
            console.log("Inserting sku: " + sku);
            tx.executeSql('INSERT INTO Product(sku) values (?)', [sku]).then(([tx, results]) => {
              setRowsAffected(results.rowsAffected);
            });
            console.log("Inserted " + rowsAffected + " new row(s)");
          } else { 
            console.log("Couldn't add duplicate sku");
          }
        }
      )
    }).catch((error) => {
      console.log("While adding barcode (outer): " + error);
    });
  }, [sku])
}

export function useDBToGetSkus(curListId) {
  const [skus, setSkus] = useState([]);
  const [lastID, setLastID] = useState(-1);
  const dbLastID = useDBToGetLastID();
  console.log("Last ID is " + dbLastID);

  useEffect(() => {
    if (lastID !== dbLastID) {
      //console.log("lastID (" + lastID + ") !== dbLastID(" + dbLastID + ")");
      SQLite.openDatabase({name: "storage.db", location: 'Documents'}).then((db) => {
        db.transaction(
          tx => {
            tx.executeSql('SELECT sku FROM Product').then(([tx,results]) => {
              let dbSkus = [];
              for (var index = 0; index < results.rows.length; index++) {
                dbSkus = [...dbSkus, results.rows.item(index).sku];
              }
              setSkus(dbSkus);
              console.log(dbSkus);
            }).catch((error) => {
              console.log(error);
            });
          }
        )
      }).catch((error) => {
        console.log(error);
      });
      setLastID(dbLastID);
    } else {
      //console.log("lastID (" + lastID + ") === dbLastID(" + dbLastID + ")");
    }
  })
  return skus;
}
export function deleteAllSkus() {
  SQLite.openDatabase({name: "storage.db", location: 'Documents'}).then((db) => {
    db.transaction(
      tx => {
        tx.executeSql('DELETE FROM Product').then(([rx, results]) => {
          console.log("Deleted " + results.rowsAffected + " rows");
        }).catch((error) => {
          console.log(error);
        });
        tx.executeSql('DELETE FROM List');
      }
    )
  }).catch((error) => {
    console.log(error);
  });
}

export function useNewDB () {
  const [areTablesLoaded, setAreTablesLoaded] = useState(false);
  const createTables= [`
    CREATE TABLE IF NOT EXISTS Product(
      description TEXT, 
      id INTEGER NOT NULL,
      onhands INTEGER,
      upc INTEGER
      sku TEXT,
      PRIMARY KEY("id"))
    `,`
    CREATE TABLE IF NOT EXISTS Shelf(
      name TEXT, 
      id INTEGER NOT NULL, 
      PRIMARY KEY ("id"))
    `,`
    CREATE TABLE IF NOT EXISTS List(
      title TEXT, 
      id INTEGER NOT NULL, 
      PRIMARY KEY("id"))
    `,`
    CREATE TABLE IF NOT EXISTS ProductList( 
      list_id INTEGER NOT NULL, 
      product_id INTEGER NOT NULL, 
      FOREIGN KEY("list_id") REFERENCES List("id")
      FOREIGN KEY ("product_id") REFERENCES Product("id"))
    `,`
    CREATE TABLE IF NOT EXISTS Pallet( 
      id INTEGER NOT NULL, 
      location_id INTEGER, 
      PRIMARY KEY("id"), 
      FOREIGN KEY("location_id") REFERENCES Shelf("id"))
    `,`
    CREATE TABLE IF NOT EXISTS "Pallet Item"(
      product_id INTEGER, 
      quantity INTEGER, 
      pallet_id INTEGER, 
      FOREIGN KEY("pallet_id") REFERENCES Pallet("id")
      FOREIGN KEY("product_id") REFERENCES Product("id"))
    `];

  useEffect(() => (async () => {
    if (!areTablesLoaded) {
      setAreTablesLoaded(true);
      const db = await openDB();
      await runQueries(db, createTables);
    }}), [areTablesLoaded])
}
