import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('lodash', () => {
  return {
    throttle: jest.fn((fn) => fn),
  };
});

jest.mock('axios');

describe('throttledGetDataFromApi', () => {
  const relativePath = 'users';
  const response = {
    data: 'Success response',
  };

  beforeEach(() => {
    (axios.create as jest.Mock).mockReturnValue({
      get: jest.fn(async () => Promise.resolve(response)),
    });
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi(relativePath);

    expect(axios.create).toBeCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    await throttledGetDataFromApi(relativePath);

    expect(axios.create().get).toBeCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const res = await throttledGetDataFromApi(relativePath);
    expect(res).toBe(response.data);
  });
});
