import { CharacterSheet } from "../models/CharacterSheet";

const isValidFilename = (fn: string) => {
    const regex = /^[0-9a-zA-Z ... ]+$/;
    return regex.test(fn);
};
export function exportSheet(sheet: CharacterSheet) {
    let name = prompt("Name your exported character sheet");

    if (name === null) {
        return
    }

    if (!isValidFilename(name)) {
        alert("Please try again.");
        return;
    }

    name += ".json";

    const exporting = JSON.stringify(sheet, null, "\t");
    const blob = new Blob([exporting], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = name;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
}