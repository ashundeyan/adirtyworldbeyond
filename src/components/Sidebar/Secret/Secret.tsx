import { useEffect, useState } from "react"
import "./secretStyles.css"
import { Secret } from "../../../models/Secret"
import { textNotEmpty } from "../../../utilities/UtilityFunctions"

type TSecretComponentProps = {
    playerSecret: Secret
    updateSheetSecret: (updatedSecret: Secret) => void
}
export function SecretComponent({ playerSecret, updateSheetSecret }: TSecretComponentProps) {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [secretPendingChanges, setSecretPendingChanges] = useState<Secret | undefined>()
    const [isSaveValid, setIsSaveValid] = useState(true)

    useEffect(() => {
        if (textNotEmpty(secretPendingChanges?.name)) {
            setIsSaveValid(true)
        } else {
            setIsSaveValid(false)
        }
    }, [secretPendingChanges?.name])

    function handleSecretNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (secretPendingChanges) {
            secretPendingChanges.name = e.target.value;
            setSecretPendingChanges({ ...secretPendingChanges });
        }
    }

    function handleSecretSeverityChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (secretPendingChanges) {
            secretPendingChanges.severity = parseInt(e.target.value);
            setSecretPendingChanges({ ...secretPendingChanges });
        }
    }

    function handleSecretKnownByChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (secretPendingChanges) {
            secretPendingChanges.knownBy = e.target.value;
            setSecretPendingChanges({ ...secretPendingChanges });
        }
    }

    function handleSecretDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (secretPendingChanges) {
            secretPendingChanges.description = e.target.value;
            setSecretPendingChanges({ ...secretPendingChanges });
        }
    }

    function editSecret() {
        setEditMode(true)
        setSecretPendingChanges({ ...playerSecret });
    }

    function exitEditMode() {
        setEditMode(false)
        setSecretPendingChanges(undefined)
    }

    function saveEdits() {
        let updatedSecret = { ...playerSecret }
        updatedSecret = secretPendingChanges!
        updateSheetSecret(updatedSecret)
        setEditMode(false)
    }

    return (
        <div className="secret-container-wrapper">
            <div className="secret-container-header font-white">Secret</div>
            <div className='secret-container'>
                <>
                    <div className="secret-item-list-view-edit">
                        <span className="secret-view-edit-container-item view-edit-item-centered container-item-bottom-border">
                            {editMode
                                ? <input className="form-control reduced-textbox" type="text" placeholder="Secret..." value={secretPendingChanges?.name || ''} onChange={(e) => handleSecretNameChange(e)} />
                                : <b>{playerSecret.name}</b>
                            }
                        </span>
                        <span className="secret-view-edit-container-item container-item-bottom-border">
                            {editMode
                                ?
                                <input className="form-control reduced-textbox" type="number" min={1} max={3} placeholder="Severity..." value={secretPendingChanges?.severity || 0} onChange={handleSecretSeverityChange} />
                                : "Severity: " + (playerSecret?.severity ?? "-")
                            }
                        </span>
                        <span className="secret-view-edit-container-item container-item-bottom-border">
                            {editMode
                                ? <input className="form-control reduced-textbox" type="text" placeholder="Known by..." value={secretPendingChanges?.knownBy || ''} onChange={(e) => handleSecretKnownByChange(e)} />
                                : "Known by: " + (playerSecret?.knownBy ?? "-")
                            }
                        </span>
                        <span className="secret-view-edit-container-item view-edit-item-centered container-item-bottom-border">
                            <u>Description</u>
                        </span>
                        <div className="description-box">
                            <span className="secret-view-edit-container-item">
                                {editMode
                                    ?
                                    <textarea className="form-control description-box-editable" value={secretPendingChanges?.description || ''} onChange={handleSecretDescChange}></textarea>
                                    : playerSecret?.description ?? ""
                                }
                            </span>
                        </div>
                    </div>
                    <div className="secret-controls">
                        {editMode
                            ? <div className="secret-controls-add-button-container">
                                <button type='button' className="btn btn-theme flex-grow-1" onClick={saveEdits} disabled={!isSaveValid}>Save</button>
                                <button type='button' className="btn btn-theme flex-grow-1" onClick={exitEditMode}>Cancel</button>
                            </div>
                            : <div className="secret-controls-add-button-container">
                                <button type='button' className="btn btn-theme flex-grow-1" onClick={editSecret}>Edit</button>
                            </div>
                        }
                    </div>
                </>
            </div>
        </div>
    )
}