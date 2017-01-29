import { Input, Component, ViewContainerRef, EmbeddedViewRef, OnChanges } from "@angular/core";
import {aGridColumn} from './agridcolumn.component';

@Component({
    selector: "a-grid-column-cell-loader",
    template: ''
})
export class aGridColumnCellLoader implements OnChanges {
    @Input() column: aGridColumn;

    @Input() rowData: any;

    @Input() rowIndex: number;

    view:EmbeddedViewRef<any>

    constructor(private viewContainer: ViewContainerRef) { }
    ngOnInit() {
        if (this.column && this.column.cell && this.column.cell.template) {
            this.view = this.viewContainer.createEmbeddedView(this.column.cell.template,
                {
                    '$implicit': this.rowData,
                    'rowData':this.rowData,
                    'rowColumn': this.column,
                    'rowIndex': this.rowIndex
                });
        }
    }

    ngOnChanges(){
        if(this.view){
            this.view.context.$implicit=this.rowData;
            this.view.context.rowData=this.rowData;
            this.view.context.rowColumn=this.column;
            this.view.context.rowIndex=this.rowIndex;
        }
    }
}