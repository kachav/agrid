import { AGridForDirective } from './aGridFor.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

import { AGridForGroup } from './AGridForGroup';

@Component({
    template: `
        <div *aGridFor="let item of items groupby groups;trackBy:item?.id; let group=groupInstance; let i=index;let grLevel=groupLevel">{{group?'group '+item.value+' level '+grLevel:i+' '+item.field1+' '+item.field2+' '+item.field3+' '+item.field4}}</div>
        `,
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGridForDirective) public targetDirective;

    groups = [{ groupName: "field1" }, { groupName: "field2" }]

    items: Array<any> = [
        { field1: "f1v1", field2: "f2v1", field3: "f3v1", field4: "f4v1",id:1 },
        { field1: "f1v1", field2: "f2v2", field3: "f3v2", field4: "f4v1" ,id:2},
        { field1: "f1v1", field2: "f2v1", field3: "f3v3", field4: "f4v1" ,id:3},
        { field1: "f1v2", field2: "f2v3", field3: "f3v4", field4: "f4v1" ,id:4},
        { field1: "f1v2", field2: "f2v3", field3: "f3v5", field4: "f4v1" ,id:5}]
}

describe('AGridFor.directive', () => {
    let instance, fixture;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridForDirective, testContainer
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(testContainer);
            fixture.detectChanges();
            instance = fixture.componentInstance.targetDirective;
        });
    }));

    it('initial groupping on component create works', () => {
        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(10);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 1');
        //group item
        expect(fixture.nativeElement.children[5].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 1');

        //group items
        expect(fixture.nativeElement.children[8].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[9].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })


    it('new item should be in the first level groups', () => {
        fixture.componentInstance.items.push({ field1: "f1v1", field2: "f2v1", field3: "f3v6", field4: "f4v1" ,id:6})
        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(11);

        expect(fixture.nativeElement.children[4].innerText).toEqual('5 f1v1 f2v1 f3v6 f4v1');
    })

    it('removing last item should remove parent group', () => {
        (fixture.componentInstance.items as Array<any>).splice(1, 1);
        fixture.detectChanges();
        //should delete second item and second level group
        expect(fixture.nativeElement.children.length).toEqual(8);

        (fixture.componentInstance.items as Array<any>).splice(0);
        fixture.detectChanges();
        //should delete the rest of items and groups
        expect(fixture.nativeElement.children.length).toEqual(0);
    })

    it('items inside groups should be sort like in original collection', () => {
        let arr: Array<any> = fixture.componentInstance.items, item, secItem;

        item = arr[2];
        secItem = arr[0];

        fixture.componentInstance.items = arr =
            [
                item,
                secItem,
                ...arr.filter(filterItem => filterItem !== item && filterItem !== secItem)
            ];
        fixture.detectChanges();
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('1 f1v1 f2v1 f3v1 f4v1');
    })

    it('removing group should remove all instances of it\'s group from dom', () => {
        (fixture.componentInstance.groups as Array<any>).splice(0, 1);
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toEqual(8);

        expect(fixture.nativeElement.children[0].innerText).toEqual('group f2v1 level 0');
        expect(fixture.nativeElement.children[1].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        expect(fixture.nativeElement.children[3].innerText).toEqual('group f2v2 level 0');
        expect(fixture.nativeElement.children[4].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v3 level 0');
        expect(fixture.nativeElement.children[6].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[7].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

        //clear all groups
        (fixture.componentInstance.groups as Array<any>).splice(0);
        fixture.detectChanges();
        expect(fixture.nativeElement.children.length).toEqual(5);

        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('adding group in the center should regroup every lower level children', () => {
        let arr: Array<any> = fixture.componentInstance.groups;

        arr = [arr[0], { groupName: "field4" }, arr[1]];

        fixture.componentInstance.groups = arr;
        fixture.detectChanges();

        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(12);

        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f4v1 level 1');
        //field2 group f2v1
        expect(fixture.nativeElement.children[2].innerText).toEqual('group f2v1 level 2');
        //group items
        expect(fixture.nativeElement.children[3].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v2 level 2');
        //group item
        expect(fixture.nativeElement.children[6].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f1v2 level 0');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f4v1 level 1');
        //group f2v3
        expect(fixture.nativeElement.children[9].innerText).toEqual('group f2v3 level 2');

        //group items
        expect(fixture.nativeElement.children[10].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[11].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('adding group in the start should regroup every lower level children', () => {
        let arr: Array<any> = fixture.componentInstance.groups;

        arr = [{ groupName: "field4" }, ...arr];

        fixture.componentInstance.groups = arr;
        fixture.detectChanges();

        //directive hsould create 5 elements (2 actual items and 3 groups)
        expect(fixture.nativeElement.children.length).toEqual(11);

        //field 4 group f4v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f4v1 level 0');
        //field1 group f1v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f1v1 level 1');
        //field2 group f2v1
        expect(fixture.nativeElement.children[2].innerText).toEqual('group f2v1 level 2');
        //group items
        expect(fixture.nativeElement.children[3].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v2 level 2');
        //group item
        expect(fixture.nativeElement.children[6].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f1v2 level 1');
        //group f2v3
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f2v3 level 2');

        //group items
        expect(fixture.nativeElement.children[9].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[10].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })

    it('adding group in the end should add new group level', () => {
        let arr: Array<any> = fixture.componentInstance.groups;

        arr = [...arr, { groupName: "field4" }];

        fixture.componentInstance.groups = arr;
        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(13);


        //field1 group f1v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f1v1 level 0');
        //field2 group f2v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f2v1 level 1');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[2].innerText).toEqual('group f4v1 level 2');
        //group items
        expect(fixture.nativeElement.children[3].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f2v2 level 1');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[6].innerText).toEqual('group f4v1 level 2');
        //group item
        expect(fixture.nativeElement.children[7].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f1v2
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f1v2 level 0');
        //group f2v3
        expect(fixture.nativeElement.children[9].innerText).toEqual('group f2v3 level 1');
        //field 4 group f4v1
        expect(fixture.nativeElement.children[10].innerText).toEqual('group f4v1 level 2');

        //group items
        expect(fixture.nativeElement.children[11].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[12].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
    })


    it('when we change value in the item, dom element changes', () => {
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');

        fixture.componentInstance.items[0].field3 = 'field3test';

        fixture.componentInstance.items = [...fixture.componentInstance.items]

        fixture.detectChanges();

        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 field3test f4v1');
    });

    it('items without groups should be sort like in original collection', () => {
        fixture.componentInstance.groups = [];

        fixture.detectChanges();

        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');
        let items:Array<any>=fixture.componentInstance.items;

        fixture.componentInstance.items=[items[items.length-1],...items.slice(0,items.length-1)];
        fixture.detectChanges();
        expect(fixture.nativeElement.children[0].innerText).toEqual('0 f1v2 f2v3 f3v5 f4v1');
        expect(fixture.nativeElement.children[1].innerText).toEqual('1 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[2].innerText).toEqual('2 f1v1 f2v2 f3v2 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('3 f1v1 f2v1 f3v3 f4v1');
        expect(fixture.nativeElement.children[4].innerText).toEqual('4 f1v2 f2v3 f3v4 f4v1');
    })

    it('should regroup when groups order changes', () => {
        let arr = fixture.componentInstance.groups;

        fixture.componentInstance.groups = [arr[1],arr[0]];
        fixture.detectChanges();

        expect(fixture.nativeElement.children.length).toEqual(11);


        //field2 group f2v1
        expect(fixture.nativeElement.children[0].innerText).toEqual('group f2v1 level 0');
        //field1 group f1v1
        expect(fixture.nativeElement.children[1].innerText).toEqual('group f1v1 level 1');

        //group items
        expect(fixture.nativeElement.children[2].innerText).toEqual('0 f1v1 f2v1 f3v1 f4v1');
        expect(fixture.nativeElement.children[3].innerText).toEqual('2 f1v1 f2v1 f3v3 f4v1');

        //group f2v2
        expect(fixture.nativeElement.children[4].innerText).toEqual('group f2v2 level 0');
        //field1 group f1v1
        expect(fixture.nativeElement.children[5].innerText).toEqual('group f1v1 level 1');
        //group item
        expect(fixture.nativeElement.children[6].innerText).toEqual('1 f1v1 f2v2 f3v2 f4v1');

        //group f2v3
        expect(fixture.nativeElement.children[7].innerText).toEqual('group f2v3 level 0');
        //group f1v2
        expect(fixture.nativeElement.children[8].innerText).toEqual('group f1v2 level 1');

        //group items
        expect(fixture.nativeElement.children[9].innerText).toEqual('3 f1v2 f2v3 f3v4 f4v1');
        expect(fixture.nativeElement.children[10].innerText).toEqual('4 f1v2 f2v3 f3v5 f4v1');

    });

});