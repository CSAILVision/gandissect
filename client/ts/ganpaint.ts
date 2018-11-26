import * as d3 from 'd3'
import "d3-selection-multi";

import '../css/ganpaint.scss'
import "!file-loader?name=ganpaint.html!../ganpaint.html";
import "!file-loader?name=mitibm_heart.png!../demo/mitibm_heart.png";
import "!file-loader?name=overview.png!../demo/overview.png";
import {SimpleEventHandler} from "./etc/SimpleEventHandler";
import {
    AblationUpload, API_generate,
    API_Intervention, API_Levels,
    API_Project, API_Rankings,
    GanterAPI,
    Ranking
} from "./api/GanterAPI";
import {argsort} from "./etc/Util";
import URLHandler from "./etc/URLHandler";
import {GanPaintMeta, GanPaintView} from "./vis/GanPaintView";
import * as _ from 'lodash'


type ProjectMap = {
    [key: string]: API_Project
};

type RecipeMap = {
    [key: string]: Ranking
}

const current = {
    image: {
        size: 256
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
    },

    selected_recipe: <string>null,
    need_init: true

};


// number of units to use for intensities
// do NOT change key names - default setting is high
const paint_intensities = {
    'low': 4,
    'med': 10,
    'high': 15
};

const demo = {
    all_projects: [
        {
            "info": {
                "layers": [
                    "layer4"
                ]
            },
            "project": "churchoutdoor"
        }
    ],
    recipes: ['tree-ace', 'grass-ace', 'door-ace', 'sky-iou', 'cloud-iou', 'brick-iou', 'dome-iou'],
    rankings: <Promise<API_Rankings>>null,
    levels: null,
    image_list: <API_generate> null

}

const isDemo = !URLHandler.parameters['expert'];
if (isDemo) {
    const demo_rankings = require("../demo/rankings_demo_iou_short.json");
    demo.rankings = Promise.resolve(demo_rankings);
    demo.levels = Promise.resolve(require("../demo/levels_demo.json"));
    demo.image_list = require("../demo/imagelist_demo_new.json");
}

//else:
if (URLHandler.parameters['expert']) {
    d3.selectAll('.expert').style('display', null);
    d3.selectAll('.demo').style('display', 'none');
}

