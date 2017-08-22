import {
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostListener,
    Input,
    Output,
    QueryList,
    Renderer2,
    ViewChild,
    ViewChildren,
    ViewEncapsulation,
} from '@angular/core';
import { AGridColumnComponent, UNIT_PERC, UNIT_PX } from './aGridColumn/agridcolumn.component';

import { AGridGroupDirective } from './aGridGroup/aGridGroup.directive';

import { DomSanitizer } from '@angular/platform-browser';

import { isFinite } from 'lodash';
import { AGridDetailDirective } from './aGridDetail/aGridDetail.directive';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'a-grid',
  templateUrl: './agrid.component.html',
  styleUrls: ['./agrid.component.css'],
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

  @ContentChildren(AGridColumnComponent) private columns: QueryList<AGridColumnComponent>;

  @ContentChild(AGridGroupDirective) private group;

  @ContentChild(AGridDetailDirective) private detail;

  @ViewChildren('colElement') private colElements: QueryList<ElementRef>;

  @ViewChild('bodyContainer') private bodyContainer: ElementRef;

  @ViewChild('headerContainer') private headerContainer: ElementRef;

  @ViewChild('headertable') private headertable: ElementRef;

  @ViewChild('bodyComponent',{read:ElementRef}) private bodyComponent: ElementRef;

  private _destroy = new Subject();

  private destroy$ = this._destroy.asObservable().first();

  private _scroll = new Subject();

  private scroll$ = this._scroll.asObservable().takeUntil(this.destroy$).share();

  public selectedPropertyDefault = 'aGridSelected';

  public checkedPropertyDefault = 'aGridChecked';

  public bodyColumns: AGridColumnComponent[] = [];

  public bodyHeight;

  public headerHeight = 0;

  public bottomHeight = 0;

  public minWidthTable: string;

  public minWidthBody: string;

  private headerPaddingRightValue = 0;

  public headerPaddingRight: string;

  constructor(private sanitizer: DomSanitizer, private renderer: Renderer2) {
    this.setBodyHeight();
    this.initializeStreams();
  }

  public ngAfterContentInit() {
    this.updateBodyBindings();
  }

  public ngAfterViewInit(){
      this.calculateMinWidth(true);
  }

  public ngOnChanges() {
    this.updateBodyBindings();
  }

  public rowClick(row) {
    // selection logic is in the source
    this.onRowClick.emit(row);
  }

  public rowDoubleClick(row) {
    // check logic is in the source
    this.onRowDoubleClick.emit(row);
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

  private calculateMinWidth(init?:boolean) {
    let width = 0;
    let percentWidth = 0;
    let columnsArray = this.columns.toArray();
    let colElementsArray = this.colElements.toArray();
    colElementsArray.forEach((col, index) => {
      let colWidth = col.nativeElement.offsetWidth;

      if(init){
        colWidth = Math.max(colWidth,columnsArray[index].minInitialWidth);
      }

      if (columnsArray[index] && columnsArray[index].widthUnit === UNIT_PERC) {
        percentWidth += colWidth;
      } else {
        width += colWidth;
      }
    });
    if (width + percentWidth > this.bodyContainer.nativeElement.offsetWidth) {
      let bodyWidth: any = '';
      let tableWidth: any = '';
      let percentWidthHeader = (percentWidth / this.bodyContainer.nativeElement.offsetWidth) * 100;

      percentWidth = (percentWidth / this.bodyContainer.nativeElement.clientWidth) * 100;

      if (width && percentWidth) {
        bodyWidth = `calc(${percentWidth}% + ${width}px)`;
        tableWidth = `calc(${percentWidthHeader}% + ${width + this.headerPaddingRightValue}px)`;
      } else if (percentWidth) {
        bodyWidth = `${percentWidth}%`;
        tableWidth = `calc(${percentWidthHeader}% + ${this.headerPaddingRightValue}px)`;
      } else {
        bodyWidth = `${width}px`;
        tableWidth = `${width + this.headerPaddingRightValue}px`;
      }
      this.minWidthBody = bodyWidth;
      this.minWidthTable = tableWidth;
    } else {
      this.minWidthBody = null;
      this.minWidthTable = null;
    }
      this.renderer.setStyle(this.headertable.nativeElement,'min-width',this.minWidthTable);
      this.renderer.setStyle(this.bodyComponent.nativeElement,'min-width',this.minWidthBody);
  }

  public columnResizeStart() {
    let colElementsArray = this.colElements.toArray();
    this.bodyColumns.forEach((col,index) => {
      col.widthChangeStart(this.bodyContainer.nativeElement.clientWidth,colElementsArray[index].nativeElement.offsetWidth);
    });
    this.calculateMinWidth();
  }

  public columnResizeEnd() {
    this.bodyColumns.forEach((col) => {
      col.widthChanged(this.bodyContainer.nativeElement.clientWidth);
    });
    this.calculateMinWidth();
  }

  public bodyScrollChanged(value: number) {
    this.headerPaddingRightValue = value;
    this.headerPaddingRight = `${value}px`;
    this.calculateMinWidth();
  }

  public onScroll(e) {
    this._scroll.next(e);
  }

  public ngOnDestroy() {
    this._destroy.next();
  }

  private _activeColIndex = new Subject<number>();
  private activeColIndex$ = this._activeColIndex.asObservable()
    .distinctUntilChanged().takeUntil(this.destroy$).share();

  public colChangeStart(index) {
    this._activeColIndex.next(index);
  }

  @HostListener('document:mouseup') public colResizerMouseUp() {
    this._activeColIndex.next(-1);
  }

  private _mouseMove = new Subject<MouseEvent>();
  private mouseMove$ = this._mouseMove.asObservable().takeUntil(this.destroy$).share();

  @HostListener('document:mousemove', ['$event']) public colResizerMouseMove(e) {
    this._mouseMove.next(e);
  }

  private initializeStreams() {
    this.scroll$.subscribe((e) => {
      this.onBodyScroll.emit(e);
      if (this.bodyContainer.nativeElement.scrollLeft !== this.headerContainer.nativeElement.scrollLeft) {
        this.renderer.setProperty(this.headerContainer.nativeElement, 'scrollLeft', this.bodyContainer.nativeElement.scrollLeft);
      }
    });

    this.activeColIndex$.subscribe((index)=>{
      if(index>-1){
        this.columnResizeStart();
      }else{
        this.columnResizeEnd();
      }
    });

    this.mouseMove$.withLatestFrom(this.activeColIndex$,(mouseEvent,index)=>({mouseEvent,index}))
      .throttleTime(100)
      .pairwise()
      .filter(([contextPrev, contextNew])=>contextPrev.index>-1 && contextNew.index>-1)
      
      .subscribe(([contextPrev, contextNew])=>{
        const diff = contextNew.mouseEvent.pageX - contextPrev.mouseEvent.pageX;
        this.bodyColumns[contextNew.index].widthChanging(diff);
        this.updateBodyBindings();
      });
  }
}
