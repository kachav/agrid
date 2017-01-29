import { aGridGroup } from './aGridGroup.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

@Component({
    template: '<div *aGridGroup="let group by \'grName\'"></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(aGridGroup) public targetDirective;
}


describe('aGridGroup.component', () => {
    let templatRefMock = {}, instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                aGridGroup, testContainer
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('aGridGroup is a constructor', () => {
        expect(typeof instance).toEqual('object');
    });

    it('aGridGroup.template should be instance of TemplateRef', () => {
        let result = instance.template instanceof TemplateRef;

        expect(result).toEqual(true);
    });
})