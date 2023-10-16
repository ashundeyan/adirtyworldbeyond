import { CharacterSheet } from "../models/CharacterSheet"
import { InventoryItem } from "../models/InventoryItem"
import { Note } from "../models/Note"
import { Secret } from "../models/Secret"
import { Specialty } from "../models/Specialty"
import { IdentityIdLookup, PROFESSIONS, ProfessionLookup, QualityIdLookup } from "./Constants"

export function uninitCharacterSheet() {

    const uninitSheet: CharacterSheet = {
        playerInfo: {
            playerName: "",
            characterName: "",
            gameName: "",
            profession: PROFESSIONS[ProfessionLookup.ACADEMIC]
        },

        playerStats: {
            identities: [
                { id: IdentityIdLookup.PATIENCE, value: 0 },
                { id: IdentityIdLookup.CUNNING, value: 0 },
                { id: IdentityIdLookup.VIGOR, value: 0 },
                { id: IdentityIdLookup.GRACE, value: 0 },
                { id: IdentityIdLookup.UNDERSTANDING, value: 0 },
                { id: IdentityIdLookup.PERSUASION, value: 0 },
            ],

            qualities: [
                { id: QualityIdLookup.GENEROSITY, value: 0 },
                { id: QualityIdLookup.SELFISHNESS, value: 0 },
                { id: QualityIdLookup.DEMONSTRATION, value: 0 },
                { id: QualityIdLookup.OBSERVATION, value: 0 },
                { id: QualityIdLookup.COURAGE, value: 0 },
                { id: QualityIdLookup.WRATH, value: 0 },
                { id: QualityIdLookup.ENDURANCE, value: 0 },
                { id: QualityIdLookup.DEFIANCE, value: 0 },
                { id: QualityIdLookup.PURITY, value: 0 },
                { id: QualityIdLookup.CORRUPTION, value: 0 },
                { id: QualityIdLookup.HONESTY, value: 0 },
                { id: QualityIdLookup.DECEIT, value: 0 },
            ]
        },

        playerTrackings: {
            inventory: new Array<InventoryItem>(),
            notes: new Array<Note>(),
            secret: new Secret("Default Secret", 1, "", ""),
            specialties: new Array<Specialty>
        }
    }

    return uninitSheet;
}

export function testCharacterSheet() {
    const uninitSheet: CharacterSheet = {
        playerInfo: {
            playerName: "Bud Magellan",
            characterName: "Corpus Tankus",
            gameName: "Best Game Ever",
            profession: PROFESSIONS[ProfessionLookup.DETECTIVE],
        },

        playerStats: {
            identities: [
                { id: IdentityIdLookup.PATIENCE, value: 3 },
                { id: IdentityIdLookup.CUNNING, value: 2 },
                { id: IdentityIdLookup.VIGOR, value: 2 },
                { id: IdentityIdLookup.GRACE, value: 1 },
                { id: IdentityIdLookup.UNDERSTANDING, value: 2 },
                { id: IdentityIdLookup.PERSUASION, value: 2 },
            ],

            qualities: [
                { id: QualityIdLookup.GENEROSITY, value: 1 },
                { id: QualityIdLookup.SELFISHNESS, value: 2 },
                { id: QualityIdLookup.DEMONSTRATION, value: 2 },
                { id: QualityIdLookup.OBSERVATION, value: 2 },
                { id: QualityIdLookup.COURAGE, value: 1 },
                { id: QualityIdLookup.WRATH, value: 1 },
                { id: QualityIdLookup.ENDURANCE, value: 3 },
                { id: QualityIdLookup.DEFIANCE, value: 3 },
                { id: QualityIdLookup.PURITY, value: 1 },
                { id: QualityIdLookup.CORRUPTION, value: 1 },
                { id: QualityIdLookup.HONESTY, value: 2 },
                { id: QualityIdLookup.DECEIT, value: 1 },
            ]
        },

        playerTrackings: {
            inventory: [
                { itemName: "Popcorn", itemDescription: "A bag of popcorn" },
                { itemName: "M1911", itemDescription: "A 9mm handgun", widthModifier: 2 }
            ],
            notes: [
                { noteTitle: "Session 1 Notes", noteContent: "Great sesh" },
                { noteTitle: "Session 2 Notes", noteContent: "Greater sesh!" },
                { noteTitle: "Session 3 Notes" },
            ],
            secret: new Secret("Cursed", 3, "Tankus Corpus", "I'm cursed by the dice lords!"),
            specialties: [
                { name: "Opera Singing" },
                { name: "Crumping" }
            ]
        }
    }

    return uninitSheet;
}