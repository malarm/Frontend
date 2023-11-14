// 3rd party libraries
import { useLocation } from "react-router-dom"



/**
 * Returns the current maintenance plan version id
 * 
 * Works by matching ``location.pathname`` against the following
 * pattern: "/vedligehold/:id"
 * 
 * @returns 
 */
export const useMaintenancePlanVersionId = () => {

  const location = useLocation()

  const match = location.pathname.match(/\/vedligehold\/([^/]+)/)

  if (match === null) return null

  return match[1]
}