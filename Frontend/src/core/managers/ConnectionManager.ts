import * as signalR from '@microsoft/signalr';

import { IIncommingMessage } from "../utilies/interfaces/communication/IIncomingMessage";
import { IncommingMessagesType } from '../utilies/enums/IncommingMessagesType';
import { GameEvents } from '../utilies/GameEvents';
import { Application } from '../../Application';
import { StateManager } from './StateManager';

export class CommunicationManager {
    private connection: signalR.HubConnection;

    private gameEventsMap: Map<IncommingMessagesType, string> = new Map();

    constructor() {
        this.createGameEventsMap();

        this.connection = new signalR.HubConnectionBuilder()
            .withUrl(`http://localhost:5000/gameplay?tableId=${StateManager.tableId}`)
            .withAutomaticReconnect()
            .build();

        this.connection.on("Message", (value) => {
            const message: IIncommingMessage = JSON.parse(value);

            const gameEvent = this.gameEventsMap.get(message.type);
            Application.APP.emitter.emit(gameEvent, message.data);
        });

        this.connection.start();
    }

    private createGameEventsMap() {
        this.gameEventsMap.set(IncommingMessagesType.StartGame, GameEvents.START_GAME);
        this.gameEventsMap.set(IncommingMessagesType.EndGame, GameEvents.END_GAME);
        this.gameEventsMap.set(IncommingMessagesType.StartNewRound, GameEvents.START_NEW_ROUND);
        this.gameEventsMap.set(IncommingMessagesType.RoundResult, GameEvents.ROUND_RESULT);
    }
}