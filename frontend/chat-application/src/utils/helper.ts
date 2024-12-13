export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function playPause() {
  const val = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
  if (val > 5) {
    return "running";
  } else {
    return "paused";
  }
}
// left-[${getRandomInt(0, 800)}px] top-[${getRandomInt(0, 800)}px]`
