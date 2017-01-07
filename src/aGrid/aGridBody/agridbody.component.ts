import { Component, Input, Output, EventEmitter, ViewChild, HostListener, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'a-grid-body',
    templateUrl: './agridbody.template.html',
    styleUrls: ['./agridbody.styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class aGridBody {
    @Input() items: Array<any>;
    @Input() selectedProperty: string;
    @Input() columns: Array<any>;
    @Input() checkedProperty: string;

    private get lastColumnResizable() {
        return !!(this.columns && this.columns.length && this.columns[this.columns.length - 1].resizable);
    }

    @Output() onRowClick = new EventEmitter();
    @Output() onRowDoubleClick = new EventEmitter();

    rowClick(row) {
        this.onRowClick.next(row);
    }

    rowDoubleClick(row) {
        this.onRowDoubleClick.next(row);
    }

}