export class Secret {
    name: string
    severity: number
    knownBy?: string
    description?: string
    constructor(
        name: string,
        severity: number,
        knownBy?: string,
        description?: string
    ) {
        this.name = name
        this.severity = severity
        this.knownBy = knownBy
        this.description = description
    }
}
