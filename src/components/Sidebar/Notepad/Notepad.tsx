import { useEffect, useState } from "react";
import "./notepadStyles.css"
import { TPlayerTrackings } from "../../../models/CharacterSheet";
import { Note } from "../../../models/Note";
import { textNotEmpty } from "../../../utilities/UtilityFunctions";

type NotepadProps = {
    updateSheetNotes: (udpatedNotes: Note[]) => void
    playerNotes: Note[]
}

export function Notepad({ updateSheetNotes, playerNotes }: NotepadProps) {

    enum TabsLookup { NOTES, CURRENT }
    const [currentTab, setCurrentTab] = useState(TabsLookup.NOTES);
    const [editMode, setEditMode] = useState(false)
    const [viewMode, setViewMode] = useState(false)
    const [currentNote, setCurrentNote] = useState<number | undefined>()
    const [notePendingChanges, setNotePendingChanges] = useState<Note | undefined>()
    const [isSaveValid, setIsSaveValid] = useState(true)

    useEffect(() => {
        if (textNotEmpty(notePendingChanges?.noteTitle)) {
            setIsSaveValid(true)
        } else {
            setIsSaveValid(false)
        }
    }, [notePendingChanges?.noteTitle])

    function addNewNote() {
        let updatedNotes = [...playerNotes]
        updatedNotes.push({ noteTitle: "New Note" })
        updateSheetNotes(updatedNotes)
    }

    function viewNote(idx: number) {
        setCurrentNote(idx)
        setViewMode(true)
        setCurrentTab(TabsLookup.CURRENT)
        setNotePendingChanges({ ...playerNotes[idx] });
    }

    function editNote(idx: number) {
        setCurrentNote(idx)
        setViewMode(true)
        setEditMode(true)
        setCurrentTab(TabsLookup.CURRENT)
        setNotePendingChanges({ ...playerNotes[idx] });
    }

    function exitEditMode() {
        setEditMode(false)
    }

    function saveEdits() {
        let updatedNotes = [...playerNotes]
        updatedNotes[currentNote!] = notePendingChanges!
        updateSheetNotes(updatedNotes)
        setViewMode(true)
        setEditMode(false)
    }

    function deleteNote(idx: number) {
        let updatedNotes = [...playerNotes]
        updatedNotes.splice(idx, 1)
        updateSheetNotes(updatedNotes)
    }

    function clearNotes() {
        updateSheetNotes([])
    }

    function returnToList() {
        setEditMode(false)
        setCurrentNote(undefined)
        setViewMode(false)
        setCurrentTab(TabsLookup.NOTES)
    }

    function handleNoteTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (notePendingChanges) {
            notePendingChanges.noteTitle = e.target.value;
            setNotePendingChanges({ ...notePendingChanges });
        }
    }

    function handleNoteContentChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (notePendingChanges) {
            notePendingChanges.noteContent = e.target.value;
            setNotePendingChanges({ ...notePendingChanges });
        }
    }
    //

    function handleCurrentTabClicked(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
    }

    function handleNoteTabClicked(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
        e.preventDefault();
        setViewMode(true)
        setEditMode(false)
        setCurrentTab(TabsLookup.NOTES)
    }

    return (
        <div className="notepad-container-wrapper">
            <div className="notepad-container-header">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a className={"nav-link reduced-nav-padding" + (currentTab === TabsLookup.NOTES ? " active" : "")} href="#" onClick={(e) => handleNoteTabClicked(e)}>Notes</a>
                    </li>
                    <li className="nav-item">
                        <a className={"nav-link reduced-nav-padding" + (currentTab === TabsLookup.CURRENT ? " active" : " disabled")} href="#" onClick={(e) => handleCurrentTabClicked(e)}>Pad</a>
                    </li>
                </ul>
            </div>
            <div className='notepad-container'>
                {currentTab === TabsLookup.NOTES
                    ? (
                        <>
                            <div className="notepad-item-list">
                                {playerNotes.map((x, idx) => (
                                    <div key={idx} className="notepad-item">
                                        <span className="notepad-item-listing" onClick={() => viewNote(idx)}>{x.noteTitle}</span>
                                        <div className="notepad-item-options">
                                            <i className="bi bi-pencil-fill edit-hover" onClick={() => editNote(idx)}></i>
                                            <i className="bi bi-trash-fill delete-hover" onClick={() => deleteNote(idx)}></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="notepad-controls">
                                <div className="notepad-controls-add-button-container">
                                    <button type='button' className="btn btn-theme flex-grow-1" onClick={addNewNote}>Add</button>
                                    <button type='button' className="btn btn-theme flex-grow-1" onClick={clearNotes}>Clear</button>
                                </div>
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className="notepad-text-area">
                                <div className="notepad-note-name">
                                    {editMode && currentNote !== undefined
                                        ? <input className="form-control reduced-textbox" type="text" placeholder="Title..." value={notePendingChanges?.noteTitle || ''} onChange={handleNoteTitleChange} />
                                        : <div className="notepad-note-title">{playerNotes[currentNote!].noteTitle}</div>}
                                </div>
                                {editMode && currentNote !== undefined
                                    ? <textarea className="form-control notepad" value={notePendingChanges?.noteContent || ''} onChange={handleNoteContentChange}></textarea>
                                    : <div className="notepad notepad-view">{playerNotes[currentNote!]?.noteContent ?? ""}</div>
                                }
                            </div>
                            <div className="notepad-controls">
                                {editMode && currentNote !== undefined
                                    ? <div className="notepad-controls-add-button-container">
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={saveEdits} disabled={!isSaveValid}>Save</button>
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={exitEditMode}>Cancel</button>
                                    </div>
                                    : <div className="notepad-controls-add-button-container">
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={() => editNote(currentNote!)}>Edit</button>
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={returnToList}>Return</button>
                                    </div>
                                }
                            </div>
                        </>
                    )
                }
            </div>
        </div>
    )
}