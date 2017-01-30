/** @flow */
import {PathLayer} from './pathlayer';
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