import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { addToReadingList, getReadingList, ReadingListBook, removeFromReadingList } from '@tmo/books/data-access';
import {MatSnackBar, MatSnackBarRef, SimpleSnackBar} from '@angular/material/snack-bar';
import { Book } from '@tmo/shared/models';
@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store,
    private _snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    this.store.dispatch(removeFromReadingList({ item }));
  }

  openSnackBar(message: string, action: string, item: ReadingListBook) {
    const snackBarRef = this._snackBar.open(message, action);
    this.openSnackBarOnAct(snackBarRef, item);
  }

  openSnackBarOnAct(
    snackBarRef: MatSnackBarRef<SimpleSnackBar>,
    item: ReadingListBook
  ) {
    snackBarRef.onAction().subscribe((data) => {
      this.store.dispatch(
        addToReadingList({ book: item })
      );
    });
  }
}
