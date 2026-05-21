import { _decorator, Component, SpriteFrame,Label,Sprite,Button } from 'cc';
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
const { ccclass, property } = _decorator;
 
@ccclass('LabelController')
export abstract class LabelController extends Component {
    @property(Label)
    public labelTop: Label = null;
    @property(Label)
    public labelBottom: Label = null;

    public totalWinText(won: number){
        this.labelBottom.string = this.getLocalizationKey('BALANCE') + " " + won + "";
    }
    public idleText(){
        this.labelTop.string = LocalizationService.getUIGame('LBL_IDLE');
    }
    public wonText(won:number){
        this.labelTop.string = LocalizationService.getUIGame('LBL_WIN') + " " + won + "";
    }

    protected abstract getLocalizationKey(key: string): string;

}