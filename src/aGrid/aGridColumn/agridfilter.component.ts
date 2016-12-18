import { Input, Component, TemplateRef, ContentChild, ElementRef, ViewContainerRef } from "@angular/core";


@Component({
    selector: "a-grid-filter",
    template: `<ng-content></ng-content>`
})
export class aGridFilter {
    @ContentChild(TemplateRef) template;
}
