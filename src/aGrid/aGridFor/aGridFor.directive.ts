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

    private _groupsMap: Map<any, Array<AGridForGroup>> = new Map<any, Array<AGridForGroup>>();

    private _getRowGroup(row) {
        //get array instance of root level group
        let topLevelGroups = this._groupsMap.get(this._groups[0]);
        if (!topLevelGroups) {
            topLevelGroups = [];
            this._groupsMap.set(this._groups[0], topLevelGroups);
        }

        let groups = topLevelGroups, groupInstance: AGridForGroup;
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
                } else if (!groupInstanceNew.parent && topLevelGroups.length) {
                    index = this._viewContainer.indexOf(topLevelGroups[topLevelGroups.length - 1].view);
                    index += allSubChildLength(topLevelGroups[topLevelGroups.length - 1]) + 1;
                }

                //insert new group into current view
                const view = this._viewContainer.createEmbeddedView(
                    this._template, groupInstanceNew, index);
                groups.push(groupInstanceNew);
                groupInstanceNew.view = view;

                let instanceArray = this._groupsMap.get(group) || [];
                if (instanceArray.indexOf(groupInstanceNew) === -1) {
                    instanceArray.push(groupInstanceNew);
                }
                this._groupsMap.set(group, instanceArray);
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
            group.addChild(row);
        }

        const view = this._viewContainer.createEmbeddedView(
            this._template, row, index);

        row.view = view;
        this._itemsMap.set(item, row);
        return row;
    }

    //removes item and it's parents if they do not have any other childs
    private _removeItem(item) {
        let row: any = this._itemsMap.get(item);
        if (row) {
            do {
                //remove all parents if they do not have any children
                let index = this._viewContainer.indexOf(row.view);
                if (index > -1 && (!row.children || !row.children.length)) {

                    if (row.parent) {
                        row.parent.children = row.parent.children.filter(ch => ch !== row);
                    }

                    this._viewContainer.remove(index);

                    //if row is group we should delete it from this group's array of group instances
                    if (row instanceof AGridForGroup) {
                        let groupArray = this._groupsMap.get(row.groupInstance);
                        groupArray.splice(groupArray.indexOf(row), 1);
                    } else {
                        //else it's an item and we should delete it from items map
                        this._itemsMap.delete(row.$implicit);
                    }
                    row = row.parent;
                } else {
                    break;
                }
            } while (row)
        }
    }

    //removes all instances of the group from view
    _removeGroup(group) {
        let groupRows = this._groupsMap.get(group) || [];

        groupRows.forEach(groupRow => {
            let index = this._viewContainer.indexOf(groupRow.view);
            this._viewContainer.remove(index);

            //remove parent from all children of current deleting group instance
            if (groupRow.children) {
                groupRow.children.forEach(rowChild => {
                    groupRow.removeChild(rowChild);
                })
                groupRow.children = [];
            }

            //remove this instance from it's parents children
            if (groupRow.parent) {
                groupRow.parent.removeChild(groupRow);
            }

        });

        this._groupsMap.delete(group);
    }

    _actualizeGrouppedIndex(item) {
        let row = this._itemsMap.get(item);

        //if row.parent is presented, it was not deleted, but added

        //find actual parent group for current row
        let group: AGridForGroup = this._getRowGroup(row.$implicit);
        if (group) {
            group.addChild(row);
        }
        let grouppedItems = this.aGridForOf;
        if (this._groups) {
            //find list of items from the same groups
            grouppedItems = grouppedItems.filter(filterItem => {
                let result = false, groupEqualCounter = 0;

                //the groupped fields of all items must be equal to the fields of current item
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
            let parentIndex = this._viewContainer.indexOf(row.parent.view) + 1;
            index += parentIndex;
        }

        this._viewContainer.move(row.view, index);
        return row;
    }

    //reattaches an item to the view, adding item to the end of the group
    _reattachItem(item) {
        let row = this._itemsMap.get(item), index = this.aGridForOf.indexOf(item);

        //if row.parent is presented, it was not deleted, but added
        let isItemParentNew = !!row.parent;

        //find actual parent group for current row
        let group: AGridForGroup = this._getRowGroup(row.$implicit);
        if (group) {
            if (row.parent) {
                row.parent.removeChild(this);
            }
            index = this._viewContainer.indexOf(group.view) + group.children.length + 1;
            group.addChild(row);
        }
        this._viewContainer.move(row.view, index);
    }

    private _applyChanges(rowChanges: DefaultIterableDiffer, groupChanges: DefaultIterableDiffer) {
        const insertTuples: RecordViewTuple[] = [];
        if (groupChanges) {
            let groupsToDelete = [], pushGroup = (group) => {
                if (groupsToDelete.indexOf(group) === -1) {
                    groupsToDelete.push(group);
                }
            }, setMinIndex = (val) => {
                minIndex = Math.min(minIndex, val);
                if (minIndex < 0) {
                    minIndex = 0;
                }
            },
                delFrom = (index) => {
                    for (let i = index; i < this._groups.length; i++) {
                        pushGroup(this._groups[i]);
                    }
                }, minIndex = -1;
            groupChanges.forEachOperation(
                (group: CollectionChangeRecord, adjustedPreviousIndex: number, currentIndex: number) => {

                    pushGroup(group.item);
                    if (group.previousIndex == null) {

                        setMinIndex(currentIndex);
                    } else if (currentIndex == null) {
                        pushGroup(group.item);
                        setMinIndex(group.previousIndex);
                    } else {
                        pushGroup(group.item);
                        setMinIndex(group.previousIndex);
                        setMinIndex(currentIndex);
                    }
                }
            );

            if (minIndex > -1) {
                delFrom(minIndex);
            }

            groupsToDelete.forEach(group => {
                this._removeGroup(group);
            });

            //for all items we should clear parent's childs for preventing groups/items position collisions
            this.aGridForOf.forEach((item) => {
                let row: any = this._itemsMap.get(item);
                if (row && row.parent) {
                    row.parent.clearChilds();
                }
            });

            //then we should reattach all items, it will create groups that items needed
            this.aGridForOf.forEach((item) => {
                let row: any = this._itemsMap.get(item);
                if (row) {
                    this._reattachItem(item);
                    let tuple = new RecordViewTuple(item, row.view);
                    insertTuples.push(tuple);
                }
            });
        }

        //processing changes of rows
        if (rowChanges) {
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
                        let tuple = new RecordViewTuple(item.item, row.view);
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
        }


    }

    private _perViewChange(view: EmbeddedViewRef<AGridForRow>, record: CollectionChangeRecord) {
        view.context.$implicit = record;
    }
}

class RecordViewTuple {
    constructor(public record: any, public view: EmbeddedViewRef<AGridForRow>) { }
}