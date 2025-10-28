import * as PIXI from "pixi.js";
import gsap from "gsap";

import { UIConfig } from "../configs/UIConfig";
import { IViewElementsConfig } from "../utilies/interfaces/configs/utilies/IViewElementsConfig";
import { BaseGameViewElement } from "./BaseGameViewElement";

export class CounterView extends BaseGameViewElement {

    private startCount: number = 0;

    private text: PIXI.Text;

    private timeout!: NodeJS.Timeout;

    constructor(config: IViewElementsConfig) {
        super(config);

        const { x , y } = config.innerElementPosition["1"];

        this.text = new PIXI.Text({style: UIConfig.placeHolderResultTextStyle});
        this.text.anchor.set(0.5);
        this.text.x = x;
        this.text.y = y;

        this.addChild(this.text);

        this.visible = false;
        this.alpha = 0;
    }

    public startCounter(startCount: number) {
        this.show();

        this.startCount = startCount;
        this.text.text = startCount;

        this.timeout = setInterval(() => {
            this.startCount--;

            if (this.startCount <= 0) {
                this.text.text = "0";
                this.text.tint = UIConfig.redTint;

                clearInterval(this.timeout);
                return;
            }

            this.text.text = this.startCount;
        }, 1000)
    }

    public showText(text: string) {
        this.text.text = text;
        this.scaleText();
        this.show();
    }

    public show() {
        this.visible = true;
        gsap.to(this, {
            alpha: 1,
            duration: 0.25
        })
    }

    public hide() {
        gsap.to(this, {
            alpha: 0,
            duration: 0.25
        })
        this.visible = false;
    }

    public scaleText() {
        const { width, height } = this.config.dimension;

        const scale = Math.min(width * 0.80 / (this.text.width/ this.text.scale.x), height * 0.8 / (this.text.height / this.text.scale.y));

        this.text.scale.set(scale);
    }
}