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

    @Output() onSelect = new EventEmitter();
    @Output() onCheck = new EventEmitter();

    constructor() {
    }

    rowSelect(i) {
        this.onSelect.next(i);
    }

    rowCheck(value, i) {
        this.onCheck.next([value, i]);
    }

}