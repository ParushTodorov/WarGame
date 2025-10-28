import * as PIXI from "pixi.js";

import { Application } from "../../Application";
import { IViewElementsConfig } from "../utilies/interfaces/configs/utilies/IViewElementsConfig";
import { BaseViewElement } from "./BaseViewElements";
import { IPosition } from "../utilies/interfaces/viewInterfaces/IPosition";

export class BaseGameViewElement extends BaseViewElement {
    protected sprite: PIXI.Sprite;
    protected addedElements: number = 0;

    constructor(protected config: IViewElementsConfig) {
        super();

        this.sprite = PIXI.Sprite.from(Application.APP.assetManager.getTexture(config.assetName));

        if (config.rotate) {
            this.sprite.anchor.set(0.5);
            this.sprite.rotation = -1.57
        }

        this.sprite.width = config.dimension.width;
        this.sprite.height = config.dimension.height;

        this.addChild(this.sprite);
    }

    public addElement<T extends PIXI.Container>(element: T) {
        this.addedElements++;
    }

    public removeElements<T extends PIXI.Container>(element: T) {
        this.addedElements--;
    }

    public clearElements<T extends PIXI.Container>(element: T) {
        this.addedElements = 0;
    }

    public getNextElementPosition(): IPosition {
        if (!this.config.innerElementPosition) {

            return {x: this.x, y: this.y};
        }

        return this.getElementPositionFromConfig(this.addedElements + 1)
    }

    public getElementPositionFromConfig(id: number): IPosition {
        let { x, y } = this.config.innerElementPosition[id];

        x += this.x;
        y += this.y;

        return {x, y};
    }
}