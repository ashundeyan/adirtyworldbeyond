export type TQualityContinuum = {
    first: number,
    second: number,
}
export class Profession {
    id: number
    name: string
    affectedQualities: TQualityContinuum
    constructor(
        id: number,
        name: string,
        affectedQualities: TQualityContinuum
    ) {
        this.id = id,
            this.name = name,
            this.affectedQualities = affectedQualities
    }
}
