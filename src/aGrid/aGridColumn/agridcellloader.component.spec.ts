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
        instance.column = { cell: { template: "template" } };
        instance.rowData = { data: 123 };
        instance.rowIndex = 2;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).toHaveBeenCalledWith(instance.column.cell.template, {
            '\$implicit': instance.column,
            'rowData': instance.rowData,
            'rowIndex': instance.rowIndex
        });
    })
});