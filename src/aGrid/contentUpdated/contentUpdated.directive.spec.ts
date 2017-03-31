import { async, inject, TestBed } from '@angular/core/testing';

import { ContentUpdatedDirective } from './contentUpdated.directive';

import { ElementRef, Component, ViewChild } from '@angular/core';

import { MutationObserverService } from '../utils/mutationObserver.service';

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
    template: '<div (contentUpdated)="handleContentUpdated()"></div>',
    selector: 'test-container'
})
class testContainer {

    @ViewChild(ContentUpdatedDirective) public targetDirective;

    public handleContentUpdated() {

    }

}

describe('contentUpdated.directive', () => {
    let instance;

    beforeEach(async(() => {

        fakeObserver = {
            observe() { },
            disconnect() { }
        };

        spyOn(fakeObserver, 'observe');
        spyOn(fakeObserver, 'disconnect');

        fakeObserverService = new MutationObserverServiceMock();

        return TestBed.configureTestingModule({

            declarations: [
                ContentUpdatedDirective, testContainer
            ],
            providers: [
                { provide: MutationObserverService, useValue: fakeObserverService }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('getObserver fires when directive is created', () => {
        expect(fakeObserverService.getObserver).toHaveBeenCalled();
    })

    it('observer.observe fires when directive is created', () => {
        expect(fakeObserver.observe).toHaveBeenCalledWith(instance.curElement.nativeElement, { attributes: true, childList: true, characterData: true, subtree: true });
    })

    it('domSubTreeModified method fires on observer event', () => {
        spyOn(instance, 'domSubTreeModified');
        observerDelegate();
        expect(instance.domSubTreeModified).toHaveBeenCalled();
    })

    it('domSubTreeModified method fires on ngAfterContentInit', () => {
        spyOn(instance, 'domSubTreeModified');
        instance.ngAfterContentInit();
        expect(instance.domSubTreeModified).toHaveBeenCalled();
    })

    it('contentUpdated.next method fires on domSubTreeModified', () => {
        spyOn(instance.contentUpdated, 'next');
        instance.domSubTreeModified();
        expect(instance.contentUpdated.next).toHaveBeenCalled();
    })

    it('observer.disconnect method fires on ngOnDestroy', () => {
        instance.ngOnDestroy();
        expect(fakeObserver.disconnect).toHaveBeenCalled();
    })

});