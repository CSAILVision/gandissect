import {VComponent} from "./VisComponent";
import * as d3 from "d3";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {argsort, arr_to_obj, D3Sel, obj_to_arr} from "../etc/Util";
import {GlobalEvents} from "../etc/GlobalVars";
import {brush} from "d3";
import URLHandler from "../etc/URLHandler";
import {AblationData} from "../api/GanterAPI";



// export type ImageMatrixImage = { img: string; id: number, label: number, pred: number }
//
// type ImageMatrixRender = {
//     layer: string;
//     images: ImageMatrixImage[]
// }[]

export class AblationView extends VComponent<AblationData> {

    public static events = {
        image_hovered: 'AblationView_ih',
        ablation_changed: 'AblationView_abch',

    };

    protected css_name: string = 'AblationView';


    protected options = {
        pos: {x: 0, y: 0},
        measures: {
            img_width: 50,
            img_dist: 52,
            barHeight: 100,
            main: {
                padding: 10
            }
        }
    };

    protected _current = {
        width: 100,
        img_range: [0, 10],
        img_space: 10,
        ablation_scale: d3.scaleLinear(),
        ablation_changes: <{ [key: number]: number }>{1: 1, 3: 0},

        sort: {
            i_to_s: [],
            s_to_i: []
        }

    };


    private rs: d3.Selection<d3.BaseType, any, any, any>;


    constructor(d3parent: D3Sel, eventHandler?: SimpleEventHandler) {
        super(d3parent, eventHandler);
        this.superInitHTML();
        this._init();
    }

    protected _init() {
        const ms = this.options.measures;
        const c = this._current;
        this.rs = this.base.append('svg').attrs({
            class: 'ranking_selector',
            width: 100,
            height: ms.barHeight
        });


        this.eventHandler.bind(GlobalEvents.main_resize, (d) => {
            c.width = (d.w - 2 * ms.main.padding);
            this.rs.attr('width', c.width);
            c.img_space = Math.floor(c.width / ms.img_dist);
            c.img_range[1] = c.img_range[0] + c.img_space;

            // console.log(c.img_range,"--- c.img_range");
            this._render();
        })


        this.eventHandler.bind(AblationView.events.ablation_changed, (d) => {
            this.actionChangeAblationValue(d.i, d.new_value);


        })

        const start_params = URLHandler.parameters

        if ('abl_chg' in start_params) {
            this._current.ablation_changes = arr_to_obj(start_params['abl_chg'])
        }


    }

    protected _render(renderData: AblationData = this.renderData): void {
        if (!renderData) return;
        const cur = this._current;

        // TODO: correct for over-length range
        this._correct_selection_range();

        //TODO: hack for now
        if (cur.sort.s_to_i.length !== renderData.channels.length) {
            cur.sort.s_to_i = d3.range(renderData.channels.length);

            cur.sort.i_to_s = d3.range(cur.sort.s_to_i.length);
            cur.sort.s_to_i.forEach((i, s) => cur.sort.i_to_s[i] = s)
        }


        if (renderData.ablation) {

            this.renderRangeSelector();

        }


        if (renderData.channels) {
            this.renderImages();
        }


    }

    private _correct_selection_range(renderData = this.renderData) {
        const cur = this._current;

        if (cur.img_range[1] >= renderData.channels.length) {
            const diff = renderData.channels.length - cur.img_range[1];
            cur.img_range[1] += diff;
            cur.img_range[0] += diff;
            if (cur.img_range[0] < 0) cur.img_range[0] = 0;

        }
    }


