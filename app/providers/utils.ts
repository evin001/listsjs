import firebase from 'firebase/app';
import { Book, BookList } from 'lists-core/domain';

export function docToBook(data?: firebase.firestore.DocumentData): Book {
  const book = new Book();
  if (data) {
    book.author = data.author;
    book.description = data.description;
    book.name = data.name;
    if (data.cover) {
      book.cover = data.cover;
    }
  }
  return book;
}

export function docToBookList(
  bookList?: firebase.firestore.DocumentData,
  book?: firebase.firestore.DocumentData,
): BookList {
  const list = new BookList();
  if (bookList) {
    list.book = docToBook(book);
    list.readingTarget = bookList.readingTarget;
    list.type = bookList.type;
    list.bookId = bookList.bookId.id;
    list.userId = bookList.userId.id;
    if (bookList.doneDate instanceof firebase.firestore.Timestamp) {
      list.doneDate = bookList.doneDate.toDate();
    }
  }
  return list;
}

export function bookListToDoc(bookList: BookList) {
  return {
    book: {
      author: bookList.book.author,
      name: bookList.book.name,
      description: bookList.book.description,
    },
    bookList: {
      type: bookList.type,
      ...(bookList.readingTarget !== undefined ? { readingTarget: bookList.readingTarget } : {}),
      ...(bookList.doneDate !== undefined ? { doneDate: bookList.doneDate } : {}),
    },
  };
}
