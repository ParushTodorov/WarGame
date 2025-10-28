import { IncommingMessagesType } from "../../enums/IncommingMessagesType";

export interface IIncommingMessage {
    type: IncommingMessagesType;
    data: any;
}