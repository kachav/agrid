import { Input, Component, TemplateRef, ContentChild, ElementRef, ViewContainerRef } from "@angular/core";


@Component({
    selector: "a-grid-header",
    template: `<ng-content></ng-content>`
})
export class aGridHeader {
    @ContentChild(TemplateRef) template;
}