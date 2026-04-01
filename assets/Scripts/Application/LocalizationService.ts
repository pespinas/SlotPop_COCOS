
export class LocalizationService {
    private static _data: Record<string, string> = {};


    public static init(jsonContent: any) {
        this._data = jsonContent;
    }

    public static getIU(key: string): string {
        return this._data["UI_GAME"][key];
    }
}