import { _decorator, Component, Node, view, v3, screen, view as ccView, Mask, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AdaptiveUIController')
export class AdaptiveUIController extends Component {

    @property(Camera)
    public gameCamera: Camera;

    @property(Node)
    public contentToZoom: Node; // El nodo raíz del contenido

    protected onLoad() {
        view.on('canvas-resize', this.adjustCamera, this);
        window.addEventListener('resize', this.adjustCamera.bind(this));
        this.adjustCamera();
    }

    protected onDestroy() {
        view.off('canvas-resize', this.adjustCamera, this);
    }

    private adjustCamera() {
        if (!this.gameCamera) return;

        const canvasSize = ccView.getCanvasSize();
        const designSize = ccView.getDesignResolutionSize();
        
        const deviceAspect = canvasSize.width / canvasSize.height;
        const designAspect = designSize.width / designSize.height;

        let cameraHeight = designSize.height / 2;
        let contentScale = 1;

        if (deviceAspect > designAspect) {
            cameraHeight = designSize.height / 2;
            contentScale = deviceAspect / designAspect;
        } else if (deviceAspect < designAspect) {
            cameraHeight = (designSize.width / deviceAspect) / 2;
            contentScale = designAspect / deviceAspect;
        }

        this.gameCamera.orthoHeight = cameraHeight;

        if (this.contentToZoom) {
            this.contentToZoom.setScale(v3(contentScale, contentScale, 1));
        }
    }
}