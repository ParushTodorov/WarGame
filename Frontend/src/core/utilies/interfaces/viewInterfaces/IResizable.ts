import { IDimension } from "./IDimension";

export interface IResizable {
    onResize: (dimension?: IDimension) => void;
}