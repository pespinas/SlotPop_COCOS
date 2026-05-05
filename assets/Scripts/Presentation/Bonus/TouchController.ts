import { _decorator, Component, EventTouch, Vec3, UITransform, TiledMap, Camera,TiledLayer } from 'cc';
import {EventManager} from "db://assets/Scripts/Infrastructure/EventManager";
import {NameEvent} from "db://assets/Scripts/Infrastructure/NameEvent";
const { ccclass, property } = _decorator;

@ccclass('TouchController')
export class TouchController extends Component {

    @property(Camera)
    public mainCamera: Camera = null;

    @property(TiledMap)
    public map: TiledMap = null;

    @property(TiledLayer)
    public layerMap: TiledLayer = null;
    private _uiTransform: UITransform = null;
    private _offsetX: number = 0;
    private _offsetY: number = 0;
    private _visualTileWidth: number = 0;
    private _visualTileHeight: number = 0;
    private _mapSize: { width: number, height: number } = { width: 0, height: 0 };

    start() {
        EventManager.on(NameEvent.TOUCH_START, this.onTouchStart, this)
        this.node.on('touch-start', this.onTouchStart, this);
        this.getTouchReady();
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = event.getLocation();
        const worldPos = new Vec3();
        this.mainCamera.screenToWorld(new Vec3(touchPos.x, touchPos.y, 0), worldPos);

        const localPos = this._uiTransform.convertToNodeSpaceAR(worldPos);

        let xRelative = localPos.x + this._offsetX;
        let yRelative = localPos.y + this._offsetY;
        let tileX = Math.floor(xRelative  /  this._visualTileWidth);
        let tileY = Math.floor(yRelative / this._visualTileHeight);
        console.log(tileX,tileY)
        console.log(this._mapSize.width)
        if (tileX > 0 && tileX < this._mapSize.width-1 && tileY >= 0 && tileY < this._mapSize.height) {
            this.onTileClicked(tileX, tileY);
        }
    }

    private onTileClicked(x: number, y: number) {
        const gid = this.layerMap.getTileGIDAt(x, y);
        //console.log("xxxxx",gid);
    }

    private getTouchReady(){
        this._uiTransform = this.map.node.getComponent(UITransform);
        const scale = this.map.node.scale;
        const tileSize = this.map.getTileSize();
        const mSize = this.map.getMapSize();

        this._offsetX = this._uiTransform.width / 2;
        this._offsetY = this._uiTransform.height / 2;
        this._visualTileWidth = this.map.getTileSize().width;
        this._visualTileHeight = this.map.getTileSize().height;
        this._mapSize = { width: mSize.width, height: mSize.height };
    }

}