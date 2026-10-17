import {_decorator, Component, JsonAsset} from 'cc';
import {EventManager} from "db://assets/Scripts/Infrastructure/EventManager";
import {NameEvent} from "db://assets/Scripts/Infrastructure/NameEvent";
import {SlotController} from "db://assets/Scripts/Presentation/Slot/SlotController";
import {SlotLabelController} from "db://assets/Scripts/Presentation/Slot/SlotLabelController";
import {LocalizationService} from "db://assets/Scripts/Application/Common/LocalizationService";
import {Balance} from "db://assets/Scripts/Domain/Common/Balance";
import {PrizesController} from "db://assets/Scripts/Presentation/Slot/PrizesController";
import {SceneName} from "db://assets/Scripts/Domain/Common/SceneDefinition";
import {SceneController} from "db://assets/Scripts/Presentation/Common/SceneController";

const { ccclass, property } = _decorator;
 
@ccclass('GameManager')
export class GameManager extends Component {
    @property(JsonAsset)
    public labelText: JsonAsset;
    @property(SlotLabelController)
    public label: SlotLabelController;
    @property(SlotController)
    public slotController: SlotController;
    @property(PrizesController)
    public prizesController: PrizesController;
    @property(SceneController)
    public SceneChanger: SceneController;

    private betId: number;
    private bet: number;
    private totalWon:number = 0;

    protected onLoad(){
        EventManager.on(NameEvent.REQUEST_SPIN, this.onSpinRequested, this)
        EventManager.on(NameEvent.SCENE, this.changeScenes, this)

        LocalizationService.init(this.labelText.json);
        this.betId = Balance.getInstance().getBetId();
        this.bet = Balance.getInstance().getBet(this.betId);

        this.updateBalance(0);
        this.label.changeBet(this.betId, this.bet);
        this.updateLabel();
    }
    protected onDestroy() {
        EventManager.off(NameEvent.REQUEST_SPIN, this.onSpinRequested, this)
        EventManager.off(NameEvent.SCENE, this.changeScenes, this)
    }
    public getBetState(){
        return this.betId;
    }
    public changeScenes(){
        this.SceneChanger.startLoadingBonus(SceneName.BONUS_SLOT);
    }
    private updateLabel(){
        this.label.idleText();
    }
    private wonLabel(value:number){
        this.totalWon += value;
        this.label.wonText(this.totalWon);
        this.updateBalance(value);
    }
    private updateBalance(value:number){
        Balance.getInstance().addMoney(value);
        const total = Balance.getInstance().getBalance();
        this.label.totalWinText(total);
    }
    private changeBet(){
        Balance.getInstance().changeBet();
        this.betId = Balance.getInstance().getBetId();
        this.bet = Balance.getInstance().getBet(this.betId);
        this.label.changeBet(this.betId, this.bet);
    }
    private updateBalanceOnSpin(){
        Balance.getInstance().spendMoney(this.bet);
        this.updateBalance(0);
    }
    private async onSpinRequested(){
        this.prizesController.setBet(this.betId);
        this.label.stateBetButton(false);
        this.updateBalanceOnSpin();

        let symbols = await this.slotController.spin();
        let result = this.prizesController.evaluate(symbols);
        while (result) {
            this.wonLabel(result.win);
            symbols = await this.slotController.playWin(result.coord);
            result = this.prizesController.evaluate(symbols);
        }

        this.scheduleOnce(() => {
            this.bonusStartCheck();
            this.slotController.stateSpinButton(true);
            this.label.stateBetButton(true);
            this.updateLabel();
        }, 0.4);
    }
    private bonusStartCheck(){
        if(this.totalWon >= this.bet * 3){
            this.SceneChanger.startLoadingBonus(SceneName.BONUS_SLOT);
        }
        this.totalWon = 0;
    }
}