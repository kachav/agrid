import { Directive, ElementRef, Output, HostListener, EventEmitter } from '@angular/core';

import { debounce } from 'lodash';

const DEBOUNCE_TIME = 100;

@Directive({ selector: '[contentUpdated]' })
export class ContentUpdated {
    @Output('contentUpdated') contentUpdated=new EventEmitter();

    constructor(private curElement: ElementRef) {
        //subtree modified event
        this.domSubTreeModified = debounce(() => {
            this.contentUpdated.next(this.curElement.nativeElement.offsetHeight);
        }, DEBOUNCE_TIME);
    }

    ngAfterContentInit(){
        this.domSubTreeModified();
    }

    @HostListener('DOMSubtreeModified') domSubTreeModified;

}