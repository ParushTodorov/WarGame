import { IGameConfig } from "./utilies/IGameConfig";
import { IViewElementsConfig } from "./utilies/IViewElementsConfig";

export interface IWarGameConfig extends IGameConfig {
    viewElements: {
        endBackground: IViewElementsConfig;
        loadingBackground: IViewElementsConfig;
        background: IViewElementsConfig;
        cardHolderPlayerOne: IViewElementsConfig;
        cardHolderPlayerTwo: IViewElementsConfig;
        deckHolderPlayerOne: IViewElementsConfig;
        deckHolderPlayerTwo: IViewElementsConfig;
        bigPopUp: IViewElementsConfig;
        smallPopUp: IViewElementsConfig;
        winAnimation: IViewElementsConfig;
    }
}