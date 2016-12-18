import { Input, Component, TemplateRef, ContentChild, ElementRef, ViewContainerRef } from "@angular/core";

@Component({
    selector: "a-grid-cell",
    template: `<ng-content></ng-content>`
})
export class aGridCell {
    @ContentChild(TemplateRef) template;
}