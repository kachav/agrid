import { Input, Component, ViewContainerRef,OnChanges,EmbeddedViewRef } from "@angular/core";
import {aGridGroup} from './aGridGroup.directive';

@Component({
    selector: "a-grid-group-loader",
    template: ''
})
export class aGridGroupLoader implements OnChanges {
    @Input() group: aGridGroup;

    @Input() groupData: any;

    @Input() children:Array<any>;

    @Input() groupLevel:number;

    view:EmbeddedViewRef<any>

    constructor(private viewContainer: ViewContainerRef) { }
    ngOnInit() {
        if (this.group && this.group.template) {
            this.view = this.viewContainer.createEmbeddedView(this.group.template,
                {
                    '$implicit': this.groupData,
                    'group': this.groupData,
                    'children':this.children,
                    'groupLevel':this.groupLevel
                });
        }
    }

    ngOnChanges(){
        if(this.view){
            this.view.context.$implicit= this.groupData;
            this.view.context.group=this.groupData;
            this.view.context.children=this.children;
        }
    }
}