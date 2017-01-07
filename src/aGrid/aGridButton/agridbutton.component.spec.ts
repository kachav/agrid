import {aGridButton} from './agridbutton.component';

describe('agridbutton.component', () => {
    it('aGridButton is a constructor',()=>{
        let instance = new aGridButton();

        expect(typeof instance).toEqual('object');
    });
})