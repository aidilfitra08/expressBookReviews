const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const userExists = users.find((user) => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  try {
    return res.status(200).json({ books: books });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      return res.status(200).json(books[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author;
    const result = Object.values(books).filter(
      (book) => book.author === author
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json({ message: "No books found by this author" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on title
public_users.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title;
    const result = Object.values(books).find((book) => book.title === title);

    if (result) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ message: "No books found with this title" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
