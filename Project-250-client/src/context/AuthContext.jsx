import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Decode token to get user info
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const userData = await fetchUserData(payload.id);
        setUser({ ...userData, displayName: userData.name, role: payload.role });
        return { success: true };
      } else {
        throw new Error(data.Message || 'Login failed');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/register-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (response.ok) {
        // After register, login
        return await login(userData.email, userData.password);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const fetchUserData = async (id) => {
    const response = await fetch(`http://localhost:4000/users/${id}`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('Failed to fetch user data');
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    localStorage.removeItem('token');
    setUser(null);
    setLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Check if token is expired
        if (payload.exp * 1000 > Date.now()) {
          fetchUserData(payload.id).then(userData => {
            setUser({ ...userData, displayName: userData.name, role: payload.role });
          });
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const authInfo = {
    user,
    loading,
    setLoading,
    login,
    register,
    signOutUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
