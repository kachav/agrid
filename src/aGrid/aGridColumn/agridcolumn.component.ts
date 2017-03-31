import {
    Input, Component, TemplateRef, ContentChild,
    ElementRef, ViewContainerRef
} from '@angular/core';
import { AGridCellDirective } from './agridcell.directive';
import { AGridHeaderDirective } from './agridheader.directive';
import { AGridFilterDirective } from './agridfilter.directive';

@Component({
    selector: 'a-grid-column',
    template: `<ng-content></ng-content>`
})
export class AGridColumnComponent {
    @Input() public colName: string;
    @Input() public colTitle: string;
    @Input() public resizable: boolean = true;
    @Input() public width: number = 100;

    @ContentChild(AGridCellDirective) public cell;
    @ContentChild(AGridHeaderDirective) public header;
    @ContentChild(AGridFilterDirective) public filter;

    public setWidth(_width: number) {
        this.width = _width;
    }

    public changeWidth(_change: number) {
        this.setWidth(this.width + _change);
    }
}
