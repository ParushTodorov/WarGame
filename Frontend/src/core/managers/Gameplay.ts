import gsap from "gsap";

import { Application } from "../../Application";
import { StateManager } from "./StateManager";
import { CardFactory } from "../utilies/helpers/CardFactory";
import { CardsRegister } from "../utilies/registers/CardRegister";
import { CardHoldersRegister } from "../utilies/registers/CardHoldersRegister";
import { IPosition } from "../utilies/interfaces/viewInterfaces/IPosition";
import { IRoundResult } from "../utilies/interfaces/communication/IRoundResult";
import { IEndGame } from "../utilies/interfaces/communication/IEndGame";
import { IStartGame } from "../utilies/interfaces/communication/IStartGame";
import { IRoundStart } from "../utilies/interfaces/communication/IRoundStart";
import { Player } from "../utilies/enums/Player";
import { GameEvents } from "../utilies/GameEvents";
import { GameState } from "../utilies/enums/GameStatate";
import { CardType } from "../utilies/enums/CardType";
import { CardHolder } from "../utilies/enums/CardHolders";
import { Card } from "../view/Card";
import { HitScreenView } from "../view/HitScreenView";
import { PopUpView } from "../view/PopUpView";
import { CardHolderView } from "../view/CardHolderView";
import { BaseViewElement } from "../view/BaseViewElements";
import { CounterView } from "../view/CounterView";

export class Gameplay {
    private app: Application;

    private SHOW_DURATION = 0.5;
    private STAY_DURATION = 1;
    private HIDE_DURATION = 0.5;
    private MOVE_DURATION = 0.5;

    private ANIMATION_REPEAT = {
        SHOW: 3,
        STAY: 1,
        HIDE: 2,
        MOVE: 2
    }

    private timeline: gsap.core.Timeline;

    private isDurationCalculated: boolean;

    private gameCardPlayerOne: Card;
    private gameCardPlayerTwo: Card;

    private cardHolderPlayerOne: CardHolderView;
    private cardHolderPlayerTwo: CardHolderView;

    private gameplayPopUp: PopUpView;
    private hitView: HitScreenView;
    private counter: CounterView;

    private cardHolderPlayerOnePosition: IPosition = {x: 0, y: 0};
    private cardHolderPlayerTwoPosition: IPosition = {x: 0, y: 0};

    private deckHolderPlayerOnePosition: IPosition = {x: 0, y: 0};
    private deckHolderPlayerTwoPosition: IPosition = {x: 0, y: 0};
    
    private deckScale: number = 1;

    private lastSeenRound: number = 0;

    constructor() {
        this.app = Application.APP;
    }

    public init() {
        this.setGameCard();
        this.setCardHolders();
        this.setScaleAndPositions();
        this.addEmitters();
    }

    public addGameplayPopUp(popUp: PopUpView) {
        this.gameplayPopUp = popUp;
    }

    public addHitScreenView(hitView: HitScreenView) {
        this.hitView = hitView;
    }

    public addCounter(counterView: CounterView) {
        this.counter = counterView;
    }

    private addEmitters() {
        this.app.emitter.on(GameEvents.START_GAME, this.onStartGame, this);
        this.app.emitter.on(GameEvents.END_GAME, this.onEndGame, this);
        this.app.emitter.on(GameEvents.START_NEW_ROUND, this.onRoundStart, this);
        this.app.emitter.on(GameEvents.ROUND_RESULT, this.onRoundResult, this);
        this.app.emitter.on(GameEvents.DOCUMENT_VISIBILITY_CHANGE, this.onAfterDark, this);
    }

    private onStartGame(data: IStartGame) {
        StateManager.gameState = GameState.StartGame;
        StateManager.maxRounds = data.maxRounds;

        if (data.playerOneId === StateManager.playerId) {
            this.cardHolderPlayerOne.activatePlayerSymbol(Player.PlayerOne);
        } else {
            this.cardHolderPlayerTwo.activatePlayerSymbol(Player.PlayerTwo);
        }

        if (data.timebankInSec > 0) {
            this.counter.startCounter(data.timebankInSec);
        }
    }

    private async onRoundStart(data: IRoundStart) {
        StateManager.gameState = GameState.StartRound;
        StateManager.roundId = data.roundId;

        this.hitView.hide();
        this.gameplayPopUp.show('ROUND ' + data.roundId);

        if (StateManager.maxRounds > 0) {
            const roundsLeft = StateManager.maxRounds - StateManager.roundId + 1;

            const text = roundsLeft === 1 ? "LAST ROUND" : `ROUNDS LEFT ${roundsLeft}`;

            this.counter.showText(text);

            setTimeout(() => {
                this.counter.hide();
            }, 1000)
        }
    }

