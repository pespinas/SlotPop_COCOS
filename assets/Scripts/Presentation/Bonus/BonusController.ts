import { _decorator, Component, Node, Prefab, instantiate} from 'cc';
import {WallData} from "db://assets/Scripts/Domain/Bonus/indexBonusD";
const { ccclass, property } = _decorator;
 
@ccclass('BonusMachine')
export class BonusMachine extends Component {
    @property(Node)
    public bmFront: Node;
    @property(Node)
    public bmBack: Node;
    @property({ type: Prefab })
    wall: Prefab;

    private numFloor: number = 168;

    onLoad(){
        for (let i = 0; i < this.numFloor; i++) {
            let heatlh = 4;
            let data = new WallData(i, heatlh);
            console.log(data.id, data.health)
            const newReel = instantiate (this.wall);
            this.bmFront.addChild(newReel);
        }
    }

}
