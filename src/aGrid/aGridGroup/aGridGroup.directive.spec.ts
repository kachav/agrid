import { AGridGroupDirective } from './aGridGroup.directive';

import { Component, ViewChild, TemplateRef } from "@angular/core";

import { async, inject, TestBed } from '@angular/core/testing';

@Component({
    template: '<div *aGridGroup="let group by \'grName\'"></div>',
    selector: 'test-container'
})
class testContainer {
    @ViewChild(AGridGroupDirective) public targetDirective;
}


describe('aGridGroup.component', () => {
    let templatRefMock = {}, instance: AGridGroupDirective;

    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridGroupDirective, testContainer
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(testContainer).componentInstance.targetDirective;
        });
    }));

    it('aGridGroup is a constructor', () => {
        expect(typeof instance).toEqual('object');
    });

    it('aGridGroup.template should be instance of TemplateRef', () => {
        let result = instance.template instanceof TemplateRef;

        expect(result).toEqual(true);
    });

    it('collapsed when collapsedDefault set by string', () => {
        let key = { aaa: 123 }, groupName = 'groupName';

        instance.collapsedDefault = groupName;

        expect(instance.isCollapsed(key, groupName)).toEqual(true);

        instance.toggleCollapse(key, true);

        expect(instance.isCollapsed(key, groupName)).toEqual(false);
    });

    it('collapsed when collapsedDefault', () => {
        let key = { aaa: 123 }, groupName = 'groupName';

        instance.collapsedDefault = [groupName];

        expect(instance.isCollapsed(key, groupName)).toEqual(true);

        instance.toggleCollapse(key, true);

        expect(instance.isCollapsed(key, groupName)).toEqual(false);
    });

    it('!collapsed when !collapsedDefault', () => {
        let key = { aaa: 123 }, groupName = 'groupName';

        instance.collapsedDefault = null;

        expect(instance.isCollapsed(key, groupName)).toEqual(false);

        instance.toggleCollapse(key, false);

        expect(instance.isCollapsed(key, groupName)).toEqual(true);
    });


    it('Can toggle collapse', () => {
        let key = { aaa: 123 }, groupName = 'groupName';

        expect(instance.isCollapsed(key, groupName)).toEqual(false);

        instance.toggleCollapse(key, false);

        expect(instance.isCollapsed(key, groupName)).toEqual(true);

        instance.toggleCollapse(key, true);

        expect(instance.isCollapsed(key, groupName)).toEqual(false);
    });

    it('isParentCollapsed true when one of the parent is collapsed', () => {
        let parentOne: any = { $implicit: { aaa: 123 }, groupName: 'group1' };
        let parentTwo: any = { $implicit: { aaa: 123 }, groupName: 'group2' };
        let parentThree: any = { $implicit: { aaa: 123 }, groupName: 'group3' };

        //only parentTwo isCollapsed
        spyOn(instance, 'isCollapsed').and.callFake((item, groupName) => { return groupName === parentTwo.groupName });

        parentOne.parent = parentTwo;
        parentTwo.parent = parentThree;

        let isParentCollapsedValue = instance.isParentCollapsed(parentOne);

        expect(instance.isCollapsed).toHaveBeenCalledWith(parentOne.$implicit, parentOne.groupName);
        expect(instance.isCollapsed).toHaveBeenCalledWith(parentTwo.$implicit, parentTwo.groupName);
        expect(instance.isCollapsed).toHaveBeenCalledWith(parentThree.$implicit, parentThree.groupName);

        expect(isParentCollapsedValue).toEqual(true);
    })

    it('isParentCollapsed false when no one of the parent is collapsed', () => {
        let parentOne: any = { $implicit: { aaa: 123 }, groupName: 'group1' };
        let parentTwo: any = { $implicit: { aaa: 123 }, groupName: 'group2' };
        let parentThree: any = { $implicit: { aaa: 123 }, groupName: 'group3' };

        //no one parent is collapsed
        spyOn(instance, 'isCollapsed').and.callFake(() => false);

        parentOne.parent = parentTwo;
        parentTwo.parent = parentThree;

        let isParentCollapsedValue = instance.isParentCollapsed(parentOne);

        expect(instance.isCollapsed).toHaveBeenCalledWith(parentOne.$implicit, parentOne.groupName);
        expect(instance.isCollapsed).toHaveBeenCalledWith(parentTwo.$implicit, parentTwo.groupName);
        expect(instance.isCollapsed).toHaveBeenCalledWith(parentThree.$implicit, parentThree.groupName);

        expect(isParentCollapsedValue).toEqual(false);
    })

    it('Can delete collapse', () => {
        let key = { aaa: 123 }, groupName = 'groupName';

        expect(instance.isCollapsed(key, groupName)).toEqual(false);

        instance.toggleCollapse(key, false);

        expect(instance.isCollapsed(key, groupName)).toEqual(true);

        instance.deleteCollapse(key);

        expect(instance.isCollapsed(key, groupName)).toEqual(false);
    });

})