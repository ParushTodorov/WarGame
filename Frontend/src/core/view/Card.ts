import * as PIXI from "pixi.js";

import { BaseViewElement } from "./BaseViewElements";
import gsap from "gsap";
import { IPosition } from "../utilies/interfaces/viewInterfaces/IPosition";

export class Card extends BaseViewElement {
    private frontView: PIXI.Sprite;
    private backView: PIXI.Sprite;

    public addFrontView(view: PIXI.Sprite) {
        if (this.frontView) {
            this.removeChild(this.frontView);
        }

        this.frontView = view;
        this.addChild(this.frontView);
        this.frontView.visible = false;
    }

    public addBackView(view: PIXI.Sprite) {
        this.backView = view;
        this.backView.skew.y = 3.14;
        this.addChild(this.backView);
    }

    public revealCardAnimation(duration: number) {        
        const timeline: gsap.core.Timeline = gsap.timeline()
            .to(this.backView.skew, 
            { 
                y: 1.57,
                duration,
                onComplete: () => {
                    this.backView.visible = false;
                    this.frontView.visible = true;
                    this.frontView.skew.y = 1.57;
                }
            }
        )
            .to(this.frontView.skew, 
            { 
                y: 0,
                duration,
                onComplete: () => {
                    this.backView.skew.y = 1.57;
                }
            }
        )

        return timeline;
    }

    public hideCardAnimation(duration: number) { 
        const timeline: gsap.core.Timeline = gsap.timeline()
            .to(this.frontView.skew, 
            { 
                y: 1.57,
                duration,
                onComplete: () => {
                    this.backView.skew.y = 1.57;
                    this.frontView.visible = false;
                    this.backView.visible = true;
                }
            }
        )
            .to(this.backView.skew, 
            { 
                y: 3.14,
                duration,
                onComplete: () => {
                    this.frontView.skew.y = 0;
                }
            }
        )

        return timeline;
    }

    public moveAnimation(endPoint: IPosition,  duration: number = 1, scale: number = 1): gsap.core.Timeline {
        const timeline: gsap.core.Timeline = gsap.timeline()
            .to(this.scale, {
                x: scale,
                y: scale,
                duration,
            }
        )
            .to(this, {
                x: endPoint.x,
                y: endPoint.y,
                duration
            },
            "<"
        )

        return timeline;
    }

    public showCardFront() {
        this.backView.visible = false;
        this.frontView.visible = true;
    }

    public resetCard() {
        this.backView.visible = true;
        this.backView.skew.y = 3.14;
        if (this.frontView) {
            this.frontView.visible = false;
            this.frontView.skew.y = 0;
        }
    }
}