window.onload = () => {


    /*
    *
    * variables and static selections
    *
    * */

    const eventHandler = new SimpleEventHandler(<Element>d3.select('body').node());


    const api_prefix = URLHandler.parameters['api'] || '';
    const api = new GanterAPI(api_prefix);

    const painting_sel = d3.select('#painting');
    const ganPaintView = new GanPaintView(painting_sel, eventHandler);

    const dataset_selector = d3.select('#project_selector');
    const layer_selector = d3.select('#layer_selector');
    // const intensity_selector = d3.select('#select_intensity');
    const shortcut_selector = d3.select('#shortcuts');
    const option_intensity_selector = d3.selectAll('.btn_intensity');
    const option_action_selector = d3.selectAll('.btn_action');

    /*
    *
    * Accessors
    *
    * */


    const selected_project = () => current.projects[dataset_selector.property('value')];
    const selected_layer = () => <string>layer_selector.property('value');
    const selected_recipe = () => current.selected_recipe;
    const selelcted_intensity = () => {
        let value = '';
        option_intensity_selector.each(
            function () {
                const me = d3.select(this);
                if (me.classed('selected'))
                    value = me.text().trim();
            });
        return paint_intensities[value];
    };
    const selected_action_is_remove = () => {
        return d3.select('.btn_action.selected').text().trim() === 'remove';
    }


    selected_action_is_remove();

    const ablation_values = (recipe) => current.recipes.ablation[recipe].scores;

    function setup() {

        option_action_selector.on('click', function () {
            const me = this;
            option_action_selector.classed('selected',
                function () {
                    const test = this;
                    return test == me;
                }
            );

            ganPaintView.setNewMeta({
                payload: current_copy_payload(),
                name: selected_recipe(),
                remove: selected_action_is_remove()
            })

        })

        option_intensity_selector.on('click', function () {
            const me = this;
            option_intensity_selector.classed('selected',
                function () {
                    const test = this;
                    return test == me;
                }
            );

            ganPaintView.setNewMeta({
                payload: current_copy_payload(),
                name: selected_recipe(),
                remove: selected_action_is_remove()
            })

        });


        const updateProjectSelector = () => {

            // let project = null;
            if (URLHandler.parameters['project'] && current.need_init) {
                dataset_selector.property('value', URLHandler.parameters['project']);
            }
            // const project = selected_project();

            URLHandler.updateURLParam('project', selected_project().project, false);
            // d3.select('#raw_code')
            //     .text(JSON.stringify(current.projects[ds], null, 2))


            updateLayerSelector();

            current.need_init = false;
            updateRecipeList();
            updateImageList();
        };


        const updateLayerSelector = () => {
            const project = selected_project();


            const layers = layer_selector.selectAll('option')
                .data(project.info.layers);
            layers.exit().remove();
            layers.enter().append('option')
                .merge(layers)
                .attr('value', d => d)
                .text(d => d);

            if (current.need_init) {
                if (URLHandler.parameters['layer']) {
                    layer_selector.property('value', URLHandler.parameters['layer']);
                } else {
                    layers.attr('selected', d => d.match(/4$/g) ? true : null) // for demo
                }
            }

            URLHandler.updateURLParam('layer', selected_layer(), false);


        }


        function updateRecipeList() {
            current.recipes.ablation = {};
            let request = null;
            if (isDemo) {
                request = demo.rankings;
            } else {
                request = api.rankings(selected_project().project, selected_layer())
            }

            request.then((ranks: API_Rankings) => {
                // console.log(ranks, "--- recipes");

                const names = ranks.res.map(d => d.name);

                current.recipes.ablation = {};
                current.recipes.copy = {};
                ranks.res.forEach(rank => {
                    current.recipes.ablation[rank.name] = rank;
                    current.recipes.copy[rank.name] = rank;
                });


                let shortcuts = names;

                if (isDemo) {
                    shortcuts = demo.recipes;
                } else {
                    shortcuts.sort();
                }

                // TODO: dirty :)
                shortcut_selector.selectAll('.short').remove();

                const all_short_enter = shortcut_selector.selectAll('.short').data(shortcuts)
                    .enter()
                    .append('div').attr('class', 'short')

                all_short_enter.append('button')
                    .text(d => isDemo ? d.split('-')[0] : d)
                    .classed('selected', (d, i) => {
                        if (i == 0) {
                            current.selected_recipe = d;
                            return true;
                        } else {
                            return false;
                        }
                    })
                    .on('click', function (d) {
                        shortcut_selector.selectAll('.short button')
                            .classed('selected', dd => dd === d);
                        // console.log(d, "--- d");
                        current.selected_recipe = d;

                        ganPaintView.setNewMeta({
                            payload: current_copy_payload(),
                            name: selected_recipe(),
                            remove: selected_action_is_remove()
                        })

                    })


            })

            let level_req = null;
            if (isDemo) {
                level_req = demo.levels;
            } else {
                level_req = api.levels(selected_project().project, selected_layer())

            }

            level_req.then((level_req: API_Levels) => {
                current.recipes.copy_values = level_req.res
                    .map(levels => levels[0]);
            })
        }


        function updateImageList() {
            const project = selected_project();

            let req = <Promise<API_generate>>null;
            if (isDemo) {
                req = Promise.resolve(demo.image_list);
            } else {

                const imageIDs = URLHandler.parameters['ids'] || [104, 425, 457, 489, 495, 570, 584, 644, 700, 705, 719, 726, 816, 1085, 1146, 1362];
                req = api.generateImgs(project.project, imageIDs);
            }

            req.then((gImgs) => {

                // console.log(gImgs, "--- gImgs");

                let all_imgs = d3.select('.image_list')
                    .selectAll('img').data(gImgs.res);

                all_imgs.exit().remove();
                all_imgs.enter().append('img')
                    .merge(all_imgs)
                    .attr('src', d => d.d)
                    .on('click', d => {
                        updateMainImage(d.id);
                    })

                const r_index = Math.floor(Math.random() * gImgs.res.length);
                updateMainImage(gImgs.res[r_index].id);


            })


        }

        const updateProjectOptions = (projects: string[]) => {
            let options = dataset_selector
                .selectAll('option').data(projects);
            options.exit().remove();
            options.enter().append('option')
                .merge(options).attr('value', d => d).text(d => d);
        };


        if (isDemo) {
            (() => {
                const projects = demo.all_projects;

                projects.forEach(p => current.projects[p.project] = p);

                updateProjectOptions(projects.map(p => p.project));

                updateProjectSelector();

            })()


        } else {

            api.allProjects().then((projects) => {

                projects.forEach(p => current.projects[p.project] = p);

                updateProjectOptions(projects.map(p => p.project));

                updateProjectSelector();

            });

        }


        dataset_selector.on('change', d => {
            updateProjectSelector();
        });


    }

    setup();


    function no_cp_units() {
        return selelcted_intensity();
    }

    function current_copy_ids() {
        const n_cp = no_cp_units();

        const sort_dim = selected_recipe();
        let us = argsort(ablation_values(sort_dim), (a, b) => a - b);

        return us
            .slice(0, Math.min(n_cp, us.length))

    }

    function current_copy_payload(): AblationUpload[] {

        const copy_values = current.recipes.copy_values;
        const layer = selected_layer();
        const del = selected_action_is_remove();

        return current_copy_ids()
            .map(unit => ({
                layer,
                unit,
                alpha: 1,
                value: del ? 0 : +copy_values[unit]
            }));
    }


    function updateMainImage(image: number) {
        let req = <Promise<API_generate>>null;

        if (isDemo) {
            const newObject = {
                request: demo.image_list.request,
                res: [
                    demo.image_list.res.filter(dd => dd.id == image)[0]
                ]
            }

            req = Promise.resolve(newObject);

        } else {
            req = api.generateImgs(selected_project().project, [image],
                0, [])
        }


        req.then(gImgs => {

            const payload = current_copy_payload();

            const im = gImgs.res[0];
            const img = new Image();
            img.onload = () => {
                ganPaintView.update({
                    image: img, imageID: '' + im.id, resetSelection: true
                });

                d3.select('#img_download').attr('href', img.src);

                ganPaintView.setNewMeta({
                    payload,
                    name: selected_recipe(),
                    remove: selected_action_is_remove()
                });
                history_sel.selectAll('.history_entry').remove()

            };
            img.src = im.d.startsWith('/') ? api_prefix + im.d : im.d;

        })
    }


    const history_sel = d3.select('#history');

    let updateHistory = function (stack: { meta: GanPaintMeta, img: string }[]) {

        // invert key - value mapping
        const pi_inv = {};
        Object.keys(paint_intensities).forEach(
            k => pi_inv[paint_intensities[k]] = k);

        const stack_rev = stack.map((d, i) => ({index: i, d: d})).reverse();
        let h_all = history_sel.selectAll('.history_entry').data(stack_rev);
        h_all.exit().remove();

        const h_all_enter = h_all.enter().append('div')
            .attr('class', 'history_entry')
        h_all_enter.append('img');
        h_all_enter.append('span');
        h_all_enter.append('button').text('x')

        h_all = h_all_enter.merge(h_all);
        h_all.style('opacity', (d, i) => i < 1 ? 1 : (i < 5) ? .7 : .5);
        h_all.select('img').attr('src', d => d.d.img);
        h_all.select('span')
            .text(d => `${d.d.meta.name} ${d.d.meta.remove ? 'rem' : 'draw'} (${pi_inv[d.d.meta.payload.length]}) `);
        h_all.select('button').on('click', d => {
            ganPaintView.removeCanvas(d.index);
        });


        h_all.on('mouseenter', d => {
            ganPaintView.highlightCanvas(d.index, true);
        })

        h_all.on('mouseleave', () => {
            ganPaintView.highlightCanvas(-1, false);
        })
    };


    /*
     *
     *  ===== EVENTS ====
     *
     */


    d3.selectAll('.undo_btn').on('click', () => {
        ganPaintView.removeLast();
    })

    d3.selectAll('.reset_btn').on('click', () => {
        ganPaintView.resetMasks();
    })


    eventHandler.bind(GanPaintView.events.maskChanged,
        (e: { caller: GanPaintView }) => {
            // console.log(e.caller.currentStack, "--- e.caller");

            const stack = e.caller.currentStack.map(d => ({
                meta: d.meta, img: d.canvas.toDataURL('image/png')
            }));

            const interventions: API_Intervention[] = stack.map(d => ({
                ablations: d.meta.payload,
                mask: {
                    bitbounds: [],
                    bitstring: d.img,
                    shape: []
                }
            }));


            api.generateImgsWithInterventions(
                selected_project().project,
                [+e.caller.imageID],
                interventions,
                0
            ).then(res => {
                // console.log(res, "--- res");


                const im = res.res[0];
                const img = new Image();
                img.onload = () => {

                    ganPaintView.update({
                        image: img,
                        imageID: '' + res.request.ids[0],
                        resetSelection: false,
                        alpha: 0
                    });

                    d3.select('#img_download').attr('href', img.src);

                };
                img.src = im.d.startsWith('/') ? api_prefix + im.d : im.d;


            }).catch(e => console.log(e, "--- e"));


            updateHistory(stack);

        })


    // d3.select('#tweet_it').on('click', ()=>{
    //
    //         // --- REQUEST A STATIC FILE ----
    //         const stack = ganPaintView.currentStack.map(d => ({
    //             meta: d.meta, img: d.canvas.toDataURL('image/png')
    //         }));
    //
    //         const interventions: API_Intervention[] = stack.map(d => ({
    //             ablations: d.meta.payload,
    //             mask: {
    //                 bitbounds: [],
    //                 bitstring: d.img,
    //                 shape: []
    //             }
    //         }));
    //
    //
    //         api.generateImgsWithInterventions(
    //             selected_project().project,
    //             [+ganPaintView.imageID],
    //             interventions,
    //             0,
    //             1
    //         ).then(res => {
    //             const im = res.res[0];
    //
    //             const url = im.d.startsWith('/') ? api_prefix + im.d : im.d;
    //
    //             window.open(`https://twitter.com/intent/tweet?text=${encodeURI('I painted with GANpaint (http://bit.ly/ganpaint). See here: '+url)}&hashtags=MITIBM,GANpaint`)
    //
    //
    //         })
    // })


    // d3.select('#img_download').on('click', function () {
    //     let image = <string>ganPaintView.canvas.node().toDataURL("image/png");
    //     (<HTMLLinkElement>this).href = image;
    // })

    /*
    *
    *  ===== UI stuff ====
    *
     */

    function setup_ui() {


        window.onresize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            re_layout(w, h);
        };

        function re_layout(w = window.innerWidth, h = window.innerHeight) {
            d3.selectAll('.main_frame')
                .style('height', (h - 53) + 'px')
                .style('width', w + 'px')
        }

        re_layout(window.innerWidth, window.innerHeight);

    }

    setup_ui();
}




