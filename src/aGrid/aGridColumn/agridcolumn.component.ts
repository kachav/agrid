import { Input, Component, TemplateRef, ContentChild, ElementRef, ViewContainerRef } from "@angular/core";
import {aGridCell} from './agridcell.directive';
import {aGridHeader} from './agridheader.directive';
import {aGridFilter} from './agridfilter.directive';

@Component({
    selector: "a-grid-column",
    template: `<ng-content></ng-content>`
})
export class aGridColumn {
    @ContentChild(aGridCell) cell;
    @ContentChild(aGridHeader) header;
    @ContentChild(aGridFilter) filter;
    @Input() colName:string;
    @Input() colTitle:string;
    @Input() resizable:boolean = true;
    @Input() width:number = 100;

    public setWidth(_width:number){
        this.width=_width;
    }

    public changeWidth(_change:number){
        this.setWidth(this.width+_change);
    }
}