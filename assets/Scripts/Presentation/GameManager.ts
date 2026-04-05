import {_decorator, Component, JsonAsset} from 'cc';
import {EventManager} from "../Infrastructure/EventManager";
import {NameEvent} from "../Infrastructure/NameEvent";
import {SlotController} from "../Presentation/SlotController";
import {LabelController} from "../Presentation/LabelController";
import {LocalizationService} from '../Application/LocalizationService';

const { ccclass, property } = _decorator;
 
@ccclass('GameManager')
export class GameManager extends Component {
    @property(JsonAsset)
    public labelText: JsonAsset;
    @property(LabelController)
    public label: LabelController;
    @property(SlotController)
    public slotController: SlotController;
    public static Instance: GameManager;

    protected onLoad(){
        EventManager.on(NameEvent.REQUEST_SPIN, this.buttonState, this)
        EventManager.on(NameEvent.REQUEST_STOP, this.buttonState, this)
        EventManager.on(NameEvent.PRIZES_PAY, this.wonLabel, this)

        LocalizationService.init(this.labelText.json);
        GameManager.Instance = this;
        this.updateLabel();
    }
    protected onDestroy() {
        EventManager.off(NameEvent.REQUEST_SPIN, this.buttonState)
        EventManager.off(NameEvent.REQUEST_STOP, this.buttonState)
        EventManager.off(NameEvent.PRIZES_PAY, this.wonLabel)
    }

    private updateLabel(){
        this.label.idleText();
    }
    private wonLabel(value:number){
        this.label.wonText(value);
    }
    private buttonState(state: boolean){
        if(state){
            EventManager.emit(NameEvent.ON_SPIN, true);
        }
        else{
            this.scheduleOnce(() => {
                this.slotController.stateSpinButton(true);
                this.updateLabel();
            }, 0.2);

        }


    }
}