import fs from "fs";

// A utility function to concatenate CSS class names with proper spacing
export const classNames = (...className: string[]) => {
  // Filter out any empty class names and join them with a space
  return className.filter(Boolean).join(" ");
};

export const getStaticFilePath = (req, filename) => {
  return `${req.protocol}://${req.get("host")}/images/${filename}`;
};

export const getLocalPath = (filename) => {
  return `public/images/${filename}`;
};

export const removeLocalFile = (localPath) => {
  fs.unlink(localPath, (err) => {
    if (err) console.log("Error while removing local files: ", err);
    else {
      console.log("Removed local: ", localPath);
    }
  });
};

export const sleep = (ms: number) =>
  new Promise((resolve) => {
    return setTimeout(resolve, ms);
  });
