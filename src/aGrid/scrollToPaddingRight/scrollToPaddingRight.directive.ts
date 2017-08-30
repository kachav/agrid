import { Subject } from 'rxjs/Subject';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { MutationObserverService } from '../utils/mutationObserver.service';

const DEBOUNCE_TIME = 100;

@Directive({ selector: '[scrollToPaddingRight]' })
export class ScrollToPaddingRightDirective {

    private observer: MutationObserver;

    private _destroy=new Subject();

    private destroy$=this._destroy.asObservable().first();

    private _windowResize=new Subject();

    private windowResize$=this._windowResize.asObservable()
        .debounceTime(DEBOUNCE_TIME).takeUntil(this.destroy$);

    private _scrollChanged=new Subject();

    private scrollChanged$=this._scrollChanged.asObservable()
        .merge(this.windowResize$)
        .takeUntil(this.destroy$).map(()=>
            this.curElement.nativeElement.offsetWidth - this.curElement.nativeElement.clientWidth);

    @Output() public scrollToPaddingRight = new EventEmitter<number>();

    @HostListener('window:resize') private windowResize(){
        this._windowResize.next();
    };

    constructor(private curElement: ElementRef,
        private observerBuilder: MutationObserverService) {
        // configuration of the observer:
        let config = { childList: true, subtree: true };

        // subtree modified event
        this.observer = this.observerBuilder.getObserver(() => {
            this._scrollChanged.next();
        });
        // pass in the target node, as well as the observer options
        this.observer.observe(this.curElement.nativeElement, config);

        //emit value of paddingRight, equal to width of scroll
        this.scrollChanged$.subscribe((value)=>{
            this.scrollToPaddingRight.emit(value);
        });
    }

    public ngOnDestroy() {
        this._destroy.next();
        this.observer.disconnect();
    }
}