    private onEndGame(data: IEndGame) {
        StateManager.gameState = GameState.EndGame;
        this.hitView.hide();
    }

    private onRoundResult(data: IRoundResult) {
        if (!this.isDurationCalculated) {
            this.calculateDuration(data.timeToWaitInSec);
        }

        StateManager.gameState = GameState.RoundResult;
        StateManager.playerOneCardsLeft = data.playerOneCardsLeft;
        StateManager.playerTwoCardsLeft = data.playerTwoCardsLeft;

        this.timeline && this.timeline.kill();
        gsap.killTweensOf(this.timeline);

        const playerOneFrontView = CardFactory.createFrontView(data.playerOneCard.rank, data.playerOneCard.suit);
        const playerTwoFrontView = CardFactory.createFrontView(data.playerTwoCard.rank, data.playerTwoCard.suit);

        this.gameCardPlayerOne.addFrontView(playerOneFrontView);
        this.gameCardPlayerTwo.addFrontView(playerTwoFrontView);

        this.timeline = gsap.timeline();

        this.moveCardsToHolders(this.timeline);
        this.revealCards(this.timeline);

        this.timeline.add(this.showWinner(data));

        this.hideGameCards(this.timeline);
        this.moveCardsToDecks(data.winner, this.timeline);

        this.timeline.to(
            this, {
                duration: 0,
                onComplete: () => {
                    this.restartGameCards();
                }
            }
        )

        this.timeline.play();
    }

    private setGameCard() {
        this.gameCardPlayerOne = CardsRegister.getCard(CardType.gameCardPlayerOne);
        this.gameCardPlayerTwo = CardsRegister.getCard(CardType.gameCardPlayerTwo);
    }

    private setCardHolders() {
        this.cardHolderPlayerOne = this.getHolder(CardHolder.cardHolderPlayerOne) as CardHolderView;
        this.cardHolderPlayerTwo = this.getHolder(CardHolder.cardHolderPlayerTwo) as CardHolderView;
    }

    private setScaleAndPositions() {
        this.cardHolderPlayerOnePosition = this.cardHolderPlayerOne.getNextElementPosition();
        this.cardHolderPlayerTwoPosition = this.cardHolderPlayerTwo.getNextElementPosition();
        this.deckHolderPlayerOnePosition = this.getHolder(CardHolder.deckHolderPlayerOne)!.getNextElementPosition();
        this.deckHolderPlayerTwoPosition = this.getHolder(CardHolder.deckHolderPlayerTwo)!.getNextElementPosition();
        
        this.deckScale = this.getHolder(CardHolder.deckHolderPlayerOne)!.width / this.getHolder(CardHolder.cardHolderPlayerOne)!.width;
    }

    private async revealCards(timeline: gsap.core.Timeline) {
        timeline.add(this.gameCardPlayerTwo.revealCardAnimation(this.SHOW_DURATION))
            .add(this.gameCardPlayerOne.revealCardAnimation(this.SHOW_DURATION), "<")

        return timeline;
    }

    private async hideGameCards(timeline: gsap.core.Timeline) {      
        timeline.add(this.gameCardPlayerTwo.hideCardAnimation(this.HIDE_DURATION))
            .add(this.gameCardPlayerOne.hideCardAnimation(this.HIDE_DURATION), "<");
        
        return timeline;
    }

    private showWinner(data: IRoundResult) {
        const timeline: gsap.core.Timeline = gsap.timeline();
        timeline
            .to(
                this, {
                    duration: this.STAY_DURATION,
                    onStart: () => {
                        this.gameplayPopUp.setText(data.winner === Player.None ? `TIE!!!` :`WINNER: PLAYER ${data.winner}`);
                        this.gameCardPlayerOne.showCardFront();
                        this.gameCardPlayerTwo.showCardFront();
                        this.setScore();

                        if (!(data.winnerId === StateManager.playerId || data.winner == Player.None)) {
                            this.hitView.animate(data.timeToWaitInSec - 0.5);
                        }
                    },
                },
            );

        return timeline;
    }

    private async moveCardsToHolders(timeline: gsap.core.Timeline) {        
        timeline.to(this, {onComplete: () => {
            this.gameCardPlayerOne.zIndex = 2000;
            this.gameCardPlayerTwo.zIndex = 2000;
        }, duration: 0})
            .add(this.gameCardPlayerTwo.moveAnimation(this.cardHolderPlayerTwoPosition, this.MOVE_DURATION, 1))
            .add(this.gameCardPlayerOne.moveAnimation(this.cardHolderPlayerOnePosition, this.MOVE_DURATION, 1), "<")

        return timeline;
    }

