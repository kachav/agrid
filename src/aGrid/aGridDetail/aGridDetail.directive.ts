import { TemplateRef, Directive, Input } from '@angular/core';

@Directive({
    selector: '[aGridDetail]'
})
export class AGridDetailDirective {
    @Input('aGridDetailExpandedrows') public expandedRows:any[];

    constructor(public template: TemplateRef<any>) { }
}