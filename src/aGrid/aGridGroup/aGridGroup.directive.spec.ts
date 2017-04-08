import { AGridGroupDirective } from './aGridGroup.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

@Component({
    template: '<div *aGridGroup="let group by \'grName\'"></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGridGroupDirective) public targetDirective;
}


describe('aGridGroup.component', () => {
    let templatRefMock = {}, instance: AGridGroupDirective;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridGroupDirective, testContainer
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

    it('Can collapse', () => {
        let key = { aaa: 123 };

        expect(instance.isCollapsed(key)).toEqual(false);

        instance.collapse(key);

        expect(instance.isCollapsed(key)).toEqual(true);
    });

    it('Can expand', () => {
        let key = { aaa: 123 };

        expect(instance.isCollapsed(key)).toEqual(false);

        instance.collapse(key);

        expect(instance.isCollapsed(key)).toEqual(true);

        instance.expand(key);

        expect(instance.isCollapsed(key)).toEqual(false);
    });

    it('Can toggle collapse', () => {
        let key = { aaa: 123 };

        expect(instance.isCollapsed(key)).toEqual(false);

        instance.toggleCollapse(key);

        expect(instance.isCollapsed(key)).toEqual(true);

        instance.toggleCollapse(key);

        expect(instance.isCollapsed(key)).toEqual(false);
    });

    it('Can delete collapse', () => {
        let key = { aaa: 123 };

        expect(instance.isCollapsed(key)).toEqual(false);

        instance.collapse(key);

        expect(instance.isCollapsed(key)).toEqual(true);

        instance.deleteCollapse(key);

        expect(instance.isCollapsed(key)).toEqual(false);
    });

})