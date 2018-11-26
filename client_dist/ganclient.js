/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/ 		return result;
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"ganclient": 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push(["./ts/ganclient.ts","vendor"]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ "./css/ganclient.scss":
/*!****************************!*\
  !*** ./css/ganclient.scss ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/file-loader/dist/cjs.js?name=index.html!./index.html":
/*!***************************************************************************!*\
  !*** ./node_modules/file-loader/dist/cjs.js?name=index.html!./index.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "index.html";

/***/ }),

/***/ "./ts/api/GanterAPI.ts":
/*!*****************************!*\
  !*** ./ts/api/GanterAPI.ts ***!
  \*****************************/
/*! exports provided: GanterAPI */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GanterAPI", function() { return GanterAPI; });
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var _etc_URLHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../etc/URLHandler */ "./ts/etc/URLHandler.ts");
/*
Ganter API and Types
 */


class GanterAPI {
    constructor(baseURL = null) {
        this.baseURL = baseURL;
        if (this.baseURL == null) {
            this.baseURL = _etc_URLHandler__WEBPACK_IMPORTED_MODULE_1__["default"].basicURL();
        }
    }
    allProjects() {
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + '/api/all_projects');
    }
    ablationChannels(project, layer = "layer2") {
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + `/api/channels?project=${project}&layer=${layer}`);
    }
    recipes(project) {
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + `/api/recipes?project=${project}`);
    }
    rankings(project, layer) {
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + `/api/rankings?project=${project}&layer=${layer}`);
    }
    levels(project, layer, q = 0.99) {
        //../api/levels?project=churchoutdoor&layer=layer4&quantiles=0.99
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + `/api/levels?project=${project}&layer=${layer}&quantiles=${q}`);
    }
    generateImgs(project, ids, wantz = 0, ablations = []) {
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + '/api/generate', {
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
    generateImgsWithRmCp(project, ids, wantz = 0, ablation_rm = [], ablation_cp = [], mask_cp) {
        return this.generateImgsWithInterventions(project, ids, [
            { ablations: ablation_rm },
            {
                ablations: ablation_cp,
                mask: mask_cp
            }
        ], wantz);
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
    generateImgsWithInterventions(project, ids, interventions, wantz = 0, return_urls = 0) {
        const payload = {
            // "ablations": ablations,
            "project": project,
            "ids": ids,
            "wantz": wantz,
            "interventions": interventions,
            "return_urls": return_urls
        };
        console.log(payload, "--- payload");
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + '/api/generate', {
            method: "POST",
            body: JSON.stringify(payload),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
    }
    units(project, layer) {
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + `/api/units?project=${project}&layer=${layer}`);
    }
    generateFeatures(project, imasks, layers, ablations = []) {
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
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + '/api/features', {
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
    generateFeaturesLocal(project, ids, layers, masks, ablations = []) {
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
        return d3__WEBPACK_IMPORTED_MODULE_0__["json"](this.baseURL + '/api/features', {
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


/***/ }),

/***/ "./ts/etc/SVGplus.ts":
/*!***************************!*\
  !*** ./ts/etc/SVGplus.ts ***!
  \***************************/
/*! exports provided: SVG, SVGMeasurements */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVG", function() { return SVG; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVGMeasurements", function() { return SVGMeasurements; });
/**
 * Created by hen on 5/15/17.
 */
class SVG {
    static translate({ x, y }) {
        return "translate(" + x + "," + y + ")";
    }
    static group(parent, classes, pos = { x: 0, y: 0 }) {
        return parent.append('g').attrs({
            class: classes,
            "transform": SVG.translate(pos)
        });
    }
}
class SVGMeasurements {
    constructor(baseElement, classes = '') {
        this.measureElement = baseElement.append('text')
            .attrs({ x: 0, y: -20, class: classes });
    }
    textLength(text, style = null) {
        this.measureElement.attr('style', style);
        this.measureElement.text(text);
        const tl = this.measureElement.node().getComputedTextLength();
        this.measureElement.text('');
        return tl;
    }
}


/***/ }),

/***/ "./ts/etc/SimpleEventHandler.ts":
/*!**************************************!*\
  !*** ./ts/etc/SimpleEventHandler.ts ***!
  \**************************************/
/*! exports provided: SimpleEventHandler */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SimpleEventHandler", function() { return SimpleEventHandler; });
/**
 * Created by hen on 5/15/17.
 */
class SimpleEventHandler {
    constructor(element) {
        this.element = element;
        this.eventListeners = [];
    }
    bind(eventNames, eventFunction) {
        for (const eventName of eventNames.split(' ')) {
            this.eventListeners.push({ eventName, eventFunction });
            const eventFunctionWrap = e => eventFunction(e.detail, e);
            this.element.addEventListener(eventName, eventFunctionWrap, false);
        }
    }
    getListeners() {
        return this.eventListeners;
    }
    trigger(eventName, detail) {
        this.element.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
}


/***/ }),

/***/ "./ts/etc/URLHandler.ts":
/*!******************************!*\
  !*** ./ts/etc/URLHandler.ts ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return URLHandler; });
/**
 * Created by hen on 5/15/17.
 */
class URLHandler {
    static basicURL() {
        const url_path = window.location.pathname.split('/').slice(0, -2).join('/');
        return window.location.origin + (url_path.length ? url_path : '');
    }
    /**
     * Read all URL parameters into a map.
     * @returns {Map} the url parameters as a key-value store (ES6 map)
     */
    static get parameters() {
        // Adapted from:  http://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        console.log(vars, "--- vars");
        const urlParameters = {};
        const isInt = x => (/^[0-9]+$/).test(x);
        const isFloat = x => (/^[0-9]+\.[0-9]*$/).test(x);
        const typeCast = val => {
            if (isInt(val)) {
                return Number.parseInt(val, 10);
            }
            else if (isFloat(val)) {
                return Number.parseFloat(val);
            }
            // else:
            return val;
        };
        vars.forEach(v => {
            if (v.length > 0) {
                const splits = v.split('=');
                const key = decodeURIComponent(splits[0]);
                let raw_value = decodeURIComponent(splits[1]);
                const isArray = raw_value.startsWith('..');
                if (isArray) {
                    raw_value = raw_value.slice(2);
                }
                if (raw_value.length < 1) {
                    urlParameters[key] = isArray ? [] : '';
                }
                else if (isArray) {
                    urlParameters[key] = raw_value.split(',')
                        .map(val => typeCast(val));
                }
                else {
                    urlParameters[key] = typeCast(raw_value);
                }
            }
        });
        return urlParameters;
    }
    /**
     * Generates an URL string from a map of url parameters
     * @param {{}} urlParameters - the map of parameters
     * @returns {string} - an URI string
     */
    static urlString(urlParameters) {
        const attr = [];
        Object.keys(urlParameters).forEach(k => {
            const v = urlParameters[k];
            if (v !== undefined) {
                let value = v;
                if (Array.isArray(v))
                    value = '..' + v.join(',');
                attr.push(encodeURI(k + '=' + value));
            }
        });
        const url = window.location.pathname;
        let res = url.substring(url.lastIndexOf('/') + 1);
        if (attr.length > 0) {
            res += '?' + attr.join('&');
        }
        return res;
    }
    static updateURLParam(key, value, addToBrowserHistory = true) {
        const currentParams = URLHandler.parameters;
        currentParams[key] = value;
        URLHandler.updateUrl(currentParams, addToBrowserHistory);
    }
    // /**
    //  * Generates a key-value map of all URL params and replaces replaceKeys
    //  * @param updateKeys
    //  */
    // static updateURLParams(updateKeys) {
    //     const currentParams = URLHandler.parameters;
    //     Object.keys(updateKeys).forEach((k) => currentParams[k] = updateKeys[k])
    //     return currentParams;
    // }
    static updateUrl(urlParameters, addToBrowserHistory = true) {
        if (addToBrowserHistory) {
            window.history.pushState(urlParameters, '', URLHandler.urlString(urlParameters));
        }
        else {
            window.history.replaceState(urlParameters, '', URLHandler.urlString(urlParameters));
        }
    }
}


/***/ }),

/***/ "./ts/etc/Util.ts":
/*!************************!*\
  !*** ./ts/etc/Util.ts ***!
  \************************/
/*! exports provided: Util, argsort, range, obj_to_arr, arr_to_obj */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return Util; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "argsort", function() { return argsort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "range", function() { return range; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "obj_to_arr", function() { return obj_to_arr; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "arr_to_obj", function() { return arr_to_obj; });
/**
 * Created by hen on 5/15/17.
 */
let the_unique_id_counter = 0;
class Util {
    static simpleUId({ prefix = '' }) {
        the_unique_id_counter += 1;
        return prefix + the_unique_id_counter;
    }
}
function argsort(array, sortFct) {
    return array
        .map((d, i) => [d, i])
        .sort((a, b) => sortFct(a[0], b[0]))
        .map(d => d[1]);
}
function range(end) {
    return [...Array(end).keys()];
}
function obj_to_arr(obj) {
    const sortedKeys = Object.keys(obj).sort();
    const res = [];
    sortedKeys.forEach(k => { res.push(k); res.push(obj[k]); });
    return res;
}
function arr_to_obj(arr) {
    const res = {};
    const max_l = Math.floor(arr.length / 2);
    for (let i = 0; i < max_l; i++) {
        res[arr[2 * i]] = arr[2 * i + 1];
    }
    return res;
}


/***/ }),

/***/ "./ts/ganclient.ts":
/*!*************************!*\
  !*** ./ts/ganclient.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var d3__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! d3 */ "./node_modules/d3/index.js");
/* harmony import */ var d3_selection_multi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! d3-selection-multi */ "./node_modules/d3-selection-multi/index.js");
/* harmony import */ var _css_ganclient_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../css/ganclient.scss */ "./css/ganclient.scss");
/* harmony import */ var _css_ganclient_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_css_ganclient_scss__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _file_loader_name_index_html_index_html__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! file-loader?name=index.html!../index.html */ "./node_modules/file-loader/dist/cjs.js?name=index.html!./index.html");
/* harmony import */ var _file_loader_name_index_html_index_html__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_file_loader_name_index_html_index_html__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _etc_SimpleEventHandler__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./etc/SimpleEventHandler */ "./ts/etc/SimpleEventHandler.ts");
/* harmony import */ var _api_GanterAPI__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./api/GanterAPI */ "./ts/api/GanterAPI.ts");
/* harmony import */ var _etc_Util__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./etc/Util */ "./ts/etc/Util.ts");
/* harmony import */ var _vis_PaintSelectView__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./vis/PaintSelectView */ "./ts/vis/PaintSelectView.ts");
/* harmony import */ var _etc_URLHandler__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./etc/URLHandler */ "./ts/etc/URLHandler.ts");



// import '../node_modules/font-awesome/css/font-awesome.min.css'






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
    projects: {},
    recipes: {
        ablation: {},
        copy: {},
        copy_values: []
    },
    unit_sorting: {
        // ablation: <number[]>null,
        copy: null
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
    }
    ;
    static selector_on_change_or_enter(selector, f) {
        selector.on('change', () => {
            f();
        });
        selector.on('keypress', () => {
            if (d3__WEBPACK_IMPORTED_MODULE_0__["event"].keyCode == 13) {
                f();
            }
        });
    }
    ;
}
window.onload = () => {
    const side_bar = d3__WEBPACK_IMPORTED_MODULE_0__["select"](".side_bar");
    side_bar.style('width', `${current.sidebar.width}px`);
    const eventHandler = new _etc_SimpleEventHandler__WEBPACK_IMPORTED_MODULE_4__["SimpleEventHandler"](d3__WEBPACK_IMPORTED_MODULE_0__["select"]('body').node());
    const api_prefix = _etc_URLHandler__WEBPACK_IMPORTED_MODULE_8__["default"].parameters['api'] || '';
    const api = new _api_GanterAPI__WEBPACK_IMPORTED_MODULE_5__["GanterAPI"](api_prefix);
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
    const ds_selector = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#project_selector');
    const layer_selector = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#layer_selector');
    const recipe_ablation_selector = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#recipe_select_ablation');
    const recipe_copy_selector = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#recipe_select_copy');
    const sel_project = () => current.projects[ds_selector.property('value')];
    const sel_layer = () => layer_selector.property('value');
    const sel_watch = () => d3__WEBPACK_IMPORTED_MODULE_0__["select"]('.watch.selected')
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
                .text(d => d);
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
            });
            api.levels(sel_project().project, sel_layer())
                .then(level_req => {
                current.recipes.copy_values = level_req.res
                    .map(levels => levels[0]);
            });
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
        const r_string = recipe_ablation_selector.property('value');
        const label_prefix = r_string.split('-')[0];
        update_unit_images(ablation_values(r_string), label_prefix);
    }
    function update_units_copy() {
        const r_string = recipe_copy_selector.property('value');
        const label_prefix = r_string.split('-')[0];
        update_unit_images(ablation_values(r_string), label_prefix);
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
    d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.watch').on('click', function () {
        const me = this;
        d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.watch')
            .classed('selected', function () {
            return this == me;
        });
        if (sel_watch() === 'ablation') {
            update_units_ablation();
        }
        else {
            update_units_copy();
        }
    });
    function update_units() {
        if (sel_watch() === 'ablation') {
            update_units_ablation();
        }
        else {
            update_units_copy();
        }
    }
    function update_unit_images(values = null, label_prefix = '', sort_fct = (a, b) => a - b) {
        const ablate_ids = _current_ablation_ids();
        const copy_ids = _current_copy_ids();
        api.units(sel_project().project, sel_layer())
            .then(unitres => {
            const units = unitres.res;
            let indices = [];
            if (values) {
                indices = Object(_etc_Util__WEBPACK_IMPORTED_MODULE_6__["argsort"])(values, sort_fct);
            }
            else {
                indices = d3__WEBPACK_IMPORTED_MODULE_0__["range"](units.length);
            }
            let uni = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#units')
                .selectAll('.unit')
                .data(indices); //, (d, i) => i + 'c' + d);
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
            uni.select('.label').text((d, i) => `${label_prefix} #${i}`);
            // uni.select('.ablation')
            //     .style('width', d =>
            //         values.length > d ? `${(values[d]) / values[indices[0]] * 59 + 1}px` : '1px'
            //     )
        });
    }
    const rm_unit = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#rm_unit');
    const cp_unit = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#cp_unit');
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
    const image_select = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#image_select');
    const sel_images = () => {
        const img_str = image_select.property('value');
        const parts = img_str.trim().split(',');
        let res = [];
        parts.forEach(part_x => {
            const part = part_x.trim();
            if (!!part.match(/^[0-9]+$/g)) {
                res = [...res, +part];
            }
            else if (!!part.match(/^[0-9]+-[0-9]+$/g)) {
                const subparts = part.split('-');
                res = [...res, ...d3__WEBPACK_IMPORTED_MODULE_0__["range"](+subparts[0], +subparts[1] + 1)];
            }
        });
        return res;
    };
    Helper.selector_on_change_or_enter(image_select, updateImages);
    const image_list = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#image_list');
    const subImageToID = d => `id_${d.id}${d.ablated ? '-ablated' : ''}`;
    const sel_zoom = () => +d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#input_zoom').property('value');
    d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#input_zoom').on('change', () => {
        d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.gan_sub_image').each(function (d) {
            const me = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this);
            const psv = me.property('psv');
            psv.zoom = sel_zoom();
        });
    });
    const sel_opacity = () => d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#input_opacity').property('value');
    d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#input_opacity').on('change', () => {
        d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.gan_sub_image').each(function (d) {
            const me = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this);
            const psv = me.property('psv');
            psv.opacity = sel_opacity();
        });
    });
    function _updateImages(imgs) {
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
            const me = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this);
            const psv = new _vis_PaintSelectView__WEBPACK_IMPORTED_MODULE_7__["PaintSelectView"](d3__WEBPACK_IMPORTED_MODULE_0__["select"](this), eventHandler);
            psv.zoom = zoom_level;
            psv.opacity = opacity;
            me.property('psv', psv);
        });
        gan_sub_enter.append('button')
            .on('click', function () {
            const p = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.parentNode);
            const psv = p.property('psv');
            psv.reset();
        });
        gan_sub_enter.append('span');
        // TODO: v1
        // const svgs = gan_sub_enter.append('svg');
        // decorateSVG(svgs);
        gan_sub = gan_sub_enter.merge(gan_sub);
        gan_sub.each(function (d) {
            const me = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this);
            const psv = me.property('psv');
            const img = new Image();
            img.onload = () => {
                psv.update({
                    image: img,
                    imageID: subImageToID(d)
                });
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
            const pointer = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.parentNode).select('.pointer');
            if (pointer.classed('selected'))
                return;
            const coo = d3__WEBPACK_IMPORTED_MODULE_0__["mouse"](this);
            let tl_grid = coo.map(coord_im2grid).map(Math.floor);
            const br_grid = tl_grid.map(d => d + 1);
            const br = br_grid.map(coord_grid2im);
            const tl = tl_grid.map(coord_grid2im);
            pointer.attrs({
                x: tl[0],
                y: tl[1],
                width: br[0] - tl[0],
                height: br[1] - tl[1]
            });
            pointer.property('_selection_', [tl_grid, br_grid]);
        });
        activeLayer.on('click', function (d) {
            const pointer = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.parentNode).select('.pointer');
            const newValue = !pointer.classed('selected');
            pointer.classed('selected', newValue);
            if (newValue) {
                const edata = {
                    image: d,
                    selection: pointer.property('_selection_')
                };
                eventHandler.trigger(events.dropping, edata);
            }
            else {
                const edata = {
                    image: d,
                    selection: null
                };
                eventHandler.trigger(events.dropping, edata);
            }
        });
        activeLayer.on('mouseleave', function () {
            const pointer = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this.parentNode).select('.pointer');
            if (!pointer.classed('selected')) {
                pointer.attrs({ x: -10, y: -10, width: 0, height: 0 });
            }
        });
    }
    const coord_im2grid = x => x * 8. / current.image.size;
    const coord_grid2im = x => Math.round(x * current.image.size / 8.);
    function selectPicker(id, ablated) {
        const sub_images = image_list.selectAll('.gan_sub_image');
        const add_them = sub_images.filter((d) => {
            return (d.id === id) && (d.ablated === ablated);
        });
        sub_images.select('button').classed('selected', false);
        sub_images.select('svg .brush').remove();
        add_them.select('button').classed('selected', true);
        const im_s = current.image.size;
        // const d_unit = x => x * 8. / im_s;
        // const d_unit_inv = x => Math.round(x * im_s / 8.);
        function burshend() {
            if (!d3__WEBPACK_IMPORTED_MODULE_0__["event"].sourceEvent)
                return; // Only transition after input.
            if (!d3__WEBPACK_IMPORTED_MODULE_0__["event"].selection)
                return; // Ignore empty selections.
            console.log(d3__WEBPACK_IMPORTED_MODULE_0__["event"].selection, "--- d3.event.selection");
            const p0 = d3__WEBPACK_IMPORTED_MODULE_0__["event"].selection[0].map(coord_im2grid);
            const p1 = d3__WEBPACK_IMPORTED_MODULE_0__["event"].selection[1].map(coord_im2grid);
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
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](this).transition().call(brush.move, pl);
        }
        const brush = d3__WEBPACK_IMPORTED_MODULE_0__["brush"]()
            .extent([[0, 0], [im_s, im_s]])
            .on('end', burshend);
        add_them.select('svg').append("g")
            .attr("class", "brush")
            .call(brush)
            .selectAll('.selection')
            .style('fill-opacity', 0.2)
            .style('stroke', 'red')
            .style('stroke-width', '2px');
        // .on("start brush", brushed)
        // .on("end", brushended);
    }
    function _current_ablation_ids() {
        const n_rm = no_rm_units();
        // ablation_sort_values(recipe_ablation_selector.property('value'));
        let us = Object(_etc_Util__WEBPACK_IMPORTED_MODULE_6__["argsort"])(ablation_values(recipe_ablation_selector.property('value')), (a, b) => a - b);
        if (!us)
            us = d3__WEBPACK_IMPORTED_MODULE_0__["range"](n_rm + 1);
        return us
            .slice(0, Math.min(n_rm, us.length));
    }
    function _current_ablation_payload() {
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
        let us = Object(_etc_Util__WEBPACK_IMPORTED_MODULE_6__["argsort"])(ablation_values(sort_dim), (a, b) => a - b);
        return us
            .slice(0, Math.min(n_cp, us.length));
    }
    function _current_copy_payload() {
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
    function _current_copy_payload_old() {
        const n_cp = no_cp_units();
        const sort_dim = recipe_copy_selector.property('value');
        const us = Object(_etc_Util__WEBPACK_IMPORTED_MODULE_6__["argsort"])(current.unit_sorting.copy[sort_dim], (a, b) => b - a);
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
        api.generateImgs(sel_project().project, images, 0, [])
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
                            }];
                    }));
                });
            }
            else {
                _updateImages(gImgs.res.map(d => [{
                        d: d.d,
                        id: d.id,
                        ablated: false
                    }]));
            }
        });
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
        api.generateFeaturesLocal(sel_project().project, [pick.id], [sel_layer()], [{
                shape: [8, 8],
                bitbounds: [bb[0][1], bb[0][0], bb[1][1], bb[1][0]],
                bitstring: null
            }], ablations).then(f_resp => {
            const features = f_resp.res[sel_layer()];
            Helper.update_selector(recipe_copy_selector, Object.keys(features));
            current.unit_sorting.copy = features;
            Object.keys(features);
        });
    });
    // TODO: broken -- was for V1 --- ID is now attached to DIV and not IMG
    eventHandler.bind(events.dropping, (edata) => {
        console.log(edata, "--- edata");
        const bb = edata.selection;
        console.log(_current_copy_payload(), "--- _current_copy_payload()");
        if (bb) {
            api.generateImgsWithRmCp(sel_project().project, [edata.image.id], 0, edata.image.ablated ? _current_ablation_payload() : [], _current_copy_payload(), {
                bitbounds: [bb[0][1], bb[0][0], bb[1][1], bb[1][0]],
                bitstring: '1',
                shape: [8, 8]
            }).then(d => {
                d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.' + subImageToID(edata.image))
                    .attr('src', d.res[0].d);
                console.log(d.res[0].d, subImageToID(edata.image), "--- d");
            });
        }
        else {
            api.generateImgs(sel_project().project, [edata.image.id], 0, edata.image.ablated ? _current_ablation_payload() : []).then(d => {
                d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.' + subImageToID(edata.image))
                    .attr('src', d.res[0].d);
            });
        }
    });
    eventHandler.bind(_vis_PaintSelectView__WEBPACK_IMPORTED_MODULE_7__["PaintSelectView"].events.maskChanged, (im) => {
        const img_data = d3__WEBPACK_IMPORTED_MODULE_0__["select"]('.' + im.id).datum();
        api.generateImgsWithRmCp(sel_project().project, [img_data.id], 0, img_data.ablated ? _current_ablation_payload() : [], _current_copy_payload(), {
            bitbounds: [],
            bitstring: im.mask,
            shape: []
        }).then(d => {
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.' + im.id).each(function () {
                const me = d3__WEBPACK_IMPORTED_MODULE_0__["select"](this);
                const psv = me.property('psv');
                const img = new Image();
                img.onload = () => {
                    psv.update({
                        image: img,
                        imageID: im.id
                    });
                };
                img.src = d.res[0].d;
            });
            // .attr('src', d.res[0].d);
            console.log(d.res[0].d, "--- d");
        });
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
        d3__WEBPACK_IMPORTED_MODULE_0__["select"]('#sidebar_btn')
            .on('click', function () {
            const sb = current.sidebar;
            sb.visible = !sb.visible;
            d3__WEBPACK_IMPORTED_MODULE_0__["select"](this)
                .classed('on', sb.visible);
            side_bar.classed('hidden', !sb.visible);
            side_bar.style('right', sb.visible ? null : `-${current.sidebar.width}px`);
            re_layout();
        });
        window.onresize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            // console.log(w, h, "--- w,h");
            re_layout(w, h);
        };
        function re_layout(w = window.innerWidth, h = window.innerHeight) {
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.sidenav')
                .style('height', (h - 53) + 'px');
            const sb = current.sidebar;
            const mainWidth = w - (sb.visible ? sb.width : 0);
            d3__WEBPACK_IMPORTED_MODULE_0__["selectAll"]('.main_frame')
                .style('height', (h - 53) + 'px')
                .style('width', mainWidth + 'px');
            // eventHandler.trigger(GlobalEvents.window_resize, {w, h})
            // eventHandler.trigger(GlobalEvents.main_resize, {
            //     w: (w - global.sidebar()),
            //     h: (h - 45)
            // })
        }
        re_layout(window.innerWidth, window.innerHeight);
    }
    setup_ui();
};


