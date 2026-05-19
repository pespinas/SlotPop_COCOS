
import { _decorator, Component, SpriteFrame,Label,Sprite,Button } from 'cc';
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
import {LabelController} from "db://assets/Scripts/Presentation/Common/LabelController";
const { ccclass, property } = _decorator;

@ccclass('SlotLabelController')
export class SlotLabelController extends LabelController {
    @property(Label)
    public labelBet: Label = null;
    @property(Sprite)
    public betImage: Sprite = null!;
    @property({ type: [SpriteFrame] })
    public betImages: SpriteFrame[] = [];
    @property({ type: [Button] })
    pokeballButton: Button = null;

    public changeBet(betId:number, betValue:number){
        this.betImage.spriteFrame = this.betImages[betId - 1];
        this.labelBet.string = betValue.toString();
    }
    public stateBetButton(state:boolean){
        this.pokeballButton.interactable = state;
    }
    public wonText(won:number){
        this.labelTop.string = LocalizationService.getUIGame('LBL_WIN') + " " + won + "";
    }
    protected getLocalizationKey(key: string): string {
        return LocalizationService.getUIGame(key);
    }
}