import * as PIXI from "pixi.js";

import { CardRank } from "../enums/Rank";
import { CardSuit } from "../enums/Suit";
import { Register } from "./Register";

export class FrontViewCardDeck {
    private static deck: Register<PIXI.Sprite> = new Register<PIXI.Sprite>();

    public static setCard(rank: CardRank, suit: CardSuit, card: PIXI.Sprite) {
        this.deck.set(this.convertRankAndSuitToString(rank, suit), card);
    }

    public static getCard(rank: CardRank, suit: CardSuit): PIXI.Sprite {
        return this.deck.get(this.convertRankAndSuitToString(rank, suit));
    }

    private static convertRankAndSuitToString(rank: CardRank, suit: CardSuit) {
        return `${rank}-${suit}`
    }
}