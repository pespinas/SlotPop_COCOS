import {PrizesWallet} from "db://assets/Scripts/Domain/Bonus/indexBonusD";

export class PrizeBonusCheck {
    public static execute(x:number, y:number){
        const coordString = `${x},${y}`;
        const prizeMoney = PrizesWallet.getInstance().checkHit(coordString);
        if(prizeMoney > 0){
            return prizeMoney;
        }
        return 0;
    }

}