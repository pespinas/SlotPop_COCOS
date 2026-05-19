import { _decorator, Component, JsonAsset} from 'cc';
import {BonusLabelController} from "db://assets/Scripts/Presentation/Bonus/BonusLabelController";
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
import {EventManager} from "db://assets/Scripts/Infrastructure/EventManager";
import {NameEvent} from "db://assets/Scripts/Infrastructure/NameEvent";
import {Balance} from "db://assets/Scripts/Domain/Common/Balance";
import {WallState} from "db://assets/Scripts/Domain/Bonus/indexBonusD";
import {TouchController} from "db://assets/Scripts/Presentation/Bonus/TouchController";

const { ccclass, property } = _decorator;
 
@ccclass('BonusManager')
export class BonusMachine extends Component {

    @property(JsonAsset)
    public labelText: JsonAsset;
    @property(BonusLabelController)
    public label: BonusLabelController;
    @property(TouchController)
    public touch: TouchController;

    protected onLoad(){
        LocalizationService.init(this.labelText.json);
        EventManager.on(NameEvent.TOOL_USED, this.toolUsed, this);
        EventManager.on(NameEvent.TOOL_CHANGE, this.updateToolButton, this);
        this.touch.updateStamina(WallState.getInstance().getStamina());
        this.labelStart();
    }
    protected onDestroy(){
        EventManager.off(NameEvent.TOOL_USED, this.toolUsed, this);
        EventManager.off(NameEvent.TOOL_CHANGE, this.updateToolButton, this);
    }

    private labelStart(){
        this.label.idleText();
        this.label.totalWinText(Balance.getInstance().getBalance());
    }

    private updateToolButton(isHammer: boolean){
        this.label.changeToolButton(isHammer);
    }

    private toolUsed(isHammer: boolean){
       this.wallCheckState(isHammer);
       let stamina = WallState.getInstance().getStamina();
       this.hitsLeft(stamina);
    }

    private wallCheckState(isHammer: boolean){
        let stamina = WallState.getInstance().getStamina();
        if (stamina<=0){
            this.label.stateButton();
        }
        else{
            WallState.getInstance().registerHit(isHammer);
        }
        this.touch.updateStamina(stamina);
    }

    private hitsLeft(stamina: number){
        this.label.bonusHitLeft(stamina);
    }
}
