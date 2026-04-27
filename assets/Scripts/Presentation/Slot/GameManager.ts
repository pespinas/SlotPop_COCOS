import {_decorator, Component, JsonAsset} from 'cc';
import {EventManager} from "db://assets/Scripts/Infrastructure/Slot/EventManager";
import {NameEvent} from "db://assets/Scripts/Infrastructure/Slot/NameEvent";
import {SlotController} from "db://assets/Scripts/Presentation/Slot/SlotController";
import {LabelController} from "db://assets/Scripts/Presentation/Slot/LabelController";
import { LocalizationService } from "db://assets/Scripts/Application/Slot/LocalizationService";
import {Balance} from "db://assets/Scripts/Domain/Slot/Balance";
import {PrizesController} from "db://assets/Scripts/Presentation/Slot/PrizesController";

const { ccclass, property } = _decorator;
 
@ccclass('GameManager')
export class GameManager extends Component {
    @property(JsonAsset)
    public labelText: JsonAsset;
    @property(LabelController)
    public label: LabelController;
    @property(SlotController)
    public slotController: SlotController;
    @property(PrizesController)
    public prizesController: PrizesController;


    private betId: number;
    private bet: number;
    private balance: Balance = new Balance();

    protected onLoad(){
        EventManager.on(NameEvent.REQUEST_SPIN, this.buttonState, this)
        EventManager.on(NameEvent.REQUEST_STOP, this.buttonState, this)
        EventManager.on(NameEvent.PRIZES_PAY, this.wonLabel, this)

        LocalizationService.init(this.labelText.json);
        this.betId = this.balance.getBetId();
        this.bet = this.balance.getBet(this.betId);

        this.updateBalance(0);
        this.updateLabel();
    }
    protected onDestroy() {
        EventManager.off(NameEvent.REQUEST_SPIN, this.buttonState)
        EventManager.off(NameEvent.REQUEST_STOP, this.buttonState)
        EventManager.off(NameEvent.PRIZES_PAY, this.wonLabel)
    }
    public getBetState(){
        return this.betId;
    }
    private updateLabel(){
        this.label.idleText();
    }
    private wonLabel(value:number){
        this.label.wonText(value);
        this.updateBalance(value);
    }
    private updateBalance(value:number){
        this.balance.addMoney(value);
        const total = this.balance.getBalance();
        this.label.totalWinText(total);
    }
    private changeBet(){
        this.balance.changeBet();
        this.betId = this.balance.getBetId();
        this.bet = this.balance.getBet(this.betId);
        this.label.changeBet(this.betId, this.bet);
    }
    private updateBalanceOnSpin(){
        this.balance.spendMoney(this.bet);
        this.updateBalance(0);
    }
    private buttonState(state: boolean){
        if(state){
            this.slotController.startSpin();
            this.prizesController.setBet(this.betId);
            this.label.stateBetButton(false);
            this.updateBalanceOnSpin();
        }
        else{
            this.scheduleOnce(() => {
                this.slotController.stateSpinButton(true);
                this.label.stateBetButton(true);
                this.updateLabel();
            }, 0.4);

        }


    }
}