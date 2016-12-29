import { Directive, ElementRef, Output, HostListener, EventEmitter } from '@angular/core';

import { debounce } from 'lodash';

const DEBOUNCE_TIME = 100;

@Directive({ selector: '[contentUpdated]' })
export class ContentUpdated {
    @Output('contentUpdated') contentUpdated = new EventEmitter();

    constructor(private curElement: ElementRef) {
        // configuration of the observer:
        let config = { attributes: true, childList: true, characterData: true, subtree:true }

        //subtree modified event
        this.observer = new MutationObserver(() => {
            this.domSubTreeModified();
        });
        // pass in the target node, as well as the observer options
        this.observer.observe(this.curElement.nativeElement, config);
    }

    private observer:MutationObserver;

    ngAfterContentInit() {
        this.domSubTreeModified();
    }

    ngOnDestroy(){
        this.observer.disconnect();
    }

    private domSubTreeModified() {
        this.contentUpdated.next(this.curElement.nativeElement.offsetHeight);
    };

}