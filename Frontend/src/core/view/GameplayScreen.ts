import * as PIXI from "pixi.js";

import { Application } from "../../Application";
import { IResizable } from "../utilies/interfaces/viewInterfaces/IResizable";
import { Background } from "./Background";
import { Card } from "./Card";
import { CardHolder } from "../utilies/enums/CardHolders";
import { CardType } from "../utilies/enums/CardType";
import { BaseGameViewElement } from "./BaseGameViewElement";
import { CardHoldersRegister } from "../utilies/registers/CardHoldersRegister";
import { CardsRegister } from "../utilies/registers/CardRegister";
import { CardFactory } from "../utilies/helpers/CardFactory";
import { IViewElementsConfig } from "../utilies/interfaces/configs/utilies/IViewElementsConfig";
import { IPosition } from "../utilies/interfaces/viewInterfaces/IPosition";
import { BaseViewElement } from "./BaseViewElements";
import { Gameplay } from "../managers/Gameplay";
import { PopUpView } from "./PopUpView";
import { CardHolderView } from "./CardHolderView";
import { HitScreenView } from "./HitScreenView";
import { CounterView } from "./CounterView";

export class GameplayScreen extends PIXI.Container implements IResizable {
    private app: Application;
    private gamePlay: Gameplay = new Gameplay()

    private background: Background;
    private cardHolderPlayerOne: BaseGameViewElement;
    private cardHolderPlayerTwo: BaseGameViewElement;
    private deckHolderPlayerOne: BaseGameViewElement;
    private deckHolderPlayerTwo: BaseGameViewElement;

    private gameCardPlayerOne: Card;
    private gameCardPlayerTwo: Card;

    private cardOneOnDeck: Card;
    private cardTwoOnDeck: Card;

    private hitView: HitScreenView;

    private gameplayPopUp: PopUpView;

    private counter: CounterView;

    constructor() {
        super();   
    }

    public init() {
        this.app = Application.APP;

        this.pivot.set(this.app.gameConfig.pivot.x, this.app.gameConfig.pivot.y);

        this.sortableChildren = true;

        this.createBackground();
        this.createCards();
        this.createHolders();
        this.createGameplayPopUpView();
        this.createHitView();
        this.createCounterView();
        this.setInitialScaleAndPositions();

        this.gamePlay.init();
        this.gamePlay.addGameplayPopUp(this.gameplayPopUp);
        this.gamePlay.addHitScreenView(this.hitView);
        this.gamePlay.addCounter(this.counter)
        this.onResize();
    }

    public onResize() {
        const { width, height } = this.app.viewSizes;

        const scale = Math.min(width / this.app.gameConfig.alwaysOnTop.width, height / this.app.gameConfig.alwaysOnTop.height);

        this.scale.set(scale);

        const backgroundScaleX = (width / scale) / (this.background.width/ this.background.scale.x);
        const backgroundScaleY =  (height / scale) / (this.background.height / this.background.scale.y);
        const backgroundScale = Math.max(backgroundScaleX, backgroundScaleY, 1);
        
        this.background.scale.set(backgroundScale);
        this.background.x = this.app.gameConfig.pivot.x - this.background.width / 2;
        this.background.y = this.app.gameConfig.pivot.y - this.background.height / 2;

        this.hitView.scale.set(backgroundScale);
        this.hitView.x = this.app.gameConfig.pivot.x - this.background.width / 2;
        this.hitView.y = this.app.gameConfig.pivot.y - this.background.height / 2;
    }

    public showElements() {
        this.children.forEach(
            child => {
                child.visible = true;
            }
        )
    }

    public hideElements() {
        this.children.forEach(
            child => {
                if (child instanceof Background) return;
                
                child.visible = false;
            }
        )
    }

    private createBackground() {
        this.background = new Background(this.app.gameConfig.viewElements.background);
        
        this.background.x = this.app.gameConfig.viewElements.background.dimension.x;
        this.background.y = this.app.gameConfig.viewElements.background.dimension.y;

        this.addChild(this.background);
    }

