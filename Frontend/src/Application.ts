import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import { PixiPlugin } from "gsap/PixiPlugin";

import gameConfig from './core/configs/GameConfig.json';

import { BaseMainView } from './core/managers/MainView';
import { AssetManager } from './core/managers/AssetManager';
import { AudioManager } from './core/managers/AudioManager';
import { CommunicationManager } from "./core/managers/ConnectionManager";
import { IAuthResponse } from "./core/utilies/interfaces/communication/IAuthResponse";
import { GameEvents } from './core/utilies/GameEvents';
import { StateManager } from './core/managers/StateManager';

type IWarGameConfig = typeof gameConfig;

export class Application {
    public static APP: Application;

    public pixiApp!: PIXI.Application;
    public emitter: PIXI.EventEmitter;

    public mainView: BaseMainView;
    public assetManager: AssetManager;
    public audioManager: AudioManager;

    public communicationManager: CommunicationManager;

    public viewSizes: {width: number, height: number, isLandscape: () => boolean} = {width: 0, height: 0, isLandscape: () => this.viewSizes.width > this.viewSizes.height};

    public gameConfig: IWarGameConfig;

    constructor() {
        Application.APP = this;
        
        this.gameConfig = gameConfig;

        this.assetManager = new AssetManager();
    }
    
    public async init() {
        await this.createPixiApplication();
        this.registerPlugins();
        this.initializeManagers();
        this.contolDocumentVisibility();
        await this.loadStaticFiles();        
        this.resizeObserver();
        this.connectToServer();
    }

    private async createPixiApplication() {
        const {width, height} = window.visualViewport!;
        this.pixiApp = new PIXI.Application();
        await this.pixiApp.init();

        (<any>globalThis).__PIXI_APP__ = this.pixiApp;
        const div = document.createElement('div');
        div.id = 'app';
        div.appendChild(this.pixiApp.canvas);
        document.body.appendChild(div);

        this.viewSizes.width = width;
        this.viewSizes.height = height;

        this.pixiApp.renderer.resize(this.viewSizes.width, this.viewSizes.height);
    }

    private registerPlugins() {
        PixiPlugin.registerPIXI(PIXI);
        gsap.registerPlugin(PixiPlugin);
    }

    private initializeManagers() {
        this.emitter = new PIXI.EventEmitter();
        
        this.mainView = new BaseMainView();
        this.mainView.init();
        this.pixiApp.stage.addChild(this.mainView);

        this.audioManager = new AudioManager();
        this.audioManager.init();
    }

    private contolDocumentVisibility() {
        document.addEventListener('visibilitychange', () => {
            this.emitter.emit(GameEvents.DOCUMENT_VISIBILITY_CHANGE, document.visibilityState);
        })
    }

    private async loadStaticFiles() {
        this.assetManager = new AssetManager();

        this.assetManager.addManifest(this.gameConfig.assets);

        await this.assetManager.initialLoad();
        await this.assetManager.loadAssets();
    }

    private resizeObserver() {
        const container = document.body;
        this.pixiApp.ticker.add(() => {
            const width = container.clientWidth;
            const height = container.clientHeight;

            if (height === this.viewSizes.height && width === this.viewSizes.width) return;

            this.viewSizes.width = width;
            this.viewSizes.height = height;

            this.onResize();
        })
    }

    private onResize() {
        this.pixiApp.renderer.resize(this.viewSizes.width, this.viewSizes.height);
        this.mainView.onResize();
    }

    private async connectToServer() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const timebank = !!urlParams.get('timebank');

            const maxrounds = !!urlParams.get('maxrounds');

            const url: string = `http://localhost:5000/api/war/?timebank=${timebank}&maxrounds=${maxrounds}`;
            
            const res = await fetch(url);
            const data: IAuthResponse = await res.json();

            StateManager.tableId = data.tableId;
            StateManager.playerId = data.playerId;

            this.communicationManager = new CommunicationManager();
        } catch (error) {
            console.warn(error);
        }
    }
}