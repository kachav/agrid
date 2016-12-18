import { Input, Component, TemplateRef, ContentChild, ElementRef, ViewContainerRef } from "@angular/core";
import {aGridColumn} from './agridcolumn.component';

@Component({
    selector: "a-grid-column-cell-loader",
    template: ''
})
export class aGridColumnCellLoader {
    @Input() column: aGridColumn;

    @Input() rowData: any;

    @Input() rowIndex: number;

    constructor(private viewContainer: ViewContainerRef) { }
    ngOnInit() {
        if (this.column && this.column.cell && this.column.cell.template) {
            this.viewContainer.createEmbeddedView(this.column.cell.template,
                {
                    '\$implicit': this.column,
                    'rowData': this.rowData,
                    'rowIndex': this.rowIndex
                });
        }
    }
}