import { Component, TemplateRef, ContentChild, Output, EventEmitter, HostListener, HostBinding } from "@angular/core";

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

    @Output() columnResized=new EventEmitter();

    @HostBinding('style.right') right:string;

    @HostListener('mousedown', ['$event']) colResizerMouseDown(e) {
        let elStyles = getComputedStyle(e.target.parentNode);//, elRight = +elStyles.right.replace(/px/, '');
        this.active = true;
        this.startRight = +elStyles.right.replace(/px/, '');
        this.rightNumber=this.startRight;
        this.xPrev = e.pageX;
        this.right = elStyles.right;
    }

    @HostListener('document:mouseup', ['$event']) colResizerMouseUp(e) {

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