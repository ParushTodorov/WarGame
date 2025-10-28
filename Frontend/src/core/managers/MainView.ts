import * as PIXI from "pixi.js";
import gsap from "gsap";

import { Application } from "../../Application";
import { IResizable } from "../../core/utilies/interfaces/viewInterfaces/IResizable";
import { Background } from "../view/Background";
import { GameEvents } from "../utilies/GameEvents";
import { GameplayScreen } from "../view/GameplayScreen";
import { PopUpView } from "../view/PopUpView";
import { IEndGame } from "../utilies/interfaces/communication/IEndGame";
import { Player } from "../utilies/enums/Player";
import { StateManager } from "./StateManager";
import { GameState } from "../utilies/enums/GameStatate";
import { IStartGame } from "../utilies/interfaces/communication/IStartGame";

export class BaseMainView extends PIXI.Container implements IResizable {
    private app: Application;

    private loadingBackground: Background;
    private endBackground: Background;
    private gameplayScreen: GameplayScreen;
    private popUpView: PopUpView;

    constructor() {
        super();   
    }

    public init() {
        this.app = Application.APP;

        this.app.emitter.on(GameEvents.LOAD_START_ASSETS, this.createLoadingScreen, this);
        this.app.emitter.on(GameEvents.LOAD_GAMEPLAY_ASSETS, this.activateGameplayScreen, this);
        this.app.emitter.on(GameEvents.START_GAME, this.onStartGame, this);
        this.app.emitter.on(GameEvents.END_GAME, this.onEndGame, this);

        this.sortableChildren = true;
    }

    private createLoadingScreen() {
        this.loadingBackground = new Background(this.app.gameConfig.viewElements.loadingBackground);
        this.addChild(this.loadingBackground);

        this.onResize();
    }

    private createGameplayElements() {
        this.gameplayScreen = new GameplayScreen();
        this.gameplayScreen.init();
        this.gameplayScreen.hideElements();
        this.gameplayScreen.alpha = 0;
        this.addChild(this.gameplayScreen);

        this.popUpView = new PopUpView(this.app.gameConfig.viewElements.bigPopUp);
        this.popUpView.zIndex = Number.MAX_SAFE_INTEGER;
        this.addChild(this.popUpView);

        this.endBackground = new Background(this.app.gameConfig.viewElements.endBackground);
        this.endBackground.alpha = 0;
        this.addChild(this.endBackground);
    }

    public onResize() {
        const { width, height } = this.app.viewSizes;

        this.x = width / 2;
        this.y = height / 2;

        if (this.loadingBackground) {
            const backgroundScale = Math.min((width / this.loadingBackground.width * this.loadingBackground.scale.x), 
                        (height / this.loadingBackground.height * this.loadingBackground.scale.y), 
                            1);
            this.loadingBackground.scale.set(backgroundScale);

            this.loadingBackground.x = -this.loadingBackground.width / 2;
            this.loadingBackground.y = -this.loadingBackground.height / 2;
        }

        if (this.gameplayScreen) {
            this.gameplayScreen.onResize();
        }

        if (this.popUpView) {
            this.popUpView.onResize();
        }

        if (this.endBackground) {
            const backgroundScale = Math.max((width / this.endBackground.width/ this.endBackground.scale.x), 
                        (height / this.endBackground.height / this.endBackground.scale.y), 
                            1);
            this.endBackground.scale.set(backgroundScale);

            this.endBackground.x = -this.endBackground.width / 2;
            this.endBackground.y = -this.endBackground.height / 2;
        }
    }

    private onStartGame(data: IStartGame) {
        this.popUpView.setText("WAR HAS BEEN DECLARED!");
        setTimeout(() => {
            this.popUpView.hide();
            this.gameplayScreen.showElements();
        }, data.timeToWaitInSec * 0.9 * 1000);

        this.app.emitter.emit(GameEvents.PLAY_LOOP, "thisMeansWar");
    }

    private async onEndGame(data: IEndGame) {
        this.gameplayScreen.hideElements();

        const finalText = data.winner == Player.None ? 
            `THE WAR IS OVER! \n THERE’S NO WINNER! \n PLAY AGAIN?` : 
            `WAR HAS ENDED! \n PLAYER ${data.winner} IS THE WINNER!!!`

        this.popUpView.show(finalText);
        this.app.emitter.emit(GameEvents.PLAY_LOOP, "startMusic");
        await this.screenTransition(this.gameplayScreen, this.endBackground);
    }

    private async activateGameplayScreen() {
        this.createGameplayElements();
        this.onResize();

        await this.showGameplayScreen();
    }

    private async showGameplayScreen() {
        await this.screenTransition(this.loadingBackground, this.gameplayScreen);
        
        if (StateManager.gameState === GameState.PreStart) {
            this.app.emitter.emit(GameEvents.PLAY_LOOP, "startMusic");
            this.popUpView.show("WAITING FOR YOUR ENEMY!", "“Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.”");
        }
        
        this.destroyLoadingScreen();
    }

    private destroyLoadingScreen() {
        if (!this.loadingBackground) return;

        this.removeChild(this.loadingBackground);
        this.loadingBackground.destroy();
        this.loadingBackground = null;
    }

    private async screenTransition(startScreen: PIXI.Container, endScreen: PIXI.Container) {
        await gsap.to(startScreen, {
            alpha: 0,
            duration: 1,
            ease: "power1.out"
        })

        await gsap.to(endScreen, {
            alpha: 1,
            duration: 1,
            ease: "power1.in"
        })
    }
}