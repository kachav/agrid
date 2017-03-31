import { TemplateRef, Directive, Input } from '@angular/core';

@Directive({
    selector: '[aGridGroup]'
})
export class AGridGroupDirective {
    @Input('aGridGroupBy') public groupName;
    constructor(public template: TemplateRef<any>) { }
}
