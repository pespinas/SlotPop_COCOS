import { _decorator, Component, Node } from 'cc';
export class WallState{
    private static _instance: WallState;
    private stamina: number = 150;
    private hammerStamina:number = 2;
    private pickaxeStamina:number = 1;

    private constructor() {}

    public static getInstance(): WallState {
        if (!this._instance) {
            this._instance = new WallState();
        }
        return this._instance;
    }

    public getStamina(): number{
        return this.stamina;
    }

    private updateStamina(hit:number){
        if((this.stamina - hit) < 0){
            return null;
        }
        this.stamina= this.stamina - hit;
    }

    public registerHit(ishammer: boolean){
        if(ishammer){
            this.updateStamina(this.hammerStamina);
        }
        else{
            this.updateStamina(this.pickaxeStamina);
        }
    }

}