
import { _decorator, Component, Button } from 'cc';
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
import {LabelController} from "db://assets/Scripts/Presentation/Common/LabelController";
const { ccclass, property } = _decorator;

 
@ccclass('BonusLabelController')
export class BonusLabelController extends LabelController {
    @property({ type: [Button] })
    hammerButton: Button = null;
    @property({ type: [Button] })
    pickaxeButton: Button = null;

    public bonusHitLeft(hits:number){
        this.labelTop.string = LocalizationService.getUIBonus('STAMINA_LEFT') + " " + hits + "";
    }

    public changeToolButton(isHammer:boolean){
        if(isHammer){
            this.hammerButton.interactable=true
            this.pickaxeButton.interactable=false
        }
        else{
            this.hammerButton.interactable=false
            this.pickaxeButton.interactable=true
        }
    }

    protected getLocalizationKey(key: string): string {
        return LocalizationService.getUIGame(key);
    }
}
