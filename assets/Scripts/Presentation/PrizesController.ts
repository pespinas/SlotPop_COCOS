
import { _decorator, Component, Node} from 'cc';
import {EventManager} from "../Infrastructure/EventManager";
import {NameEvent} from "../Infrastructure/NameEvent";
import { PrizeChecker } from "../Domain/indexD";
import {PrizeCalculator} from "../Application/PrizeCalculator";
import {GameManager} from "../Presentation/GameManager";

const { ccclass, property } = _decorator;
 
@ccclass('PrizesController')
export class PrizesController extends Component{

    private prizeChecker:PrizeChecker = new PrizeChecker();
    private symbolName:string = "";
    private totalWin:number = 0;
    private bet:number = 1;

    protected onLoad(){
        EventManager.on(NameEvent.CHECK_PRIZES,this.checkWin,this);
        EventManager.on(NameEvent.GET_BET,this.setBet,this);
    }
    protected onDestroy(){
        EventManager.off(NameEvent.CHECK_PRIZES,this.checkWin,this);
        EventManager.off(NameEvent.GET_BET,this.setBet,this);
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
    setBet(bet:number){
        this.bet = bet;
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
