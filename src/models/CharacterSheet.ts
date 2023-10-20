import { Identity } from "./Identity";
import { InventoryItem } from "./InventoryItem";
import { Note } from "./Note";
import { Profession } from "./Profession";
import { Quality } from "./Quality";
import { Secret } from "./Secret";
import { Specialty } from "./Specialty";

export type TPlayerInfo = {
    playerName: string | undefined;
    characterName: string | undefined;
    gameName: string | undefined;
    profession: Profession
}

export type TPlayerStats = {
    identities: Identity[];
    qualities: Quality[];
}

export type TPlayerTrackings = {
    inventory: InventoryItem[];
    notes: Note[];
    secret: Secret;
    specialties: Specialty[]
    wealth?: number | undefined
}

export class CharacterSheet {
    playerInfo: TPlayerInfo;
    playerStats: TPlayerStats;
    playerTrackings: TPlayerTrackings;

    constructor(
        playerInfo: {
            playerName: string | undefined,
            characterName: string | undefined,
            gameName: string | undefined,
            profession: Profession
            specialties: string | undefined,
        },

        playerStats: {
            identities: Identity[],
            qualities: Quality[],
        },

        playerTrackings: {
            inventory: InventoryItem[],
            notes: Note[]
            secret: Secret
            specialties: Specialty[]
            wealth?: number | undefined
        }
    ) {
        this.playerInfo = playerInfo;
        this.playerStats = playerStats;
        this.playerTrackings = playerTrackings
    }
}