import { IDimension } from "../../viewInterfaces/IDimension";
import { IPosition } from "../../viewInterfaces/IPosition";
import { IAssetsBundles } from "./IAssetsBundles";
import { IViewElementsConfig } from "./IViewElementsConfig";

export interface IGameConfig {
    gameName: string;
    assets: IAssetsBundles;
    viewElements: Record<string, IViewElementsConfig>;
    alwaysOnTop: IDimension;
    pivot: IPosition;
}