import { Directive, ElementRef, Output, HostListener, EventEmitter } from '@angular/core';

import { MutationObserverService } from '../utils/mutationObserver.service';

@Directive({ selector: '[contentUpdated]' })
export class ContentUpdatedDirective {
    @Output('contentUpdated') public contentUpdated = new EventEmitter();

    private observer: MutationObserver;

    constructor(private curElement: ElementRef, private observerBuilder: MutationObserverService) {
        // configuration of the observer:
        let config = { attributes: true, childList: true, characterData: true, subtree: true };

        // subtree modified event
        this.observer = this.observerBuilder.getObserver(() => {
            this.domSubTreeModified();
        });
        // pass in the target node, as well as the observer options
        this.observer.observe(this.curElement.nativeElement, config);
    }

    public ngAfterContentInit() {
        this.domSubTreeModified();
    }

    public ngOnDestroy() {
        this.observer.disconnect();
    }

    private domSubTreeModified() {
        this.contentUpdated.next();
    };

}
