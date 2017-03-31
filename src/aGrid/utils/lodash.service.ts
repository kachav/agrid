import { debounce } from 'lodash';

import { Injectable } from '@angular/core';

@Injectable()
export class LodashService {
    public debounce: any;
    constructor() {
        this.debounce = debounce;
    }
}
