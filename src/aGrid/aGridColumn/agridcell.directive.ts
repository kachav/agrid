import {TemplateRef, Directive} from "@angular/core";

@Directive({
    selector: "[aGridCell]"
})
export class aGridCell {
    constructor(public template:TemplateRef<any>){
    }
}