import {TemplateRef, Directive, Input} from "@angular/core";

@Directive({
    selector: "[aGridGroup]"
})
export class aGridGroup {
    constructor(public template:TemplateRef<any>){}
    @Input('aGridGroupBy') groupName;
}
