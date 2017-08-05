import { inject } from '@angular/core/testing';

import { AGridComponent } from './agrid.component';

import {UNIT_PERC,UNIT_PX} from './aGridColumn/agridcolumn.component';

import { DomSanitizer } from '@angular/platform-browser';

class DomElement{
    public nativeElement={
        offsetWidth:0,
        clientWidth:0
    }
    constructor(offsetWidth:number, clientWidth?:number){
        this.nativeElement.offsetWidth = offsetWidth;
        this.nativeElement.clientWidth = clientWidth || 0;
    }
}

describe('agrid.component', () => {
    let gridInstance, sanitizer: DomSanitizer;

    beforeEach(inject([DomSanitizer], (_sanitizer) => {
        sanitizer = _sanitizer;
        spyOn(sanitizer, 'bypassSecurityTrustStyle');
        gridInstance = new AGridComponent(sanitizer);
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
        expect(sanitizer.bypassSecurityTrustStyle).not.toHaveBeenCalled();
        expect(gridInstance.bodyHeight).toEqual(null);
    });

    it('setBodyHeight fires bypassSecurityTrustStyle with calc on when headerHeight and bodyHeight !== 0', () => {
        let headerHeight = 32, bottomHeight = 54;

        gridInstance.headerHeight = headerHeight;
        gridInstance.bottomHeight = 0;
        gridInstance.setBodyHeight();
        expect(sanitizer.bypassSecurityTrustStyle).toHaveBeenCalledWith(`calc(100% - ${gridInstance.headerHeight + gridInstance.bottomHeight}px)`);

        gridInstance.headerHeight = 0;
        gridInstance.bottomHeight = bottomHeight;
        gridInstance.setBodyHeight();
        expect(sanitizer.bypassSecurityTrustStyle).toHaveBeenCalledWith(`calc(100% - ${gridInstance.headerHeight + gridInstance.bottomHeight}px)`);


        gridInstance.headerHeight = headerHeight;
        gridInstance.bottomHeight = bottomHeight;
        gridInstance.setBodyHeight();
        expect(sanitizer.bypassSecurityTrustStyle).toHaveBeenCalledWith(`calc(100% - ${gridInstance.headerHeight + gridInstance.bottomHeight}px)`);
    });

    it('bodyColumns should takes from columns.toArray()', () => {
        let res = [
                { colName: "col1" },
                { colName: "col2" }
            ];
        
        let cols = {
            toArray(){
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
            toArray(){
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
            toArray(){
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
            toArray(){
                return res;
            }
        };

        gridInstance.columns = cols;
        gridInstance.updateBodyBindings();
        expect(gridInstance.lastColumnResizable).toEqual(true);
    });

    it('calculateMinWidth works with pixel columns)', () => {
        let res = [
                { colName: "col1", resizable: true, widthUnit:UNIT_PX },
                { colName: "col2", resizable: true, widthUnit:UNIT_PX }
            ];
        
        let cols = {
            toArray(){
                return res;
            }
        };

        gridInstance.colElements = [
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.bodyContainer = new DomElement(100);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth();

        expect(gridInstance.minWidthBody).toEqual('200px');
        expect(gridInstance.minWidthTable).toEqual('215px');
    });

    it('calculateMinWidth don\'t works when body width is more then summ of column width', () => {
        let res = [
                { colName: "col1", resizable: true, widthUnit:UNIT_PX },
                { colName: "col2", resizable: true, widthUnit:UNIT_PX }
            ];
        
        let cols = {
            toArray(){
                return res;
            }
        };

        gridInstance.colElements = [
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.bodyContainer = new DomElement(400);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth();

        expect(gridInstance.minWidthBody).toEqual(null);
        expect(gridInstance.minWidthTable).toEqual(null);
    });

    it('calculateMinWidth works with percents', () => {
        let res = [
                { colName: "col1", resizable: true, widthUnit:UNIT_PERC },
                { colName: "col2", resizable: true, widthUnit:UNIT_PERC },
                { colName: "col3", resizable: true, widthUnit:UNIT_PERC },
                { colName: "col4", resizable: true, widthUnit:UNIT_PERC }
            ];
        
        let cols = {
            toArray(){
                return res;
            }
        };

        gridInstance.colElements = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth();

        expect(gridInstance.minWidthBody).toEqual(`${(400/300)*100}%`);
        expect(gridInstance.sanitizer.bypassSecurityTrustStyle)
            .toHaveBeenCalledWith(`calc(${(400/300)*100}% + 15px)`);
    });

    it('calculateMinWidth works with percents and pixels both', () => {
        let res = [
                { colName: "col1", resizable: true, widthUnit:UNIT_PERC },
                { colName: "col2", resizable: true, widthUnit:UNIT_PERC },
                { colName: "col3", resizable: true, widthUnit:UNIT_PX },
                { colName: "col4", resizable: true, widthUnit:UNIT_PERC }
            ];
        
        let cols = {
            toArray(){
                return res;
            }
        };

        gridInstance.colElements = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        gridInstance.headerPaddingRightValue = 15;

        gridInstance.calculateMinWidth();

        expect(gridInstance.sanitizer.bypassSecurityTrustStyle)
            .toHaveBeenCalledWith(`calc(100% + 100px)`);
        expect(gridInstance.sanitizer.bypassSecurityTrustStyle)
            .toHaveBeenCalledWith(`calc(100% + 115px)`);
    });

    it('columnResizeStart triggers widthChangeStart for all columns', () => {
        let res = [
                { colName: "col1", resizable: true, widthUnit:UNIT_PERC, widthChangeStart(){} },
                { colName: "col2", resizable: true, widthUnit:UNIT_PERC, widthChangeStart(){} },
                { colName: "col3", resizable: true, widthUnit:UNIT_PX, widthChangeStart(){} },
                { colName: "col4", resizable: true, widthUnit:UNIT_PERC, widthChangeStart(){} }
            ];
        
        let cols = {
            toArray(){
                return res;
            }
        };

        res.forEach(resItem=>{
            spyOn(resItem,'widthChangeStart');
        })

        gridInstance.colElements = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        spyOn(gridInstance,'calculateMinWidth');

        gridInstance.updateBodyBindings();
        gridInstance.columnResizeStart();

        res.forEach(resItem=>{
            expect(resItem.widthChangeStart).toHaveBeenCalledWith(gridInstance.bodyContainer.nativeElement.clientWidth);
        })

        expect(gridInstance.calculateMinWidth).toHaveBeenCalled();
    });

    it('columnResizeEnd triggers widthChanged for all columns', () => {
        let res = [
                { colName: "col1", resizable: true, widthUnit:UNIT_PERC, widthChanged(){} },
                { colName: "col2", resizable: true, widthUnit:UNIT_PERC, widthChanged(){} },
                { colName: "col3", resizable: true, widthUnit:UNIT_PX, widthChanged(){} },
                { colName: "col4", resizable: true, widthUnit:UNIT_PERC, widthChanged(){} }
            ];
        
        let cols = {
            toArray(){
                return res;
            }
        };

        res.forEach(resItem=>{
            spyOn(resItem,'widthChanged');
        })

        gridInstance.colElements = [
            new DomElement(100),
            new DomElement(100),
            new DomElement(100),
            new DomElement(100)
        ];

        gridInstance.bodyContainer = new DomElement(300, 300);

        gridInstance.columns = cols;

        spyOn(gridInstance,'calculateMinWidth');

        gridInstance.updateBodyBindings();
        gridInstance.columnResizeEnd();

        res.forEach(resItem=>{
            expect(resItem.widthChanged).toHaveBeenCalledWith(gridInstance.bodyContainer.nativeElement.clientWidth);
        })

        expect(gridInstance.calculateMinWidth).toHaveBeenCalled();
    });

    it('updateBodyBindings fires on ngAfterContentInit', () => {
        spyOn(gridInstance, 'updateBodyBindings');

        gridInstance.ngAfterContentInit();
        expect(gridInstance.updateBodyBindings).toHaveBeenCalled();
    });

    it('updateBodyBindings fires on ngOnChanges', () => {
        spyOn(gridInstance, 'updateBodyBindings');

        gridInstance.ngOnChanges();
        expect(gridInstance.updateBodyBindings).toHaveBeenCalled();
    });

    it('onRowClick.next fires on rowClick', () => {
        let row = { _id: 1 };

        spyOn(gridInstance.onRowClick, 'next');

        gridInstance.rowClick(row);
        expect(gridInstance.onRowClick.next).toHaveBeenCalledWith(row);
    });

    it('bodyScrollChanged set headerPaddingRight and trigger calculateMinWidth', () => {
        spyOn(gridInstance, 'calculateMinWidth');

        gridInstance.bodyScrollChanged(15);

        expect(gridInstance.headerPaddingRightValue).toEqual(15);
        expect(gridInstance.headerPaddingRight).toEqual('15px');
        expect(gridInstance.calculateMinWidth).toHaveBeenCalled();
    });

    it('onRowDoubleClick.next fires on rowDoubleClick', () => {
        let row = { _id: 1 };

        spyOn(gridInstance.onRowDoubleClick, 'next');

        gridInstance.rowDoubleClick(row);
        expect(gridInstance.onRowDoubleClick.next).toHaveBeenCalledWith(row);
    });

});
