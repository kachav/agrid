import { Directive, Input, HostListener, Renderer } from '@angular/core';

@Directive({ selector: '[synkHorizontalScroll]' })
export class SynkHorizontalScrollDirective {
    @Input('synkHorizontalScroll') public targetElement;

    constructor(private renderer: Renderer) {
    }

    @HostListener('scroll', ['$event']) public onScroll(e) {
        if (this.targetElement && e.target.scrollLeft !== this.targetElement.scrollLeft) {
            this.renderer.setElementProperty(this.targetElement, 'scrollLeft', e.target.scrollLeft);
        }
    };
}
