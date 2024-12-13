import { ReactNode } from "react";


export default function MaxContainer({ children }: { children: ReactNode }) {
  return (
    <div className='max-w-7xl mx-auto px-4 flex flex-col justify-center items-center h-full'>
      {children}
    </div>
  )
}
