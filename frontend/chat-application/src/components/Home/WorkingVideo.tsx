// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import MaxContainer from "../Common/MaxContainer";

export default function WorkingVideo() {
  return (
    <MaxContainer>
      <div className="w-full flex flex-col pt-4 mt-20 mb-20 items-center justify-center">
        <div className="w-full flex flex-col items-center justify-center">
          <h3 className="text-5xl w-[60%] text-center">Working demo</h3>
        </div>
        <div className="w-[80%] border  rounded-md h-[600px] mt-10">
          <div
            style={{
              position: "relative",
              paddingBottom: "50%",
              height: "100%",
            }}
          >
            <iframe
              src="https://www.loom.com/embed/670c2a7c6ca045d5a40b080903d44132?sid=049eec38-9a81-4a43-8794-6f4c8b6b41d3"
              frameborder="0"
              webkitallowfullscreen
              mozallowfullscreen
              allowfullscreen
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                borderRadius: "8px",
              }}
            ></iframe>
          </div>
        </div>
      </div>
    </MaxContainer>
  );
}
