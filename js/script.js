const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';
const DELETE_EVENT = 'delete-bookshelf';
const STORAGE_KEY = 'BOOKSHELF-KEY';
let bookIdentity;
 
function generateBookId() {
  return +new Date();
}
 
function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete
  }
}
 
function findBook(bookId) {
  for (const bookItem of bookshelf) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
 
function findBookIndex(bookId) {
  for (const index in bookshelf) {
    if (bookshelf[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
 
function makeBook(bookObject) {
  const {id, title, author, year, isComplete} = bookObject;
 
  const bookTitle = document.createElement('h3');
  bookTitle.innerText = title;
 
  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = "Penulis : " + author;

  const bookYear = document.createElement('p');
  bookYear.innerText = "Tahun : " + year;
 
  const bookContainer = document.createElement('div');
  bookContainer.classList.add('description');
  bookContainer.append(bookTitle, bookAuthor, bookYear);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-container');
 
  const container = document.createElement('div');
  container.classList.add('book-item')
  container.append(bookContainer, buttonContainer);
  container.setAttribute('id', `todo-${id}`);

 
  if (isComplete) {
    const undoButton = document.createElement('i');
    undoButton.classList.add('undo-button');
    undoButton.classList.add('fa-regular');
    undoButton.classList.add('fa-square-minus');
    undoButton.classList.add('fa-2x');
    undoButton.addEventListener('mouseover', function () {
      undoButton.classList.add('fa-solid');
    })
    undoButton.addEventListener('mouseleave', function () {
      undoButton.classList.remove('fa-solid');
    })
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(id);
    });
 
    const removeButton = document.createElement('i');
    removeButton.classList.add('remove-button');
    removeButton.classList.add('fa-regular');
    removeButton.classList.add('fa-rectangle-xmark');
    removeButton.classList.add('fa-2x');
    removeButton.addEventListener('mouseover', function () {
      removeButton.classList.add('fa-solid');
    })
    removeButton.addEventListener('mouseleave', function () {
      removeButton.classList.remove('fa-solid');
    })
    removeButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    const editButton = document.createElement('i');
    editButton.classList.add('edit-button');
    editButton.classList.add('fa-solid');
    editButton.classList.add('fa-pen-to-square');
    editButton.classList.add('fa-2x');
    editButton.addEventListener('click', function () {
      editTask(id);
    });
 
    buttonContainer.append(undoButton, removeButton, editButton);
  } else {
    const doneButton = document.createElement('i');
    doneButton.classList.add('done-button');
    doneButton.classList.add('fa-regular');
    doneButton.classList.add('fa-square-check');
    doneButton.classList.add('fa-2x');
    doneButton.addEventListener('mouseover', function () {
      doneButton.classList.add('fa-solid');
    })
    doneButton.addEventListener('mouseleave', function () {
      doneButton.classList.remove('fa-solid');
    })
    doneButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const removeButton = document.createElement('i');
    removeButton.classList.add('remove-button');
    removeButton.classList.add('fa-regular');
    removeButton.classList.add('fa-rectangle-xmark');
    removeButton.classList.add('fa-2x');
    removeButton.addEventListener('mouseover', function () {
      removeButton.classList.add('fa-solid');
    })
    removeButton.addEventListener('mouseleave', function () {
      removeButton.classList.remove('fa-solid');
    })
    removeButton.addEventListener('click', function () {
      removeTaskFromCompleted(id);
    });

    const editButton2 = document.createElement('i');
    editButton2.classList.add('edit-button');
    editButton2.classList.add('fa-solid');
    editButton2.classList.add('fa-pen-to-square');
    editButton2.classList.add('fa-2x');
    editButton2.addEventListener('click', function () {
      editTask(id);
    });
 
    buttonContainer.append(doneButton, removeButton, editButton2);
  }
  return container;
}

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung storage');
    return false;
  }
  return true;
}

function loadStorage() {
  const stringData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(stringData);
 
  if (data !== null) {
    for (const books of data) {
      bookshelf.push(books);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveBookData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelf);
    localStorage.setItem(STORAGE_KEY, parsed);
  }
}
 
function addBook() {
  const titleBook = document.getElementById('bookTitle').value;
  const authorBook = document.getElementById('bookAuthor').value;
  const yearBook = document.getElementById('bookYear').value;
  const bookIsComplete = document.getElementById('bookComplete').checked;
 
  const generatedID = generateBookId();
  const bookshelfObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, bookIsComplete)
  bookshelf.push(bookshelfObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}
 
function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
 
   bookTarget.isComplete = true;
   document.dispatchEvent(new Event(RENDER_EVENT));
   saveBookData();
}
 
function removeTaskFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  bookIdentity = findBook(bookId);
  if (bookTarget === -1) return;
 
  bookshelf.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
  document.dispatchEvent(new Event(DELETE_EVENT));
}
 
function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;
 
  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBookData();
}

function editTask(bookId) {
  (async () => {
    const bookTarget = findBook(bookId);
     if (bookTarget == null) return;

    const { value: formValues } = await Swal.fire({
      title: 'Edit Buku',
      html:
        '<label for="swal2-input">Masukkan judul baru</label>' +
        '<input id="swal-input1" class="swal2-input">' + '<br>' +
        '<label for="swal2-input">Masukkan penulis baru</label>' +
        '<input id="swal-input2" class="swal2-input">' + '<br>' +
        '<label for="swal3-input">Masukkan tahun baru</label>' +
        '<input id="swal-input3" class="swal2-input">',
      focusConfirm: false,
      confirmButtonText: 'Ok',
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
        ]
      }
    })
    
    if (formValues) {
      bookTarget.title = String(formValues[0]);
      bookTarget.author = String(formValues[1]);
      bookTarget.year = Number(formValues[2]);
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBookData();
  })()
}

function renderSearch() {
  let searchValue = document.getElementById('searchBookTitle').value;
  const uncompletedBookshelf = document.getElementById('justAddedBooks');
  const completedBookshelf = document.getElementById('justCompletedBooks');
  
  uncompletedBookshelf.innerHTML = '';
  completedBookshelf.innerHTML = '';
  document.getElementById('searchLabel').innerText = 'Mencari "' + searchValue + '"';
   
  for (const book of bookshelf) {
    let bookTitleUp = book.title.toUpperCase();
    let bookSearchUp = searchValue.toUpperCase();
    if(bookTitleUp.includes(bookSearchUp)){
      const bookElement = makeBook(book);
      console.log(bookElement);
      if (book.isComplete) {
        completedBookshelf.append(bookElement);
      } else {
        uncompletedBookshelf.append(bookElement);
      }
    }   
  }
}
 
document.addEventListener('DOMContentLoaded', function () {
  const submittedForm = document.getElementById('form_input');
  const searchedForm = document.getElementById('form_search');
 
  submittedForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  searchedForm.addEventListener('submit', function (event) {
    event.preventDefault();
    renderSearch();
    document.getElementById('searchBookTitle').value = '';
  });

  if (isStorageExist()) {
    loadStorage();
  }
});

document.addEventListener(DELETE_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
    const nowYear = new Date().getFullYear();
    const selisihYear = nowYear-bookIdentity.year;

    Swal.fire({
      icon: 'info',
      title: 'Notice',
      html: `Anda menghapus buku berjudul ${bookIdentity.title} \u{1F615} <br>
             Fun Fact : Buku ini keluar ${selisihYear} tahun yang lalu \u{2728}`,
    });
});
 
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookshelf = document.getElementById('justAddedBooks');
  const completedBookshelf = document.getElementById('justCompletedBooks');

  uncompletedBookshelf.innerHTML = '';
  completedBookshelf.innerHTML = '';
 
  for (const book of bookshelf) {
    const bookElement = makeBook(book);
    console.log(bookElement);
    if (book.isComplete) {
      completedBookshelf.append(bookElement);
    } else {
      uncompletedBookshelf.append(bookElement);
    }
  }
});