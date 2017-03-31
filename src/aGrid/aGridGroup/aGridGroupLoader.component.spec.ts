import { AGridGroupLoaderComponent } from './aGridGroupLoader.component';

import { ViewContainerRef } from "@angular/core";

import { async, TestBed } from '@angular/core/testing';

class ViewContainerRefMock {
    createEmbeddedView() {

    }
}

describe('aGridGroupLoader.component', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridGroupLoaderComponent
            ],
            providers: [
                { provide: ViewContainerRef, useClass: ViewContainerRefMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(AGridGroupLoaderComponent).componentInstance;
        });
    }));

    it('createEmbeddedView do not fires without group', () => {
        instance.group = null;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView do not fires without template', () => {
        instance.group = { template: null };
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).not.toHaveBeenCalled();
    })

    it('createEmbeddedView fires with template', () => {
        instance.group = { template: "template" };
        instance.groupData={aaa:123};
        instance.children=[{aaa:333},{sss:434}];
        instance.groupLevel=2;
        spyOn(instance.viewContainer, 'createEmbeddedView');
        instance.ngOnInit();
        expect(instance.viewContainer.createEmbeddedView).toHaveBeenCalledWith(instance.group.template, {
            '$implicit': instance.groupData,
            'group':instance.groupData,
            'children':instance.children,
            'groupLevel':2
        });
    })

    it('view.context updates on ngOnChanges', () => {
        let fakeGroup = { template: "template" }, fakeGroupData={aaa:234}, fakeChildren=[{aaa:234},{ddd:334}];

        instance.group = fakeGroup;

        instance.groupData=fakeGroupData;

        instance.children=fakeChildren;

        instance.view = { context: {} };

        instance.ngOnChanges();

        expect(instance.view.context.$implicit).toBe(fakeGroupData);
        expect(instance.view.context.group).toBe(fakeGroupData);
        expect(instance.view.context.children).toBe(fakeChildren);
    })


    it('view.context don\'t updates on ngOnChanges when view is not present', () => {
        let fakeGroup = { template: "template" }, fakeGroupData={aaa:234}, fakeChildren=[{aaa:234},{ddd:334}];

        instance.group = fakeGroup;

        instance.groupData=fakeGroupData;

        instance.children=fakeChildren;

        instance.view = null;

        instance.ngOnChanges();

        expect(instance.view).toEqual(null);
    })

});