import {aGridHeader} from './agridheader.component';

describe('agridheader.component', () => {
    it('aGridHeader is a constructor',()=>{
        let instance = new aGridHeader();

        expect(typeof instance).toEqual('object');
    });
})