import ReactPlayer from "react-player";
import cx from "classnames";
import AudioAnalyzer from "../Audio/AudioAnalyzer";

export const VideoPlayerBig = ({
  stream,
  email,
}: {
  stream: MediaStream | null;
  email?: string;
}) => {
  return (
    <div className="absolute right-0 bottom-20 p-4">
      {stream && (
        <div className="bg-pink-00 w-[442px] h-[247px] relative rounded-md p-1">
          <h1 className="absolute bottom-1 right-1 bg-blue-600 rounded-tl-md  py-1 px-2 text-white">
            me - {email}
          </h1>
          <ReactPlayer
            playing
            muted
            height="240px"
            width="440px"
            url={stream}
          />
        </div>
      )}
    </div>
  );
};
export const VideoPlayer = ({
  stream,
  email,
  xl = false,
  remote = false,
}: {
  stream: MediaStream | null;
  email?: string;
  xl?: boolean;
  remote?: boolean;
}) => {
  return (
    <div className={cx("absolute bottom-20 p-4", xl ? "left-0" : "right-0")}>
      {stream && (
        <div
          className={cx(
            "bg-pink-00 border relative rounded-md p-1",
            xl ? "w-[1005px] h-[567px]" : "w-[426px] h-[247px]"
          )}
        >
          <h1
            className={cx(
              "absolute bottom-1 right-1 bg-blue-600 rounded-tl-md  py-1 px-2 text-white",
              xl ? "" : ""
            )}
          >
            {xl ? "remote" : "me"} - {email}
          </h1>
          <div
            className={cx(
              "absolute top-1 right-1 bg-blue-600 rounded-full  p-2 text-white m-1",
              xl ? "" : ""
            )}
          >
            <AudioAnalyzer audio={stream} />
          </div>
          <ReactPlayer
            playing
            muted={!remote}
            height={xl ? "560px" : "240px"}
            width={xl ? "1000px" : "440px"}
            url={stream}
          />
        </div>
      )}
    </div>
  );
};

export const VideoPlayerSmall = ({
  stream,
  email,
}: {
  stream: MediaStream | null;
  email: string;
}) => {
  return (
    <div className="absolute left-0 bottom-20 p-4">
      {stream && (
        <div className="bg-pink-00  w-[1005px] h-[567px] relative rounded-md p-1">
          <h1 className="absolute bottom-1 right-1 bg-blue-600 rounded-tl-md  py-1 px-2 text-white">
            remote - {email}
          </h1>
          <ReactPlayer
            playing
            muted
            height="560px"
            width="1000px"
            url={stream}
          />
        </div>
      )}
    </div>
  );
};
