import { Directive, ElementRef, Input, HostListener, Renderer } from '@angular/core';

import { debounce } from 'lodash';

const DEBOUNCE_TIME = 100;

@Directive({ selector: '[scrollToPaddingRight]' })
export class ScrollToPaddingRight {
    @Input('scrollToPaddingRight') targetElement;

    private paddingRight = 0;

    constructor(private curElement: ElementRef, private renderer: Renderer) {
        //subtree modified event
        this.domSubTreeModified = debounce(() => {
            this.calculatePadding();
        }, DEBOUNCE_TIME);

        this.windowResize = debounce(() => {
            this.calculatePadding();
        }, DEBOUNCE_TIME);
    }


    //calculating width of current element's vertical scrollbar and set it as padding right to target element
    private calculatePadding() {
        if (this.targetElement) {
            let newPaddingRight = this.curElement.nativeElement.offsetWidth - this.curElement.nativeElement.clientWidth;

            if (newPaddingRight !== this.paddingRight) {
                this.paddingRight = newPaddingRight;

                this.renderer.setElementStyle(this.targetElement, "padding-right", `${newPaddingRight}px`);
            }
        }
    }

    @HostListener('DOMSubtreeModified') domSubTreeModified;

    @HostListener('window:resize') windowResize;
}