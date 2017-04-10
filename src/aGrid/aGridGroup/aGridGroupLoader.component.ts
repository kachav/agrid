import { Input, Component, ViewContainerRef, OnChanges, EmbeddedViewRef } from '@angular/core';
import { AGridGroupDirective } from './aGridGroup.directive';

@Component({
    selector: 'a-grid-group-loader',
    template: ''
})
export class AGridGroupLoaderComponent implements OnChanges {
    @Input() public group: AGridGroupDirective;

    @Input() public groupData: any;

    @Input() public children: any[];

    @Input() public groupLevel: number;

    @Input() public collapsed: boolean;

    private view: EmbeddedViewRef<any>;

    constructor(private viewContainer: ViewContainerRef) { }
    public ngOnInit() {
        if (this.group && this.group.template) {
            this.view = this.viewContainer.createEmbeddedView(this.group.template,
                {
                    $implicit: this.groupData,
                    group: this.groupData,
                    children: this.children,
                    groupLevel: this.groupLevel,
                    collapsed: this.collapsed
                });
        }
    }

    public ngOnChanges() {
        if (this.view) {
            this.view.context.$implicit = this.groupData;
            this.view.context.group = this.groupData;
            this.view.context.children = this.children;
            this.view.context.groupInstance = this.group;
            this.view.context.collapsed = this.collapsed;
        }
    }
}
