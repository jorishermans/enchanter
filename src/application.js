/** @flow */
import * as fs from 'fs';
import {Engine} from './engine';
import {Response} from './response';
import {Request} from './request';
import {PathLayer} from './pathlayer';

/** Application class, the barebone of enchanter */
class Application {
    
    settings: Map<string, any>;
    pages: PathLayer[];
    engines: any;
    engine: Engine;

    constructor() {
        this.settings = new Map();
        this.pages = [];
    }

    init() {
        if (!this.engine) {
            var options:any = {
                defaultEngineName: this._get('view engine'),
                defaultEngine: this._get('view module'),
                root: this._get('views'),
                engines: []
            };
            this.engine = new Engine(options);
        }
    }

    /**
     * Assign `setting` to `val`, or return `setting`'s value.
     *
     *    app.set('foo', 'bar');
     *    app.get('foo');
     *    // => "bar"
     *
     * Mounted servers inherit their parent server's settings.
     *
     * @param {String} setting
     * @param {*} [val]
     * @return {Server} for chaining
     * @public
     */
     set(setting: string, value: ?Object) {
        if (arguments.length === 1) {
            // app.get(setting)
            return this.settings.get(setting);
        }
        // set value
        this.settings.set(setting, value);

        return this;
    }

    /**
     * return `setting`'s value.
     *    
     *    app.get('foo');
     *    // => "bar"
     *
     * @param {String} setting
     * @param {*} [val]
     * @return {Server} for chaining
     * @public
     */
     _get(setting: string) {
        return this.set(setting);
     }

    /**
     * Adding a page to the application
     *
     *    app.page('/', (context) => {
     *    });
     *
     * Mounted servers inherit their parent server's settings.
     *
     * @param {String} path
     * @param {*} [fn] function to bind
     * @return {Server} for chaining
     * @public
     */
     page(path: string, fn: Function) {
        this.pages.push(new PathLayer(path, {}, fn));
        return this;
     }

     /**
     * Adding a page to the application
     *
     *    app.all('/', (context) => {
     *    });
     *
     * Mounted servers inherit their parent server's settings.
     *
     * @param {String} path
     * @param {*} [fn] function to bind
     * @return {Server} for chaining
     * @public
     */
     all = (path: string, fn: Function) => this.page(path, fn);
     get = (path: string, fn: Function) => this.page(path, fn);
     post = (path: string, fn: Function) => this.page(path, fn);
     put = (path: string, fn: Function) => this.page(path, fn);
     del = (path: string, fn: Function) => this.page(path, fn);
     
    /**
     * Generate all the pages that are registered in this application
     * 
     */
    generateAll() {
        console.log("generate files");

        // iterate over all the pages and execute them
        for (let layer: PathLayer of this.pages) {
             this.generate(layer.route);
        };
    }

    /**
     * generate a specific page, with its according route name
     *
     * @param {String} page, the route name that is been registered in the map
     * @public
     */
    generate(page: string) {
        console.log(`start generate ${page}`);
        // first initialize objects
        this.init();

        // iterate over all the pages that are registered
        // views directory with the templates
        var views = this._get('views');
        if (!views) views = __dirname + "/views";
        // output directory
        var output = this._get('output');
        if (!output) output = __dirname + "/out";

        let pathLayer = this.matchOnPage(page);
        // do something with obj
        if (pathLayer != null) {
            var response = new Response(this.engine, `${output.toString()}${page}`);
            var request = new Request(page, pathLayer.params, pathLayer, this);
            pathLayer.handle.call(this, request, response); 
            console.log(`generate files ${page}`);
        }
    }

    matchOnPage(page: string) {
        for (let layer: PathLayer of this.pages) {
            if (layer.match(page)) {
                return layer;
            }
        }
        return null;
    }
}

module.exports = function(express: any) {
    if ((process.argv[2] === '--dynamic' || process.argv[2] === '-d') && express !== undefined) {
        return express();
    } else {
        return new Application();
    }
};