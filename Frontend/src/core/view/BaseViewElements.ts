import * as PIXI from "pixi.js";

import { Application } from "../../Application";

export class BaseViewElement extends PIXI.Container {
    protected app: Application;

    constructor() {
        super();

        this.app = Application.APP;
    }
}