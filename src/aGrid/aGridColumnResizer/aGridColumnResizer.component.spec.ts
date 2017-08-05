import { AGridColumnResizerComponent } from './aGridColumnResizer.component';
import { async, inject, TestBed } from '@angular/core/testing';

describe('aGridColumnResizer.component', () => {
    let instance;


    beforeEach(async(() => {
        return TestBed.configureTestingModule({

            declarations: [
                AGridColumnResizerComponent
            ]
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(AGridColumnResizerComponent).componentInstance;
        });
    }));

    it('mouseDown sets active to true and save startRight, rightNumber and xPrev', () => {
        let e = { pageX: 123, target: { parentNode: { aaa: 123 } } };

        spyOn(instance.columnResizeStart, 'emit');

        instance.colResizerMouseDown(e);

        expect(instance.active).toEqual(true);

        expect(instance.startRight).toEqual(0);

        expect(instance.rightNumber).toEqual(0);

        expect(instance.xPrev).toEqual(123);

        expect(instance.columnResizeStart.emit).toHaveBeenCalled();
    });

    it('mouseUp don\'t triggers columnResized when active is false', () => {
        instance.active = false;
        instance.startRight = 30;
        instance.rightNumber = 14;
        instance.right = 'right';
        spyOn(instance.columnResized, 'emit');

        instance.colResizerMouseUp();

        expect(instance.columnResized.emit).not.toHaveBeenCalled();
    });

    it('mouseUp triggers columnResized', () => {
        instance.active = true;
        instance.startRight = 30;
        instance.rightNumber = 14;
        instance.right = 'right';
        spyOn(instance.columnResized, 'emit');

        instance.colResizerMouseUp();

        expect(instance.columnResized.emit).toHaveBeenCalledWith(instance.startRight - instance.rightNumber);
    });

    it('mouseUp sets active to false', () => {
        instance.active = true;
        instance.startRight = 30;
        instance.rightNumber = 14;
        instance.right = 'right';

        instance.colResizerMouseUp();

        expect(instance.active).toEqual(false);
    });

    it('mouseMove fires columnResized.next when active', () => {
        let startRight = 30, e = { pageX: 15 };

        spyOn(instance.columnResizing, 'emit');

        instance.active = true;
        instance.xPrev = 12;
        instance.rightNumber = startRight;

        let rightNumberNew = startRight - (e.pageX - instance.xPrev);

        instance.colResizerMouseMove(e);

        expect(instance.columnResizing.emit).toHaveBeenCalledWith(startRight - rightNumberNew);
    });
    it('mouseMove do not fires columnResized.next when active is false', () => {
        let startRight = 30, e = { pageX: 15 };

        spyOn(instance.columnResizing, 'emit');

        instance.active = false;
        instance.xPrev = 12;
        instance.rightNumber = startRight;

        let rightNumberNew = startRight - (e.pageX - instance.xPrev);

        instance.colResizerMouseMove(e);

        expect(instance.columnResizing.emit).not.toHaveBeenCalled();
    });

});