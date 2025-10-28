import { IDimension } from "../../viewInterfaces/IDimension";
import { IPosition } from "../../viewInterfaces/IPosition";

export interface IViewElementsConfig {
    name?: string;
    assetName: string;
    dimension: IDimension;
    rotate?: boolean;
    innerElementPosition?: {[key: number]: IPosition};
}