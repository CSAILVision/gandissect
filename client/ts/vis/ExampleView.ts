import {VComponent} from "./VisComponent";
import {D3Sel} from "../etc/Util";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {API_generate} from "../api/GanterAPI";
import * as d3 from "d3"

export type ExampleViewData = {
    orig: API_generate,
    compare?: API_generate
}

export type ExampleViewMouseEvent = {
    caller: D3Sel,
    images: { d: string, id?: number }[],
    hovered?: boolean
}

export class ExampleView extends VComponent<ExampleViewData> {
    private div_origs: D3Sel;
    renderData: ExampleViewData;

    private _imgWidth = -1;


    constructor(d3parent: D3Sel, eventHandler?: SimpleEventHandler) {
        super(d3parent, eventHandler);
        this.superInitHTML();
        this._init();
    }

    public static events = {
        request_examples: "ExampleView_re",
        hovered_image_pair: "ExampleView_hip",
        clicked_image_pair: "ExampleView_cip",

    }


    protected _current = {};
    protected css_name = "ExampleView";
    protected options = {pos: {x: 0, y: 0}};

    protected _init() {
        this.div_origs = this.base.append('div').attr('class', 'examples');

    }

    protected _render(rData = this.renderData): void {
        if (!rData) return;

        const that = this;
        const renderList = rData.orig.res.map(d => [d]);

        if (rData.compare) {
            rData.compare.res.map((d, i) => renderList[i].push(d));
        }

        let img_pairs = this.div_origs.selectAll('.img_pair').data(renderList);
        img_pairs.exit().remove();
        img_pairs = img_pairs.enter().append('div').attr('class', 'img_pair')
            .merge(img_pairs);

        let imgs = img_pairs.selectAll('img').data(d => d);
        imgs.exit().remove();
        imgs.enter().append('img')
            .merge(imgs)
            .attr('src', d => d.d)
            .attr('width', this._imgWidth > -1 ? this._imgWidth : null);


        img_pairs.on('click', function (d) {
            const eventDetail: ExampleViewMouseEvent = {
                caller: d3.select(this),
                images: d
            };

            that.eventHandler.trigger(
                ExampleView.events.clicked_image_pair,
                eventDetail
            )
        })

        img_pairs.on('mouseenter', function (d) {
            const eventDetail: ExampleViewMouseEvent = {
                caller: d3.select(this),
                images: d,
                hovered: true
            };

            that.eventHandler.trigger(
                ExampleView.events.hovered_image_pair,
                eventDetail
            )
        })
        img_pairs.on('mouseleave', function (d) {
            const eventDetail: ExampleViewMouseEvent = {
                caller: d3.select(this),
                images: d,
                hovered: false
            };

            that.eventHandler.trigger(
                ExampleView.events.hovered_image_pair,
                eventDetail
            )
        })
    }

    protected _wrangle(data: ExampleViewData) {
        return data;
    }


    public set ablated(data: API_generate) {
        this.data.compare = data;
        this.renderData = this._wrangle(this.data);
        this._render();
    }


    public set imgWidth(imgWidth: number) {
        this._imgWidth = imgWidth;
        this._render();
    }

}