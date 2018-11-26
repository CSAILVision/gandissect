/**
 * Created by hen on 5/15/17.
 */

export default class URLHandler {

    static basicURL() {
        const url_path = window.location.pathname.split('/').slice(0, -2).join('/');

        return window.location.origin + (url_path.length ? url_path : '');
    }

    /**
     * Read all URL parameters into a map.
     * @returns {Map} the url parameters as a key-value store (ES6 map)
     */
    static get parameters(): object {
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
            } else if (isFloat(val)) {
                return Number.parseFloat(val);
            }
            // else:
            return val;
        }


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
                } else if (isArray) {
                    urlParameters[key] = raw_value.split(',')
                        .map(val => typeCast(val));
                } else {
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
    static urlString(urlParameters: object) {
        const attr = [];
        Object.keys(urlParameters).forEach(k => {
            const v = urlParameters[k];
            if (v !== undefined) {
                let value = v;
                if (Array.isArray(v)) value = '..' + v.join(',');
                attr.push(encodeURI(k + '=' + value))
            }
        });


        const url = window.location.pathname;
        let res = url.substring(url.lastIndexOf('/') + 1);
        if (attr.length > 0) {
            res += '?' + attr.join('&')
        }

        return res;
    }

    static updateURLParam(key: string, value: string | any[], addToBrowserHistory = true) {
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


    static updateUrl(urlParameters: object, addToBrowserHistory = true) {
        if (addToBrowserHistory) {
            window.history.pushState(urlParameters, '',
                URLHandler.urlString(urlParameters))
        } else {
            window.history.replaceState(urlParameters, '',
                URLHandler.urlString(urlParameters))
        }
    }

}