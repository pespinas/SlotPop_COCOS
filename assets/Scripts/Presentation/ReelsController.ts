import {_decorator, Component, Node, tween, Vec3} from 'cc';
import {EventManager} from '../Infrastructure/EventManager';
import {NameEvent} from '../Infrastructure/NameEvent';
import {SymbolController} from "./SymbolController";

const { ccclass, property } = _decorator;

@ccclass('ReelsController')
export class ReelsController extends Component {
    @property({ type: [Node] })
    public symbols: Node[] = [];
    private _symbolCtrl: SymbolController[] = [];

    public reelIndex: number = 0;
    private minY = 0;
    private maxY = 0;
    private duration = 0;
    private count= 0;
    private result: string[]=[];
    private allreelOrder:{name: string, y: number, currentIndex: number,ctrl: any;}[]= [];
    private visualOrder:{name: string, y: number, ctrl: any}[]= [];


    public init(index: number, bottomY: number, topY: number, fallDuration: number) {
        this.reelIndex = index;
        this.minY = bottomY;
        this.maxY = topY;
        this.duration = fallDuration;
    }

    protected onLoad () {
        EventManager.on(NameEvent.ON_SPIN, this.reelStartMovement, this);
        this.symbols.forEach((symbol) => {
            const ctrl = symbol.getComponent(SymbolController);
            this._symbolCtrl.push(ctrl);
        })

    }
    protected onDestroy () {
        EventManager.off(NameEvent.ON_SPIN, this.reelStartMovement, this);
    }

    private reelStartMovement(){
        this._symbolCtrl.sort((a, b) => a.node.position.y - b.node.position.y);
        this._symbolCtrl.forEach((symbol,index) => {
            const ctrl = this._symbolCtrl[index];
            this.reelMovement(symbol.node,ctrl);
        })
        this.visualOrder = [];
    }
    private eventEndReel() {
        const sortedByY = [...this._symbolCtrl].sort((a, b) => a.node.position.y - b.node.position.y);
        this.allreelOrder = sortedByY.map((ctrl,index) => ({
            name: ctrl.SymbolName,
            y: ctrl.node.position.y,
            ctrl: ctrl,
            currentIndex: index
        }));
        this.allreelOrder.sort((a,b) => a.y - b.y);
        this.visualOrder = [...this.allreelOrder];
        this.visualOrder.pop();
        this.visualOrder.forEach((ctrl,index) => {
            this.result.push(ctrl.name);
        });

        EventManager.emit(NameEvent.REEL_STOPPED,{symbols:[...this.result], index: this.reelIndex});
        this.result.length = 0;
        this.count = 0;
    }

    private reelMovement(symbol: Node,ctrl: SymbolController) {
        const moveStep = () => {
            const distanceToTravel = symbol.position.y - this.minY;
            const targetY = symbol.position.y;
            const speed = (this.maxY - this.minY) / this.duration;
            const symbolDuration = distanceToTravel / speed;
            const fallInDist = this.maxY - targetY;
            const fallInDuration = Math.max(0.9, fallInDist / speed);
            tween(symbol)
                .delay(distanceToTravel / speed * 0.1 * this.reelIndex)
                .to(symbolDuration, {position: new Vec3(0, this.minY, 0)}, {easing: "quartIn"})
                .call(() => {
                    symbol.setPosition(0, this.maxY, 0);
                    ctrl.setNewSprite();
                })
                .to(fallInDuration, { position: new Vec3(0, targetY, 0) }, { easing: 'bounceOut' })
                .call(() =>{
                    this.count++
                    if (this.count == this.symbols.length)this.eventEndReel();
                })
                .start();
        };
        moveStep();
    }
    public startWinAnimation(winSymbol: number[]){
        const winSize= winSymbol.length;
        winSymbol.forEach(rowIndex => {
            const symbol = this.visualOrder[rowIndex].ctrl.node;
            tween(symbol)
                .to(0.15, {scale: new Vec3(1.3, 1.3, 1) }, { easing: 'backOut' })
                .to(0.30, {scale: new Vec3(0, 0, 0) }, { easing: 'backIn' })
                .call(() => {
                })
                .start();
        })
        this.scheduleOnce(() => {
            this.continueFall(winSymbol, winSize);
        }, 0.5);
    }

    private continueFall(winSymbol: number[], numSymbol: number){
        const winningSymbols = this.allreelOrder.filter(symbol =>
            winSymbol.indexOf(symbol.currentIndex) != -1
        );
        const notWinSymbols = this.allreelOrder.filter(symbol =>
            winSymbol.indexOf(symbol.currentIndex) == -1
        );
        notWinSymbols.sort((a, b) => a.y - b.y);
        winningSymbols.sort((a, b) => a.y - b.y);
        let countSymbol=0;
        const onFinish = () => {
            countSymbol++;
            if (countSymbol === this.allreelOrder.length) {
                this.eventEndReel();
            }
        };


        let freeSpot = 0;
        notWinSymbols.forEach((symbol, i) => {
            const targetY = this.allreelOrder[freeSpot].y;
            tween(symbol.ctrl.node)
                .to(0.3, { position: new Vec3(0, targetY, 0) }, { easing: "bounceOut" })
                .call(() => {
                    symbol.y = targetY;
                    symbol.currentIndex = freeSpot;
                    onFinish();
                })
                .start();
            freeSpot++;
        });

        winningSymbols.forEach((symbol, i) => {
            symbol.ctrl.node.setPosition(0, this.maxY, 0);
            symbol.ctrl.setNewSprite();
            symbol.ctrl.node.setScale(new Vec3(0.8,0.8,0));
            const targetY = this.allreelOrder[freeSpot].y;
            tween(symbol.ctrl.node)
                .to(0.3, { position: new Vec3(0, targetY, 0) }, { easing: "bounceOut" })
                .call(() => {
                    onFinish();
                })
                .start();
            freeSpot++;
        })
    }
}
