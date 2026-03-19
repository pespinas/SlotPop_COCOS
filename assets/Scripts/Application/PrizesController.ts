
import { _decorator, Component, Node} from 'cc';
import {EventManager} from "../Infrastructure/EventManager";
import {NameEvent} from "../Infrastructure/NameEvent";
const { ccclass, property } = _decorator;
 
@ccclass('PrizesController')
export class PrizesController extends Component {

        onLoad(){
        EventManager.on(NameEvent.CHECK_PRIZES,this.checkSymbols,this);
    }
    onDestroy(){
        EventManager.off(NameEvent.CHECK_PRIZES,this.checkSymbols,this);
    }

    private checkSymbols(symbols: string[][]){

        let winningCoords: {x: number, y: number}[][] = [];
        let winningSymbols: string[] = [];
        let visited: boolean[][] = [];
        for (let i = 0; i < symbols.length; i++) {
            visited[i] = [];
            for (let j = 0; j < symbols[i].length; j++) {
                visited[i][j] = false;
            }
        }

        for (let i = 0; i < symbols.length; i++) {
            for (let j = 0; j < symbols[i].length; j++) {
                if(!visited[i][j]){
                    const target = symbols[i][j];
                    const group = this.findGroup(symbols, visited, i, j, target);
                    if (group.length >= 3) {
                        winningCoords.push(group);
                        winningSymbols.push(target);
                        EventManager.emit(NameEvent.PRIZES_FOUND, winningCoords)
                    }
                }
            }
        }
    }
     private findGroup(symbols: string[][],visited:boolean[][],col:number, row:number,target: string): {x: number, y: number}[]{
        if (col < 0 || col >= symbols.length || row < 0 || row >= symbols[0].length) return [];
        if (visited[col][row] || symbols[col][row] !== target) return [];
        visited[col][row] = true;
        let group = [{ x: col, y: row }];

         group = group.concat(this.findGroup(symbols, visited, col + 1, row, target));
         group = group.concat(this.findGroup(symbols, visited, col - 1, row, target));
         group = group.concat(this.findGroup(symbols, visited, col, row + 1, target));
         group = group.concat(this.findGroup(symbols, visited, col, row - 1, target));

        return group;
     }

}
