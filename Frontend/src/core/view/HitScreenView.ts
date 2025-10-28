import * as PIXI from "pixi.js";

import { Application } from "../../Application";
import gsap from "gsap";
import { UIConfig } from "../configs/UIConfig";

export class HitScreenView extends PIXI.Container {
    
    private TIMELINE_DURATION: number = 0.50;
    private timeline: gsap.core.Timeline;
    
    private view: PIXI.Graphics;

    constructor() {
        super();

        const { width, height } = Application.APP.gameConfig.viewElements.background.dimension;
        this.view = new PIXI.Graphics()
            .rect(0, 0, width, height)
            .fill({
                color: UIConfig.redTint,
                alpha: 0.5
            });

        this.view.alpha = 0;
        
        this.addChild(this.view);
    }

    public animate(duration: number) {
        this.killTimeLine();
        this.timeline = gsap.timeline();

        this.timeline.to(this.view, {
            onStart: () => {
                if (this.view.visible) return;

                this.view.visible = true;
            },
            alpha: 1,
            duration: this.TIMELINE_DURATION / 2,
            ease: "steps(12)"
        })
        this.timeline.to(this.view, {
            alpha: 0,
            duration: this.TIMELINE_DURATION / 2,
            ease: "steps(12)"
        })

        const repeat: number = Math.floor(duration / this.TIMELINE_DURATION)
        this.timeline.repeat(repeat);

        return this.timeline;
    }

    public hide() {
        this.view.visible = false;
        this.killTimeLine();        
    }

    public killTimeLine() {
        if (this.timeline) {
            this.timeline.kill();
            gsap.killTweensOf(this.timeline);
        }
    }
}