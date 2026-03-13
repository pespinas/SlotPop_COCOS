import {_decorator, Component, Node, tween, Vec3} from 'cc';
import {EventManager} from '../Infrastructure/EventManager';
import {NameEvent} from '../Infrastructure/NameEvent';
import {SymbolController} from "./SymbolController";

const { ccclass, property } = _decorator;

@ccclass('ReelsController')
export class ReelsController extends Component {
    @property({ type: [Node] })
    public symbols: Node[] = [];

    public reelIndex: number = 0;
    private minY = 0;
    private maxY = 0;
    private duration = 0;


    public init(index: number, bottomY: number, topY: number, fallDuration: number) {
        this.reelIndex = index;
        this.minY = bottomY;
        this.maxY = topY;
        this.duration = fallDuration;
    }

    onLoad () {
        EventManager.on(NameEvent.ON_SPIN, this.reelStartMovement, this);

    }
    onDestroy () {
        EventManager.off(NameEvent.ON_SPIN, this.reelStartMovement, this);
    }

    private reelStartMovement(){
        this.symbols.slice().reverse().forEach((symbol) => {
            const ctrl = symbol.getComponent(SymbolController);
            this.reelMovement(symbol,ctrl)
        })
    }
    private eventEndReel() {
        this.node.emit(NameEvent.REEL_STOPPED,);
    }

    private reelMovement(symbol: Node,ctrl: SymbolController) {
        const moveStep = () => {
            const distanceToTravel = symbol.position.y - this.minY;
            const targetY = symbol.position.y;
            const speed = (this.maxY - this.minY) / this.duration;

            const symbolDuration = distanceToTravel / speed;
            const fallInDist = this.maxY - targetY;
            const fallInDuration = Math.max(1.1, fallInDist / speed);
            tween(symbol)
                .delay(distanceToTravel / speed * 0.1 * this.reelIndex)
                .to(symbolDuration, {position: new Vec3(0, this.minY, 0)}, {easing: "quartIn"})
                .call(() => {
                    symbol.setPosition(symbol.position.x, this.maxY, symbol.position.z);
                    ctrl.setNewSprite();
                })
                .to(
                    fallInDuration,
                    { position: new Vec3(symbol.position.x, targetY, symbol.position.z) },
                    { easing: 'bounceOut' }
                )
                .start();
        };
        moveStep();
    }
}
