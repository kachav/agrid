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

        colInstance.gridWidth$.skip(1).first().subscribe(gridWidth=>{
            expect(gridWidth).toEqual(startWidth);
        });

        colInstance.widthChangeStart(startWidth);

    }));

    it('widthChangeStart emits changingStart$ true', async(() => {
        let startWidth = 137;

        colInstance.changingStart$.skip(1).first().subscribe(started=>{
            expect(started).toEqual(true);
        });

        colInstance.widthChangeStart(startWidth);

    }));

    it('widthChanging emits diff$', async(() => {
        let diff = 4;

        colInstance.diff$.skip(1).first().subscribe(emitDiff=>{
            expect(emitDiff).toEqual(diff);
        });

        colInstance.widthChanging(diff);

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

    it('widthChanged emits gridWidth$ and _changingEnd', async(() => {
        let gridWidth = 400;
        let instance:any = colInstance;

        colInstance.gridWidth$.skip(1).first().subscribe(emitWidth=>{
            expect(emitWidth).toEqual(gridWidth);
        });

        spyOn(instance._changingEnd,'next');

        colInstance.widthChanged(gridWidth);

        expect(instance._changingEnd.next).toHaveBeenCalled();

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

        colInstance.widthChangeStart(500);

        colInstance.widthChanging(5);

        colInstance.ngOnDestroy();

    }));

    it('px change end works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('205px');
        })
        
        colInstance.width=200;

        colInstance.widthChangeStart(500);

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

        colInstance.widthChangeStart(500);

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
        colInstance.widthChangeStart(500);
        colInstance.ngOnDestroy();
    }));


    it('% changing works', async(() => {
        colInstance.calcWidth$.last().subscribe(result=>{
            expect(result).toEqual('255px');
        })
        
        colInstance.widthUnit=UNIT_PERC;
        colInstance.width=50;
        colInstance.widthChangeStart(500);

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
        colInstance.widthChangeStart(gridWidth);

        colInstance.widthChanging(5);

        colInstance.widthChanged(gridWidth);

        colInstance.ngOnDestroy();
    }));

/* 
    it('can\'t set column width less then 36px', () => {
        let modificator = 35;
        expect(colInstance.width).toEqual(100);
        //colInstance.setWidth(modificator);
        expect(colInstance.width).toEqual(100);
    }); */

});