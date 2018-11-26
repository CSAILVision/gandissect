import * as d3 from "d3"

/**
 * Created by hen on 5/15/17.
 */
export class SVG {
    static translate({x, y}) {
        return "translate(" + x + "," + y + ")"
    }

    static group(parent, classes, pos = {x: 0, y: 0}) {
        return parent.append('g').attrs({
            class: classes,
            "transform": SVG.translate(pos)
        })
    }

}

export class SVGMeasurements {

    private measureElement: d3.Selection<any, any, any, any>;

    constructor(baseElement, classes = '') {
        this.measureElement = baseElement.append('text')
            .attrs({x: 0, y: -20, class: classes})

    }

    textLength(text, style = null) {
        this.measureElement.attr('style', style);
        this.measureElement.text(text);
        const tl = (<SVGTextElement> this.measureElement.node()).getComputedTextLength();
        this.measureElement.text('');

        return tl;
    }
}