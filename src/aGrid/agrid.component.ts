import {
  Component, Input, Output, EventEmitter, HostListener,
  ElementRef, Renderer, ViewChild,
  ContentChildren, ContentChild, SimpleChange
} from '@angular/core';
import { aGridColumn } from './aGridColumn/agridcolumn.component';
import { aGridBottom } from './aGridBottom/agridbottom.component';

import { DomSanitizer} from '@angular/platform-browser';


import {isFinite} from 'lodash';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  selector: 'a-grid',

  templateUrl: './agrid.template.html',
  styleUrls: ['./agrid.styles.css']
})
export class aGrid {

  bodyColumns: aGridColumn[] = [];

  private updateColumns() {
    this.bodyColumns = [...this.columns._results];
  }

  //grid is rows checkable binding
  @Input() check: boolean;

  @Input() items;

  @ContentChildren(aGridColumn) columns;

  @Input() selectedProperty: string;
  selectedPropertyDefault = "aGridSelected";

  @Input() checkedProperty: string;
  checkedPropertyDefault = "aGridChecked";

  @Output() onSelectRow = new EventEmitter();

  @Output() onCheckRow = new EventEmitter();


  @ViewChild('bodyContainer') bodyContainer: ElementRef;

  private bodyHeight;

  private headerHeight=0;

  private bottomHeight=0;

  private setBodyHeight(){
    if(this.headerHeight || this.bottomHeight){
      this.bodyHeight=this.sanitizer.bypassSecurityTrustStyle(`calc(100% - ${this.headerHeight + this.bottomHeight}px)`);
    }else{
      this.bodyHeight=this.sanitizer.bypassSecurityTrustStyle("100%");
    }
  }

private headerHeightChanged(headerHeight){
  if(isFinite(headerHeight)){
    this.headerHeight=headerHeight;
    this.setBodyHeight();
  }
}

private bottomHeightChanged(bottomHeight){
  if(isFinite(bottomHeight)){
    this.bottomHeight=bottomHeight;
    this.setBodyHeight();
  }
}

  constructor(private curEl: ElementRef, private renderer: Renderer, private sanitizer:DomSanitizer) {
    this.setBodyHeight();
  }

  ngAfterContentInit() {
    this.updateColumns();
  }


  rowSelect(i) {
    //selection logic is in the source
    this.onSelectRow.next(i);
  }

  rowCheck([value, i]) {
    //check logic is in the source
    this.onCheckRow.next([value, i]);
  }

  //body scrolling
  onScroll(e, header) {
    if (e.target.scrollLeft !== header.scrollLeft) {
      this.renderer.setElementProperty(header, "scrollLeft", e.target.scrollLeft);
    }
  }

}