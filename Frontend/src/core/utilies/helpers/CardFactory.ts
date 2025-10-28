import * as PIXI from "pixi.js";

import { CardRank } from "../enums/Rank";
import { CardSuit } from "../enums/Suit";
import { Card } from "../../view/Card";
import { ISize } from "../interfaces/viewInterfaces/ISize";
import { Application } from "../../../Application";
import { FrontViewCardDeck } from "../registers/FrontViewCardDeck";
import { UIConfig } from "../../configs/UIConfig";

export class CardFactory {
    public static cardSize: ISize;

    private static app: Application;

    public static createCard(): Card {
        if (!this.app) this.app = Application.APP;
        
        const card = new Card();

        const cardBack: PIXI.Sprite = PIXI.Sprite.from(this.app.assetManager.getTexture("cardBack"));
        cardBack.anchor.set(0.5);

        card.addBackView(cardBack);

        return card;
    }

    public static createFrontView(rank: CardRank, suit: CardSuit) {
        if (!this.app) this.app = Application.APP;

        if (FrontViewCardDeck.getCard(rank, suit)) return FrontViewCardDeck.getCard(rank, suit);

        const cardFront: PIXI.Sprite = PIXI.Sprite.from(this.app.assetManager.getTexture("cardFront")!);
        cardFront.anchor.set(0.5);

        const cardRankName = this.createSuitText(suit);
        const cardSymbol: PIXI.Sprite = PIXI.Sprite.from(this.app.assetManager.getTexture(cardRankName)!);
        cardSymbol.tint = UIConfig.cardSuitTint;
        cardSymbol.anchor.set(0.5);
        cardSymbol.roundPixels = true;

        const numberContainer = new PIXI.Container();

        const color = this.selectColor(suit);
        
        const cardName = this.createRankText(rank);
        const number = PIXI.Sprite.from(this.app.assetManager.getTexture(cardName));
        number.tint = color;
        numberContainer.addChild(number);

        numberContainer.x = -numberContainer.width / 2;
        numberContainer.y = -numberContainer.height / 2

        const scale = Math.min(cardFront.width * 0.80 / cardSymbol.width, cardFront.height * 0.9 / cardSymbol.height);
        cardSymbol.scale.set(scale);

        cardFront.addChild(cardSymbol);
        cardFront.addChild(numberContainer);

        FrontViewCardDeck.setCard(rank, suit, cardFront);

        return cardFront
    }

    public static createDemoFronView() {
        const cardFront: PIXI.Sprite = PIXI.Sprite.from(this.app.assetManager.getTexture("cardFront")!);
        cardFront.anchor.set(0.5);

        return cardFront;
    }

    private static createSuitText(suit: CardSuit) {
        switch (suit) {
            case CardSuit.Clubs:
                return "club";
            case CardSuit.Spades:
                return "spade";
            case CardSuit.Hearts:
                return "heart";
            case CardSuit.Diamonds:
                return "diamond";
        }
    }

    private static createRankText(rank: CardRank) {
        switch (rank) {
            case CardRank.Two:
                return "2";
            case CardRank.Three:
                return "3";
            case CardRank.Four:
                return "4";
            case CardRank.Five:
                return "5";
            case CardRank.Six:
                return "6";
            case CardRank.Seven:
                return "7";
            case CardRank.Eight:
                return "8";
            case CardRank.Nine:
                return "9";
            case CardRank.Ten:
                return "10";
            case CardRank.Jack:
                return "J";
            case CardRank.Queen:
                return "Q";
            case CardRank.King:
                return "K";
            case CardRank.Ace:
                return "A";
        }
    }

    private static selectColor(suit: CardSuit) {
        switch (suit) {
            case CardSuit.Clubs:
                return `#000000`;
            case CardSuit.Spades:
                return `#000000`;
            case CardSuit.Hearts:
                return 0xFF0000;
            case CardSuit.Diamonds:
                return 0xFF0000;
        }
    }
}