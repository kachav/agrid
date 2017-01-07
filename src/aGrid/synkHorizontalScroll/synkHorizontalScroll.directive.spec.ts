import { SynkHorizontalScroll } from './synkHorizontalScroll.directive';

import { async, inject, TestBed } from '@angular/core/testing';
import { ElementRef, Component, ViewChild } from '@angular/core';

@Component({
    template: '<div #target></div><div [synkHorizontalScroll]="target"></div>',
    selector: 'test-container'
})
class testContainer {

    @ViewChild(SynkHorizontalScroll) public targetDirective;

    public handleContentUpdated() {

    }

}

describe('synkHorizontalScroll.directive', () => {
    let instance;

    beforeEach(async(() => {

        return TestBed.configureTestingModule({

            declarations: [
                SynkHorizontalScroll, testContainer
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('setElementProperty do not fires when scrollLeft values are equal', () => {
        let scrollLeftValue = 40;
        spyOn(instance.renderer, 'setElementProperty');
        instance.targetElement = { scrollLeft: scrollLeftValue };
        instance.onScroll({ target: { scrollLeft: scrollLeftValue } });
        expect(instance.renderer.setElementProperty).not.toHaveBeenCalled();
    });

    it('setElementProperty fires when scrollLeft values are not equal', () => {
        let scrollLeftValue = 40;
        spyOn(instance.renderer, 'setElementProperty');
        instance.targetElement = { scrollLeft: 20 };
        instance.onScroll({ target: { scrollLeft: scrollLeftValue } });
        expect(instance.renderer.setElementProperty).toHaveBeenCalledWith(instance.targetElement,'scrollLeft',scrollLeftValue);
    });
});