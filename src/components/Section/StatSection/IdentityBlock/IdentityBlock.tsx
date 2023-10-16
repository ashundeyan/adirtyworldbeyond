import { useEffect, useState } from "react"
import { StatTypeLookup } from "../../../../constants/Constants"
import { TStatType } from "../../../../constants/StatBlock"
import "./identityBlockStyles.css"

type IdentityBlockProps = {
  mapFn: (statType: number, statId: number) => number
  leftIdentity: TStatType | undefined
  rightIdentity: TStatType | undefined
  updateSheetStat: (statType: StatTypeLookup, statId: number, updatedValue: number) => void
  finishStatRerender: () => void
  areStatsStale: boolean
}

export function IdentityBlock({ mapFn, leftIdentity, rightIdentity, updateSheetStat, finishStatRerender, areStatsStale}: IdentityBlockProps) {

  const [leftIdentityTracking, setLeftIdentityTracking] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [rightIdentityTracking, setRightIdentityTracking] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [trackLeftIdentityDisabled, setTrackLeftIdentityDisabled] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [trackRightIdentityDisabled, setTrackRightIdentityDisabled] = useState<boolean[]>(new Array<boolean>(5).fill(false))
  const [overlapping, setOverlapping] = useState<boolean>(false)

  useEffect(() => {
    if (areStatsStale) {
      recomputeStats()
      finishStatRerender()
    }
  }, [areStatsStale])

  function recomputeStats() {
    const left = new Array<boolean>(5).fill(false)
    const right = new Array<boolean>(5).fill(false)
    setLeftIdentityTracking(Array.from(left).fill(true, 0, mapFn(StatTypeLookup.IDENTITY, leftIdentity?.id!)))
    setRightIdentityTracking(Array.from(right).fill(true, 0, mapFn(StatTypeLookup.IDENTITY, rightIdentity?.id!)).reverse())
  }

  function hasOverlap(arr1: boolean[], arr2: boolean[]) {
    let arr1ToNumeric: number[] = arr1.map(x => x ? 1 : 0)
    let arr2ToNumeric: number[] = arr2.map(x => x ? 1 : 0)
    let offset = 2;

    let arr1Segment = arr1ToNumeric.slice(offset)
    let arr2Segment = arr2ToNumeric.slice(0, -offset)

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
      if (leftIdentityTracking.every(x => x)) {
        setTrackLeftIdentityDisabled([true, true, true, true, false])
        return;
      }
      if (leftIdentityTracking.every(x => !x)) {
        setTrackLeftIdentityDisabled([false, true, true, true, true])
        return;
      }

      for (let i = 0; i < leftIdentityTracking.length - 1; i++) {
        if (leftIdentityTracking[i] === true && leftIdentityTracking[i + 1] === false) {
          let skip1 = i
          let skip2 = i + 1
          let arr = new Array<boolean>(5).fill(true);
          arr[skip1] = false
          arr[skip2] = false
          setTrackLeftIdentityDisabled(arr)
          return;
        }
      }
    } else {
      //right
      if (rightIdentityTracking.every(x => x)) {
        setTrackRightIdentityDisabled([false, true, true, true, true])
        return;
      }
      if (rightIdentityTracking.every(x => !x)) {
        setTrackRightIdentityDisabled([true, true, true, true, false])
        return;
      }
      for (let i = 0; i < rightIdentityTracking.length - 1; i++) {
        if (rightIdentityTracking[i] === false && rightIdentityTracking[i + 1] === true) {
          let skip1 = i;
          let skip2 = i + 1
          let arr = new Array<boolean>(5).fill(true);
          arr[skip1] = false
          arr[skip2] = false
          setTrackRightIdentityDisabled(arr)
          return;
        }
      }
    }

  }

  useEffect(() => {
    setLeftIdentityTracking(Array.from(leftIdentityTracking).fill(true, 0, mapFn(StatTypeLookup.IDENTITY, leftIdentity?.id!)))
    setRightIdentityTracking(Array.from(rightIdentityTracking).fill(true, 0, mapFn(StatTypeLookup.IDENTITY, rightIdentity?.id!)).reverse())
  }, [])

  useEffect(() => {
    setOverlapping(hasOverlap(leftIdentityTracking, rightIdentityTracking))
    calculateDisabled(0);
    calculateDisabled(1)
  }, [leftIdentityTracking, rightIdentityTracking])

  function sendToStatSheet(position: number, arr: boolean[]) {
    if (position === 0) {
      let updatedValue = arr.slice().filter(x => x).length;
      updateSheetStat(StatTypeLookup.IDENTITY, leftIdentity?.id ?? -1, updatedValue)
    } else {
      let updatedValue = arr.slice().filter(x => x).length;
      updateSheetStat(StatTypeLookup.IDENTITY, rightIdentity?.id ?? -1, updatedValue)
    }
    return
  }

  function updateChecked(position: number, status: boolean) {
    if (position === 0) {
      if (status) {
        let incremented = leftIdentityTracking.slice()
        let idx = incremented.findLastIndex(x => x === true)
        incremented[idx] = false
        setLeftIdentityTracking(incremented)
        sendToStatSheet(0, incremented)
      } else {
        let incremented = leftIdentityTracking.slice()
        let idx = incremented.findIndex(x => x === false)
        incremented[idx] = true
        setLeftIdentityTracking(incremented)
        sendToStatSheet(0, incremented)
      }
    } else {
      if (status) {
        let incremented = rightIdentityTracking.slice()
        let idx = incremented.findIndex(x => x === true)
        incremented[idx] = false
        setRightIdentityTracking(incremented)
        sendToStatSheet(1, incremented)
      } else {
        let incremented = rightIdentityTracking.slice()
        let idx = incremented.findLastIndex(x => x === false)
        incremented[idx] = true
        setRightIdentityTracking(incremented)
        sendToStatSheet(1, incremented)
      }
    }
  }


  return (
    <div className={"identity-block-block" + (overlapping ? " identity-block-stats-overlapping" : "")}>
      <div>
        <span className="deco-font overlined">
          <span className="underlined">{leftIdentity?.name}</span>
        </span>
      </div>
      <div className="identity-block-inner">
        <div className="identity-block-stat-container">
          {leftIdentityTracking.map((checked, idx) =>
            <div key={"l" + idx} className="form-check form-check-inline">
              <input className="form-check-input identity-block-button" type="checkbox" checked={checked} onChange={() => updateChecked(0, checked)} disabled={trackLeftIdentityDisabled[idx]}></input>
            </div>)}
        </div>
        <div className="identity-block-stat-container identity-block-shifted">
          {rightIdentityTracking.map((checked, idx) =>
            <div key={"r" + idx} className="form-check form-check-inline">
              <input className="form-check-input identity-block-button" type="checkbox" checked={checked} onChange={() => updateChecked(1, checked)} disabled={trackRightIdentityDisabled[idx]}></input>
            </div>)}
        </div>
      </div>
      <div>
        <span className="deco-font overlined">
          <span className="underlined">{rightIdentity?.name}</span>
        </span>
      </div>
    </div>
  )
}