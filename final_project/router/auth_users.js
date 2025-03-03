const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const SECRET_KEY = "your_secret_key";
const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ message: "Unauthorized. No token provided" });
  }

  jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate a JWT token for the session
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update the review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn] || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  delete books[isbn].reviews[username];

  return res
    .status(200)
    .json({
      message: "Review deleted successfully",
      reviews: books[isbn].reviews,
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
