import { IBaseGameResponse } from "./IBaseGameResponse";

export interface IStartGame extends IBaseGameResponse {
    playerOneId: string;
    playerTwoId: string;
    maxRounds: number;
    timebankInSec: number;
}