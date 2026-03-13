import {_decorator, Component, Sprite, SpriteAtlas} from 'cc';
import {SymbolRNG} from "db://assets/Scripts/Domain/SymbolRNG";

const { ccclass, property } = _decorator;
 
@ccclass('SymbolController')
export class SymbolController extends Component{

    @property(SpriteAtlas)
    public symbolAtlas: SpriteAtlas = null;

    private sprite: Sprite;
    private rng: SymbolRNG

    onLoad() {
        this.sprite = this.getComponent(Sprite);
    }
    public init(rng: SymbolRNG) {
        this.rng = rng;
    }
    public setNewSprite() {
        const symbolId = this.rng.randomIndexSymbol();
        this.sprite.spriteFrame = this.symbolAtlas.getSpriteFrame(symbolId);
    }


}
