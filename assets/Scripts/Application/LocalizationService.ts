
import { _decorator, Component, Node } from 'cc';
import {GameManager} from "../Presentation/GameManager";
const { ccclass, property } = _decorator;
 
@ccclass('LocalizationService')
export class LocalizationService extends Component {
    private static _data: Record<string, string> = {};

    onLoad(){
        const datos = GameManager.Instance.labelText.json;
    }

    public static init(jsonContent: any) {
        this._data = jsonContent;
    }

    public static get(key: string): string {
        return this._data[key] || `[${key}]`;
    }
}