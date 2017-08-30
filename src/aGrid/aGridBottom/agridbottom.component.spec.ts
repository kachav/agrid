import {AGridBottomComponent} from './agridbottom.component';

describe('agridbottom.component', () => {
    it('aGridBottom is a constructor',()=>{
        let instance = new AGridBottomComponent();

        expect(typeof instance).toEqual('object');
    });
})