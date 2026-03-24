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
    private allreelOrder:{name: string, y: number, node: Node, currentIndex: number}[]= [];
    private visualOrder:{name: string, y: number, node: Node}[]= [];


    public init(index: number, bottomY: number, topY: number, fallDuration: number) {
        this.reelIndex = index;
        this.minY = bottomY;
        this.maxY = topY;
        this.duration = fallDuration;
    }

    onLoad () {
        EventManager.on(NameEvent.ON_SPIN, this.reelStartMovement, this);
        this.symbols.forEach((symbol) => {
            const ctrl = symbol.getComponent(SymbolController);
            this._symbolCtrl.push(ctrl);
        })

    }
    onDestroy () {
        EventManager.off(NameEvent.ON_SPIN, this.reelStartMovement, this);
    }

    private reelStartMovement(){
        this.symbols.forEach((symbol,index) => {
            const ctrl = this._symbolCtrl[index];
            this.reelMovement(symbol,ctrl);
        })
        this.visualOrder = [];
    }
    private eventEndReel() {
        const sortedByY = this._symbolCtrl.sort((a, b) => a.node.position.y - b.node.position.y);
        this.allreelOrder = sortedByY.map((ctrl,index) => ({
            name: ctrl.SymbolName,
            y: ctrl.node.position.y,
            node: ctrl.node,
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
            const fallInDuration = Math.max(1.1, fallInDist / speed);
            tween(symbol)
                .delay(distanceToTravel / speed * 0.1 * this.reelIndex)
                .to(symbolDuration, {position: new Vec3(0, this.minY, 0)}, {easing: "quartIn"})
                .call(() => {
                    symbol.setScale(new Vec3(0.8,0.8,1));
                    symbol.setPosition(symbol.position.x, this.maxY, symbol.position.z);
                    ctrl.setNewSprite();

                })
                .to(fallInDuration, { position: new Vec3(symbol.position.x, targetY, symbol.position.z) }, { easing: 'bounceOut' })
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
            const symbol = this.visualOrder[rowIndex].node;
            tween(symbol)
                .to(0.15, {scale: new Vec3(1.3, 1.3, 1) }, { easing: 'backOut' })
                .to(0.1, {scale: new Vec3(0, 0, 0) }, { easing: 'backIn' })
                .call(() => {
                })
                .start();
        })
        console.log(this.visualOrder)
        this.scheduleOnce(() => {
            this.continueFall(winSymbol, winSize);
        }, 1);
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

        let freeSpot = 0;
        notWinSymbols.forEach((item, i) => {
            const targetY = this.allreelOrder[freeSpot].y;
            tween(item.node)
                .to(0.3, { position: new Vec3(0, targetY, 0) }, { easing: "bounceOut" })
                .call(() => {
                    // Actualizamos los datos para que el símbolo "sepa" donde está ahora
                    item.y = targetY;
                    item.currentIndex = freeSpot;
                })
                .start();
            freeSpot++;
        });
    }
}
