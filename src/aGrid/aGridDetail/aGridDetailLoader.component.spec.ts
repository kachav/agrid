import { ViewContainerRef } from "@angular/core";
import { async, TestBed } from '@angular/core/testing';
import { AGridDetailLoaderComponent } from "./aGridDetailLoader.component";

class ViewContainerRefMock {
    createEmbeddedView() {
    }
}

describe('aGridDetailLoader.component', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridDetailLoaderComponent
            ],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(AGridDetailLoaderComponent).componentInstance;
        });
    }));

    it('createEmbeddedView do not fires without detail', () => {
        instance.detail = null;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without template', () => {
        instance.detail = { template: null };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView fires with template', () => {
        instance.detail = { template: "template" };
        instance.rowData={aaa:123};
        instance.rowIndex=1;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).toHaveBeenCalledWith(instance.detail.template, {
            '$implicit': instance.rowData,
            'rowIndex':instance.rowIndex
        });
    })

    it('view.context updates on ngOnChanges', () => {
        let fakeDetail = { template: "template" }, fakeRowData={aaa:234}, fakeRowIndex=1;

        instance.detail = fakeDetail;

        instance.rowData=fakeRowData;

        instance.rowIndex=fakeRowIndex;

        instance.view = { context: {} };

        instance.ngOnChanges();

        expect(instance.view.context.$implicit).toBe(fakeRowData);
        expect(instance.view.context.rowIndex).toBe(fakeRowIndex);
    })


    it('view.context don\'t updates on ngOnChanges when view is not present', () => {
        let fakeDetail = { template: "template" }, fakeRowData={aaa:234}, fakeRowIndex=1;

        instance.detail = fakeDetail;

        instance.rowData=fakeRowData;

        instance.rowIndex=fakeRowIndex;

        instance.view = null;

        instance.ngOnChanges();

        expect(instance.view).toEqual(null);
    })

});