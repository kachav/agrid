import { toArray } from 'rxjs/operator/toArray';
import { Renderer2 } from '@angular/core';
import { inject } from '@angular/core/testing';

import { AGridComponent } from './agrid.component';

import { UNIT_PERC, UNIT_PX } from './aGridColumn/agridcolumn.component';

import { DomSanitizer } from '@angular/platform-browser';
import { async, TestBed } from "@angular/core/testing";

class DomElement {
    public nativeElement = {
        offsetWidth: 0,
        clientWidth: 0,
        scrollLeft: 0
    }
    constructor(offsetWidth: number, clientWidth?: number) {
        this.nativeElement.offsetWidth = offsetWidth;
        this.nativeElement.clientWidth = clientWidth || 0;
    }
}

let DomSanitizerMock;

class DomSanitizerMockClass {
    bypassSecurityTrustStyle = jasmine.createSpy('bypassSecurityTrustStyle');
    constructor() {
        DomSanitizerMock = this;
    }
}

let RendererMock;

class RendererMockClass {
    setProperty = jasmine.createSpy('setProperty');
    constructor() {
        RendererMock = this;
    }
}

describe('agrid.component', () => {
    let gridInstance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridComponent
            ],

        })

            .overrideComponent(AGridComponent, {
                set: {
                    template: "<div></div>",
                    providers: [
                        { provide: DomSanitizer, useClass: DomSanitizerMockClass },
                        { provide: Renderer2, useClass: RendererMockClass }
                    ]
                }
            }).compileComponents().then(() => {
                gridInstance = TestBed.createComponent(AGridComponent).componentInstance;
                gridInstance.bodyContainer = new DomElement(100);
                gridInstance.headerContainer = new DomElement(100);
            });
    }));

    it('headerHeightChanged sets headerHeight when argument is presented', () => {
        let height = 34;
        gridInstance.headerHeightChanged(height);
        expect(gridInstance.headerHeight).toEqual(height);
    });

    it("headerHeightChanged don't sets headerHeight when argument is not presented", () => {
        let height = null;
        gridInstance.headerHeightChanged(height);
        expect(gridInstance.headerHeight).not.toEqual(height);
    });

    it('headerHeightChanged fires setBodyHeight when argument is presented', () => {
        let height = 34;
        spyOn(gridInstance, 'setBodyHeight');
        gridInstance.headerHeightChanged(height);
        expect(gridInstance.setBodyHeight).toHaveBeenCalled();
    });

    it("headerHeightChanged don't fires setBodyHeight when argument is not presented", () => {
        let height = null;
        spyOn(gridInstance, 'setBodyHeight');
        gridInstance.headerHeightChanged(height);
        expect(gridInstance.setBodyHeight).not.toHaveBeenCalled();
    });


    it('bottomHeightChanged sets bottomHeight when argument is presented', () => {
        let height = 34;
        gridInstance.bottomHeightChanged(height);
        expect(gridInstance.bottomHeight).toEqual(height);
    });

    it("bottomHeightChanged don't sets bottomHeight when argument is not presented", () => {
        let height = null;
        gridInstance.bottomHeightChanged(height);
        expect(gridInstance.bottomHeight).not.toEqual(height);
    });

    it('bottomHeightChanged fires setBodyHeight when argument is presented', () => {
        let height = 34;
        spyOn(gridInstance, 'setBodyHeight');
        gridInstance.bottomHeightChanged(height);
        expect(gridInstance.setBodyHeight).toHaveBeenCalled();
    });

    it("bottomHeightChanged don't fires setBodyHeight when argument is not presented", () => {
        let height = null;
        spyOn(gridInstance, 'setBodyHeight');
        gridInstance.bottomHeightChanged(height);
        expect(gridInstance.setBodyHeight).not.toHaveBeenCalled();
    });


    it('setBodyHeight makes bodyHeight == null when headerHeight and bodyHeight === 0', () => {
        gridInstance.headerHeight = 0;
        gridInstance.bottomHeight = 0;
        gridInstance.setBodyHeight();
        expect(DomSanitizerMock.bypassSecurityTrustStyle).not.toHaveBeenCalled();
        expect(gridInstance.bodyHeight).toEqual(null);
    });

    it('setBodyHeight fires bypassSecurityTrustStyle with calc on when headerHeight and bodyHeight !== 0', () => {
        let headerHeight = 32, bottomHeight = 54;

        gridInstance.headerHeight = headerHeight;
        gridInstance.bottomHeight = 0;
        gridInstance.setBodyHeight();
        expect(DomSanitizerMock.bypassSecurityTrustStyle).toHaveBeenCalledWith(`calc(100% - ${gridInstance.headerHeight + gridInstance.bottomHeight}px)`);

        gridInstance.headerHeight = 0;
        gridInstance.bottomHeight = bottomHeight;
        gridInstance.setBodyHeight();
        expect(DomSanitizerMock.bypassSecurityTrustStyle).toHaveBeenCalledWith(`calc(100% - ${gridInstance.headerHeight + gridInstance.bottomHeight}px)`);


        gridInstance.headerHeight = headerHeight;
        gridInstance.bottomHeight = bottomHeight;
        gridInstance.setBodyHeight();
        expect(DomSanitizerMock.bypassSecurityTrustStyle).toHaveBeenCalledWith(`calc(100% - ${gridInstance.headerHeight + gridInstance.bottomHeight}px)`);
    });

    it('bodyColumns should takes from columns.toArray()', () => {
        let res = [
            { colName: "col1" },
            { colName: "col2" }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        gridInstance.columns = cols;
        gridInstance.updateBodyBindings();
        expect(gridInstance.bodyColumns).toEqual(res);
    });

    it('bodyColumns do not changes when columns is not presented', () => {
        gridInstance.columns = null;
        expect(gridInstance.bodyColumns).toEqual([]);
        gridInstance.updateBodyBindings();
        expect(gridInstance.bodyColumns).toEqual([]);
    });

    it('lastColumnResizable false on emptyColumns', () => {
        let res = [
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        gridInstance.columns = cols;
        gridInstance.updateBodyBindings();
        expect(gridInstance.lastColumnResizable).toEqual(false);
    });

    it('lastColumnResizable false on last column.resizeble===false :)', () => {
        let res = [
            { colName: "col1", resizable: true },
            { colName: "col2", resizable: false }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        gridInstance.columns = cols;
        gridInstance.updateBodyBindings();
        expect(gridInstance.lastColumnResizable).toEqual(false);
    });

    it('lastColumnResizable true on last column.resizable===true :)', () => {
        let res = [
            { colName: "col1", resizable: true },
            { colName: "col2", resizable: true }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        gridInstance.columns = cols;
        gridInstance.updateBodyBindings();
        expect(gridInstance.lastColumnResizable).toEqual(true);
    });

    it('calculateMinWidth works with pixel columns)', () => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PX },
            { colName: "col2", resizable: true, widthUnit: UNIT_PX }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        let colElementsArray = [
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.colElements = {
            toArray(){
                return colElementsArray;
            }
        }

        gridInstance.headertable = new DomElement(100);
        gridInstance.bodyComponent = new DomElement(100);
        spyOn(gridInstance.renderer,'setStyle');
        gridInstance.bodyContainer = new DomElement(100);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;



        gridInstance.calculateMinWidth();

        expect(gridInstance.minWidthBody).toEqual('200px');
        expect(gridInstance.minWidthTable).toEqual('215px');

        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.headertable.nativeElement,'min-width',gridInstance.minWidthTable);
        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.bodyComponent.nativeElement,'min-width',gridInstance.minWidthBody);
    });

    it('calculateMinWidth don\'t works when body width is more then summ of column width', () => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PX },
            { colName: "col2", resizable: true, widthUnit: UNIT_PX }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        let colElementsArray = [
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.colElements = {
            toArray(){
                return colElementsArray;
            }
        }

        gridInstance.headertable = new DomElement(100);
        gridInstance.bodyComponent = new DomElement(100);
        spyOn(gridInstance.renderer,'setStyle');

        gridInstance.bodyContainer = new DomElement(400);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth();

        expect(gridInstance.minWidthBody).toEqual(null);
        expect(gridInstance.minWidthTable).toEqual(null);

        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.headertable.nativeElement,'min-width',gridInstance.minWidthTable);
        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.bodyComponent.nativeElement,'min-width',gridInstance.minWidthBody);
    });

    it('calculateMinWidth works with percents', () => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PERC },
            { colName: "col2", resizable: true, widthUnit: UNIT_PERC },
            { colName: "col3", resizable: true, widthUnit: UNIT_PERC },
            { colName: "col4", resizable: true, widthUnit: UNIT_PERC }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        let colElementsArray = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.headertable = new DomElement(100);
        gridInstance.bodyComponent = new DomElement(100);
        spyOn(gridInstance.renderer,'setStyle');

        gridInstance.colElements = {
            toArray(){
                return colElementsArray;
            }
        }

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth();

        expect(gridInstance.minWidthBody).toEqual(`${(400 / 300) * 100}%`);
        expect(gridInstance.minWidthTable).toEqual(`calc(${(400 / 300) * 100}% + 15px)`);

        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.headertable.nativeElement,'min-width',gridInstance.minWidthTable);
        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.bodyComponent.nativeElement,'min-width',gridInstance.minWidthBody);
    });

    it('calculateMinWidth takes max values from minInitialWidth on init', () => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PERC, minInitialWidth: 150 },
            { colName: "col2", resizable: true, widthUnit: UNIT_PERC, minInitialWidth: 50 },
            { colName: "col3", resizable: true, widthUnit: UNIT_PERC, minInitialWidth: 50 },
            { colName: "col4", resizable: true, widthUnit: UNIT_PERC, minInitialWidth: 50 }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        let colElementsArray = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.colElements = {
            toArray(){
                return colElementsArray;
            }
        }

        gridInstance.headertable = new DomElement(100);
        gridInstance.bodyComponent = new DomElement(100);
        spyOn(gridInstance.renderer,'setStyle');

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth(true);

        expect(gridInstance.minWidthBody).toEqual(`${(450 / 300) * 100}%`);
        expect(gridInstance.minWidthTable)
            .toEqual(`calc(${(450 / 300) * 100}% + 15px)`);

        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.headertable.nativeElement,'min-width',gridInstance.minWidthTable);
        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.bodyComponent.nativeElement,'min-width',gridInstance.minWidthBody);
    });

    it('calculateMinWidth works with percents and pixels both', () => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PERC },
            { colName: "col2", resizable: true, widthUnit: UNIT_PERC },
            { colName: "col3", resizable: true, widthUnit: UNIT_PX },
            { colName: "col4", resizable: true, widthUnit: UNIT_PERC }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        let colElementsArray = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.headertable = new DomElement(100);
        gridInstance.bodyComponent = new DomElement(100);
        spyOn(gridInstance.renderer,'setStyle');

        gridInstance.colElements = {
            toArray(){
                return colElementsArray;
            }
        }

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth();

        expect(gridInstance.minWidthBody)
            .toEqual(`calc(100% + 100px)`);
        expect(gridInstance.minWidthTable)
            .toEqual(`calc(100% + 115px)`);
        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.headertable.nativeElement,'min-width',gridInstance.minWidthTable);
        expect(gridInstance.renderer.setStyle).toHaveBeenCalledWith(gridInstance.bodyComponent.nativeElement,'min-width',gridInstance.minWidthBody);
    });

    it('columnResizeStart triggers widthChangeStart for all columns', () => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PERC, widthChangeStart() { } },
            { colName: "col2", resizable: true, widthUnit: UNIT_PERC, widthChangeStart() { } },
            { colName: "col3", resizable: true, widthUnit: UNIT_PX, widthChangeStart() { } },
            { colName: "col4", resizable: true, widthUnit: UNIT_PERC, widthChangeStart() { } }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        res.forEach(resItem => {
            spyOn(resItem, 'widthChangeStart');
        })


        let colElementsArray = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.colElements = {
            toArray(){
                return colElementsArray;
            }
        }

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        spyOn(gridInstance, 'calculateMinWidth');

        gridInstance.updateBodyBindings();
        gridInstance.columnResizeStart();

        res.forEach((resItem, index) => {
            expect(resItem.widthChangeStart).toHaveBeenCalledWith(gridInstance.bodyContainer.nativeElement.clientWidth,colElementsArray[index].nativeElement.offsetWidth);
        })

        expect(gridInstance.calculateMinWidth).toHaveBeenCalled();
    });

    it('columnResizeEnd triggers widthChanged for all columns', () => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PERC, widthChanged() { } },
            { colName: "col2", resizable: true, widthUnit: UNIT_PERC, widthChanged() { } },
            { colName: "col3", resizable: true, widthUnit: UNIT_PX, widthChanged() { } },
            { colName: "col4", resizable: true, widthUnit: UNIT_PERC, widthChanged() { } }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        res.forEach(resItem => {
            spyOn(resItem, 'widthChanged');
        });

        let colElementsArray = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.colElements = {
            toArray(){
                return colElementsArray;
            }
        }

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        spyOn(gridInstance, 'calculateMinWidth');

        gridInstance.updateBodyBindings();
        gridInstance.columnResizeEnd();

        res.forEach((resItem) => {
            expect(resItem.widthChanged).toHaveBeenCalledWith(gridInstance.bodyContainer.nativeElement.clientWidth);
        })

        expect(gridInstance.calculateMinWidth).toHaveBeenCalled();
    });

    it('updateBodyBindings fires on ngAfterContentInit', () => {
        spyOn(gridInstance, 'updateBodyBindings');

        gridInstance.ngAfterContentInit();
        expect(gridInstance.updateBodyBindings).toHaveBeenCalled();
    });

    it('calculateMinWidth fires on ngAfterViewInit', () => {
        spyOn(gridInstance, 'calculateMinWidth');

        gridInstance.ngAfterViewInit();
        expect(gridInstance.calculateMinWidth).toHaveBeenCalledWith(true);
    });

    it('updateBodyBindings fires on ngOnChanges', () => {
        spyOn(gridInstance, 'updateBodyBindings');

        gridInstance.ngOnChanges();
        expect(gridInstance.updateBodyBindings).toHaveBeenCalled();
    });

    it('onRowClick.emit fires on rowClick', () => {
        let row = { _id: 1 };

        spyOn(gridInstance.onRowClick, 'emit');

        gridInstance.rowClick(row);
        expect(gridInstance.onRowClick.emit).toHaveBeenCalledWith(row);
    });

    it('bodyScrollChanged set headerPaddingRight and trigger calculateMinWidth', () => {
        spyOn(gridInstance, 'calculateMinWidth');

        gridInstance.bodyScrollChanged(15);

        expect(gridInstance.headerPaddingRightValue).toEqual(15);
        expect(gridInstance.headerPaddingRight).toEqual('15px');
        expect(gridInstance.calculateMinWidth).toHaveBeenCalled();
    });

    it('onRowDoubleClick.emit fires on rowDoubleClick', () => {
        let row = { _id: 1 };

        spyOn(gridInstance.onRowDoubleClick, 'emit');

        gridInstance.rowDoubleClick(row);
        expect(gridInstance.onRowDoubleClick.emit).toHaveBeenCalledWith(row);
    });

    it('onScroll emit onBodyScroll event', () => {
        const scrollEvent = {};
        spyOn(gridInstance.onBodyScroll, 'emit');
        gridInstance.onScroll(scrollEvent);
        expect(gridInstance.onBodyScroll.emit).toHaveBeenCalledWith(scrollEvent);
    });

    it('onScroll sync scroll left of bodyContainer and headerContainer', () => {
        const scrollEvent = {};
        gridInstance.bodyContainer.nativeElement.scrollLeft = 100;
        gridInstance.headerContainer.nativeElement.scrollLeft = 200;
        spyOn(gridInstance.renderer, 'setProperty');
        gridInstance.onScroll(scrollEvent);
        expect(gridInstance.renderer.setProperty)
            .toHaveBeenCalledWith(gridInstance.headerContainer.nativeElement, 'scrollLeft', gridInstance.bodyContainer.nativeElement.scrollLeft);
    });
    it('onScroll sync scroll left of bodyContainer and headerContainer', () => {
        const scrollEvent = {};
        gridInstance.bodyContainer.nativeElement.scrollLeft = 100;
        gridInstance.headerContainer.nativeElement.scrollLeft = 100;
        spyOn(gridInstance.renderer, 'setProperty');
        gridInstance.onScroll(scrollEvent);
        expect(gridInstance.renderer.setProperty).not.toHaveBeenCalled();
    });

    it('columnResizeStart fires on colChangeStart with index >-1', () => {
        spyOn(gridInstance, 'columnResizeStart');
        expect(gridInstance.columnResizeStart).not.toHaveBeenCalled();
        gridInstance.colChangeStart(1);
        expect(gridInstance.columnResizeStart).toHaveBeenCalled();
    });

    it('columnResizeEnd fires on colResizerMouseUp', () => {
        spyOn(gridInstance, 'columnResizeEnd');
        expect(gridInstance.columnResizeEnd).not.toHaveBeenCalled();
        gridInstance.colResizerMouseUp();
        expect(gridInstance.columnResizeEnd).toHaveBeenCalled();
    });

    it('mousemove calculates width diff with throttling',async(() => {
        let res = [
            { colName: "col1", resizable: true, widthUnit: UNIT_PERC, widthChanging() { },widthChangeStart(){} },
            { colName: "col2", resizable: true, widthUnit: UNIT_PERC, widthChanging() { },widthChangeStart(){} },
            { colName: "col3", resizable: true, widthUnit: UNIT_PX, widthChanging() { },widthChangeStart(){} },
            { colName: "col4", resizable: true, widthUnit: UNIT_PERC, widthChanging() { },widthChangeStart(){} }
        ];

        let cols = {
            toArray() {
                return res;
            }
        };

        let index = 2;

        res.forEach(resItem => {
            spyOn(resItem, 'widthChanging');
        });

        gridInstance.columns = cols;

        gridInstance.bodyColumns=res;

        spyOn(gridInstance,'updateBodyBindings');

        spyOn(gridInstance,'columnResizeStart');

        expect(res[index].widthChanging).not.toHaveBeenCalled();

        let event1 = {pageX:100};
        let event2 = {pageX:110};
        let event3 = {pageX:120};

        gridInstance.colChangeStart(index);

        gridInstance.colResizerMouseMove(event1);

        expect(res[index].widthChanging).not.toHaveBeenCalled();

        setTimeout(()=>{
            gridInstance.colResizerMouseMove(event2);
            expect(res[index].widthChanging).not.toHaveBeenCalled();
        },80);

        setTimeout(()=>{
            gridInstance.colResizerMouseMove(event3);
            expect(res[index].widthChanging).toHaveBeenCalledWith(event3.pageX - event1.pageX);
            expect(gridInstance.updateBodyBindings).toHaveBeenCalled();
        },120);

    }));
});
