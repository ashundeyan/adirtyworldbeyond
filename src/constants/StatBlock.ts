export type TStatType = { id: number, name: string, rightText?: string, leftText?: string }
export type TQualityPair = { leftQuality: number, rightQuality: number }
export type TIdentityPair = { leftIdentity: number, rightIdentity: number }
export type TStatPair = { identityPair: TIdentityPair, qualityGroup: TQualityPair[] }

export const generateStatBlocks = () => {

    const qualities: TStatType[] = [
        { id: 1, name: 'generosity', leftText: "status and resources", rightText: "payoffs and bribes" },
        { id: 2, name: 'selfishness', leftText: "forgery, graft, embezzlement", rightText: "steals cars, pick locks" },
        { id: 3, name: 'demonstration', leftText: "education and knowledge", rightText: "quick fixes, jury rigging" },
        { id: 4, name: 'observation', leftText: "reconstruct a crime scene", rightText: "spot an ambush" },

        { id: 5, name: 'courage', leftText: "fair fight, fists", rightText: "fair fight, guns" },
        { id: 6, name: 'wrath', leftText: "beat on the inferior", rightText: "shoot the unarmed" },
        { id: 7, name: 'endurance', leftText: "marathon run, hold a pin", rightText: "car chase, balancing" },
        { id: 8, name: 'defiance', leftText: "smash obstacles", rightText: "avoid or escape" },

        { id: 9, name: 'purity', leftText: "see someone’s best side", rightText: "persuade through decency" },
        { id: 10, name: 'corruption', leftText: "comprehend devious motives", rightText: "persuade with sin" },
        { id: 11, name: 'honesty', leftText: "find flaws in true statements", rightText: "tell the truth convincingly" },
        { id: 12, name: 'deceit', leftText: "see through lies", rightText: "tell lies" }
    ]

    const identities: TStatType[] = [
        { id: 1, name: 'patience' },
        { id: 2, name: 'cunning' },

        { id: 3, name: 'vigor' },
        { id: 4, name: 'grace' },

        { id: 5, name: 'understanding' },
        { id: 6, name: 'persuasion' },
    ]

    const statPairings: TStatPair[] = [
        { identityPair: { leftIdentity: 1, rightIdentity: 2 }, qualityGroup: [{ leftQuality: 1, rightQuality: 2 }, { leftQuality: 3, rightQuality: 4 }] },
        { identityPair: { leftIdentity: 3, rightIdentity: 4 }, qualityGroup: [{ leftQuality: 5, rightQuality: 6 }, { leftQuality: 7, rightQuality: 8 }] },
        { identityPair: { leftIdentity: 5, rightIdentity: 6 }, qualityGroup: [{ leftQuality: 9, rightQuality: 10 }, { leftQuality: 11, rightQuality: 12 }] },
    ]

    const identityResolver = (identityPair: TIdentityPair) => {
        const leftIdentity = identities.find(x => x.id === identityPair.leftIdentity)
        const rightIdentity = identities.find(x => x.id === identityPair.rightIdentity)
        return { leftIdentity: leftIdentity, rightIdentity: rightIdentity }
    }

    const qualityResolver = (qualityGroup: TQualityPair[]) => {
        const resolvedQualityGroups = []
        for (let i = 0; i < qualityGroup.length; i++) {
            const leftQuality = qualities.find(x => x.id === qualityGroup[i].leftQuality)
            const rightQuality = qualities.find(x => x.id === qualityGroup[i].rightQuality)
            resolvedQualityGroups.push(
                { leftQuality: leftQuality, rightQuality: rightQuality }
            )
        }
        return resolvedQualityGroups;
    }

    const statBlocks = statPairings.map((x) => {
        return {
            statBlock: {
                identityPair:
                    identityResolver(x.identityPair),
                qualityGroup:
                    qualityResolver(x.qualityGroup)
            }
        }
    })

    return statBlocks;
}