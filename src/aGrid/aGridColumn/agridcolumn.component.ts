import { Input, Component, TemplateRef, ContentChild, ElementRef, ViewContainerRef } from "@angular/core";
import {aGridCell} from './agridcell.component';
import {aGridHeader} from './agridheader.component';
import {aGridFilter} from './agridfilter.component';

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
}