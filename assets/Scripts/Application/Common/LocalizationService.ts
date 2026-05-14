
export class LocalizationService {
    private static _data: Record<string, string> = {};


    public static init(jsonContent: any) {
        this._data = jsonContent;
    }

    public static getUIGame(key: string): string {
        return this._data["UI_GAME"][key];
    }
    public static getUIBonus(key: string): string {
        return this._data["UI_BONUS"][key];
    }
}