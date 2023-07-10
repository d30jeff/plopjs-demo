import { customAlphabet } from 'nanoid';

const AVAILABLE = '01234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export const generateID = (prefix: string, length = 10): string => {
  const ID = customAlphabet(AVAILABLE, length)();
  return `${prefix}_${ID}`;
};

export const generateToken = (length = 128): string => {
  return customAlphabet(AVAILABLE, length)();
};

export const generateCode = (length = 6): string => {
  return customAlphabet('1234567890', length)();
};
