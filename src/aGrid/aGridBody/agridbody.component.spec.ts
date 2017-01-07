import { aGridBody } from './agridbody.component';

import { async, inject, TestBed } from '@angular/core/testing';

describe('agridbody.component', () => {
    let instance;

    beforeEach(async(() => {

        return TestBed.configureTestingModule({

            declarations: [
                aGridBody
            ]
        }).overrideComponent(aGridBody, {
            set: {
                template: "<div></div>"
            }
        }).compileComponents().then(() => {
            instance = TestBed.createComponent(aGridBody).componentInstance;
        });


    }));

    it('lastColumnResizable === false when columns not set', () => {
        instance.columns = null;
        expect(instance.lastColumnResizable).toEqual(false);
    })

    it('lastColumnResizable === false when columns are empty', () => {
        instance.columns = [];
        expect(instance.lastColumnResizable).toEqual(false);
    })

    it('lastColumnResizable === false when last column is not resizable', () => {
        instance.columns = [{ resizable: true }, { resizable: false }];
        expect(instance.lastColumnResizable).toEqual(false);
    })

    it('lastColumnResizable === true when last column is resizable', () => {
        instance.columns = [{ resizable: true }, { resizable: true }];
        expect(instance.lastColumnResizable).toEqual(true);
    })

    it('onRowClick.next fires on rowClick', () => {
        spyOn(instance.onRowClick, 'next');
        let row = { test: 123 };
        instance.rowClick(row);
        expect(instance.onRowClick.next).toHaveBeenCalledWith(row);
    })

    it('onRowDoubleClick.next fires on rowDoubleClick', () => {
        spyOn(instance.onRowDoubleClick, 'next');
        let row = { test: 123 };
        instance.rowDoubleClick(row);
        expect(instance.onRowDoubleClick.next).toHaveBeenCalledWith(row);
    })
});