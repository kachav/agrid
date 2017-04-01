import { AGridForGroup } from './AGridForGroup';

import { AGridGroupDirective } from '../aGridGroup/aGridGroup.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

@Component({
    template: '<div *aGridGroup="let group by \'grName\'"></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGridGroupDirective) public targetDirective;
}


describe('aGridForGroup', () => {
    let groupInstance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridGroupDirective, testContainer
            ]
        }).compileComponents().then(() => {
            groupInstance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('constructor creates $implicit field with value', () => {
        let testValue = "test value", instance = new AGridForGroup(testValue, groupInstance,0);

        expect(instance.$implicit.value).toEqual(testValue);
    });

    it('children is empty array by default', () => {
        let instance = new AGridForGroup("test", groupInstance,0);

        expect(instance.children).toEqual([]);
    });

    it('addChild removes current item from it\'s parent', () => {
        let instance = new AGridForGroup("test", groupInstance,0),
            parent = { removeChild(value) { } }, item: any = { aa: 22 };

        spyOn(parent, 'removeChild');

        item.parent = parent;

        instance.addChild(item);

        expect(parent.removeChild).toHaveBeenCalled();

        expect(instance.children).toContain(item);
    });

    it('addChild adding item to it\'s children if children do not contains item', () => {
        let instance = new AGridForGroup("test", groupInstance,0), item = { aa: 22 }, item2 = { aa: 33 };

        instance.addChild(item);

        expect(instance.children).toContain(item);

        instance.addChild(item2);

        expect(instance.children).toContain(item2);
    });

    it('removeChild removes an item from children array', () => {
        let instance = new AGridForGroup("test", groupInstance,0), item: any = { aa: 22 };

        instance.addChild(item);

        expect(item.parent).toBe(instance);

        expect(instance.children).toContain(item);

        instance.removeChild(item);

        expect(item.parent).toBeNull();

        expect(instance.children).not.toContain(item);
    });

    it('removeChild do not removes not existing childs', () => {
        let instance = new AGridForGroup("test", groupInstance,0), item: any = { aa: 22, parent: null };

        expect(item.parent).toBeNull();

        expect(instance.children).not.toContain(item);

        instance.removeChild(item);

        expect(item.parent).toBeNull();

        expect(instance.children).not.toContain(item);
    });

    it('clearChilds fires removeChild on each child element', () => {
        let instance = new AGridForGroup("test", groupInstance,0), testChilds=[{aa:11},{aa:22},{aa:33},{aa:44}];

        spyOn(instance,'removeChild');

        instance.children=testChilds;

        instance.clearChilds();

        testChilds.forEach((item)=>{
            expect(instance.removeChild).toHaveBeenCalledWith(item);
        });
    });

})