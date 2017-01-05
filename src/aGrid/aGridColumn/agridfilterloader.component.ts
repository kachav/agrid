import { Input, Component, ViewContainerRef } from "@angular/core";
import {aGridColumn} from './agridcolumn.component';

@Component({
    selector: "a-grid-filter-loader",
    template: ''
})
export class aGridFilterLoader {
    @Input() column: aGridColumn;

    constructor(private viewContainer: ViewContainerRef) { }
    ngOnInit() {
        if (this.column && this.column.filter && this.column.filter.template) {
            this.viewContainer.createEmbeddedView(this.column.filter.template,
                {
                    '\$implicit': this.column
                });
        }
    }
}
