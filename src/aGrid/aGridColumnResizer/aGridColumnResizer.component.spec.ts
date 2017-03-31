import { AGridColumnResizerComponent } from './aGridColumnResizer.component';
import { async, inject, TestBed } from '@angular/core/testing';

let fakeStyle = { right: "12px" };

class MockWindow {
    constructor() {
        spyOn(this, 'getComputedStyle').and.callFake(() => fakeStyle);
    }
    getComputedStyle() {
    }
}

describe('aGridColumnResizer.component', () => {
    let instance;


    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridColumnResizerComponent
            ],
            providers: [
                { provide: Window, useClass: MockWindow }
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(AGridColumnResizerComponent).componentInstance;
        });
    }));

    it('mouseDown sets active to true', () => {
        let right = 23, e = { pageX: 123, target: { parentNode: { aaa: 123 } } };
        fakeStyle.right = `${right}px`;

        instance.colResizerMouseDown(e);

        expect(instance.active).toEqual(true);
    });

    it('mouseDown fires getComputedStyle with e.target.parentNode', () => {
        let right = 23, e = { pageX: 123, target: { parentNode: { aaa: 123 } } };
        fakeStyle.right = `${right}px`;

        instance.colResizerMouseDown(e);

        expect(instance.wnd.getComputedStyle).toHaveBeenCalledWith(e.target.parentNode);
    });

    it('mouseDown takes startRight from right', () => {
        let right = 23, e = { pageX: 123, target: { parentNode: { aaa: 123 } } };
        fakeStyle.right = `${right}px`;

        instance.colResizerMouseDown(e);

        expect(instance.startRight).toEqual(right);
    });

    it('mouseDown takes rightNumber from right', () => {
        let right = 23, e = { pageX: 123, target: { parentNode: { aaa: 123 } } };
        fakeStyle.right = `${right}px`;

        instance.colResizerMouseDown(e);

        expect(instance.rightNumber).toEqual(right);
    });

    it('mouseDown takes xPrev from e.pageX', () => {
        let right = 23, e = { pageX: 123, target: { parentNode: { aaa: 123 } } };
        fakeStyle.right = `${right}px`;

        instance.colResizerMouseDown(e);

        expect(instance.xPrev).toEqual(e.pageX);
    });

    it('mouseDown takes right from fakeStyle.right', () => {
        let right = 23, e = { pageX: 123, target: { parentNode: { aaa: 123 } } };
        fakeStyle.right = `${right}px`;

        instance.colResizerMouseDown(e);
        expect(instance.right).toEqual(fakeStyle.right);
    });

    it('columnResized.next should fire on colResizerMouseUp when active === true', () => {
        instance.active = true;
        instance.startRight = 30;
        instance.rightNumber = 14;
        instance.right = 'right';
        spyOn(instance.columnResized, 'next');

        instance.colResizerMouseUp();

        expect(instance.active).toEqual(false);
        expect(instance.right).toEqual('');
        expect(instance.columnResized.next).toHaveBeenCalledWith(instance.startRight - instance.rightNumber);
    });

    it('columnResized.next should not fire on colResizerMouseUp when active === false', () => {
        instance.active = false;
        spyOn(instance.columnResized, 'next');
        instance.colResizerMouseUp();

        expect(instance.columnResized.next).not.toHaveBeenCalled();
    });


    it('mouseMove changes right and rightNumber when active and xPrev is set', () => {
        let rightNumber = 30, e = { pageX: 15 };
        instance.active = true;
        instance.xPrev = 12;
        instance.rightNumber = rightNumber;


        rightNumber -= (e.pageX - instance.xPrev);
        instance.colResizerMouseMove(e);

        expect(instance.rightNumber).toEqual(rightNumber);
        expect(instance.xPrev).toEqual(e.pageX);
        expect(instance.right).toEqual(`${rightNumber}px`);
    });


    it('mouseMove changes right and rightNumber when active and xPrev is set', () => {
        let e = { pageX: 15 }, rightValue = "rightValue";
        instance.active = false;
        instance.xPrev = 0;
        instance.right = rightValue;

        instance.colResizerMouseMove(e);
        expect(instance.right).toEqual(rightValue);


        instance.active = false;
        instance.xPrev = 12;
        instance.right = rightValue;

        instance.colResizerMouseMove(e);
        expect(instance.right).toEqual(rightValue);

        instance.active = true;
        instance.xPrev = 0;
        instance.right = rightValue;

        instance.colResizerMouseMove(e);
        expect(instance.right).toEqual(rightValue);

    });

});