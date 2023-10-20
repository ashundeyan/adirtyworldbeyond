import { useEffect, useState } from "react"
import { TPlayerInfo } from "../../../models/CharacterSheet"
import "./playerInfoSectionStyles.css"
import { TAvailablePoints } from "../../../constants/Types"
import { PROFESSIONS } from "../../../constants/Constants"

type PlayerInfoSectionProps = {
  playerInfo: TPlayerInfo
  combatPotential: number
  weaponBonus: number
  updatePlayerInfo: (updatedInfo: TPlayerInfo) => void
  availablePoints: TAvailablePoints
  specialtiesList: string
  secretAndSeverity: string
  playerWealth: number | undefined
  updatePlayerWealth: (updatedWealth: number) => void
}
export function PlayerInfoSection({ playerInfo, combatPotential, weaponBonus, updatePlayerInfo, availablePoints, specialtiesList, secretAndSeverity, playerWealth, updatePlayerWealth }: PlayerInfoSectionProps) {

  const [editMode, setEditMode] = useState<boolean>(false);
  const [currPlayerInfo, setCurrPlayerInfo] = useState<TPlayerInfo>(playerInfo);
  const [currWealth, setCurrWealth] = useState<number>(playerWealth ?? 0)

  useEffect(() => {
    if (playerInfo !== currPlayerInfo) {
      setCurrPlayerInfo(playerInfo);
      setCurrWealth(playerWealth ?? 0)
    }
  }, [playerInfo]);

  function toggleEditMode() {
    if (editMode) {
      sendUpdatedInfo();
    }
    setEditMode(!editMode)
  }

  function handlePlayerNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currInfo = { ...currPlayerInfo }
    currInfo.playerName = e.target.value
    setCurrPlayerInfo(currInfo)
  }

  function handleCharacterNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currInfo = { ...currPlayerInfo }
    currInfo.characterName = e.target.value
    setCurrPlayerInfo(currInfo)
  }

  function handleGameNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const currInfo = { ...currPlayerInfo }
    currInfo.gameName = e.target.value
    setCurrPlayerInfo(currInfo)
  }

  function handleProfessionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const currInfo = { ...currPlayerInfo }
    currInfo.profession = PROFESSIONS.find(x => x.id === parseInt(e.target.value))!
    setCurrPlayerInfo(currInfo)
  }

  function handlePlayerWealthChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrWealth(parseInt(e.target.value))
  }

  function sendUpdatedInfo() {
    const updatedInfo: TPlayerInfo = {
      playerName: currPlayerInfo.playerName,
      characterName: currPlayerInfo.characterName,
      gameName: currPlayerInfo.gameName,
      profession: currPlayerInfo.profession,
    }
    updatePlayerWealth(currWealth)
    updatePlayerInfo(updatedInfo)
  }

  return (
    <div className="player-info-section-wrapper">
      <div className="player-info-grid-container">
        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Player Name:</b>
          </div>
          <div className="player-info-editable-field">
            {editMode
              ? (
                <input className="form-control reduced-textbox" type="text" placeholder="Player Name..." value={currPlayerInfo.playerName} onChange={handlePlayerNameChange} />
              )
              : (playerInfo.playerName === undefined || playerInfo.playerName === "" ? "-" : playerInfo.playerName)}
          </div>
        </div>
        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Character Name:</b>
          </div>
          <div className="player-info-editable-field">
            {editMode
              ? (
                <input className="form-control reduced-textbox" type="text" placeholder="Character Name..." value={currPlayerInfo.characterName} onChange={handleCharacterNameChange} />
              )
              : (playerInfo.characterName === undefined || playerInfo.characterName === "" ? "-" : playerInfo.characterName)}
          </div>
        </div>
        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Current Combat Potential:</b>
          </div>
          <div>
            <span>
              {combatPotential === 0
                ? "0"
                : combatPotential}
              {weaponBonus === 0
                ? ""
                : (<span title="Width Modifier(s)">{"+(" + weaponBonus + ")"}</span>)}
            </span>
          </div>
        </div>

        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Total Available Points:</b>
          </div>
          <div>
            <span className={availablePoints.pointsSpent > availablePoints.pointPool ? "player-info-invalid" : ""}>
              {`${availablePoints.pointsSpent}/${availablePoints.pointPool}`}
            </span>
          </div>
        </div>

        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Wealth:</b>
          </div>
          <span className="wealth-label">
            {editMode
              ? (
                <input className="form-control reduced-numberbox" type="number" min={0} max={9999} placeholder="Wealth..." value={currWealth} onChange={handlePlayerWealthChange} />
              )
              : (playerWealth === undefined || playerWealth === 0 ? "0" : playerWealth.toLocaleString())}
          </span>
        </div>

      </div>
      <div className="player-info-grid-container">
        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Game:</b>
          </div>
          <div className="player-info-editable-field">
            {editMode
              ? (
                <input className="form-control reduced-textbox" type="text" placeholder="Game Name..." value={currPlayerInfo.gameName} onChange={handleGameNameChange} />
              )
              : (playerInfo.gameName === undefined || playerInfo.gameName === "" ? "-" : playerInfo.gameName)}
          </div>
        </div>
        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Profession:</b>
          </div>
          <div className="player-info-editable-field">
            {editMode
              ? (
                <>
                  <select
                    className="form-select reduced-textbox"
                    value={currPlayerInfo.profession.id}
                    onChange={handleProfessionChange}>
                    {PROFESSIONS.map((option, idx) => (
                      <option key={idx} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </>
              )
              : (playerInfo.profession.name)}
          </div>
        </div>
        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Specialty:</b>
          </div>
          <div>
            <span>
              {specialtiesList === "" ? "-" : specialtiesList}
            </span>
          </div>
        </div>

        <div className="player-info-grid-item">
          <div className="player-info-label">
            <b>Secret:</b>
          </div>
          <div>
            <span>
              {secretAndSeverity === "" ? "-" : secretAndSeverity}
            </span>
          </div>
        </div>

      </div>

      <div className="player-section-edit-tab" onClick={() => toggleEditMode()}>
        <i className={(editMode ? "bi bi-check-circle-fill" : "bi bi-pencil-fill") + " player-section-edit-hover"}></i>
      </div>
    </div>
  )
}