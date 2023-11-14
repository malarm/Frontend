// Workspace libraries
import { ReactComponent as Logo } from "@thor-frontend/assets/svg/logo/upsite_logo_black_rgb.svg";



export const Watermark = () => <div className="pointer-events-none absolute overflow-hidden w-full h-full inset-0 grid place-content-center gap-5 grid-flow-row opacity-5 z-[1]">
  {/* <IconsUpsite className='w-80 h-80' /> */}
  {/* <p className="text-8xl rotate-45">Upsi±e</p> */}
  <Logo width="1500" style={{ transform: 'rotate(302deg)' }} />


</div>