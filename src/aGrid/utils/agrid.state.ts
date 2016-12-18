import {Injectable}  from '@angular/core';

@Injectable()
export class gridState {
  public startPage: Number
  constructor() {

  }
  initialize() {
    this.startPage = 1;
  }
}