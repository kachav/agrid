import { aGridFilterLoader } from './agridfilterloader.component';

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
                aGridFilterLoader
            ],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(aGridFilterLoader).componentInstance;
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
        instance.column = { filter: { template: "template" } };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).toHaveBeenCalledWith(instance.column.filter.template, {
            '\$implicit': instance.column
        });
    })
});