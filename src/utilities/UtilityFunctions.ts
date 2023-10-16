export function textNotEmpty(text: string | undefined) {
    if (text === undefined) {
        return false
    }
    if (text.trim().length === 0 || text.length === 0 || text === "") {
        return false
    } else {
        return true
    }
}