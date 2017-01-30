/** @flow */
import {pathRegexp} from 'path-to-regexp';

var hasOwnProperty = Object.prototype.hasOwnProperty;

export class PathLayer {

  path: string;
  route: string = "";
  expression: string = "([^/]+?)";
  params: any;
  keys: any[];
  regexp: any;
  handle: Function;

  constructor(path: string, options: any, fn: Function) {
    let opts: any = options || {};

    this.handle = fn;
    this.params = undefined;
    this.path = '';
    this.route = path;
    this.regexp = pathRegexp(path, this.keys = [], opts);

    if (path === '/' && opts.end === false) {
        this.regexp.fast_slash = true;
    }
  }

  match(path: string) {
    if (path == null) {
        // no path, nothing matches
        this.params = undefined;
        this.path = '';
        return false;
    }

    if (this.regexp.fast_slash) {
        // fast path non-ending match for / (everything matches)
        this.params = {};
        this.path = '';
        return true;
    }

    let m = this.regexp.exec(path);
    if (!m) {
        this.params = undefined;
        this.path = '';
        return false;
    }

    // store values
    this.params = {};
    this.path = m[0];

    var keys = this.keys;
    var params = this.params;

    for (var i = 1; i < m.length; i++) {
        var key = keys[i - 1];
        var prop = key.name;
        var val = this.decode_param(m[i]);

        if (val !== undefined || !(hasOwnProperty.call(params, prop))) {
            params[prop] = val;
        }
    }

    return true;
  }

  decode_param(val: string) {
    if (typeof val !== 'string' || val.length === 0) {
        return val;
    }

    try {
        return decodeURIComponent(val);
    } catch (err) {
        if (err instanceof URIError) {
            err.message = 'Failed to decode param \'' + val + '\'';
            err.status = err.statusCode = 400;
        }
        throw err;
    }
  }

}