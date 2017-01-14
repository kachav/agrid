import {aGridFilter} from './agridfilter.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';


@Component({
    template: '<div *aGridFilter></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(aGridFilter) public targetDirective;
}


describe('aGridFilter.component', () => {
    let templatRefMock={},instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                aGridFilter, testContainer
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('aGridFilter is a constructor',()=>{
        expect(typeof instance).toEqual('object');
    });

    it('aGridFilter.template should be instance of TemplateRef',()=>{
        let result = instance.template instanceof TemplateRef;

        expect(result).toEqual(true);
    });
})