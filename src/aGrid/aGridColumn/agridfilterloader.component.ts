import { Input, Component, ViewContainerRef,OnChanges,EmbeddedViewRef } from "@angular/core";
import {aGridColumn} from './agridcolumn.component';

@Component({
    selector: "a-grid-filter-loader",
    template: ''
})
export class aGridFilterLoader implements OnChanges {
    @Input() column: aGridColumn;

    view:EmbeddedViewRef<any>;

    constructor(private viewContainer: ViewContainerRef) { }
    ngOnInit() {
        if (this.column && this.column.filter && this.column.filter.template) {
            this.view = this.viewContainer.createEmbeddedView(this.column.filter.template,
                {
                    '$implicit': this.column
                });
        }
    }


    ngOnChanges(){
        if(this.view){
            this.view.context.$implicit= this.column;
        }
    }
}
