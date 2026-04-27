
import { _decorator, Component, Node} from 'cc';
import {EventManager} from "db://assets/Scripts/Infrastructure/Slot/EventManager";
import {NameEvent} from "db://assets/Scripts/Infrastructure/Slot/NameEvent";
import { PrizeChecker } from "db://assets/Scripts/Domain/Slot/PrizeChecker";
import {PrizeCalculator} from "db://assets/Scripts/Application/Slot/PrizeCalculator";

const { ccclass, property } = _decorator;
 
@ccclass('PrizesController')
export class PrizesController extends Component{

    private prizeChecker:PrizeChecker = new PrizeChecker();
    private symbolName:string = "";
    private totalWin:number = 0;
    private bet:number = 1;

    protected onLoad(){
        EventManager.on(NameEvent.CHECK_PRIZES,this.checkWin,this);
    }
    protected onDestroy(){
        EventManager.off(NameEvent.CHECK_PRIZES,this.checkWin,this);
    }
    private checkWin(symbols: string[][]) {
        const result = this.prizeChecker.checkSymbols(symbols);
        if (result) {
            const coordW = result.coord;
            EventManager.emit(NameEvent.PRIZES_FOUND, coordW);
            this.prizeSymbol(result);
        }
        else{
            EventManager.emit(NameEvent.REQUEST_STOP, false);
            this.totalWin = 0;
        }
    }
    public setBet(bet:number){
        this.bet = bet;
        console.log(this.bet)
    }

    private prizeSymbol(result){
        for (let i = 0; i < result.coord.length; i++) {
            for (let j = 0; j < result.symbols[i].length; j++) {
                this.symbolName = result.symbols[i];
            }
            const prizeResult = PrizeCalculator.calculateWin(this.symbolName, result.coord[i].length, this.bet);
            this.totalWin += prizeResult;
        }
        EventManager.emit(NameEvent.PRIZES_PAY, this.totalWin);
    }

}
