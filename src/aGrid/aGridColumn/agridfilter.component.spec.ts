import {aGridFilter} from './agridfilter.component';

describe('agridfilter.component', () => {
    it('aGridFilter is a constructor',()=>{
        let instance = new aGridFilter();

        expect(typeof instance).toEqual('object');
    });
})