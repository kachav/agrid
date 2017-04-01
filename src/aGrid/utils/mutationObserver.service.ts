import { Injectable } from '@angular/core';

@Injectable()
export class MutationObserverService {
    public getObserver(delegate: MutationCallback) {
        return new MutationObserver(delegate);
    }
}
