import { ViewRef } from '@angular/core';

import { aGridGroup } from '../aGridGroup/aGridGroup.directive';

export class AGridForGroup {
    constructor(public value: string, public groupInstance: aGridGroup, public index: number, public count: number) {
        this.$implicit = {
            value
        }
    }

    removeChild(item){
        let index=this.children.indexOf(item);
        if(index>-1){
            item.parent=null;
            this.children.splice(index,1);
        }
    }

    clearChilds(){
        let childArray=[...this.children];

        childArray.forEach(child=>{
            this.removeChild(child);
        })
    }

    addChild(item) {
        if(item.parent){
            item.parent.removeChild(item);
        }

        item.parent = this;
        if (this.children.indexOf(item) === -1) {
            this.children.push(item);
        }
    }

    public $implicit;
    public parent: AGridForGroup;
    public children: Array<any> = [];
    public view: ViewRef;

    get groupColumns(): Array<any> { return [this.groupInstance] };
}