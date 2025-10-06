# PLP Bookstore MongoDB Queries README

This README explains how to run and understand the MongoDB queries for the `plp_bookstore` database, `books` collection, populated by the `insert_books.js` script. The queries demonstrate basic CRUD operations, advanced queries, aggregation pipelines, and indexing, as outlined in the provided query sets.

## Prerequisites

1. **MongoDB Installation**:

   - Ensure MongoDB is installed locally or accessible via MongoDB Atlas.
   - Local MongoDB should be running on `mongodb://localhost:27017` (default port).
   - If using Atlas, update the connection URI in `insert_books.js` with your Atlas connection string.

2. **Node.js** (for running `insert_books.js`):

   - Install Node.js (version 14 or higher recommended).
   - Install the MongoDB Node.js driver: `npm install mongodb`.

3. **MongoDB Shell or Client**:

   - Use `mongosh` (MongoDB Shell) or a client like MongoDB Compass to run the queries.
   - Alternatively, queries can be run in a MongoDB driver (e.g., Node.js, Python) or a GUI tool.

4. **Populate the Database**:

   - Run the `insert_books.js` script to populate the `plp_bookstore` database, `books` collection with 12 sample book documents:

     ```bash
     node insert_books.js
     ```
   - This script drops the existing `books` collection (if any) and inserts 12 books, including titles like "To Kill a Mockingbird," "1984," and "The Hobbit."

## Database and Collection

- **Database**: `plp_bookstore`
- **Collection**: `books`
- **Sample Document Structure** (from `insert_books.js`):

  ```javascript
  {
    title: String,
    author: String,
    genre: String,
    published_year: Number,
    price: Number,
    in_stock: Boolean,
    pages: Number,
    publisher: String
  }
  ```

## Running the Queries

The queries are organized into sections: Basic CRUD Operations, Advanced Queries, Aggregation Pipelines, and Indexing. Run them in `mongosh` or your preferred MongoDB client after connecting to the `plp_bookstore` database:

```javascript
use plp_bookstore
```

### Query 2: Basic CRUD Operations

These queries demonstrate Create, Read, Update, and Delete (CRUD) operations on the `books` collection.

1. **Find all books in a specific genre**:

   ```javascript
   db.books.find({ genre: "Fiction" })
   ```

   - **Purpose**: Retrieves all books with the specified genre.
   - **Example Output**: Returns 3 books ("To Kill a Mockingbird," "The Great Gatsby," "The Alchemist").
   - **Usage**: Replace `"Fiction"` with other genres like `"Dystopian"`, `"Fantasy"`, etc.

2. **Find books published after a certain year**:

   ```javascript
   db.books.find({ published_year: { $gt: 1950 } })
   ```

   - **Purpose**: Finds books published after the specified year.
   - **Example Output**: Returns 2 books ("To Kill a Mockingbird" \[1960\], "The Alchemist" \[1988\]).
   - **Usage**: Replace `1950` with another year, e.g., `1900`.

3. **Find books by a specific author**:

   ```javascript
   db.books.find({ author: "George Orwell" })
   ```

   - **Purpose**: Retrieves all books by the specified author.
   - **Example Output**: Returns 2 books ("1984," "Animal Farm").
   - **Usage**: Replace `"George Orwell"` with another author, e.g., `"J.R.R. Tolkien"`.

4. **Update the price of a specific book**:

   ```javascript
   db.books.updateOne(
     { title: "The Hobbit" },
     { $set: { price: 15.99 } }
   )
   ```

   - **Purpose**: Updates the price of a single book by title.
   - **Example Output**: Updates "The Hobbit" price from 14.99 to 15.99. Returns `{ modifiedCount: 1 }`.
   - **Usage**: Replace `"The Hobbit"` and `15.99` with desired title and price.

5. **Delete a book by its title**:

   ```javascript
   db.books.deleteOne({ title: "Animal Farm" })
   ```

   - **Purpose**: Deletes a single book by title.
   - **Example Output**: Deletes "Animal Farm". Returns `{ deletedCount: 1 }`.
   - **Usage**: Replace `"Animal Farm"` with another title. Re-run `insert_books.js` to restore deleted books.

