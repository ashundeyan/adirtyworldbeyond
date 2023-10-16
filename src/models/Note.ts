export class Note {
    noteTitle: string;
    noteContent?: string;
    constructor(
        noteTitle: string,
        noteContent?: string
    ) {
        this.noteTitle = noteTitle,
        this.noteContent = noteContent
    }
}
