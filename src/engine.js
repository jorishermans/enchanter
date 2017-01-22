/** @flow */
import * as path from 'path';
import * as fs from 'fs';
import {default as resolve_engine} from './resolve_engine';

export class Engine {
    engines: any;
    defaultEngineName: string;
    defaultEngine: any;
    root: string;

    constructor(options: any) {
        var opts = options || {};

        this.defaultEngineName = opts.defaultEngineName;
        this.defaultEngine = opts.defaultEngine;
        this.engines = opts.engines;
        this.root = opts.root;
    }

    use(name: string, options: any, callback: Function) {
        var ext : string = path.extname(name);

        if (!ext && !this.defaultEngineName) {
            throw new Error('No default engine was specified and no extension was provided.');
        }

        var fileName = name;

        if (!ext) {
            // get extension from default engine name
            ext = this.defaultEngineName[0] !== '.'
            ? '.' + this.defaultEngineName
            : this.defaultEngineName;

            fileName += ext;
        }

        if (!this.engines[ext]) {
            // load engine
            if (!this.defaultEngine) this.defaultEngine = resolve_engine(ext.substr(1));
            this.engines[ext] = this.defaultEngine.__express;
        }

        // store loaded engine
        var engine = this.engines[ext];

        // render out our template with the given options, model.
        engine(this.lookup(fileName, ext), options, callback);
    }

    lookup(name: string, ext: string) {
        var resolvedPath:any;
        var roots: any[] = [].concat(this.root);

        for (var i = 0; i < roots.length && !resolvedPath; i++) {
            var root = roots[i];

            // resolve the path
            var loc = path.resolve(root, name);
            var dir = path.dirname(loc);
            var file = path.basename(loc);

            // resolve the file
            resolvedPath = this.resolve(dir, file, ext);
        }

        return resolvedPath;
    }

    /**
     * Resolve the file within the given directory.
     *
     * @param {string} dir
     * @param {string} file
     * @private
     */
    resolve(dir:string, file:string, ext:string) {
        // <path>.<ext>
        var resolvePath = path.join(dir, file);
        var stat = this.tryStat(resolvePath);

        if (stat && stat.isFile()) {
            return resolvePath;
        }

        // <path>/index.<ext>
        resolvePath = path.join(dir, path.basename(file, ext), 'index' + ext);
        stat = this.tryStat(resolvePath);

        if (stat && stat.isFile()) {
            return resolvePath;
        }
    };

    /**
     * Return a stat, maybe.
     *
     * @param {string} path
     * @return {fs.Stats}
     * @private
     */
    tryStat(path) {
        try {
            return fs.statSync(path);
        } catch (e) {
            return undefined;
        }
    }
}