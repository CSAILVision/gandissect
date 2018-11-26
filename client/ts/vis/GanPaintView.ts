import {VComponent} from "./VisComponent";
import {D3Sel} from "../etc/Util";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {AblationUpload, GanterAPI, ImageMask} from "../api/GanterAPI";
import {isEqual} from "lodash"
import * as d3 from "d3"


export type GanPaintViewData = {
    image: HTMLImageElement,
    imageID?: string,
    resetSelection?: boolean,
    alpha?: number
}

export type GanPaintMeta = {
    payload: AblationUpload[],
    name: string,
    remove: boolean
}

export class GanPaintView extends VComponent<GanPaintViewData> {
    protected options = {
        pos: {x: 0, y: 0},
        width: 256,
        height: 256,
        grid_size: 32,
        radius: 1,
        draw_color: "#0bc6d4",
        remove_color: "#e1484a",
        active_alpha: .7

    };
    protected css_name = "GanPaintView";
    protected _current = {
        meta: <GanPaintMeta>null,
        canvas: <HTMLCanvasElement>null,
        new_meta: <GanPaintMeta>{},
        highlight: <HTMLCanvasElement>null,
        empty: true,
        alpha: 1
    };

    // stack of all masks
    protected _maskStack: {
        meta: GanPaintMeta,
        canvas: HTMLCanvasElement
    }[] = [];


    public static events = {
        maskChanged: "GanPaintView_mc"
    }
    private _canvas: D3Sel;
    private static currentActiveWidget: GanPaintView = null;

    constructor(_parent: D3Sel, _eventHandler: SimpleEventHandler) {
        super(_parent, _eventHandler);
        this.superInitHTML();
        // TODO:hack
        // this.base.attr('class', '');
        this._init();
    }


    protected _currentMouseGrid() {
        const [x, y] = d3.mouse(this._canvas.node());
        return [
            Math.floor(x / this.options.width * this.options.grid_size),
            Math.floor(y / this.options.height * this.options.grid_size)
        ]

    }

    _createNewCanvas() {
        const res = document.createElement('canvas');
        res.width = this.options.grid_size;
        res.height = this.options.grid_size;
        return res;
    }

    protected _init() {
        const op = this.options;
        const cur = this._current;
        this._canvas = this.base.append('canvas')
            .property('width', op.width)
            .property('height', op.height);

        const ctx = (<HTMLCanvasElement>this._canvas.node()).getContext('2d');
        ctx.beginPath();
        ctx.fillText('< please select image from top >', 10, 10);
        ctx.closePath();


        const drawCircle = (drawCtx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
            drawCtx.beginPath();
            const [gx, gy] = this._currentMouseGrid();

            drawCtx.ellipse(gx, gy,
                r, r,
                0, 0, 2 * Math.PI);
            drawCtx.fill();
            drawCtx.closePath();
        }

        const dragstarted = () => {
            cur.empty = false;
            cur.meta = cur.new_meta;
            cur.canvas = this._createNewCanvas();

            cur.alpha = op.active_alpha;

            const drawCtx = cur.canvas.getContext('2d');
            drawCtx.fillStyle = cur.meta.remove ? op.remove_color : op.draw_color;

            const x0 = d3.event.x,
                y0 = d3.event.y;

            drawCircle(drawCtx, x0, y0, op.radius);

            d3.event.on('drag', () => {
                const x = d3.event.x,
                    y = d3.event.y;
                drawCircle(drawCtx, x, y, op.radius);
                this._render();
            });


            this._render();

        };

        const dragend = () => {
            this._paintFinished();
        };

        this._canvas.call(
            d3.drag()
                .container(() => this._canvas.node())
                .on('start', dragstarted)
                .on('end', dragend)
        );

        // this._canvas.on('mousedown', () => {
        //
        //     console.log(onmousedown, "--- onmousedown");
        //     cur.empty = false;
        //
        //     // NOT EQUAL ?
        //     // if (!isEqual(cur.meta, cur.new_meta)) {
        //
        //     // if not just started
        //     // if (cur.meta !== null) {
        //     //     // push current to stack and create new one
        //     //     this._maskStack.push({
        //     //         meta: cur.meta,
        //     //         canvas: cur.canvas
        //     //     })
        //     // }
        //
        //     cur.meta = cur.new_meta;
        //     cur.canvas = this._createNewCanvas();
        //
        //     // }
        //
        //
        //     this.options.alpha = .7;
        //
        //     const drawCtx = cur.canvas.getContext('2d');
        //     this._canvas.on("mousemove", (e) => {
        //         drawCtx.beginPath();
        //         drawCtx.fillStyle = op.draw_color;
        //         const [gx, gy] = this._currentMouseGrid();
        //
        //         drawCtx.ellipse(gx, gy,
        //             op.radius, op.radius,
        //             0, 0, 2 * Math.PI);
        //         drawCtx.fill();
        //         drawCtx.closePath();
        //         this._render();
        //     });
        //     GanPaintView.currentActiveWidget = this;
        //
        //
        // });
        //
        //
        // // TODO: not super elegant to overwrite window listener..
        // window.onmouseup = (e) => {
        //     if (GanPaintView.currentActiveWidget == null) return;
        //
        //     const that = GanPaintView.currentActiveWidget;
        //     const callOverlay = (that._canvas.on('mousemove') !== null);
        //
        //     that._canvas.on('mousemove', null);
        //     GanPaintView.currentActiveWidget = null;
        //
        //     if (callOverlay) {
        //         console.log("callOverlay--- ");
        //         that._paintFinished();
        //     }
        //
        // }


    }

