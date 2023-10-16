declare global {
    interface Array<T> {
        findLastIndex(predicate: (value: T, index: number, obj: T[]) => boolean): number;
    }
}


Array.prototype.findLastIndex = function <T>(
    predicate: (value: T, index: number, obj: T[]) => boolean
): number {
    let l = this.length;
    while (l--) {
        if (predicate(this[l], l, this)) {
            return l;
        }
    }
    return -1;
}

export { }