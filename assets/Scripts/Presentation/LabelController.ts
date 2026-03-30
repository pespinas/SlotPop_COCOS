
import { _decorator, Component, Node,Label } from 'cc';
import {LocalizationService} from "../Application/LocalizationService";
const { ccclass, property } = _decorator;
 
@ccclass('LabelController')
export class LabelController extends Component {
    @property(Label)
    public label: Label;

    idleText(){
        this.label.string = LocalizationService.get('LBL_IDLE');
    }

}