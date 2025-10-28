import { Player } from "../../enums/Player";
import { ICard } from "../../helpers/ICard";
import { IBaseGameResponse } from "./IBaseGameResponse";

export interface IRoundResult extends IBaseGameResponse {
    playerOneCard: ICard;
    playerTwoCard: ICard;
    winner: Player;
    winnerId: string;
    playerOneCardsLeft: number;
    playerTwoCardsLeft: number;
}