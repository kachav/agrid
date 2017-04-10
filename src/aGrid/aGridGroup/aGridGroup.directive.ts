import { TemplateRef, Directive, Input } from '@angular/core';

@Directive({
    selector: '[aGridGroup]'
})
export class AGridGroupDirective {
    @Input('aGridGroupBy') public groupName;
    public collapsedGroups: Map<any, boolean> = new Map<any, boolean>();
    constructor(public template: TemplateRef<any>) { }

    public isCollapsed(key: any) {
        return !!this.collapsedGroups.get(key);
    }

    public collapse(key: any) {
        this.collapsedGroups.set(key, true);
    }

    public expand(key: any) {
        this.collapsedGroups.set(key, false);
    }

    public toggleCollapse(key: any) {
        let value = this.collapsedGroups.get(key);
        this.collapsedGroups.set(key, !value);
    }

    public deleteCollapse(key: any) {
        this.collapsedGroups.delete(key);
    }
}
