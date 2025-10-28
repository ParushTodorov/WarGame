import { CardRank } from "../enums/Rank";
import { CardSuit } from "../enums/Suit";

export interface ICard {
    rank: CardRank;
    suit: CardSuit;
}