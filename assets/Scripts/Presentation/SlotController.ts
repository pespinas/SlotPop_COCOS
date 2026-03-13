
import { _decorator, Component,instantiate, Node,Prefab } from 'cc';
import { NameEvent } from '../Infrastructure/NameEvent';
import { EventManager } from '../Infrastructure/EventManager';
import { SymbolRNG } from '../Domain/SymbolRNG';
import { SymbolController } from './SymbolController';
import { ReelsController } from './ReelsController';
import {PresentConfig} from "./PresentConfig";
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {

    @property({ type: [Node] })
    masks = [];
    @property({ type: Prefab })
    symbolPref: Prefab;

    @property({ type: PresentConfig})
    config: PresentConfig = null;

    private globalRng = new SymbolRNG();

    onLoad(){
        this.masks.forEach((mask,index) => {
            const newReel = instantiate (this.symbolPref);
            mask.addChild(newReel);
            const reelCtrl = newReel.getComponent(ReelsController);
            reelCtrl.init(
                index,
                this.config.bottomY,
                this.config.topY,
                this.config.spinDuration
            );

            const childController = newReel.getComponentsInChildren(SymbolController);
            childController.forEach(ctrl => {
                ctrl.init(this.globalRng);
                ctrl.setNewSprite();
            });
        });
    }
    private onSpinClick(){
        EventManager.emit(NameEvent.ON_SPIN, true);
    }

}
