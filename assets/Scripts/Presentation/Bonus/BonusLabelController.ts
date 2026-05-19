
import { _decorator, Sprite,SpriteFrame } from 'cc';
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
import {LabelController} from "db://assets/Scripts/Presentation/Common/LabelController";
const { ccclass, property } = _decorator;

 
@ccclass('BonusLabelController')
export class BonusLabelController extends LabelController {
    @property({ type: Sprite })
    hammerButton: Sprite = null;
    @property({ type: Sprite })
    pickaxeButton: Sprite = null;
    @property({ type: [SpriteFrame] })
    public hammerImage: SpriteFrame[] = [];
    @property({ type: [SpriteFrame] })
    public pickaxeImage: SpriteFrame[] = [];

    public bonusHitLeft(hits:number){
        this.labelTop.string = LocalizationService.getUIBonus('STAMINA_LEFT') + " " + hits + "";
    }

    public changeToolButton(isHammer:boolean){
        if(isHammer){
            this.hammerButton.spriteFrame = this.hammerImage[1];
            this.pickaxeButton.spriteFrame = this.pickaxeImage[0];
        }
        else{
            this.hammerButton.spriteFrame = this.hammerImage[0];
            this.pickaxeButton.spriteFrame = this.pickaxeImage[1];
        }
    }

    protected getLocalizationKey(key: string): string {
        return LocalizationService.getUIGame(key);
    }
}
