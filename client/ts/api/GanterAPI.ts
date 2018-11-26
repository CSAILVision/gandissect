/*
Ganter API and Types
 */

import * as d3 from "d3";
import URLHandler from "../etc/URLHandler";

export type AblationData = {
    channels: { d: string, id: number }[],
    ablation: number[] | null,
    // z: number[] | null
}

export type AblationUpload = {
    alpha: number, layer: string, unit: number, value?: number
}

export type Recipe = {
    layer: string,
    name: string,
    unit: { alpha: number, unit: number }[]
}

export type Ranking = {
    metric: string,
    name: string,
    scores: number[]
}


export type API_Project = {
    project: string
    info: {
        layers: string[]
    }

}

export type API_AllProject = API_Project[]
export type API_Channels = {
    request: { [key: string]: any },
    res: AblationData
}

export type API_Recipes = {
    request: { [key: string]: any },
    res: Recipe[]
}

export type API_Rankings = {
    request: { project: string, layer: string },
    res: Ranking[]
}


export type GANUnit = {
    unit: number, img: string, label: string
}
export type API_units = {
    request: { project: string, layer: string },
    res: GANUnit[]
}


export type API_generate = {
    request: {
        "ablations":
            AblationUpload[] | null,
        "ids": number[],
        "project": string,
        "wantz": boolean
    },
    res: { d: string, id?: number }[]
}

export type ImageMask = {
    id: string,
    mask: string
}

export type API_FeatureMask = {
    bitbounds: number[],
    bitstring: string | null,
    shape: number[]
}

export type API_Intervention = {
    ablations: AblationUpload[],
    mask?: API_FeatureMask
}


export type API_genFeatures = {
    request: {
        ablations:
            AblationUpload[] | null,
        ids: number[],
        masks: string[],
        project: string,

    },
    res: { d: string, id?: number }[]
}


export type API_Levels = {
    request: {
        layer: string,
        project: string,
        quantiles: number[]
    },
    res: number[][]
}

export class GanterAPI {


    constructor(private baseURL: string = null) {
        if (this.baseURL == null) {
            this.baseURL = URLHandler.basicURL();
        }
    }


    allProjects(): Promise<API_AllProject> {
        return d3.json(this.baseURL + '/api/all_projects')
    }

    ablationChannels(project: string,
                     layer = "layer2"): Promise<API_Channels> {
        return d3.json(this.baseURL + `/api/channels?project=${project}&layer=${layer}`)
    }

    recipes(project: string): Promise<API_Recipes> {
        return d3.json(this.baseURL + `/api/recipes?project=${project}`)
    }

    rankings(project: string, layer: string): Promise<API_Rankings> {
        return d3.json(this.baseURL + `/api/rankings?project=${project}&layer=${layer}`)
    }


    levels(project: string, layer: string, q: number = 0.99): Promise<API_Levels> {
        //../api/levels?project=churchoutdoor&layer=layer4&quantiles=0.99
        return d3.json(this.baseURL + `/api/levels?project=${project}&layer=${layer}&quantiles=${q}`)

    }


    generateImgs(project: string,
                 ids: number[],
                 wantz = 0,
                 ablations: AblationUpload[] = []): Promise<API_generate> {
        return d3.json(this.baseURL + '/api/generate', {
            method: "POST",
            body: JSON.stringify({
                "ablations": ablations,
                "project": project,
                "ids": ids,
                "wantz": wantz
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }

    generateImgsWithRmCp(project: string,
                         ids: number[],
                         wantz = 0,
                         ablation_rm: AblationUpload[] = [],
                         ablation_cp: AblationUpload[] = [],
                         mask_cp: API_FeatureMask
    ): Promise<API_generate> {

        return this.generateImgsWithInterventions(
            project, ids, [
                {ablations: ablation_rm},
                {
                    ablations: ablation_cp,
                    mask: mask_cp
                }], wantz
        )

        // const payload = {
        //     // "ablations": ablations,
        //     "project": project,
        //     "ids": ids,
        //     "wantz": wantz,
        //     "interventions": [
        //         {ablations: ablation_rm},
        //         {ablations: ablation_cp, mask: mask_cp}
        //     ]
        // }
        //
        // console.log(payload, "--- payload");
        //
        // return d3.json(this.baseURL + '/api/generate', {
        //     method: "POST",
        //     body: JSON.stringify(payload),
        //     headers: {
        //         "Content-type": "application/json; charset=UTF-8"
        //     }
        // });
    }

    generateImgsWithInterventions(
        project: string,
        ids: number[],
        interventions: API_Intervention[],
        wantz = 0,
        return_urls=0
    ): Promise<API_generate> {

        const payload = {
            // "ablations": ablations,
            "project": project,
            "ids": ids,
            "wantz": wantz,
            "interventions": interventions,
            "return_urls":return_urls
        }

        console.log(payload, "--- payload");

        return d3.json(this.baseURL + '/api/generate', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });


    }


    units(project: string, layer: string): Promise<API_units> {
        return d3.json(this.baseURL + `/api/units?project=${project}&layer=${layer}`)
    }


    generateFeatures(project: string,
                     imasks: ImageMask[],
                     layers: string[],
                     ablations: AblationUpload[] = []): Promise<API_genFeatures> {
        /*
        project = feat_req['project']
        ids = feat_req['ids']
        masks = feat_req.get('masks', None)
        layers = feat_req.get('layers', None)
        ablations = feat_req.get('ablations', [])
        */


        const ids = imasks.map(d => d.id);
        const masks = imasks.map(d => ({
            shape: [],
            bitbounds: [],
            bitstring: d.mask
        }));

        return d3.json(this.baseURL + '/api/features', {
            method: "POST",
            body: JSON.stringify({
                ablations,
                project,
                ids,
                masks,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });


    }


    generateFeaturesLocal(project: string,
                          ids: number[],
                          layers: string[],
                          masks: API_FeatureMask[],
                          ablations: AblationUpload[] = []): Promise<API_genFeatures> {
        /*
        project = feat_req['project']
        ids = feat_req['ids']
        masks = feat_req.get('masks', None)
        layers = feat_req.get('layers', None)
        ablations = feat_req.get('ablations', [])
        */


        // const ids = imasks.map(d => d.id);
        // const masks = imasks.map(d => ({
        //     shape: [],
        //     bitbounds: [],
        //     bitstring: d.mask
        // }));

        masks.forEach(mask => {
            if (mask.bitstring == null) {
                const bb = mask.bitbounds;
                const bits = (bb[2] - bb[0]) * (bb[3] - bb[1]);
                mask.bitstring = '1'.repeat(bits);
            }
        });


        return d3.json(this.baseURL + '/api/features', {
            method: "POST",
            body: JSON.stringify({
                ablations,
                project,
                ids,
                masks,
                layers
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });


    }

}

