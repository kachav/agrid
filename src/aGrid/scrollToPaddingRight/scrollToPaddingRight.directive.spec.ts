import { ScrollToPaddingRightDirective } from './scrollToPaddingRight.directive';

import { async, inject, TestBed } from '@angular/core/testing';

import { Component, ViewChild, Renderer } from '@angular/core';

import { MutationObserverService } from '../utils/mutationObserver.service';

import { LodashService } from '../utils/lodash.service';

let fakeObserver, observerDelegate, fakeObserverService;
class MutationObserverServiceMock {
    getObserver() { }

    constructor() {
        spyOn(this, 'getObserver').and.callFake((delegate) => {
            observerDelegate = delegate;
            return fakeObserver;
        });
    }
}


@Component({
    template: '<div #paddingTarget></div><div [scrollToPaddingRight]="paddingTarget"></div>',
    selector: 'test-container'
})
class testContainer {

    @ViewChild(ScrollToPaddingRightDirective) public targetDirective;

    public handleContentUpdated() {

    }

}

describe('scrollToPaddingRight.directive', () => {
    let instance;

    let debouncedFunction, debounceResult = function () { },
        lodashServiceMock;

    beforeEach(async(() => {
        fakeObserver = {
            observe() { },
            disconnect() { }
        };

        spyOn(fakeObserver, 'observe');
        spyOn(fakeObserver, 'disconnect');

        fakeObserverService = new MutationObserverServiceMock();


        lodashServiceMock = {
            debounce() { }
        }
        spyOn(lodashServiceMock, 'debounce').and.callFake((delegate) => {
            debouncedFunction = delegate;
            return debounceResult;
        });

        return TestBed.configureTestingModule({

            declarations: [
                ScrollToPaddingRightDirective, testContainer
            ],
            providers: [
                { provide: MutationObserverService, useValue: fakeObserverService },
                { provide: LodashService, useValue: lodashServiceMock }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));



    it('getObserver fires when directive is created', () => {
        expect(fakeObserverService.getObserver).toHaveBeenCalled();
    })

    it('observer is result of fakeObserverService.getObserver', () => {
        expect(instance.observer).toBe(fakeObserver);
    })

    it('observer.observe fires on directive creation', () => {
        expect(fakeObserver.observe).toHaveBeenCalledWith(instance.curElement.nativeElement, { childList: true, subtree: true });
    })

    it('debounce fires on directive creation', () => {
        expect(lodashServiceMock.debounce).toHaveBeenCalled();
    })

    it('windowResize is result of debounce', () => {
        expect(instance.windowResize).toBe(debounceResult);
    })

    it('calculatePadding fires in debounced function', () => {
        spyOn(instance, 'calculatePadding');
        debouncedFunction();
        expect(instance.calculatePadding).toHaveBeenCalled();
    })

    it('calculatePadding fires in ngAfterViewInit', () => {
        spyOn(instance, 'calculatePadding');
        instance.ngAfterViewInit();
        expect(instance.calculatePadding).toHaveBeenCalled();
    })

    it('calculatePadding fires in observer callback', () => {
        spyOn(instance, 'calculatePadding');
        observerDelegate();
        expect(instance.calculatePadding).toHaveBeenCalled();
    })

    it('observer.disconnect fires on ngOnDestroy', () => {
        instance.ngOnDestroy();
        expect(fakeObserver.disconnect).toHaveBeenCalled();
    })

    it('setElementStyle do not fires without target element', () => {
        spyOn(instance.renderer,'setElementStyle');
        instance.targetElement = null;
        instance.calculatePadding();
        expect(instance.renderer.setElementStyle).not.toHaveBeenCalled();
    })

    it('setElementStyle do not fires when padding is not changed', () => {

        spyOn(instance.renderer,'setElementStyle');
        instance.paddingRight = 0;
        instance.targetElement = { aaa: 123 };
        instance.curElement = { nativeElement: { offsetWidth: 30, clientWidth: 30 } };
        instance.calculatePadding();
        expect(instance.renderer.setElementStyle).not.toHaveBeenCalled();
    })


    it('setElementStyle fires when padding is changed', () => {
        spyOn(instance.renderer,'setElementStyle');
        instance.paddingRight = 0;
        instance.targetElement = { aaa: 123 };
        instance.curElement = { nativeElement: { offsetWidth: 50, clientWidth: 30 } };
        instance.calculatePadding();
        expect(instance.paddingRight).toEqual(20);
        expect(instance.renderer.setElementStyle).toHaveBeenCalledWith(instance.targetElement, 'padding-right', '20px');
    })

});