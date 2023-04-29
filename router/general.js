const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({
          message: `${username} was successfully registred. Now you can log in!`,
        });
    } else {
      return res.status(404).json({ message: `${username} already exists!` });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let bookISBN = req.params.isbn;
  if (books[bookISBN]) {
    return res.status(200).send(JSON.stringify(books[bookISBN]));
  }
  return res.status(404).send(`No book with ISBN ${bookISBN} is found`);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let book = Object.values(books).filter((book) =>
    book.author.toLowerCase().includes(author)
  );
  if (author && book.length > 0) {
    return res.status(200).send(JSON.stringify(book));
  }
  return res.status(404).send(`No book found with this author ${author}`);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let title = req.params.title;
  let book = Object.values(books).filter((book) =>
    book.title.toLowerCase().includes(title)
  );
  if (title && book.length > 0) {
    return res.status(200).send(JSON.stringify(book));
  }
  return res.status(404).send(`No book found with this title ${title}`);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let bookISBN = req.params.isbn;
  if (books[bookISBN]) {
    return res.status(200).send(books[bookISBN].reviews);
  }
  return res.status(404).send(`No book with ISBN ${bookISBN} is found`);
});

//^ Task 10
// public_users.get("/test", async (req, res) => {
//     axios
//       .get("http://localhost:8080/")
//       .then((data) => res.status(200).send(books))
//       .catch((err) => res.status(404).send(err));
// });

//^ Task 11
// public_users.get("/test/isbn/:isbn", async (req, res) => {
//   let bookISBN = req.params.isbn;
//   axios
//     .get("http://localhost:8080/")
//     .then((data) => res.status(200).send(books[bookISBN]))
//     .catch((err) => res.status(404).send(err));
// });

//^ Task 12
// public_users.get("/test/author/:author", async (req, res) => {
//   let author = req.params.author;
//   let book = Object.values(books).filter((book) =>
//     book.author.toLowerCase().includes(author)
//   );
//   axios
//     .get("http://localhost:8080/")
//     .then((data) => res.status(200).send(book))
//     .catch((err) => res.status(404).send(err));
// });

//^ Task 13
// public_users.get("/test/title/:title", async (req, res) => {
//   let title = req.params.title;
//   let book = Object.values(books).filter((book) =>
//     book.title.toLowerCase().includes(title)
//   );
//   axios
//     .get("http://localhost:8080/")
//     .then((data) => res.status(200).send(book))
//     .catch((err) => res.status(404).send(err));
// });

module.exports.general = public_users;
