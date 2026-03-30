import {_decorator, Component,JsonAsset} from 'cc';
import {EventManager} from "../Infrastructure/EventManager";
import {NameEvent} from "../Infrastructure/NameEvent";
import {SlotController} from "db://assets/Scripts/Presentation/SlotController";

const { ccclass, property } = _decorator;
 
@ccclass('GameManager')
export class GameManager extends Component {
    @property(JsonAsset)
    public labelText: JsonAsset;
    @property(SlotController)
    public slotController: SlotController;
    public static Instance: GameManager;

    onLoad(){
        EventManager.on(NameEvent.PRIZES_PAY, this.updateLabel)
        EventManager.on(NameEvent.REQUEST_SPIN, this.buttonState, this)
        EventManager.on(NameEvent.REQUEST_STOP, this.buttonState, this)
        GameManager.Instance = this;
    }
    onDestroy() {
        EventManager.off(NameEvent.PRIZES_PAY, this.updateLabel)
        EventManager.off(NameEvent.REQUEST_SPIN, this.buttonState)
        EventManager.off(NameEvent.REQUEST_STOP, this.buttonState)
    }

    private updateLabel(){

    }
    private buttonState(state: boolean){
        if(state){
            EventManager.emit(NameEvent.ON_SPIN, true);
        }
        else{
            this.scheduleOnce(() => {
                this.slotController.stateSpinButton(true);
            }, 0.2);
        }


    }
}