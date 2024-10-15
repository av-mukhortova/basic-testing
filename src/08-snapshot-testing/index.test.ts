// Uncomment the code below and write your tests
import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const linkedList = generateLinkedList(['dogs', 10]);
    expect(linkedList).toStrictEqual({
      next: {
        next: {
          next: null,
          value: null,
        },
        value: 10,
      },
      value: 'dogs',
    });
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const linkedList = generateLinkedList(['dogs', 10, 'cats', null]);
    expect(linkedList).toMatchSnapshot();
  });
});
