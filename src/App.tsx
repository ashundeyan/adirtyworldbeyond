import { useEffect, useState } from 'react'
import './App.css'
import { Divider } from './components/Section/Divider/Divider'
import { PlayerInfoSection } from './components/Section/PlayerInfoSection/PlayerInfoSection'
import { StatSection } from './components/Section/StatSection/StatSectionSection'
import { Sidebar } from './components/Sidebar/Sidebar'
import { BASE_POINT_POOL, ContentBgColorsLookup, IDENTITY_POINT_COST, IdentityIdLookup, QUALITY_POINT_COST, QualityIdLookup, SPECIALITY_POINT_COST, StatTypeLookup } from './constants/Constants'
import { generateStatBlocks } from './constants/StatBlock'
import { CharacterSheet, TPlayerInfo } from './models/CharacterSheet'
import { uninitCharacterSheet } from './constants/UninitializedCharacterSheet'
import { InventoryItem } from './models/InventoryItem'
import { Note } from './models/Note'
import React from 'react'
import { exportSheet } from './settings/exportCharacter'
import { FileContent } from 'use-file-picker/types'
import { digestSheet } from './settings/importCharacter'
import { TAvailablePoints } from './constants/Types'
import { Secret } from './models/Secret'
import { readSheetFromLocal, writeSheetToLocal } from './settings/sessionFunctions'
import { Specialty } from './models/Specialty'

