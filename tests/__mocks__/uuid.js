/**
 * Mock for uuid module to work with Jest
 */

let mockCounter = 0;

const v4 = () => {
  // Generate a predictable UUID for tests
  mockCounter++;
  const hex = mockCounter.toString(16).padStart(8, '0');
  return `${hex.substring(0, 8)}-${hex.substring(0, 4)}-4${hex.substring(1, 4)}-a${hex.substring(1, 4)}-${hex.padStart(12, '0')}`;
};

// Also support validate function
const validate = (uuid) => {
  if (typeof uuid !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
};

module.exports = {
  v4,
  validate
};
