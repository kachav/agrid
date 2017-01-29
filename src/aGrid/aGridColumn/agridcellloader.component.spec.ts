import { aGridColumnCellLoader } from './agridcellloader.component';

import { ViewContainerRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

class ViewContainerRefMock {
    createEmbeddedView() {

    }
}

describe('agridcellloader.component', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                aGridColumnCellLoader
            ],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(aGridColumnCellLoader).componentInstance;
        });
    }));

    it('createEmbeddedView do not fires without column', () => {
        instance.column = null;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without cell', () => {
        instance.column = { cell: null };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without template', () => {
        instance.column = { cell: { template: null } };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView fires with template', () => {
        let fakeView = { aaa: 123 };

        instance.column = { cell: { template: "template" } };
        instance.rowData = { data: 123 };
        instance.rowIndex = 2;
        spyOn(instance.viewContainer, 'createEmbeddedView').and.callFake(() => fakeView);
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).toHaveBeenCalledWith(instance.column.cell.template, {
            '$implicit': instance.rowData,
            'rowData': instance.rowData,
            'rowColumn': instance.column,
            'rowIndex': instance.rowIndex
        });
        expect(instance.view).toBe(fakeView);
    })

    it('view.context updates on ngOnChanges', () => {
        let fakeColumn = { cell: { template: "template" } }, fakeRow = { sss: 333 }, fakeIndex = 3;

        instance.column = fakeColumn;
        instance.rowData = fakeRow;
        instance.rowIndex = fakeIndex;

        instance.view = { context: {} };

        instance.ngOnChanges();

        expect(instance.view.context.$implicit).toBe(fakeRow);
        expect(instance.view.context.rowData).toBe(fakeRow);

        expect(instance.view.context.rowColumn).toBe(fakeColumn);

        expect(instance.view.context.rowIndex).toEqual(fakeIndex);
    })

    it('view.context don\'t updates on ngOnChanges, when view is not presented', () => {
        let fakeColumn = { cell: { template: "template" } }, fakeRow = { sss: 333 }, fakeIndex = 3;

        instance.column = fakeColumn;
        instance.rowData = fakeRow;
        instance.rowIndex = fakeIndex;

        instance.view = null;

        instance.ngOnChanges();

        expect(instance.view).toEqual(null);
    })
});