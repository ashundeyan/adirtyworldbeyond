import { useEffect, useState } from "react"
import { StatTypeLookup } from "../../../../constants/Constants"
import { TStatType } from "../../../../constants/StatBlock"
import "./qualityBlockStyles.css"
import { TQualityContinuum } from "../../../../models/Profession"

type QualityBlockProps = {
  mapFn: (statType: number, statId: number) => number
  leftQuality: TStatType | undefined
  rightQuality: TStatType | undefined
  updateSheetStat: (statType: StatTypeLookup, statId: number, updatedValue: number) => void
  finishStatRerender: () => void
  areStatsStale: boolean
  professionQualities: TQualityContinuum
}

export function QualityBlock({ mapFn, leftQuality, rightQuality, updateSheetStat, finishStatRerender, areStatsStale, professionQualities }: QualityBlockProps) {

  const [leftQualityTracking, setLeftQualityTracking] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [rightQualityTracking, setRightQualityTracking] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [trackLeftQualityDisabled, setTrackLeftQualityDisabled] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [trackRightQualityDisabled, setTrackRightQualityDisabled] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [overlapping, setOverlapping] = useState<boolean>(false)

  function isQualityProfessional(id: number) {
    const affected: number[] = []

    affected.push(professionQualities.first)
    affected.push(professionQualities.second)

    if (affected.includes(id)) {
      return true
    } else {
      return false
    }
  }

  function addsBriefcase(id: number) {
    if (isQualityProfessional(id)) {
      return <i className="bi bi-briefcase-fill"></i>
    } else {
      return ""
    }
  }

  useEffect(() => {
    if (areStatsStale) {
      recomputeStats()
      finishStatRerender()
    }
  }, [areStatsStale])

  function recomputeStats() {
    const left = new Array<boolean>(5).fill(false)
    const right = new Array<boolean>(5).fill(false)
    setLeftQualityTracking(Array.from(left).fill(true, 0, mapFn(StatTypeLookup.QUALITY, leftQuality?.id!)))
    setRightQualityTracking(Array.from(right).fill(true, 0, mapFn(StatTypeLookup.QUALITY, rightQuality?.id!)).reverse())
  }

  function hasOverlap(arr1: boolean[], arr2: boolean[]) {
    const arr1ToNumeric: number[] = arr1.map(x => x ? 1 : 0)
    const arr2ToNumeric: number[] = arr2.map(x => x ? 1 : 0)
    const offset = 2;

    const arr1Segment = arr1ToNumeric.slice(offset)
    const arr2Segment = arr2ToNumeric.slice(0, -offset)

    for (let i = 0; i < arr1.length; i++) {
      if (arr1Segment[i] === 1 && arr2Segment[i] === 1) {
        return true;
      }
    }
    return false;
  }

  function calculateDisabled(position: number) {
    //left
    if (position === 0) {
      if (leftQualityTracking.every(x => x)) {
        setTrackLeftQualityDisabled([true, true, true, true, false])
        return;
      }
      if (leftQualityTracking.every(x => !x)) {
        setTrackLeftQualityDisabled([false, true, true, true, true])
        return;
      }

      for (let i = 0; i < leftQualityTracking.length - 1; i++) {
        if (leftQualityTracking[i] === true && leftQualityTracking[i + 1] === false) {
          const skip1 = i
          const skip2 = i + 1
          const arr = new Array<boolean>(5).fill(true);
          arr[skip1] = false
          arr[skip2] = false
          setTrackLeftQualityDisabled(arr)
          return;
        }
      }
    } else {
      //right
      if (rightQualityTracking.every(x => x)) {
        setTrackRightQualityDisabled([false, true, true, true, true])
        return;
      }
      if (rightQualityTracking.every(x => !x)) {
        setTrackRightQualityDisabled([true, true, true, true, false])
        return;
      }
      for (let i = 0; i < rightQualityTracking.length - 1; i++) {
        if (rightQualityTracking[i] === false && rightQualityTracking[i + 1] === true) {
          const skip1 = i;
          const skip2 = i + 1
          const arr = new Array<boolean>(5).fill(true);
          arr[skip1] = false
          arr[skip2] = false
          setTrackRightQualityDisabled(arr)
          return;
        }
      }
    }

  }

  useEffect(() => {
    setLeftQualityTracking(Array.from(leftQualityTracking).fill(true, 0, mapFn(StatTypeLookup.QUALITY, leftQuality?.id!)))
    setRightQualityTracking(Array.from(rightQualityTracking).fill(true, 0, mapFn(StatTypeLookup.QUALITY, rightQuality?.id!)).reverse())
  }, [])

  useEffect(() => {
    setOverlapping(hasOverlap(leftQualityTracking, rightQualityTracking))
    calculateDisabled(0);
  }, [leftQualityTracking])

  useEffect(() => {
    setOverlapping(hasOverlap(leftQualityTracking, rightQualityTracking))
    calculateDisabled(1);
  }, [rightQualityTracking])

  function sendToStatSheet(position: number, arr: boolean[]) {
    if (position === 0) {
      const updatedValue = arr.slice().filter(x => x).length;
      updateSheetStat(StatTypeLookup.QUALITY, leftQuality?.id ?? -1, updatedValue)
    } else {
      const updatedValue = arr.slice().filter(x => x).length;
      updateSheetStat(StatTypeLookup.QUALITY, rightQuality?.id ?? -1, updatedValue)
    }
    return
  }

  function updateChecked(position: number, status: boolean) {
    if (position === 0) {
      if (status) {
        const incremented = leftQualityTracking.slice()
        const idx = incremented.findLastIndex(x => x === true)
        incremented[idx] = false
        setLeftQualityTracking(incremented)
        sendToStatSheet(0, incremented)
      } else {
        const incremented = leftQualityTracking.slice()
        const idx = incremented.findIndex(x => x === false)
        incremented[idx] = true
        setLeftQualityTracking(incremented)
        sendToStatSheet(0, incremented)
      }
    } else {
      if (status) {
        const incremented = rightQualityTracking.slice()
        const idx = incremented.findIndex(x => x === true)
        incremented[idx] = false
        setRightQualityTracking(incremented)
        sendToStatSheet(1, incremented)
      } else {
        const incremented = rightQualityTracking.slice()
        const idx = incremented.findLastIndex(x => x === false)
        incremented[idx] = true
        setRightQualityTracking(incremented)
        sendToStatSheet(1, incremented)
      }
    }
  }


  return (
    <div className={"quality-block-block" + (overlapping ? " quality-block-stats-overlapping" : "")}>
      <div className="quality-block-header">{leftQuality?.leftText} - <span className={isQualityProfessional(leftQuality?.id!) ? "quality-is-profession-affected" : ""}>{<b>{leftQuality?.name} {addsBriefcase(leftQuality?.id!)}</b>}</span> - {leftQuality?.rightText}</div>
      <div className="quality-block-stat-container">
        {
          leftQualityTracking.map((checked, idx) =>
            <div key={"li" + idx} className="form-check form-check-inline">
              <input className="form-check-input quality-block-button" type="checkbox" checked={checked} onChange={() => updateChecked(0, checked)} disabled={trackLeftQualityDisabled[idx]}></input>
            </div>)
        }
      </div>
      <div className="quality-block-stat-container quality-block-shifted">
        {rightQualityTracking.map((checked, idx) =>
          <div key={"ri" + idx} className="form-check form-check-inline">
            <input className="form-check-input quality-block-button" type="checkbox" checked={checked} onChange={() => updateChecked(1, checked)} disabled={trackRightQualityDisabled[idx]}></input>
          </div>)}
      </div>
      <div className="quality-block-header quality-block-shifted">{rightQuality?.rightText} - <span className={isQualityProfessional(rightQuality?.id!) ? "quality-is-profession-affected" : ""}>{<b>{rightQuality?.name} {addsBriefcase(rightQuality?.id!)}</b>}</span> - {rightQuality?.leftText}</div>
    </div >
  )
}