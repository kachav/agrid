import { Directive, ElementRef, Input, HostListener, Renderer } from '@angular/core';

import { debounce } from 'lodash';

const DEBOUNCE_TIME = 100;

@Directive({ selector: '[scrollToPaddingRight]' })
export class ScrollToPaddingRight {
    @Input('scrollToPaddingRight') targetElement;

    private paddingRight = 0;

    private observer: MutationObserver;

    constructor(private curElement: ElementRef, private renderer: Renderer) {
        // configuration of the observer:
        let config = { childList: true, subtree:true }

        //subtree modified event
        this.observer = new MutationObserver(() => {
            this.calculatePadding();
        });
        // pass in the target node, as well as the observer options
        this.observer.observe(this.curElement.nativeElement, config);

        this.windowResize = debounce(() => {
            this.calculatePadding();
        }, DEBOUNCE_TIME);
    }

    ngAfterViewInit() {
        this.calculatePadding();
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

    ngOnDestroy() {
        this.observer.disconnect();
    }

    @HostListener('window:resize') windowResize;
}