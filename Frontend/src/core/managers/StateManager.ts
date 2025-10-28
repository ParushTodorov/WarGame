import { GameState } from "../utilies/enums/GameStatate";
import { Player } from "../utilies/enums/Player";

export class StateManager {
    public static tableId: string;

    public static playerId: string;

    public static roundId: number = 0;

    public static gameState: GameState = GameState.PreStart;

    public static playerOneCardsLeft: number = 26;

    public static playerTwoCardsLeft: number = 26;

    public static currentPlayer: Player = Player.None;

    public static maxRounds: number = 0;

    public static timebank: number = 0;
}