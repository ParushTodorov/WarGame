import *  as PIXI from "pixi.js";

import { BaseGameViewElement } from "./BaseGameViewElement";
import { IViewElementsConfig } from "../utilies/interfaces/configs/utilies/IViewElementsConfig";
import { Player } from "../utilies/enums/Player";

export class CardHolderView extends BaseGameViewElement {

    private deckSize: PIXI.Text;

    private playerSymbol: PIXI.Sprite;

    constructor(config: IViewElementsConfig) {
        super(config);

        const style = this.createTextStyle();
        this.deckSize = new PIXI.Text({style});
        const { x, y } = this.getElementPositionFromConfig(1);
        this.deckSize.x = x;
        this.deckSize.y = y;
        this.deckSize.anchor.set(0.5);
        this.deckSize.text = 26;
        this.addChild(this.deckSize);
    }

    public setNewScore(score: number) {
        this.deckSize.text = score;
    }

    public activatePlayerSymbol(player: Player) {
        this.playerSymbol = PIXI.Sprite.from(this.app.assetManager.getTexture("playerSymbol"));
        this.playerSymbol.anchor.set(0.5);
        this.playerSymbol.roundPixels = true;
        this.playerSymbol.x = this.config.innerElementPosition["2"].x;
        this.playerSymbol.y = this.config.innerElementPosition["2"].y;

        const scale = Math.min(this.sprite.width * 0.5 / this.playerSymbol.width, this.sprite.height * 0.25 / this.playerSymbol.height);
        this.playerSymbol.scale.set(scale);

        if (player === Player.PlayerTwo) {
            this.playerSymbol.skew.y = 3.14;
        }

        this.addChild(this.playerSymbol);
    }

    private createTextStyle() {
        const fontSize: number = 50;

        return new PIXI.TextStyle({
            fontFamily: 'Impact',
            fontSize,
            fill: 'white',
            stroke: {
                color: '#000000ff',
                width: 2
            },
            dropShadow: {
                color: '#ffffffff',
                blur: 2,
                distance: 1,
                angle: Math.PI / 6
            },
            align: 'center'
        });
    }
}