// let io;

// const setIO = (socketIO) => {
//     io = socketIO;
// };

// const getIO = () => {
//     if (!io) {
//         throw new Error("Socket.IO is not initialized");
//     }

//     return io;
// };

// module.exports = {
//     setIO,
//     getIO,
// };























let ioInstance = null;

const setIO = (socketIO) => {
  ioInstance = socketIO;
};

const getIO = () => {
  if (!ioInstance) {
    console.warn("⚠️ Warning: Socket.IO instance is not initialized yet!");
  }
  return ioInstance;
};

module.exports = {
  setIO,
  getIO,
};