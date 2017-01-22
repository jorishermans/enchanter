/** @flow */
import * as fs from 'fs';
import {Engine} from './engine';
import {Context} from './context';
/** Application class, the barebone of enchanter */
class Application {
    
    settings: Map<string, any>;
    pages: Map<string, Function>;
    engines: any;
    engine: Engine;

    constructor() {
        this.settings = new Map();
        this.pages = new Map();
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
        this.pages.set(path, fn);
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
    generate() {
        console.log("generate files");
        // first initialize objects
        this.init();

        // iterate over all the pages that are registered
        // views directory with the templates
        var views = this._get('views');
        if (!views) views = __dirname + "/views";
        // output directory
        var output = this._get('output');
        if (!output) output = __dirname + "/out";

        console.log(Object.keys(this.pages));
        console.log(this.pages.keys());
        // iterate over all the pages and execute them
        for (let key of this.pages.keys()) {
            console.log(key);
            let fnRender = this.pages.get(key);
            // do something with obj
            if (fnRender) {
                var context = new Context(this.engine, `${output.toString()}${key}`);
                fnRender.call(this, context); 
                console.log("generate files "+ key);
            }
            
            // render file
            // fs.readFile
        };
    }
}

module.exports = Application;