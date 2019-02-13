import casual from 'casual';

// seed it so we get consistent results
casual.seed(777);

const testItem = () => ({
  __typename: 'Item',
  id: 'abc123',
  price: 5000,
  user: null,
  image: 'dog-small.jpg',
  title: 'dogs are best',
  description: 'dogs',
  largeImage: 'dog.jpg',
});

const testUser = () => ({
  __typename: 'User',
  id: '4234',
  name: casual.name,
  email: casual.email,
  permissions: ['ADMIN'],
  orders: [],
  cart: [],
});

const testOrderItem = () => ({
  __typename: 'OrderItem',
  id: casual.uuid,
  image: `${casual.word}.jpg`,
  title: casual.words(),
  price: 4234,
  quantity: 1,
  description: casual.words(),
});

const testOrder = () => ({
  __typename: 'Order',
  id: 'ord123',
  charge: 'ch_123',
  total: 40000,
  items: [testOrderItem(), testOrderItem()],
  createdAt: '2018-04 - 06T19: 24: 16.000Z',
  user: testUser(),
});

const testCartItem = overrides => ({
  __typename: 'CartItem',
  id: 'omg123',
  quantity: 3,
  item: testItem(),
  user: testUser(),
  ...overrides,
});

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }

  removeItem(key) {
    delete this.store[key];
  }
}

export {
  LocalStorageMock,
  testItem,
  testUser,
  testCartItem,
  testOrder,
  testOrderItem,
};
