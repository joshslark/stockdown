import React, {useState, useEffect, useContext} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {DataContext} from '../../Provider.js';
SQLite.enablePromise(true);


// Check the database to find which product was added last
export async function useDBToGetLastID () {
  const query = `
  SELECT id FROM Product ORDER BY id DESC LIMIT 1
  `;

  try {
    const results = await runQueryWithResults(query);
    return results.rows.item(0) ? results.rows.item(0).id : -1;
  } catch (error) {
    console.warn(error);
    return -1;
  }
}

export async function useDBToSaveTitle(index, title) {
  title = title || "New List " + index;
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
    const updateResults = await runQueryWithResults(updateQuery, [title, index]);
    const selectResults = await runQueryWithResults(selectQuery, [index]);

    if (updateResults.rowsAffected === 0 && selectResults.rows.raw().length === 0) {
      await runQueryWithResults(insertQuery, [index, title]);
    }
  } catch (error) {
    console.warn(error);
  }
}

export function useDBToLoadTitle() {
  const context = useContext(DataContext);

  const loadQuery = `
  SELECT title FROM List WHERE id=? 
  `;

  useEffect(() => {
    const fetchTitle = async() => {
      try { 
        const loadResults = await runQueryWithResults(loadQuery, [context.state.curListIndex]);
        if (loadResults.rows.length > 0) {
          context.setTitle(loadResults.rows.item(0).title);
        } else {
          throw ("No title returned from database");
        }
      } catch (error) {
        context.setTitle("New List " + context.state.curListIndex);
        console.warn(error);
      }
    }
    fetchTitle();
  }, [context.state.title]);
}

export function useDBToAddBarcode() {
  const [rowsAffected, setRowsAffected] = useState(0);
  const context = useContext(DataContext);
  const selectQuery = `
  SELECT sku FROM Product ORDER BY id DESC LIMIT 1
  `;
  const insertQuery = `
  INSERT INTO Product(sku) values (?)
  `;

  useEffect(() => {
    const addBarcode = async() => {
      try { 
        const selectResults = await runQueryWithResults(selectQuery);
        const lastAddedSku = selectResults.rows.length > 0 ? selectResults.rows.item(0).sku : "";
        if (context.state.barcode !== "" && context.state.barcode != lastAddedSku) {
          context.setSkus(Array(...context.state.skus, context.state.barcode));
          console.log("Inserting sku: " + context.state.barcode);
          const insertResults = await runQueryWithResults(insertQuery, [context.state.barcode]);
          setRowsAffected(insertResults.rowsAffected);
          console.log("Inserted " + rowsAffected + " new row(s)");
        }
      } catch (error) {
        console.warn(error);
        throw(error);
      }
    }
    addBarcode();
  }, [context.state.barcode]);
}

export function useDBToGetSkus() {
  const [skus, setSkus] = useState([]);
  const [lastID, setLastID] = useState(-1);

  const context = useContext(DataContext);

  const selectQuery = `
  SELECT sku FROM Product
  `;

  useEffect(() => {
    const fetchSkus = async() => {
      const dbLastID = await useDBToGetLastID();
      if (lastID !== dbLastID) {
        try {
          const results = await runQueryWithResults(selectQuery);
          let skus = results.rows.raw().map((obj) => obj.sku);
          console.log(skus);
          context.setSkus(skus);
          setLastID(dbLastID);
        } catch (error) {
          console.warn(error);
        }
      } 
    }

    fetchSkus();
    }, [lastID]);
}

export async function deleteAllSkus() {
  const deleteQuery = `
  DELETE FROM Product
  `;
  const results = await runQueryWithResults(deleteQuery);
  console.log("Deleted " + results.rowsAffected + " rows");
}

export function useNewDB () {
  const context = useContext(DataContext);
  const createTables= [`
    CREATE TABLE IF NOT EXISTS Product(
      description TEXT, 
      id INTEGER NOT NULL,
      onhands INTEGER,
      upc INTEGER,
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
      FOREIGN KEY("list_id") REFERENCES List("id"),
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
      FOREIGN KEY("pallet_id") REFERENCES Pallet("id"),
      FOREIGN KEY("product_id") REFERENCES Product("id"))
    `];

  useEffect(() => {
    const loadTables = async () => {
      if (!context.state.areTablesLoaded) {
        context.setAreTablesLoaded(true);
        await runQueries(createTables);
      }
    };

    loadTables();
    }, [context.state.areTablesLoaded]);
}

async function openDB() {
  try {
    return await SQLite.openDatabase({name: "storage.db", location: 'Documents'});
  } catch (error) {
   console.log(error); 
  }
}

async function runQueries(queries) {
  const db = await openDB();
  await db.transaction(tx => {
    queries.forEach((query) => {
      tx.executeSql(query);
      console.log(query);
    });
  });
}

async function runQueryWithResults(query, queryArgs) {
  let results, fullQuery;
  try {
    const db = await openDB();
    await db.transaction(async (tx) => {
      const [, res] = await tx.executeSql(query, queryArgs);
      results = await res;
    });
  } catch (error) {
    console.warn(error);
    return -1;
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
