


// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const SocketContext = createContext();

// // ব্যাকএন্ড পোর্ট 4000 নিশ্চিত করা হলো
// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// export const SocketProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     const newSocket = io(SOCKET_URL, {
//       withCredentials: true,
//       autoConnect: true,
//       transports: ['websocket', 'polling'],
//     });

//     newSocket.on('connect', () => {
//       console.log('⚡ Socket Connected:', newSocket.id);
//       setIsConnected(true);

//       // পেজ রিলোড হলেও যদি ইউজার/সেলার আইডি থাকে তবে পুনরায় রুমে জয়েন করা
//       const customerId = localStorage.getItem('userId') || localStorage.getItem('customerId');
//       const sellerId = localStorage.getItem('sellerId');
//       const deliveryBoyId = localStorage.getItem('deliveryBoyId');

//       if (customerId) newSocket.emit('joinCustomer', customerId);
//       if (sellerId) newSocket.emit('joinSeller', sellerId);
//       if (deliveryBoyId) newSocket.emit('joinDeliveryBoy', deliveryBoyId);
//     });

//     newSocket.on('connect_error', (err) => {
//       console.warn('⚠️ Socket Connection Error:', err.message);
//     });

//     newSocket.on('disconnect', () => {
//       console.log('❌ Socket Disconnected');
//       setIsConnected(false);
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.close();
//     };
//   }, []);

//   const joinCustomerRoom = (customerId) => {
//     if (socket && customerId) {
//       socket.emit('joinCustomer', customerId);
//     }
//   };

//   const joinSellerRoom = (sellerId) => {
//     if (socket && sellerId) {
//       socket.emit('joinSeller', sellerId);
//     }
//   };

//   const joinDeliveryRoom = (deliveryBoyId) => {
//     if (socket && deliveryBoyId) {
//       socket.emit('joinDeliveryBoy', deliveryBoyId);
//     }
//   };

//   return (
//     <SocketContext.Provider
//       value={{
//         socket,
//         isConnected,
//         joinCustomerRoom,
//         joinSellerRoom,
//         joinDeliveryRoom,
//       }}
//     >
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocketContext = () => useContext(SocketContext);





























import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    // সিঙ্গলটন সকেট কানেকশন
    const s = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = s;

    s.on('connect', () => {
      console.log('⚡ Socket Connected Successfully! ID:', s.id);
      setIsConnected(true);

      const customerId = localStorage.getItem('userId') || localStorage.getItem('customerId');
      const sellerId = localStorage.getItem('sellerId');
      const deliveryBoyId = localStorage.getItem('deliveryBoyId');

      if (customerId) s.emit('joinCustomer', String(customerId));
      if (sellerId) s.emit('joinSeller', String(sellerId));
      if (deliveryBoyId) s.emit('joinDeliveryBoy', String(deliveryBoyId));
    });

    s.on('disconnect', () => {
      console.log('❌ Socket Disconnected');
      setIsConnected(false);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  const joinCustomerRoom = useCallback((customerId) => {
    if (socketRef.current && customerId) {
      socketRef.current.emit('joinCustomer', String(customerId));
    }
  }, []);

  const joinSellerRoom = useCallback((sellerId) => {
    if (socketRef.current && sellerId) {
      socketRef.current.emit('joinSeller', String(sellerId));
    }
  }, []);

  const joinDeliveryRoom = useCallback((deliveryBoyId) => {
    if (socketRef.current && deliveryBoyId) {
      socketRef.current.emit('joinDeliveryBoy', String(deliveryBoyId));
    }
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinCustomerRoom,
        joinSellerRoom,
        joinDeliveryRoom,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);