import { IDimension } from "../utilies/interfaces/viewInterfaces/IDimension";
import { IResizable } from "../utilies/interfaces/viewInterfaces/IResizable";
import { BaseGameViewElement } from "./BaseGameViewElement";

export class Background extends BaseGameViewElement implements IResizable {
    
    public onResize (dimension?: IDimension) {
    }
}