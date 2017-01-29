import { AGridFor } from './aGridFor.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

import { AGridForGroup } from './AGridForGroup';

@Component({
    template: '<div *aGridFor="let item of items"></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGridFor) public targetDirective;

    items = []
}

describe('AGridFor.directive', () => {
    let instance;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridFor, testContainer
            ]
        }).compileComponents().then(() => {
            let component = TestBed.createComponent(testContainer);
            instance = component.componentInstance.targetDirective;
        });
    }));

    it('aGridForGroupby setting _groups property', () => {
        let groups = [{ aaa: 123 }];

        instance.aGridForGroupby = groups;
        expect(instance._groups).toBe(groups);
    })

    it('_rowDiffer setting when aGridForOf is present and _rowDiffer is not present', () => {
        let changes = { aGridForOf: { currentValue: [{ aaa: 123 }, { aaa: 334 }] } };

        let findResult = { create() { } };

        let differMock = {};

        spyOn(instance._differs, 'find').and.callFake(() => findResult);

        spyOn(findResult, 'create').and.callFake(() => differMock);

        instance.ngOnChanges(changes);

        expect(instance._rowDiffer).toBe(differMock);

        expect(instance._differs.find).toHaveBeenCalledWith(changes.aGridForOf.currentValue);

        expect(findResult.create).toHaveBeenCalledWith(instance._cdr);
    })

    it('_rowDiffer is not set when _rowDiffer is present', () => {
        let changes = { aGridForOf: { currentValue: [{ aaa: 123 }, { aaa: 334 }] } };

        let findResult = { create() { } };

        let differMock = {};

        spyOn(instance._differs, 'find').and.callFake(() => findResult);

        spyOn(findResult, 'create').and.callFake(() => differMock);

        instance._rowDiffer = {};

        instance.ngOnChanges(changes);

        expect(instance._rowDiffer).not.toBe(differMock);

        expect(instance._differs.find).not.toHaveBeenCalled();

        expect(findResult.create).not.toHaveBeenCalled();
    })

    it('_rowDiffer is not set when aGridForOf is no present in changes', () => {
        let changes = {};

        let findResult = { create() { } };

        let differMock = {};

        spyOn(instance._differs, 'find').and.callFake(() => findResult);

        spyOn(findResult, 'create').and.callFake(() => differMock);

        instance._rowDiffer = {};

        instance.ngOnChanges(changes);

        expect(instance._rowDiffer).not.toBe(differMock);

        expect(instance._differs.find).not.toHaveBeenCalled();

        expect(findResult.create).not.toHaveBeenCalled();
    })

    it('_groupDiffer setting when aGridForGroupby is present and _groupDiffer is not present', () => {
        let changes = { aGridForGroupby: { currentValue: [{ aaa: 123 }, { aaa: 334 }] } };

        let findResult = { create() { } };

        let differMock = {};

        spyOn(instance._differs, 'find').and.callFake(() => findResult);

        spyOn(findResult, 'create').and.callFake(() => differMock);

        instance.ngOnChanges(changes);

        expect(instance._groupDiffer).toBe(differMock);

        expect(instance._differs.find).toHaveBeenCalledWith(changes.aGridForGroupby.currentValue);

        expect(findResult.create).toHaveBeenCalledWith(instance._cdr);
    })

    it('_groupDiffer is not set when _groupDiffer is present', () => {
        let changes = { aGridForGroupby: { currentValue: [{ aaa: 123 }, { aaa: 334 }] } };

        let findResult = { create() { } };

        let differMock = {};

        spyOn(instance._differs, 'find').and.callFake(() => findResult);

        spyOn(findResult, 'create').and.callFake(() => differMock);

        instance._groupDiffer = {};

        instance.ngOnChanges(changes);

        expect(instance._groupDiffer).not.toBe(differMock);

        expect(instance._differs.find).not.toHaveBeenCalled();

        expect(findResult.create).not.toHaveBeenCalled();
    })

    it('_groupDiffer is not set when aGridForGroupby is not present in changes', () => {
        let changes = {};

        let findResult = { create() { } };

        let differMock = {};

        spyOn(instance._differs, 'find').and.callFake(() => findResult);

        spyOn(findResult, 'create').and.callFake(() => differMock);

        instance.ngOnChanges(changes);

        expect(instance._groupDiffer).not.toBe(differMock);

        expect(instance._differs.find).not.toHaveBeenCalled();

        expect(findResult.create).not.toHaveBeenCalled();
    })

    it('ngDoCheck takes diffs when _rowDiffer is present', () => {
        let differMock = { diff() { } }, agForOfFake = [{ aaa: 234 }];

        spyOn(differMock, 'diff');

        instance._rowDiffer = differMock;
        instance.aGridForOf = agForOfFake;

        instance.ngDoCheck();

        expect(differMock.diff).toHaveBeenCalledWith(agForOfFake);
    })


    it('ngDoCheck fires _applyChanges when rowDiffs is present', () => {
        let differMock = { diff() { return diffMock } }, diffMock = { aaa: 123 }, agForOfFake = [];

        spyOn(instance, '_applyChanges');

        instance._rowDiffer = differMock;
        instance.aGridForOf = agForOfFake;

        instance.ngDoCheck();

        expect(instance._applyChanges).toHaveBeenCalledWith(diffMock, undefined);
    })

    it('ngDoCheck takes diffs of groups when _groupDiffer is present', () => {
        let differMock = { diff() { } }, aGridForGroupbyFake = [{ aaa: 234 }];

        spyOn(differMock, 'diff');

        instance._groupDiffer = differMock;
        instance._groups = aGridForGroupbyFake;

        instance.ngDoCheck();

        expect(differMock.diff).toHaveBeenCalledWith(instance._groups);
    })

    it('ngDoCheck fires _applyChanges when groupDiffs is present', () => {
        let differMock = { diff() { return diffMock } }, diffMock = { aaa: 123 }, agForOfFake = [];

        spyOn(instance, '_applyChanges');

        instance._groupDiffer = differMock;
        instance._groups = agForOfFake;

        instance.ngDoCheck();

        expect(instance._applyChanges).toHaveBeenCalledWith(undefined, diffMock);
    })

    it('_getRowGroup finds existing instance of group for row if it exists', () => {
        //fake groups
        let groups = [{ groupName: "field1" }, { groupName: "field2" }],

            //fake groupsCollection (array of instances) of created groups 
            group1 = { $implicit: { value: 'value2' }, groupInstance: { groupName: 'field1' }, children: [] },
            group2 = { $implicit: { value: 'value1' }, groupInstance: { groupName: 'field2' }, children: [] },
            group3 = { $implicit: { value: 'value3' }, groupInstance: { groupName: 'field2' }, children: [] },

            fakeGroupsCollection = [
                group1,
                group2,
                group3];

        group1.children = [group2, group3];

        instance._groups = groups;
        instance._groupsCollection = [...fakeGroupsCollection];

        let row = { field1: 'value2', field2: 'value1' };

        let groupInstance = instance._getRowGroup(row);

        expect(groupInstance.$implicit.value).toEqual('value1');

        expect(fakeGroupsCollection.indexOf(groupInstance)).toBeGreaterThan(-1);
    })

    it('_getRowGroup creates new instance of group for row if it\'s not exist', () => {
        //fake groups
        let groups = [{ groupName: "field1" }, { groupName: "field2" }],

            //fake groupsCollection (array of instances) of created groups 
            group1 = { $implicit: { value: 'value2' }, groupInstance: { groupName: 'field1' }, children: [], view:{aaa:123} },
            group2 = { $implicit: { value: 'value1' }, groupInstance: { groupName: 'field2' }, children: [] },
            group3 = { $implicit: { value: 'value3' }, groupInstance: { groupName: 'field2' }, children: [] },

            fakeGroupsCollection = [
                group1,
                group2,
                group3];

        group1.children = [group2, group3];

        instance._groups = groups;
        instance._groupsCollection = [...fakeGroupsCollection];

        let row = { field1: 'value2', field2: 'value4' };

        let viewContainerIndex = 4;

        spyOn(instance._viewContainer,'indexOf').and.callFake(()=>viewContainerIndex);

        instance.template={aaa:123};

        let groupInstance = instance._getRowGroup(row);

        expect(groupInstance.$implicit.value).toEqual('value4');

        expect(fakeGroupsCollection.indexOf(groupInstance)).toEqual(-1);

        expect(groupInstance.parent).toBe(group1);

        expect(instance._viewContainer.indexOf).toHaveBeenCalledWith(group1.view);
    })

    it('_getRowGroup creates new instance of group for row and it\'s parent if it\'s not exist when _groupsCollection is empty', () => {
        //fake groups
        let groups = [{ groupName: "field1" }, { groupName: "field2" }];

        instance._groups = groups;
        instance._groupsCollection = [];

        let row = { field1: 'value5', field2: 'value4' };

        let viewContainerIndex = 4;

        spyOn(instance._viewContainer,'indexOf').and.callFake(()=>viewContainerIndex);

        instance.template={aaa:123};

        let groupInstance = instance._getRowGroup(row);

        expect(groupInstance.$implicit.value).toEqual('value4');

        expect(groupInstance.parent.$implicit.value).toEqual('value5');
    })

