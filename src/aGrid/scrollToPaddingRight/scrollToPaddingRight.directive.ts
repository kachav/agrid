import { Directive, ElementRef, Input, HostListener, Renderer } from '@angular/core';

import { MutationObserverService } from '../utils/mutationObserver.service';

import { LodashService } from '../utils/lodash.service';

const DEBOUNCE_TIME = 100;

@Directive({ selector: '[scrollToPaddingRight]' })
export class ScrollToPaddingRightDirective {
    @Input('scrollToPaddingRight') public targetElement;

    private paddingRight = 0;

    private observer: MutationObserver;

    @HostListener('window:resize') private windowResize;

    constructor(private curElement: ElementRef, private renderer: Renderer,
        private observerBuilder: MutationObserverService, private _: LodashService) {
        // configuration of the observer:
        let config = { childList: true, subtree: true };

        // subtree modified event
        this.observer = this.observerBuilder.getObserver(() => {
            this.calculatePadding();
        });
        // pass in the target node, as well as the observer options
        this.observer.observe(this.curElement.nativeElement, config);

        this.windowResize = this._.debounce(() => {
            this.calculatePadding();
        }, DEBOUNCE_TIME);
    }

    public ngAfterViewInit() {
        this.calculatePadding();
    }

    public ngOnDestroy() {
        this.observer.disconnect();
    }

    // calculating width of current element's vertical scrollbar
    // and set it as padding right to target element
    private calculatePadding() {
        if (this.targetElement) {
            let newPaddingRight = this.curElement.nativeElement.offsetWidth
                - this.curElement.nativeElement.clientWidth;

            if (newPaddingRight !== this.paddingRight) {
                this.paddingRight = newPaddingRight;

                this.renderer
                    .setElementStyle(this.targetElement, 'padding-right', `${newPaddingRight}px`);
            }
        }
    }
}
