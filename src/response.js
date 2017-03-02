/** @flow */
import {Engine} from './engine';
import * as fs from 'fs';
import * as path from 'path';

/**
 * With this class we have a response object that can be passed to our object when generating a file.
 * 
 * In this class we will write our file.
 */
export class Response {

    engine: Engine;
    output: string;
    wstream: fs.WriteStream;

    constructor(engine: Engine, output: string, folder: boolean = false) {
        this.engine = engine;
        this.output = output;

        // output that needs to be rendered
        if (this.output.endsWith('/') && !folder) this.output += 'index';
        if (!this.output.startsWith('./') && this.output.startsWith('/')) this.output = '.' + this.output;
        if (!this.output.startsWith('./') && !this.output.startsWith('/')) this.output = './' + this.output;
        if (!this.output.endsWith('/') && !folder) this.output += '.html';
        if (!this.output.endsWith('/') && folder) this.output += '/';
        
        // search for real file output ...
        // create file on the right place ...
        console.log(this.output);
        this.createFoldersWhenNotExist();
        this.wstream = fs.createWriteStream(this.output);
    }

    /**
     * create output folder when folder not exist
     *
     * @public
     */
    createFoldersWhenNotExist() {
        let allDirs = this.output.split('/'), dir_builder = '';
        for (let i = 0; i<allDirs.length-1;i++) {
            let dir = allDirs[i];
            dir_builder += dir; 
            if (dir !== '.') {
                if (!fs.existsSync(dir_builder)) {
                    fs.mkdirSync(dir_builder);
                }
            }
            dir_builder += '/'; 
        }
    }

    /**
     * Rendering out template name with a certain model
     *
     * @param {String} templateName
     * @param {*} [model]
     * @public
     */
    render(templateName : string, model : any) {
        console.log(`going to render ${templateName} with ${JSON.stringify(model)}`);
        this.engine.use(templateName, model, (err, rendered) => {
            if (err) console.warn("Could not render properly", err);
            // get content and write it to the correct output folder
            this.wstream.write(rendered);
            this.wstream.end();
        });
    }

    /**
     * Write some text to our file so we can generate that file at the end
     *
     * @param {String} output
     * @public
     */
    write(output: string) {
        this.wstream.write(output);
    }

    /**
     * Close our WriteStream
     *
     * @param {String} output
     * @public
     */
    end() {
        this.wstream.end();
    }

}