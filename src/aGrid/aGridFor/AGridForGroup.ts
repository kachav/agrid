import { ViewRef } from '@angular/core';

import { AGridGroupDirective } from '../aGridGroup/aGridGroup.directive';

export class AGridForGroup {

    public $implicit;
    public parent: AGridForGroup;
    public children: any[] = [];
    public view: ViewRef;
    constructor(public value: string,
                public groupInstance: AGridGroupDirective,
                public groupLevel: number) {
        this.$implicit = {
            value
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
        if (this.children.indexOf(item) === -1) {
            this.children.push(item);
        }
    }
}
