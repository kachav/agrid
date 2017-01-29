import {ViewRef} from '@angular/core';

import { aGridGroup } from '../aGridGroup/aGridGroup.directive';

export class AGridForGroup {
    constructor(public value: string, public groupInstance: aGridGroup, public index: number, public count: number) {
        this.$implicit = {
            value
        }
    }
    public $implicit;
    public parent: AGridForGroup;
    public children: Array<any> = [];
    public view: ViewRef;

    get groupColumns(): Array<any> { return [this.groupInstance] };
}