function App() {

  const [characterSheet, setCharacterSheet] = useState<CharacterSheet>(uninitCharacterSheet())
  const [combatPotential, setCombatPotential] = useState(calculateCombatPotential())
  const [weaponBonus, setWeaponBonus] = useState(calculateWeaponBonus())
  const [areStatsStale, setAreStatsStale] = useState(false)


  window.addEventListener('beforeunload', function (e) {
    e.preventDefault();
    e.returnValue = '';
  });

  function saveSheetToLocal() {
    try {
      writeSheetToLocal(characterSheet)
      alert("Save successful!")
    } catch {
      alert("Failed to save.")
    }
  }

  function importSheetFromLocal() {
    try {
      const res = readSheetFromLocal()
      if (res.success) {
        setCharacterSheet(res.retrievedSheet!)
        forceStatRerender()
      } else {
        alert("Failed to read. You may have cleared your broswer data or failed to save.")
      }

    } catch (error) {
      console.error(error);
    }
  }

  function generateSecretAndSeverity() {
    const secret = characterSheet.playerTrackings.secret
    return `${secret.name} (${secret.severity})`
  }

  function generateSpecialtyList() {
    const specialties = characterSheet.playerTrackings.specialties;
    let list = ""

    if (specialties.length === 0) {
      return list
    }

    for (let i = 0; i < specialties.length; i++) {
      if (i === specialties.length - 1) {
        list += (specialties[i].name)
      } else {
        list += (specialties[i].name + ", ")
      }
    }

    return list
  }

  function generateBlocks() {
    return generateStatBlocks()
  }

  function calculateCombatPotential() {
    const vigor = characterSheet.playerStats.identities.find(x => x.id === IdentityIdLookup.VIGOR)?.value ?? 0
    const grace = characterSheet.playerStats.identities.find(x => x.id === IdentityIdLookup.GRACE)?.value ?? 0
    const courage = characterSheet.playerStats.qualities.find(x => x.id === QualityIdLookup.COURAGE)?.value ?? 0
    const wrath = characterSheet.playerStats.qualities.find(x => x.id === QualityIdLookup.WRATH)?.value ?? 0

    return vigor + grace + courage + wrath
  }

  function calculateWeaponBonus() {
    return characterSheet.playerTrackings.inventory.reduce((acc, x) => acc + (x?.widthModifier ?? 0), 0) ?? 0;
  }

  function calculateAvailablePoints(): TAvailablePoints {
    const pointPool = BASE_POINT_POOL + (characterSheet.playerTrackings.secret.severity ?? 0)

    const spentIdentity = (characterSheet.playerStats.identities.reduce((acc, x) => acc + (x.value), 0)) * IDENTITY_POINT_COST;
    const spentQuality = (characterSheet.playerStats.qualities.reduce((acc, x) => acc + (x.value), 0)) * QUALITY_POINT_COST;
    const spentSpecialties = (characterSheet.playerTrackings.specialties.length) * SPECIALITY_POINT_COST;

    let totalSpent = spentIdentity + spentQuality + spentSpecialties

    //you get a free vigor
    const vigor = characterSheet.playerStats.identities.find(x => x.id === IdentityIdLookup.VIGOR)?.value ?? 0
    if (vigor > 0) {
      totalSpent -= IDENTITY_POINT_COST
    }

    return { pointsSpent: totalSpent, pointPool: pointPool }
  }

  function getProfessionQualities() {
    return characterSheet.playerInfo.profession.affectedQualities
  }

  function mapStat(statType: number, statId: number) {
    switch (statType) {
      case StatTypeLookup.IDENTITY:
        return characterSheet.playerStats.identities.find(x => x.id === statId)?.value ?? 0
      case StatTypeLookup.QUALITY:
        return characterSheet.playerStats.qualities.find(x => x.id === statId)?.value ?? 0
      default:
        return 0
    }
  }

  function updateSheetStat(statType: StatTypeLookup, statId: number, updatedValue: number) {
    const sheet = { ...characterSheet }

    if (statType === StatTypeLookup.IDENTITY) {
      const idx = sheet.playerStats.identities.findIndex(x => x.id === statId)
      sheet.playerStats.identities[idx].value = updatedValue
    }
    else if (statType === StatTypeLookup.QUALITY) {
      const idx = sheet.playerStats.qualities.findIndex(x => x.id === statId)
      sheet.playerStats.qualities[idx].value = updatedValue
    }
    setCharacterSheet(sheet)
  }

  function updateSheetPlayerInfo(updatedInfo: TPlayerInfo) {
    const sheet = { ...characterSheet }
    sheet.playerInfo = updatedInfo
    setCharacterSheet(sheet)
  }

  function updateSheetPlayerNotes(updatedNotes: Note[]) {
    const sheet = { ...characterSheet }
    sheet.playerTrackings.notes = updatedNotes
    setCharacterSheet(sheet)
  }

  function updateSheetPlayerInven(updatedInven: InventoryItem[]) {
    const sheet = { ...characterSheet }
    sheet.playerTrackings.inventory = updatedInven
    setCharacterSheet(sheet)
  }

  function updateSheetPlayerSecret(updatedSecret: Secret) {
    const sheet = { ...characterSheet }
    sheet.playerTrackings.secret = updatedSecret
    setCharacterSheet(sheet)
  }

  function updateSheetPlayerSpecialties(updatedSpecialties: Specialty[]) {
    const sheet = { ...characterSheet }
    sheet.playerTrackings.specialties = updatedSpecialties
    setCharacterSheet(sheet)
  }

  function updateSheetPlayerWealth(updatedWealth: number) {
    const sheet = { ...characterSheet }
    sheet.playerTrackings.wealth = updatedWealth
    setCharacterSheet(sheet)
  }

  function exportCharacterSheet() {
    exportSheet(characterSheet)
  }

  function importCharacterSheet(fileContents: FileContent<string>) {
    try {
      const content = fileContents.content
      try {
        // Successfully parsed JSON
        const validatedSheet = digestSheet(content)
        if (validatedSheet === null) {
          alert("Failed to import. File may be corrupted or in an improper format.")
        } else {
          setCharacterSheet(validatedSheet)
          forceStatRerender()
        }

      } catch (error) {
        console.error("JSON parsing error:", error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function forceStatRerender() {
    setAreStatsStale(true)
  }

  function finishStatRerender() {
    setAreStatsStale(false)
  }

  useEffect(() => {
    setCombatPotential(calculateCombatPotential())
    setWeaponBonus(calculateWeaponBonus())
  }, [characterSheet])

  return (
    <div className="site-wrapper">
      <div className="main">
        <Sidebar
          playerTrackings={characterSheet.playerTrackings}
          updateSheetNotes={updateSheetPlayerNotes}
          updateSheetInven={updateSheetPlayerInven}
          updateSheetSecret={updateSheetPlayerSecret}
          updateSheetSpecialties={updateSheetPlayerSpecialties}
          exportCharacterSheet={exportCharacterSheet}
          importCharacterSheet={importCharacterSheet}
          saveSheetToLocal={saveSheetToLocal}
          importSheetFromLocal={importSheetFromLocal}
        />
        <div className="main-inner">
          <div className="main-inner-sheet">
            <PlayerInfoSection
              playerInfo={characterSheet.playerInfo}
              combatPotential={combatPotential}
              weaponBonus={weaponBonus}
              availablePoints={calculateAvailablePoints()}
              updatePlayerInfo={updateSheetPlayerInfo}
              specialtiesList={generateSpecialtyList()}
              secretAndSeverity={generateSecretAndSeverity()}
              playerWealth={characterSheet.playerTrackings.wealth}
              updatePlayerWealth={updateSheetPlayerWealth}
            />
            <Divider color={ContentBgColorsLookup.WHITE} />
            {
              generateBlocks().map((x, i, arr) => {
                if (arr.length !== i + 1) {
                  return (
                    <React.Fragment key={"f" + i}>
                      <StatSection
                        key={i}
                        mapFn={mapStat}
                        updateSheetStat={updateSheetStat}
                        finishStatRerender={finishStatRerender}
                        areStatsStale={areStatsStale}
                        professionQualities={getProfessionQualities()}
                        leftIdentity={x.statBlock.identityPair.leftIdentity}
                        rightIdentity={x.statBlock.identityPair.rightIdentity}
                        topQualityPair={x.statBlock.qualityGroup[0]}
                        bottomQualityPair={x.statBlock.qualityGroup[1]}
                      />
                      <Divider key={"dv" + i} color={ContentBgColorsLookup.WHITE} />
                    </React.Fragment>
                  )
                } else {
                  return (
                    <StatSection
                      key={"nodv" + i}
                      mapFn={mapStat}
                      updateSheetStat={updateSheetStat}
                      finishStatRerender={finishStatRerender}
                      areStatsStale={areStatsStale}
                      professionQualities={getProfessionQualities()}
                      leftIdentity={x.statBlock.identityPair.leftIdentity}
                      rightIdentity={x.statBlock.identityPair.rightIdentity}
                      topQualityPair={x.statBlock.qualityGroup[0]}
                      bottomQualityPair={x.statBlock.qualityGroup[1]}
                    />
                  )
                }
              })
            }
          </div>
        </div>
        <div className='empty-sidebar'></div>
      </div>
    </div >
  )
}

export default App
