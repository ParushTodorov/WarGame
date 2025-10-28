import { BaseGameViewElement } from "../../view/BaseGameViewElement";
import { Register } from "./Register";

export class CardHoldersRegister {
    private static deck: Register<BaseGameViewElement> = new Register<BaseGameViewElement>();

    public static setCardHolder(cardHolderName: string, cardHolder: BaseGameViewElement) {
        this.deck.set(cardHolderName, cardHolder);
    }

    public static getCardHolder(cardHolderName: string): BaseGameViewElement | undefined {
        return this.deck.get(cardHolderName);
    }
}