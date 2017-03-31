import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'myListFilter' })
export class FilterPipe implements PipeTransform {
    public transform(list, args) {
        let filterArray = [];
        if (Array.isArray(args)) {
            for (let i = 0; i < args.length; i += 2) {
                if (args[i] && args[i + 1]) {
                    filterArray.push({ field: args[i], value: args[i + 1] });
                }
            }
        }
        return list.filter((item) => {
            let result = true;
            filterArray.forEach((filter) => {
                if (item[filter.field].toLowerCase().indexOf(filter.value.toLowerCase()) === -1) {
                    result = false;
                } else {
                    console.log(item[filter.field]);
                }
            });
            return result;
        });
    }
}
