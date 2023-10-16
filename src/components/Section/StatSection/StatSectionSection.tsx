import { StatTypeLookup } from "../../../constants/Constants";
import { TStatType } from "../../../constants/StatBlock";
import { TQualityContinuum } from "../../../models/Profession";
import { IdentityBlock } from "./IdentityBlock/IdentityBlock"
import { QualityBlock } from "./QualityBlock/QualityBlock"
import "./statSectionStyles.css"

type StatSectionProps = {
  mapFn: (statType: number, statId: number) => number
  leftIdentity: TStatType | undefined
  rightIdentity: TStatType | undefined
  topQualityPair: { leftQuality: TStatType | undefined, rightQuality: TStatType | undefined }
  bottomQualityPair: { leftQuality: TStatType | undefined, rightQuality: TStatType | undefined }
  updateSheetStat: (statType: StatTypeLookup, statId: number, updatedValue: number) => void
  finishStatRerender: () => void
  areStatsStale: boolean
  professionQualities: TQualityContinuum
};

export function StatSection({ mapFn, leftIdentity, rightIdentity, topQualityPair, bottomQualityPair, updateSheetStat, finishStatRerender, areStatsStale, professionQualities }: StatSectionProps) {

  return (
    <div className="stat-section-wrapper">
      <QualityBlock
        mapFn={mapFn} updateSheetStat={updateSheetStat}
        professionQualities={professionQualities}
        leftQuality={topQualityPair.leftQuality} rightQuality={topQualityPair.rightQuality}
        finishStatRerender={finishStatRerender} areStatsStale={areStatsStale} />

      <IdentityBlock mapFn={mapFn} updateSheetStat={updateSheetStat}
        leftIdentity={leftIdentity} rightIdentity={rightIdentity}
        finishStatRerender={finishStatRerender} areStatsStale={areStatsStale} />

      <QualityBlock mapFn={mapFn} updateSheetStat={updateSheetStat}
        professionQualities={professionQualities}
        leftQuality={bottomQualityPair.leftQuality} rightQuality={bottomQualityPair.rightQuality}
        finishStatRerender={finishStatRerender} areStatsStale={areStatsStale} />
    </div>
  )
}