### Query 3: Advanced Queries

These queries use projections, sorting, and pagination for more complex data retrieval.

1. **Find books that are both in stock and published after 2010**:

   ```javascript
   db.books.find(
     { in_stock: true, published_year: { $gt: 2010 } },
     { title: 1, author: 1, price: 1, _id: 0 }
   )
   ```

   - **Purpose**: Finds in-stock books published after 2010, returning only `title`, `author`, and `price`.
   - **Example Output**: Returns no books (none in the dataset are published after 2010).
   - **Usage**: Adjust the year (e.g., `1900`) to get results, e.g., 9 in-stock books.

2. **Sort books by price (ascending)**:

   ```javascript
   db.books.find(
     { in_stock: true },
     { title: 1, author: 1, price: 1, _id: 0 }
   ).sort({ price: 1 })
   ```

   - **Purpose**: Lists in-stock books sorted by price in ascending order.
   - **Example Output**: Returns 9 in-stock books, starting with "Pride and Prejudice" ($7.99) and ending with "The Lord of the Rings" ($19.99).
   - **Usage**: Run as-is to see sorted results.

3. **Sort books by price (descending)**:

   ```javascript
   db.books.find(
     { in_stock: true },
     { title: 1, author: 1, price: 1, _id: 0 }
   ).sort({ price: -1 })
   ```

   - **Purpose**: Lists in-stock books sorted by price in descending order.
   - **Example Output**: Returns 9 in-stock books, starting with "The Lord of the Rings" ($19.99) and ending with "Pride and Prejudice" ($7.99).
   - **Usage**: Run as-is.

4. **Implement pagination (5 books per page)**:

   ```javascript
   db.books.find(
     { in_stock: true },
     { title: 1, author: 1, price: 1, _id: 0 }
   ).sort({ price: 1 }).limit(5).skip(0)
   ```

   - **Purpose**: Displays the first page of 5 in-stock books, sorted by price ascending.
   - **Example Output**: Returns 5 books, from "Pride and Prejudice" ($7.99) to "To Kill a Mockingbird" ($12.99).
   - **Usage**: Change `skip(0)` to `skip(5)` for the next page (remaining 4 books).

### Query 4: Aggregation Pipelines

These queries use MongoDB's aggregation framework for advanced data analysis.

1. **Calculate the average price of books by genre**:

   ```javascript
   db.books.aggregate([
     {
       $group: {
         _id: "$genre",
         averagePrice: { $avg: "$price" }
       }
     }
   ])
   ```

   - **Purpose**: Computes the average price of books for each genre.
   - **Example Output**:

     ```javascript
     [
       { "_id": "Romance", "averagePrice": 7.99 },
       { "_id": "Political Satire", "averagePrice": 8.5 },
       { "_id": "Gothic Fiction", "averagePrice": 9.99 },
       { "_id": "Fiction", "averagePrice": 10.656666666666666 },
       { "_id": "Dystopian", "averagePrice": 11.245 },
       { "_id": "Adventure", "averagePrice": 12.5 },
       { "_id": "Fantasy", "averagePrice": 17.49 }
     ]
     ```
   - **Usage**: Run as-is to see average prices per genre.

2. **Find the author with the most books**:

   ```javascript
   db.books.aggregate([
     {
       $group: {
         _id: "$author",
         bookCount: { $sum: 1 }
       }
     },
     {
       $sort: { bookCount: -1 }
     },
     {
       $limit: 1
     }
   ])
   ```

   - **Purpose**: Identifies the author with the most books in the collection.
   - **Example Output**:

     ```javascript
     [ { "_id": "J.R.R. Tolkien", "bookCount": 2 } ]
     ```
   - **Usage**: Run as-is. J.R.R. Tolkien has 2 books ("The Hobbit," "The Lord of the Rings").

