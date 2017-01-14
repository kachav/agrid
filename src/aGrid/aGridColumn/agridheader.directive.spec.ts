import {aGridHeader} from './agridheader.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

@Component({
    template: '<div *aGridHeader></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(aGridHeader) public targetDirective;
}


describe('aGridHeader.component', () => {
    let templatRefMock={},instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                aGridHeader, testContainer
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('aGridHeader is a constructor',()=>{
        expect(typeof instance).toEqual('object');
    });

    it('aGridHeader.template should be instance of TemplateRef',()=>{
        let result = instance.template instanceof TemplateRef;

        expect(result).toEqual(true);
    });
})