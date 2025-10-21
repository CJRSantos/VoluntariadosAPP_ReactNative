// hooks/useAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem('user');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('No se pudo cargar el usuario:', e);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return { user, loading };
};