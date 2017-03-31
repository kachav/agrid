import { NgModule, ApplicationRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';

import { FilterPipe } from './filter.pipe';

import { AgridModule } from '../src';

@NgModule({
  imports: [
    FormsModule,
    AgridModule,
    BrowserModule
  ],
  declarations: [
    AppComponent,
    FilterPipe
  ],
  providers: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
