import { inject } from '@angular/core/testing';

import { aGrid } from './agrid.component';

import { DomSanitizer } from '@angular/platform-browser';

describe('agrid.component', () => {
    let gridInstance, sanitizer: DomSanitizer;

    beforeEach(inject([DomSanitizer], (_sanitizer) => {
        sanitizer = _sanitizer;
        spyOn(sanitizer, 'bypassSecurityTrustStyle');
        gridInstance = new aGrid(sanitizer);
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


    it('setBodyHeight fires bypassSecurityTrustStyle with "100%" on when headerHeight and bodyHeight === 0', () => {
        gridInstance.headerHeight = 0;
        gridInstance.bottomHeight = 0;
        gridInstance.setBodyHeight();
        expect(sanitizer.bypassSecurityTrustStyle).toHaveBeenCalledWith("100%");
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
    
    it('bodyColumns should takes from columns._results', () => {
        let cols = {
            _results: [
                { colName: "col1" },
                { colName: "col2" }
            ]
        };

        gridInstance.columns = cols;
        gridInstance.updateColumns();
        expect(gridInstance.bodyColumns).toEqual(cols._results);
    });

    it('bodyColumns do not changes when columns is not presented', () => {
        gridInstance.columns = null;
        gridInstance.updateColumns();
        expect(gridInstance.bodyColumns).toEqual([]);
    });

    it('lastColumnResizable false on emptyColumns', () => {
        let cols = {
            _results: [
            ]
        };

        gridInstance.columns = cols;
        gridInstance.updateColumns();
        expect(gridInstance.lastColumnResizable).toEqual(false);
    });

    it('lastColumnResizable false on last column.resizeble===false :)', () => {
        let cols = {
            _results: [
                { colName: "col1", resizable: true },
                { colName: "col2", resizable: false }
            ]
        };

        gridInstance.columns = cols;
        gridInstance.updateColumns();
        expect(gridInstance.lastColumnResizable).toEqual(false);
    });

    it('lastColumnResizable true on last column.resizable===true :)', () => {
        let cols = {
            _results: [
                { colName: "col1", resizable: true },
                { colName: "col2", resizable: true }
            ]
        };

        gridInstance.columns = cols;
        gridInstance.updateColumns();
        expect(gridInstance.lastColumnResizable).toEqual(true);
    });

    it('updateColumns fires on ngAfterContentInit', () => {
        spyOn(gridInstance, 'updateColumns');

        gridInstance.ngAfterContentInit();
        expect(gridInstance.updateColumns).toHaveBeenCalled();
    });

    it('updateColumns fires on ngOnChanges', () => {
        spyOn(gridInstance, 'updateColumns');

        gridInstance.ngOnChanges();
        expect(gridInstance.updateColumns).toHaveBeenCalled();
    });

    it('onRowClick.next fires on rowClick', () => {
        let row = { _id: 1 };

        spyOn(gridInstance.onRowClick, 'next');

        gridInstance.rowClick(row);
        expect(gridInstance.onRowClick.next).toHaveBeenCalledWith(row);
    });

    it('onRowDoubleClick.next fires on rowDoubleClick', () => {
        let row = { _id: 1 };

        spyOn(gridInstance.onRowDoubleClick, 'next');

        gridInstance.rowDoubleClick(row);
        expect(gridInstance.onRowDoubleClick.next).toHaveBeenCalledWith(row);
    });

});
