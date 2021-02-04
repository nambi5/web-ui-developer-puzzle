import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks, getBooksError, removeFromReadingList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import {MatSnackBar} from '@angular/material/snack-bar';
@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });
  loadingError: string;

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });
    this.store.select(getBooksError).subscribe(loadError => {
      this.loadingError = loadError;
    });
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchTerm) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  openSnackBar(message: string, action: string,item:ReadingListBook) {
    let snackBarRef = this._snackBar.open(message, action);
    snackBarRef.onAction().subscribe(
      (data)=>{
        console.log(data);
        this.store.dispatch(removeFromReadingList({ item:{...item,bookId:item.id} }));
      }
    )
  }

}
