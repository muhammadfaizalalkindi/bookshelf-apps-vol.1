/*==============================================
  GLOBAL VARIABLES & SELECTORS
==============================================*/
const modal = document.querySelector('#modal');
const addButton = document.getElementById('add-book');
const closeModal = document.getElementById('close');

const UNCOMPLETED_BOOK_ID = "unread";
const COMPLETED_BOOK_ID = "read";
const BOOK_ITEMID = "itemId"; // Property to store the book's ID

/*==============================================
  FUNCTION: Add a New Book
==============================================*/
const addBook = () => {
  // Retrieve values from form inputs
  const uncompletedBook = document.getElementById(UNCOMPLETED_BOOK_ID);
  const inputTitle = document.getElementById('title').value;
  const inputAuthor = document.getElementById('author').value;
  const inputYear = document.getElementById('year').value;

  // Create a book element and a book object (object definition is in storage.js)
  const bookElement = makeBook(inputTitle, inputAuthor, inputYear, false);
  const bookObject = composeBookObject(inputTitle, inputAuthor, inputYear, false);

  // Link the book element with the book object's ID and add it to the global books array
  bookElement[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);

  // Append the new book element to the "unread" list and update storage
  uncompletedBook.append(bookElement);
  updateDataToStorage();
};

/*==============================================
  FUNCTION: Create a Book Element
==============================================*/
const makeBook = (title, author, year, isCompleted) => {
  // Create an image element and set the source based on the book's status
  const image = document.createElement('img');
  image.setAttribute('src', isCompleted ? 'assets/img/read.jpg' : 'assets/img/unread.jpg');

  // Container for the book image
  const imageBook = document.createElement('div');
  imageBook.classList.add('image-book');
  imageBook.append(image);

  // Create elements for title, author, and year
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;

  const authorName = document.createElement('p');
  authorName.innerText = author;

  const bookYear = document.createElement('small');
  bookYear.innerText = `${year}`;

  // Container for book details
  const detail = document.createElement('div');
  detail.classList.add('detail-book');
  detail.append(bookTitle, authorName, bookYear);

  // Main container for the book
  const container = document.createElement('div');
  container.classList.add('my-container');
  container.append(imageBook, detail);

  // Append action buttons based on the book's status
  if (isCompleted) {
    container.append(createUnreadButton(), createTrashButton());
  } else {
    container.append(createReadButton(), createTrashButton());
  }

  return container;
};

/*==============================================
  FUNCTION: Create a Button with an Event Listener
==============================================*/
const createButton = (buttonTypeClass, eventListener) => {
  const button = document.createElement('button');
  button.classList.add(buttonTypeClass);
  button.addEventListener("click", (event) => {
    eventListener(event);
  });
  return button;
};

/*==============================================
  BUTTON: Mark Book as Read
==============================================*/
const createReadButton = () => {
  return createButton("read-button", (event) => {
    addBookToCompleted(event.target.parentElement);
  });
};

/*==============================================
  FUNCTION: Move Book to the "Read" List
==============================================*/
const addBookToCompleted = (bookElement) => {
  const bookCompleted = document.getElementById(COMPLETED_BOOK_ID);

  // Retrieve book data from the existing element
  const bookTitle = bookElement.querySelector(".detail-book > h3").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;

  // Create a new book element with the completed status
  const newBook = makeBook(bookTitle, bookAuthor, bookYear, true);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;

  // Append the new book to the "read" list and remove the old element
  bookCompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
};

/*==============================================
  FUNCTION: Remove a Book from the List
==============================================*/
const removeBookFromCompleted = (bookElement) => {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);
  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
};

/*==============================================
  BUTTON: Delete Book Button
==============================================*/
const createTrashButton = () => {
  return createButton("trash-book", (event) => {
    removeBookFromCompleted(event.target.parentElement);
  });
};

/*==============================================
  FUNCTION: Move Book Back to "Unread" (Undo)
==============================================*/
const undoBookFromCompleted = (bookElement) => {
  const listUncompleted = document.getElementById(UNCOMPLETED_BOOK_ID);

  // Retrieve book data from the existing element
  const bookTitle = bookElement.querySelector(".detail-book > h3").innerText;
  const bookAuthor = bookElement.querySelector(".detail-book > p").innerText;
  const bookYear = bookElement.querySelector(".detail-book > small").innerText;

  // Create a new book element with the uncompleted status
  const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
  const book = findBook(bookElement[BOOK_ITEMID]);
  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;

  // Append the new book to the "unread" list and remove the old element
  listUncompleted.append(newBook);
  bookElement.remove();

  updateDataToStorage();
};

/*==============================================
  BUTTON: Undo Button (Return Book to Unread)
==============================================*/
const createUnreadButton = () => {
  return createButton("unread-button", (event) => {
    undoBookFromCompleted(event.target.parentElement);
  });
};

/*==============================================
  FUNCTION: Update the Book Count in the UI
==============================================*/
const booksLength = () => {
  const bookCount = document.getElementById('jumlahBuku');
  bookCount.innerText = books.length;
};

/*==============================================
  EVENT LISTENERS: Modal & Form Submission
==============================================*/
// Open modal when the add button is clicked
addButton.addEventListener("click", () => {
  modal.classList.toggle("modal-open");
});

// Close modal when the close button is clicked
closeModal.addEventListener("click", () => {
  modal.style.transition = '1s';
  modal.classList.toggle("modal-open");
});

// Initialize events once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    modal.classList.remove("modal-open");
    addBook();
  });

  // Check and load data from local storage if available
  if (checkStorage()) {
    loadDatafromStorage();
  }
});

// Update the book count when data is saved or loaded
document.addEventListener("ondatasaved", () => {
  console.log("Data saved successfully.");
  booksLength();
});

document.addEventListener("ondataloaded", () => {
  refreshDataFromBooks();
  booksLength();
});