
import { _decorator, Sprite,SpriteFrame,Button } from 'cc';
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
import {LabelController} from "db://assets/Scripts/Presentation/Common/LabelController";
const { ccclass, property } = _decorator;

 
@ccclass('BonusLabelController')
export class BonusLabelController extends LabelController {
    @property(Button)
    public hammerButton: Button;
    @property(Button)
    public pickaxeButton: Button;

    @property({ type: [SpriteFrame] })
    public hammerImage: SpriteFrame[] = [];
    @property({ type: [SpriteFrame] })
    public pickaxeImage: SpriteFrame[] = [];

    private hammerSprite: Sprite;
    private pickaxeSprite: Sprite;

    protected onLoad(){
        this.hammerSprite = this.hammerButton.getComponent(Sprite);
        this.pickaxeSprite = this.pickaxeButton.getComponent(Sprite);
    }
    public bonusHitLeft(hits:number){
        this.labelTop.string = LocalizationService.getUIBonus('STAMINA_LEFT') + " " + hits + "";
    }

    public changeToolButton(isHammer:boolean){
        if(isHammer){
            this.hammerSprite.spriteFrame = this.hammerImage[1];
            this.pickaxeSprite.spriteFrame = this.pickaxeImage[0];
        }
        else{
            this.hammerSprite.spriteFrame = this.hammerImage[0];
            this.pickaxeSprite.spriteFrame = this.pickaxeImage[1];
        }
    }

    public stateButton(){
        this.hammerButton.interactable = false;
        this.pickaxeButton.interactable = false;
    }

    protected getLocalizationKey(key: string): string {
        return LocalizationService.getUIGame(key);
    }
}
