// 3rd party libraries
import React from 'react'

// Workspace libraries
import { formatDate } from '@project/shared/common/utils/format-date.util'
import { MaintenancePlanPublisherJSON } from '@project/shared/feature-maintenance-plan-versions/types/maintenance-plan-publisher.type'
import { MEDocumentJSON } from '@project/shared/feature-me-document/interfaces/me-document.interface'
import { ThorImage } from '@thor-frontend/common/thor-image/thor-image'
import { getDocumentUrl } from '@thor-frontend/common/utils'
import { environment } from '@thor-frontend/environments/environment'
import { StaticMap } from '@thor-frontend/common/static-map/static-map'



export type IFrontPageProps = {
  unionName: string
  addressString?: string
  publishedAt?: string
  publisher: {
    name: string
    username: string
  }
  image?: MEDocumentJSON
  logo?: MEDocumentJSON
  organizationName: string
}


/**
 * Component description
 */
export const FrontPage: React.FC<IFrontPageProps> = (props) => {

  const publishedAt = formatDate(
    props.publishedAt ? new Date(props.publishedAt) : new Date(),
    'DD.MM.YYYY'
  )

  const { mapsApiKey } = environment

  const addressUsed = props.addressString ?? props.unionName

  const mapSrc = `https://maps.googleapis.com/maps/api/staticmap?center=${addressUsed}&zoom=17&size=455x265&maptype=roadmap&key=${mapsApiKey}&markers=${addressUsed}&style=feature:poi|visibility:off&style=feature:administrative|visibility:off&style=feature:transit|visibility:off&scale=2`

  return <div className="a4 grid pdf-full-page pdf-page-padding" style={{ gridTemplateRows: '1fr 210mm' }}>

    {/* header */}
    <div className="grid pb-7 content-end justify-start">
      <h2 className="text-5xl mb-2">Vedligeholdelsesplan</h2>
      <h1 className="text-5xl text-green">{props.unionName}</h1>
    </div>

    {/* stylish grid */}
    <div className="grid grid-flow-row auto-rows-fr">

      <div className="grid border-t border-black w-full grid-cols-3 auto-cols-fr">
        <div className="col-span-2 border-r border-black"></div>
      </div>
      <div className="grid border-t border-black w-full grid-cols-3 auto-cols-fr">
        <div className="col-span-1 border-r border-black"></div>
        <div className="relative col-span-2">

          <img alt="Kort" src={mapSrc}
            className="object-cover absolute inset-0"
            style={{ filter: 'grayscale(1) brightness(1.00)' }}
          />
        </div>
      </div>
      <div className="grid border-t border-black w-full grid-cols-3 auto-cols-fr z-[1]">
        {/* publisher */}
        <div className="col-span-2 border-r border-black pt-7 grid grid-flow-row content-between">

          <p className="text-5xl text-black">{publishedAt}</p>

          <div className="flex flex-col">
            <p className="text-sm">af {props.publisher.name}</p>
            <p className="text-sm">{props.publisher.username}</p>
          </div>

          {/* {props.publisher.} */}
        </div>

        {/* logo */}
        <div className="grid justify-end content-end relative pt-7">
          {props.logo
            ? <ThorImage
              src={getDocumentUrl(props.logo)}
              dimensions="480w"
              className='absolute inset-0'
              imgClassName='object-cover'
              bgClassName='bg-transparent'
              sizeClassName='w-full h-full max-w-[120px]'
            />
            : ''}
        </div>

      </div>

    </div>
  </div>
}