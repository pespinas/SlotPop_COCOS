import { _decorator, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PresentConfig')
export class PresentConfig extends Component {

    @property({ group: { name: 'Reels Animation' }, tooltip: 'Punto más bajo donde desaparece el símbolo' })
    public bottomY: number = -436;

    @property({ group: { name: 'Reels Animation' }, tooltip: 'Punto más alto desde donde cae el símbolo' })
    public topY: number = 419;

    @property({ group: { name: 'Reels Animation' }, tooltip: 'Duración base de la caída en segundos' })
    public spinDuration: number = 1.0;

}