import {aGridCell} from './agridcell.component';

describe('agridcell.component', () => {
    it('aGridCell is a constructor',()=>{
        let instance = new aGridCell();

        expect(typeof instance).toEqual('object');
    });
})