import {
  Component, Input, Output, EventEmitter,
  ElementRef, ViewChild, ViewEncapsulation,
  ContentChildren, ContentChild, QueryList, ViewChildren
} from '@angular/core';
import { AGridColumnComponent, UNIT_PERC,UNIT_PX } from './aGridColumn/agridcolumn.component';

import { AGridGroupDirective } from './aGridGroup/aGridGroup.directive';

import { DomSanitizer } from '@angular/platform-browser';

import { isFinite } from 'lodash';
import { AGridDetailDirective } from './aGridDetail/aGridDetail.directive';

@Component({
  selector: 'a-grid',
  templateUrl: './agrid.template.html',
  styleUrls: ['./agrid.styles.css'],
  encapsulation: ViewEncapsulation.None
})
export class AGridComponent {

  @Input() public items;

  @Input() public showHeader = true;

  @Output() public onRowClick = new EventEmitter();

  @Output() public onRowDoubleClick = new EventEmitter();

  @Output() public onBodyScroll = new EventEmitter();

  @Input() public selectedProperty: string;

  @Input() public checkedProperty: string;

  @ContentChildren(AGridColumnComponent) private columns:QueryList<AGridColumnComponent>;

  @ContentChild(AGridGroupDirective) private group;

  @ContentChild(AGridDetailDirective) private detail;

  @ViewChildren('colElement') private colElements:QueryList<ElementRef>;

  @ViewChild('bodyContainer') private bodyContainer:ElementRef;
  
  @ViewChild('headerContainer') private headerContainer:ElementRef;

  public selectedPropertyDefault = 'aGridSelected';

  public checkedPropertyDefault = 'aGridChecked';

  public bodyColumns: AGridColumnComponent[] = [];

  public bodyHeight;

  public headerHeight = 0;

  public bottomHeight = 0;

  public minWidthTable:string;

  public minWidthBody:string;

  private headerPaddingRightValue=0;

  public headerPaddingRight:string;

  constructor(private sanitizer: DomSanitizer) {
    this.setBodyHeight();
  }

  public ngAfterContentInit() {
    this.updateBodyBindings();

  }

  public ngOnChanges() {
    this.updateBodyBindings();
  }

  public rowClick(row) {
    // selection logic is in the source
    this.onRowClick.next(row);
  }

  public rowDoubleClick(row) {
    // check logic is in the source
    this.onRowDoubleClick.next(row);
  }

  private setBodyHeight() {
    if (this.headerHeight || this.bottomHeight) {
      this.bodyHeight = this.sanitizer
        .bypassSecurityTrustStyle(`calc(100% - ${this.headerHeight + this.bottomHeight}px)`);
    } else {
      this.bodyHeight = null;
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

  private updateBodyBindings() {
    if (this.columns) {
      this.bodyColumns = [...this.columns.toArray()];
    }
  }

  private get lastColumnResizable() {
    return !!(this.bodyColumns && this.bodyColumns.length &&
      this.bodyColumns[this.bodyColumns.length - 1].resizable);
  }

  private calculateMinWidth(){
    let width = 0;
    let percentWidth = 0;
    let columnsArray = this.columns.toArray();
    this.colElements.forEach((col, index)=>{
      if(columnsArray[index] && columnsArray[index].widthUnit===UNIT_PERC){
        percentWidth+=col.nativeElement.offsetWidth;
      }else{
        width += col.nativeElement.offsetWidth;
      }
    });
    if (width+percentWidth>this.bodyContainer.nativeElement.offsetWidth){
      let bodyWidth:any = '';
      let tableWidth:any = '';
      let percentWidthHeader = (percentWidth/this.bodyContainer.nativeElement.offsetWidth)*100;

      percentWidth = (percentWidth/this.bodyContainer.nativeElement.clientWidth)*100;

      if(width && percentWidth){
        
        bodyWidth = this.sanitizer
          .bypassSecurityTrustStyle(`calc(${percentWidth}% + ${width}px)`);
        tableWidth = this.sanitizer
          .bypassSecurityTrustStyle(`calc(${percentWidthHeader}% + ${width + this.headerPaddingRightValue}px)`);
      }else if(percentWidth){
        bodyWidth = `${percentWidth}%`;
        tableWidth = this.sanitizer
          .bypassSecurityTrustStyle(`calc(${percentWidthHeader}% + ${this.headerPaddingRightValue}px)`);
      }else{
        bodyWidth = `${width}px`;
        tableWidth = `${width + this.headerPaddingRightValue}px`;
      }
      this.minWidthBody = bodyWidth
      this.minWidthTable = tableWidth;
    }else{
      this.minWidthBody=null;
      this.minWidthTable = null;
    }
  }

  public columnResizeStart(){
    this.bodyColumns.forEach(col=>{
      col.widthChangeStart(this.bodyContainer.nativeElement.clientWidth);
    });
    this.calculateMinWidth();
  }

  public columnResizeEnd(){
    this.bodyColumns.forEach(col=>{
      col.widthChanged(this.bodyContainer.nativeElement.clientWidth);
    });
    this.calculateMinWidth();
  }

  public bodyScrollChanged(value:number){
    this.headerPaddingRightValue = value;
    this.headerPaddingRight = `${value}px`;
    this.calculateMinWidth();
  }
}
