import {Injectable} from '@angular/core';

@Injectable()
export class MutationObserverService{
    getObserver(delegate:MutationCallback){
        return new MutationObserver(delegate);
    }
}