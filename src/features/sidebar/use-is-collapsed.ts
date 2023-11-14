// 3rd party libraries
import { useMemo } from "react"
import { useLocation } from "react-router-dom"



/**
 * Returns true if the side menu is currently collapsed
 */
export const useIsCollapsed = () => {

  const location = useLocation()

  return useMemo(
    () => /^\/ejendomme\/[a-fA-F0-9]|^\/settings\//.test(location.pathname),
    // true if path is '/ejendomme/6385cad5c1f6372c1a22f317/overblik' or '/settings/...' (or similar)
    [location]
  )
}