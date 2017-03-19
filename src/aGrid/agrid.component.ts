import {
  Component, Input, Output, EventEmitter,
  ElementRef, ViewChild,
  ContentChildren
} from '@angular/core';
import { aGridColumn } from './aGridColumn/agridcolumn.component';

import {aGridGroup} from './aGridGroup/aGridGroup.directive';

import { DomSanitizer } from '@angular/platform-browser';

import { isFinite } from 'lodash';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  selector: 'a-grid',

  templateUrl: './agrid.template.html',
  styleUrls: ['./agrid.styles.css']
})
export class aGrid {

  bodyColumns: aGridColumn[] = [];
  bodyGroups:aGridGroup[]=[];

  private updateBodyBindings() {
    if (this.columns) {
      this.bodyColumns = [...this.columns._results];
    }
    if(this.groups){
      this.bodyGroups=[...this.groups._results];
    }
  }

  private get lastColumnResizable() {
    return !!(this.bodyColumns && this.bodyColumns.length && this.bodyColumns[this.bodyColumns.length - 1].resizable);
  }
  
  @Input() items;

  @ContentChildren(aGridColumn) columns;

  @ContentChildren(aGridGroup) groups;

  @Input() selectedProperty: string;
  selectedPropertyDefault = "aGridSelected";

  @Input() checkedProperty: string;
  checkedPropertyDefault = "aGridChecked";

  @Input() showHeader=true;

  @Output() onRowClick = new EventEmitter();

  @Output() onRowDoubleClick = new EventEmitter();

  private bodyHeight;

  private headerHeight = 0;

  private bottomHeight = 0;

  private setBodyHeight() {
    if (this.headerHeight || this.bottomHeight) {
      this.bodyHeight = this.sanitizer.bypassSecurityTrustStyle(`calc(100% - ${this.headerHeight + this.bottomHeight}px)`);
    } else {
      this.bodyHeight = this.sanitizer.bypassSecurityTrustStyle("100%");
    }
  }

  private headerHeightChanged(headerHeight) {
    if (isFinite(headerHeight)) {
      this.headerHeight = headerHeight;
      this.setBodyHeight();
    }
  }

  private bottomHeightChanged(bottomHeight) {
    if (isFinite(bottomHeight)) {
      this.bottomHeight = bottomHeight;
      this.setBodyHeight();
    }
  }

  constructor(private sanitizer: DomSanitizer) {
    this.setBodyHeight();
  }

  ngAfterContentInit() {
    this.updateBodyBindings();
  }

  ngOnChanges() {
    this.updateBodyBindings();
  }

  rowClick(row) {
    //selection logic is in the source
    this.onRowClick.next(row);
  }

  rowDoubleClick(row) {
    //check logic is in the source
    this.onRowDoubleClick.next(row);
  }

}