export const playOrderAlert = () => {
  const audio = new Audio('/assets/sounds/alert.mp3');
  audio.play().catch((err) => console.log('Audio playback prevented:', err));
};