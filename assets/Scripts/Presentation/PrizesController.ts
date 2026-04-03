
import { _decorator, Component, Node} from 'cc';
import {EventManager} from "../Infrastructure/EventManager";
import {NameEvent} from "../Infrastructure/NameEvent";
import { PrizeChecker } from "../Domain/PrizeChecker";
const { ccclass, property } = _decorator;
 
@ccclass('PrizesController')
export class PrizesController extends Component{

    private prizeChecker = new PrizeChecker();

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
            const nameSymb = result.symbols;

            EventManager.emit(NameEvent.PRIZES_FOUND, coordW);
            EventManager.emit(NameEvent.PRIZES_PAY, nameSymb);
        }
        else{
            EventManager.emit(NameEvent.REQUEST_STOP, false);
        }
    }

}
