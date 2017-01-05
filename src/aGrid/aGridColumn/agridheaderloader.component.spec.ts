import { aGridColumnHeaderLoader } from './agridheaderloader.component';

import { ViewContainerRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

class ViewContainerRefMock {
    createEmbeddedView() {

    }
}

describe('agridheaderloader.component', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                aGridColumnHeaderLoader
            ],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(aGridColumnHeaderLoader).componentInstance;
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
            '\$implicit': instance.column
        });
    })
});