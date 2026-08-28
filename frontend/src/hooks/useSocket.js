import { useSocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const { socket, isConnected } = useSocketContext();
  return { socket, isConnected };
};