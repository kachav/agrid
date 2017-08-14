import {AGridFilterDirective} from './agridfilter.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';


@Component({
    template: '<div *aGridFilter></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGridFilterDirective) public targetDirective;
}


describe('aGridFilter.component', () => {
    let templatRefMock={},instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridFilterDirective, testContainer
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