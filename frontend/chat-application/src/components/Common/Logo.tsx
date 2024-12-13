import { Hexagon } from "lucide-react";

export default function Logo() {
  return (
    <a href={'/'} className='h-6 text-lg text-white font-bold hover:cursor-pointer  flex flex-row item-center '>
      <h1 className="text-sm">Realtime</h1>
      <p className="relative right-[8px] bottom-[-8px] text-emerald-500 text-[8px]">beta</p>
    </a>
  )
}
