/** @flow */
import {PathLayer} from './pathlayer';
/**
 * With this class we have a request object that can be passed to our object when generating a file.
 * 
 * Most of the properties of the express request object are been represented here, if not please do a Pull Request
 */
export class Request {

    params: any;
    app: any;
    originalUrl: string;
    path: string;
    protocol: string = 'http';
    query: any = {};
    route: PathLayer;

    constructor(path: any, params: any, route: PathLayer, app: any) {
        this.params = params;
        this.app = app;
        this.originalUrl = path;
        this.path = path;
        this.route = route;
    }

}