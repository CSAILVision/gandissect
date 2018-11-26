import {VComponent} from "./VisComponent";
import {D3Sel} from "../etc/Util";
import {SimpleEventHandler} from "../etc/SimpleEventHandler";
import {PaintSelectWidget} from "paint_select";
import {GanterAPI, ImageMask} from "../api/GanterAPI";


export type PaintSelectViewData = {
    image: HTMLImageElement,
    imageID?: string,
    resetSelection?: boolean
}

export class PaintSelectView extends VComponent<PaintSelectViewData> {
    protected options: { [key: string]: any; pos: { x: number; y: number; }; };
    protected css_name = "PaintSelectView";
    protected _current: {};
    private psw: PaintSelectWidget;


    public static events = {
        maskChanged: "PaintSelectView_mc"
    }

    constructor(_parent: D3Sel, _eventHandler: SimpleEventHandler) {
        super(_parent, _eventHandler);
        this.superInitHTML();
        // TODO:hack
        // this.base.attr('class', '');
        this._init();
    }

    protected _init() {
        this.psw = new PaintSelectWidget(this.base.node(), {
            overlayModified: (me, mask) => {
                this.fireMaskEvent(mask);
            }
        }, null, 1);
        this.psw.radius = 20;
        this.psw.drawColor = '#f06069';
        this.psw.alpha = .3;
    }

    private fireMaskEvent(mask) {
        const imgMask: ImageMask = {
            id: this.renderData.imageID || -1,
            mask
        };

        this.eventHandler.trigger(PaintSelectView.events.maskChanged,
            imgMask
        )
    }

    protected _wrangle(data: PaintSelectViewData) {

        return data;
    }

    protected _render(rD: PaintSelectViewData = this.renderData): void {
        this.psw.backgroundImage = rD.image;
        this.psw.redraw();
    }


    // private selectionModified(me, mask) {
    //
    //     console.log(this, "--- this");
    //     const imgMask: ImageMask = {
    //         id: this.renderData.backgroundImageID || -1,
    //         mask
    //     }
    //
    //     this.eventHandler.trigger(PaintSelectView.events.maskChanged,
    //         imgMask
    //     )
    //
    //
    //     // console.log(me, image,"--- me, image");
    // }

    private resetSelection() {
        this.psw.reset()
    }

    get image() {
        return this.psw.backgroundImage;
    }

    get imageID() {
        return this.renderData.imageID;
    }


    set zoom(z) {
        this.psw.zoom = z;
    }

    set opacity(o: number) {
        this.psw.alpha = o;
    }


    reset(supressEvent = false) {
        this.psw.reset();
        if (!supressEvent) {
            this.fireMaskEvent(this.psw.currentMask)
        }
    }
}