import {SymbolConfig} from "../Domain/GameConfig";


export class PrizeCalculator{

    private static symbolValues = SymbolConfig.SYMBOL_DATA;

    public static calculateWin(name:string, size: number){
        const value = this.symbolValues[name] * size;
        return value;
    }
}