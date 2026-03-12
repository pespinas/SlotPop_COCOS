import {_decorator, Component, Sprite, SpriteAtlas} from 'cc';
import {SymbolRNG} from 'db://assets/Scripts/Core/SymbolRNG';

const { ccclass, property } = _decorator;
 
@ccclass('SymbolController')
export class SymbolController extends Component{

    @property(SpriteAtlas)
    public symbolAtlas: SpriteAtlas = null;
    @property([String])
    public spriteNames: string[] = ["125","126","127","130","131","132","133"];

    private sprite: Sprite;
    private rng: SymbolRNG

    onLoad() {
        this.sprite = this.getComponent(Sprite);
    }
    public init(rng: SymbolRNG) {
        this.rng = rng;
    }
    public setNewSprite() {
        const index = this.rng.randomIndexSymbol();
        const name = this.spriteNames[index];
        this.sprite.spriteFrame =this.symbolAtlas.getSpriteFrame(name);
    }


}
