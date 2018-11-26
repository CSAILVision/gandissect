import * as d3 from 'd3'
import {brush} from 'd3'
import "d3-selection-multi";

import '../css/ganclient.scss'
// import '../node_modules/font-awesome/css/font-awesome.min.css'
import "!file-loader?name=index.html!../index.html";
import {SimpleEventHandler} from "./etc/SimpleEventHandler";
import {
    AblationUpload,
    API_Project,
    GanterAPI, ImageMask,
    Ranking,
    Recipe
} from "./api/GanterAPI";
import {argsort} from "./etc/Util";
import {PaintSelectView} from "./vis/PaintSelectView";
import URLHandler from "./etc/URLHandler";


type ProjectMap = {
    [key: string]: API_Project
};

type RecipeMap = {
    [key: string]: Ranking
}

const events = {
    picking: 'picking',
    dropping: 'dropping'

};

const current = {
    sidebar: {
        width: 400,
        visible: true
    },
    image: {
        size: 300
    },
    projects: <ProjectMap>{},
    recipes: {
        ablation: <RecipeMap>{},
        copy: <RecipeMap>{},
        copy_values: <number[]> []
    },
    unit_sorting: {
        // ablation: <number[]>null,
        copy: <{ [key: string]: number[] }>null
    },
    pick: {
        selection: [[0, 0], [0, 0]],
        id: -1,
        ablated: false
    }

};

class Helper {

    static update_selector(selector, entries) {
        let rec_op = selector.selectAll('option').data(entries);
        rec_op.exit().remove();
        rec_op.enter().append('option')
            .merge(rec_op)
            .attr('value', d => d)
            .text(d => d);
    };


    static selector_on_change_or_enter(selector, f) {
        selector.on('change', () => {
            f();
        });

        selector.on('keypress', () => {
            if (d3.event.keyCode == 13) {
                f();
            }
        });
    };
}


