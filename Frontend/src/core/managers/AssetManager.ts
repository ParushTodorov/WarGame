import * as PIXI from "pixi.js";

import { Application } from "../../Application";

import { IAssetsBundles, IAssetsInfo } from "../utilies/interfaces/configs/utilies/IAssetsBundles";
import { GameEvents } from "../utilies/GameEvents";
import { Register } from "../utilies/registers/Register";

import { Howl } from "howler";

// Da pull-va  cardBack
export class AssetManager {
    private manifest: IAssetsBundles;

    private readonly textureRegister: Register<PIXI.Texture> = new Register<PIXI.Texture>();
    private readonly audioManifest: Register<string> = new Register<string>();
    private readonly audioMap: Register<Howl> = new Register<Howl>();

    public addManifest(manifest: IAssetsBundles) {
        PIXI.Assets.init({ manifest });

        this.manifest = manifest;

        const soundAssets: IAssetsInfo[] = this.getBundleAssetsByName("auido_assets");

        soundAssets.forEach((asset) => {
            this.audioManifest.set(asset.alias, asset.src);
        })
    }

    public async initialLoad() {
        const bundleName = "loading_view";
        const loadingAssets = await PIXI.Assets.loadBundle(bundleName);
        this.setTextureAssets(loadingAssets, bundleName);

        Application.APP.emitter.emit(GameEvents.LOAD_START_ASSETS);
    }
    
    public async loadAssets() {
        const bundleName = "assets";
        const gameplayAssets = await PIXI.Assets.loadBundle(bundleName);
        this.setTextureAssets(gameplayAssets, bundleName);

        Application.APP.emitter.emit(GameEvents.LOAD_GAMEPLAY_ASSETS);
    }

    public getTexture(assetName: string) {
        return this.textureRegister.get(assetName);
    }

    public async getAudio(audioName: string | undefined): Promise<Howl> {
        const howl = this.audioMap.get(audioName);

        if (howl) return howl;

        const src = this.audioManifest.get(audioName);

        if (!src) return undefined;

        const howlAudio = new Howl({
            src: [src],
        });

        this.audioMap.set(audioName, howlAudio);

        return howlAudio;
   };
   
    private setTextureAssets(loadedAssets: any, bundleName: string) {
        const assets: IAssetsInfo[] = this.getBundleAssetsByName(bundleName);

        assets.forEach(value => {
            const asset = loadedAssets[value.alias];

            if (asset instanceof PIXI.Spritesheet) {
                Object.entries(asset.textures).forEach(value => {
                    this.textureRegister.set(value[0], value[1]);
                })
            }

            if (asset instanceof PIXI.Texture) {
                this.textureRegister.set(value.alias, asset);
            }
        })
    }

    private getBundleAssetsByName(bundleName: string): IAssetsInfo[] {
        let result: IAssetsInfo[] = [];

        this.manifest.bundles.forEach((value, index) => {
            if (value.name != bundleName) return;

            result = this.manifest.bundles[index].assets;
        })

        return result;
    }
}