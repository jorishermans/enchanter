/** @flow */
import * as fs from 'fs';
import {Engine} from './engine';
import {Response} from './response';
import {Request} from './request';
import {PathLayer} from './pathlayer';
import {EventEmitter} from 'events';
import {ncp} from 'ncp';

/** Application class, the barebone of enchanter */
class Application extends EventEmitter {
    
    settings: Map<string, any>;
    pages: PathLayer[];
    engines: any;
    engine: Engine;
    generating: boolean = false;

    constructor() {
        super();
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
        this.emit('all');
    }

    /**
     * is the same as in express, to capture middleware ... 
     * for now we try to capture the static middleware of express
     *
     * @param {Function} fn, the one that we need to take under the loop
     * @public
     */
    use(fn: Function) {
        this.use('/', fn);
    }

    /**
     * is the same as in express, to capture middleware ... 
     * for now we try to capture the static middleware of express
     *
     * @param {Function} fn, the one that we need to take under the loop
     * @param {string} path, the path of the string in question ...
     * @public
     */
    use(path: string, fn: Function) {
        console.log(fn);
        console.log('live');
        console.log(fn.name);
        if (fn.name === 'serveStatic') {
            // output directory
            console.log('serve static');

            var output = this._get('output');
            if (!output) output = __dirname + "/out";
            if (!path.startsWith('/')) path = '/' + path;
            if (!path.endsWith('/')) path = path + '/';
            
            var response = new Response(this.engine, `${output.toString()}${path}`, true);
            var request = new Request(path, {}, undefined, this);
            
            fn(request, response);
        }
    }

    /**
     * generate a specific page, with its according route name
     *
     * @param {String} page, the route name that is been registered in the map
     * @public
     */
    generate(page: string) {
        let ending = false;
        if (!this.generating) { ending = true; this.generating = true; }
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
        if (ending) {
            this.generating = false;
            this.emit('after', page);
        } 
    }

    /**
     * Adding a shortcut to the generate function, it generates a specific page.
     *
     * @param {String} page, the route name that is been registered in the map
     * @public
     */
    gen = (page: string) => this.generate(page);

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
        if (express !== undefined && express.static !== undefined) {
            express.static = serveStatic;
        } 
        return new Application();
    }
};

function serveStatic(path: string) {
    console.log('we execute static with ' + path);
    var serveStatic = function(request, response, next) {
        console.log('copy: ', path, response.output);
        ncp(path, response.output, function (err) {
            if (err) return console.error(err)
            console.log("success!");
        });
    }
    return serveStatic;
}