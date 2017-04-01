import {AGridCellDirective} from './agridcell.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

@Component({
    template: '<div *aGridCell></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGridCellDirective) public targetDirective;
}


describe('agridcell.directive', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridCellDirective, testContainer
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('aGridCell is a constructor',()=>{
        expect(typeof instance).toEqual('object');
    });

    it('aGridCell.template should be instance of TemplateRef',()=>{
        let result = instance.template instanceof TemplateRef;

        expect(result).toEqual(true);
    });
})