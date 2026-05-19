import { _decorator, Component, JsonAsset} from 'cc';
import {BonusLabelController} from "db://assets/Scripts/Presentation/Bonus/BonusLabelController";
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
import {EventManager} from "db://assets/Scripts/Infrastructure/EventManager";
import {NameEvent} from "db://assets/Scripts/Infrastructure/NameEvent";
import {Balance} from "db://assets/Scripts/Domain/Common/Balance";
import {WallState} from "db://assets/Scripts/Domain/Bonus/indexBonusD";

const { ccclass, property } = _decorator;
 
@ccclass('BonusManager')
export class BonusMachine extends Component {

    @property(JsonAsset)
    public labelText: JsonAsset;
    @property(BonusLabelController)
    public label: BonusLabelController;

    protected onLoad(){
        LocalizationService.init(this.labelText.json);
        EventManager.on(NameEvent.TOOL_USED, this.toolUsed, this);
        this.labelStart();

    }
    private labelStart(){
        this.label.idleText();
        this.label.totalWinText(Balance.getInstance().getBalance());
    }
    protected onDestroy(){
        EventManager.off(NameEvent.TOOL_USED, this.toolUsed, this);
    }
    private toolUsed(isHammer: boolean){
       WallState.getInstance().registerHit(isHammer);
       let stamina = WallState.getInstance().getStamina();
       this.hitsLeft(stamina);

    }

    private hitsLeft(stamina: number){
        this.label.bonusHitLeft(stamina);
    }
}
