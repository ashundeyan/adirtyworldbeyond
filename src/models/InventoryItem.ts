export class InventoryItem {
    itemName: string;
    itemDescription?: string;
    itemEffect?: string;
    widthModifier?: number;
    constructor(
        itemName: string,
        itemDescription?: string,
        itemEffect?: string,
        widthModifier?: number
    ) {
        this.itemName = itemName,
            this.itemDescription = itemDescription,
            this.itemEffect = itemEffect,
            this.widthModifier = widthModifier
    }
}
