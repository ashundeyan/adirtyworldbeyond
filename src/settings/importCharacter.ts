import { z } from "zod";
import { CharacterSheet } from "../models/CharacterSheet";

const ExportedSheetSchema = z.
    object({
        playerInfo: z.object(
            {
                playerName: z.string().default(""),
                characterName: z.string().default(""),
                gameName: z.string().default(""),
                profession: z.object({
                    id: z.number().min(1).max(6),
                    name: z.string(),
                    affectedQualities: z.object({
                        first: z.number(),
                        second: z.number()
                    })
                })
            }),
        playerStats: z.object({
            identities: z.array(
                z.object({
                    id: z.number(),
                    value: z.number().min(0).max(5)
                })),
            qualities: z.array(
                z.object({
                    id: z.number(),
                    value: z.number().min(0).max(5)
                }))
        }),
        playerTrackings: z.object({
            inventory: z.array(
                z.object({
                    itemName: z.string().default("New Item"),
                    itemDescription: z.optional(z.string()),
                    itemEffect: z.optional(z.string()),
                    widthModifier: z.optional(z.number().min(0).max(3))
                })
            ),
            notes: z.array(z.object({
                noteTitle: z.string(),
                noteContent: z.optional(z.string())
            })),
            secret: z.object({
                name: z.string(),
                severity: z.number().min(1).max(3),
                knownBy: z.optional(z.string()),
                description: z.optional(z.string())
            }),
            specialties: z.array(z.object({
                name: z.string(),
                description: z.optional(z.string())
            })),
            wealth: z.optional(z.number().default(0))
        })
    }).strict();

export function digestSheet(json: string): CharacterSheet | null {
    try {
        const sheetToCheck = JSON.parse(json)
        let receivedSheet: CharacterSheet;

        const verifiedSheet = ExportedSheetSchema.safeParse(sheetToCheck);

        if (verifiedSheet.success) {
            receivedSheet = verifiedSheet.data;
            return receivedSheet
        } else {
            return null;
        }

    } catch {
        return null
    }
}