import {ViewRef} from '@angular/core';

import {AGridForGroup} from './AGridForGroup';

export class AGridForRow {
    public parent: AGridForGroup;

    public view: ViewRef;

    constructor(public $implicit: any, public index: number, public count: number) { }

    get first(): boolean { return this.index === 0; }

    get last(): boolean { return this.index === this.count - 1; }

    get even(): boolean { return this.index % 2 === 0; }

    get odd(): boolean { return !this.even; }
}
