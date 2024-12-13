import { PiGithubLogo } from "react-icons/pi";
import MaxContainer from "../Common/MaxContainer";

export default function OSS() {
  return (
    <section className='border-y border-y-gray-600 py-20'>
      <MaxContainer>
        <div className='w-full flex flex-col items-center justify-center space-y-8'>
          <div className='w-full flex flex-col items-center justify-center space-y-2 gap-2'>
            <h3 className='text-5xl font-bold'>Proudly open-source</h3>
            <p className='text-lg text-center'>Our source code is available on GitHub - feel free to read, review, or <br /> contribute to it however you want!</p>
          </div>
        </div>
        <a className="mt-4" href="https://github.com/raunakgurud09/realtime" target="_blank">
          <PiGithubLogo color="white" size={32} />
        </a>
      </MaxContainer>
    </section>
  )
}
