--Query 2: Basic CRUD Operations

//Find all books in a specific genre
db.books.find({ genre: "genre type" })

//Find books published after a certain year
db.books.find({ published_year: { $gt: 'year' } })

//Find books by a specific author
db.books.find({ author: "author" })

//Update the price of a specific book
db.books.updateOne(
  { title: "book title" },
  { $set: { price: 'amount' } }
)

//Delete a book by its title
db.books.deleteOne({ title: "book title" })

--Query 3: Advanced Queries

//Find books that are both in stock and published after 2010
db.books.find(
  { in_stock: true, published_year: { $gt: 2010 } },
  { title: 1, author: 1, price: 1, _id: 0 }
)

 //Use projection to return only the title, author, and price fields in your queries
//Implement sorting to display books by price (both ascending and descending)
--Ascending
db.books.find(
  { in_stock: true },
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 })

--Desending
db.books.find(
  { in_stock: true },
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: -1 })

//`limit` and `skip` methods to implement pagination (5 books per page)
db.books.find(
  { in_stock: true },
  { title: 1, author: 1, price: 1, _id: 0 }
).sort({ price: 1 }).limit(5).skip(0)

--Query 4: Aggregation Pipeline

//aggregation pipeline to calculate the average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
])

//aggregation pipeline to find the author with the most books in the collection
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

//pipeline that groups books by publication decade and counts them
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

--Query 5: Indexing

//An index on the `title` field for faster searches
db.books.createIndex({ title: 1 });

//A compound index on `author` and `published_year`
db.books.createIndex({ author: 1, published_year: 1 });

//The `explain()` method used to demonstrate the performance improvement with your indexes
db.books.find({ title: "title" }).explain("executionStats");

db.books.find({ author: "author", published_year: { $gt: year } }).explain("executionStats");