/***/ }),

/***/ "./ts/vis/PaintSelectView.ts":
/*!***********************************!*\
  !*** ./ts/vis/PaintSelectView.ts ***!
  \***********************************/
/*! exports provided: PaintSelectView */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PaintSelectView", function() { return PaintSelectView; });
/* harmony import */ var _VisComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./VisComponent */ "./ts/vis/VisComponent.ts");
/* harmony import */ var paint_select__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! paint_select */ "./node_modules/paint_select/dist/paint_select.js");
/* harmony import */ var paint_select__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(paint_select__WEBPACK_IMPORTED_MODULE_1__);


class PaintSelectView extends _VisComponent__WEBPACK_IMPORTED_MODULE_0__["VComponent"] {
    constructor(_parent, _eventHandler) {
        super(_parent, _eventHandler);
        this.css_name = "PaintSelectView";
        this.superInitHTML();
        // TODO:hack
        // this.base.attr('class', '');
        this._init();
    }
    _init() {
        this.psw = new paint_select__WEBPACK_IMPORTED_MODULE_1__["PaintSelectWidget"](this.base.node(), {
            overlayModified: (me, mask) => {
                this.fireMaskEvent(mask);
            }
        }, null, 1);
        this.psw.radius = 20;
        this.psw.drawColor = '#f06069';
        this.psw.alpha = .3;
    }
    fireMaskEvent(mask) {
        const imgMask = {
            id: this.renderData.imageID || -1,
            mask
        };
        this.eventHandler.trigger(PaintSelectView.events.maskChanged, imgMask);
    }
    _wrangle(data) {
        return data;
    }
    _render(rD = this.renderData) {
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
    resetSelection() {
        this.psw.reset();
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
    set opacity(o) {
        this.psw.alpha = o;
    }
    reset(supressEvent = false) {
        this.psw.reset();
        if (!supressEvent) {
            this.fireMaskEvent(this.psw.currentMask);
        }
    }
}
PaintSelectView.events = {
    maskChanged: "PaintSelectView_mc"
};


/***/ }),

/***/ "./ts/vis/VisComponent.ts":
/*!********************************!*\
  !*** ./ts/vis/VisComponent.ts ***!
  \********************************/
/*! exports provided: VComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VComponent", function() { return VComponent; });
/* harmony import */ var _etc_Util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../etc/Util */ "./ts/etc/Util.ts");
/* harmony import */ var _etc_SimpleEventHandler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../etc/SimpleEventHandler */ "./ts/etc/SimpleEventHandler.ts");
/* harmony import */ var _etc_SVGplus__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../etc/SVGplus */ "./ts/etc/SVGplus.ts");



class VComponent {
    // CONSTRUCTOR ============================================================
    /**
     * Simple constructor. Subclasses should call @superInit(options) as well.
     * see why here: https://stackoverflow.com/questions/43595943/why-are-derived-class-property-values-not-seen-in-the-base-class-constructor
     *
     * template:
     constructor(d3Parent: D3Sel, eventHandler?: SimpleEventHandler, options: {} = {}) {
        super(d3Parent, eventHandler);
        // -- access to subclass params:
        this.superInit(options);
     }
     *
     * @param {D3Sel} d3parent  D3 selection of parent SVG DOM Element
     * @param {SimpleEventHandler} eventHandler a global event handler object or 'null' for local event handler
     */
    constructor(d3parent, eventHandler) {
        this.id = _etc_Util__WEBPACK_IMPORTED_MODULE_0__["Util"].simpleUId({});
        this.parent = d3parent;
        // If not further specified - create a local event handler bound to the bas element
        this.eventHandler = eventHandler ||
            new _etc_SimpleEventHandler__WEBPACK_IMPORTED_MODULE_1__["SimpleEventHandler"](this.parent.node());
        // Object for storing internal states and variables
        this._visibility = { hidden: false };
    }
    // protected createSvgLayers(layers=['bg','main','fg']){
    //     this._layers = {}
    //     this.base = SVG.group(this.parent,
    //             this.css_name + ' ID' + this.id,
    //             this.options.pos);
    //
    // }
    superInitHTML(options = {}) {
        Object.keys(options).forEach(key => this.options[key] = options[key]);
        this.base = this.parent.append('div')
            .classed(this.css_name, true);
    }
    /**
     * Has to be called as last call in subclass constructor.
     * @param {{}} options
     * @param defaultLayers -- create the default <g> layers: bg -> main -> fg
     */
    superInitSVG(options = {}, defaultLayers = ['bg', 'main', 'fg']) {
        // Set default options if not specified in constructor call
        // const defaults = this.defaultOptions;
        // this.options = {};
        // const keys = new Set([...Object.keys(defaults), ...Object.keys(options)]);
        // keys.forEach(key => this.options[key] = (key in options) ? options[key] : defaults[key]);
        Object.keys(options).forEach(key => this.options[key] = options[key]);
        this.layers = {};
        // Create the base group element
        this.base = _etc_SVGplus__WEBPACK_IMPORTED_MODULE_2__["SVG"].group(this.parent, this.css_name + ' ID' + this.id, this.options.pos);
        // create default layers: background, main, foreground
        if (defaultLayers) {
            // construction order is important !
            defaultLayers.forEach(layer => {
                this.layers[layer] = _etc_SVGplus__WEBPACK_IMPORTED_MODULE_2__["SVG"].group(this.base, layer);
            });
            // this.layers.bg = SVG.group(this.base, 'bg');
            // this.layers.main = SVG.group(this.base, 'main');
            // this.layers.fg = SVG.group(this.base, 'fg');
        }
    }
    // DATA UPDATE & RENDER ============================================================
    /**
     * Every time data has changed, update is called and
     * triggers wrangling and re-rendering
     * @param {Object} data data object
     * @return {*} ---
     */
    update(data) {
        this.data = data;
        if (this._visibility.hidden)
            return;
        this.renderData = this._wrangle(data);
        this._render(this.renderData);
    }
    // UPDATE OPTIONS ============================================================
    /**
     * Updates instance options
     * @param {Object} options only the options that should be updated
     * @param {Boolean} reRender if option change requires a re-rendering (default:false)
     * @returns {*} ---
     */
    updateOptions(options, reRender = false) {
        Object.keys(options).forEach(k => this.options[k] = options[k]);
        if (reRender)
            this._render(this.renderData);
    }
    // === CONVENIENCE ====
    setHideElement(hE) {
        this._visibility.hideElement = hE;
    }
    hideView() {
        if (!this._visibility.hidden) {
            const hE = this._visibility.hideElement || this.parent;
            hE.transition().styles({
                'opacity': 0,
                'pointer-events': 'none'
            }).style('display', 'none');
            this._visibility.hidden = true;
        }
    }
    unhideView() {
        if (this._visibility.hidden) {
            const hE = this._visibility.hideElement || this.parent;
            hE.transition().styles({
                'opacity': 1,
                'pointer-events': null,
                'display': null
            });
            this._visibility.hidden = false;
            // this.update(this.data);
        }
    }
    destroy() {
        this.base.remove();
    }
}
// STATIC FIELDS ============================================================
/**
 * The static property that contains all class related events.
 * Should be overwritten and event strings have to be unique!!
 */
