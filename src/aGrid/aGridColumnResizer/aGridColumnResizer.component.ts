import {
    Component, TemplateRef, ContentChild,
    Output, EventEmitter, HostListener,
    HostBinding, Renderer, Inject, ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'a-grid-column-resizer',
    template: `<div class='a-grid__column-resizer'></div>`,
    styleUrls: ['./aGridColumnResizer.styles.css'],
    encapsulation: ViewEncapsulation.None
})
export class AGridColumnResizerComponent {

    @Output() public columnResized = new EventEmitter();

    private active = false;
    private xPrev: number;

    private startRight: number;
    private rightNumber: number;

    @HostListener('mousedown', ['$event']) public colResizerMouseDown(e) {
        this.active = true;
        this.startRight = 0;
        this.rightNumber = this.startRight;
        this.xPrev = e.pageX;
    }

    @HostListener('document:mouseup') public colResizerMouseUp() {

        if (this.active) {
            this.active = false;

            this.columnResized.next(this.startRight - this.rightNumber);
        }
    }

    @HostListener('document:mousemove', ['$event']) public colResizerMouseMove(e) {
        if (this.xPrev && this.active) {
            this.startRight = this.rightNumber;
            this.rightNumber -= (e.pageX - this.xPrev);
            // save current coordinate as previous coordinate
            this.xPrev = e.pageX;

            this.columnResized.next(this.startRight - this.rightNumber);
        }
    }
}
