export interface RewardGems {
    id: string;
    name: string;
    prize: number;
    positions: string[];
    userPositions: string[];
}

export class PrizesWallet{
    private static _instance: PrizesWallet;
    private myPrizes: RewardGems[] = [];

    private constructor() {}

    public static getInstance(): PrizesWallet {
        if (!this._instance) {
            this._instance = new PrizesWallet();
        }
        return this._instance;
    }
    public clearWallet(): void {
        this.myPrizes = [];
    }
    public registerPrizes(newPrize: RewardGems): void {
        this.myPrizes.push(newPrize);
    }
    public checkHit(coordString: string): number {
        const foundGem = this.myPrizes.find(gem => gem.positions.indexOf(coordString) >= 0);
        if (!foundGem) {
            return 0;
        }
        if (foundGem.userPositions.indexOf(coordString) >= 0) {
            return 0;
        }
        foundGem.userPositions.push(coordString);
        if(foundGem.userPositions.length === foundGem.positions.length){
            return foundGem.prize;
        }
        return 0
    }
}