3. **Group books by publication decade**:

   ```javascript
   db.books.aggregate([
     {
       $addFields: {
         decade: {
           $subtract: [
             "$published_year",
             { $mod: ["$published_year", 10] }
           ]
         }
       }
     },
     {
       $group: {
         _id: "$decade",
         bookCount: { $sum: 1 }
       }
     },
     {
       $sort: { _id: 1 }
     }
   ])
   ```

   - **Purpose**: Counts books by their publication decade.
   - **Example Output**:

     ```javascript
     [
       { "_id": 1810, "bookCount": 1 }, // Pride and Prejudice (1813)
       { "_id": 1840, "bookCount": 1 }, // Wuthering Heights (1847)
       { "_id": 1850, "bookCount": 1 }, // Moby Dick (1851)
       { "_id": 1920, "bookCount": 1 }, // The Great Gatsby (1925)
       { "_id": 1930, "bookCount": 2 }, // Brave New World (1932), The Hobbit (1937)
       { "_id": 1940, "bookCount": 2 }, // 1984 (1949), Animal Farm (1945)
       { "_id": 1950, "bookCount": 2 }, // The Catcher in the Rye (1951), The Lord of the Rings (1954)
       { "_id": 1960, "bookCount": 1 }, // To Kill a Mockingbird (1960)
       { "_id": 1980, "bookCount": 1 }  // The Alchemist (1988)
     ]
     ```
   - **Usage**: Run as-is to see book counts per decade.

### Query 5: Indexing

These queries create indexes and demonstrate their performance impact.

1. **Create an index on the** `title` **field**:

   ```javascript
   db.books.createIndex({ title: 1 });
   ```

   - **Purpose**: Creates an ascending index on `title` for faster searches by title.
   - **Usage**: Run once to create the index. Verify with `db.books.getIndexes()`.

2. **Create a compound index on** `author` **and** `published_year`:

   ```javascript
   db.books.createIndex({ author: 1, published_year: 1 });
   ```

   - **Purpose**: Creates a compound index for queries filtering on `author` and/or `published_year`.
   - **Usage**: Run once to create the index. Verify with `db.books.getIndexes()`.

3. **Demonstrate performance improvement with** `explain()`:

   - **For the** `title` **index**:

     ```javascript
     db.books.find({ title: "The Hobbit" }).explain("executionStats");
     ```

     - **Purpose**: Shows how the `title` index improves query performance.
     - **Example Output (Key Parts)**:

       ```javascript
       {
         "queryPlanner": {
           "winningPlan": {
             "stage": "FETCH",
             "inputStage": {
               "stage": "IXSCAN",
               "keyPattern": { "title": 1 },
               "indexName": "title_1"
             }
           }
         },
         "executionStats": {
           "nReturned": 1,
           "totalKeysExamined": 1,
           "totalDocsExamined": 1,
           "executionTimeMillis": ... // Lower due to index
         }
       }
       ```
     - **Comparison**: Without the index (use `hint({ $natural: 1 })`), it performs a `COLLSCAN`, examining all 12 documents (`totalDocsExamined: 12`).

   - **For the compound index**:

     ```javascript
     db.books.find({ author: "George Orwell", published_year: { $gt: 1940 } }).explain("executionStats");
     ```

     - **Purpose**: Shows how the compound index optimizes queries on `author` and `published_year`.
     - **Example Output (Key Parts)**:

       ```javascript
       {
         "queryPlanner": {
           "winningPlan": {
             "stage": "FETCH",
             "inputStage": {
               "stage": "IXSCAN",
               "keyPattern": { "author": 1, "published_year": 1 },
               "indexName": "author_1_published_year_1"
             }
           }
         },
         "executionStats": {
           "nReturned": 2,
           "totalKeysExamined": 2,
           "totalDocsExamined": 2,
           "executionTimeMillis": ... // Lower due to index
         }
       }
       ```
     - **Comparison**: Without the index, it performs a `COLLSCAN`, examining all 12 documents.