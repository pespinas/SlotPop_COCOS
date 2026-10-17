
import { _decorator, Component} from 'cc';
import { PrizeChecker } from "db://assets/Scripts/Domain/Slot/PrizeChecker";
import {PrizeCalculator} from "db://assets/Scripts/Application/Slot/PrizeCalculator";

const { ccclass, property } = _decorator;

@ccclass('PrizesController')
export class PrizesController extends Component{

    private prizeChecker:PrizeChecker = new PrizeChecker();
    private symbolName:string = "";
    private bet:number = 1;

    public evaluate(symbols: string[][]): { coord: {x: number, y: number}[][], win: number } | null {
        const result = this.prizeChecker.checkSymbols(symbols);
        if (!result) return null;
        return { coord: result.coord, win: this.prizeSymbol(result) };
    }
    public setBet(bet:number){
        this.bet = bet;
    }

    private prizeSymbol(result): number {
        let win = 0;
        for (let i = 0; i < result.coord.length; i++) {
            for (let j = 0; j < result.symbols[i].length; j++) {
                this.symbolName = result.symbols[i];
            }
            win += PrizeCalculator.calculateWin(this.symbolName, result.coord[i].length, this.bet);
        }
        return win;
    }

}
