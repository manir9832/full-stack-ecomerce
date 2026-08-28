import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  checkUserAuth,
  getAllProducts,
  getCart,
  getMyOrders,
} from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ==========================
  // STATES
  // ==========================

  const [user, setUser] = useState(null);

  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [products, setProducts] = useState([]);

  const [cart, setCart] = useState([]);

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(false);

  // ==========================
  // USER AUTH
  // ==========================

  const loadUser = async () => {
    try {
      const res = await checkUserAuth();

      setUser(res.data.user);
      setIsAuthenticated(true);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // ==========================
  // GET PRODUCTS
  // ==========================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const res = await getAllProducts();

      setProducts(res.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // GET CART
  // ==========================

  const fetchCart = async () => {
    try {
      const res = await getCart();

      setCart(res.data.products || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // GET MY ORDERS
  // ==========================

  const fetchOrders = async () => {
    try {
      const res = await getMyOrders();

      setOrders(res.data.orders || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ==========================
  // REFRESH
  // ==========================

  const refreshData = async () => {
    await fetchProducts();

    if (isAuthenticated) {
      await fetchCart();
      await fetchOrders();
    }
  };

  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(() => {
    loadUser();

    fetchProducts();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchOrders();
    }
  }, [isAuthenticated]);

  // ==========================
  // CONTEXT VALUE
  // ==========================

  const value = {
    user,
    setUser,

    isAuthenticated,
    setIsAuthenticated,

    products,
    setProducts,

    cart,
    setCart,

    orders,
    setOrders,

    loading,
    setLoading,

    loadUser,

    fetchProducts,

    fetchCart,

    fetchOrders,

    refreshData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// ==========================
// CUSTOM HOOK
// ==========================

export const useAppContext = () =>
  useContext(AppContext);

export default AppContext;