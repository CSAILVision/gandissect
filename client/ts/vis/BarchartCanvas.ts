import {VComponent} from "./VisComponent";
import {D3Sel} from "../etc/Util";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import * as d3 from "d3";

// export type API_generate = {
//     request: {
//         "ablations":
//             {
//                 "alpha": number,
//                 "layer": string,
//                 "unit": number
//             }[] | null,
//         "ids": number[],
//         "project": string,
//         "wantz": boolean
//     },
//     res: { d: string, id?: number }[]
//
// }
export type BarchartCanvasData = {
    values: number[],
    ids: number[]
}

export class BarchartCanvas extends VComponent<BarchartCanvasData> {
    private c: CanvasRenderingContext2D;
    private svg: d3.Selection<d3.BaseType, any, any, any>;


    constructor(d3parent: D3Sel, eventHandler?: SimpleEventHandler) {
        super(d3parent, eventHandler);
        this.superInitHTML();
        this._init();
    }

    // public static events = {
    //     request_examples: "ExampleView_re",
    //     apply_recipe: "ExampleView_ar"
    // }


    protected _current = {};
    protected css_name = "BarchartCanvas";
    protected options = {
        pos: {x: 0, y: 0},
        w: 200,
        h: 100
    };

    protected _init() {
        const op = this.options;
        this.c = (<HTMLCanvasElement> this.base.append('canvas').attrs({
            width: op.w,
            height: op.h
        }).style('position','absolute').node())
            .getContext("2d");

        this.svg =this.base.append('svg').attrs({
            width: op.w,
            height: op.h
        }).style('position','absolute');

        this.svg.append('g').call(d3.brushX().extent([[0, 0], [op.w, op.h]])
        .on("end", ()=>{
            console.log("--- bEnd");
        }))

    }

    protected _render(rData: BarchartCanvasData = this.renderData): void {
        const op = this.options;

        this.c.clearRect(0, 0, op.w, op.h);

        const yMinMax = d3.extent(rData.values);
        if (yMinMax[0] > 0) yMinMax[0] = 0;

        const yScale = d3.scaleLinear()
            .domain(yMinMax)
            .range([op.h - 4, 2]);

        const xScale = d3.scaleLinear()
            .domain([0, rData.values.length])
            .range([2, op.w - 4]);

        const barWidth = xScale(1) - xScale(0);
        const yZero = yScale(0);
        const rD = d3.zip(rData.values, rData.ids);

        this.c.beginPath();
        this.c.fillStyle = 'red';
        rData.values.forEach((v, i) => {
            if (v >= 0) {
                this.c.fillRect(xScale(i), yScale(v), barWidth, yZero - yScale(v));
            } else {
                this.c.fillRect(xScale(i), yZero, barWidth, yScale(v) - yZero);
            }
        });

        // this.c.fillRect(10, 10, 20, 20);
        this.c.closePath();




    }

    protected _wrangle(data: BarchartCanvasData) {
        // data.values = data.values.sort();
        return data;
    }


}