import { AGridColumnComponent, UNIT_PERC } from './agridcolumn.component';
import { async } from '@angular/core/testing';

describe('agridcolumn.component', () => {
    let colInstance: AGridColumnComponent;

    beforeEach(() => {
        colInstance = new AGridColumnComponent();
    });

    it('resizable true by default', () => {
        expect(colInstance.resizable).toEqual(true);
    });

    it('width === 100 by default', () => {
        expect(colInstance.width).toEqual(100);
    });

    it('widthChangeStart sets gridWidth', async(() => {
        let startWidth = 137;

        colInstance.gridWidth$.last().subscribe(gridWidth=>{
            expect(gridWidth).toEqual(startWidth);
        });

        colInstance.widthChangeStart(startWidth,15);
        colInstance.ngOnDestroy();
    }));

    it('widthChangeStart emits width$', async(() => {
        let startWidth = 137, colOffsetWidth=50;

        colInstance.width$.last().subscribe(width=>{
            expect(width).toEqual(colOffsetWidth);
        });
        //colInstance.widthUnit=UNIT_PERC;

        colInstance.widthChangeStart(startWidth,colOffsetWidth);
        colInstance.ngOnDestroy();
    }));

    it('widthChangeStart emits width$ in percents', async(() => {
        let startWidth = 200, colOffsetWidth=50;

        colInstance.width$.last().subscribe(width=>{
            expect(width).toEqual((colOffsetWidth/startWidth)*100);
        });
        colInstance.widthUnit=UNIT_PERC;

        colInstance.widthChangeStart(startWidth,colOffsetWidth);
        colInstance.ngOnDestroy();
    }));

    it('widthChangeStart emits changingStart$ true', async(() => {
        let startWidth = 137;

        colInstance.changingStart$.last().subscribe(started=>{
            expect(started).toEqual(true);
        });

        colInstance.widthChangeStart(startWidth,25);
        colInstance.ngOnDestroy();
    }));

    it('widthChanging emits diff$', async(() => {
        let diff = 4;

        colInstance.diff$.last().subscribe(emitDiff=>{
            expect(emitDiff).toEqual(diff);
        });

        colInstance.widthChanging(diff);
        colInstance.ngOnDestroy();
    }));

    it('widthUnit emits units$', async(() => {
        colInstance.units$.last().subscribe(result=>{
            expect(result).toEqual(UNIT_PERC);
        })
        colInstance.widthUnit=UNIT_PERC;
        colInstance.ngOnDestroy();
    }));

    it('widthUnit returns units$ value', () => {
        colInstance.widthUnit=UNIT_PERC;
        expect(colInstance.widthUnit).toEqual(UNIT_PERC);
    });

    it('minWidth returns minWidth$ value', () => {
        colInstance.minWidth = 100;
        expect(colInstance.minWidth).toEqual(100);
    });

    it('widthChanged emits gridWidth$ and _changingEnd', async(() => {
        let gridWidth = 400;
        let instance:any = colInstance;

        colInstance.gridWidth$.last().subscribe(emitWidth=>{
            expect(emitWidth).toEqual(gridWidth);
        });

        spyOn(instance._changingEnd,'next');

        colInstance.widthChanged(gridWidth);

        expect(instance._changingEnd.next).toHaveBeenCalled();
        colInstance.ngOnDestroy();
    }));

    it('ngOnDestroy emits _destroy', async(() => {
        let instance:any = colInstance;

        spyOn(instance._destroy,'next');

        colInstance.ngOnDestroy();

        expect(instance._destroy.next).toHaveBeenCalled();

    }));

    it('px setting works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('200px');
        })
        
        colInstance.width=200;
        colInstance.ngOnDestroy();

    }));

    it('px changing works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('205px');
        })
        
        colInstance.width=200;

        colInstance.widthChangeStart(500,200);

        colInstance.widthChanging(5);

        colInstance.ngOnDestroy();

    }));

    it('px change end works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('205px');
        })
        
        colInstance.width=200;

        colInstance.widthChangeStart(500,200);

        colInstance.widthChanging(5);

        colInstance.widthChanged(500);

        colInstance.ngOnDestroy();

    }));

    it('px minWidth works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('200px');
        })
        
        colInstance.width=200;

        colInstance.minWidth = 200;

        colInstance.widthChangeStart(500,200);

        colInstance.widthChanging(-5);

        colInstance.ngOnDestroy();

    }));

    it('% setting works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('50%');
        })
        colInstance.widthUnit=UNIT_PERC;
        colInstance.width=50;
        colInstance.ngOnDestroy();
    }));

    it('% converts to px when changing starts', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('250px');
        })
        colInstance.widthUnit=UNIT_PERC;
        colInstance.width=50;
        colInstance.widthChangeStart(500,250);
        colInstance.ngOnDestroy();
    }));


    it('% changing works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('255px');
        })
        
        colInstance.widthUnit=UNIT_PERC;
        colInstance.width=50;
        colInstance.widthChangeStart(500,250);

        colInstance.widthChanging(5);

        colInstance.ngOnDestroy();

    }));

    it('px converts to % back when changing ends', async(() => {
        const gridWidth = 500;
        colInstance.calcWidth$.last().subscribe(result=>{
            let res = (255/gridWidth)*100;
            expect(result).toEqual(`${res}%`);
        })
        
        colInstance.widthUnit=UNIT_PERC;
        colInstance.width=50;
        colInstance.widthChangeStart(gridWidth, 250);

        colInstance.widthChanging(5);

        colInstance.widthChanged(gridWidth);

        colInstance.ngOnDestroy();
    }));

});