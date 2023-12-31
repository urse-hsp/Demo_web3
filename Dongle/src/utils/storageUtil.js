import AsyncStorage from '@react-native-async-storage/async-storage';

export default {

  constructor() { },

  async get(key) {
    if (!key) {
      return null;
    }
    key = key.toString();
    return await AsyncStorage.getItem(key)
      .then((value) => {
        if (value) {
          return JSON.parse(value);
        }
        return undefined;
      })
      .catch(() => {
        return undefined;
      });
  },

  async set(key, value) {
    if (!key) {
      return;
    }

    let data = await this.get(key); 
    if (data != undefined) {
      value = Object.assign(data.value, value)
    }

    key = key.toString();
    await AsyncStorage.setItem(
      key,
      JSON.stringify({
        value,
      }),
    );
  },

  /**
   * 删除key对应json数值
   * @param key
   * @returns {Promise<string>}
   */
  async deleteItem(key) {
    if (!key) {
      return;
    }
    return await AsyncStorage.removeItem(key);
  },

  /**
   * 删除所有配置数据
   * @returns {Promise<string>}
   */
  async clear() {
    return await AsyncStorage.clear();
  },
}; 