VComponent.events = { noEvent: 'VComponent_noEvent' };


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vY3NzL2dhbmNsaWVudC5zY3NzIiwid2VicGFjazovLy8uL2luZGV4Lmh0bWwiLCJ3ZWJwYWNrOi8vLy4vdHMvYXBpL0dhbnRlckFQSS50cyIsIndlYnBhY2s6Ly8vLi90cy9ldGMvU1ZHcGx1cy50cyIsIndlYnBhY2s6Ly8vLi90cy9ldGMvU2ltcGxlRXZlbnRIYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3RzL2V0Yy9VUkxIYW5kbGVyLnRzIiwid2VicGFjazovLy8uL3RzL2V0Yy9VdGlsLnRzIiwid2VicGFjazovLy8uL3RzL2dhbmNsaWVudC50cyIsIndlYnBhY2s6Ly8vLi90cy92aXMvUGFpbnRTZWxlY3RWaWV3LnRzIiwid2VicGFjazovLy8uL3RzL3Zpcy9WaXNDb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQVEsb0JBQW9CO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQWlCLDRCQUE0QjtBQUM3QztBQUNBO0FBQ0EsMEJBQWtCLDJCQUEyQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMs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U0FDbEM7SUFDTCxDQUFDO0lBRUQsVUFBVTtRQUNOLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUU7WUFDekIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUN2RCxFQUFFLENBQUMsVUFBVSxFQUFFLENBQUMsTUFBTSxDQUFDO2dCQUNuQixTQUFTLEVBQUUsQ0FBQztnQkFDWixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixTQUFTLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDaEMsMEJBQTBCO1NBRTdCO0lBQ0wsQ0FBQztJQUVELE9BQU87UUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ3ZCLENBQUM7O0FBdk5ELDZFQUE2RTtBQUU3RTs7O0dBR0c7QUFFSSxpQkFBTSxHQUFPLEVBQUMsT0FBTyxFQUFFLG9CQUFvQixFQUFDLENBQUMiLCJmaWxlIjoiZ2FuY2xpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gaW5zdGFsbCBhIEpTT05QIGNhbGxiYWNrIGZvciBjaHVuayBsb2FkaW5nXG4gXHRmdW5jdGlvbiB3ZWJwYWNrSnNvbnBDYWxsYmFjayhkYXRhKSB7XG4gXHRcdHZhciBjaHVua0lkcyA9IGRhdGFbMF07XG4gXHRcdHZhciBtb3JlTW9kdWxlcyA9IGRhdGFbMV07XG4gXHRcdHZhciBleGVjdXRlTW9kdWxlcyA9IGRhdGFbMl07XG5cbiBcdFx0Ly8gYWRkIFwibW9yZU1vZHVsZXNcIiB0byB0aGUgbW9kdWxlcyBvYmplY3QsXG4gXHRcdC8vIHRoZW4gZmxhZyBhbGwgXCJjaHVua0lkc1wiIGFzIGxvYWRlZCBhbmQgZmlyZSBjYWxsYmFja1xuIFx0XHR2YXIgbW9kdWxlSWQsIGNodW5rSWQsIGkgPSAwLCByZXNvbHZlcyA9IFtdO1xuIFx0XHRmb3IoO2kgPCBjaHVua0lkcy5sZW5ndGg7IGkrKykge1xuIFx0XHRcdGNodW5rSWQgPSBjaHVua0lkc1tpXTtcbiBcdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0pIHtcbiBcdFx0XHRcdHJlc29sdmVzLnB1c2goaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKTtcbiBcdFx0XHR9XG4gXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdID0gMDtcbiBcdFx0fVxuIFx0XHRmb3IobW9kdWxlSWQgaW4gbW9yZU1vZHVsZXMpIHtcbiBcdFx0XHRpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuIFx0XHRcdFx0bW9kdWxlc1ttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG4gXHRcdFx0fVxuIFx0XHR9XG4gXHRcdGlmKHBhcmVudEpzb25wRnVuY3Rpb24pIHBhcmVudEpzb25wRnVuY3Rpb24oZGF0YSk7XG5cbiBcdFx0d2hpbGUocmVzb2x2ZXMubGVuZ3RoKSB7XG4gXHRcdFx0cmVzb2x2ZXMuc2hpZnQoKSgpO1xuIFx0XHR9XG5cbiBcdFx0Ly8gYWRkIGVudHJ5IG1vZHVsZXMgZnJvbSBsb2FkZWQgY2h1bmsgdG8gZGVmZXJyZWQgbGlzdFxuIFx0XHRkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzIHx8IFtdKTtcblxuIFx0XHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcbiBcdFx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG4gXHR9O1xuIFx0ZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXMoKSB7XG4gXHRcdHZhciByZXN1bHQ7XG4gXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBkZWZlcnJlZE1vZHVsZXMubGVuZ3RoOyBpKyspIHtcbiBcdFx0XHR2YXIgZGVmZXJyZWRNb2R1bGUgPSBkZWZlcnJlZE1vZHVsZXNbaV07XG4gXHRcdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG4gXHRcdFx0Zm9yKHZhciBqID0gMTsgaiA8IGRlZmVycmVkTW9kdWxlLmxlbmd0aDsgaisrKSB7XG4gXHRcdFx0XHR2YXIgZGVwSWQgPSBkZWZlcnJlZE1vZHVsZVtqXTtcbiBcdFx0XHRcdGlmKGluc3RhbGxlZENodW5rc1tkZXBJZF0gIT09IDApIGZ1bGZpbGxlZCA9IGZhbHNlO1xuIFx0XHRcdH1cbiBcdFx0XHRpZihmdWxmaWxsZWQpIHtcbiBcdFx0XHRcdGRlZmVycmVkTW9kdWxlcy5zcGxpY2UoaS0tLCAxKTtcbiBcdFx0XHRcdHJlc3VsdCA9IF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gZGVmZXJyZWRNb2R1bGVbMF0pO1xuIFx0XHRcdH1cbiBcdFx0fVxuIFx0XHRyZXR1cm4gcmVzdWx0O1xuIFx0fVxuXG4gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuIFx0Ly8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4gXHQvLyBQcm9taXNlID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxuIFx0dmFyIGluc3RhbGxlZENodW5rcyA9IHtcbiBcdFx0XCJnYW5jbGllbnRcIjogMFxuIFx0fTtcblxuIFx0dmFyIGRlZmVycmVkTW9kdWxlcyA9IFtdO1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHR2YXIganNvbnBBcnJheSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSA9IHdpbmRvd1tcIndlYnBhY2tKc29ucFwiXSB8fCBbXTtcbiBcdHZhciBvbGRKc29ucEZ1bmN0aW9uID0ganNvbnBBcnJheS5wdXNoLmJpbmQoanNvbnBBcnJheSk7XG4gXHRqc29ucEFycmF5LnB1c2ggPSB3ZWJwYWNrSnNvbnBDYWxsYmFjaztcbiBcdGpzb25wQXJyYXkgPSBqc29ucEFycmF5LnNsaWNlKCk7XG4gXHRmb3IodmFyIGkgPSAwOyBpIDwganNvbnBBcnJheS5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soanNvbnBBcnJheVtpXSk7XG4gXHR2YXIgcGFyZW50SnNvbnBGdW5jdGlvbiA9IG9sZEpzb25wRnVuY3Rpb247XG5cblxuIFx0Ly8gYWRkIGVudHJ5IG1vZHVsZSB0byBkZWZlcnJlZCBsaXN0XG4gXHRkZWZlcnJlZE1vZHVsZXMucHVzaChbXCIuL3RzL2dhbmNsaWVudC50c1wiLFwidmVuZG9yXCJdKTtcbiBcdC8vIHJ1biBkZWZlcnJlZCBtb2R1bGVzIHdoZW4gcmVhZHlcbiBcdHJldHVybiBjaGVja0RlZmVycmVkTW9kdWxlcygpO1xuIiwiLy8gZXh0cmFjdGVkIGJ5IG1pbmktY3NzLWV4dHJhY3QtcGx1Z2luIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW5kZXguaHRtbFwiOyIsIi8qXG5HYW50ZXIgQVBJIGFuZCBUeXBlc1xuICovXG5cbmltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xuaW1wb3J0IFVSTEhhbmRsZXIgZnJvbSBcIi4uL2V0Yy9VUkxIYW5kbGVyXCI7XG5cbmV4cG9ydCB0eXBlIEFibGF0aW9uRGF0YSA9IHtcbiAgICBjaGFubmVsczogeyBkOiBzdHJpbmcsIGlkOiBudW1iZXIgfVtdLFxuICAgIGFibGF0aW9uOiBudW1iZXJbXSB8IG51bGwsXG4gICAgLy8gejogbnVtYmVyW10gfCBudWxsXG59XG5cbmV4cG9ydCB0eXBlIEFibGF0aW9uVXBsb2FkID0ge1xuICAgIGFscGhhOiBudW1iZXIsIGxheWVyOiBzdHJpbmcsIHVuaXQ6IG51bWJlciwgdmFsdWU/OiBudW1iZXJcbn1cblxuZXhwb3J0IHR5cGUgUmVjaXBlID0ge1xuICAgIGxheWVyOiBzdHJpbmcsXG4gICAgbmFtZTogc3RyaW5nLFxuICAgIHVuaXQ6IHsgYWxwaGE6IG51bWJlciwgdW5pdDogbnVtYmVyIH1bXVxufVxuXG5leHBvcnQgdHlwZSBSYW5raW5nID0ge1xuICAgIG1ldHJpYzogc3RyaW5nLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBzY29yZXM6IG51bWJlcltdXG59XG5cblxuZXhwb3J0IHR5cGUgQVBJX1Byb2plY3QgPSB7XG4gICAgcHJvamVjdDogc3RyaW5nXG4gICAgaW5mbzoge1xuICAgICAgICBsYXllcnM6IHN0cmluZ1tdXG4gICAgfVxuXG59XG5cbmV4cG9ydCB0eXBlIEFQSV9BbGxQcm9qZWN0ID0gQVBJX1Byb2plY3RbXVxuZXhwb3J0IHR5cGUgQVBJX0NoYW5uZWxzID0ge1xuICAgIHJlcXVlc3Q6IHsgW2tleTogc3RyaW5nXTogYW55IH0sXG4gICAgcmVzOiBBYmxhdGlvbkRhdGFcbn1cblxuZXhwb3J0IHR5cGUgQVBJX1JlY2lwZXMgPSB7XG4gICAgcmVxdWVzdDogeyBba2V5OiBzdHJpbmddOiBhbnkgfSxcbiAgICByZXM6IFJlY2lwZVtdXG59XG5cbmV4cG9ydCB0eXBlIEFQSV9SYW5raW5ncyA9IHtcbiAgICByZXF1ZXN0OiB7IHByb2plY3Q6IHN0cmluZywgbGF5ZXI6IHN0cmluZyB9LFxuICAgIHJlczogUmFua2luZ1tdXG59XG5cblxuZXhwb3J0IHR5cGUgR0FOVW5pdCA9IHtcbiAgICB1bml0OiBudW1iZXIsIGltZzogc3RyaW5nLCBsYWJlbDogc3RyaW5nXG59XG5leHBvcnQgdHlwZSBBUElfdW5pdHMgPSB7XG4gICAgcmVxdWVzdDogeyBwcm9qZWN0OiBzdHJpbmcsIGxheWVyOiBzdHJpbmcgfSxcbiAgICByZXM6IEdBTlVuaXRbXVxufVxuXG5cbmV4cG9ydCB0eXBlIEFQSV9nZW5lcmF0ZSA9IHtcbiAgICByZXF1ZXN0OiB7XG4gICAgICAgIFwiYWJsYXRpb25zXCI6XG4gICAgICAgICAgICBBYmxhdGlvblVwbG9hZFtdIHwgbnVsbCxcbiAgICAgICAgXCJpZHNcIjogbnVtYmVyW10sXG4gICAgICAgIFwicHJvamVjdFwiOiBzdHJpbmcsXG4gICAgICAgIFwid2FudHpcIjogYm9vbGVhblxuICAgIH0sXG4gICAgcmVzOiB7IGQ6IHN0cmluZywgaWQ/OiBudW1iZXIgfVtdXG59XG5cbmV4cG9ydCB0eXBlIEltYWdlTWFzayA9IHtcbiAgICBpZDogc3RyaW5nLFxuICAgIG1hc2s6IHN0cmluZ1xufVxuXG5leHBvcnQgdHlwZSBBUElfRmVhdHVyZU1hc2sgPSB7XG4gICAgYml0Ym91bmRzOiBudW1iZXJbXSxcbiAgICBiaXRzdHJpbmc6IHN0cmluZyB8IG51bGwsXG4gICAgc2hhcGU6IG51bWJlcltdXG59XG5cbmV4cG9ydCB0eXBlIEFQSV9JbnRlcnZlbnRpb24gPSB7XG4gICAgYWJsYXRpb25zOiBBYmxhdGlvblVwbG9hZFtdLFxuICAgIG1hc2s/OiBBUElfRmVhdHVyZU1hc2tcbn1cblxuXG5leHBvcnQgdHlwZSBBUElfZ2VuRmVhdHVyZXMgPSB7XG4gICAgcmVxdWVzdDoge1xuICAgICAgICBhYmxhdGlvbnM6XG4gICAgICAgICAgICBBYmxhdGlvblVwbG9hZFtdIHwgbnVsbCxcbiAgICAgICAgaWRzOiBudW1iZXJbXSxcbiAgICAgICAgbWFza3M6IHN0cmluZ1tdLFxuICAgICAgICBwcm9qZWN0OiBzdHJpbmcsXG5cbiAgICB9LFxuICAgIHJlczogeyBkOiBzdHJpbmcsIGlkPzogbnVtYmVyIH1bXVxufVxuXG5cbmV4cG9ydCB0eXBlIEFQSV9MZXZlbHMgPSB7XG4gICAgcmVxdWVzdDoge1xuICAgICAgICBsYXllcjogc3RyaW5nLFxuICAgICAgICBwcm9qZWN0OiBzdHJpbmcsXG4gICAgICAgIHF1YW50aWxlczogbnVtYmVyW11cbiAgICB9LFxuICAgIHJlczogbnVtYmVyW11bXVxufVxuXG5leHBvcnQgY2xhc3MgR2FudGVyQVBJIHtcblxuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBiYXNlVVJMOiBzdHJpbmcgPSBudWxsKSB7XG4gICAgICAgIGlmICh0aGlzLmJhc2VVUkwgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5iYXNlVVJMID0gVVJMSGFuZGxlci5iYXNpY1VSTCgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICBhbGxQcm9qZWN0cygpOiBQcm9taXNlPEFQSV9BbGxQcm9qZWN0PiB7XG4gICAgICAgIHJldHVybiBkMy5qc29uKHRoaXMuYmFzZVVSTCArICcvYXBpL2FsbF9wcm9qZWN0cycpXG4gICAgfVxuXG4gICAgYWJsYXRpb25DaGFubmVscyhwcm9qZWN0OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICBsYXllciA9IFwibGF5ZXIyXCIpOiBQcm9taXNlPEFQSV9DaGFubmVscz4ge1xuICAgICAgICByZXR1cm4gZDMuanNvbih0aGlzLmJhc2VVUkwgKyBgL2FwaS9jaGFubmVscz9wcm9qZWN0PSR7cHJvamVjdH0mbGF5ZXI9JHtsYXllcn1gKVxuICAgIH1cblxuICAgIHJlY2lwZXMocHJvamVjdDogc3RyaW5nKTogUHJvbWlzZTxBUElfUmVjaXBlcz4ge1xuICAgICAgICByZXR1cm4gZDMuanNvbih0aGlzLmJhc2VVUkwgKyBgL2FwaS9yZWNpcGVzP3Byb2plY3Q9JHtwcm9qZWN0fWApXG4gICAgfVxuXG4gICAgcmFua2luZ3MocHJvamVjdDogc3RyaW5nLCBsYXllcjogc3RyaW5nKTogUHJvbWlzZTxBUElfUmFua2luZ3M+IHtcbiAgICAgICAgcmV0dXJuIGQzLmpzb24odGhpcy5iYXNlVVJMICsgYC9hcGkvcmFua2luZ3M/cHJvamVjdD0ke3Byb2plY3R9JmxheWVyPSR7bGF5ZXJ9YClcbiAgICB9XG5cblxuICAgIGxldmVscyhwcm9qZWN0OiBzdHJpbmcsIGxheWVyOiBzdHJpbmcsIHE6IG51bWJlciA9IDAuOTkpOiBQcm9taXNlPEFQSV9MZXZlbHM+IHtcbiAgICAgICAgLy8uLi9hcGkvbGV2ZWxzP3Byb2plY3Q9Y2h1cmNob3V0ZG9vciZsYXllcj1sYXllcjQmcXVhbnRpbGVzPTAuOTlcbiAgICAgICAgcmV0dXJuIGQzLmpzb24odGhpcy5iYXNlVVJMICsgYC9hcGkvbGV2ZWxzP3Byb2plY3Q9JHtwcm9qZWN0fSZsYXllcj0ke2xheWVyfSZxdWFudGlsZXM9JHtxfWApXG5cbiAgICB9XG5cblxuICAgIGdlbmVyYXRlSW1ncyhwcm9qZWN0OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgIGlkczogbnVtYmVyW10sXG4gICAgICAgICAgICAgICAgIHdhbnR6ID0gMCxcbiAgICAgICAgICAgICAgICAgYWJsYXRpb25zOiBBYmxhdGlvblVwbG9hZFtdID0gW10pOiBQcm9taXNlPEFQSV9nZW5lcmF0ZT4ge1xuICAgICAgICByZXR1cm4gZDMuanNvbih0aGlzLmJhc2VVUkwgKyAnL2FwaS9nZW5lcmF0ZScsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgXCJhYmxhdGlvbnNcIjogYWJsYXRpb25zLFxuICAgICAgICAgICAgICAgIFwicHJvamVjdFwiOiBwcm9qZWN0LFxuICAgICAgICAgICAgICAgIFwiaWRzXCI6IGlkcyxcbiAgICAgICAgICAgICAgICBcIndhbnR6XCI6IHdhbnR6XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBnZW5lcmF0ZUltZ3NXaXRoUm1DcChwcm9qZWN0OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgaWRzOiBudW1iZXJbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICB3YW50eiA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgYWJsYXRpb25fcm06IEFibGF0aW9uVXBsb2FkW10gPSBbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBhYmxhdGlvbl9jcDogQWJsYXRpb25VcGxvYWRbXSA9IFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tfY3A6IEFQSV9GZWF0dXJlTWFza1xuICAgICk6IFByb21pc2U8QVBJX2dlbmVyYXRlPiB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2VuZXJhdGVJbWdzV2l0aEludGVydmVudGlvbnMoXG4gICAgICAgICAgICBwcm9qZWN0LCBpZHMsIFtcbiAgICAgICAgICAgICAgICB7YWJsYXRpb25zOiBhYmxhdGlvbl9ybX0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBhYmxhdGlvbnM6IGFibGF0aW9uX2NwLFxuICAgICAgICAgICAgICAgICAgICBtYXNrOiBtYXNrX2NwXG4gICAgICAgICAgICAgICAgfV0sIHdhbnR6XG4gICAgICAgIClcblxuICAgICAgICAvLyBjb25zdCBwYXlsb2FkID0ge1xuICAgICAgICAvLyAgICAgLy8gXCJhYmxhdGlvbnNcIjogYWJsYXRpb25zLFxuICAgICAgICAvLyAgICAgXCJwcm9qZWN0XCI6IHByb2plY3QsXG4gICAgICAgIC8vICAgICBcImlkc1wiOiBpZHMsXG4gICAgICAgIC8vICAgICBcIndhbnR6XCI6IHdhbnR6LFxuICAgICAgICAvLyAgICAgXCJpbnRlcnZlbnRpb25zXCI6IFtcbiAgICAgICAgLy8gICAgICAgICB7YWJsYXRpb25zOiBhYmxhdGlvbl9ybX0sXG4gICAgICAgIC8vICAgICAgICAge2FibGF0aW9uczogYWJsYXRpb25fY3AsIG1hc2s6IG1hc2tfY3B9XG4gICAgICAgIC8vICAgICBdXG4gICAgICAgIC8vIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gY29uc29sZS5sb2cocGF5bG9hZCwgXCItLS0gcGF5bG9hZFwiKTtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gcmV0dXJuIGQzLmpzb24odGhpcy5iYXNlVVJMICsgJy9hcGkvZ2VuZXJhdGUnLCB7XG4gICAgICAgIC8vICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAvLyAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZCksXG4gICAgICAgIC8vICAgICBoZWFkZXJzOiB7XG4gICAgICAgIC8vICAgICAgICAgXCJDb250ZW50LXR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PVVURi04XCJcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfSk7XG4gICAgfVxuXG4gICAgZ2VuZXJhdGVJbWdzV2l0aEludGVydmVudGlvbnMoXG4gICAgICAgIHByb2plY3Q6IHN0cmluZyxcbiAgICAgICAgaWRzOiBudW1iZXJbXSxcbiAgICAgICAgaW50ZXJ2ZW50aW9uczogQVBJX0ludGVydmVudGlvbltdLFxuICAgICAgICB3YW50eiA9IDAsXG4gICAgICAgIHJldHVybl91cmxzPTBcbiAgICApOiBQcm9taXNlPEFQSV9nZW5lcmF0ZT4ge1xuXG4gICAgICAgIGNvbnN0IHBheWxvYWQgPSB7XG4gICAgICAgICAgICAvLyBcImFibGF0aW9uc1wiOiBhYmxhdGlvbnMsXG4gICAgICAgICAgICBcInByb2plY3RcIjogcHJvamVjdCxcbiAgICAgICAgICAgIFwiaWRzXCI6IGlkcyxcbiAgICAgICAgICAgIFwid2FudHpcIjogd2FudHosXG4gICAgICAgICAgICBcImludGVydmVudGlvbnNcIjogaW50ZXJ2ZW50aW9ucyxcbiAgICAgICAgICAgIFwicmV0dXJuX3VybHNcIjpyZXR1cm5fdXJsc1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2cocGF5bG9hZCwgXCItLS0gcGF5bG9hZFwiKTtcblxuICAgICAgICByZXR1cm4gZDMuanNvbih0aGlzLmJhc2VVUkwgKyAnL2FwaS9nZW5lcmF0ZScsIHtcbiAgICAgICAgICAgIG1ldGhvZDogXCJQT1NUXCIsXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShwYXlsb2FkKSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgfVxuXG5cbiAgICB1bml0cyhwcm9qZWN0OiBzdHJpbmcsIGxheWVyOiBzdHJpbmcpOiBQcm9taXNlPEFQSV91bml0cz4ge1xuICAgICAgICByZXR1cm4gZDMuanNvbih0aGlzLmJhc2VVUkwgKyBgL2FwaS91bml0cz9wcm9qZWN0PSR7cHJvamVjdH0mbGF5ZXI9JHtsYXllcn1gKVxuICAgIH1cblxuXG4gICAgZ2VuZXJhdGVGZWF0dXJlcyhwcm9qZWN0OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICBpbWFza3M6IEltYWdlTWFza1tdLFxuICAgICAgICAgICAgICAgICAgICAgbGF5ZXJzOiBzdHJpbmdbXSxcbiAgICAgICAgICAgICAgICAgICAgIGFibGF0aW9uczogQWJsYXRpb25VcGxvYWRbXSA9IFtdKTogUHJvbWlzZTxBUElfZ2VuRmVhdHVyZXM+IHtcbiAgICAgICAgLypcbiAgICAgICAgcHJvamVjdCA9IGZlYXRfcmVxWydwcm9qZWN0J11cbiAgICAgICAgaWRzID0gZmVhdF9yZXFbJ2lkcyddXG4gICAgICAgIG1hc2tzID0gZmVhdF9yZXEuZ2V0KCdtYXNrcycsIE5vbmUpXG4gICAgICAgIGxheWVycyA9IGZlYXRfcmVxLmdldCgnbGF5ZXJzJywgTm9uZSlcbiAgICAgICAgYWJsYXRpb25zID0gZmVhdF9yZXEuZ2V0KCdhYmxhdGlvbnMnLCBbXSlcbiAgICAgICAgKi9cblxuXG4gICAgICAgIGNvbnN0IGlkcyA9IGltYXNrcy5tYXAoZCA9PiBkLmlkKTtcbiAgICAgICAgY29uc3QgbWFza3MgPSBpbWFza3MubWFwKGQgPT4gKHtcbiAgICAgICAgICAgIHNoYXBlOiBbXSxcbiAgICAgICAgICAgIGJpdGJvdW5kczogW10sXG4gICAgICAgICAgICBiaXRzdHJpbmc6IGQubWFza1xuICAgICAgICB9KSk7XG5cbiAgICAgICAgcmV0dXJuIGQzLmpzb24odGhpcy5iYXNlVVJMICsgJy9hcGkvZmVhdHVyZXMnLCB7XG4gICAgICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIGFibGF0aW9ucyxcbiAgICAgICAgICAgICAgICBwcm9qZWN0LFxuICAgICAgICAgICAgICAgIGlkcyxcbiAgICAgICAgICAgICAgICBtYXNrcyxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgIFwiQ29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD1VVEYtOFwiXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG5cbiAgICB9XG5cblxuICAgIGdlbmVyYXRlRmVhdHVyZXNMb2NhbChwcm9qZWN0OiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGlkczogbnVtYmVyW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGxheWVyczogc3RyaW5nW10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIG1hc2tzOiBBUElfRmVhdHVyZU1hc2tbXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWJsYXRpb25zOiBBYmxhdGlvblVwbG9hZFtdID0gW10pOiBQcm9taXNlPEFQSV9nZW5GZWF0dXJlcz4ge1xuICAgICAgICAvKlxuICAgICAgICBwcm9qZWN0ID0gZmVhdF9yZXFbJ3Byb2plY3QnXVxuICAgICAgICBpZHMgPSBmZWF0X3JlcVsnaWRzJ11cbiAgICAgICAgbWFza3MgPSBmZWF0X3JlcS5nZXQoJ21hc2tzJywgTm9uZSlcbiAgICAgICAgbGF5ZXJzID0gZmVhdF9yZXEuZ2V0KCdsYXllcnMnLCBOb25lKVxuICAgICAgICBhYmxhdGlvbnMgPSBmZWF0X3JlcS5nZXQoJ2FibGF0aW9ucycsIFtdKVxuICAgICAgICAqL1xuXG5cbiAgICAgICAgLy8gY29uc3QgaWRzID0gaW1hc2tzLm1hcChkID0+IGQuaWQpO1xuICAgICAgICAvLyBjb25zdCBtYXNrcyA9IGltYXNrcy5tYXAoZCA9PiAoe1xuICAgICAgICAvLyAgICAgc2hhcGU6IFtdLFxuICAgICAgICAvLyAgICAgYml0Ym91bmRzOiBbXSxcbiAgICAgICAgLy8gICAgIGJpdHN0cmluZzogZC5tYXNrXG4gICAgICAgIC8vIH0pKTtcblxuICAgICAgICBtYXNrcy5mb3JFYWNoKG1hc2sgPT4ge1xuICAgICAgICAgICAgaWYgKG1hc2suYml0c3RyaW5nID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBiYiA9IG1hc2suYml0Ym91bmRzO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJpdHMgPSAoYmJbMl0gLSBiYlswXSkgKiAoYmJbM10gLSBiYlsxXSk7XG4gICAgICAgICAgICAgICAgbWFzay5iaXRzdHJpbmcgPSAnMScucmVwZWF0KGJpdHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIHJldHVybiBkMy5qc29uKHRoaXMuYmFzZVVSTCArICcvYXBpL2ZlYXR1cmVzJywge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBhYmxhdGlvbnMsXG4gICAgICAgICAgICAgICAgcHJvamVjdCxcbiAgICAgICAgICAgICAgICBpZHMsXG4gICAgICAgICAgICAgICAgbWFza3MsXG4gICAgICAgICAgICAgICAgbGF5ZXJzXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9VVRGLThcIlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgfVxuXG59XG5cbiIsImltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiXG5cbi8qKlxuICogQ3JlYXRlZCBieSBoZW4gb24gNS8xNS8xNy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNWRyB7XG4gICAgc3RhdGljIHRyYW5zbGF0ZSh7eCwgeX0pIHtcbiAgICAgICAgcmV0dXJuIFwidHJhbnNsYXRlKFwiICsgeCArIFwiLFwiICsgeSArIFwiKVwiXG4gICAgfVxuXG4gICAgc3RhdGljIGdyb3VwKHBhcmVudCwgY2xhc3NlcywgcG9zID0ge3g6IDAsIHk6IDB9KSB7XG4gICAgICAgIHJldHVybiBwYXJlbnQuYXBwZW5kKCdnJykuYXR0cnMoe1xuICAgICAgICAgICAgY2xhc3M6IGNsYXNzZXMsXG4gICAgICAgICAgICBcInRyYW5zZm9ybVwiOiBTVkcudHJhbnNsYXRlKHBvcylcbiAgICAgICAgfSlcbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFNWR01lYXN1cmVtZW50cyB7XG5cbiAgICBwcml2YXRlIG1lYXN1cmVFbGVtZW50OiBkMy5TZWxlY3Rpb248YW55LCBhbnksIGFueSwgYW55PjtcblxuICAgIGNvbnN0cnVjdG9yKGJhc2VFbGVtZW50LCBjbGFzc2VzID0gJycpIHtcbiAgICAgICAgdGhpcy5tZWFzdXJlRWxlbWVudCA9IGJhc2VFbGVtZW50LmFwcGVuZCgndGV4dCcpXG4gICAgICAgICAgICAuYXR0cnMoe3g6IDAsIHk6IC0yMCwgY2xhc3M6IGNsYXNzZXN9KVxuXG4gICAgfVxuXG4gICAgdGV4dExlbmd0aCh0ZXh0LCBzdHlsZSA9IG51bGwpIHtcbiAgICAgICAgdGhpcy5tZWFzdXJlRWxlbWVudC5hdHRyKCdzdHlsZScsIHN0eWxlKTtcbiAgICAgICAgdGhpcy5tZWFzdXJlRWxlbWVudC50ZXh0KHRleHQpO1xuICAgICAgICBjb25zdCB0bCA9ICg8U1ZHVGV4dEVsZW1lbnQ+IHRoaXMubWVhc3VyZUVsZW1lbnQubm9kZSgpKS5nZXRDb21wdXRlZFRleHRMZW5ndGgoKTtcbiAgICAgICAgdGhpcy5tZWFzdXJlRWxlbWVudC50ZXh0KCcnKTtcblxuICAgICAgICByZXR1cm4gdGw7XG4gICAgfVxufSIsIi8qKlxuICogQ3JlYXRlZCBieSBoZW4gb24gNS8xNS8xNy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNpbXBsZUV2ZW50SGFuZGxlciB7XG5cbiAgICBlbGVtZW50OiBFbGVtZW50O1xuICAgIGV2ZW50TGlzdGVuZXJzOiBvYmplY3RbXTtcblxuXG4gICAgY29uc3RydWN0b3IoZWxlbWVudDogRWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLmV2ZW50TGlzdGVuZXJzID0gW11cbiAgICB9XG5cblxuICAgIGJpbmQoZXZlbnROYW1lczogc3RyaW5nLCBldmVudEZ1bmN0aW9uOiBGdW5jdGlvbikge1xuICAgICAgICBmb3IgKGNvbnN0IGV2ZW50TmFtZSBvZiBldmVudE5hbWVzLnNwbGl0KCcgJykpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRMaXN0ZW5lcnMucHVzaCh7ZXZlbnROYW1lLCBldmVudEZ1bmN0aW9ufSk7XG4gICAgICAgICAgICBjb25zdCBldmVudEZ1bmN0aW9uV3JhcCA9IGUgPT4gZXZlbnRGdW5jdGlvbihlLmRldGFpbCwgZSk7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGV2ZW50RnVuY3Rpb25XcmFwLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRMaXN0ZW5lcnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIHRyaWdnZXIoZXZlbnROYW1lOiBzdHJpbmcsIGRldGFpbDogb2JqZWN0KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudE5hbWUsIHtkZXRhaWx9KSk7XG4gICAgfVxuXG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IGhlbiBvbiA1LzE1LzE3LlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVSTEhhbmRsZXIge1xuXG4gICAgc3RhdGljIGJhc2ljVVJMKCkge1xuICAgICAgICBjb25zdCB1cmxfcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5zcGxpdCgnLycpLnNsaWNlKDAsIC0yKS5qb2luKCcvJyk7XG5cbiAgICAgICAgcmV0dXJuIHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAodXJsX3BhdGgubGVuZ3RoID8gdXJsX3BhdGggOiAnJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmVhZCBhbGwgVVJMIHBhcmFtZXRlcnMgaW50byBhIG1hcC5cbiAgICAgKiBAcmV0dXJucyB7TWFwfSB0aGUgdXJsIHBhcmFtZXRlcnMgYXMgYSBrZXktdmFsdWUgc3RvcmUgKEVTNiBtYXApXG4gICAgICovXG4gICAgc3RhdGljIGdldCBwYXJhbWV0ZXJzKCk6IG9iamVjdCB7XG4gICAgICAgIC8vIEFkYXB0ZWQgZnJvbTogIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMjA5MDU1MS9wYXJzZS1xdWVyeS1zdHJpbmctaW4tamF2YXNjcmlwdFxuICAgICAgICBjb25zdCBxdWVyeSA9IHdpbmRvdy5sb2NhdGlvbi5zZWFyY2guc3Vic3RyaW5nKDEpO1xuICAgICAgICBjb25zdCB2YXJzID0gcXVlcnkuc3BsaXQoJyYnKTtcbiAgICAgICAgY29uc29sZS5sb2codmFycywgXCItLS0gdmFyc1wiKTtcblxuICAgICAgICBjb25zdCB1cmxQYXJhbWV0ZXJzID0ge307XG5cbiAgICAgICAgY29uc3QgaXNJbnQgPSB4ID0+ICgvXlswLTldKyQvKS50ZXN0KHgpO1xuICAgICAgICBjb25zdCBpc0Zsb2F0ID0geCA9PiAoL15bMC05XStcXC5bMC05XSokLykudGVzdCh4KTtcblxuICAgICAgICBjb25zdCB0eXBlQ2FzdCA9IHZhbCA9PiB7XG4gICAgICAgICAgICBpZiAoaXNJbnQodmFsKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIucGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlzRmxvYXQodmFsKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIucGFyc2VGbG9hdCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gZWxzZTpcbiAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgIH1cblxuXG4gICAgICAgIHZhcnMuZm9yRWFjaCh2ID0+IHtcbiAgICAgICAgICAgIGlmICh2Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzcGxpdHMgPSB2LnNwbGl0KCc9Jyk7XG4gICAgICAgICAgICAgICAgY29uc3Qga2V5ID0gZGVjb2RlVVJJQ29tcG9uZW50KHNwbGl0c1swXSk7XG4gICAgICAgICAgICAgICAgbGV0IHJhd192YWx1ZSA9IGRlY29kZVVSSUNvbXBvbmVudChzcGxpdHNbMV0pO1xuXG4gICAgICAgICAgICAgICAgY29uc3QgaXNBcnJheSA9IHJhd192YWx1ZS5zdGFydHNXaXRoKCcuLicpO1xuICAgICAgICAgICAgICAgIGlmIChpc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHJhd192YWx1ZSA9IHJhd192YWx1ZS5zbGljZSgyKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAocmF3X3ZhbHVlLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgdXJsUGFyYW1ldGVyc1trZXldID0gaXNBcnJheSA/IFtdIDogJyc7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgICAgIHVybFBhcmFtZXRlcnNba2V5XSA9IHJhd192YWx1ZS5zcGxpdCgnLCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAubWFwKHZhbCA9PiB0eXBlQ2FzdCh2YWwpKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB1cmxQYXJhbWV0ZXJzW2tleV0gPSB0eXBlQ2FzdChyYXdfdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHVybFBhcmFtZXRlcnM7XG5cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhbiBVUkwgc3RyaW5nIGZyb20gYSBtYXAgb2YgdXJsIHBhcmFtZXRlcnNcbiAgICAgKiBAcGFyYW0ge3t9fSB1cmxQYXJhbWV0ZXJzIC0gdGhlIG1hcCBvZiBwYXJhbWV0ZXJzXG4gICAgICogQHJldHVybnMge3N0cmluZ30gLSBhbiBVUkkgc3RyaW5nXG4gICAgICovXG4gICAgc3RhdGljIHVybFN0cmluZyh1cmxQYXJhbWV0ZXJzOiBvYmplY3QpIHtcbiAgICAgICAgY29uc3QgYXR0ciA9IFtdO1xuICAgICAgICBPYmplY3Qua2V5cyh1cmxQYXJhbWV0ZXJzKS5mb3JFYWNoKGsgPT4ge1xuICAgICAgICAgICAgY29uc3QgdiA9IHVybFBhcmFtZXRlcnNba107XG4gICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlID0gdjtcbiAgICAgICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkgdmFsdWUgPSAnLi4nICsgdi5qb2luKCcsJyk7XG4gICAgICAgICAgICAgICAgYXR0ci5wdXNoKGVuY29kZVVSSShrICsgJz0nICsgdmFsdWUpKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuXG4gICAgICAgIGNvbnN0IHVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICAgICAgbGV0IHJlcyA9IHVybC5zdWJzdHJpbmcodXJsLmxhc3RJbmRleE9mKCcvJykgKyAxKTtcbiAgICAgICAgaWYgKGF0dHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzICs9ICc/JyArIGF0dHIuam9pbignJicpXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzO1xuICAgIH1cblxuICAgIHN0YXRpYyB1cGRhdGVVUkxQYXJhbShrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IGFueVtdLCBhZGRUb0Jyb3dzZXJIaXN0b3J5ID0gdHJ1ZSkge1xuICAgICAgICBjb25zdCBjdXJyZW50UGFyYW1zID0gVVJMSGFuZGxlci5wYXJhbWV0ZXJzO1xuICAgICAgICBjdXJyZW50UGFyYW1zW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgVVJMSGFuZGxlci51cGRhdGVVcmwoY3VycmVudFBhcmFtcywgYWRkVG9Ccm93c2VySGlzdG9yeSk7XG4gICAgfVxuXG4gICAgLy8gLyoqXG4gICAgLy8gICogR2VuZXJhdGVzIGEga2V5LXZhbHVlIG1hcCBvZiBhbGwgVVJMIHBhcmFtcyBhbmQgcmVwbGFjZXMgcmVwbGFjZUtleXNcbiAgICAvLyAgKiBAcGFyYW0gdXBkYXRlS2V5c1xuICAgIC8vICAqL1xuICAgIC8vIHN0YXRpYyB1cGRhdGVVUkxQYXJhbXModXBkYXRlS2V5cykge1xuICAgIC8vICAgICBjb25zdCBjdXJyZW50UGFyYW1zID0gVVJMSGFuZGxlci5wYXJhbWV0ZXJzO1xuICAgIC8vICAgICBPYmplY3Qua2V5cyh1cGRhdGVLZXlzKS5mb3JFYWNoKChrKSA9PiBjdXJyZW50UGFyYW1zW2tdID0gdXBkYXRlS2V5c1trXSlcbiAgICAvLyAgICAgcmV0dXJuIGN1cnJlbnRQYXJhbXM7XG4gICAgLy8gfVxuXG5cbiAgICBzdGF0aWMgdXBkYXRlVXJsKHVybFBhcmFtZXRlcnM6IG9iamVjdCwgYWRkVG9Ccm93c2VySGlzdG9yeSA9IHRydWUpIHtcbiAgICAgICAgaWYgKGFkZFRvQnJvd3Nlckhpc3RvcnkpIHtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSh1cmxQYXJhbWV0ZXJzLCAnJyxcbiAgICAgICAgICAgICAgICBVUkxIYW5kbGVyLnVybFN0cmluZyh1cmxQYXJhbWV0ZXJzKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSh1cmxQYXJhbWV0ZXJzLCAnJyxcbiAgICAgICAgICAgICAgICBVUkxIYW5kbGVyLnVybFN0cmluZyh1cmxQYXJhbWV0ZXJzKSlcbiAgICAgICAgfVxuICAgIH1cblxufSIsImltcG9ydCAqIGFzIGQzIGZyb20gXCJkM1wiO1xuXG4vKipcbiAqIENyZWF0ZWQgYnkgaGVuIG9uIDUvMTUvMTcuXG4gKi9cbmxldCB0aGVfdW5pcXVlX2lkX2NvdW50ZXIgPSAwO1xuXG5leHBvcnQgY2xhc3MgVXRpbCB7XG4gICAgc3RhdGljIHNpbXBsZVVJZCh7cHJlZml4ID0gJyd9KTogc3RyaW5nIHtcbiAgICAgICAgdGhlX3VuaXF1ZV9pZF9jb3VudGVyICs9IDE7XG5cbiAgICAgICAgcmV0dXJuIHByZWZpeCArIHRoZV91bmlxdWVfaWRfY291bnRlcjtcbiAgICB9XG59XG5cbmV4cG9ydCB0eXBlIEQzU2VsID0gZDMuU2VsZWN0aW9uPGFueSwgYW55LCBhbnksIGFueT5cblxuZXhwb3J0IGZ1bmN0aW9uIGFyZ3NvcnQoYXJyYXksIHNvcnRGY3QpOm51bWJlcltdIHtcbiAgICByZXR1cm4gYXJyYXlcbiAgICAgICAgLm1hcCgoZCwgaSkgPT4gW2QsIGldKVxuICAgICAgICAuc29ydCgoYSxiKSA9PiBzb3J0RmN0KGFbMF0sIGJbMF0pKVxuICAgICAgICAubWFwKGQgPT4gZFsxXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShlbmQpe1xuICAgIHJldHVybiBbLi4uQXJyYXkoZW5kKS5rZXlzKCldXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBvYmpfdG9fYXJyKG9iajpvYmplY3Qpe1xuICAgIGNvbnN0IHNvcnRlZEtleXMgPSBPYmplY3Qua2V5cyhvYmopLnNvcnQoKTtcbiAgICBjb25zdCByZXM9W107XG4gICAgc29ydGVkS2V5cy5mb3JFYWNoKGsgPT4ge3Jlcy5wdXNoKGspOyByZXMucHVzaChvYmpba10pfSlcbiAgICByZXR1cm4gcmVzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXJyX3RvX29iaihhcnI6YW55KXtcbiAgICBjb25zdCByZXM9e307XG4gICAgY29uc3QgbWF4X2wgPSBNYXRoLmZsb29yKGFyci5sZW5ndGgvMik7XG4gICAgZm9yIChsZXQgaSA9IDA7IGk8bWF4X2w7IGkrKyl7XG4gICAgICAgIHJlc1thcnJbMippXV0gPSBhcnJbMippKzFdO1xuICAgIH1cbiAgICByZXR1cm4gcmVzO1xufSIsImltcG9ydCAqIGFzIGQzIGZyb20gJ2QzJ1xuaW1wb3J0IHticnVzaH0gZnJvbSAnZDMnXG5pbXBvcnQgXCJkMy1zZWxlY3Rpb24tbXVsdGlcIjtcblxuaW1wb3J0ICcuLi9jc3MvZ2FuY2xpZW50LnNjc3MnXG4vLyBpbXBvcnQgJy4uL25vZGVfbW9kdWxlcy9mb250LWF3ZXNvbWUvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzJ1xuaW1wb3J0IFwiIWZpbGUtbG9hZGVyP25hbWU9aW5kZXguaHRtbCEuLi9pbmRleC5odG1sXCI7XG5pbXBvcnQge1NpbXBsZUV2ZW50SGFuZGxlcn0gZnJvbSBcIi4vZXRjL1NpbXBsZUV2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHtcbiAgICBBYmxhdGlvblVwbG9hZCxcbiAgICBBUElfUHJvamVjdCxcbiAgICBHYW50ZXJBUEksIEltYWdlTWFzayxcbiAgICBSYW5raW5nLFxuICAgIFJlY2lwZVxufSBmcm9tIFwiLi9hcGkvR2FudGVyQVBJXCI7XG5pbXBvcnQge2FyZ3NvcnR9IGZyb20gXCIuL2V0Yy9VdGlsXCI7XG5pbXBvcnQge1BhaW50U2VsZWN0Vmlld30gZnJvbSBcIi4vdmlzL1BhaW50U2VsZWN0Vmlld1wiO1xuaW1wb3J0IFVSTEhhbmRsZXIgZnJvbSBcIi4vZXRjL1VSTEhhbmRsZXJcIjtcblxuXG50eXBlIFByb2plY3RNYXAgPSB7XG4gICAgW2tleTogc3RyaW5nXTogQVBJX1Byb2plY3Rcbn07XG5cbnR5cGUgUmVjaXBlTWFwID0ge1xuICAgIFtrZXk6IHN0cmluZ106IFJhbmtpbmdcbn1cblxuY29uc3QgZXZlbnRzID0ge1xuICAgIHBpY2tpbmc6ICdwaWNraW5nJyxcbiAgICBkcm9wcGluZzogJ2Ryb3BwaW5nJ1xuXG59O1xuXG5jb25zdCBjdXJyZW50ID0ge1xuICAgIHNpZGViYXI6IHtcbiAgICAgICAgd2lkdGg6IDQwMCxcbiAgICAgICAgdmlzaWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgaW1hZ2U6IHtcbiAgICAgICAgc2l6ZTogMzAwXG4gICAgfSxcbiAgICBwcm9qZWN0czogPFByb2plY3RNYXA+e30sXG4gICAgcmVjaXBlczoge1xuICAgICAgICBhYmxhdGlvbjogPFJlY2lwZU1hcD57fSxcbiAgICAgICAgY29weTogPFJlY2lwZU1hcD57fSxcbiAgICAgICAgY29weV92YWx1ZXM6IDxudW1iZXJbXT4gW11cbiAgICB9LFxuICAgIHVuaXRfc29ydGluZzoge1xuICAgICAgICAvLyBhYmxhdGlvbjogPG51bWJlcltdPm51bGwsXG4gICAgICAgIGNvcHk6IDx7IFtrZXk6IHN0cmluZ106IG51bWJlcltdIH0+bnVsbFxuICAgIH0sXG4gICAgcGljazoge1xuICAgICAgICBzZWxlY3Rpb246IFtbMCwgMF0sIFswLCAwXV0sXG4gICAgICAgIGlkOiAtMSxcbiAgICAgICAgYWJsYXRlZDogZmFsc2VcbiAgICB9XG5cbn07XG5cbmNsYXNzIEhlbHBlciB7XG5cbiAgICBzdGF0aWMgdXBkYXRlX3NlbGVjdG9yKHNlbGVjdG9yLCBlbnRyaWVzKSB7XG4gICAgICAgIGxldCByZWNfb3AgPSBzZWxlY3Rvci5zZWxlY3RBbGwoJ29wdGlvbicpLmRhdGEoZW50cmllcyk7XG4gICAgICAgIHJlY19vcC5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgIHJlY19vcC5lbnRlcigpLmFwcGVuZCgnb3B0aW9uJylcbiAgICAgICAgICAgIC5tZXJnZShyZWNfb3ApXG4gICAgICAgICAgICAuYXR0cigndmFsdWUnLCBkID0+IGQpXG4gICAgICAgICAgICAudGV4dChkID0+IGQpO1xuICAgIH07XG5cblxuICAgIHN0YXRpYyBzZWxlY3Rvcl9vbl9jaGFuZ2Vfb3JfZW50ZXIoc2VsZWN0b3IsIGYpIHtcbiAgICAgICAgc2VsZWN0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgICAgIGYoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2VsZWN0b3Iub24oJ2tleXByZXNzJywgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGQzLmV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgICAgICAgICBmKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG59XG5cblxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgICBjb25zdCBzaWRlX2JhciA9IGQzLnNlbGVjdChcIi5zaWRlX2JhclwiKTtcbiAgICBzaWRlX2Jhci5zdHlsZSgnd2lkdGgnLCBgJHtjdXJyZW50LnNpZGViYXIud2lkdGh9cHhgKTtcblxuICAgIGNvbnN0IGV2ZW50SGFuZGxlciA9IG5ldyBTaW1wbGVFdmVudEhhbmRsZXIoPEVsZW1lbnQ+ZDMuc2VsZWN0KCdib2R5Jykubm9kZSgpKTtcblxuICAgIGNvbnN0IGFwaV9wcmVmaXggPSBVUkxIYW5kbGVyLnBhcmFtZXRlcnNbJ2FwaSddIHx8ICcnO1xuICAgIGNvbnN0IGFwaSA9IG5ldyBHYW50ZXJBUEkoYXBpX3ByZWZpeCk7XG5cbiAgICAvKlxuICAgICpcbiAgICAqID09PT0gVmFyaWFibGVzIGFuZCBBY2Nlc29yc1xuICAgICpcbiAgICAqICovXG5cblxuICAgIC8qXG4gICAgKlxuICAgICogUHJvamVjdCBhbmQgTGF5ZXIgU2VsZWN0aW9uXG4gICAgKlxuICAgICogKi9cblxuICAgIGNvbnN0IGRzX3NlbGVjdG9yID0gZDMuc2VsZWN0KCcjcHJvamVjdF9zZWxlY3RvcicpO1xuICAgIGNvbnN0IGxheWVyX3NlbGVjdG9yID0gZDMuc2VsZWN0KCcjbGF5ZXJfc2VsZWN0b3InKTtcbiAgICBjb25zdCByZWNpcGVfYWJsYXRpb25fc2VsZWN0b3IgPSBkMy5zZWxlY3QoJyNyZWNpcGVfc2VsZWN0X2FibGF0aW9uJyk7XG4gICAgY29uc3QgcmVjaXBlX2NvcHlfc2VsZWN0b3IgPSBkMy5zZWxlY3QoJyNyZWNpcGVfc2VsZWN0X2NvcHknKTtcblxuICAgIGNvbnN0IHNlbF9wcm9qZWN0ID0gKCkgPT4gY3VycmVudC5wcm9qZWN0c1tkc19zZWxlY3Rvci5wcm9wZXJ0eSgndmFsdWUnKV07XG4gICAgY29uc3Qgc2VsX2xheWVyID0gKCkgPT4gPHN0cmluZz5sYXllcl9zZWxlY3Rvci5wcm9wZXJ0eSgndmFsdWUnKTtcbiAgICBjb25zdCBzZWxfd2F0Y2ggPSAoKSA9PiBkMy5zZWxlY3QoJy53YXRjaC5zZWxlY3RlZCcpXG4gICAgICAgIC5hdHRyKCdpZCcpLnNwbGl0KCdfJylbMV07XG5cblxuICAgIGNvbnN0IGFibGF0aW9uX3ZhbHVlcyA9IChyZWNpcGUpID0+IGN1cnJlbnQucmVjaXBlcy5hYmxhdGlvbltyZWNpcGVdLnNjb3JlcztcblxuXG5cbiAgICBmdW5jdGlvbiBzZXR1cF9wcm9qZWN0X2xheWVyKCkge1xuXG5cbiAgICAgICAgY29uc3QgdXBkYXRlUHJvamVjdFNlbGVjdG9yID0gKCkgPT4ge1xuICAgICAgICAgICAgLy8gY29uc3QgZHMgPSBkc19zZWxlY3Rvci5wcm9wZXJ0eSgndmFsdWUnKTtcbiAgICAgICAgICAgIGNvbnN0IHByb2plY3QgPSBzZWxfcHJvamVjdCgpO1xuICAgICAgICAgICAgLy8gZDMuc2VsZWN0KCcjcmF3X2NvZGUnKVxuICAgICAgICAgICAgLy8gICAgIC50ZXh0KEpTT04uc3RyaW5naWZ5KGN1cnJlbnQucHJvamVjdHNbZHNdLCBudWxsLCAyKSlcbiAgICAgICAgICAgIGNvbnN0IGxheWVycyA9IGxheWVyX3NlbGVjdG9yLnNlbGVjdEFsbCgnb3B0aW9uJylcbiAgICAgICAgICAgICAgICAuZGF0YShwcm9qZWN0LmluZm8ubGF5ZXJzKTtcbiAgICAgICAgICAgIGxheWVycy5leGl0KCkucmVtb3ZlKCk7XG4gICAgICAgICAgICBsYXllcnMuZW50ZXIoKS5hcHBlbmQoJ29wdGlvbicpXG4gICAgICAgICAgICAgICAgLm1lcmdlKGxheWVycylcbiAgICAgICAgICAgICAgICAuYXR0cigndmFsdWUnLCBkID0+IGQpXG4gICAgICAgICAgICAgICAgLmF0dHIoJ3NlbGVjdGVkJywgZCA9PiBkLm1hdGNoKC80JC9nKSA/IHRydWUgOiBudWxsKSAvLyBmb3IgZGVtb1xuICAgICAgICAgICAgICAgIC50ZXh0KGQgPT4gZClcblxuXG4gICAgICAgICAgICB1cGRhdGVSZWNpcGVMaXN0KCk7XG4gICAgICAgIH07XG5cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVSZWNpcGVMaXN0KCkge1xuICAgICAgICAgICAgY3VycmVudC5yZWNpcGVzLmFibGF0aW9uID0ge307XG5cbiAgICAgICAgICAgIGFwaS5yYW5raW5ncyhzZWxfcHJvamVjdCgpLnByb2plY3QsIHNlbF9sYXllcigpKVxuICAgICAgICAgICAgICAgIC50aGVuKHJhbmtzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmFua3MsIFwiLS0tIHJlY2lwZXNcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgbmFtZXMgPSByYW5rcy5yZXMubWFwKGQgPT4gZC5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgSGVscGVyLnVwZGF0ZV9zZWxlY3RvcihyZWNpcGVfYWJsYXRpb25fc2VsZWN0b3IsIG5hbWVzKTtcbiAgICAgICAgICAgICAgICAgICAgSGVscGVyLnVwZGF0ZV9zZWxlY3RvcihyZWNpcGVfY29weV9zZWxlY3RvciwgbmFtZXMpO1xuXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQucmVjaXBlcy5hYmxhdGlvbiA9IHt9O1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50LnJlY2lwZXMuY29weSA9IHt9O1xuICAgICAgICAgICAgICAgICAgICByYW5rcy5yZXMuZm9yRWFjaChyYW5rID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQucmVjaXBlcy5hYmxhdGlvbltyYW5rLm5hbWVdID0gcmFuaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnQucmVjaXBlcy5jb3B5W3JhbmsubmFtZV0gPSByYW5rO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICB1cGRhdGVfdW5pdHMoKTtcbiAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBhcGkubGV2ZWxzKHNlbF9wcm9qZWN0KCkucHJvamVjdCwgc2VsX2xheWVyKCkpXG4gICAgICAgICAgICAgICAgLnRoZW4obGV2ZWxfcmVxID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudC5yZWNpcGVzLmNvcHlfdmFsdWVzID0gbGV2ZWxfcmVxLnJlc1xuICAgICAgICAgICAgICAgICAgICAgICAgLm1hcChsZXZlbHMgPT4gbGV2ZWxzWzBdKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICB9XG5cblxuXG5cbiAgICAgICAgYXBpLmFsbFByb2plY3RzKCkudGhlbigocHJvamVjdHMpID0+IHtcblxuICAgICAgICAgICAgcHJvamVjdHMuZm9yRWFjaChwID0+IGN1cnJlbnQucHJvamVjdHNbcC5wcm9qZWN0XSA9IHApO1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSBkc19zZWxlY3RvclxuICAgICAgICAgICAgICAgIC5zZWxlY3RBbGwoJ29wdGlvbicpLmRhdGEocHJvamVjdHMubWFwKHAgPT4gcC5wcm9qZWN0KSk7XG4gICAgICAgICAgICBvcHRpb25zLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIG9wdGlvbnMuZW50ZXIoKS5hcHBlbmQoJ29wdGlvbicpXG4gICAgICAgICAgICAgICAgLm1lcmdlKG9wdGlvbnMpLmF0dHIoJ3ZhbHVlJywgZCA9PiBkKS50ZXh0KGQgPT4gZCk7XG5cbiAgICAgICAgICAgIHVwZGF0ZVByb2plY3RTZWxlY3RvcigpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGRzX3NlbGVjdG9yLm9uKCdjaGFuZ2UnLCBkID0+IHtcbiAgICAgICAgICAgIHVwZGF0ZVByb2plY3RTZWxlY3RvcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXR1cF9wcm9qZWN0X2xheWVyKCk7XG5cblxuICAgIC8qXG4gICAgKlxuICAgICogPT09PT0gUkVDSVBFUyBhbmQgVU5JVFMgPT09PT09XG4gICAgKlxuICAgICogKi9cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZV91bml0c19hYmxhdGlvbigpIHtcbiAgICAgICAgY29uc3Qgcl9zdHJpbmc6IHN0cmluZyA9IHJlY2lwZV9hYmxhdGlvbl9zZWxlY3Rvci5wcm9wZXJ0eSgndmFsdWUnKTtcbiAgICAgICAgY29uc3QgbGFiZWxfcHJlZml4ID0gcl9zdHJpbmcuc3BsaXQoJy0nKVswXTtcbiAgICAgICAgdXBkYXRlX3VuaXRfaW1hZ2VzKFxuICAgICAgICAgICAgYWJsYXRpb25fdmFsdWVzKHJfc3RyaW5nKSxcbiAgICAgICAgICAgIGxhYmVsX3ByZWZpeFxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZV91bml0c19jb3B5KCkge1xuICAgICAgICBjb25zdCByX3N0cmluZzogc3RyaW5nID0gcmVjaXBlX2NvcHlfc2VsZWN0b3IucHJvcGVydHkoJ3ZhbHVlJyk7XG4gICAgICAgIGNvbnN0IGxhYmVsX3ByZWZpeCA9IHJfc3RyaW5nLnNwbGl0KCctJylbMF07XG4gICAgICAgIHVwZGF0ZV91bml0X2ltYWdlcyhcbiAgICAgICAgICAgIGFibGF0aW9uX3ZhbHVlcyhyX3N0cmluZyksXG4gICAgICAgICAgICBsYWJlbF9wcmVmaXhcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICByZWNpcGVfYWJsYXRpb25fc2VsZWN0b3Iub24oJ2NoYW5nZScsICgpID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coc2VsX3dhdGNoKCksIFwiLS0tIHNlbF93YXRjaCgpXCIpO1xuICAgICAgICAvLyBpZiAoJ2FibGF0aW9uJyA9PT0gc2VsX3dhdGNoKCkpIHVwZGF0ZV91bml0c19hYmxhdGlvbigpO1xuICAgICAgICB1cGRhdGVfdW5pdHMoKTtcbiAgICAgICAgdXBkYXRlSW1hZ2VzKCk7XG4gICAgfSk7XG5cbiAgICByZWNpcGVfY29weV9zZWxlY3Rvci5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICAvLyBpZiAoJ2NvcHknID09PSBzZWxfd2F0Y2goKSkgdXBkYXRlX3VuaXRzX2NvcHkoKTtcbiAgICAgICAgdXBkYXRlX3VuaXRzKCk7XG4gICAgICAgIHVwZGF0ZUltYWdlcygpO1xuICAgIH0pO1xuXG4gICAgZDMuc2VsZWN0QWxsKCcud2F0Y2gnKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvbnN0IG1lID0gdGhpcztcbiAgICAgICAgZDMuc2VsZWN0QWxsKCcud2F0Y2gnKVxuICAgICAgICAgICAgLmNsYXNzZWQoJ3NlbGVjdGVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzID09IG1lXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBpZiAoc2VsX3dhdGNoKCkgPT09ICdhYmxhdGlvbicpIHtcbiAgICAgICAgICAgIHVwZGF0ZV91bml0c19hYmxhdGlvbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdXBkYXRlX3VuaXRzX2NvcHkoKTtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZV91bml0cygpIHtcbiAgICAgICAgaWYgKHNlbF93YXRjaCgpID09PSAnYWJsYXRpb24nKSB7XG4gICAgICAgICAgICB1cGRhdGVfdW5pdHNfYWJsYXRpb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHVwZGF0ZV91bml0c19jb3B5KCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZV91bml0X2ltYWdlcyh2YWx1ZXM6IG51bWJlcltdID0gbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxfcHJlZml4ID0gJycsIHNvcnRfZmN0ID0gKGEsIGIpID0+IGEgLSBiKSB7XG5cbiAgICAgICAgY29uc3QgYWJsYXRlX2lkcyA9IF9jdXJyZW50X2FibGF0aW9uX2lkcygpO1xuICAgICAgICBjb25zdCBjb3B5X2lkcyA9IF9jdXJyZW50X2NvcHlfaWRzKCk7XG5cblxuICAgICAgICBhcGkudW5pdHMoc2VsX3Byb2plY3QoKS5wcm9qZWN0LCBzZWxfbGF5ZXIoKSlcbiAgICAgICAgICAgIC50aGVuKHVuaXRyZXMgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHVuaXRzID0gdW5pdHJlcy5yZXM7XG5cbiAgICAgICAgICAgICAgICBsZXQgaW5kaWNlcyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcyA9IGFyZ3NvcnQodmFsdWVzLCBzb3J0X2ZjdCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kaWNlcyA9IGQzLnJhbmdlKHVuaXRzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHVuaSA9IGQzLnNlbGVjdCgnI3VuaXRzJylcbiAgICAgICAgICAgICAgICAgICAgLnNlbGVjdEFsbCgnLnVuaXQnKVxuICAgICAgICAgICAgICAgICAgICAuZGF0YShpbmRpY2VzKS8vLCAoZCwgaSkgPT4gaSArICdjJyArIGQpO1xuXG4gICAgICAgICAgICAgICAgdW5pLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1bmlFbnRlciA9IHVuaS5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ3VuaXQnKTtcblxuICAgICAgICAgICAgICAgIHVuaUVudGVyLmFwcGVuZCgnaW1nJykuY2xhc3NlZCgndW5pdEltZycsIHRydWUpO1xuICAgICAgICAgICAgICAgIHVuaUVudGVyLmFwcGVuZCgnZGl2JykuY2xhc3NlZCgnbGFiZWwnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAvLyB1bmlFbnRlci5hcHBlbmQoJ2RpdicpLmNsYXNzZWQoJ2FibGF0aW9uJywgdHJ1ZSk7XG5cblxuICAgICAgICAgICAgICAgIHVuaSA9IHVuaUVudGVyLm1lcmdlKHVuaSk7XG4gICAgICAgICAgICAgICAgdW5pLnNlbGVjdCgnaW1nJylcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyYycsIGQgPT4gdW5pdHNbZF0uaW1nKVxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZCgnYWJsYXRlJywgZCA9PiBhYmxhdGVfaWRzLmluY2x1ZGVzKGQpKVxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZCgnY29weScsIGQgPT4gY29weV9pZHMuaW5jbHVkZXMoZCkpO1xuICAgICAgICAgICAgICAgIHVuaS5zZWxlY3QoJy5sYWJlbCcpLnRleHQoKGQsIGkpID0+IGAke2xhYmVsX3ByZWZpeH0gIyR7aX1gKVxuICAgICAgICAgICAgICAgIC8vIHVuaS5zZWxlY3QoJy5hYmxhdGlvbicpXG4gICAgICAgICAgICAgICAgLy8gICAgIC5zdHlsZSgnd2lkdGgnLCBkID0+XG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB2YWx1ZXMubGVuZ3RoID4gZCA/IGAkeyh2YWx1ZXNbZF0pIC8gdmFsdWVzW2luZGljZXNbMF1dICogNTkgKyAxfXB4YCA6ICcxcHgnXG4gICAgICAgICAgICAgICAgLy8gICAgIClcblxuICAgICAgICAgICAgfSlcbiAgICB9XG5cbiAgICBjb25zdCBybV91bml0ID0gZDMuc2VsZWN0KCcjcm1fdW5pdCcpO1xuICAgIGNvbnN0IGNwX3VuaXQgPSBkMy5zZWxlY3QoJyNjcF91bml0Jyk7XG5cbiAgICBjb25zdCBub19ybV91bml0cyA9ICgpID0+ICtybV91bml0LnByb3BlcnR5KCd2YWx1ZScpO1xuICAgIGNvbnN0IG5vX2NwX3VuaXRzID0gKCkgPT4gK2NwX3VuaXQucHJvcGVydHkoJ3ZhbHVlJyk7XG5cbiAgICBybV91bml0Lm9uKCdjaGFuZ2UnLCAoKSA9PiB7XG4gICAgICAgIHVwZGF0ZUltYWdlcygpO1xuICAgICAgICB1cGRhdGVfdW5pdHMoKTtcbiAgICB9KTtcblxuXG4gICAgLypcbiAgICAqXG4gICAgKiA9PT0gSU1BR0VTID09PVxuICAgICpcbiAgICAqICovXG5cbiAgICBjb25zdCBpbWFnZV9zZWxlY3QgPSBkMy5zZWxlY3QoJyNpbWFnZV9zZWxlY3QnKTtcbiAgICBjb25zdCBzZWxfaW1hZ2VzID0gKCkgPT4ge1xuICAgICAgICBjb25zdCBpbWdfc3RyOiBzdHJpbmcgPSBpbWFnZV9zZWxlY3QucHJvcGVydHkoJ3ZhbHVlJyk7XG4gICAgICAgIGNvbnN0IHBhcnRzID0gaW1nX3N0ci50cmltKCkuc3BsaXQoJywnKTtcbiAgICAgICAgbGV0IHJlcyA9IFtdO1xuICAgICAgICBwYXJ0cy5mb3JFYWNoKHBhcnRfeCA9PiB7XG4gICAgICAgICAgICBjb25zdCBwYXJ0ID0gcGFydF94LnRyaW0oKTtcbiAgICAgICAgICAgIGlmICghIXBhcnQubWF0Y2goL15bMC05XSskL2cpKSB7XG4gICAgICAgICAgICAgICAgcmVzID0gWy4uLnJlcywgK3BhcnRdO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghIXBhcnQubWF0Y2goL15bMC05XSstWzAtOV0rJC9nKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnBhcnRzID0gcGFydC5zcGxpdCgnLScpO1xuICAgICAgICAgICAgICAgIHJlcyA9IFsuLi5yZXMsIC4uLmQzLnJhbmdlKCtzdWJwYXJ0c1swXSwgK3N1YnBhcnRzWzFdICsgMSldXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfTtcblxuICAgIEhlbHBlci5zZWxlY3Rvcl9vbl9jaGFuZ2Vfb3JfZW50ZXIoaW1hZ2Vfc2VsZWN0LCB1cGRhdGVJbWFnZXMpO1xuXG5cbiAgICBjb25zdCBpbWFnZV9saXN0ID0gZDMuc2VsZWN0KCcjaW1hZ2VfbGlzdCcpO1xuICAgIHR5cGUgU3ViSW1hZ2VUeXBlID0geyBkOiBzdHJpbmcsIGlkOiBudW1iZXIsIGFibGF0ZWQ6IGJvb2xlYW4gfVxuXG4gICAgY29uc3Qgc3ViSW1hZ2VUb0lEID0gZCA9PiBgaWRfJHtkLmlkfSR7ZC5hYmxhdGVkID8gJy1hYmxhdGVkJyA6ICcnfWA7XG4gICAgY29uc3Qgc2VsX3pvb20gPSAoKTogbnVtYmVyID0+ICtkMy5zZWxlY3QoJyNpbnB1dF96b29tJykucHJvcGVydHkoJ3ZhbHVlJylcblxuICAgIGQzLnNlbGVjdCgnI2lucHV0X3pvb20nKS5vbignY2hhbmdlJywgKCkgPT4ge1xuICAgICAgICBkMy5zZWxlY3RBbGwoJy5nYW5fc3ViX2ltYWdlJykuZWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgY29uc3QgbWUgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICBjb25zdCBwc3YgPSA8UGFpbnRTZWxlY3RWaWV3Pm1lLnByb3BlcnR5KCdwc3YnKTtcbiAgICAgICAgICAgIHBzdi56b29tID0gc2VsX3pvb20oKTtcbiAgICAgICAgfSlcbiAgICB9KTtcblxuICAgIGNvbnN0IHNlbF9vcGFjaXR5ID0gKCkgPT4gZDMuc2VsZWN0KCcjaW5wdXRfb3BhY2l0eScpLnByb3BlcnR5KCd2YWx1ZScpO1xuXG4gICAgZDMuc2VsZWN0KCcjaW5wdXRfb3BhY2l0eScpLm9uKCdjaGFuZ2UnLCgpPT57XG4gICAgICAgIGQzLnNlbGVjdEFsbCgnLmdhbl9zdWJfaW1hZ2UnKS5lYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBjb25zdCBtZSA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHBzdiA9IDxQYWludFNlbGVjdFZpZXc+bWUucHJvcGVydHkoJ3BzdicpO1xuICAgICAgICAgICAgcHN2Lm9wYWNpdHkgPSBzZWxfb3BhY2l0eSgpO1xuICAgICAgICB9KVxuXG5cbiAgICB9KVxuXG5cblxuXG4gICAgZnVuY3Rpb24gX3VwZGF0ZUltYWdlcyhpbWdzOiBTdWJJbWFnZVR5cGVbXVtdKSB7XG5cbiAgICAgICAgY29uc3Qgem9vbV9sZXZlbCA9IHNlbF96b29tKCk7XG4gICAgICAgIGNvbnN0IG9wYWNpdHkgPSBzZWxfb3BhY2l0eSgpO1xuXG4gICAgICAgIGxldCBnYW5faW1hZ2UgPSBpbWFnZV9saXN0LnNlbGVjdEFsbCgnLmdhbl9pbWFnZScpXG4gICAgICAgICAgICAuZGF0YShpbWdzKTtcbiAgICAgICAgZ2FuX2ltYWdlLmV4aXQoKS5yZW1vdmUoKTtcbiAgICAgICAgZ2FuX2ltYWdlID0gZ2FuX2ltYWdlLmVudGVyKCkuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmF0dHIoJ2NsYXNzJywgJ2dhbl9pbWFnZScpXG4gICAgICAgICAgICAubWVyZ2UoZ2FuX2ltYWdlKTtcblxuICAgICAgICBsZXQgZ2FuX3N1YiA9IGdhbl9pbWFnZS5zZWxlY3RBbGwoJy5nYW5fc3ViX2ltYWdlJylcbiAgICAgICAgICAgIC5kYXRhKGQgPT4gZCk7XG4gICAgICAgIGdhbl9zdWIuZXhpdCgpLnJlbW92ZSgpO1xuICAgICAgICBjb25zdCBnYW5fc3ViX2VudGVyID0gZ2FuX3N1Yi5lbnRlcigpLmFwcGVuZCgnZGl2JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsIGQgPT4gJ2dhbl9zdWJfaW1hZ2UgJyArIHN1YkltYWdlVG9JRChkKSlcbiAgICAgICAgICAgIC5odG1sKCc8aW1nLz48YnIvPicpO1xuXG4gICAgICAgIGdhbl9zdWJfZW50ZXIuZWFjaChmdW5jdGlvbiAoZCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZCwgdGhpcywgXCItLS1lbnRlciBkXCIpO1xuICAgICAgICAgICAgY29uc3QgbWUgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICBjb25zdCBwc3YgPSBuZXcgUGFpbnRTZWxlY3RWaWV3KGQzLnNlbGVjdCh0aGlzKSwgZXZlbnRIYW5kbGVyKTtcbiAgICAgICAgICAgIHBzdi56b29tID0gem9vbV9sZXZlbDtcbiAgICAgICAgICAgIHBzdi5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgICAgICAgIG1lLnByb3BlcnR5KCdwc3YnLCBwc3YpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdhbl9zdWJfZW50ZXIuYXBwZW5kKCdidXR0b24nKVxuICAgICAgICAgICAgLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwID0gZDMuc2VsZWN0KCg8YW55PnRoaXMpLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBzdiA9IDxQYWludFNlbGVjdFZpZXc+cC5wcm9wZXJ0eSgncHN2Jyk7XG4gICAgICAgICAgICAgICAgcHN2LnJlc2V0KCk7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBnYW5fc3ViX2VudGVyLmFwcGVuZCgnc3BhbicpO1xuXG4gICAgICAgIC8vIFRPRE86IHYxXG4gICAgICAgIC8vIGNvbnN0IHN2Z3MgPSBnYW5fc3ViX2VudGVyLmFwcGVuZCgnc3ZnJyk7XG4gICAgICAgIC8vIGRlY29yYXRlU1ZHKHN2Z3MpO1xuXG4gICAgICAgIGdhbl9zdWIgPSBnYW5fc3ViX2VudGVyLm1lcmdlKGdhbl9zdWIpO1xuXG5cbiAgICAgICAgZ2FuX3N1Yi5lYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICAgICAgICBjb25zdCBtZSA9IGQzLnNlbGVjdCh0aGlzKTtcbiAgICAgICAgICAgIGNvbnN0IHBzdiA9IDxQYWludFNlbGVjdFZpZXc+bWUucHJvcGVydHkoJ3BzdicpO1xuXG4gICAgICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgIGltZy5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgcHN2LnVwZGF0ZSh7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBpbWcsXG4gICAgICAgICAgICAgICAgICAgIGltYWdlSUQ6IHN1YkltYWdlVG9JRChkKVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgaW1nLnNyYyA9IGQuZC5zdGFydHNXaXRoKCcvJykgPyBhcGlfcHJlZml4ICsgZC5kIDogZC5kO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRvZG86IHYxXG4gICAgICAgIC8vIGdhbl9zdWIuc2VsZWN0KCdpbWcnKVxuICAgICAgICAvLyAgICAgLmF0dHIoJ2NsYXNzJywgc3ViSW1hZ2VUb0lEKVxuICAgICAgICAvLyAgICAgLmF0dHIoJ3NyYycsIGQgPT4gZC5kKVxuICAgICAgICAvLyAgICAgLmF0dHIoJ3dpZHRoJywgY3VycmVudC5pbWFnZS5zaXplKTtcbiAgICAgICAgZ2FuX3N1Yi5zZWxlY3QoJ3NwYW4nKS50ZXh0KGQgPT4gZC5hYmxhdGVkID8gZC5pZCArICctYWJsYXRlZCcgOiBkLmlkKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRlY29yYXRlU1ZHKHN2Zykge1xuICAgICAgICBjb25zb2xlLmxvZyhzdmcsIFwiLS0tIHN2Z1wiKTtcbiAgICAgICAgY29uc3QgaW1fcyA9IGN1cnJlbnQuaW1hZ2Uuc2l6ZTtcbiAgICAgICAgc3ZnLmF0dHIoJ3dpZHRoJywgaW1fcylcbiAgICAgICAgICAgIC5hdHRyKCdoZWlnaHQnLCBpbV9zKTtcblxuXG4gICAgICAgIGNvbnN0IGJnID0gc3ZnLmFwcGVuZCgnZycpLmF0dHIoJ2NsYXNzJywgJ2JnJyk7XG4gICAgICAgIGJnLmFwcGVuZCgncmVjdCcpLmF0dHIoJ2NsYXNzJywgJ3BvaW50ZXInKTtcbiAgICAgICAgY29uc3QgYWN0aXZlTGF5ZXIgPSBzdmcuYXBwZW5kKCdyZWN0JylcbiAgICAgICAgICAgIC5hdHRyKCdjbGFzcycsICdzaW5nbGVfcGljaycpXG4gICAgICAgICAgICAuYXR0cignd2lkdGgnLCBpbV9zKVxuICAgICAgICAgICAgLmF0dHIoJ2hlaWdodCcsIGltX3MpO1xuXG4gICAgICAgIGFjdGl2ZUxheWVyLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludGVyID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSkuc2VsZWN0KCcucG9pbnRlcicpO1xuICAgICAgICAgICAgaWYgKHBvaW50ZXIuY2xhc3NlZCgnc2VsZWN0ZWQnKSkgcmV0dXJuO1xuXG5cbiAgICAgICAgICAgIGNvbnN0IGNvbyA9IGQzLm1vdXNlKHRoaXMpO1xuICAgICAgICAgICAgbGV0IHRsX2dyaWQgPSBjb28ubWFwKGNvb3JkX2ltMmdyaWQpLm1hcChNYXRoLmZsb29yKTtcbiAgICAgICAgICAgIGNvbnN0IGJyX2dyaWQgPSB0bF9ncmlkLm1hcChkID0+IGQgKyAxKVxuXG5cbiAgICAgICAgICAgIGNvbnN0IGJyID0gYnJfZ3JpZC5tYXAoY29vcmRfZ3JpZDJpbSk7XG4gICAgICAgICAgICBjb25zdCB0bCA9IHRsX2dyaWQubWFwKGNvb3JkX2dyaWQyaW0pO1xuXG4gICAgICAgICAgICBwb2ludGVyLmF0dHJzKHtcbiAgICAgICAgICAgICAgICB4OiB0bFswXSxcbiAgICAgICAgICAgICAgICB5OiB0bFsxXSxcbiAgICAgICAgICAgICAgICB3aWR0aDogYnJbMF0gLSB0bFswXSxcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGJyWzFdIC0gdGxbMV1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIHBvaW50ZXIucHJvcGVydHkoJ19zZWxlY3Rpb25fJywgW3RsX2dyaWQsIGJyX2dyaWRdKTtcblxuICAgICAgICB9KTtcblxuICAgICAgICBhY3RpdmVMYXllci5vbignY2xpY2snLCBmdW5jdGlvbiAoZDogU3ViSW1hZ2VUeXBlKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludGVyID0gZDMuc2VsZWN0KHRoaXMucGFyZW50Tm9kZSkuc2VsZWN0KCcucG9pbnRlcicpO1xuICAgICAgICAgICAgY29uc3QgbmV3VmFsdWUgPSAhcG9pbnRlci5jbGFzc2VkKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgcG9pbnRlci5jbGFzc2VkKCdzZWxlY3RlZCcsIG5ld1ZhbHVlKTtcblxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZWRhdGE6IERyb3BFdmVudERhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlOiBkLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb246IHBvaW50ZXIucHJvcGVydHkoJ19zZWxlY3Rpb25fJylcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgZXZlbnRIYW5kbGVyLnRyaWdnZXIoZXZlbnRzLmRyb3BwaW5nLCBlZGF0YSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVkYXRhOiBEcm9wRXZlbnREYXRhID0ge1xuICAgICAgICAgICAgICAgICAgICBpbWFnZTogZCxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0aW9uOiBudWxsXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIGV2ZW50SGFuZGxlci50cmlnZ2VyKGV2ZW50cy5kcm9wcGluZywgZWRhdGEpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cblxuICAgICAgICBhY3RpdmVMYXllci5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ZXIgPSBkMy5zZWxlY3QodGhpcy5wYXJlbnROb2RlKS5zZWxlY3QoJy5wb2ludGVyJyk7XG4gICAgICAgICAgICBpZiAoIXBvaW50ZXIuY2xhc3NlZCgnc2VsZWN0ZWQnKSkge1xuICAgICAgICAgICAgICAgIHBvaW50ZXIuYXR0cnMoe3g6IC0xMCwgeTogLTEwLCB3aWR0aDogMCwgaGVpZ2h0OiAwfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuXG4gICAgfVxuXG4gICAgY29uc3QgY29vcmRfaW0yZ3JpZCA9IHggPT4geCAqIDguIC8gY3VycmVudC5pbWFnZS5zaXplO1xuICAgIGNvbnN0IGNvb3JkX2dyaWQyaW0gPSB4ID0+IE1hdGgucm91bmQoeCAqIGN1cnJlbnQuaW1hZ2Uuc2l6ZSAvIDguKTtcblxuXG4gICAgZnVuY3Rpb24gc2VsZWN0UGlja2VyKGlkOiBudW1iZXIsIGFibGF0ZWQ6IGJvb2xlYW4pIHtcblxuICAgICAgICBjb25zdCBzdWJfaW1hZ2VzID0gaW1hZ2VfbGlzdC5zZWxlY3RBbGwoJy5nYW5fc3ViX2ltYWdlJyk7XG5cbiAgICAgICAgY29uc3QgYWRkX3RoZW0gPSBzdWJfaW1hZ2VzLmZpbHRlcigoZDogU3ViSW1hZ2VUeXBlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKGQuaWQgPT09IGlkKSAmJiAoZC5hYmxhdGVkID09PSBhYmxhdGVkKVxuICAgICAgICB9KVxuXG4gICAgICAgIHN1Yl9pbWFnZXMuc2VsZWN0KCdidXR0b24nKS5jbGFzc2VkKCdzZWxlY3RlZCcsIGZhbHNlKTtcbiAgICAgICAgc3ViX2ltYWdlcy5zZWxlY3QoJ3N2ZyAuYnJ1c2gnKS5yZW1vdmUoKTtcblxuICAgICAgICBhZGRfdGhlbS5zZWxlY3QoJ2J1dHRvbicpLmNsYXNzZWQoJ3NlbGVjdGVkJywgdHJ1ZSk7XG4gICAgICAgIGNvbnN0IGltX3MgPSBjdXJyZW50LmltYWdlLnNpemU7XG4gICAgICAgIC8vIGNvbnN0IGRfdW5pdCA9IHggPT4geCAqIDguIC8gaW1fcztcbiAgICAgICAgLy8gY29uc3QgZF91bml0X2ludiA9IHggPT4gTWF0aC5yb3VuZCh4ICogaW1fcyAvIDguKTtcblxuICAgICAgICBmdW5jdGlvbiBidXJzaGVuZCgpIHtcbiAgICAgICAgICAgIGlmICghZDMuZXZlbnQuc291cmNlRXZlbnQpIHJldHVybjsgLy8gT25seSB0cmFuc2l0aW9uIGFmdGVyIGlucHV0LlxuICAgICAgICAgICAgaWYgKCFkMy5ldmVudC5zZWxlY3Rpb24pIHJldHVybjsgLy8gSWdub3JlIGVtcHR5IHNlbGVjdGlvbnMuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkMy5ldmVudC5zZWxlY3Rpb24sIFwiLS0tIGQzLmV2ZW50LnNlbGVjdGlvblwiKTtcbiAgICAgICAgICAgIGNvbnN0IHAwID0gZDMuZXZlbnQuc2VsZWN0aW9uWzBdLm1hcChjb29yZF9pbTJncmlkKTtcbiAgICAgICAgICAgIGNvbnN0IHAxID0gZDMuZXZlbnQuc2VsZWN0aW9uWzFdLm1hcChjb29yZF9pbTJncmlkKTtcblxuICAgICAgICAgICAgbGV0IHAwMCA9IHAwLm1hcChNYXRoLnJvdW5kKTtcbiAgICAgICAgICAgIGxldCBwMTEgPSBwMS5tYXAoTWF0aC5yb3VuZCk7XG5cbiAgICAgICAgICAgIGlmIChwMDBbMF0gPj0gcDExWzBdKSB7XG4gICAgICAgICAgICAgICAgcDAwWzBdID0gTWF0aC5mbG9vcihwMFswXSk7XG4gICAgICAgICAgICAgICAgcDExWzBdID0gTWF0aC5mbG9vcihwMFswXSkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHAwMFsxXSA+PSBwMTFbMV0pIHtcbiAgICAgICAgICAgICAgICBwMDBbMV0gPSBNYXRoLmZsb29yKHAwWzFdKTtcbiAgICAgICAgICAgICAgICBwMTFbMV0gPSBNYXRoLmZsb29yKHAwWzFdKSArIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGN1cnJlbnQucGljay5zZWxlY3Rpb24gPSBbcDAwLCBwMTFdO1xuICAgICAgICAgICAgZXZlbnRIYW5kbGVyLnRyaWdnZXIoZXZlbnRzLnBpY2tpbmcsIG51bGwpO1xuXG5cbiAgICAgICAgICAgIGNvbnN0IHBsID0gW3AwMC5tYXAoY29vcmRfZ3JpZDJpbSksIHAxMS5tYXAoY29vcmRfZ3JpZDJpbSldO1xuICAgICAgICAgICAgZDMuc2VsZWN0KHRoaXMpLnRyYW5zaXRpb24oKS5jYWxsKGJydXNoLm1vdmUsIHBsKVxuXG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBicnVzaDogYW55ID0gZDMuYnJ1c2goKVxuICAgICAgICAgICAgLmV4dGVudChbWzAsIDBdLCBbaW1fcywgaW1fc11dKVxuICAgICAgICAgICAgLm9uKCdlbmQnLCBidXJzaGVuZCk7XG5cblxuICAgICAgICBhZGRfdGhlbS5zZWxlY3QoJ3N2ZycpLmFwcGVuZChcImdcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY2xhc3NcIiwgXCJicnVzaFwiKVxuICAgICAgICAgICAgLmNhbGwoYnJ1c2gpXG4gICAgICAgICAgICAuc2VsZWN0QWxsKCcuc2VsZWN0aW9uJylcbiAgICAgICAgICAgIC5zdHlsZSgnZmlsbC1vcGFjaXR5JywgMC4yKVxuICAgICAgICAgICAgLnN0eWxlKCdzdHJva2UnLCAncmVkJylcbiAgICAgICAgICAgIC5zdHlsZSgnc3Ryb2tlLXdpZHRoJywgJzJweCcpXG5cblxuICAgICAgICAvLyAub24oXCJzdGFydCBicnVzaFwiLCBicnVzaGVkKVxuICAgICAgICAvLyAub24oXCJlbmRcIiwgYnJ1c2hlbmRlZCk7XG5cblxuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gX2N1cnJlbnRfYWJsYXRpb25faWRzKCkge1xuICAgICAgICBjb25zdCBuX3JtID0gbm9fcm1fdW5pdHMoKTtcbiAgICAgICAgLy8gYWJsYXRpb25fc29ydF92YWx1ZXMocmVjaXBlX2FibGF0aW9uX3NlbGVjdG9yLnByb3BlcnR5KCd2YWx1ZScpKTtcblxuICAgICAgICBsZXQgdXMgPSBhcmdzb3J0KFxuICAgICAgICAgICAgYWJsYXRpb25fdmFsdWVzKFxuICAgICAgICAgICAgICAgIHJlY2lwZV9hYmxhdGlvbl9zZWxlY3Rvci5wcm9wZXJ0eSgndmFsdWUnKSksXG4gICAgICAgICAgICAoYSwgYikgPT4gYSAtIGIpO1xuICAgICAgICBpZiAoIXVzKSB1cyA9IGQzLnJhbmdlKG5fcm0gKyAxKTtcbiAgICAgICAgcmV0dXJuIHVzXG4gICAgICAgICAgICAuc2xpY2UoMCwgTWF0aC5taW4obl9ybSwgdXMubGVuZ3RoKSlcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY3VycmVudF9hYmxhdGlvbl9wYXlsb2FkKCk6IEFibGF0aW9uVXBsb2FkW10ge1xuICAgICAgICBjb25zdCBsYXllciA9IHNlbF9sYXllcigpO1xuICAgICAgICByZXR1cm4gX2N1cnJlbnRfYWJsYXRpb25faWRzKClcbiAgICAgICAgICAgIC5tYXAodW5pdCA9PiAoe1xuICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgIHVuaXQsXG4gICAgICAgICAgICAgICAgYWxwaGE6IDFcbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY3VycmVudF9jb3B5X2lkcygpIHtcbiAgICAgICAgY29uc3Qgbl9jcCA9IG5vX2NwX3VuaXRzKCk7XG5cbiAgICAgICAgY29uc3Qgc29ydF9kaW0gPSByZWNpcGVfY29weV9zZWxlY3Rvci5wcm9wZXJ0eSgndmFsdWUnKTtcbiAgICAgICAgbGV0IHVzID0gYXJnc29ydChhYmxhdGlvbl92YWx1ZXMoc29ydF9kaW0pLCAoYSwgYikgPT4gYSAtIGIpO1xuXG4gICAgICAgIHJldHVybiB1c1xuICAgICAgICAgICAgLnNsaWNlKDAsIE1hdGgubWluKG5fY3AsIHVzLmxlbmd0aCkpXG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfY3VycmVudF9jb3B5X3BheWxvYWQoKTogQWJsYXRpb25VcGxvYWRbXSB7XG5cbiAgICAgICAgY29uc3QgY29weV92YWx1ZXMgPSBjdXJyZW50LnJlY2lwZXMuY29weV92YWx1ZXM7XG4gICAgICAgIGNvbnN0IGxheWVyID0gc2VsX2xheWVyKCk7XG5cbiAgICAgICAgcmV0dXJuIF9jdXJyZW50X2NvcHlfaWRzKClcbiAgICAgICAgICAgIC5tYXAodW5pdCA9PiAoe1xuICAgICAgICAgICAgICAgIGxheWVyLFxuICAgICAgICAgICAgICAgIHVuaXQsXG4gICAgICAgICAgICAgICAgYWxwaGE6IDEsXG4gICAgICAgICAgICAgICAgdmFsdWU6ICtjb3B5X3ZhbHVlc1t1bml0XVxuICAgICAgICAgICAgfSkpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gX2N1cnJlbnRfY29weV9wYXlsb2FkX29sZCgpOiBBYmxhdGlvblVwbG9hZFtdIHtcbiAgICAgICAgY29uc3Qgbl9jcCA9IG5vX2NwX3VuaXRzKCk7XG5cbiAgICAgICAgY29uc3Qgc29ydF9kaW0gPSByZWNpcGVfY29weV9zZWxlY3Rvci5wcm9wZXJ0eSgndmFsdWUnKTtcbiAgICAgICAgY29uc3QgdXMgPSBhcmdzb3J0KGN1cnJlbnQudW5pdF9zb3J0aW5nLmNvcHlbc29ydF9kaW1dLCAoYSwgYikgPT4gYiAtIGEpO1xuICAgICAgICAvLyBjb25zdCBjb3B5X3ZhbHVlcyA9IGN1cnJlbnQudW5pdF9zb3J0aW5nLmNvcHlbc29ydF9kaW0uc3BsaXQoJ18nKVswXV07XG4gICAgICAgIGNvbnN0IGNvcHlfdmFsdWVzID0gY3VycmVudC51bml0X3NvcnRpbmcuY29weVsnbWF4J107XG5cbiAgICAgICAgY29uc29sZS5sb2coY29weV92YWx1ZXMsIFwiLS0tIGNvcHlfdmFsdWVzXCIpO1xuXG4gICAgICAgIGNvbnN0IGxheWVyID0gc2VsX2xheWVyKCk7XG4gICAgICAgIHJldHVybiB1c1xuICAgICAgICAgICAgLnNsaWNlKDAsIE1hdGgubWluKG5fY3AsIHVzLmxlbmd0aCkpXG4gICAgICAgICAgICAubWFwKHVuaXQgPT4gKHtcbiAgICAgICAgICAgICAgICBsYXllcixcbiAgICAgICAgICAgICAgICB1bml0LFxuICAgICAgICAgICAgICAgIGFscGhhOiAxLFxuICAgICAgICAgICAgICAgIHZhbHVlOiArY29weV92YWx1ZXNbdW5pdF1cbiAgICAgICAgICAgIH0pKTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIHVwZGF0ZUltYWdlcyhpbWFnZXMgPSBzZWxfaW1hZ2VzKCkpIHtcbiAgICAgICAgYXBpLmdlbmVyYXRlSW1ncyhcbiAgICAgICAgICAgIHNlbF9wcm9qZWN0KCkucHJvamVjdCwgaW1hZ2VzLFxuICAgICAgICAgICAgMCwgW10pXG4gICAgICAgICAgICAudGhlbihnSW1ncyA9PiB7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuX3JtID0gbm9fcm1fdW5pdHMoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhuX3JtLCBcIi0tLSBuXCIpO1xuICAgICAgICAgICAgICAgIGlmIChuX3JtID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwYXlsb2FkID0gX2N1cnJlbnRfYWJsYXRpb25fcGF5bG9hZCgpO1xuICAgICAgICAgICAgICAgICAgICBhcGlcbiAgICAgICAgICAgICAgICAgICAgICAgIC5nZW5lcmF0ZUltZ3Moc2VsX3Byb2plY3QoKS5wcm9qZWN0LCBpbWFnZXMsIDAsIHBheWxvYWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAudGhlbihhYmxfcmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdXBkYXRlSW1hZ2VzKGdJbWdzLnJlc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAubWFwKChkLCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBhYmwgPSBhYmxfcmVzLnJlc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ6IGQuZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogZC5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhYmxhdGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSwge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGQ6IGFibC5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBkLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFibGF0ZWQ6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1dXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKVxuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdXBkYXRlSW1hZ2VzKGdJbWdzLnJlcy5tYXAoZCA9PiBbe1xuICAgICAgICAgICAgICAgICAgICAgICAgZDogZC5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IGQuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBhYmxhdGVkOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XSkpXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KVxuXG4gICAgfVxuXG5cbiAgICAvKlxuICAgICAqXG4gICAgICogID09PT09IEVWRU5UUyA9PT09XG4gICAgICpcbiAgICAgKi9cblxuXG4gICAgZXZlbnRIYW5kbGVyLmJpbmQoZXZlbnRzLnBpY2tpbmcsICgpID0+IHtcblxuICAgICAgICBjb25zdCBwaWNrID0gY3VycmVudC5waWNrO1xuICAgICAgICBjb25zdCBiYiA9IHBpY2suc2VsZWN0aW9uOyAvLyBJTiBDRyBPUkRFUiAtLT4gY29udmVydCB0byBNYXRyaXggb3JkZXJcblxuICAgICAgICBjb25zdCBhYmxhdGlvbnMgPSBwaWNrLmFibGF0ZWQgPyBfY3VycmVudF9hYmxhdGlvbl9wYXlsb2FkKCkgOiBbXTtcblxuICAgICAgICBhcGkuZ2VuZXJhdGVGZWF0dXJlc0xvY2FsKFxuICAgICAgICAgICAgc2VsX3Byb2plY3QoKS5wcm9qZWN0LFxuICAgICAgICAgICAgW3BpY2suaWRdLFxuICAgICAgICAgICAgW3NlbF9sYXllcigpXSxcbiAgICAgICAgICAgIFt7XG4gICAgICAgICAgICAgICAgc2hhcGU6IFs4LCA4XSxcbiAgICAgICAgICAgICAgICBiaXRib3VuZHM6IFtiYlswXVsxXSwgYmJbMF1bMF0sIGJiWzFdWzFdLCBiYlsxXVswXV0sXG4gICAgICAgICAgICAgICAgYml0c3RyaW5nOiBudWxsXG4gICAgICAgICAgICB9XSxcbiAgICAgICAgICAgIGFibGF0aW9uc1xuICAgICAgICApLnRoZW4oZl9yZXNwID0+IHtcblxuICAgICAgICAgICAgY29uc3QgZmVhdHVyZXMgPSBmX3Jlc3AucmVzW3NlbF9sYXllcigpXTtcblxuICAgICAgICAgICAgSGVscGVyLnVwZGF0ZV9zZWxlY3RvcihyZWNpcGVfY29weV9zZWxlY3RvciwgT2JqZWN0LmtleXMoZmVhdHVyZXMpKTtcbiAgICAgICAgICAgIGN1cnJlbnQudW5pdF9zb3J0aW5nLmNvcHkgPSBmZWF0dXJlcztcblxuICAgICAgICAgICAgT2JqZWN0LmtleXMoZmVhdHVyZXMpXG4gICAgICAgIH0pXG5cblxuICAgIH0pO1xuXG5cbiAgICB0eXBlIERyb3BFdmVudERhdGEgPSB7XG4gICAgICAgIGltYWdlOiBTdWJJbWFnZVR5cGUsXG4gICAgICAgIHNlbGVjdGlvbjogbnVtYmVyW11bXVxuICAgIH1cblxuXG4gICAgLy8gVE9ETzogYnJva2VuIC0tIHdhcyBmb3IgVjEgLS0tIElEIGlzIG5vdyBhdHRhY2hlZCB0byBESVYgYW5kIG5vdCBJTUdcbiAgICBldmVudEhhbmRsZXIuYmluZChldmVudHMuZHJvcHBpbmcsIChlZGF0YTogRHJvcEV2ZW50RGF0YSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhlZGF0YSwgXCItLS0gZWRhdGFcIik7XG5cbiAgICAgICAgY29uc3QgYmIgPSBlZGF0YS5zZWxlY3Rpb247XG5cbiAgICAgICAgY29uc29sZS5sb2coX2N1cnJlbnRfY29weV9wYXlsb2FkKCksIFwiLS0tIF9jdXJyZW50X2NvcHlfcGF5bG9hZCgpXCIpO1xuXG4gICAgICAgIGlmIChiYikge1xuICAgICAgICAgICAgYXBpLmdlbmVyYXRlSW1nc1dpdGhSbUNwKFxuICAgICAgICAgICAgICAgIHNlbF9wcm9qZWN0KCkucHJvamVjdCxcbiAgICAgICAgICAgICAgICBbZWRhdGEuaW1hZ2UuaWRdLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgZWRhdGEuaW1hZ2UuYWJsYXRlZCA/IF9jdXJyZW50X2FibGF0aW9uX3BheWxvYWQoKSA6IFtdLFxuICAgICAgICAgICAgICAgIF9jdXJyZW50X2NvcHlfcGF5bG9hZCgpLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYml0Ym91bmRzOiBbYmJbMF1bMV0sIGJiWzBdWzBdLCBiYlsxXVsxXSwgYmJbMV1bMF1dLFxuICAgICAgICAgICAgICAgICAgICBiaXRzdHJpbmc6ICcxJyxcbiAgICAgICAgICAgICAgICAgICAgc2hhcGU6IFs4LCA4XVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICkudGhlbihkID0+IHtcbiAgICAgICAgICAgICAgICBkMy5zZWxlY3RBbGwoJy4nICsgc3ViSW1hZ2VUb0lEKGVkYXRhLmltYWdlKSlcbiAgICAgICAgICAgICAgICAgICAgLmF0dHIoJ3NyYycsIGQucmVzWzBdLmQpO1xuXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZC5yZXNbMF0uZCwgc3ViSW1hZ2VUb0lEKGVkYXRhLmltYWdlKSwgXCItLS0gZFwiKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcGkuZ2VuZXJhdGVJbWdzKFxuICAgICAgICAgICAgICAgIHNlbF9wcm9qZWN0KCkucHJvamVjdCxcbiAgICAgICAgICAgICAgICBbZWRhdGEuaW1hZ2UuaWRdLFxuICAgICAgICAgICAgICAgIDAsXG4gICAgICAgICAgICAgICAgZWRhdGEuaW1hZ2UuYWJsYXRlZCA/IF9jdXJyZW50X2FibGF0aW9uX3BheWxvYWQoKSA6IFtdXG4gICAgICAgICAgICApLnRoZW4oZCA9PiB7XG4gICAgICAgICAgICAgICAgZDMuc2VsZWN0QWxsKCcuJyArIHN1YkltYWdlVG9JRChlZGF0YS5pbWFnZSkpXG4gICAgICAgICAgICAgICAgICAgIC5hdHRyKCdzcmMnLCBkLnJlc1swXS5kKTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG5cbiAgICB9KTtcblxuXG4gICAgZXZlbnRIYW5kbGVyLmJpbmQoUGFpbnRTZWxlY3RWaWV3LmV2ZW50cy5tYXNrQ2hhbmdlZCwgKGltOiBJbWFnZU1hc2spID0+IHtcblxuICAgICAgICBjb25zdCBpbWdfZGF0YSA9IDxTdWJJbWFnZVR5cGU+IGQzLnNlbGVjdCgnLicgKyBpbS5pZCkuZGF0dW0oKTtcblxuXG4gICAgICAgIGFwaS5nZW5lcmF0ZUltZ3NXaXRoUm1DcChcbiAgICAgICAgICAgIHNlbF9wcm9qZWN0KCkucHJvamVjdCxcbiAgICAgICAgICAgIFtpbWdfZGF0YS5pZF0sXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgaW1nX2RhdGEuYWJsYXRlZCA/IF9jdXJyZW50X2FibGF0aW9uX3BheWxvYWQoKSA6IFtdLFxuICAgICAgICAgICAgX2N1cnJlbnRfY29weV9wYXlsb2FkKCksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgYml0Ym91bmRzOiBbXSxcbiAgICAgICAgICAgICAgICBiaXRzdHJpbmc6IGltLm1hc2ssXG4gICAgICAgICAgICAgICAgc2hhcGU6IFtdXG4gICAgICAgICAgICB9XG4gICAgICAgICkudGhlbihkID0+IHtcbiAgICAgICAgICAgIGQzLnNlbGVjdEFsbCgnLicgKyBpbS5pZCkuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgbWUgPSBkMy5zZWxlY3QodGhpcyk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHN2ID0gPFBhaW50U2VsZWN0Vmlldz5tZS5wcm9wZXJ0eSgncHN2Jyk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBwc3YudXBkYXRlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiBpbWcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUlEOiBpbS5pZFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgaW1nLnNyYyA9IGQucmVzWzBdLmQ7XG5cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gLmF0dHIoJ3NyYycsIGQucmVzWzBdLmQpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhkLnJlc1swXS5kLCBcIi0tLSBkXCIpO1xuICAgICAgICB9KVxuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgYXBpLmdlbmVyYXRlSW1ncyhcbiAgICAgICAgLy8gICAgICAgICBzZWxfcHJvamVjdCgpLnByb2plY3QsXG4gICAgICAgIC8vICAgICAgICAgW2VkYXRhLmltYWdlLmlkXSxcbiAgICAgICAgLy8gICAgICAgICAwLFxuICAgICAgICAvLyAgICAgICAgIGVkYXRhLmltYWdlLmFibGF0ZWQgPyBfY3VycmVudF9hYmxhdGlvbl9wYXlsb2FkKCkgOiBbXVxuICAgICAgICAvLyAgICAgKS50aGVuKGQgPT4ge1xuICAgICAgICAvLyAgICAgICAgIGQzLnNlbGVjdEFsbCgnLicgKyBzdWJJbWFnZVRvSUQoZWRhdGEuaW1hZ2UpKVxuICAgICAgICAvLyAgICAgICAgICAgICAuYXR0cignc3JjJywgZC5yZXNbMF0uZCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICB9KVxuICAgICAgICAvLyB9XG5cblxuICAgIH0pO1xuXG5cbiAgICAvKlxuICAgICpcbiAgICAqICA9PT09PSBVSSBzdHVmZiA9PT09XG4gICAgKlxuICAgICAqL1xuXG4gICAgZnVuY3Rpb24gc2V0dXBfdWkoKSB7XG5cblxuICAgICAgICBkMy5zZWxlY3QoJyNzaWRlYmFyX2J0bicpXG4gICAgICAgICAgICAub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNiID0gY3VycmVudC5zaWRlYmFyO1xuXG4gICAgICAgICAgICAgICAgc2IudmlzaWJsZSA9ICFzYi52aXNpYmxlO1xuICAgICAgICAgICAgICAgIGQzLnNlbGVjdCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAuY2xhc3NlZCgnb24nLCBzYi52aXNpYmxlKTtcbiAgICAgICAgICAgICAgICBzaWRlX2Jhci5jbGFzc2VkKCdoaWRkZW4nLCAhc2IudmlzaWJsZSk7XG4gICAgICAgICAgICAgICAgc2lkZV9iYXIuc3R5bGUoJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAgICAgc2IudmlzaWJsZSA/IG51bGwgOiBgLSR7Y3VycmVudC5zaWRlYmFyLndpZHRofXB4YCk7XG5cbiAgICAgICAgICAgICAgICByZV9sYXlvdXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgd2luZG93Lm9ucmVzaXplID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgdyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgY29uc3QgaCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHcsIGgsIFwiLS0tIHcsaFwiKTtcblxuICAgICAgICAgICAgcmVfbGF5b3V0KHcsIGgpO1xuXG5cbiAgICAgICAgfTtcblxuICAgICAgICBmdW5jdGlvbiByZV9sYXlvdXQodyA9IHdpbmRvdy5pbm5lcldpZHRoLCBoID0gd2luZG93LmlubmVySGVpZ2h0KSB7XG4gICAgICAgICAgICBkMy5zZWxlY3RBbGwoJy5zaWRlbmF2JylcbiAgICAgICAgICAgICAgICAuc3R5bGUoJ2hlaWdodCcsIChoIC0gNTMpICsgJ3B4JylcblxuICAgICAgICAgICAgY29uc3Qgc2IgPSBjdXJyZW50LnNpZGViYXI7XG4gICAgICAgICAgICBjb25zdCBtYWluV2lkdGggPSB3IC0gKHNiLnZpc2libGUgPyBzYi53aWR0aCA6IDApO1xuICAgICAgICAgICAgZDMuc2VsZWN0QWxsKCcubWFpbl9mcmFtZScpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCdoZWlnaHQnLCAoaCAtIDUzKSArICdweCcpXG4gICAgICAgICAgICAgICAgLnN0eWxlKCd3aWR0aCcsIG1haW5XaWR0aCArICdweCcpXG5cbiAgICAgICAgICAgIC8vIGV2ZW50SGFuZGxlci50cmlnZ2VyKEdsb2JhbEV2ZW50cy53aW5kb3dfcmVzaXplLCB7dywgaH0pXG5cbiAgICAgICAgICAgIC8vIGV2ZW50SGFuZGxlci50cmlnZ2VyKEdsb2JhbEV2ZW50cy5tYWluX3Jlc2l6ZSwge1xuICAgICAgICAgICAgLy8gICAgIHc6ICh3IC0gZ2xvYmFsLnNpZGViYXIoKSksXG4gICAgICAgICAgICAvLyAgICAgaDogKGggLSA0NSlcbiAgICAgICAgICAgIC8vIH0pXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHJlX2xheW91dCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcblxuICAgIH1cblxuICAgIHNldHVwX3VpKCk7XG59XG5cblxuXG5cbiIsImltcG9ydCB7VkNvbXBvbmVudH0gZnJvbSBcIi4vVmlzQ29tcG9uZW50XCI7XG5pbXBvcnQge0QzU2VsfSBmcm9tIFwiLi4vZXRjL1V0aWxcIjtcbmltcG9ydCB7U2ltcGxlRXZlbnRIYW5kbGVyfSBmcm9tIFwiLi4vZXRjL1NpbXBsZUV2ZW50SGFuZGxlclwiO1xuaW1wb3J0IHtQYWludFNlbGVjdFdpZGdldH0gZnJvbSBcInBhaW50X3NlbGVjdFwiO1xuaW1wb3J0IHtHYW50ZXJBUEksIEltYWdlTWFza30gZnJvbSBcIi4uL2FwaS9HYW50ZXJBUElcIjtcblxuXG5leHBvcnQgdHlwZSBQYWludFNlbGVjdFZpZXdEYXRhID0ge1xuICAgIGltYWdlOiBIVE1MSW1hZ2VFbGVtZW50LFxuICAgIGltYWdlSUQ/OiBzdHJpbmcsXG4gICAgcmVzZXRTZWxlY3Rpb24/OiBib29sZWFuXG59XG5cbmV4cG9ydCBjbGFzcyBQYWludFNlbGVjdFZpZXcgZXh0ZW5kcyBWQ29tcG9uZW50PFBhaW50U2VsZWN0Vmlld0RhdGE+IHtcbiAgICBwcm90ZWN0ZWQgb3B0aW9uczogeyBba2V5OiBzdHJpbmddOiBhbnk7IHBvczogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgfTsgfTtcbiAgICBwcm90ZWN0ZWQgY3NzX25hbWUgPSBcIlBhaW50U2VsZWN0Vmlld1wiO1xuICAgIHByb3RlY3RlZCBfY3VycmVudDoge307XG4gICAgcHJpdmF0ZSBwc3c6IFBhaW50U2VsZWN0V2lkZ2V0O1xuXG5cbiAgICBwdWJsaWMgc3RhdGljIGV2ZW50cyA9IHtcbiAgICAgICAgbWFza0NoYW5nZWQ6IFwiUGFpbnRTZWxlY3RWaWV3X21jXCJcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihfcGFyZW50OiBEM1NlbCwgX2V2ZW50SGFuZGxlcjogU2ltcGxlRXZlbnRIYW5kbGVyKSB7XG4gICAgICAgIHN1cGVyKF9wYXJlbnQsIF9ldmVudEhhbmRsZXIpO1xuICAgICAgICB0aGlzLnN1cGVySW5pdEhUTUwoKTtcbiAgICAgICAgLy8gVE9ETzpoYWNrXG4gICAgICAgIC8vIHRoaXMuYmFzZS5hdHRyKCdjbGFzcycsICcnKTtcbiAgICAgICAgdGhpcy5faW5pdCgpO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfaW5pdCgpIHtcbiAgICAgICAgdGhpcy5wc3cgPSBuZXcgUGFpbnRTZWxlY3RXaWRnZXQodGhpcy5iYXNlLm5vZGUoKSwge1xuICAgICAgICAgICAgb3ZlcmxheU1vZGlmaWVkOiAobWUsIG1hc2spID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpcmVNYXNrRXZlbnQobWFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIG51bGwsIDEpO1xuICAgICAgICB0aGlzLnBzdy5yYWRpdXMgPSAyMDtcbiAgICAgICAgdGhpcy5wc3cuZHJhd0NvbG9yID0gJyNmMDYwNjknO1xuICAgICAgICB0aGlzLnBzdy5hbHBoYSA9IC4zO1xuICAgIH1cblxuICAgIHByaXZhdGUgZmlyZU1hc2tFdmVudChtYXNrKSB7XG4gICAgICAgIGNvbnN0IGltZ01hc2s6IEltYWdlTWFzayA9IHtcbiAgICAgICAgICAgIGlkOiB0aGlzLnJlbmRlckRhdGEuaW1hZ2VJRCB8fCAtMSxcbiAgICAgICAgICAgIG1hc2tcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmV2ZW50SGFuZGxlci50cmlnZ2VyKFBhaW50U2VsZWN0Vmlldy5ldmVudHMubWFza0NoYW5nZWQsXG4gICAgICAgICAgICBpbWdNYXNrXG4gICAgICAgIClcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgX3dyYW5nbGUoZGF0YTogUGFpbnRTZWxlY3RWaWV3RGF0YSkge1xuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cblxuICAgIHByb3RlY3RlZCBfcmVuZGVyKHJEOiBQYWludFNlbGVjdFZpZXdEYXRhID0gdGhpcy5yZW5kZXJEYXRhKTogdm9pZCB7XG4gICAgICAgIHRoaXMucHN3LmJhY2tncm91bmRJbWFnZSA9IHJELmltYWdlO1xuICAgICAgICB0aGlzLnBzdy5yZWRyYXcoKTtcbiAgICB9XG5cblxuICAgIC8vIHByaXZhdGUgc2VsZWN0aW9uTW9kaWZpZWQobWUsIG1hc2spIHtcbiAgICAvL1xuICAgIC8vICAgICBjb25zb2xlLmxvZyh0aGlzLCBcIi0tLSB0aGlzXCIpO1xuICAgIC8vICAgICBjb25zdCBpbWdNYXNrOiBJbWFnZU1hc2sgPSB7XG4gICAgLy8gICAgICAgICBpZDogdGhpcy5yZW5kZXJEYXRhLmJhY2tncm91bmRJbWFnZUlEIHx8IC0xLFxuICAgIC8vICAgICAgICAgbWFza1xuICAgIC8vICAgICB9XG4gICAgLy9cbiAgICAvLyAgICAgdGhpcy5ldmVudEhhbmRsZXIudHJpZ2dlcihQYWludFNlbGVjdFZpZXcuZXZlbnRzLm1hc2tDaGFuZ2VkLFxuICAgIC8vICAgICAgICAgaW1nTWFza1xuICAgIC8vICAgICApXG4gICAgLy9cbiAgICAvL1xuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZyhtZSwgaW1hZ2UsXCItLS0gbWUsIGltYWdlXCIpO1xuICAgIC8vIH1cblxuICAgIHByaXZhdGUgcmVzZXRTZWxlY3Rpb24oKSB7XG4gICAgICAgIHRoaXMucHN3LnJlc2V0KClcbiAgICB9XG5cbiAgICBnZXQgaW1hZ2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBzdy5iYWNrZ3JvdW5kSW1hZ2U7XG4gICAgfVxuXG4gICAgZ2V0IGltYWdlSUQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlbmRlckRhdGEuaW1hZ2VJRDtcbiAgICB9XG5cblxuICAgIHNldCB6b29tKHopIHtcbiAgICAgICAgdGhpcy5wc3cuem9vbSA9IHo7XG4gICAgfVxuXG4gICAgc2V0IG9wYWNpdHkobzogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMucHN3LmFscGhhID0gbztcbiAgICB9XG5cblxuICAgIHJlc2V0KHN1cHJlc3NFdmVudCA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMucHN3LnJlc2V0KCk7XG4gICAgICAgIGlmICghc3VwcmVzc0V2ZW50KSB7XG4gICAgICAgICAgICB0aGlzLmZpcmVNYXNrRXZlbnQodGhpcy5wc3cuY3VycmVudE1hc2spXG4gICAgICAgIH1cbiAgICB9XG59IiwiLyoqXG4gKiBDcmVhdGVkIGJ5IEhlbmRyaWsgU3Ryb2JlbHQgKGhlbmRyaWsuc3Ryb2JlbHQuY29tKSBvbiAxMi8zLzE2LlxuICovXG5pbXBvcnQgKiBhcyBkMyBmcm9tICdkMydcbmltcG9ydCB7RDNTZWwsIFV0aWx9IGZyb20gXCIuLi9ldGMvVXRpbFwiO1xuaW1wb3J0IHtTaW1wbGVFdmVudEhhbmRsZXJ9IGZyb20gXCIuLi9ldGMvU2ltcGxlRXZlbnRIYW5kbGVyXCI7XG5pbXBvcnQge1NWR30gZnJvbSBcIi4uL2V0Yy9TVkdwbHVzXCI7XG5cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFZDb21wb25lbnQ8RGF0YUludGVyZmFjZT4ge1xuXG4gICAgLy8gU1RBVElDIEZJRUxEUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8qKlxuICAgICAqIFRoZSBzdGF0aWMgcHJvcGVydHkgdGhhdCBjb250YWlucyBhbGwgY2xhc3MgcmVsYXRlZCBldmVudHMuXG4gICAgICogU2hvdWxkIGJlIG92ZXJ3cml0dGVuIGFuZCBldmVudCBzdHJpbmdzIGhhdmUgdG8gYmUgdW5pcXVlISFcbiAgICAgKi9cblxuICAgIHN0YXRpYyBldmVudHM6IHt9ID0ge25vRXZlbnQ6ICdWQ29tcG9uZW50X25vRXZlbnQnfTtcblxuICAgIC8qKlxuICAgICAqIHNldCBvZiBBTEwgb3B0aW9ucyBhbmQgdGhlaXIgZGVmYXVsdHNcbiAgICAgKiBFeGFtcGxlOlxuICAgICAqIHtcbiAgICAgICAgcG9zOiB7eDogMTAsIHk6IDEwfSxcbiAgICAgICAgLy8gTGlzdCBvZiBFdmVudHMgdGhhdCBhcmUgT05MWSBoYW5kbGVkIGdsb2JhbGx5OlxuICAgICAgICBnbG9iYWxFeGNsdXNpdmVFdmVudHM6IFtdXG4gICAgfTtcbiAgICAgKlxuICAgICAqL1xuICAgICAgICAvLyBhYnN0cmFjdCByZWFkb25seSBkZWZhdWx0T3B0aW9ucztcblxuXG4gICAgICAgIC8vIC8qKlxuICAgICAgICAvLyAgKiBEZWZpbmVzIHRoZSBsYXllcnMgaW4gU1ZHICBmb3IgYmcsbWFpbixmZywuLi5cbiAgICAgICAgLy8gICovXG4gICAgICAgIC8vIHByb3RlY3RlZCBhYnN0cmFjdCByZWFkb25seSBsYXlvdXQ6IHsgbmFtZTogc3RyaW5nLCBwb3M6IG51bWJlcltdIH1bXSA9IFt7bmFtZTogJ21haW4nLCBwb3M6IFswLCAwXX1dO1xuXG5cbiAgICBwcm90ZWN0ZWQgaWQ6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgcGFyZW50OiBEM1NlbDtcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3Qgb3B0aW9uczogeyBwb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgW2tleTogc3RyaW5nXTogYW55IH07XG4gICAgcHJvdGVjdGVkIGJhc2U6IEQzU2VsO1xuICAgIHByb3RlY3RlZCBsYXllcnM6IHsgbWFpbj86IEQzU2VsLCBmZz86IEQzU2VsLCBiZz86IEQzU2VsLCBba2V5OiBzdHJpbmddOiBEM1NlbCB9O1xuICAgIHByb3RlY3RlZCBldmVudEhhbmRsZXI6IFNpbXBsZUV2ZW50SGFuZGxlcjtcbiAgICBwcm90ZWN0ZWQgX3Zpc2liaWxpdHk6IHsgaGlkZGVuOiBib29sZWFuLCBoaWRlRWxlbWVudD86IEQzU2VsIHwgbnVsbDsgW2tleTogc3RyaW5nXTogYW55IH07XG4gICAgcHJvdGVjdGVkIGRhdGE6IERhdGFJbnRlcmZhY2U7XG4gICAgcHJvdGVjdGVkIHJlbmRlckRhdGE6IGFueTtcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgY3NzX25hbWU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgYWJzdHJhY3QgX2N1cnJlbnQ6IHt9O1xuXG4gICAgLy8gQ09OU1RSVUNUT1IgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuICAgIC8qKlxuICAgICAqIFNpbXBsZSBjb25zdHJ1Y3Rvci4gU3ViY2xhc3NlcyBzaG91bGQgY2FsbCBAc3VwZXJJbml0KG9wdGlvbnMpIGFzIHdlbGwuXG4gICAgICogc2VlIHdoeSBoZXJlOiBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MzU5NTk0My93aHktYXJlLWRlcml2ZWQtY2xhc3MtcHJvcGVydHktdmFsdWVzLW5vdC1zZWVuLWluLXRoZS1iYXNlLWNsYXNzLWNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiB0ZW1wbGF0ZTpcbiAgICAgY29uc3RydWN0b3IoZDNQYXJlbnQ6IEQzU2VsLCBldmVudEhhbmRsZXI/OiBTaW1wbGVFdmVudEhhbmRsZXIsIG9wdGlvbnM6IHt9ID0ge30pIHtcbiAgICAgICAgc3VwZXIoZDNQYXJlbnQsIGV2ZW50SGFuZGxlcik7XG4gICAgICAgIC8vIC0tIGFjY2VzcyB0byBzdWJjbGFzcyBwYXJhbXM6XG4gICAgICAgIHRoaXMuc3VwZXJJbml0KG9wdGlvbnMpO1xuICAgICB9XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0QzU2VsfSBkM3BhcmVudCAgRDMgc2VsZWN0aW9uIG9mIHBhcmVudCBTVkcgRE9NIEVsZW1lbnRcbiAgICAgKiBAcGFyYW0ge1NpbXBsZUV2ZW50SGFuZGxlcn0gZXZlbnRIYW5kbGVyIGEgZ2xvYmFsIGV2ZW50IGhhbmRsZXIgb2JqZWN0IG9yICdudWxsJyBmb3IgbG9jYWwgZXZlbnQgaGFuZGxlclxuICAgICAqL1xuICAgIHByb3RlY3RlZCBjb25zdHJ1Y3RvcihkM3BhcmVudDogRDNTZWwsIGV2ZW50SGFuZGxlcj86IFNpbXBsZUV2ZW50SGFuZGxlcikge1xuICAgICAgICB0aGlzLmlkID0gVXRpbC5zaW1wbGVVSWQoe30pO1xuXG4gICAgICAgIHRoaXMucGFyZW50ID0gZDNwYXJlbnQ7XG5cbiAgICAgICAgLy8gSWYgbm90IGZ1cnRoZXIgc3BlY2lmaWVkIC0gY3JlYXRlIGEgbG9jYWwgZXZlbnQgaGFuZGxlciBib3VuZCB0byB0aGUgYmFzIGVsZW1lbnRcbiAgICAgICAgdGhpcy5ldmVudEhhbmRsZXIgPSBldmVudEhhbmRsZXIgfHxcbiAgICAgICAgICAgIG5ldyBTaW1wbGVFdmVudEhhbmRsZXIodGhpcy5wYXJlbnQubm9kZSgpKTtcblxuICAgICAgICAvLyBPYmplY3QgZm9yIHN0b3JpbmcgaW50ZXJuYWwgc3RhdGVzIGFuZCB2YXJpYWJsZXNcbiAgICAgICAgdGhpcy5fdmlzaWJpbGl0eSA9IHtoaWRkZW46IGZhbHNlfTtcblxuICAgIH1cblxuXG4gICAgLy8gcHJvdGVjdGVkIGNyZWF0ZVN2Z0xheWVycyhsYXllcnM9WydiZycsJ21haW4nLCdmZyddKXtcbiAgICAvLyAgICAgdGhpcy5fbGF5ZXJzID0ge31cbiAgICAvLyAgICAgdGhpcy5iYXNlID0gU1ZHLmdyb3VwKHRoaXMucGFyZW50LFxuICAgIC8vICAgICAgICAgICAgIHRoaXMuY3NzX25hbWUgKyAnIElEJyArIHRoaXMuaWQsXG4gICAgLy8gICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBvcyk7XG4gICAgLy9cbiAgICAvLyB9XG5cbiAgICBwcm90ZWN0ZWQgc3VwZXJJbml0SFRNTChvcHRpb25zOiB7fSA9IHt9KSB7XG4gICAgICAgIE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goa2V5ID0+IHRoaXMub3B0aW9uc1trZXldID0gb3B0aW9uc1trZXldKTtcbiAgICAgICAgdGhpcy5iYXNlID0gdGhpcy5wYXJlbnQuYXBwZW5kKCdkaXYnKVxuICAgICAgICAgICAgLmNsYXNzZWQodGhpcy5jc3NfbmFtZSwgdHJ1ZSlcblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogSGFzIHRvIGJlIGNhbGxlZCBhcyBsYXN0IGNhbGwgaW4gc3ViY2xhc3MgY29uc3RydWN0b3IuXG4gICAgICogQHBhcmFtIHt7fX0gb3B0aW9uc1xuICAgICAqIEBwYXJhbSBkZWZhdWx0TGF5ZXJzIC0tIGNyZWF0ZSB0aGUgZGVmYXVsdCA8Zz4gbGF5ZXJzOiBiZyAtPiBtYWluIC0+IGZnXG4gICAgICovXG4gICAgcHJvdGVjdGVkIHN1cGVySW5pdFNWRyhvcHRpb25zOiB7fSA9IHt9LCBkZWZhdWx0TGF5ZXJzID0gWydiZycsICdtYWluJywgJ2ZnJ10pIHtcbiAgICAgICAgLy8gU2V0IGRlZmF1bHQgb3B0aW9ucyBpZiBub3Qgc3BlY2lmaWVkIGluIGNvbnN0cnVjdG9yIGNhbGxcbiAgICAgICAgLy8gY29uc3QgZGVmYXVsdHMgPSB0aGlzLmRlZmF1bHRPcHRpb25zO1xuICAgICAgICAvLyB0aGlzLm9wdGlvbnMgPSB7fTtcbiAgICAgICAgLy8gY29uc3Qga2V5cyA9IG5ldyBTZXQoWy4uLk9iamVjdC5rZXlzKGRlZmF1bHRzKSwgLi4uT2JqZWN0LmtleXMob3B0aW9ucyldKTtcbiAgICAgICAgLy8ga2V5cy5mb3JFYWNoKGtleSA9PiB0aGlzLm9wdGlvbnNba2V5XSA9IChrZXkgaW4gb3B0aW9ucykgPyBvcHRpb25zW2tleV0gOiBkZWZhdWx0c1trZXldKTtcbiAgICAgICAgT2JqZWN0LmtleXMob3B0aW9ucykuZm9yRWFjaChrZXkgPT4gdGhpcy5vcHRpb25zW2tleV0gPSBvcHRpb25zW2tleV0pO1xuXG5cbiAgICAgICAgdGhpcy5sYXllcnMgPSB7fTtcblxuICAgICAgICAvLyBDcmVhdGUgdGhlIGJhc2UgZ3JvdXAgZWxlbWVudFxuICAgICAgICB0aGlzLmJhc2UgPSBTVkcuZ3JvdXAodGhpcy5wYXJlbnQsXG4gICAgICAgICAgICB0aGlzLmNzc19uYW1lICsgJyBJRCcgKyB0aGlzLmlkLFxuICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBvcyk7XG5cblxuICAgICAgICAvLyBjcmVhdGUgZGVmYXVsdCBsYXllcnM6IGJhY2tncm91bmQsIG1haW4sIGZvcmVncm91bmRcbiAgICAgICAgaWYgKGRlZmF1bHRMYXllcnMpIHtcbiAgICAgICAgICAgIC8vIGNvbnN0cnVjdGlvbiBvcmRlciBpcyBpbXBvcnRhbnQgIVxuICAgICAgICAgICAgZGVmYXVsdExheWVycy5mb3JFYWNoKGxheWVyID0+e1xuICAgICAgICAgICAgICAgIHRoaXMubGF5ZXJzW2xheWVyXSA9IFNWRy5ncm91cCh0aGlzLmJhc2UsIGxheWVyKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyB0aGlzLmxheWVycy5iZyA9IFNWRy5ncm91cCh0aGlzLmJhc2UsICdiZycpO1xuICAgICAgICAgICAgLy8gdGhpcy5sYXllcnMubWFpbiA9IFNWRy5ncm91cCh0aGlzLmJhc2UsICdtYWluJyk7XG4gICAgICAgICAgICAvLyB0aGlzLmxheWVycy5mZyA9IFNWRy5ncm91cCh0aGlzLmJhc2UsICdmZycpO1xuICAgICAgICB9XG5cblxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogU2hvdWxkIGJlIG92ZXJ3cml0dGVuIHRvIGNyZWF0ZSB0aGUgc3RhdGljIERPTSBlbGVtZW50c1xuICAgICAqIEBhYnN0cmFjdFxuICAgICAqIEByZXR1cm4geyp9IC0tLVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBfaW5pdCgpO1xuXG4gICAgLy8gREFUQSBVUERBVEUgJiBSRU5ERVIgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvKipcbiAgICAgKiBFdmVyeSB0aW1lIGRhdGEgaGFzIGNoYW5nZWQsIHVwZGF0ZSBpcyBjYWxsZWQgYW5kXG4gICAgICogdHJpZ2dlcnMgd3JhbmdsaW5nIGFuZCByZS1yZW5kZXJpbmdcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBkYXRhIG9iamVjdFxuICAgICAqIEByZXR1cm4geyp9IC0tLVxuICAgICAqL1xuICAgIHVwZGF0ZShkYXRhOiBEYXRhSW50ZXJmYWNlKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIGlmICh0aGlzLl92aXNpYmlsaXR5LmhpZGRlbikgcmV0dXJuO1xuICAgICAgICB0aGlzLnJlbmRlckRhdGEgPSB0aGlzLl93cmFuZ2xlKGRhdGEpO1xuICAgICAgICB0aGlzLl9yZW5kZXIodGhpcy5yZW5kZXJEYXRhKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIERhdGEgd3JhbmdsaW5nIG1ldGhvZCAtLSBpbXBsZW1lbnQgaW4gc3ViY2xhc3MuIFJldHVybnMgdGhpcy5yZW5kZXJEYXRhLlxuICAgICAqIFNpbXBsZXN0IGltcGxlbWVudGF0aW9uOiBgcmV0dXJuIGRhdGE7YFxuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGRhdGFcbiAgICAgKiBAcmV0dXJucyB7Kn0gLS0gZGF0YSBpbiByZW5kZXIgZm9ybWF0XG4gICAgICogQGFic3RyYWN0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGFic3RyYWN0IF93cmFuZ2xlKGRhdGEpO1xuXG5cbiAgICAvKipcbiAgICAgKiBJcyByZXNwb25zaWJsZSBmb3IgbWFwcGluZyBkYXRhIHRvIERPTSBlbGVtZW50c1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSByZW5kZXJEYXRhIHByZS1wcm9jZXNzZWQgKHdyYW5nbGVkKSBkYXRhXG4gICAgICogQGFic3RyYWN0XG4gICAgICogQHJldHVybnMgeyp9IC0tLVxuICAgICAqL1xuICAgIHByb3RlY3RlZCBhYnN0cmFjdCBfcmVuZGVyKHJlbmRlckRhdGEpOiB2b2lkO1xuXG5cbiAgICAvLyBVUERBVEUgT1BUSU9OUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvKipcbiAgICAgKiBVcGRhdGVzIGluc3RhbmNlIG9wdGlvbnNcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBvbmx5IHRoZSBvcHRpb25zIHRoYXQgc2hvdWxkIGJlIHVwZGF0ZWRcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlUmVuZGVyIGlmIG9wdGlvbiBjaGFuZ2UgcmVxdWlyZXMgYSByZS1yZW5kZXJpbmcgKGRlZmF1bHQ6ZmFsc2UpXG4gICAgICogQHJldHVybnMgeyp9IC0tLVxuICAgICAqL1xuICAgIHVwZGF0ZU9wdGlvbnMob3B0aW9ucywgcmVSZW5kZXIgPSBmYWxzZSkge1xuICAgICAgICBPYmplY3Qua2V5cyhvcHRpb25zKS5mb3JFYWNoKGsgPT4gdGhpcy5vcHRpb25zW2tdID0gb3B0aW9uc1trXSk7XG4gICAgICAgIGlmIChyZVJlbmRlcikgdGhpcy5fcmVuZGVyKHRoaXMucmVuZGVyRGF0YSk7XG4gICAgfVxuXG5cbiAgICAvLyA9PT0gQ09OVkVOSUVOQ0UgPT09PVxuXG5cbiAgICBzZXRIaWRlRWxlbWVudChoRTogRDNTZWwpIHtcbiAgICAgICAgdGhpcy5fdmlzaWJpbGl0eS5oaWRlRWxlbWVudCA9IGhFO1xuICAgIH1cblxuICAgIGhpZGVWaWV3KCkge1xuICAgICAgICBpZiAoIXRoaXMuX3Zpc2liaWxpdHkuaGlkZGVuKSB7XG4gICAgICAgICAgICBjb25zdCBoRSA9IHRoaXMuX3Zpc2liaWxpdHkuaGlkZUVsZW1lbnQgfHwgdGhpcy5wYXJlbnQ7XG4gICAgICAgICAgICBoRS50cmFuc2l0aW9uKCkuc3R5bGVzKHtcbiAgICAgICAgICAgICAgICAnb3BhY2l0eSc6IDAsXG4gICAgICAgICAgICAgICAgJ3BvaW50ZXItZXZlbnRzJzogJ25vbmUnXG4gICAgICAgICAgICB9KS5zdHlsZSgnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmlsaXR5LmhpZGRlbiA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmhpZGVWaWV3KCkge1xuICAgICAgICBpZiAodGhpcy5fdmlzaWJpbGl0eS5oaWRkZW4pIHtcbiAgICAgICAgICAgIGNvbnN0IGhFID0gdGhpcy5fdmlzaWJpbGl0eS5oaWRlRWxlbWVudCB8fCB0aGlzLnBhcmVudDtcbiAgICAgICAgICAgIGhFLnRyYW5zaXRpb24oKS5zdHlsZXMoe1xuICAgICAgICAgICAgICAgICdvcGFjaXR5JzogMSxcbiAgICAgICAgICAgICAgICAncG9pbnRlci1ldmVudHMnOiBudWxsLFxuICAgICAgICAgICAgICAgICdkaXNwbGF5JzogbnVsbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLl92aXNpYmlsaXR5LmhpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gdGhpcy51cGRhdGUodGhpcy5kYXRhKTtcblxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5iYXNlLnJlbW92ZSgpO1xuICAgIH1cblxufVxuXG4iXSwic291cmNlUm9vdCI6IiJ9