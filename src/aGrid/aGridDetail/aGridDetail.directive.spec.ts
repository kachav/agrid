

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';
import { AGridDetailDirective } from "./aGridDetail.directive";

@Component({
    template: '<div *aGridDetail="let index=rowIndex expandedrows expandedRows;"></div>',
    selector: 'test-container'
})
class testContainer {
    public expandedRows=[{aaa:123}];

    @ViewChild(AGridDetailDirective) public targetDirective;
}


describe('aGridDetail.directive', () => {
    let templatRefMock = {}, instance: AGridDetailDirective, wrapper:testContainer;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridDetailDirective, testContainer
            ]
        }).compileComponents().then(() => {
            wrapper=TestBed.createComponent(testContainer).componentInstance
            instance = wrapper.targetDirective;
        });
    }));



    it('AGridDetailDirective is a constructor', () => {
        expect(typeof instance).toEqual('object');
    });

    it('AGridDetailDirective.template should be instance of TemplateRef', () => {
        let result = instance.template instanceof TemplateRef;

        expect(result).toEqual(true);
    });
});