import {userBet, userDefault} from "../Domain/GameConfig"

export class Balance {
    private currentBalance: number = userDefault.INITIAL_BALANCE;
    private currentBetId:number = 1;
    private currentBet:number = userBet.BET1;

    public getBalance(): number {
        return this.currentBalance;
    }
    public getBetId(): number {
        return this.currentBetId;
    }
    public addMoney(amount: number): void {
        this.currentBalance += amount;
    }
    public changeBet(){
        this.currentBetId += 1;
        if(this.currentBetId > 3) this.currentBetId = 1;
    }
    public getBet(bet:number){
        this.currentBet = userBet.BET1;
        if(bet == 2){this.currentBet = userBet.BET2}
        if(bet == 3){this.currentBet = userBet.BET3}
        return this.currentBet;
    }
    public spendMoney(amount: number): boolean {
        if (this.currentBalance >= amount) {
            this.currentBalance -= amount;
            return true;
        }
        return false;

    }
}