import {Component, TemplateRef, ContentChild} from "@angular/core";

@Component({
    selector: "a-grid-cell",
    template: `<ng-content></ng-content>`
})
export class aGridCell {
    @ContentChild(TemplateRef) template;
}