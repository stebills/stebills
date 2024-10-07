import * as SecureStore from 'expo-secure-store';

interface IStorage {
  getItem(key: string): Promise<any | null>;
  setItem(key: string, data: any): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const storage: IStorage = {
  async getItem(key: string) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting item:', error);
    }
  },
  async setItem(key: string, data: any) {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error setting item:', error);
    }
  },
  async removeItem(key: string) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  },
};

export default storage;
