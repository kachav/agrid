import { Input, Component, ViewContainerRef, OnChanges, EmbeddedViewRef } from '@angular/core';
import { AGridColumnComponent } from './agridcolumn.component';

@Component({
    selector: 'a-grid-column-header-loader',
    template: ''
})
export class AGridColumnHeaderLoaderComponent implements OnChanges {
    @Input() public column: AGridColumnComponent;

    private view: EmbeddedViewRef<any>;

    constructor(private viewContainer: ViewContainerRef) { }
    public ngOnInit() {
        if (this.column && this.column.header && this.column.header.template) {
            this.view = this.viewContainer.createEmbeddedView(this.column.header.template,
                {
                    $implicit: this.column
                });
        }
    }

    public ngOnChanges() {
        if (this.view) {
            this.view.context.$implicit = this.column;
        }
    }
}
