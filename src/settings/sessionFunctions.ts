import { CharacterSheet } from "../models/CharacterSheet";
import { ApplicationSettings } from "./ApplicationSettings";
import { digestSheet } from "./importCharacter";

export type TSheetRetrieval = {
    retrievedSheet: CharacterSheet | null
    success: boolean
}
export function writeSheetToLocal(settings: CharacterSheet) {
    const sheet = JSON.stringify(settings, null, "\t");
    localStorage.setItem("adwb-character-sheet", sheet);
}

export function readSheetFromLocal(): TSheetRetrieval {

    const sheet = localStorage.getItem("adwb-character-sheet")
    if (sheet === null) {
        return { retrievedSheet: null, success: false }
    }

    const digestedSheet = digestSheet(sheet!)
    if (digestSheet === null) {
        return { retrievedSheet: null, success: false }
    }

    return { retrievedSheet: digestedSheet, success: true }
}

export function writeSettingsToLocal(settings: ApplicationSettings) {
    const saveSettings = JSON.stringify(settings, null, "\t");
    localStorage.setItem("adwb-save-settings", saveSettings);
}

export function readSettingsFromLocal() {
    localStorage.getItem("adwb-save-settings");
}