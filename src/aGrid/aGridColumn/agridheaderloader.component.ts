import { Input, Component, TemplateRef, ContentChild, ElementRef, ViewContainerRef } from "@angular/core";
import {aGridColumn} from './agridcolumn.component';


@Component({
    selector: "a-grid-column-header-loader",
    template: ''
})
export class aGridColumnHeaderLoader {
    @Input() column: aGridColumn;

    constructor(private viewContainer: ViewContainerRef) { }
    ngOnInit() {
        if (this.column && this.column.header && this.column.header.template) {
            this.viewContainer.createEmbeddedView(this.column.header.template,
                {
                    '\$implicit': this.column
                });
        }
    }
}