import React, {useState, useEffect, useContext} from 'react';
import SQLite from 'react-native-sqlite-storage';
import {DataContext} from '../../Provider.js';
import {Product} from './Product';
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
  }, [context.state.curListIndex]);
}

export async function useDBToUpdateProduct(unsavedProduct) {
  const updateQuery = `
  UPDATE Product
  SET description=?, sku=?, upc=?, onhands=?, location_id=?
  where id=?
  `;
  const newShelfQuery = `
  INSERT INTO Shelf(name) values (?)
  `;
  const checkForShelfQuery = `
  SELECT id, name from Shelf WHERE name=?
  `;

  try {
    const shelfResults = await runQueryWithResults(checkForShelfQuery, [
      unsavedProduct.location]);

    if (shelfResults.rows.length === 0) {
      const createShelfResults = await runQueryWithResults(newShelfQuery, [
        unsavedProduct.location]);
    }

    const amendedShelfResults = await runQueryWithResults(checkForShelfQuery, [
      unsavedProduct.location]);

    const updateResults = await runQueryWithResults(updateQuery, [
      unsavedProduct.description,
      unsavedProduct.sku,
      unsavedProduct.upc,
      unsavedProduct.onhands,
      amendedShelfResults.rows.item(0).id,
      unsavedProduct.id]);

  } catch (error) {
    console.warn(error);
  }
}

export function useDBToAddBarcode() {
  const [rowsAffected, setRowsAffected] = useState(0);
  const context = useContext(DataContext);
  const selectQuery = `
  SELECT sku FROM Product ORDER BY id DESC LIMIT 1
  `;
  const selectProductQuery = `
  SELECT * FROM Product where sku=?
  `;

  const listCheckQuery = `
  SELECT Product.id FROM Product 
  JOIN ProductList 
  ON Product.id = ProductList.product_id
  WHERE ProductList.list_id=?
  AND Product.sku=?
  `;

  const insertQuery = `
  INSERT INTO Product(description, sku, upc, onhands, location_id) values (?, ?, ?, 0, 0)
  `;
  const initShelfQuery = `
  INSERT INTO Shelf(id,name) values (0, "00-000")
  `;

  const insertListQuery = `
  INSERT INTO ProductList(product_id, list_id) values (?, ?)
  `;

  useEffect(() => {
    const addBarcode = async() => {
      try { 
        await runQueryWithResults(initShelfQuery);

        // Do we have a product with this sku?
        const selectProductResults = await runQueryWithResults (
          selectProductQuery,
          [context.state.barcode]);

        // Is this product sku already in the current list?
        const listCheckResults = await runQueryWithResults(listCheckQuery, [
            context.state.barcode,
            context.state.curListIndex
          ]);
        
        const dbProduct = new Product();

        if (selectProductResults.rows.length === 1) {

          Object.assign(dbProduct, selectProductResults.rows.item(0));

          if (listCheckResults.rows.length > 0) {
            // Sku found in current list
            // Highlight sku somehow
          } else {
            context.addProduct(dbProduct);
            await runQueryWithResults(insertListQuery, [
              dbProduct.id,
              context.state.curListIndex]);
          }

        } else {
          
          if (context.state.barcode !== "") {
              dbProduct.sku = context.state.barcode;
              console.log("Inserting product with sku: " + context.state.barcode);
              const insertResults = await runQueryWithResults(insertQuery, [
                dbProduct.description,
                dbProduct.sku,
                dbProduct.upc
              ]);
              setRowsAffected(insertResults.rowsAffected);
              const selectProductResults = await runQueryWithResults (
                selectProductQuery,
                [context.state.barcode]);
              dbProduct.id = selectProductResults.rows.item(0).id
              context.addProduct(dbProduct);
              await runQueryWithResults(insertListQuery, [
                dbProduct.id,
                context.state.curListIndex]);
          }
        }
        context.setLastID(-1);
      } catch (error) {
        console.warn(error);
        throw(error);
      }
    }
    addBarcode();
  }, [context.state.barcode]);
}

export function useDBToGetProducts() {
  const context = useContext(DataContext);
  const [prevListIndex, setPrevListIndex] = useState(-1);

  const selectQuery = `
  SELECT Product.id, description, sku, upc, onhands, Shelf.name AS location FROM Product
  JOIN ProductList 
  ON Product.id=ProductList.product_id
  JOIN Shelf
  ON Shelf.id=Product.location_id
  WHERE ProductList.list_id=?
  `;

  useEffect(() => {
    const fetchSkus = async() => {
      const dbLastID = await useDBToGetLastID();
      if (context.state.lastID !== dbLastID 
        || context.state.curListIndex !== prevListIndex) {
        try {
          const results = await runQueryWithResults(selectQuery,
          [context.state.curListIndex]);
          const products = results.rows.raw().map((source) => {
            const target = new Product();
            Object.assign(target, source);
            return target;
          });
          console.log(products);
          context.setProducts(products);
          context.setLastID(dbLastID);
          setPrevListIndex(context.state.curListIndex);
        } catch (error) {
          console.warn(error);
        }
      } 
    }

    fetchSkus();
    }, [context.state.lastID, context.state.products, context.state.curListIndex]);
}

export async function deleteAllProducts() {
  const deleteQuery = `
  DELETE FROM Product
  `;
  const results = await runQueryWithResults(deleteQuery);
  console.log("Deleted " + results.rowsAffected + " rows");
}

export async function deleteListContents(listIndex) {
  const deleteQuery = `
  DELETE FROM ProductList WHERE list_id=?
  `
  const results = await runQueryWithResults(deleteQuery, [listIndex]);
}

export function useNewDB () {
  const context = useContext(DataContext);
  const createTables= [`
    CREATE TABLE IF NOT EXISTS Product(
      description TEXT, 
      id INTEGER NOT NULL,
      onhands INTEGER,
      upc TEXT,
      sku TEXT,
      location_id integer,
      FOREIGN KEY ("location_id") REFERENCES Shelf("id"),
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
      FOREIGN KEY ("product_id") REFERENCES Product("id"),
      PRIMARY KEY("list_id", "product_id"))
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
   console.warn(error); 
  }
}

async function closeDB() {
  try {
    const db = await openDB();
    await db.close();
    console.log("Database closed");
  } catch (error) {
    console.warn(error);
  }
}

async function runQueries(queries) {
  const db = await openDB();
  await db.transaction(tx => {
    queries.forEach(async (query) => {
      tx.executeSql(query);
      console.log(query);
    });
  });
  await closeDB();
}

async function runQueryWithResults(query, queryArgs) {
  let results, fullQuery;
  try {
    const db = await openDB();
    await db.transaction(async (tx) => {
      const [, res] = await tx.executeSql(query, queryArgs);
      results = await res;
    });
    await closeDB();
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