    private renderRangeSelector(renderData: AblationData = this.renderData) {
        const that = this;
        const cur = this._current;
        const ms = this.options.measures;

        const layers = {
            fg: <D3Sel>null,
            bg: <D3Sel>null,
            brush: <D3Sel>null,
            main: <D3Sel>null
        };

        if (!this.rs.property('configured')) {
            for (const l of ['bg', 'main', 'brush', 'fg']) {
                layers[l] = this.rs.append('g').attr('class', l);
            }
            this.rs.property('configured', true);
        } else {
            for (const l of ['bg', 'main', 'brush', 'fg']) {
                layers[l] = this.rs.select(`.${l}`)
            }
        }


        const xScale = d3.scaleLinear()
            .domain([0, renderData.ablation.length + 1])
            .range([22, cur.width]);

        const barWidth = xScale(1) - xScale(0);

        const ab_min_max = d3.extent(renderData.ablation);
        if (ab_min_max[0] > 0) ab_min_max[0] = 0;
        const yScale = d3.scaleLinear()
            .domain(ab_min_max)
            .range([ms.barHeight - 5, 5]);
        const zero = yScale(0);

        // map sort order to elements: i=data array index, s=sort index, d=data
        const ab_data = cur.sort.s_to_i
            .map((i, s) => ({i, s, abl: renderData.ablation[i]}));

        const bar = layers.main.selectAll(".bar").data(ab_data);
        bar.exit().remove();

        const barEnter = bar.enter().append('rect').attr('class', 'bar');


        barEnter.merge(bar).attrs({
            class: d => (d.abl >= 0) ? "bar pos" : 'bar neg',
            x: (d, i) => xScale(i),
            y: (d) => (d.abl >= 0) ? yScale(d.abl) : zero,
            height: (d) => (d.abl >= 0) ? zero - yScale(d.abl) : yScale(d.abl) - zero,
            width: barWidth
        });

        const y_axis_g = layers.bg.selectAll('.y-axis').data([ab_min_max]);
        const yAxis = d3.axisLeft(yScale);
        y_axis_g.enter()
            .append('g').classed('y-axis', true)
            .attr('transform', 'translate(20,0)')
            .merge(y_axis_g).call(yAxis);


        const b = d3.brushX()
            .extent([[22, 0], [cur.width, ms.barHeight]])
            .on('brush', function () {
                // console.log("brush--- ", d3.event.type);
                // if (d3.event.sourceEvent) console.log(d3.event.sourceEvent.type,"--- d3.event.sourceEvent.type");
                if (!d3.event.sourceEvent || d3.event.sourceEvent.type === "brush") return;
                // console.log("--- beyond --");
                const d0 = d3.event.selection.map(xScale.invert),
                    d1 = d0.map(Math.round);

                // If empty when rounded, use floor instead.
                if (d1[0] >= d1[1]) {
                    d1[0] = Math.floor(d0[0]);
                    d1[1] = d1[0] + cur.img_space;
                }
                cur.img_range = d1;
                that._correct_selection_range();


                // console.log(d3.event.selection, "--- d3.event.selection");
                d3.select(this).call(d3.event.target.move, cur.img_range.map(xScale));
                that.renderImages();
            });


        const bRender = layers.brush.call(b).call(b.move, cur.img_range.map(xScale));
        bRender.selectAll('.handle').remove();
        bRender.selectAll('.overlay').attr('pointer-events', 'none');
    }


    private renderImages(renderData: AblationData = this.renderData) {
        const cur = this._current;

        // map sort order to elements: i=data array index, s=sort index, d=data
        const selection = d3.range(cur.img_range[0], cur.img_range[1])
            .map(s_index => cur.sort.s_to_i[s_index])
            .map((i, s) => ({i, s, img: renderData.channels[i]}));

        // console.log(selection, "--- selection");

        let img_box = this.base.selectAll(".img_box")
            .data(selection);
        img_box.exit().remove();

        const img_boxEnter = img_box.enter()
            .append('div').attr('class', 'img_box');

        img_box = img_boxEnter.merge(img_box)
            .html(d => `<img src="${d.img.d}">`);

        if (renderData.ablation) {
            this.renderImageAblation(renderData);

        }


        img_box.on('mouseenter', d => this.eventHandler
            .trigger(AblationView.events.image_hovered, {
                image: d.img.d,
                hovered: true
            }))

        img_box.on('mouseleave', d => this.eventHandler
            .trigger(AblationView.events.image_hovered, {
                image: d.img.d,
                hovered: false
            }))


    }


    private actionChangeAblationValue(i, v) {
        console.log(i, v, "--- i,v");
        if (v === undefined) {
            delete this._current.ablation_changes[i];
        } else {
            this._current.ablation_changes[i] = v;

        }

        URLHandler.updateURLParam('abl_chg', obj_to_arr(this._current.ablation_changes), true)
        this.renderImageAblation();

    }

