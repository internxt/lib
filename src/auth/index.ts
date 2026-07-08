import isValidPassword from './isValidPassword';
import isValidEmail from './isValidEmail';
import testPasswordStrength from './testPasswordStrength';
import checkTokenExpiration, { TokenStatus } from './checkTokenExpiration';
import validateTokenAndCheckExpiration from './validateTokenAndCheckExpiration';

export default {
  isValidPassword,
  isValidEmail,
  testPasswordStrength,
  checkTokenExpiration,
  validateTokenAndCheckExpiration,
  TokenStatus,
};
