import { TemplateRef, Directive } from '@angular/core';

@Directive({
    selector: '[aGridHeader]'
})
export class AGridHeaderDirective {
    constructor(public template: TemplateRef<any>) { }
}
