import {
  Component, Input, Output, EventEmitter, HostListener,
  ElementRef, Renderer, ViewChild,
  ContentChildren, ContentChild, SimpleChange
} from '@angular/core';
import { gridState } from './utils/agrid.state';
import { aGridColumn } from './aGridColumn/agridcolumn.component';
import { aGridBottom } from './aGridBottom/agridbottom.component';



@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  selector: 'a-grid',

  templateUrl: './agrid.template.html',
  styleUrls: ['./agrid.styles.css']
})
export class aGrid {

  bodyColumns: aGridColumn[] = [];

  _initializeProperties() {
    this.bodyColumns = [...this.columns._results];
  }

  //grid is rows checkable binding
  @Input() check: boolean;

  @Input() items;

  @ContentChildren(aGridColumn) columns;

  @ContentChild(aGridBottom) bottomContainer;

  @ViewChild('headerContainer') headerContainer;

  @Input() selectedProperty: string;
  selectedPropertyDefault = "aGridSelected";

  @Input() checkedProperty: string;
  checkedPropertyDefault = "aGridChecked";

  @Output() onSelectRow = new EventEmitter();

  @Output() onCheckRow = new EventEmitter();


  @ViewChild('bodyContainer') bodyContainer: ElementRef;

  headerPaddingRight = "0px";

  private xPrev: number;
  private activeColIndex = -1;
  private activeColStyle = {
    initialRight: 0,
    rightValue: 0,
    styles: {
      right: '',
      height: ''
    }
  };

  private state: gridState;

  constructor(private curEl: ElementRef, private renderer: Renderer) {
  }
  ngOnInit() {
    this.state = new gridState();
    //init state of grid
    this.state.initialize();
  }

  ngAfterContentInit() {
    this._initializeProperties();
  }

  ngAfterViewInit() {
    this.renderer.setElementStyle(this.bodyContainer.nativeElement, "height", `calc(100% - ${this.headerContainer.nativeElement.offsetHeight + this.bottomContainer.el.nativeElement.offsetHeight}px)`);
  }

  rowSelect(i) {
    //selection logic is in the source
    this.onSelectRow.next(i);
  }

  rowCheck([value, i]) {
    //check logic is in the source
    this.onCheckRow.next([value, i]);
  }


  printScroll(body, header) {
    console.log(`body scrollWidth ${body.scrollWidth}; scrollLeft ${body.scrollLeft}; offsetWidth ${body.offsetWidth}`);
    console.log(`header scrollWidth ${header.scrollWidth}; scrollLeft ${header.scrollLeft}; offsetWidth ${header.offsetWidth}`);
    console.dir(body);
    console.dir(header);
  }

  //body scrolling
  onScroll(e, header) {
    if (e.target.scrollLeft !== header.scrollLeft) {
      this.renderer.setElementProperty(header, "scrollLeft", e.target.scrollLeft);
    }
  }

  //column resizer selecting
  colResizerMouseDown(e, index) {
    let elStyles = getComputedStyle(e.target), elRight = +elStyles.right.replace(/px/, '');
    //mouse start coordinate
    this.xPrev = e.pageX;
    //resizing column
    this.activeColIndex = index;
    this.activeColStyle = {
      initialRight: elRight,
      rightValue: elRight,
      styles: {
        right: elStyles.right,
        height: `${this.headerContainer.nativeElement.offsetHeight}px`
      }
    };
  }

  //document mouseMove event
  @HostListener('document:mousemove', ['$event']) colResizerMouseMove(e) {
    //when we have column to resize, change it's width on difference 
    //between current mouse coordinate and previous coordinate
    if (this.activeColIndex > -1 && this.columns._results[this.activeColIndex] && this.xPrev) {
      this.activeColStyle.rightValue -= (e.pageX - this.xPrev);
      this.activeColStyle.styles.right = `${this.activeColStyle.rightValue}px`;
      //save current coordinate as previous coordinate
      this.xPrev = e.pageX;
    }
  }


  //docunent mouseUp event
  @HostListener('document:mouseup', ['$event']) colResizerMouseUp(e) {
    let col = this.columns._results[this.activeColIndex];
    //resizing is end, clear it's data (active column ang previous mouse coordinate)
    if (this.activeColIndex > -1 && this.xPrev) {
      if (col) {
        let width = col.width - this.activeColStyle.rightValue + this.activeColStyle.initialRight;
        if (width < 30) {
          width = 30;
        }
        //this.source.setColumnWidth(this.activeColIndex, width);
        col.width = width;
        this._initializeProperties();
      }

      this.xPrev = null;
      this.activeColIndex = -1;
    }
  }
}