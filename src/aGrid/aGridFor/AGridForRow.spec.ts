import { AGridForRow } from './AGridForRow';

describe('aGridForRow', () => {

    it('constructors parameters saves in fields', () => {
        let imp = { test: "111" }, index = 1, count = 10, instance = new AGridForRow(imp, index, count);

        expect(instance.$implicit).toBe(imp);
        expect(instance.index).toEqual(index);
        expect(instance.count).toEqual(count);
    })

    it("first true when index === 0", () => {
        let imp = { test: "111" }, index = 0, count = 10, instance = new AGridForRow(imp, index, count);

        expect(instance.first).toEqual(true);
    })

    it("first false when index !== 0", () => {
        let imp = { test: "111" }, index = 4, count = 10, instance = new AGridForRow(imp, index, count);

        expect(instance.first).toEqual(false);
    })

    it("last true when index === count - 1", () => {
        let imp = { test: "111" }, index, count = 10, instance;;

        index = count - 1;

        instance = new AGridForRow(imp, index, count)

        expect(instance.last).toEqual(true);
    })

    it("last false when index !== count - 1", () => {
        let imp = { test: "111" }, index, count = 10, instance;;

        index = count - 2;

        instance = new AGridForRow(imp, index, count)

        expect(instance.last).toEqual(false);
    })

    it("even === true when index is even", () => {
        let imp = { test: "111" }, index = 4, count = 10, instance = new AGridForRow(imp, index, count);

        expect(instance.even).toEqual(true);
    })

    it("even === false when index is not even", () => {
        let imp = { test: "111" }, index = 5, count = 10, instance = new AGridForRow(imp, index, count);

        expect(instance.even).toEqual(false);
    })

    it("odd === true when index is not even", () => {
        let imp = { test: "111" }, index = 5, count = 10, instance = new AGridForRow(imp, index, count);

        expect(instance.odd).toEqual(true);
    })

    it("odd === false when index is even", () => {
        let imp = { test: "111" }, index = 4, count = 10, instance = new AGridForRow(imp, index, count);

        expect(instance.odd).toEqual(false);
    })

});