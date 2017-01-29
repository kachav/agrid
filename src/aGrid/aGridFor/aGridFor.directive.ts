import {
    ChangeDetectorRef, CollectionChangeRecord, DefaultIterableDiffer,
    Directive, DoCheck, EmbeddedViewRef, Input, IterableDiffer, IterableDiffers,
    OnChanges, SimpleChanges, TemplateRef, TrackByFn, ViewContainerRef, isDevMode, ViewRef
} from '@angular/core';

import { aGridGroup } from '../aGridGroup/aGridGroup.directive';

import { AGridForGroup } from './AGridForGroup';

import { AGridForRow } from './AGridForRow';


@Directive({ selector: '[aGridFor][aGridForOf]' })
export class AGridFor implements DoCheck, OnChanges {
    @Input() aGridForOf: any;

    private _rowDiffer: IterableDiffer = null;
    private _groupDiffer: IterableDiffer = null;


    private _groups: Array<aGridGroup>;
    @Input() set aGridForGroupby(groups: Array<aGridGroup>) {
        this._groups = groups;
    }

    constructor(
        private _viewContainer: ViewContainerRef, private _template: TemplateRef<any>,
        private _differs: IterableDiffers, private _cdr: ChangeDetectorRef) { }


    ngOnChanges(changes: SimpleChanges): void {
        if ('aGridForOf' in changes) {
            // React on aGridForOf changes only once all inputs have been initialized
            let value = changes['aGridForOf'].currentValue;
            if (!this._rowDiffer && value) {
                this._rowDiffer = this._differs.find(value).create(this._cdr);
            }
        }
        if ('aGridForGroupby' in changes) {
            let value = changes['aGridForGroupby'].currentValue;
            if (!this._groupDiffer && value) {
                this._groupDiffer = this._differs.find(value).create(this._cdr);
            }
        }
    }

    ngDoCheck(): void {
        let rowChanges, groupChanges;
        if (this._rowDiffer) {
            rowChanges = this._rowDiffer.diff(this.aGridForOf);
        }
        if (this._groupDiffer) {
            groupChanges = this._groupDiffer.diff(this._groups);
        }

        if (rowChanges || groupChanges) {
            this._applyChanges(rowChanges, groupChanges);
        }

    }

    private _itemsMap: Map<any, AGridForRow> = new Map<any, AGridForRow>();

    private _groupsCollection: Array<AGridForGroup> = [];



    private _getRowGroup(row) {

        let groups = this._groupsCollection, groupInstance: AGridForGroup;
        this._groups.forEach(group => {
            let groupInstanceNew = groups.find(gr => gr.$implicit.value === row[group.groupName]
                && gr.groupInstance.groupName === group.groupName);

            //recursive find length of all childs and subchilds
            function allSubChildLength(group) {
                let length = 0;
                if (group.children && group.children.length) {

                    group.children.forEach(ch => {
                        length += allSubChildLength(ch);
                    });
                    length += group.children.length;
                }

                return length;
            }

            if (!groupInstanceNew) {
                groupInstanceNew = new AGridForGroup(row[group.groupName], group, null, null);
                groupInstanceNew.parent = groupInstance;


                let index = 0;
                if (groupInstanceNew.parent) {
                    index = this._viewContainer.indexOf(groupInstanceNew.parent.view);
                    index += allSubChildLength(groupInstanceNew.parent) + 1;
                } else if (!groupInstanceNew.parent && this._groupsCollection.length) {
                    index = this._viewContainer.indexOf(this._groupsCollection[this._groupsCollection.length - 1].view);
                    index += allSubChildLength(this._groupsCollection[this._groupsCollection.length - 1]) + 1;
                }

                //insert new group into current view
                const view = this._viewContainer.createEmbeddedView(
                    this._template, groupInstanceNew, index);
                groups.push(groupInstanceNew);
                groupInstanceNew.view = view;
            }
            groupInstance = groupInstanceNew;
            groups = groupInstanceNew.children;
        });
        return groupInstance;
    }

    private _insertNewGrouppedItem(item) {
        let group: AGridForGroup = this._getRowGroup(item), index = this._viewContainer.length, row: AGridForRow;
        row = new AGridForRow(item, null, null);
        if (group) {
            index = this._viewContainer.indexOf(group.view) + group.children.length + 1;
            group.children.push(row);
            row.parent = group;
        }
        const view = this._viewContainer.createEmbeddedView(
            this._template, row, index);
        row.view = view;
        this._itemsMap.set(item, row);
        return row;
    }

    private _removeItem(item) {
        let row: any = this._itemsMap.get(item);
        if (row) {
            do {
                let index = this._viewContainer.indexOf(row.view);
                if (index > -1 && (!row.children || !row.children.length)) {

                    if (row.parent) {
                        row.parent.children = row.parent.children.filter(ch => ch !== row);
                    }

                    this._viewContainer.remove(index);
                    this._itemsMap.delete(row);
                    if (row instanceof AGridForGroup) {
                        this._groupsCollection = this._groupsCollection.filter(gr => gr !== row);
                    }
                    row = row.parent;
                } else {
                    break;
                }
            } while (row)
        }
    }

    _actualizeGrouppedIndex(item) {
        let row = this._itemsMap.get(item);

        let grouppedItems = this.aGridForOf;
        if (this._groups) {
            grouppedItems = grouppedItems.filter(filterItem => {
                let result = false, groupEqualCounter = 0;

                this._groups.forEach(gr => {
                    if (filterItem[gr.groupName] === item[gr.groupName])
                        groupEqualCounter++;
                });
                result = this._groups.length === groupEqualCounter;

                return result;
            });
        }
        let index = grouppedItems.indexOf(item);
        if (row.parent) {
            index += this._viewContainer.indexOf(row.parent.view) + 1;
        }
        this._viewContainer.move(row.view, index);
        return row;
    }

    private _applyChanges(rowChanges: DefaultIterableDiffer, groupChanges: DefaultIterableDiffer) {

        if (rowChanges) {

            const insertTuples: RecordViewTuple[] = [];
            rowChanges.forEachOperation(
                (item: CollectionChangeRecord, adjustedPreviousIndex: number, currentIndex: number) => {
                    let row;
                    if (item.previousIndex == null) {
                        row = this._insertNewGrouppedItem(item.item);
                    } else if (currentIndex == null) {
                        this._removeItem(item.item);
                    } else {
                        row = this._actualizeGrouppedIndex(item.item);
                    }

                    if (row) {
                        let tuple = new RecordViewTuple(item, row.view);
                        insertTuples.push(tuple);
                    }
                });


            for (let i = 0; i < insertTuples.length; i++) {
                this._perViewChange(insertTuples[i].view, insertTuples[i].record);
            }

            for (let i = 0, ilen = this.aGridForOf.length; i < ilen; i++) {
                let row = this._itemsMap.get(this.aGridForOf[i]);

                let viewRef = <EmbeddedViewRef<any>>row.view;
                viewRef.context.index = i;
                viewRef.context.count = ilen;

            }

            rowChanges.forEachIdentityChange((record: any) => {
                let row = this._itemsMap.get(record.item);

                let viewRef = <EmbeddedViewRef<AGridForRow>>row.view;
                viewRef.context.$implicit = record.item;

            });
        }
    }

    private _perViewChange(view: EmbeddedViewRef<AGridForRow>, record: CollectionChangeRecord) {
        view.context.$implicit = record.item;
    }
}

class RecordViewTuple {
    constructor(public record: any, public view: EmbeddedViewRef<AGridForRow>) { }
}