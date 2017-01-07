import { Directive, Input, HostListener, Renderer } from '@angular/core';


@Directive({ selector: '[synkHorizontalScroll]' })
export class SynkHorizontalScroll {
    @Input('synkHorizontalScroll') targetElement;

    constructor(private renderer: Renderer) {

    }


    @HostListener('scroll', ['$event']) onScroll(e) {
        if (e.target.scrollLeft !== this.targetElement.scrollLeft) {
            this.renderer.setElementProperty(this.targetElement, "scrollLeft", e.target.scrollLeft);
        }
    };
}