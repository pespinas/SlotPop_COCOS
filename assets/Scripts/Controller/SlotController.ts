
import { _decorator, Component,instantiate, Node,Prefab } from 'cc';
import { NameEvent } from './../Core/NameEvent';
import { EventManager } from './../Core/EventManager';
import { SymbolRNG } from './../Core/SymbolRNG';
import { SymbolController } from './SymbolController';
import { ReelsController } from './ReelsController';
const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {

    @property({ type: [Node] })
    masks = [];
    @property({ type: Prefab })
    symbolPref: Prefab;

    private globalRng = new SymbolRNG();

    onLoad(){
        this.masks.forEach((mask,index) => {
            const newReel = instantiate (this.symbolPref);
            mask.addChild(newReel);
            const reelCtrl = newReel.getComponent(ReelsController);
            reelCtrl.reelIndex = index;

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