window.onload = () => {
    const side_bar = d3.select(".side_bar");
    side_bar.style('width', `${current.sidebar.width}px`);

    const eventHandler = new SimpleEventHandler(<Element>d3.select('body').node());

    const api_prefix = URLHandler.parameters['api'] || '';
    const api = new GanterAPI(api_prefix);

    /*
    *
    * ==== Variables and Accesors
    *
    * */


    /*
    *
    * Project and Layer Selection
    *
    * */

    const ds_selector = d3.select('#project_selector');
    const layer_selector = d3.select('#layer_selector');
    const recipe_ablation_selector = d3.select('#recipe_select_ablation');
    const recipe_copy_selector = d3.select('#recipe_select_copy');

    const sel_project = () => current.projects[ds_selector.property('value')];
    const sel_layer = () => <string>layer_selector.property('value');
    const sel_watch = () => d3.select('.watch.selected')
        .attr('id').split('_')[1];


    const ablation_values = (recipe) => current.recipes.ablation[recipe].scores;



    function setup_project_layer() {


        const updateProjectSelector = () => {
            // const ds = ds_selector.property('value');
            const project = sel_project();
            // d3.select('#raw_code')
            //     .text(JSON.stringify(current.projects[ds], null, 2))
            const layers = layer_selector.selectAll('option')
                .data(project.info.layers);
            layers.exit().remove();
            layers.enter().append('option')
                .merge(layers)
                .attr('value', d => d)
                .attr('selected', d => d.match(/4$/g) ? true : null) // for demo
                .text(d => d)


            updateRecipeList();
        };


        function updateRecipeList() {
            current.recipes.ablation = {};

            api.rankings(sel_project().project, sel_layer())
                .then(ranks => {
                    console.log(ranks, "--- recipes");

                    const names = ranks.res.map(d => d.name);
                    Helper.update_selector(recipe_ablation_selector, names);
                    Helper.update_selector(recipe_copy_selector, names);

                    current.recipes.ablation = {};
                    current.recipes.copy = {};
                    ranks.res.forEach(rank => {
                        current.recipes.ablation[rank.name] = rank;
                        current.recipes.copy[rank.name] = rank;
                    });

                    update_units();
                })

            api.levels(sel_project().project, sel_layer())
                .then(level_req => {
                    current.recipes.copy_values = level_req.res
                        .map(levels => levels[0]);
                })
        }




        api.allProjects().then((projects) => {

            projects.forEach(p => current.projects[p.project] = p);
            let options = ds_selector
                .selectAll('option').data(projects.map(p => p.project));
            options.exit().remove();
            options.enter().append('option')
                .merge(options).attr('value', d => d).text(d => d);

            updateProjectSelector();

        });

        ds_selector.on('change', d => {
            updateProjectSelector();
        });
    }

    setup_project_layer();


    /*
    *
    * ===== RECIPES and UNITS ======
    *
    * */

    function update_units_ablation() {
        const r_string: string = recipe_ablation_selector.property('value');
        const label_prefix = r_string.split('-')[0];
        update_unit_images(
            ablation_values(r_string),
            label_prefix
        );
    }

    function update_units_copy() {
        const r_string: string = recipe_copy_selector.property('value');
        const label_prefix = r_string.split('-')[0];
        update_unit_images(
            ablation_values(r_string),
            label_prefix
        );
    }

    recipe_ablation_selector.on('change', () => {
        console.log(sel_watch(), "--- sel_watch()");
        // if ('ablation' === sel_watch()) update_units_ablation();
        update_units();
        updateImages();
    });

    recipe_copy_selector.on('change', () => {
        // if ('copy' === sel_watch()) update_units_copy();
        update_units();
        updateImages();
    });

    d3.selectAll('.watch').on('click', function () {
        const me = this;
        d3.selectAll('.watch')
            .classed('selected', function () {
                return this == me
            });

        if (sel_watch() === 'ablation') {
            update_units_ablation();
        } else {
            update_units_copy();
        }

    });


    function update_units() {
        if (sel_watch() === 'ablation') {
            update_units_ablation();
        } else {
            update_units_copy();
        }
    }


    function update_unit_images(values: number[] = null,
                                label_prefix = '', sort_fct = (a, b) => a - b) {

        const ablate_ids = _current_ablation_ids();
        const copy_ids = _current_copy_ids();


        api.units(sel_project().project, sel_layer())
            .then(unitres => {
                const units = unitres.res;

                let indices = [];
                if (values) {
                    indices = argsort(values, sort_fct);
                } else {
                    indices = d3.range(units.length);
                }

                let uni = d3.select('#units')
                    .selectAll('.unit')
                    .data(indices)//, (d, i) => i + 'c' + d);

                uni.exit().remove();
                const uniEnter = uni.enter().append('div')
                    .attr('class', 'unit');

                uniEnter.append('img').classed('unitImg', true);
                uniEnter.append('div').classed('label', true);
                // uniEnter.append('div').classed('ablation', true);


                uni = uniEnter.merge(uni);
                uni.select('img')
                    .attr('src', d => units[d].img)
                    .classed('ablate', d => ablate_ids.includes(d))
                    .classed('copy', d => copy_ids.includes(d));
                uni.select('.label').text((d, i) => `${label_prefix} #${i}`)
                // uni.select('.ablation')
                //     .style('width', d =>
                //         values.length > d ? `${(values[d]) / values[indices[0]] * 59 + 1}px` : '1px'
                //     )

            })
    }

    const rm_unit = d3.select('#rm_unit');
    const cp_unit = d3.select('#cp_unit');

    const no_rm_units = () => +rm_unit.property('value');
    const no_cp_units = () => +cp_unit.property('value');

    rm_unit.on('change', () => {
        updateImages();
        update_units();
    });


    /*
    *
    * === IMAGES ===
    *
    * */

    const image_select = d3.select('#image_select');
    const sel_images = () => {
        const img_str: string = image_select.property('value');
        const parts = img_str.trim().split(',');
        let res = [];
        parts.forEach(part_x => {
            const part = part_x.trim();
            if (!!part.match(/^[0-9]+$/g)) {
                res = [...res, +part];
            } else if (!!part.match(/^[0-9]+-[0-9]+$/g)) {
                const subparts = part.split('-');
                res = [...res, ...d3.range(+subparts[0], +subparts[1] + 1)]
            }
        });

        return res;
    };

    Helper.selector_on_change_or_enter(image_select, updateImages);


    const image_list = d3.select('#image_list');
    type SubImageType = { d: string, id: number, ablated: boolean }

    const subImageToID = d => `id_${d.id}${d.ablated ? '-ablated' : ''}`;
    const sel_zoom = (): number => +d3.select('#input_zoom').property('value')

    d3.select('#input_zoom').on('change', () => {
        d3.selectAll('.gan_sub_image').each(function (d) {
            const me = d3.select(this);
            const psv = <PaintSelectView>me.property('psv');
            psv.zoom = sel_zoom();
        })
    });

    const sel_opacity = () => d3.select('#input_opacity').property('value');

    d3.select('#input_opacity').on('change',()=>{
        d3.selectAll('.gan_sub_image').each(function (d) {
            const me = d3.select(this);
            const psv = <PaintSelectView>me.property('psv');
            psv.opacity = sel_opacity();
        })


    })




    function _updateImages(imgs: SubImageType[][]) {

        const zoom_level = sel_zoom();
        const opacity = sel_opacity();

        let gan_image = image_list.selectAll('.gan_image')
            .data(imgs);
        gan_image.exit().remove();
        gan_image = gan_image.enter().append('div')
            .attr('class', 'gan_image')
            .merge(gan_image);

        let gan_sub = gan_image.selectAll('.gan_sub_image')
            .data(d => d);
        gan_sub.exit().remove();
        const gan_sub_enter = gan_sub.enter().append('div')
            .attr('class', d => 'gan_sub_image ' + subImageToID(d))
            .html('<img/><br/>');

        gan_sub_enter.each(function (d) {
            console.log(d, this, "---enter d");
            const me = d3.select(this);
            const psv = new PaintSelectView(d3.select(this), eventHandler);
            psv.zoom = zoom_level;
            psv.opacity = opacity;
            me.property('psv', psv);

        });

        gan_sub_enter.append('button')
            .on('click', function () {
                const p = d3.select((<any>this).parentNode);
                const psv = <PaintSelectView>p.property('psv');
                psv.reset();

            });
        gan_sub_enter.append('span');

        // TODO: v1
        // const svgs = gan_sub_enter.append('svg');
        // decorateSVG(svgs);

        gan_sub = gan_sub_enter.merge(gan_sub);


        gan_sub.each(function (d) {
            const me = d3.select(this);
            const psv = <PaintSelectView>me.property('psv');

            const img = new Image();
            img.onload = () => {
                psv.update({
                    image: img,
                    imageID: subImageToID(d)
                })
            };
            img.src = d.d.startsWith('/') ? api_prefix + d.d : d.d;

        });

        // todo: v1
        // gan_sub.select('img')
        //     .attr('class', subImageToID)
        //     .attr('src', d => d.d)
        //     .attr('width', current.image.size);
        gan_sub.select('span').text(d => d.ablated ? d.id + '-ablated' : d.id);

    }

    function decorateSVG(svg) {
        console.log(svg, "--- svg");
        const im_s = current.image.size;
        svg.attr('width', im_s)
            .attr('height', im_s);


        const bg = svg.append('g').attr('class', 'bg');
        bg.append('rect').attr('class', 'pointer');
        const activeLayer = svg.append('rect')
            .attr('class', 'single_pick')
            .attr('width', im_s)
            .attr('height', im_s);

        activeLayer.on('mousemove', function () {
            const pointer = d3.select(this.parentNode).select('.pointer');
            if (pointer.classed('selected')) return;


            const coo = d3.mouse(this);
            let tl_grid = coo.map(coord_im2grid).map(Math.floor);
            const br_grid = tl_grid.map(d => d + 1)


            const br = br_grid.map(coord_grid2im);
            const tl = tl_grid.map(coord_grid2im);

            pointer.attrs({
                x: tl[0],
                y: tl[1],
                width: br[0] - tl[0],
                height: br[1] - tl[1]
            })

            pointer.property('_selection_', [tl_grid, br_grid]);

        });

        activeLayer.on('click', function (d: SubImageType) {
            const pointer = d3.select(this.parentNode).select('.pointer');
            const newValue = !pointer.classed('selected');
            pointer.classed('selected', newValue);

            if (newValue) {
                const edata: DropEventData = {
                    image: d,
                    selection: pointer.property('_selection_')
                };

                eventHandler.trigger(events.dropping, edata);
            } else {
                const edata: DropEventData = {
                    image: d,
                    selection: null
                };

                eventHandler.trigger(events.dropping, edata);

            }

        });


        activeLayer.on('mouseleave', function () {
            const pointer = d3.select(this.parentNode).select('.pointer');
            if (!pointer.classed('selected')) {
                pointer.attrs({x: -10, y: -10, width: 0, height: 0})
            }
        })


    }

    const coord_im2grid = x => x * 8. / current.image.size;
    const coord_grid2im = x => Math.round(x * current.image.size / 8.);


    function selectPicker(id: number, ablated: boolean) {

        const sub_images = image_list.selectAll('.gan_sub_image');

        const add_them = sub_images.filter((d: SubImageType) => {
            return (d.id === id) && (d.ablated === ablated)
        })

        sub_images.select('button').classed('selected', false);
        sub_images.select('svg .brush').remove();

        add_them.select('button').classed('selected', true);
        const im_s = current.image.size;
        // const d_unit = x => x * 8. / im_s;
        // const d_unit_inv = x => Math.round(x * im_s / 8.);

        function burshend() {
            if (!d3.event.sourceEvent) return; // Only transition after input.
            if (!d3.event.selection) return; // Ignore empty selections.
            console.log(d3.event.selection, "--- d3.event.selection");
            const p0 = d3.event.selection[0].map(coord_im2grid);
            const p1 = d3.event.selection[1].map(coord_im2grid);

            let p00 = p0.map(Math.round);
            let p11 = p1.map(Math.round);

            if (p00[0] >= p11[0]) {
                p00[0] = Math.floor(p0[0]);
                p11[0] = Math.floor(p0[0]) + 1;
            }
            if (p00[1] >= p11[1]) {
                p00[1] = Math.floor(p0[1]);
                p11[1] = Math.floor(p0[1]) + 1;
            }

            current.pick.selection = [p00, p11];
            eventHandler.trigger(events.picking, null);


            const pl = [p00.map(coord_grid2im), p11.map(coord_grid2im)];
            d3.select(this).transition().call(brush.move, pl)

        }

        const brush: any = d3.brush()
            .extent([[0, 0], [im_s, im_s]])
            .on('end', burshend);


        add_them.select('svg').append("g")
            .attr("class", "brush")
            .call(brush)
            .selectAll('.selection')
            .style('fill-opacity', 0.2)
            .style('stroke', 'red')
            .style('stroke-width', '2px')


        // .on("start brush", brushed)
        // .on("end", brushended);


    }


    function _current_ablation_ids() {
        const n_rm = no_rm_units();
        // ablation_sort_values(recipe_ablation_selector.property('value'));

        let us = argsort(
            ablation_values(
                recipe_ablation_selector.property('value')),
            (a, b) => a - b);
        if (!us) us = d3.range(n_rm + 1);
        return us
            .slice(0, Math.min(n_rm, us.length))
    }

    function _current_ablation_payload(): AblationUpload[] {
        const layer = sel_layer();
        return _current_ablation_ids()
            .map(unit => ({
                layer,
                unit,
                alpha: 1
            }));
    }

    function _current_copy_ids() {
        const n_cp = no_cp_units();

        const sort_dim = recipe_copy_selector.property('value');
        let us = argsort(ablation_values(sort_dim), (a, b) => a - b);

        return us
            .slice(0, Math.min(n_cp, us.length))

    }

    function _current_copy_payload(): AblationUpload[] {

        const copy_values = current.recipes.copy_values;
        const layer = sel_layer();

        return _current_copy_ids()
            .map(unit => ({
                layer,
                unit,
                alpha: 1,
                value: +copy_values[unit]
            }));
    }


    function _current_copy_payload_old(): AblationUpload[] {
        const n_cp = no_cp_units();

        const sort_dim = recipe_copy_selector.property('value');
        const us = argsort(current.unit_sorting.copy[sort_dim], (a, b) => b - a);
        // const copy_values = current.unit_sorting.copy[sort_dim.split('_')[0]];
        const copy_values = current.unit_sorting.copy['max'];

        console.log(copy_values, "--- copy_values");

        const layer = sel_layer();
        return us
            .slice(0, Math.min(n_cp, us.length))
            .map(unit => ({
                layer,
                unit,
                alpha: 1,
                value: +copy_values[unit]
            }));
    }


    function updateImages(images = sel_images()) {
        api.generateImgs(
            sel_project().project, images,
            0, [])
            .then(gImgs => {

                const n_rm = no_rm_units();
                console.log(n_rm, "--- n");
                if (n_rm > 0) {
                    const payload = _current_ablation_payload();
                    api
                        .generateImgs(sel_project().project, images, 0, payload)
                        .then(abl_res => {
                            _updateImages(gImgs.res
                                .map((d, i) => {
                                    const abl = abl_res.res[i];
                                    return [{
                                        d: d.d,
                                        id: d.id,
                                        ablated: false
                                    }, {
                                        d: abl.d,
                                        id: d.id,
                                        ablated: true
                                    }]
                                }))
                        })
                } else {
                    _updateImages(gImgs.res.map(d => [{
                        d: d.d,
                        id: d.id,
                        ablated: false
                    }]))
                }

            })

    }


    /*
     *
     *  ===== EVENTS ====
     *
     */


    eventHandler.bind(events.picking, () => {

        const pick = current.pick;
        const bb = pick.selection; // IN CG ORDER --> convert to Matrix order

        const ablations = pick.ablated ? _current_ablation_payload() : [];

        api.generateFeaturesLocal(
            sel_project().project,
            [pick.id],
            [sel_layer()],
            [{
                shape: [8, 8],
                bitbounds: [bb[0][1], bb[0][0], bb[1][1], bb[1][0]],
                bitstring: null
            }],
            ablations
        ).then(f_resp => {

            const features = f_resp.res[sel_layer()];

            Helper.update_selector(recipe_copy_selector, Object.keys(features));
            current.unit_sorting.copy = features;

            Object.keys(features)
        })


    });


    type DropEventData = {
        image: SubImageType,
        selection: number[][]
    }


    // TODO: broken -- was for V1 --- ID is now attached to DIV and not IMG
    eventHandler.bind(events.dropping, (edata: DropEventData) => {
        console.log(edata, "--- edata");

        const bb = edata.selection;

        console.log(_current_copy_payload(), "--- _current_copy_payload()");

        if (bb) {
            api.generateImgsWithRmCp(
                sel_project().project,
                [edata.image.id],
                0,
                edata.image.ablated ? _current_ablation_payload() : [],
                _current_copy_payload(),
                {
                    bitbounds: [bb[0][1], bb[0][0], bb[1][1], bb[1][0]],
                    bitstring: '1',
                    shape: [8, 8]
                }
            ).then(d => {
                d3.selectAll('.' + subImageToID(edata.image))
                    .attr('src', d.res[0].d);

                console.log(d.res[0].d, subImageToID(edata.image), "--- d");
            })
        } else {
            api.generateImgs(
                sel_project().project,
                [edata.image.id],
                0,
                edata.image.ablated ? _current_ablation_payload() : []
            ).then(d => {
                d3.selectAll('.' + subImageToID(edata.image))
                    .attr('src', d.res[0].d);

            })
        }


    });


    eventHandler.bind(PaintSelectView.events.maskChanged, (im: ImageMask) => {

        const img_data = <SubImageType> d3.select('.' + im.id).datum();


        api.generateImgsWithRmCp(
            sel_project().project,
            [img_data.id],
            0,
            img_data.ablated ? _current_ablation_payload() : [],
            _current_copy_payload(),
            {
                bitbounds: [],
                bitstring: im.mask,
                shape: []
            }
        ).then(d => {
            d3.selectAll('.' + im.id).each(function () {
                const me = d3.select(this);
                const psv = <PaintSelectView>me.property('psv');

                const img = new Image();
                img.onload = () => {
                    psv.update({
                        image: img,
                        imageID: im.id
                    })
                };
                img.src = d.res[0].d;

            });
            // .attr('src', d.res[0].d);

            console.log(d.res[0].d, "--- d");
        })
        // } else {
        //     api.generateImgs(
        //         sel_project().project,
        //         [edata.image.id],
        //         0,
        //         edata.image.ablated ? _current_ablation_payload() : []
        //     ).then(d => {
        //         d3.selectAll('.' + subImageToID(edata.image))
        //             .attr('src', d.res[0].d);
        //
        //     })
        // }


    });


    /*
    *
    *  ===== UI stuff ====
    *
     */

    function setup_ui() {


        d3.select('#sidebar_btn')
            .on('click', function () {
                const sb = current.sidebar;

                sb.visible = !sb.visible;
                d3.select(this)
                    .classed('on', sb.visible);
                side_bar.classed('hidden', !sb.visible);
                side_bar.style('right',
                    sb.visible ? null : `-${current.sidebar.width}px`);

                re_layout();
            });


        window.onresize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            // console.log(w, h, "--- w,h");

            re_layout(w, h);


        };

        function re_layout(w = window.innerWidth, h = window.innerHeight) {
            d3.selectAll('.sidenav')
                .style('height', (h - 53) + 'px')

            const sb = current.sidebar;
            const mainWidth = w - (sb.visible ? sb.width : 0);
            d3.selectAll('.main_frame')
                .style('height', (h - 53) + 'px')
                .style('width', mainWidth + 'px')

            // eventHandler.trigger(GlobalEvents.window_resize, {w, h})

            // eventHandler.trigger(GlobalEvents.main_resize, {
            //     w: (w - global.sidebar()),
            //     h: (h - 45)
            // })

        }

        re_layout(window.innerWidth, window.innerHeight);

    }

    setup_ui();
}




