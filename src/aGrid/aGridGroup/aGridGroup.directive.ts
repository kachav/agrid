import { TemplateRef, Directive, Input } from '@angular/core';

@Directive({
    selector: '[aGridGroup]'
})
export class AGridGroupDirective {
    @Input('aGridGroupBy') public by;

    @Input('aGridGroupCollapsed') public set collapsedDefault(value) {
        if (!value) {
            value = [];
        }
        if (!(value instanceof Array)) {
            value = [value];
        }

        this._collapsedDefault = value;
    };

    public collapsedGroups: Map<any, boolean> = new Map<any, boolean>();

    private _collapsedDefault = [];

    constructor(public template: TemplateRef<any>) { }

    public isCollapsed(key: any, groupName:string) {
        if (this.collapsedGroups.has(key)) {
            return !!this.collapsedGroups.get(key);
        }

        return this._collapsedDefault.indexOf(groupName) > -1;
    }

    public isParentCollapsed(par) {
        let item = par;
        let result = false;
        while (item) {
            if (this.isCollapsed(item.$implicit,item.groupName)) {
                result = true;
            }
            item = item.parent;
        }
        return result;
    }

    public toggleCollapse(key: any, value) {
        if (this.collapsedGroups.has(key)) {
            value = this.collapsedGroups.get(key);
        }
        this.collapsedGroups.set(key, !value);
    }

    public deleteCollapse(key: any) {
        this.collapsedGroups.delete(key);
    }
}
