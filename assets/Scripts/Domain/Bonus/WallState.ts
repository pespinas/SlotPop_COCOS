import { _decorator, Component, Node } from 'cc';
export class WallState{
    private static _instance: WallState;
    private stamina: number = 100;
    private hammerStamina:number = 5;
    private pickaxeStamina:number = 2;

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