    highlightCanvas(id: number, highlight = true) {
        if (highlight) {
            if (id < this._maskStack.length) {
                this._current.highlight = this._maskStack[id].canvas;
            } else if (id == this._maskStack.length) {
                // if the last canvas
                this._current.highlight = this._current.canvas;
            }
        } else {
            this._current.highlight = null;
        }

        this._render();
    }

    removeCanvas(id: number, fireEvent = true) {
        if (id < this._maskStack.length) {
            this._maskStack.splice(id, 1);
        } else if (id == this._maskStack.length) {
            // if the last canvas
            this._current.canvas = this._createNewCanvas();
            this._current.empty = true;
        }
        this._current.highlight = null;
        this._render();

        if (fireEvent)
            this.eventHandler.trigger(
                GanPaintView.events.maskChanged,
                {caller: this});

    }

    removeLast(fireEvent = true) {
        if (this.maskStack.length > 0)
            this.removeCanvas(this.maskStack.length - 1, fireEvent)
    }

    resetMasks(fireEvent = true) {
        this._maskStack = [];
        this._current.highlight = null;
        this._render();

        if (fireEvent)
            this.eventHandler.trigger(
                GanPaintView.events.maskChanged,
                {caller: this});

    }


    private _paintFinished() {
        const cur = this._current;

        if (cur.meta !== null) {
            // push current to stack and create new one
            this._maskStack.push({
                meta: cur.meta,
                canvas: cur.canvas
            })
        }

        this.eventHandler.trigger(
            GanPaintView.events.maskChanged,
            {caller: this});

    }

    private fireMaskEvent(mask) {
        const imgMask: ImageMask = {
            id: this.renderData.imageID || -1,
            mask
        };

        this.eventHandler.trigger(GanPaintView.events.maskChanged, this)
    }

    protected _wrangle(data: GanPaintViewData) {
        if (data.resetSelection) {
            this._maskStack = [];
            this._current.canvas = this._createNewCanvas();
        }
        if (data.alpha !== null) {
            this._current.alpha = data.alpha;
        }
        return data;
    }

    protected _render(rD: GanPaintViewData = this.renderData): void {


        if (rD == null) return;
        const op = this.options;
        const cur = this._current;

        this._canvas
            .property('width', op.width)
            .property('height', op.height);

        const ctx = this._canvas.node().getContext('2d');

        // render BG
        ctx.beginPath();
        ctx.drawImage(rD.image, 0, 0);
        ctx.closePath();

        if (this._current.highlight) {
            ctx.beginPath();
            ctx.globalAlpha = op.active_alpha;
            ctx.drawImage(this._current.highlight, 0, 0, op.width, op.height);
            ctx.closePath();

        } else if (this._current.canvas) {
            ctx.beginPath();
            ctx.globalAlpha = cur.alpha;
            ctx.drawImage(this._current.canvas, 0, 0, op.width, op.height);
            ctx.closePath();
        }

    }


    private resetSelection() {
        // this.psw.reset()
    }


    setNewMeta(d: GanPaintMeta) {
        this._current.new_meta = d;
    }

    changeCurrentMeta(data: GanPaintMeta) {
        this._current.meta = data;
        this._current.new_meta = data;
    }

    get currentMeta() {
        return this._current.meta
    };

    get newMeta() {
        return this._current.new_meta
    };


    get maskStack() {
        return this._maskStack;
    }

    /** get all stacked layers including current one */
    get currentStack() {
        return this.maskStack
        // return [...this._maskStack, {
        //     meta: this._current.meta,
        //     canvas: this._current.canvas
        // }];
    }

    // get image() {
    //     return this.psw.backgroundImage;
    // }
    //
    get imageID() {
        return this.renderData.imageID;
    }

    get canvas() {
        return this._canvas;
    }

    //
    //
    // set zoom(z) {
    //     this.psw.zoom = z;
    // }
    //
    // set opacity(o: number) {
    //     this.psw.alpha = o;
    // }
    //
    //
    // reset(supressEvent = false) {
    //     this.psw.reset();
    //     if (!supressEvent) {
    //         this.fireMaskEvent(this.psw.currentMask)
    //     }
    // }
}