    private moveCardsToDecks(winner: Player, timeline: gsap.core.Timeline) {
        timeline.to(this, {onComplete: () => {
            this.gameCardPlayerOne.zIndex = 500;
            this.gameCardPlayerTwo.zIndex = 500;
        }, duration: 0});

        if (winner === Player.None) {
            
            timeline.add(this.gameCardPlayerOne.moveAnimation(this.deckHolderPlayerOnePosition, this.MOVE_DURATION, this.deckScale))
            timeline.add(this.gameCardPlayerTwo.moveAnimation(this.deckHolderPlayerTwoPosition, this.MOVE_DURATION, this.deckScale), "<")
            return timeline;
        }

        if (winner === Player.PlayerOne) {
            return this.finalWinnerMove(timeline, this.gameCardPlayerOne, this.gameCardPlayerTwo, this.cardHolderPlayerOnePosition, this.deckHolderPlayerOnePosition);
        }
        
        return this.finalWinnerMove(timeline, this.gameCardPlayerTwo, this.gameCardPlayerOne, this.cardHolderPlayerTwoPosition, this.deckHolderPlayerTwoPosition);
    }

    private finalWinnerMove(timeline: gsap.core.Timeline, cardWinner: Card, cardLoser: Card, holder: IPosition, deck: IPosition) {
        timeline.to(this, {onComplete: () => {cardLoser.zIndex = 250}, duration: 0})
            .add(cardLoser.moveAnimation(holder, this.SHOW_DURATION / 2))
            .add(cardLoser.moveAnimation(deck, this.MOVE_DURATION, this.deckScale))
            .add(cardWinner.moveAnimation(deck, this.MOVE_DURATION, this.deckScale), "<");

        return timeline;
    }

    private restartGameCards() {
        this.gameCardPlayerOne.zIndex = 2000;
        this.gameCardPlayerTwo.zIndex = 2000;

        if (this.gameCardPlayerOne.scale.x != this.deckScale) {
            this.gameCardPlayerOne.scale.set(this.deckScale);
            this.gameCardPlayerTwo.scale.set(this.deckScale);
        }

        this.setPostionFromElement(this.gameCardPlayerOne, this.deckHolderPlayerOnePosition);
        this.setPostionFromElement(this.gameCardPlayerTwo, this.deckHolderPlayerTwoPosition);
    }

    private setScore() {
        this.cardHolderPlayerOne.setNewScore(StateManager.playerOneCardsLeft);
        this.cardHolderPlayerTwo.setNewScore(StateManager.playerTwoCardsLeft);
    }

    private setPostionFromElement(element: BaseViewElement, origin: IPosition) {
        element.x = origin.x;
        element.y = origin.y;
    }

    private getHolder(holder: CardHolder) {
        return CardHoldersRegister.getCardHolder(holder);
    }

    private onAfterDark(isVisible: "hidden" | "visible") {
        if (isVisible == "hidden") { 
            this.timeline && this.timeline.pause();
            this.lastSeenRound = StateManager.roundId;
            return;
        }

        this.setScore();

        if (this.lastSeenRound === StateManager.roundId) {
            this.timeline && this.timeline.play();
            return;
        }

        this.timeline && this.timeline.kill();
        gsap.killTweensOf(this.timeline);
        this.hitView.killTimeLine();
        this.gameCardPlayerOne.resetCard();
        this.gameCardPlayerTwo.resetCard();
        this.restartGameCards();
    }

    private calculateDuration(maxtTime: number) {
        if (this.currentTimelineDuration(this.SHOW_DURATION, this.HIDE_DURATION, this.MOVE_DURATION, this.STAY_DURATION) < maxtTime) {
            this.isDurationCalculated = true;
            return;
        }

        if (maxtTime === 1) {
            this.SHOW_DURATION = 0.075;
            this.STAY_DURATION = 0.5;
            this.HIDE_DURATION = 0.075;
            this.MOVE_DURATION = 0.075;
            this.isDurationCalculated = true;
            return;
        }

        this.SHOW_DURATION *= 0.9;
        this.STAY_DURATION *= 0.9;
        this.HIDE_DURATION *= 0.9;
        this.MOVE_DURATION *= 0.9;        

        this.calculateDuration(maxtTime);
    }

    private currentTimelineDuration(show: number, hide: number, move: number, stay: number) {
        return this.ANIMATION_REPEAT.SHOW * show +
            this.ANIMATION_REPEAT.HIDE * hide +
            this.ANIMATION_REPEAT.MOVE * move +
            this.ANIMATION_REPEAT.STAY * stay;
    }
}