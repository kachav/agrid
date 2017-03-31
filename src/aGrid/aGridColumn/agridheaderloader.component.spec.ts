import { AGridColumnHeaderLoaderComponent } from './agridheaderloader.component';

import { ViewContainerRef } from "@angular/core";

import { async, TestBed } from '@angular/core/testing';

class ViewContainerRefMock {
    createEmbeddedView() {

    }
}

describe('agridheaderloader.component', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridColumnHeaderLoaderComponent
            ],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(AGridColumnHeaderLoaderComponent).componentInstance;
        });
    }));

    it('createEmbeddedView do not fires without column', () => {
        instance.column = null;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without header', () => {
        instance.column = { header: null };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without template', () => {
        instance.column = { header: { template: null } };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView fires with template', () => {
        instance.column = { header: { template: "template" } };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).toHaveBeenCalledWith(instance.column.header.template, {
            '$implicit': instance.column
        });
    })

    it('view.context updates on ngOnChanges', () => {
        let fakeColumn = { cell: { template: "template" } };

        instance.column = fakeColumn;

        instance.view = { context: {} };

        instance.ngOnChanges();

        expect(instance.view.context.$implicit).toBe(fakeColumn);
    })


    it('view.context don\'t updates on ngOnChanges when view is not present', () => {
        let fakeColumn = { cell: { template: "template" } };

        instance.column = fakeColumn;

        instance.view = null;

        instance.ngOnChanges();

        expect(instance.view).toEqual(null);
    })

});