    private renderImageAblation(renderData = this.renderData) {
        const that = this;
        const cur = this._current;
        const yScale = cur.ablation_scale.copy().range([65, 5]);
        const zero = yScale(0);
        const pos1 = yScale(1);
        const neg1 = yScale(-1);

        const img_box: d3.Selection<d3.BaseType, { i: number; s: number; img: { d: string; id: number } }, any, any>
            = this.base.selectAll(".img_box");


        img_box.html((d, i) => {
            //TODO: fix this (include order)

            // const av = renderData.ablation[i];
            return `<img src="${d.img.d}"><div>
                <svg width="40" height="70">
                <rect class="bar" x="3" width="10" height="40"></rect>
                <rect class="pos_marker pos1" x="15" y="${pos1 - 5}" width="20" height="10"></rect>
                <rect class="pos_marker reset" x="15" y="${(pos1 + zero) / 2 - 5}" width="20" height="10"></rect> 
                <rect class="pos_marker zero" x="15" y="${zero - 5}" width="20" height="10"></rect>
                <text class="pos_marker_text" x="25" y="${pos1}"> 1 </text>
                <text class="pos_marker_text" x="25" y="${zero}"> 0 </text>
                <text class="pos_marker_text" x="25" y="${(pos1 + zero) / 2}"> orig </text>
                </svg></div>`
        });

        img_box.selectAll('.bar')
            .data((d, i) => {
                const ab_chg = cur.ablation_changes[d.i];
                if (ab_chg !== undefined) {
                    return [ab_chg];
                } else {
                    return [renderData.ablation[d.i]]
                }

            })
            .attrs({
                class: d => (d >= 0) ? "bar pos" : 'bar neg',
                // x: 3,
                y: (d) => (d >= 0) ? yScale(d) : zero,
                height: (d) => (d >= 0) ? zero - yScale(d) : yScale(d) - zero,
                // width: 10
            });

        img_box.selectAll('.pos_marker').data(d => [d, d, d])
            .classed('selected', function (d: { i, s, img }) {
                const me = d3.select(this);
                const v = cur.ablation_changes[d.i];
                return (me.classed('reset') && v === undefined)
                    || (me.classed('pos1') && v === 1)
                    || (me.classed('zero') && v === 0);

            })
            .on('click', function (d) {
                const me = d3.select(this);
                let new_value: number | null = undefined;
                // if (me.classed('reset')) newValue = null;
                if (me.classed('zero')) new_value = 0;
                if (me.classed('pos1')) new_value = 1;

                that.eventHandler.trigger(AblationView.events.ablation_changed,
                    {i: d.i, new_value}
                )

            })


    }


    protected _wrangle(data: AblationData) {

        if (!data.ablation) {
            const rnd = d3.randomNormal();
            data.ablation = d3.range(data.channels.length).map(() => rnd())
            //data.channels.length

        }

        if (data.ablation) {


            const ab_min_max = d3.extent(data.ablation);
            if (ab_min_max[0] > 0) ab_min_max[0] = 0;
            if (ab_min_max[1] < 1) ab_min_max[1] = 1;
            this._current.ablation_scale.domain(ab_min_max);

            this._current.sort.s_to_i = argsort(data.ablation, (a, b) => b - a)
            this._current.sort.i_to_s = d3.range(this._current.sort.s_to_i.length);
            this._current.sort.s_to_i.forEach((i, s) => this._current.sort.i_to_s[i] = s)

        }

        return data;
    }

    //
    // public set z(_z) {
    //     this.data.z = _z;
    //     this.renderData = this._wrangle(this.data);
    //     this._render();
    // }
    //
    // public get z() {
    //     return this.data.z;
    // }

    public set ablation(_a) {
        this.data.ablation = _a;
        this.renderData = this._wrangle(this.data);
        this._render();
    }

    public get ablation_modified() {
        const ab_c = this._current.ablation_changes;
        return this.data.ablation.map((d, i) => (i in ab_c) ? ab_c[i] : d);
    }


    reset_all() {
        this._current.ablation_changes = {};
        URLHandler.updateURLParam('abl_chg', obj_to_arr(this._current.ablation_changes), true)
        this.renderImageAblation();
    }
}