export enum TileType {
    FLOOR = 1,
    SCAR_GROUND = 2,
    SCAR_ROCK = 3,
    LV2_ROCK = 4,
    NOTHING = 5,
    GROUND = 6,
    LV1_ROCK = 7,
    LV3_ROCK = 8,
}
export enum Hardness {
    FLOOR = 1,
    SCAR_GROUND = 2,
    SCAR_ROCK = 4,
    LV2_ROCK = 6,
    NOTHING = 0,
    GROUND = 3,
    LV1_ROCK = 5,
    LV3_ROCK = 7,
}

export interface GemStructure {
    id: string;
    tiles: number[];
    prize: number;
}

export const GEMS: Record<string, GemStructure> = {
    GREEN: {
        id: "GREEN_GEM",
        tiles: [9, 10, 15, 16],
        prize: 100
    },
    RED: {
        id: "RED_GEM",
        tiles: [11, 12, 17, 18],
        prize: 200
    },
    BLUE: {
        id: "BLUE_GEM",
        tiles: [13, 14, 19, 20],
        prize: 500
    }
};