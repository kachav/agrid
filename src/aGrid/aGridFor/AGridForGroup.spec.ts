import { AGridForGroup } from './AGridForGroup';

import { aGridGroup } from '../aGridGroup/aGridGroup.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

@Component({
    template: '<div *aGridGroup="let group by \'grName\'"></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(aGridGroup) public targetDirective;
}


describe('aGridForGroup', () => {
    let groupInstance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                aGridGroup, testContainer
            ]
        }).compileComponents().then(() => {
            groupInstance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('constructor creates $implicit field with value', () => {
        let testValue = "test value", instance = new AGridForGroup(testValue, groupInstance, 0, 5);

        expect(instance.$implicit.value).toEqual(testValue);
    });

    it('children is empty array by default', () => {
        let instance = new AGridForGroup("test", groupInstance, 0, 5);

        expect(instance.children).toEqual([]);
    });

    it('groupColumns is array with one element = groupInstance', () => {
        let instance = new AGridForGroup("test", groupInstance, 0, 5);

        expect(instance.groupColumns.length).toEqual(1);

        expect(instance.groupColumns[0]).toBe(groupInstance);
    });

})