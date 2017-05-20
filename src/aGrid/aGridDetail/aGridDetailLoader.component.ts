import { Input, Component, ViewContainerRef, OnChanges, EmbeddedViewRef } from '@angular/core';
import { AGridDetailDirective } from './aGridDetail.directive';

@Component({
    selector: 'a-grid-detail-loader',
    template: ''
})
export class AGridDetailLoaderComponent implements OnChanges {
    @Input() public detail: AGridDetailDirective;

    @Input() public rowData: any;

    @Input() public rowIndex: number;

    private view: EmbeddedViewRef<any>;

    constructor(private viewContainer: ViewContainerRef) { }
    public ngOnInit() {
        if (this.detail && this.detail.template) {
            this.view = this.viewContainer.createEmbeddedView(this.detail.template,
                {
                    $implicit: this.rowData,
                    rowIndex: this.rowIndex
                });
        }
    }

    public ngOnChanges() {
        if (this.view) {
            this.view.context.$implicit = this.rowData;
            this.view.context.rowIndex = this.rowIndex;
        }
    }
}
