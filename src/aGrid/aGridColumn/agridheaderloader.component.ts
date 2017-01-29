import { Input, Component, ViewContainerRef, OnChanges, EmbeddedViewRef } from "@angular/core";
import { aGridColumn } from './agridcolumn.component';


@Component({
    selector: "a-grid-column-header-loader",
    template: ''
})
export class aGridColumnHeaderLoader implements OnChanges {
    @Input() column: aGridColumn;

    view: EmbeddedViewRef<any>

    constructor(private viewContainer: ViewContainerRef) { }
    ngOnInit() {
        if (this.column && this.column.header && this.column.header.template) {
            this.view = this.viewContainer.createEmbeddedView(this.column.header.template,
                {
                    '$implicit': this.column
                });
        }
    }

    ngOnChanges() {
        if (this.view) {
            this.view.context.$implicit = this.column;
        }
    }
}