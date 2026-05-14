
import { _decorator, Component, SpriteFrame,Label,Sprite,Button } from 'cc';
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
const { ccclass, property } = _decorator;
 
@ccclass('LabelController')
export class LabelController extends Component {
    @property(Label)
    public labelTop: Label;
    @property(Label)
    public labelBottom: Label;
    @property(Label)
    public labelBet: Label;
    @property(Sprite)
    public betImage: Sprite = null!;
    @property({ type: [SpriteFrame] })
    public betImages: SpriteFrame[] = [];
    @property({ type: [Button] })
    pokeballButton: Button;

    public idleText(){
        this.labelTop.string = LocalizationService.getUIGame('LBL_IDLE');
    }

    public wonText(won:number){
        this.labelTop.string = LocalizationService.getUIGame('LBL_WIN') + " " + won + "";
    }
    public totalWinText(won:number){
        this.labelBottom.string = LocalizationService.getUIGame('BALANCE') + " " + won + "";
    }
    public changeBet(betId:number, betValue:number){
        this.betImage.spriteFrame = this.betImages[betId - 1];
        this.labelBet.string = betValue.toString();
    }
    public stateBetButton(state:boolean){
        this.pokeballButton.interactable = state;
    }
    public bonusHitLeft(hits:number){
        this.labelTop.string = LocalizationService.getUIBonus('STAMINA_LEFT') + " " + hits + "";
    }
}