import {MutationObserverService} from './mutationObserver.service';


describe('mutationObserver.service', () => {

    it('getObserver returns instance of MutationObserver',()=>{
        let instance=new MutationObserverService();

        let observer = instance.getObserver(()=>{});

        let result = observer instanceof MutationObserver;

        expect(result).toEqual(true);
    });
});