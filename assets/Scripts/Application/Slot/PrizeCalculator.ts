import {SymbolConfig} from "db://assets/Scripts/Domain/Slot/GameConfig";


export class PrizeCalculator{

    private static symbolValues = SymbolConfig.SYMBOL_DATA;

    public static calculateWin(name:string, size: number, bet: number){
        const value = this.symbolValues[name] * bet * size;
        return value;
    }
}