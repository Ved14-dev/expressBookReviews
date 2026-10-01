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

// Task 2: Get all books directly
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 3: Get book details based on ISBN directly
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({ message: "Book not found" });
});
  
// Task 4: Get book details based on Author directly
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = {};
  for (let key in books) {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      matchingBooks[key] = books[key];
    }
  }
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found for this author" });
});

// Task 5: Get book details based on Title directly
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = {};
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks[key] = books[key];
    }
  }
  if (Object.keys(matchingBooks).length > 0) {
    return res.status(200).json(matchingBooks);
  }
  return res.status(404).json({ message: "No books found with this title" });
});

// Task 6: Get book review directly
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Task 10: Get all books using Async-Await with Axios
public_users.get('/async/books', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list asynchronously", error: error.message });
  }
});

// Task 11: Get book details by ISBN using Promise callbacks with Axios
public_users.get('/async/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({ message: "Book not found by ISBN", error: error.message });
    });
});

// Task 12: Get book details by Author using Async-Await with Axios
public_users.get('/async/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(404).json({ message: "Author not found", error: error.message });
  }
});

// Task 13: Get book details by Title using Promise callbacks with Axios
public_users.get('/async/title/:title', function (req, res) {
  const title = req.params.title;
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      return res.status(200).json(response.data);
    })
    .catch(error => {
      return res.status(404).json({ message: "Title not found", error: error.message });
    });
});

module.exports.general = public_users;