it('_getRowGroup creates new instance of group for row and it\'s parent if it\'s not exist', () => {
        //fake groups
        let groups = [{ groupName: "field1" }, { groupName: "field2" }],

            //fake groupsCollection (array of instances) of created groups 
            group1 = { $implicit: { value: 'value2' }, groupInstance: { groupName: 'field1' }, children: [], view:{aaa:123} },
            group2 = { $implicit: { value: 'value1' }, groupInstance: { groupName: 'field2' }, children: [] },
            group3 = { $implicit: { value: 'value3' }, groupInstance: { groupName: 'field2' }, children: [] },

            fakeGroupsCollection = [
                group1,
                group2,
                group3];

        group1.children = [group2, group3];

        instance._groups = groups;
        instance._groupsCollection = [...fakeGroupsCollection];

        let row = { field1: 'value5', field2: 'value4' };

        let viewContainerIndex = 4;

        spyOn(instance._viewContainer,'indexOf').and.callFake(()=>viewContainerIndex);

        instance.template={aaa:123};

        let groupInstance = instance._getRowGroup(row);

        expect(groupInstance.$implicit.value).toEqual('value4');

        expect(fakeGroupsCollection.indexOf(groupInstance)).toEqual(-1);

        expect(groupInstance.parent.$implicit.value).toEqual('value5');

        expect(fakeGroupsCollection.indexOf(groupInstance.parent)).toEqual(-1);
    })

    it('_insertNewGrouppedItem takes parent group by calling _getRowGroup', () => {
        spyOn(instance, '_getRowGroup');
        let fakeItem = { aaa: 123 };
        instance._insertNewGrouppedItem(fakeItem);

        expect(instance._getRowGroup).toHaveBeenCalledWith(fakeItem);
    })

    it('_insertNewGrouppedItem creating instance of AGridForRow with parent from _getRowGroup', () => {
        let fakeGroup = { children: [], view: {} };
        let fakeIndex = 4;
        spyOn(instance, '_getRowGroup').and.callFake(() => fakeGroup);
        spyOn(instance._viewContainer, 'indexOf').and.callFake(() => fakeIndex);
        let fakeItem = { aaa: 123 };
        let row = instance._insertNewGrouppedItem(fakeItem);

        expect(row.parent).toBe(fakeGroup);

        expect(fakeGroup.children).toContain(row);

        expect(instance._viewContainer.indexOf).toHaveBeenCalledWith(fakeGroup.view);
    })

    it('_removeItem removes all parent\'s chain', () => {
        let row: any = {}, groupParent: any = new AGridForGroup('aaa1', null, 1, 3), groupParent2: any = new AGridForGroup('aaa', null, 1, 3), item = {};

        row.parent = groupParent;

        row.view = {};
        groupParent.view = {};
        groupParent2.view = {};

        groupParent.parent = groupParent2;

        groupParent.children = [row];

        instance._groupsCollection = [groupParent, groupParent2];

        groupParent2.children = [groupParent, {}];

        spyOn(instance._itemsMap, 'get').and.callFake(() => row);

        let index = 4;

        spyOn(instance._viewContainer, 'indexOf').and.callFake(() => index);
        spyOn(instance._viewContainer, 'remove');

        spyOn(instance._itemsMap, 'delete');

        instance._removeItem(item);

        expect(instance._itemsMap.get).toHaveBeenCalledWith(item);

        expect(instance._viewContainer.indexOf).toHaveBeenCalledWith(row.view);
        expect(instance._viewContainer.indexOf).toHaveBeenCalledWith(groupParent.view);
        expect(instance._viewContainer.indexOf).toHaveBeenCalledWith(groupParent2.view);

        expect(instance._itemsMap.delete).toHaveBeenCalledWith(row);
        expect(instance._itemsMap.delete).toHaveBeenCalledWith(groupParent);
        expect(instance._itemsMap.delete).not.toHaveBeenCalledWith(groupParent2);

        expect(groupParent2.children).not.toContain(groupParent);
    })

    it('_removeItem removes top level item if it don\'t have a childrens', () => {
        let row: any = {}, groupParent: any = new AGridForGroup('aaa1', null, 1, 3), groupParent2: any = new AGridForGroup('aaa', null, 1, 3), item = {};

        row.parent = groupParent;

        row.view = {};
        groupParent.view = {};
        groupParent2.view = {};

        groupParent.parent = groupParent2;

        groupParent.children = [row];

        instance._groupsCollection = [groupParent, groupParent2];

        groupParent2.children = [groupParent];

        spyOn(instance._itemsMap, 'get').and.callFake(() => row);

        let index = 4;

        spyOn(instance._viewContainer, 'indexOf').and.callFake(() => index);
        spyOn(instance._viewContainer, 'remove');

        spyOn(instance._itemsMap, 'delete');

        instance._removeItem(item);

        expect(instance._itemsMap.delete).toHaveBeenCalledWith(groupParent2);
    })

    it('_removeItem do not do anything if do not find a starting row', () => {
        let row: any = {}, groupParent: any = new AGridForGroup('aaa1', null, 1, 3), groupParent2: any = new AGridForGroup('aaa', null, 1, 3), item = {};

        row.parent = groupParent;

        row.view = {};
        groupParent.view = {};
        groupParent2.view = {};

        groupParent.parent = groupParent2;

        groupParent.children = [row];

        instance._groupsCollection = [groupParent, groupParent2];

        groupParent2.children = [groupParent];

        spyOn(instance._itemsMap, 'get').and.callFake(() => null);

        let index = 4;

        spyOn(instance._viewContainer, 'indexOf').and.callFake(() => index);
        spyOn(instance._viewContainer, 'remove');

        spyOn(instance._itemsMap, 'delete');

        instance._removeItem(item);

        expect(instance._itemsMap.get).toHaveBeenCalledWith(item);

        expect(instance._viewContainer.indexOf).not.toHaveBeenCalled();

        expect(instance._itemsMap.delete).not.toHaveBeenCalled();
    })

    it('_actualizeGrouppedIndex moves groupped items correctly',()=>{
        instance._groups=[
            {groupName:"field1"},
            {groupName:"field2"}
        ];

        let item = {field1:"f1v1",field2:"f2v2", field3:"3434,"};

        instance.aGridForOf=[
            {field1:"f1v1", field2:"f2v2", field3:"aaa,123"},
            {field1:"aaa", field2:"sss", field3:"aaa,123"},
            {field1:"aaa", field2:"sss", field3:"aaa,123"},
            item,
            {field1:"aaa", field2:"sss", field3:"aaa,123"},
            {field1:"f1v1", field2:"f2v2", field3:"534534"}
        ];

        let fakeRow = {view:{},parent:{view:{}}};

        spyOn(instance._itemsMap,'get').and.callFake(()=>fakeRow);

        let fakeIndex=4;

        spyOn(instance._viewContainer,'indexOf').and.callFake(()=>fakeIndex);

        spyOn(instance._viewContainer,'move')


        let moveInstance = instance._actualizeGrouppedIndex(item);

        expect(moveInstance).toBe(fakeRow);

        expect(instance._viewContainer.move).toHaveBeenCalledWith(fakeRow.view,6)

    })

        it('_actualizeGrouppedIndex moves non groupped items correctly',()=>{
        instance._groups=null;

        let item = {field1:"f1v1",field2:"f2v2", field3:"3434,"};

        instance.aGridForOf=[
            {field1:"f1v1", field2:"f2v2", field3:"aaa,123"},
            {field1:"aaa", field2:"sss", field3:"aaa,123"},
            {field1:"aaa", field2:"sss", field3:"aaa,123"},
            item,
            {field1:"aaa", field2:"sss", field3:"aaa,123"},
            {field1:"f1v1", field2:"f2v2", field3:"534534"}
        ];

        let fakeRow = {view:{}};

        spyOn(instance._itemsMap,'get').and.callFake(()=>fakeRow);

        let fakeIndex=4;

        spyOn(instance._viewContainer,'indexOf').and.callFake(()=>fakeIndex);

        spyOn(instance._viewContainer,'move')


        let moveInstance = instance._actualizeGrouppedIndex(item);

        expect(moveInstance).toBe(fakeRow);

        expect(instance._viewContainer.move).toHaveBeenCalledWith(fakeRow.view,3)

    })

    it('_applyChanges fires forEachOperation on rowChanges',()=>{
        let fakeRowChanges = {forEachOperation(){},forEachIdentityChange(){}}, 
        fakeAddItem = {aaa:123}, fakeRemoveItem={aaa:334}, fakeMovedItem = {aaa:445}, fakeRow:any={view:{context:{$implicit:234}}};

        instance.aGridForOf=[];

        spyOn(instance,'_insertNewGrouppedItem').and.callFake(()=>fakeRow);

        spyOn(instance,'_actualizeGrouppedIndex').and.callFake(()=>fakeRow);

        spyOn(instance,'_removeItem');

        spyOn(fakeRowChanges,'forEachOperation').and.callFake((handler)=>{
            handler({previousIndex:null, item:fakeAddItem}, null, 1);

            handler({previousIndex:1, item:fakeRemoveItem}, null, null);

            handler({previousIndex:1, item:fakeMovedItem}, null, 3);
        })

        let fakeItem = {aaa:4343};
        spyOn(fakeRowChanges, 'forEachIdentityChange').and.callFake((handler)=>{
            handler({item:fakeItem});
        })

        spyOn(instance._itemsMap,'get').and.callFake(()=>fakeRow);

        instance.aGridForOf=[{}];

        instance._applyChanges(fakeRowChanges);

        expect(instance._insertNewGrouppedItem).toHaveBeenCalledWith(fakeAddItem);

        expect(instance._removeItem).toHaveBeenCalledWith(fakeRemoveItem);

        expect(instance._actualizeGrouppedIndex).toHaveBeenCalledWith(fakeMovedItem);

        expect(fakeRow.view.context.index).toEqual(0);
        
        expect(fakeRow.view.context.count).toEqual(1);

        expect(fakeRow.view.context.$implicit).toBe(fakeItem);


        instance._applyChanges();
    })

});