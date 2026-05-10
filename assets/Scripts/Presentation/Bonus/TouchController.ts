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

    private uiTransform: UITransform = null;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private visualTileWidth: number = 0;
    private mapSize: { width: number, height: number } = { width: 0, height: 0 };
    private isHammer: boolean = false;

    start() {
        EventManager.on(NameEvent.TOUCH_START, this.onTouchStart, this)
        this.node.on('touch-start', this.onTouchStart, this);
        this.getTouchReady();
    }
    onDestroy() {
        EventManager.off(NameEvent.TOUCH_START, this.onTouchStart, this)
    }
    private changeTool(event: Event, datatoolState: string){
        this.isHammer = Boolean(Number(datatoolState));
    }

    private onTouchStart(event: EventTouch) {
        const touchPos = event.getLocation();
        const worldPos = new Vec3();
        this.mainCamera.screenToWorld(new Vec3(touchPos.x, touchPos.y, 0), worldPos);

        const localPos = this.uiTransform.convertToNodeSpaceAR(worldPos);

        let xRelative = localPos.x + this.offsetX;
        let yRelative = this.offsetY - localPos.y;
        let tileX = Math.floor(xRelative  /  this.visualTileWidth);
        let tileY = Math.floor(yRelative / (this.map.getTileSize().height));
        if (tileX > 0 && tileX < this.mapSize.width-1 && tileY >= 0 && tileY < this.mapSize.height) {
            this.onTileClicked(tileX, tileY);
        }
    }

    private onTileClicked(x: number, y: number) {
        if(this.isHammer){
            const positions = [
                { dx: 0, dy: 0 },
                { dx: 0, dy: -1 },
                { dx: 0, dy: 1 },
                { dx: -1, dy: 0 },
                { dx: 1, dy: 0 }
            ];
            positions.forEach(pos => {
                const coord: {x: number, y: number} = { x: x + pos.dx, y: y + pos.dy };
                EventManager.emit(NameEvent.TILED_TOUCHED, coord);
            });
        }
        else{
            const coord: {x: number, y: number} = { x, y };
            EventManager.emit(NameEvent.TILED_TOUCHED, coord);
        }
    }

    private getTouchReady(){
        this.uiTransform = this.map.node.getComponent(UITransform);
        const mSize = this.map.getMapSize();

        this.offsetX = this.uiTransform.width / 2;
        this.offsetY = this.uiTransform.height / 2;
        this.visualTileWidth = this.map.getTileSize().width;
        this.mapSize = { width: mSize.width, height: mSize.height };
    }

}