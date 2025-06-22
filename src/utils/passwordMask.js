/**
 * Password Masking System
 * 
 * 11-digit mask logic:
 * 1. Uppercase allowed (0/1)
 * 2. Required uppercase index (cyclic)
 * 3. Lowercase allowed (0/1)
 * 4. Required lowercase index (cyclic)
 * 5. Digits 0-5 allowed (0/1)
 * 6. Required digit 0-5 index (cyclic)
 * 7. Digits 6-9 allowed (0/1)
 * 8. Required digit 6-9 index (cyclic)
 * 9. Special chars allowed (0/1)
 * 10. Required special char index (cyclic)
 * 11. Minimum length (1-9)
 */

// Default special characters set
export const DEFAULT_SPECIAL_CHARS = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

// Character sets
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const DIGITS_0_5 = '012345';
const DIGITS_6_9 = '6789';

/**
 * Parse the 11-digit mask into a configuration object
 * @param {string} mask - 11-digit mask string
 * @param {Array} specialChars - Array of special characters
 * @returns {Object} Parsed mask configuration
 */
export function parseMask(mask, specialChars = DEFAULT_SPECIAL_CHARS) {
  if (!/^\d{11}$/.test(mask)) {
    throw new Error('Mask must be exactly 11 digits');
  }

  const digits = mask.split('').map(Number);
  
  return {
    uppercaseAllowed: digits[0] === 1,
    requiredUppercaseIndex: digits[1],
    lowercaseAllowed: digits[2] === 1,
    requiredLowercaseIndex: digits[3],
    digits0to5Allowed: digits[4] === 1,
    requiredDigit0to5Index: digits[5],
    digits6to9Allowed: digits[6] === 1,
    requiredDigit6to9Index: digits[7],
    specialCharsAllowed: digits[8] === 1,
    requiredSpecialCharIndex: digits[9],
    minLength: digits[10] || 1, // Ensure minimum of 1
    specialChars
  };
}

/**
 * Get character by cyclic index from a character set
 * @param {string|Array} charSet - Character set
 * @param {number} index - Index (1-based, cyclic)
 * @returns {string} Character at the cyclic index
 */
function getCharByCyclicIndex(charSet, index) {
  if (index === 0) return null; // Index 0 means no requirement
  const chars = Array.isArray(charSet) ? charSet : charSet.split('');
  return chars[(index - 1) % chars.length];
}

/**
 * Get all allowed characters based on mask configuration
 * @param {Object} config - Parsed mask configuration
 * @returns {string} All allowed characters
 */
function getAllowedChars(config) {
  let allowed = '';
  
  if (config.uppercaseAllowed) allowed += UPPERCASE;
  if (config.lowercaseAllowed) allowed += LOWERCASE;
  if (config.digits0to5Allowed) allowed += DIGITS_0_5;
  if (config.digits6to9Allowed) allowed += DIGITS_6_9;
  if (config.specialCharsAllowed) allowed += config.specialChars.join('');
  
  return allowed;
}

/**
 * Get required characters based on mask configuration
 * @param {Object} config - Parsed mask configuration
 * @returns {Array} Array of required characters
 */
function getRequiredChars(config) {
  const required = [];
  
  if (config.uppercaseAllowed && config.requiredUppercaseIndex > 0) {
    required.push(getCharByCyclicIndex(UPPERCASE, config.requiredUppercaseIndex));
  }
  
  if (config.lowercaseAllowed && config.requiredLowercaseIndex > 0) {
    required.push(getCharByCyclicIndex(LOWERCASE, config.requiredLowercaseIndex));
  }
  
  if (config.digits0to5Allowed && config.requiredDigit0to5Index > 0) {
    required.push(getCharByCyclicIndex(DIGITS_0_5, config.requiredDigit0to5Index));
  }
  
  if (config.digits6to9Allowed && config.requiredDigit6to9Index > 0) {
    required.push(getCharByCyclicIndex(DIGITS_6_9, config.requiredDigit6to9Index));
  }
  
  if (config.specialCharsAllowed && config.requiredSpecialCharIndex > 0) {
    required.push(getCharByCyclicIndex(config.specialChars, config.requiredSpecialCharIndex));
  }
  
  return required.filter(char => char !== null);
}

/**
 * Validate if a password matches the given mask
 * @param {string} password - Password to validate
 * @param {string} mask - 11-digit mask
 * @param {Array} specialChars - Array of special characters
 * @returns {Object} Validation result with success flag and details
 */
