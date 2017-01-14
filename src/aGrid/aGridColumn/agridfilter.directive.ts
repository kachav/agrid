import {TemplateRef, Directive} from "@angular/core";

@Directive({
    selector: "[aGridFilter]"
})
export class aGridFilter {
    constructor(public template:TemplateRef<any>){}
}
