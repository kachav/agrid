import {aGridPager} from './agridpager.component';

describe('agridpager.component', () => {
    it('aGridPager is a constructor',()=>{
        let instance = new aGridPager();

        expect(typeof instance).toEqual('object');
    });
})