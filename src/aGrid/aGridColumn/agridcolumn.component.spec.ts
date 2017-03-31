import { AGridColumnComponent } from './agridcolumn.component';

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

    it('setWidth sets column width', () => {
        let modificator=137;
        expect(colInstance.width).toEqual(100);
        colInstance.setWidth(modificator);
        expect(colInstance.width).toEqual(modificator);
    });

    it('changeWidth fires setWidth with argument + width', () => {
        let width = colInstance.width, modificator=137;
        spyOn(colInstance,'setWidth');
        colInstance.changeWidth(modificator);
        expect(colInstance.setWidth).toHaveBeenCalledWith(width+modificator);
    });
});