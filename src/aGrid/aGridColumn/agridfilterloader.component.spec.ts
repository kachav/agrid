import { AGridFilterLoaderComponent } from './agridfilterloader.component';

import { ViewContainerRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

class ViewContainerRefMock {
    createEmbeddedView() {

    }
}

describe('agridfilterloader.component', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridFilterLoaderComponent
            ],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(AGridFilterLoaderComponent).componentInstance;
        });
    }));

    it('createEmbeddedView do not fires without column', () => {
        instance.column = null;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without filter', () => {
        instance.column = { filter: null };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without template', () => {
        instance.column = { filter: { template: null } };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView fires with template', () => {
        let fakeView = { aaa: 123 };
        instance.column = { filter: { template: "template" } };
        spyOn(instance.viewContainer, 'createEmbeddedView').and.callFake(() => fakeView);
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).toHaveBeenCalledWith(instance.column.filter.template, {
            '$implicit': instance.column
        });

        expect(instance.view).toBe(fakeView);
    })

    it('view.context updates on ngOnChanges', () => {
        let fakeColumn = { filter: { template: "template" } };

        instance.view = { context: {} };
        instance.column = fakeColumn;

        instance.ngOnChanges();

        expect(instance.view.context.$implicit).toBe(fakeColumn);
    });

    it('view.context don\'t updates on ngOnChanges when view is null', () => {
        let fakeColumn = { filter: { template: "template" } };

        instance.view = null;
        instance.column = fakeColumn;

        instance.ngOnChanges();

        expect(instance.view).toEqual(null);
    });

});