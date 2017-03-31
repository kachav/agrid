import { TemplateRef, Directive } from '@angular/core';

@Directive({
    selector: '[aGridCell]'
})
export class AGridCellDirective {
    constructor(public template: TemplateRef<any>) { }
}
