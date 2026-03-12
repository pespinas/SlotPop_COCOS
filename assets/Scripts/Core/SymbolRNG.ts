
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SymbolRNG')
export class SymbolRNG{
    private probabilitiesSymbol:number[] = [30, 25, 20, 20, 10, 5, 1];

    public randomIndexSymbol(){
        let totalWeight = 0;
        for (let w of this.probabilitiesSymbol) totalWeight += w;
        let cum = 0;
        const randomValue = Math.random() * totalWeight;

        for (let i = 0; i < this.probabilitiesSymbol.length; i++) {
            cum += this.probabilitiesSymbol[i];
            if(randomValue < cum)
            {
                let index = i;
                return index;
            }
        }
        return 0;
    }
}