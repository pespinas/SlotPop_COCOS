import { _decorator, Component, Node, TiledMap,TiledLayer} from 'cc';
import {NoiseGenerator} from  'db://assets/Scripts/Domain/Bonus/indexBonusD';
import {TileType,GEMS,PrizesWallet,RewardGems} from  'db://assets/Scripts/Domain/Bonus/indexBonusD';
const { ccclass, property } = _decorator;

@ccclass('WallManager')
export class WallManager extends Component {

    @property(TiledMap)
    public mapTiled: TiledMap = null;
    private noise: NoiseGenerator = new NoiseGenerator();
    private readonly WIDTH = 20;
    private readonly HEIGHT = 20;
    private numPrizes = 7;
    private gemsName: string[] = ["GREEN","RED","BLUE"];
    private positionGems = [
        {dx: 0, dy: 0},
        {dx: 1, dy: 0},
        {dx: 0, dy: 1},
        {dx: 1, dy: 1},
    ];


    protected start() {
        this.fillMap();
    }
    private fillMap() {
        const layer: TiledLayer = this.mapTiled.getLayer("wall");

        const scale = 0.2;
        for (let x = 1; x < this.WIDTH; x++) {
            for (let y = 0; y < this.HEIGHT; y++) {
                const v = this.noise.get(x * scale, y * scale)* 1.5;
                let gid: number;
                if (v > 0.4) {
                    gid = TileType.LV3_ROCK;
                } else if (v > 0.2) {
                    gid = TileType.LV2_ROCK;
                } else if (v > -0.2) {
                    gid = TileType.LV1_ROCK;
                }
                else {
                    gid = TileType.GROUND;
                }
                layer.setTileGIDAt(gid, x, y);
            }
        }
        for (let i = 0; i < this.numPrizes; i++) {
            this.fillPrizes();
        }

    }

    private fillPrizes() {
        let startX = Math.floor(Math.random() * 19) + 1;
        let startY = Math.floor(Math.random() * 20);
        if (startX == 19 && startY == 19) {
            startX--;
            startY--;
        }
        if (startX == 19) {
            startX--;
        }
        if (startY == 19){
            startY--;
        }
        const isNotPrinted = this.itsPrinted(startX, startY);
        if(isNotPrinted){
            this.printPrizes(startX, startY);
        }
        else{
            this.fillPrizes();
        }
    }
    private printPrizes(startX: number, startY: number){
        const layerP: TiledLayer = this.mapTiled.getLayer("prizes");
        const nameRandom = Math.floor(Math.random() * 3);
        const gemName = this.gemsName[nameRandom];
        const selectedGem = GEMS[gemName];
        const stringPositions: string[] = [];

        this.positionGems.forEach((pos, index) => {
            layerP.setTileGIDAt(selectedGem.tiles[index], startX + pos.dx, startY + pos.dy);
            stringPositions.push(`${startX + pos.dx},${startY + pos.dy}`);
        });

        const newPrize: RewardGems = {
            id: `${gemName}_${Date.now()}_${Math.floor(Math.random() * 100)}`,
            name: selectedGem.id,
            prize: selectedGem.prize,
            positions: stringPositions,
            userPositions: []
        };
        PrizesWallet.getInstance().registerPrizes(newPrize);
    }

    private itsPrinted(x: number, y: number){
        const layerP: TiledLayer = this.mapTiled.getLayer("prizes");

        for (const pos of this.positionGems) {
            const currentGid = layerP.getTileGIDAt(x + pos.dx, y + pos.dy);
            if (currentGid !== 0) {
                return false;
            }
        };
        return true;
    }

}