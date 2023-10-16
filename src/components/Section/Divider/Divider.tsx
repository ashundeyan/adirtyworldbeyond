import { ContentBgColorsLookup } from "../../../constants/Constants";
import "./dividerStyles.css"

type DividerProps = {
  color: number
}
export function Divider({ color }: DividerProps) {

  return (
    <>
      {color == ContentBgColorsLookup.WHITE ? (
        <hr className="line-break-white" />
      ) : (
        <hr className="line-break-offwhite" />
      )
      }
    </>
  )
}