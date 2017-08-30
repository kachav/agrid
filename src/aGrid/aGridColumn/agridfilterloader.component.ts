import { Input, Component, ViewContainerRef, OnChanges, EmbeddedViewRef } from '@angular/core';
import { AGridColumnComponent } from './agridcolumn.component';

@Component({
    selector: 'a-grid-filter-loader',
    template: ''
})
export class AGridFilterLoaderComponent implements OnChanges {
    @Input() public column: AGridColumnComponent;

    private view: EmbeddedViewRef<any>;

    constructor(private viewContainer: ViewContainerRef) { }
    public ngOnInit() {
        if (this.column && this.column.filter && this.column.filter.template) {
            this.view = this.viewContainer.createEmbeddedView(this.column.filter.template,
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
