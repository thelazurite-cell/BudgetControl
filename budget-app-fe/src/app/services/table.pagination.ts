import {EventEmitter} from '@angular/core';

export class TablePagination {
  public currentPage: number = 0;
  private _pageSize: number = 20;
  public totalRows: number = 0;
  public sizeChanged: EventEmitter<void> = new EventEmitter<void>();

  public get pageSize(): number {
    return this._pageSize;
  }

  public set pageSize(value: number) {
    this._pageSize = value;
    this.sizeChanged.emit();
  }

  public get pages(): number {
    return this.totalRows / this.pageSize;
  }

  public getCurrentStart(): number {
    return this.currentPage * this.pageSize;
  }

  public getEnd(): number {
    let desired = (this.pageSize * this.currentPage) + (this.pageSize);
    if (desired > this.totalRows)
      return this.totalRows;
    return desired;
  }
}
