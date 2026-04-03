
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
        const winningCoords = this.prizeChecker.checkSymbols(symbols);
        if (winningCoords != 0) {
            EventManager.emit(NameEvent.PRIZES_FOUND, winningCoords);
        }
        else{
            EventManager.emit(NameEvent.REQUEST_STOP, false);
        }
    }

}
