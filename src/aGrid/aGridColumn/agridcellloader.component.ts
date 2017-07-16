import { Input, Component, ViewContainerRef, EmbeddedViewRef, OnChanges } from '@angular/core';
import { AGridColumnComponent } from './agridcolumn.component';

@Component({
    selector: 'a-grid-column-cell-loader',
    template: ''
})
export class AGridColumnCellLoaderComponent implements OnChanges {
    @Input() public column: AGridColumnComponent;

    @Input() public rowData: any;

    @Input() public rowIndex: number;

    @Input() public rowElement: any;

    private view: EmbeddedViewRef<any>;

    constructor(private viewContainer: ViewContainerRef) { }
    public ngOnInit() {
        if (this.column && this.column.cell && this.column.cell.template) {
            this.view = this.viewContainer.createEmbeddedView(this.column.cell.template,
                {
                    $implicit: this.rowData,
                    rowData: this.rowData,
                    rowColumn: this.column,
                    rowIndex: this.rowIndex,
                    rowElement: this.rowElement
                });
        }
    }

    public ngOnChanges() {
        if (this.view) {
            this.view.context.$implicit = this.rowData;
            this.view.context.rowData = this.rowData;
            this.view.context.rowColumn = this.column;
            this.view.context.rowIndex = this.rowIndex;
            this.view.context.rowElement = this.rowElement;
        }
    }
}
