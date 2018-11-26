import * as d3 from "d3";

/**
 * Created by hen on 5/15/17.
 */
let the_unique_id_counter = 0;

export class Util {
    static simpleUId({prefix = ''}): string {
        the_unique_id_counter += 1;

        return prefix + the_unique_id_counter;
    }
}

export type D3Sel = d3.Selection<any, any, any, any>

export function argsort(array, sortFct):number[] {
    return array
        .map((d, i) => [d, i])
        .sort((a,b) => sortFct(a[0], b[0]))
        .map(d => d[1]);
}

export function range(end){
    return [...Array(end).keys()]
}

export function obj_to_arr(obj:object){
    const sortedKeys = Object.keys(obj).sort();
    const res=[];
    sortedKeys.forEach(k => {res.push(k); res.push(obj[k])})
    return res;
}

export function arr_to_obj(arr:any){
    const res={};
    const max_l = Math.floor(arr.length/2);
    for (let i = 0; i<max_l; i++){
        res[arr[2*i]] = arr[2*i+1];
    }
    return res;
}