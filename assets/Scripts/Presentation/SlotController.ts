import {_decorator, Component, instantiate, Node, Prefab} from 'cc';
import {NameEvent} from '../Infrastructure/NameEvent';
import {EventManager} from '../Infrastructure/EventManager';
import {SymbolRNG} from '../Domain/SymbolRNG';
import {SymbolController} from './SymbolController';
import {ReelsController} from './ReelsController';
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
    private resultSlot: string[][] = [];
    private reelControllers: ReelsController[] = [];
    private count: number = 0;


    onLoad(){
        this.masks.forEach((mask,index) => {
            const newReel = instantiate (this.symbolPref);
            mask.addChild(newReel);
            const reelCtrl = newReel.getComponent(ReelsController);
            this.reelControllers.push(reelCtrl);
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
        EventManager.on(NameEvent.REEL_STOPPED, this.EndReelResult, this);
        EventManager.on(NameEvent.PRIZES_FOUND, this.onPrizesFound, this);
    }
    onDestroy(){
        EventManager.off(NameEvent.REEL_STOPPED, this.EndReelResult, this);
        EventManager.off(NameEvent.PRIZES_FOUND, this.onPrizesFound, this);
    }
    private onSpinClick(){
        EventManager.emit(NameEvent.ON_SPIN, true);
        this.count = 0;
        this.resultSlot = [];
    }
    private onPrizesFound(allPrizes: {x: number, y: number}[][]){
        const rowsSymbols: number[][]= this.reelControllers.map(() =>[]);
        for (let i = 0; i < allPrizes.length; i++) {
            for (let j = 0; j < allPrizes[i].length; j++) {
                let coord = allPrizes[i][j];
                rowsSymbols[coord.x].push(coord.y);
            }
        }
        rowsSymbols.forEach((rows,index) => {
            if (rows.length >0){
                this.reelControllers[index].startWinAnimation(rows);
            }
        })
    }
    private EndReelResult(data: { symbols: string[], index: number }){
        this.resultSlot[data.index] = data.symbols;
        this.count++;
        if(this.count == this.masks.length){
            EventManager.emit(NameEvent.CHECK_PRIZES, this.resultSlot);
        }
    }

}
