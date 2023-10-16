import { Profession } from "../models/Profession"

//UI Constants
export enum ContentBgColorsLookup { WHITE, OFFWHITE }

//Character Sheet Constants
export enum StatTypeLookup { IDENTITY, QUALITY }
export enum QualityIdLookup { GENEROSITY = 1, SELFISHNESS, DEMONSTRATION, OBSERVATION, COURAGE, WRATH, ENDURANCE, DEFIANCE, PURITY, CORRUPTION, HONESTY, DECEIT }
export enum IdentityIdLookup { PATIENCE = 1, CUNNING, VIGOR, GRACE, UNDERSTANDING, PERSUASION }
export enum PlayerInfoFieldLookup { PLAYERNAME = 1, CHARACTERNAME, GAMENAME, PROFESSION, SPECIALTY }
export enum ProfessionIdLookup { ACADEMIC = 1, DETECTIVE, DEFENDER, THUG, INGENUE, FEMME_FATALE }
export enum ProfessionLookup { ACADEMIC, DETECTIVE, DEFENDER, THUG, INGENUE, FEMME_FATALE }

//Calculation Constants
export const BASE_POINT_POOL = 40
export const IDENTITY_POINT_COST = 3
export const QUALITY_POINT_COST = 1
export const SPECIALITY_POINT_COST = 2
export const ADDITIONAL_PROFESSION_POINT_COST = 3

//Instantiated Constants
export const PROFESSIONS: Profession[] = [
    {
        id: ProfessionIdLookup.ACADEMIC,
        name: "Academic",
        affectedQualities: { first: QualityIdLookup.GENEROSITY, second: QualityIdLookup.DEMONSTRATION }
    },
    {
        id: ProfessionIdLookup.DETECTIVE,
        name: "Detective",
        affectedQualities: { first: QualityIdLookup.SELFISHNESS, second: QualityIdLookup.OBSERVATION }
    },
    {
        id: ProfessionIdLookup.DEFENDER,
        name: "Defender",
        affectedQualities: { first: QualityIdLookup.COURAGE, second: QualityIdLookup.ENDURANCE }
    },
    {
        id: ProfessionIdLookup.THUG,
        name: "Thug",
        affectedQualities: { first: QualityIdLookup.WRATH, second: QualityIdLookup.DEFIANCE }
    },
    {
        id: ProfessionIdLookup.INGENUE,
        name: "Ingenue",
        affectedQualities: { first: QualityIdLookup.PURITY, second: QualityIdLookup.HONESTY }
    },
    {
        id: ProfessionIdLookup.FEMME_FATALE,
        name: "Femme Fatale",
        affectedQualities: { first: QualityIdLookup.CORRUPTION, second: QualityIdLookup.DECEIT }
    },

]