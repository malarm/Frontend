// 3rd party libraries
import { useLocation } from "react-router-dom"



export const useRealEstateId = () => {

  const location = useLocation()

  const match = location.pathname.match(/ejendomme\/([^/]+)/)

  if (match == null) return null

  return match[1]
}