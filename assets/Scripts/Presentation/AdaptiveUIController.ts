import { _decorator, Component, Node, view, v3, screen, view as ccView, Mask, Camera } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AdaptiveUIController')
export class AdaptiveUIController extends Component {

    @property(Camera)
    public gameCamera: Camera;

    @property
    public maxZoom: number = 1.5;

    @property
    public minZoom: number = 0.8;

    protected onLoad() {
        view.on('canvas-resize', this.adjustCamera, this);
        this.adjustCamera();
    }

    protected onDestroy() {
        view.off('canvas-resize', this.adjustCamera, this);
    }

    private adjustCamera() {
        if (!this.gameCamera) return;

        const windowSize = screen.windowSize;
        const viewportAspect = windowSize.width / windowSize.height;

        const designSize = ccView.getDesignResolutionSize();
        const designAspect = designSize.width / designSize.height;

        let orthoHeight = designSize.height / 2;

        if (viewportAspect > designAspect) {
            // Pantalla más ancha: ajustar altura ortho
            orthoHeight = (designSize.width / viewportAspect) / 2;
        }

        this.gameCamera.orthoHeight = orthoHeight;
    }
}