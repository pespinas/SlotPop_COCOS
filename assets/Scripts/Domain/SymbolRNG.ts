import {SymbolConfig} from "../Domain/indexD";

export class SymbolRNG{
    private probabilitiesSymbol:number[] = [30, 25, 20, 20, 10, 5, 1];
    private allSymbols = Object.keys(SymbolConfig.SYMBOL_DATA);

    public randomIndexSymbol(){
        let totalWeight = 0;
        for (let w of this.probabilitiesSymbol) totalWeight += w;

        let cum = 0;
        const randomValue = Math.random() * totalWeight;

        for (let i = 0; i < this.probabilitiesSymbol.length; i++) {
            cum += this.probabilitiesSymbol[i];
            if(randomValue < cum)
            {
                return this.allSymbols[i];
            }
        }
        return this.allSymbols[0];
    }
}