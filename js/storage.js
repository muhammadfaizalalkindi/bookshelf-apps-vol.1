/*==============================================
  STORAGE CONFIGURATION & GLOBAL VARIABLE
==============================================*/
const STORAGE_KEY = 'BOOK_APPS';
let books = [];

/*==============================================
  FUNCTION: Check if Local Storage is Supported
==============================================*/
const checkStorage = () => {
  if (typeof(Storage) === "undefined") {
    alert('Your browser does not support web storage');
    return false;
  }
  return true;
};

/*==============================================
  FUNCTION: Save Books Data to Local Storage
==============================================*/
const saveData = () => {
  const parsedData = JSON.stringify(books);
  localStorage.setItem(STORAGE_KEY, parsedData);
  document.dispatchEvent(new Event('ondatasaved'));
};

/*==============================================
  FUNCTION: Load Books Data from Local Storage
==============================================*/
const loadDatafromStorage = () => {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data !== null) {
    books = data;
  }
  document.dispatchEvent(new Event('ondataloaded'));
};

/*==============================================
  FUNCTION: Update Data to Local Storage
==============================================*/
const updateDataToStorage = () => {
  if (checkStorage()) {
    saveData();
  }
};

/*==============================================
  FUNCTION: Compose a Book Object
==============================================*/
const composeBookObject = (bookTitle, bookAuthor, bookYear, isCompleted) => {
  return {
    id: +new Date(),
    bookTitle,
    bookAuthor,
    bookYear,
    isCompleted,
  };
};

/*==============================================
  FUNCTION: Find a Book by ID
==============================================*/
const findBook = (bookId) => {
  for (const book of books) {
    if (book.id === bookId) return book;
  }
  return null;
};

/*==============================================
  FUNCTION: Find the Index of a Book by ID
==============================================*/
const findBookIndex = (bookId) => {
  let index = 0;
  for (const book of books) {
    if (book.id === bookId) return index;
    index++;
  }
  return -1;
};

/*==============================================
  FUNCTION: Refresh Book Data on the UI
==============================================*/
const refreshDataFromBooks = () => {
  const uncompletedBookList = document.getElementById(UNCOMPLETED_BOOK_ID);
  const completedBookList = document.getElementById(COMPLETED_BOOK_ID);

  for (const book of books) {
    // Create a new book element using the makeBook() function from main.js
    const newBookElement = makeBook(book.bookTitle, book.bookAuthor, book.bookYear, book.isCompleted);
    newBookElement[BOOK_ITEMID] = book.id;

    // Append the new book element to the appropriate list
    if (book.isCompleted) {
      completedBookList.append(newBookElement);
    } else {
      uncompletedBookList.append(newBookElement);
    }
  }
};