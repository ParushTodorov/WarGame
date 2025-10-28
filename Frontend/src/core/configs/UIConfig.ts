import * as PIXI from "pixi.js";

export class UIConfig {
    public static cardSuitTint: number = 0x878787;

    public static redTint: number = 0x800000;

    public static bigPopUpTextStyle = new PIXI.TextStyle({
            fontFamily: 'Impact',
            fontSize: 50,
            fill: 'white',
            stroke: {
                color: '#000000ff',
                width: 2
            },
            dropShadow: {
                color: '#ffffffff',
                blur: 2,
                distance: 1,
                angle: Math.PI / 6
            },
            wordWrap: true,
            lineHeight: 60,
            align: 'center'
        });;

    public static smallPopUpTextStyle = new PIXI.TextStyle({
            fontFamily: 'Impact',
            fontSize: 25,
            fill: 'white',
            fontStyle: "italic",
            stroke: {
                color: '#000000ff',
                width: 2
            },
            dropShadow: {
                color: '#ffffffff',
                blur: 2,
                distance: 1,
                angle: Math.PI / 6
            },
            wordWrap: true,
            lineHeight: 30,
            align: 'center'
        });

    public static placeHolderResultTextStyle = new PIXI.TextStyle({
            fontFamily: 'Impact',
            fontSize: 65,
            fill: 'white',
            stroke: {
                color: '#000000ff',
                width: 2
            },
            dropShadow: {
                color: '#ffffffff',
                blur: 2,
                distance: 1,
                angle: Math.PI / 6
            },
            wordWrap: false,
            align: 'center'
        });;
}