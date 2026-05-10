
import { _decorator, Component, TiledLayer,TiledMap } from 'cc';
import {Hardness, TileType} from 'db://assets/Scripts/Domain/Bonus/indexBonusD';
import {EventManager} from "db://assets/Scripts/Infrastructure/EventManager";
import {NameEvent} from "db://assets/Scripts/Infrastructure/NameEvent";
const { ccclass, property } = _decorator;
 
@ccclass('PatternManager')
export class PatternManager extends Component {

    @property(TiledMap)
    public map: TiledMap = null;
    private layerWall: TiledLayer = null;
    start(){
        this.layerWall= this.map.getLayer("wall");
    }
    onLoad(){
        EventManager.on(NameEvent.TILED_TOUCHED, this.onTileClicked, this);
    }
    onDestroy(){
        EventManager.off(NameEvent.TILED_TOUCHED, this.onTileClicked, this);
    }

    private onTileClicked(coord: {x: number, y: number}){
        if(coord.x <= 0 || coord.y <= -1 || coord.x >= 20 || coord.y >= 20 ){
            return false;
        }
        const gid = this.layerWall.getTileGIDAt(coord.x, coord.y);
        const props = this.map.getPropertiesForGID(gid);
        let currentHardness: number = Number(props.hardness);
        let newHardnessV = currentHardness - 1;
        if(newHardnessV <= 1){
            this.layerWall.setTileGIDAt(TileType.NOTHING, coord.x, coord.y);
            this.layerWall.markForUpdateRenderData();
        }
        else{
            let newSprite = Hardness[newHardnessV];
            this.layerWall.setTileGIDAt(TileType[newSprite], coord.x, coord.y);
            this.layerWall.markForUpdateRenderData();
        }
    }
}