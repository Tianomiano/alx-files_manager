import { createClient } from 'redis';
import { promisify } from 'util';

/**
 * Redis client class
 */
class RedisClient {
  constructor() {
    this.client = createClient();
    this.isConnected = false;

    this.client.on('error', (err) => {
    console.log('Redis Client Error', err);
    });

    this.client.on('connect', () => {
    this.isConnected = true;
    });

    this.asyncSetX = promisify(this.client.setex).bind(this.client);
    this.asyncGet = promisify(this.client.get).bind(this.client);
    this.asyncDel = promisify(this.client.del).bind(this.client);
    this.asyncExpire = promisify(this.client.expire).bind(this.client);
  }

  /**
   * a function isAlive that returns true when the connection
   * to Redis is a success otherwise, false
   *
   * @return {boolean} Returns true if the client is alive, false otherwise.
   */
  isAlive() {
    return this.isConnected;
  }

  /**
   * an asynchronous function set that takes a string key,
   * a value and a duration in second as arguments to store it in Redis
   * with an expiration set by the duration argument
   *
   * @param {string} key
   * @param {any} value
   * @param {number} expiry
   * @return {Promise<void>}
   */
  set(key, value, expiry) {
    this.asyncSetX(key, expiry, value);
  }

  /**
   * Retrieves the value associated with the given key.
   *
   * @param {string} key - the key to retrieve the value for
   * @return {*} the value associated with the given key
   */
  get(key) {
    return this.asyncGet(key);
  }

  /**
   * Deletes the specified key using asynchronous delete method.
   *
   * @param {any} key - the key to be deleted
   * @return {Promise} A promise that resolves after the deletion is complete
   */
  del(key) {
    return this.asyncDel(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
