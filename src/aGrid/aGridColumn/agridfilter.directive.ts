import { TemplateRef, Directive } from '@angular/core';

@Directive({
    selector: '[aGridFilter]'
})
export class AGridFilterDirective {
    constructor(public template: TemplateRef<any>) { }
}
