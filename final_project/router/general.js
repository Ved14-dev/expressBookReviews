const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 7: Register User
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ message: "User already exists!" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Task 2: Get all books
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 3: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});
  
// Task 4: Get book details based on Author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = {};
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks[key] = books[key];
    }
  }
  return res.status(200).json(matchingBooks);
});

// Task 5: Get book details based on Title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = {};
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks[key] = books[key];
    }
  }
  return res.status(200).json(matchingBooks);
});

// Task 6: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using Async-Await
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details by ISBN using Promises
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(404).json({ message: "Book not found" }));
});

// Task 12: Get book details by Author using Async-Await
public_users.get('/async/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Author not found" });
  }
});

// Task 13: Get book details by Title using Promises
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => res.status(200).json(response.data))
    .catch(error => res.status(404).json({ message: "Title not found" }));
});

module.exports.general = public_users;