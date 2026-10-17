import {_decorator, Component, instantiate, Node, Prefab,Button} from 'cc';
import {NameEvent} from 'db://assets/Scripts/Infrastructure/NameEvent';
import {EventManager} from 'db://assets/Scripts/Infrastructure/EventManager';
import {SymbolRNG} from 'db://assets/Scripts/Domain/Slot/SymbolRNG';
import {ReelsController} from 'db://assets/Scripts/Presentation/Slot/ReelsController';
import {PresentConfig} from "db://assets/Scripts/Presentation/Slot/PresentConfig";

const { ccclass, property } = _decorator;

@ccclass('SlotController')
export class SlotController extends Component {

    @property({ type: [Node] })
    masks: Node[] = [];
    @property({ type: Prefab, formerlySerializedAs: 'symbolPref' })
    reelPrefab: Prefab;
    @property({ type: Button })
    spinButton: Button;

    @property({ type: PresentConfig})
    config: PresentConfig = null;

    private globalRng = new SymbolRNG();
    private reelControllers: ReelsController[] = [];


    protected onLoad(){
        this.masks.forEach((mask,index) => {
            const newReel = instantiate (this.reelPrefab);
            mask.addChild(newReel);
            const reelCtrl = newReel.getComponent(ReelsController);
            this.reelControllers.push(reelCtrl);
            reelCtrl.init(
                index,
                this.config.bottomY,
                this.config.topY,
                this.config.spinDuration,
                this.globalRng
            );
        });
    }
    private onSpinClick(){
        EventManager.emit(NameEvent.REQUEST_SPIN);
        this.stateSpinButton(false);
    }
    public stateSpinButton(state:boolean) {
        this.spinButton.interactable = state;
    }
    public spin(): Promise<string[][]> {
        return Promise.all(this.reelControllers.map(reel => reel.reelStartMovement()));
    }
    public async playWin(allPrizes: {x: number, y: number}[][]): Promise<string[][]> {
        const winRowsPerReel: number[][]= this.reelControllers.map(() =>[]);
        for (let i = 0; i < allPrizes.length; i++) {
            for (let j = 0; j < allPrizes[i].length; j++) {
                let coord = allPrizes[i][j];
                winRowsPerReel[coord.x].push(coord.y);
            }
        }
        await new Promise<void>(resolve => this.scheduleOnce(() => resolve(), this.config.winAnimationDelay));
        return Promise.all(winRowsPerReel.map((rows,index) => this.reelControllers[index].startWinAnimation(rows)));
    }

}
