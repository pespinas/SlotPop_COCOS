import { _decorator, Component, Node, TiledMap,TiledLayer} from 'cc';
import {NoiseGenerator} from  'db://assets/Scripts/Domain/Bonus/indexBonusD';
import {TileType} from  'db://assets/Scripts/Domain/Bonus/indexBonusD';
const { ccclass, property } = _decorator;

@ccclass('WallManager')
export class WallManager extends Component {

    @property(TiledMap)
    public mapTiled: TiledMap = null;
    private noise: NoiseGenerator = new NoiseGenerator();
    private readonly WIDTH = 20;
    private readonly HEIGHT = 20;

    start() {
        this.fillMap();
    }
    private fillMap() {
        const layer: TiledLayer = this.mapTiled.getLayer("wall");
        const scale = 0.2;
        for (let x = 0; x < this.WIDTH; x++) {
            for (let y = 0; y < this.HEIGHT; y++) {
                const v = this.noise.get(x * scale, y * scale)* 1.5;
                let gid: number;
                if (v > 0.4) {
                    gid = TileType.LV3_ROCK;
                } else if (v > 0.2) {
                    gid = TileType.LV2_ROCK;
                } else if (v > -0.2) {
                    gid = TileType.LV1_ROCK;
                }  // ID 5
                else {
                    gid = TileType.GROUND;
                }
                layer.setTileGIDAt(gid, x, y);
            }
        }
    }
}