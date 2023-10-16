import { useState } from "react"
import { ContentBgColorsLookup } from "../../constants/Constants"
import { TPlayerTrackings } from "../../models/CharacterSheet"
import { InventoryItem } from "../../models/InventoryItem"
import { Note } from "../../models/Note"
import { Divider } from "../Section/Divider/Divider"
import { Inventory } from "./Inventory/Inventory"
import { Notepad } from "./Notepad/Notepad"
import "./sidebarStyles.css"
import { useFilePicker } from 'use-file-picker'
import { FileContent } from 'use-file-picker/types'
import { SecretComponent } from "./Secret/Secret"
import { SpecialtiesComponent } from "./Specialties/Specialties"
import { Secret } from "../../models/Secret"
import { Specialty } from "../../models/Specialty"

type SidebarProps = {
    updateSheetNotes: (udpatedNotes: Note[]) => void
    updateSheetInven: (udpatedInven: InventoryItem[]) => void
    updateSheetSecret: (updatedSecret: Secret) => void
    updateSheetSpecialties: (updatedSpecialties: Specialty[]) => void
    playerTrackings: TPlayerTrackings
    exportCharacterSheet: () => void
    importCharacterSheet: (sheet: FileContent<string>) => void
    saveSheetToLocal: () => void
    importSheetFromLocal: () => void
}
export function Sidebar({ updateSheetNotes, updateSheetInven, updateSheetSpecialties, playerTrackings, exportCharacterSheet, importCharacterSheet, updateSheetSecret, saveSheetToLocal, importSheetFromLocal }: SidebarProps) {

    enum SidebarTabLookup { INVENTORY_NOTES = 1, SPECIALTIES_SECRET, SAVING }

    const [activeTab, setActiveTab] = useState(SidebarTabLookup.INVENTORY_NOTES)

    function changeTab(selelectedTab: number) {
        setActiveTab(selelectedTab)
    }

    const { openFilePicker } = useFilePicker({
        accept: '.json',
        multiple: false,
        onFilesSuccessfullySelected: ({
            filesContent
        }: {
            plainFiles: File[];
            filesContent: FileContent<string>[];
        }) => {
            console.log('success');
            importCharacterSheet(filesContent[0])
        },
        onFilesRejected: () => {
            console.log('failure')
        }
    })

    function importSheetSelected() {
        openFilePicker()
    }

    function saveToBrowser() {
        if (confirm("This will overwrite any existing sheet. Continue?") === true) {
            try {
                saveSheetToLocal()
            } catch {
            }
        } else {
            alert("Canceled.")
        }
    }

    function readFromBrowser() {
        if (confirm("This will overwrite your current unsaved edits. Continue?") === true) {
            try {
                importSheetFromLocal()
            } catch {
            }
        } else {
            alert("Canceled.")
        }
    }

    function tabSelector(tab: number) {
        switch (tab) {
            case SidebarTabLookup.INVENTORY_NOTES:
                return (
                    <>
                        <Inventory playerInven={playerTrackings.inventory} updateSheetInven={updateSheetInven}></Inventory>
                        <Notepad playerNotes={playerTrackings.notes} updateSheetNotes={updateSheetNotes}></Notepad>
                    </>
                )
            case SidebarTabLookup.SPECIALTIES_SECRET:
                return (
                    <>
                        <SecretComponent playerSecret={playerTrackings.secret} updateSheetSecret={updateSheetSecret} />
                        <SpecialtiesComponent playerSpecialties={playerTrackings.specialties} updateSheetSpecialties={updateSheetSpecialties} />
                    </>
                )
            case SidebarTabLookup.SAVING:
                return (
                    <>
                        <div className="import-export-container">
                            <div className="import-export-container-controls">
                                <div className="import-export-container-button-container">
                                    <button type='button' className="btn btn-sm btn-theme flex-grow-1" onClick={() => importSheetSelected()}>Import..</button>
                                    <button type='button' className="btn btn-sm btn-theme flex-grow-1" onClick={() => exportCharacterSheet()}>Export..</button>
                                </div>
                            </div>
                        </div>
                        <Divider color={ContentBgColorsLookup.OFFWHITE} />
                        <div className="import-export-container">
                            <div className="import-export-container-controls">
                                <div className="import-export-container-button-container">
                                    <button type='button' className="btn btn-sm btn-theme flex-grow-1" onClick={() => saveToBrowser()}>Save to Browser..</button>
                                    <button type='button' className="btn btn-sm btn-theme flex-grow-1" onClick={() => readFromBrowser()}>Read from Browser..</button>
                                </div>
                            </div>
                        </div>
                    </>
                )
            default:
                return <></>
        }
    }

    return (
        <div className="sidebar-container">
            <div className='sidebar'>
                {tabSelector(activeTab)}
            </div>
            <div className="sidebar-tab-button-container">
                <div onClick={() => changeTab(SidebarTabLookup.INVENTORY_NOTES)} className={"sidebar-tab-button" + (activeTab === SidebarTabLookup.INVENTORY_NOTES ? " sidebar-tab-button-active" : "")}>
                    <i className="bi bi-book"></i>
                </div>
                <div onClick={() => changeTab(SidebarTabLookup.SPECIALTIES_SECRET)} className={"sidebar-tab-button" + (activeTab === SidebarTabLookup.SPECIALTIES_SECRET ? " sidebar-tab-button-active" : "")}>
                    <i className="bi bi-lightbulb"></i>
                </div>
                <div onClick={() => changeTab(SidebarTabLookup.SAVING)} className={"sidebar-tab-button" + (activeTab === SidebarTabLookup.SAVING ? " sidebar-tab-button-active" : "")}>
                    <i className="bi bi-floppy"></i>
                </div>
            </div>
        </div>
    )
}