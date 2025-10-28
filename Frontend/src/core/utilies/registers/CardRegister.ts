import { Card } from "../../view/Card";
import { Register } from "./Register";

export class CardsRegister {
    private static deck: Register<Card> = new Register<Card>();

    public static setCard(cardName: string, card: Card) {
        this.deck.set(cardName, card);
    }

    public static getCard(cardHolderName: string): Card | undefined {
        return this.deck.get(cardHolderName);
    }
}