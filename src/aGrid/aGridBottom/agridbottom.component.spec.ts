import {aGridBottom} from './agridbottom.component';

describe('agridbottom.component', () => {
    it('aGridBottom is a constructor',()=>{
        let instance = new aGridBottom();

        expect(typeof instance).toEqual('object');
    });
})