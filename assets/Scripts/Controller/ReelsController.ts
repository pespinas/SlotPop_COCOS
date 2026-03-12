
import { _decorator, Component, Node, Sprite, tween, Vec3, TweenSystem,SpriteAtlas } from 'cc';
import {EventManager} from "db://assets/Scripts/Core/EventManager";
import {NameEvent} from "db://assets/Scripts/Core/NameEvent";
import {SymbolController} from "db://assets/Scripts/Controller/SymbolController";
import {SymbolRNG} from "db://assets/Scripts/Core/SymbolRNG";
const { ccclass, property } = _decorator;

@ccclass('ReelsController')
export class ReelsController extends Component {
    @property({ type: [Node] })
    public symbols: Node[] = [];

    public reelIndex: number = 0;
    private minY = -436;
    private maxY = 419;
    private duration = 1;

    onLoad () {
        EventManager.on(NameEvent.ON_SPIN, this.reelStartMovement, this);
    }
    onDestroy () {
        EventManager.off(NameEvent.ON_SPIN, this.reelStartMovement, this);
    }

    private reelStartMovement(){
        this.symbols.slice().reverse().forEach((symbol) => {
            this.reelMovement(symbol)
        })
    }

    private reelMovement(symbol: Node) {
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
                    const ctrl = symbol.getComponent(SymbolController);
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
