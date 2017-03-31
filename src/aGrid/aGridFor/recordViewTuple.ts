import {EmbeddedViewRef} from '@angular/core';

import {AGridForRow} from './AGridForRow';

export class RecordViewTuple {
    constructor(public record: any, public view: EmbeddedViewRef<AGridForRow>) { }
}