export function validatePassword(password, mask, specialChars = DEFAULT_SPECIAL_CHARS) {
  try {
    const config = parseMask(mask, specialChars);
    const allowedChars = getAllowedChars(config);
    const requiredChars = getRequiredChars(config);
    
    const result = {
      isValid: true,
      errors: [],
      details: {
        length: password.length,
        minLength: config.minLength,
        allowedChars: allowedChars.split(''),
        requiredChars,
        foundRequiredChars: []
      }
    };
    
    // Check minimum length
    if (password.length < config.minLength) {
      result.isValid = false;
      result.errors.push(`Password must be at least ${config.minLength} characters long`);
    }
    
    // Check if all characters are allowed
    for (const char of password) {
      if (!allowedChars.includes(char)) {
        result.isValid = false;
        result.errors.push(`Character '${char}' is not allowed`);
      }
    }
    
    // Check if all required characters are present
    for (const requiredChar of requiredChars) {
      if (password.includes(requiredChar)) {
        result.details.foundRequiredChars.push(requiredChar);
      } else {
        result.isValid = false;
        result.errors.push(`Required character '${requiredChar}' is missing`);
      }
    }
    
    return result;
    
  } catch (error) {
    return {
      isValid: false,
      errors: [error.message],
      details: null
    };
  }
}

/**
 * Generate a random password that satisfies the given mask
 * @param {string} mask - 11-digit mask
 * @param {Array} specialChars - Array of special characters
 * @param {number} targetLength - Target password length (optional)
 * @returns {string} Generated password
 */
export function generatePassword(mask, specialChars = DEFAULT_SPECIAL_CHARS, targetLength = null) {
  const config = parseMask(mask, specialChars);
  const allowedChars = getAllowedChars(config);
  const requiredChars = getRequiredChars(config);
  
  if (allowedChars.length === 0) {
    throw new Error('No character types are allowed');
  }
  
  // Determine password length
  const length = targetLength || Math.max(config.minLength, requiredChars.length + 2);
  
  if (length < config.minLength) {
    throw new Error(`Target length ${length} is less than minimum required length ${config.minLength}`);
  }
  
  if (length < requiredChars.length) {
    throw new Error(`Target length ${length} is less than number of required characters ${requiredChars.length}`);
  }
  
  // Start with required characters
  let password = [...requiredChars];
  
  // Fill remaining positions with random allowed characters
  while (password.length < length) {
    const randomChar = allowedChars[Math.floor(Math.random() * allowedChars.length)];
    password.push(randomChar);
  }
  
  // Shuffle the password to randomize positions
  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }
  
  return password.join('');
}

/**
 * Get a human-readable description of the mask rules
 * @param {string} mask - 11-digit mask
 * @param {Array} specialChars - Array of special characters
 * @returns {Object} Description of mask rules
 */
export function describeMask(mask, specialChars = DEFAULT_SPECIAL_CHARS) {
  try {
    const config = parseMask(mask, specialChars);
    const requiredChars = getRequiredChars(config);
    
    const description = {
      rules: [],
      requiredCharacters: requiredChars,
      minLength: config.minLength,
      allowedCharacterTypes: []
    };
    
    if (config.uppercaseAllowed) {
      description.allowedCharacterTypes.push('Uppercase letters (A-Z)');
      if (config.requiredUppercaseIndex > 0) {
        const requiredChar = getCharByCyclicIndex(UPPERCASE, config.requiredUppercaseIndex);
        description.rules.push(`Must contain uppercase letter: ${requiredChar}`);
      }
    }
    
    if (config.lowercaseAllowed) {
      description.allowedCharacterTypes.push('Lowercase letters (a-z)');
      if (config.requiredLowercaseIndex > 0) {
        const requiredChar = getCharByCyclicIndex(LOWERCASE, config.requiredLowercaseIndex);
        description.rules.push(`Must contain lowercase letter: ${requiredChar}`);
      }
    }
    
    if (config.digits0to5Allowed) {
      description.allowedCharacterTypes.push('Digits 0-5');
      if (config.requiredDigit0to5Index > 0) {
        const requiredChar = getCharByCyclicIndex(DIGITS_0_5, config.requiredDigit0to5Index);
        description.rules.push(`Must contain digit 0-5: ${requiredChar}`);
      }
    }
    
    if (config.digits6to9Allowed) {
      description.allowedCharacterTypes.push('Digits 6-9');
      if (config.requiredDigit6to9Index > 0) {
        const requiredChar = getCharByCyclicIndex(DIGITS_6_9, config.requiredDigit6to9Index);
        description.rules.push(`Must contain digit 6-9: ${requiredChar}`);
      }
    }
    
    if (config.specialCharsAllowed) {
      description.allowedCharacterTypes.push(`Special characters (${config.specialChars.join(', ')})`);
      if (config.requiredSpecialCharIndex > 0) {
        const requiredChar = getCharByCyclicIndex(config.specialChars, config.requiredSpecialCharIndex);
        description.rules.push(`Must contain special character: ${requiredChar}`);
      }
    }
    
    description.rules.push(`Minimum length: ${config.minLength} characters`);
    
    return description;
    
  } catch (error) {
    return {
      error: error.message,
      rules: [],
      requiredCharacters: [],
      minLength: 0,
      allowedCharacterTypes: []
    };
  }
} 