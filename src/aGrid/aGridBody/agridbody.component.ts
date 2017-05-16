import {
    Component, Input, Output,
    EventEmitter, ViewChild, HostListener,
    ChangeDetectionStrategy, ViewEncapsulation
} from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { AGridGroupDirective } from '../aGridGroup/aGridGroup.directive';
import { AGridDetailDirective } from "../aGridDetail/aGridDetail.directive";

@Component({
    selector: 'a-grid-body',
    templateUrl: './agridbody.template.html',
    styleUrls: ['./agridbody.styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class AGridBodyComponent {
    @Input() public items: any[];
    @Input() public selectedProperty: string;
    @Input() public columns: any[];
    @Input() public checkedProperty: string;
    @Input() public groups: AGridGroupDirective[];
    @Input() public detail: AGridDetailDirective;

    public get columnsLength() {
        return this.lastColumnResizable ? this.columns.length + 1 : this.columns.length;
    }

    @Output() public onRowClick = new EventEmitter();
    @Output() public onRowDoubleClick = new EventEmitter();

    private get lastColumnResizable() {
        return !!(this.columns && this.columns.length
            && this.columns[this.columns.length - 1].resizable);
    }
    public rowClick(row) {
        this.onRowClick.next(row);
    }

    public rowDoubleClick(row) {
        this.onRowDoubleClick.next(row);
    }
}
