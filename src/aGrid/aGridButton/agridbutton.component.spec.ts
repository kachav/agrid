import {AGridButtonComponent} from './agridbutton.component';

describe('agridbutton.component', () => {
    it('aGridButton is a constructor',()=>{
        let instance = new AGridButtonComponent();

        expect(typeof instance).toEqual('object');
    });
})