import {LodashService} from './lodash.service';
import { debounce } from 'lodash';

describe('mutationObserver.service', () => {

    it('debounce is debounce function from lodash',()=>{
        let instance=new LodashService();

        expect(instance.debounce).toBe(debounce);
    });
});