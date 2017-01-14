import {TemplateRef, Directive} from "@angular/core";

@Directive({
    selector: "[aGridHeader]"
})
export class aGridHeader {
    constructor(public template:TemplateRef<any>){}
}