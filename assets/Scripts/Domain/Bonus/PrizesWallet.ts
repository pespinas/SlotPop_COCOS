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
}

