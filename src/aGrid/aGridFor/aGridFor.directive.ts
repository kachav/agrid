import {
    IterableChanges, IterableChangeRecord,
    Directive, DoCheck, EmbeddedViewRef, Input, IterableDiffer, IterableDiffers,
    OnChanges, SimpleChanges, TemplateRef, TrackByFn, ViewContainerRef,
    isDevMode, ViewRef, TrackByFunction
} from '@angular/core';

import {RecordViewTuple} from './recordViewTuple';

import { AGridGroupDirective } from '../aGridGroup/aGridGroup.directive';

import { AGridForGroup } from './AGridForGroup';

import { AGridForRow } from './AGridForRow';

@Directive({ selector: '[aGridFor][aGridForOf]' })
export class AGridForDirective<T> implements DoCheck, OnChanges {

    @Input() public aGridForOf: any;

    @Input() public set aGridForGroupby(groups: AGridGroupDirective[]) {
        this._groups = groups;
    }

    @Input() public aGridForTrackBy: TrackByFunction<T>;

    private _rowDiffer: IterableDiffer<T> = null;
    private _groupDiffer: IterableDiffer<T> = null;

    private _groups: any;

    private _groupTrackByFn: TrackByFunction<T>;

    private _itemsMap: Map<any, AGridForRow> = new Map<any, AGridForRow>();

    private _groupsMap: Map<any, AGridForGroup[]> = new Map<any, AGridForGroup[]>();

    constructor(
        private _viewContainer: ViewContainerRef, private _template: TemplateRef<any>,
        private _differs: IterableDiffers) { }

    public ngOnChanges(changes: SimpleChanges): void {
        if ('aGridForOf' in changes) {
            // React on aGridForOf changes only once all inputs have been initialized
            let value = changes['aGridForOf'].currentValue;
            if (!this._rowDiffer && value) {
                this._rowDiffer = this._differs.find(value).create(this.aGridForTrackBy);
            }
        }
        if ('aGridForGroupby' in changes) {
            let value = changes['aGridForGroupby'].currentValue;
            if (!this._groupDiffer && value) {
                this._groupDiffer = this._differs.find(value).create(this._groupTrackByFn);
            }
        }
    }

