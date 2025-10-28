import { IBaseGameResponse } from "./IBaseGameResponse";

export interface IRoundStart extends IBaseGameResponse {
    roundId: number;
    timeLeft: number;
}