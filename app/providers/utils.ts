import firebase from 'firebase/app';
import { Author, Book, BookList } from 'lists-core/domain';

export function docToBook(
  bookDoc: firebase.firestore.DocumentSnapshot,
  authorDoc: firebase.firestore.DocumentSnapshot,
): Book {
  const book = new Book();

  if (bookDoc.exists) {
    if (authorDoc.exists) {
      const authorData = authorDoc.data();
      const author = new Author();
      author.name = authorData!.name;
      author.id = authorDoc.id;
      book.author = author;
    }

    const bookData = bookDoc.data();
    book.description = bookData!.description;
    book.name = bookData!.name;
    if (bookData!.cover) {
      book.cover = bookData!.cover;
    }
  }

  return book;
}

export function docToBookList(
  bookList: firebase.firestore.DocumentSnapshot,
  book: firebase.firestore.DocumentSnapshot,
  author: firebase.firestore.DocumentSnapshot,
): BookList {
  const list = new BookList();
  if (bookList.exists) {
    const bookListData = bookList.data();
    list.book = docToBook(book, author);
    list.readingTarget = bookListData!.readingTarget;
    list.type = bookListData!.type;
    list.bookId = bookListData!.bookId.id;
    list.userId = bookListData!.userId.id;
    if (bookListData!.doneDate instanceof firebase.firestore.Timestamp) {
      list.doneDate = bookListData!.doneDate.toDate();
    }
  }

  return list;
}

export function bookListToDoc(bookList: BookList) {
  return {
    book: bookToDoc(bookList.book),
    bookList: {
      type: bookList.type,
      ...(bookList.readingTarget !== undefined ? { readingTarget: bookList.readingTarget } : {}),
      ...(bookList.doneDate !== undefined ? { doneDate: bookList.doneDate } : {}),
    },
  };
}

export function bookToDoc(book: Book) {
  return {
    author: book.author,
    name: book.name,
    description: book.description,
  };
}
