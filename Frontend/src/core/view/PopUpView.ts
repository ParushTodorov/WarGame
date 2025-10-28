import * as PIXI from "pixi.js";
import gsap from "gsap";

import { BaseGameViewElement } from "./BaseGameViewElement";
import { IViewElementsConfig } from "../utilies/interfaces/configs/utilies/IViewElementsConfig";
import { UIConfig } from "../configs/UIConfig";

export class PopUpView extends BaseGameViewElement {
    private majorText: PIXI.Text;
    private smallText: PIXI.Text;

    private isResizable: boolean;

    constructor(config: IViewElementsConfig, numberOfMessages: 1 | 2 = 2, isResizable = true) {
        super(config);

        this.sprite.anchor.set(0.5);

        this.isResizable = isResizable;

        const majorStyle = this.createTextStyle(true);

        this.majorText = new PIXI.Text({style: majorStyle});
        this.majorText.anchor.set(0.5);
        this.addChild(this.majorText);

        this.majorText.style.wordWrap = numberOfMessages === 2;

        const smallStyle = this.createTextStyle(false);

        if (numberOfMessages === 2 ) {
            this.smallText = new PIXI.Text({style: smallStyle});
            this.smallText.anchor.set(0.5)
            this.addChild(this.smallText);

            this.smallText.x = 0;
            this.smallText.y = - this.sprite.height * 0.20;
        }

        this.onResize();

        this.visible = false;
        this.alpha = 0;
    }

    public show(textOne: string, textTwo: string = "") {
        this.majorText.text = textOne;
        if (this.smallText) this.smallText.text = textTwo;

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

    public onResize() {
        if (!this.isResizable) return;

        const { width , height } = this.app.viewSizes;
        const scale = Math.min(width * 0.90 / this.config.dimension.width, height * 0.90 / this.config.dimension.height, 1);
        this.scale.set(scale);

        this.majorText.style.wordWrapWidth = this.sprite.width * 0.85;

        if (this.smallText) {
            this.smallText.style.wordWrapWidth = this.sprite.width * 0.85;
        }
    }

    public setText(textOne: string, textTwo: string = "") {
        this.majorText.text = textOne;
        if (this.smallText) this.smallText.text = textTwo;
    }

    private createTextStyle(isMajor: boolean) {
        const style = isMajor ? UIConfig.bigPopUpTextStyle : UIConfig.smallPopUpTextStyle;

        return style;
    }
}