    public ngDoCheck(): void {
        let rowChanges;
        let groupChanges;
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

    private _getRowGroup(row) {
        // get array instance of root level group
        let topLevelGroups = this._groupsMap.get(this._groups[0]);
        if (!topLevelGroups) {
            topLevelGroups = [];
            this._groupsMap.set(this._groups[0], topLevelGroups);
        }

        let groups = topLevelGroups;
        let groupInstance: AGridForGroup;
        this._groups.forEach((group) => {
            let groupInstanceNew = groups.find((gr) => gr.$implicit.value === row[group.groupName]
                && gr.groupInstance.groupName === group.groupName);

            // recursive find length of all childs and subchilds
            function allSubChildLength(gr) {
                let length = 0;
                if (gr.children && gr.children.length) {

                    gr.children.forEach((ch) => {
                        length += allSubChildLength(ch);
                    });
                    length += gr.children.length;
                }

                return length;
            }

            if (!groupInstanceNew) {
                groupInstanceNew = new AGridForGroup(row[group.groupName],
                    group, this._groups.indexOf(group));

                groupInstanceNew.parent = groupInstance;

                let index = 0;
                if (groupInstanceNew.parent) {
                    index = this._viewContainer.indexOf(groupInstanceNew.parent.view);
                    index += allSubChildLength(groupInstanceNew.parent) + 1;
                } else if (!groupInstanceNew.parent && topLevelGroups.length) {
                    index = this._viewContainer
                        .indexOf(topLevelGroups[topLevelGroups.length - 1].view);
                    index += allSubChildLength(topLevelGroups[topLevelGroups.length - 1]) + 1;
                }

                // insert new group into current view
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

    private _insertNewGrouppedItem(item,itemIndex) {
        let group: AGridForGroup = this._getRowGroup(item);
        let index = this._viewContainer.length;
        let row: AGridForRow;
        row = new AGridForRow(item, null, null);
        if (group) {
            group.addChild(row);
            index = this._findItemIndex(item, group);
        }else{
            index=itemIndex;
        }

        const view = this._viewContainer.createEmbeddedView(
            this._template, row, index);

        row.view = view;
        this._itemsMap.set(item, row);
        return row;
    }

    // removes item and it's parents if they do not have any other childs
    private _removeItem(item) {
        let row: any = this._itemsMap.get(item);
        if (row) {
            do {
                // remove all parents if they do not have any children
                let index = this._viewContainer.indexOf(row.view);
                if (index > -1 && (!row.children || !row.children.length)) {

                    if (row.parent) {
                        row.parent.children = row.parent.children.filter((ch) => ch !== row);
                    }

                    this._viewContainer.remove(index);

                    // if row is group we should delete it
                    // from this group's array of group instances
                    if (row instanceof AGridForGroup) {
                        let groupArray = this._groupsMap.get(row.groupInstance);
                        groupArray.splice(groupArray.indexOf(row), 1);
                    } else {
                        // else it's an item and we should delete it from items map
                        this._itemsMap.delete(row.$implicit);
                    }
                    row = row.parent;
                } else {
                    break;
                }
            } while (row);
        }
    }

    // removes all instances of the group from view
    private _removeGroup(group) {
        let groupRows = this._groupsMap.get(group) || [];

        groupRows.forEach((groupRow) => {
            let index = this._viewContainer.indexOf(groupRow.view);
            this._viewContainer.remove(index);

            // remove parent from all children of current deleting group instance
            if (groupRow.children) {
                groupRow.children.forEach((rowChild) => {
                    groupRow.removeChild(rowChild);
                });
                groupRow.children = [];
            }

            // remove this instance from it's parents children
            if (groupRow.parent) {
                groupRow.parent.removeChild(groupRow);
            }

        });

        this._groupsMap.delete(group);
    }

    private _findItemIndex(item:any,group?: AGridForGroup){
        let grouppedItems = this.aGridForOf;
        if (this._groups) {
            // find list of items from the same groups
            grouppedItems = grouppedItems.filter((filterItem) => {
                let result = false;
                let groupEqualCounter = 0;

                // the groupped fields of all items must be equal to the fields of current item
                this._groups.forEach((gr) => {
                    if (filterItem[gr.groupName] === item[gr.groupName]) {
                        groupEqualCounter++;
                    }
                });
                result = this._groups.length === groupEqualCounter;

                return result;
            });

        }
        let index = grouppedItems.indexOf(item);
        if (group) {
            let parentIndex = this._viewContainer.indexOf(group.view) + 1;
            index += parentIndex;
        }
        return index;
    }

    private _actualizeGrouppedIndex(item) {
        let row = this._itemsMap.get(item);

        // if row.parent is presented, it was not deleted, but added

        // find actual parent group for current row
        let group: AGridForGroup = this._getRowGroup(row.$implicit);
        if (group) {
            group.addChild(row);
        }

        let index = this._findItemIndex(item,group);

        this._viewContainer.move(row.view, index);
        return row;
    }

    // reattaches an item to the view, adding item to the end of the group
    private _reattachItem(item) {
        let row = this._itemsMap.get(item);
        let index = this.aGridForOf.indexOf(item);

        // if row.parent is presented, it was not deleted, but added
        let isItemParentNew = !!row.parent;

        // find actual parent group for current row
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

    private _applyChanges(rowChanges: IterableChanges<T>, groupChanges: IterableChanges<T>) {
        const insertTuples: RecordViewTuple[] = [];
        if (groupChanges) {
            let groupsToDelete = [];
            let minIndex = -1;
            let pushGroup = (group) => {
                if (groupsToDelete.indexOf(group) === -1) {
                    groupsToDelete.push(group);
                }
            };
            let setMinIndex = (val) => {
                minIndex = Math.min(minIndex, val);
                if (minIndex < 0) {
                    minIndex = 0;
                }
            };
            let delFrom = (index) => {
                for (let i = index; i < this._groups.length; i++) {
                    pushGroup(this._groups[i]);
                }
            };
            groupChanges.forEachOperation(
                (group: IterableChangeRecord<any>,
                    adjustedPreviousIndex: number,
                    currentIndex: number) => {

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

            groupsToDelete.forEach((group) => {
                this._removeGroup(group);
            });

            // for all items we should clear parent's childs
            // for preventing groups/items position collisions
            this.aGridForOf.forEach((item) => {
                let row: any = this._itemsMap.get(item);
                if (row && row.parent) {
                    row.parent.clearChilds();
                }
            });

            // then we should reattach all items, it will create groups that items needed
            this.aGridForOf.forEach((item) => {
                let row: any = this._itemsMap.get(item);
                if (row) {
                    this._reattachItem(item);
                    let tuple = new RecordViewTuple(item, row.view);
                    insertTuples.push(tuple);
                }
            });
        }

        // processing changes of rows
        if (rowChanges) {
            rowChanges.forEachOperation(
                (item: IterableChangeRecord<any>,
                    adjustedPreviousIndex: number,
                    currentIndex: number) => {

                    let row;
                    if (item.previousIndex == null) {
                        row = this._insertNewGrouppedItem(item.item,currentIndex);
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

            for (let tuple of insertTuples) {
                this._perViewChange(tuple.view, tuple.record);
            }

            for (let i = 0, ilen = this.aGridForOf.length; i < ilen; i++) {
                let row = this._itemsMap.get(this.aGridForOf[i]);

                let viewRef = <EmbeddedViewRef<any>> row.view;
                viewRef.context.index = i;
                viewRef.context.count = ilen;
            }
        }
    }

    private _perViewChange(view: EmbeddedViewRef<AGridForRow>, record: IterableChangeRecord<any>) {
        view.context.$implicit = record;
    }
}
