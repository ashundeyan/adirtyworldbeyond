import "./specialtiesStyles.css"

import { useEffect, useState } from "react"
import { textNotEmpty } from "../../../utilities/UtilityFunctions"
import { Specialty } from "../../../models/Specialty"

type SpecialtiesComponentProps = {
    updateSheetSpecialties: (updatedSpecialties: Specialty[]) => void
    playerSpecialties: Specialty[]
}

export function SpecialtiesComponent({ updateSheetSpecialties, playerSpecialties }: SpecialtiesComponentProps) {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [viewMode, setViewMode] = useState<boolean>(false)
    const [currentSpecialty, setCurrentSpecialty] = useState<number | undefined>()
    const [specialtyPendingChanges, setSpecialtyPendingChanges] = useState<Specialty | undefined>()
    const [isSaveValid, setIsSaveValid] = useState(true)
    const [canAdd, setCanAdd] = useState(true)

    //save disabled
    useEffect(() => {
        if (textNotEmpty(specialtyPendingChanges?.name)) {
            setIsSaveValid(true)
        } else {
            setIsSaveValid(false)
        }
    }, [specialtyPendingChanges?.name])

    //add disabled
    useEffect(() => {
        if (playerSpecialties.length === 3) {
            setCanAdd(false)
        } else {
            setCanAdd(true)
        }
    }, [playerSpecialties])

    function addNewSpecialty() {
        if (canAdd) {
            const updatedSpecialties = [...playerSpecialties]
            updatedSpecialties.push({ name: "New Specialty" })
            updateSheetSpecialties(updatedSpecialties)
        }
    }

    function viewSpecialty(idx: number) {
        setCurrentSpecialty(idx)
        setViewMode(true)
        setSpecialtyPendingChanges({ ...playerSpecialties[idx] });
    }

    function editSpecialty(idx: number) {
        setCurrentSpecialty(idx)
        setViewMode(true)
        setEditMode(true)
        setSpecialtyPendingChanges({ ...playerSpecialties[idx] });
    }

    function exitEditMode() {
        setEditMode(false)
    }

    function saveEdits() {
        const updatedSpecialties = [...playerSpecialties]
        updatedSpecialties[currentSpecialty!] = specialtyPendingChanges!
        updateSheetSpecialties(updatedSpecialties)
        setViewMode(true)
        setEditMode(false)
    }

    function returnToList() {
        setEditMode(false)
        setCurrentSpecialty(undefined)
    }

    function deleteSpecialty(idx: number) {
        const updatedSpecialties = [...playerSpecialties]
        updatedSpecialties.splice(idx, 1)
        updateSheetSpecialties(updatedSpecialties)
    }

    function clearSpecialties() {
        updateSheetSpecialties([])
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (specialtyPendingChanges) {
            specialtyPendingChanges.name = e.target.value;
            setSpecialtyPendingChanges({ ...specialtyPendingChanges });
        }
    }

    function handleDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (specialtyPendingChanges) {
            specialtyPendingChanges.description = e.target.value;
            setSpecialtyPendingChanges({ ...specialtyPendingChanges });
        }
    }

    return (
        <div className="specialties-container-wrapper">
            <div className="specialties-container-header font-white">{`Specialties (${playerSpecialties.length}/3)`}</div>
            <div className='specialties-container'>
                {viewMode && currentSpecialty !== undefined
                    ? (
                        <>
                            <div className="specialties-item-list-view-edit">
                                <span className="specialties-view-edit-container-item view-edit-item-centered container-item-bottom-border">
                                    {editMode
                                        ? <input className="form-control reduced-textbox" type="text" placeholder="Specialty Name..." value={specialtyPendingChanges?.name || ''} onChange={(e) => handleNameChange(e)} />
                                        : <b>{playerSpecialties[currentSpecialty].name}</b>
                                    }
                                </span>
                                <span className="specialties-view-edit-container-item view-edit-item-centered container-item-bottom-border">
                                    <u>Description</u>
                                </span>
                                <div className="description-box">
                                    <span className="specialties-view-edit-container-item">
                                        {editMode
                                            ?
                                            <textarea className="form-control description-box-editable" value={specialtyPendingChanges?.description || ''} onChange={handleDescChange}></textarea>
                                            : playerSpecialties[currentSpecialty]?.description ?? ""
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="specialties-controls">
                                {editMode
                                    ? <div className="specialties-controls-add-button-container">
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={saveEdits} disabled={!isSaveValid}>Save</button>
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={exitEditMode}>Cancel</button>
                                    </div>
                                    : <div className="specialties-controls-add-button-container">
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={() => editSpecialty(currentSpecialty)}>Edit</button>
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={returnToList}>Return</button>
                                    </div>
                                }
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className="specialties-item-list">
                                {playerSpecialties.map((x, idx) => (
                                    <div key={idx} className="specialties-item">
                                        <span className="specialties-item-listing" onClick={() => viewSpecialty(idx)}>{
                                            x.name
                                        }</span>
                                        <div className="specialties-item-options">
                                            <i className="bi bi-pencil-fill edit-hover" onClick={() => editSpecialty(idx)}></i>
                                            <i className="bi bi-trash-fill delete-hover" onClick={() => deleteSpecialty(idx)}></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="specialties-controls">
                                <div className="specialties-controls-add-button-container">
                                    <button type='button' className="btn btn-theme flex-grow-1" onClick={addNewSpecialty} disabled={!canAdd}>Add</button>
                                    <button type='button' className="btn btn-theme flex-grow-1" onClick={clearSpecialties}>Clear</button>
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </div>
    )
}
