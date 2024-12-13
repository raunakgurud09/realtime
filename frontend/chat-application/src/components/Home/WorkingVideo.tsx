import MaxContainer from "../Common/MaxContainer";

export default function WorkingVideo() {
  return (
    <MaxContainer>
      <div className='w-full flex flex-col pt-4 mt-20 items-center justify-center'>
        <div className='w-full flex flex-col items-center justify-center'>
          <h3 className='text-5xl w-[60%] text-center'>Working demo</h3>
        </div>
        <div className='w-[80%] border border-b-[0px] rounded-t-md h-[500px] mt-10'>
          <div
            style={{ position: "relative", paddingBottom: "50%", height: "0" }}
          >
            {/* <iframe
              src="https://www.loom.com/embed/925f3d36c16c4bf4aec7228c93c45e09?sid=6becf672-2fc6-4285-b940-fcccd41289b3"
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
              style={{ position: "absolute", top: "0", left: '0', width: "100%", height: "100%" }}
            >
            </iframe> */}
          </div>
        </div>
      </div>
    </MaxContainer>
  )
}
