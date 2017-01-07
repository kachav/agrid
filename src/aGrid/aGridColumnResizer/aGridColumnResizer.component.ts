import { Component, TemplateRef, ContentChild, Output, EventEmitter, HostListener, HostBinding, Renderer } from "@angular/core";

@Component({
    selector: "a-grid-column-resizer",
    template: `<div class="a-grid__column-resizer" [ngClass]="{'a-grid__column-resizer_active':active}"></div>`,
    styleUrls: ['./aGridColumnResizer.styles.css']
})
export class AGridColumnResizer {
    private active = false;
    private xPrev: number;

    private startRight: number;
    private rightNumber:number;

    constructor(private wnd:Window){
    }

    @Output() columnResized=new EventEmitter();

    @HostBinding('style.right') right:string;

    @HostListener('mousedown', ['$event']) colResizerMouseDown(e) {
        let elStyles = this.wnd.getComputedStyle(e.target.parentNode);
        this.active = true;
        this.startRight = +elStyles.right.replace(/px/, '');
        this.rightNumber=this.startRight;
        this.xPrev = e.pageX;
        this.right = elStyles.right;
    }

    @HostListener('document:mouseup') colResizerMouseUp() {

        if (this.active) {
            this.active = false;
            this.right='';

            this.columnResized.next(this.startRight - this.rightNumber);
        }
    }

    @HostListener('document:mousemove', ['$event']) colResizerMouseMove(e) {
        if (this.xPrev && this.active) {
          this.rightNumber -= (e.pageX - this.xPrev);
          this.right = `${this.rightNumber}px`;
          //save current coordinate as previous coordinate
          this.xPrev = e.pageX;
        }
    }
}