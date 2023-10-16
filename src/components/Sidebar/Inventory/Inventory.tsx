import { useEffect, useState } from "react"
import { InventoryItem } from "../../../models/InventoryItem"
import "./inventoryStyles.css"
import { textNotEmpty } from "../../../utilities/UtilityFunctions"

type InventoryProps = {
    updateSheetInven: (updatedInven: InventoryItem[]) => void
    playerInven: InventoryItem[]
}

export function Inventory({ updateSheetInven, playerInven }: InventoryProps) {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [viewMode, setViewMode] = useState<boolean>(false)
    const [currentItem, setCurrentItem] = useState<number | undefined>()
    const [itemPendingChanges, setItemPendingChanges] = useState<InventoryItem | undefined>()
    const [isSaveValid, setIsSaveValid] = useState(true)

    useEffect(() => {
        if (textNotEmpty(itemPendingChanges?.itemName)) {
            setIsSaveValid(true)
        } else {
            setIsSaveValid(false)
        }
    }, [itemPendingChanges?.itemName])

    function addNewItem() {
        let updatedInven = [...playerInven]
        updatedInven.push({ itemName: "New Item" })
        updateSheetInven(updatedInven)
    }

    function viewItem(idx: number) {
        setCurrentItem(idx)
        setViewMode(true)
        setItemPendingChanges({ ...playerInven[idx] });
    }

    function editItem(idx: number) {
        setCurrentItem(idx)
        setViewMode(true)
        setEditMode(true)
        setItemPendingChanges({ ...playerInven[idx] });
    }

    function exitEditMode() {
        setEditMode(false)
    }

    function saveEdits() {
        let updatedInven = [...playerInven]
        updatedInven[currentItem!] = itemPendingChanges!
        updateSheetInven(updatedInven)
        setViewMode(true)
        setEditMode(false)
    }

    function returnToList() {
        setEditMode(false)
        setCurrentItem(undefined)
    }

    function deleteItem(idx: number) {
        let updatedInven = [...playerInven]
        updatedInven.splice(idx, 1)
        updateSheetInven(updatedInven)
    }

    function clearInventory() {
        updateSheetInven([])
    }

    function handleItemNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (itemPendingChanges) {
            itemPendingChanges.itemName = e.target.value;
            setItemPendingChanges({ ...itemPendingChanges });
        }
    }

    function handleItemWidthModChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (itemPendingChanges) {
            itemPendingChanges.widthModifier = parseInt(e.target.value);
            setItemPendingChanges({ ...itemPendingChanges });
        }
    }

    function handleItemDescChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        if (itemPendingChanges) {
            itemPendingChanges.itemDescription = e.target.value;
            setItemPendingChanges({ ...itemPendingChanges });
        }
    }

    return (
        <div className="inventory-container-wrapper">
            <div className="inventory-container-header font-white">Inventory</div>
            <div className='inventory-container'>
                {viewMode && currentItem !== undefined
                    ? (
                        <>
                            <div className="inventory-item-list-view-edit">
                                <span className="inventory-view-edit-container-item view-edit-item-centered container-item-bottom-border">
                                    {editMode
                                        ? <input className="form-control reduced-textbox" type="text" placeholder="Item Name..." value={itemPendingChanges?.itemName || ''} onChange={(e) => handleItemNameChange(e)} />
                                        : <b>{playerInven[currentItem]?.itemName ?? "-"}</b>
                                    }
                                </span>
                                <span className="inventory-view-edit-container-item container-item-bottom-border">
                                    {editMode
                                        ?
                                        <input className="form-control reduced-textbox" type="number" min={0} max={3} placeholder="Width Mod..." value={itemPendingChanges?.widthModifier || 0} onChange={handleItemWidthModChange} />
                                        : "Width Mod: " + (playerInven[currentItem]?.widthModifier ?? "-")
                                    }
                                </span>
                                <span className="inventory-view-edit-container-item view-edit-item-centered container-item-bottom-border">
                                    <u>Description</u>
                                </span>
                                <div className="description-box">
                                    <span className="inventory-view-edit-container-item">
                                        {editMode
                                            ?
                                            <textarea className="form-control description-box-editable" value={itemPendingChanges?.itemDescription || ''} onChange={handleItemDescChange}></textarea>
                                            : playerInven[currentItem]?.itemDescription ?? ""
                                        }
                                    </span>
                                </div>
                            </div>
                            <div className="inventory-controls">
                                {editMode
                                    ? <div className="inventory-controls-add-button-container">
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={saveEdits} disabled={!isSaveValid}>Save</button>
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={exitEditMode}>Cancel</button>
                                    </div>
                                    : <div className="inventory-controls-add-button-container">
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={() => editItem(currentItem)}>Edit</button>
                                        <button type='button' className="btn btn-theme flex-grow-1" onClick={returnToList}>Return</button>
                                    </div>
                                }
                            </div>
                        </>
                    )
                    : (
                        <>
                            <div className="inventory-item-list">
                                {playerInven.map((x, idx) => (
                                    <div key={idx} className="inventory-item">
                                        <span className="inventory-item-listing" onClick={() => viewItem(idx)}>{
                                            (x?.widthModifier ?? 0 > 0
                                                ? <span className="has-width-mod has-width-mod-icon" title="Modifies Width">
                                                    {x.itemName}
                                                    <i className="bi bi-crosshair"></i>
                                                </span>
                                                : x.itemName)
                                        }</span>
                                        <div className="inventory-item-options">
                                            <i className="bi bi-pencil-fill edit-hover" onClick={() => editItem(idx)}></i>
                                            <i className="bi bi-trash-fill delete-hover" onClick={() => deleteItem(idx)}></i>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="inventory-controls">
                                <div className="inventory-controls-add-button-container">
                                    <button type='button' className="btn btn-theme flex-grow-1" onClick={addNewItem}>Add</button>
                                    <button type='button' className="btn btn-theme flex-grow-1" onClick={clearInventory}>Clear</button>
                                </div>
                            </div>
                        </>
                    )}
            </div>
        </div>
    )
}
