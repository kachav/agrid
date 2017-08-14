import {AGridPagerComponent} from './agridpager.component';

describe('agridpager.component', () => {
    it('aGridPager is a constructor',()=>{
        let instance = new AGridPagerComponent();

        expect(typeof instance).toEqual('object');
    });
})