    private createHolders() {
        this.cardHolderPlayerOne = this.createCardHolder(this.app.gameConfig.viewElements.cardHolderPlayerOne, true);
        this.cardHolderPlayerTwo = this.createCardHolder(this.app.gameConfig.viewElements.cardHolderPlayerTwo, true);
        this.deckHolderPlayerOne = this.createCardHolder(this.app.gameConfig.viewElements.deckHolderPlayerOne);
        this.deckHolderPlayerTwo = this.createCardHolder(this.app.gameConfig.viewElements.deckHolderPlayerTwo);
    }

    private createGameplayPopUpView() {
        const config = this.app.gameConfig.viewElements.smallPopUp;
        
        this.gameplayPopUp = new PopUpView(config, 1, false);
        this.gameplayPopUp.x = config.dimension.x;
        this.gameplayPopUp.y = config.dimension.y;

        this.addChild(this.gameplayPopUp);
    }

    private createCardHolder(config: IViewElementsConfig, isCardHolder: boolean = false) {
        const cardHolder: BaseGameViewElement = isCardHolder ?
                new CardHolderView(config) :
                new BaseGameViewElement(config);
                

        cardHolder.x = config.dimension.x;
        cardHolder.y = config.dimension.y;

        CardHoldersRegister.setCardHolder(config.name!, cardHolder);

        return this.addChild(cardHolder);
    }

    private createCards() {
        this.gameCardPlayerOne = CardFactory.createCard();
        this.gameCardPlayerOne.zIndex = 2000;
        CardsRegister.setCard(CardType.gameCardPlayerOne, this.gameCardPlayerOne);
        this.addChild(this.gameCardPlayerOne);

        this.gameCardPlayerTwo = CardFactory.createCard();
        this.gameCardPlayerTwo.zIndex = 2000;
        CardsRegister.setCard(CardType.gameCardPlayerTwo, this.gameCardPlayerTwo);
        this.addChild(this.gameCardPlayerTwo);

        this.cardOneOnDeck = CardFactory.createCard();
        this.cardOneOnDeck.zIndex = 1000;
        CardsRegister.setCard(CardType.cardOneOnDeck, this.cardOneOnDeck);
        this.addChild(this.cardOneOnDeck);

        this.cardTwoOnDeck = CardFactory.createCard();
        this.cardTwoOnDeck.zIndex = 1000;
        CardsRegister.setCard(CardType.cardTwoOnDeck, this.cardTwoOnDeck);
        this.addChild(this.cardTwoOnDeck);
    }

    private createHitView() {
        this.hitView = new HitScreenView();
        this.addChild(this.hitView);
    }

    private createCounterView() {
        const config = this.app.gameConfig.viewElements.counter;

        this.counter = new CounterView(this.app.gameConfig.viewElements.counter);

        this.counter.x = config.dimension.x;
        this.counter.y = config.dimension.y;

        this.addChild(this.counter);
    }

    private setInitialScaleAndPositions() {
        const deckScale = this.deckHolderPlayerOne.width / this.cardHolderPlayerOne.width;

        const deckHolderPlayerOnePosition = CardHoldersRegister.getCardHolder(CardHolder.deckHolderPlayerOne)!.getNextElementPosition();
        const deckHolderPlayerTwoPosition = CardHoldersRegister.getCardHolder(CardHolder.deckHolderPlayerTwo)!.getNextElementPosition();

        this.setPostionFromElement(this.gameCardPlayerOne, deckHolderPlayerOnePosition);
        this.setPostionFromElement(this.gameCardPlayerTwo, deckHolderPlayerTwoPosition);
        this.setPostionFromElement(this.cardOneOnDeck, deckHolderPlayerOnePosition);
        this.setPostionFromElement(this.cardTwoOnDeck, deckHolderPlayerTwoPosition);
        
        this.cardOneOnDeck.scale.set(deckScale);
        this.cardTwoOnDeck.scale.set(deckScale);

        this.gameCardPlayerOne.scale.set(deckScale);
        this.gameCardPlayerTwo.scale.set(deckScale);
    }

    private setPostionFromElement(element: BaseViewElement, origin: IPosition) {
        element.x = origin.x;
        element.y = origin.y;
    }
}