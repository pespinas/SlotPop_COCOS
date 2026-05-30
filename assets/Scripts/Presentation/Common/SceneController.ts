
import { _decorator, Component, director, UIOpacity, tween } from 'cc';
const { ccclass, property } = _decorator;
 
@ccclass('SceneController')
export class SceneController extends Component {

    @property(UIOpacity)
    public uiOpacity: UIOpacity | null = null;
    @property
    public fadeInTime: number = 1.5;
    @property
    public holdTime: number = 1.5;
    @property
    public fadeOutTime: number = 1.5;

    public startLoadingBonus(sceneName: string) {
        this.uiOpacity.opacity = 0;
        tween(this.uiOpacity)
            .to(this.fadeInTime, { opacity: 255 }, { easing: 'linear' })
            .delay(this.holdTime)
            .call(() => {
                director.loadScene(sceneName);
            })
            .to(this.fadeOutTime, { opacity: 0 }, { easing: 'linear' })
            .start();
    }
}
