import { ViewRef } from '@angular/core';

import { AGridGroupDirective } from '../aGridGroup/aGridGroup.directive';

export class AGridForGroup {

    public $implicit;
    public parent: AGridForGroup;
    public children: any[] = [];
    public view: ViewRef;

    // show - collapsed this group instance or not
    public get collapsed() {
        let parentCollapsed = this.parent ? this.parent.collapsed : false;

        return !!this.groupInstance.isCollapsed(this.$implicit) || parentCollapsed;
    }

    constructor(public value: string,
        public groupInstance: AGridGroupDirective,
        public groupLevel: number) {
        this.$implicit = {
            value,
            toggleCollapse: () => {
                this.groupInstance.toggleCollapse(this.$implicit);
            },
            collapse: () => {
                this.groupInstance.collapse(this.$implicit);
            },
            expand: () => {
                this.groupInstance.expand(this.$implicit);
            }
        };
    }

    public removeChild(item) {
        let index = this.children.indexOf(item);
        if (index > -1) {
            item.parent = null;
            this.children.splice(index, 1);
        }
    }

    public clearChilds() {
        let childArray = [...this.children];

        childArray.forEach((child) => {
            this.removeChild(child);
        });
    }

    public addChild(item) {
        if (item.parent) {
            item.parent.removeChild(item);
        }

        item.parent = this;
        this.children.push(item);

    }
}
