# Password Masking System

A Vue.js application that implements a password masking system based on an 11-digit numeric mask. This system allows users to define consistent patterns for password creation that they can remember and reuse across different services.

## How It Works

The system uses an 11-digit mask where each digit has a specific meaning:

### Mask Format: `ABCDEFGHIJK`

| Position | Meaning | Values | Description |
|----------|---------|--------|-------------|
| A (1st) | Uppercase allowed | 0/1 | Whether uppercase letters (A-Z) are allowed |
| B (2nd) | Required uppercase index | 0-9 | Index of required uppercase letter (0 = no requirement) |
| C (3rd) | Lowercase allowed | 0/1 | Whether lowercase letters (a-z) are allowed |
| D (4th) | Required lowercase index | 0-9 | Index of required lowercase letter (0 = no requirement) |
| E (5th) | Digits 0-5 allowed | 0/1 | Whether digits 0-5 are allowed |
| F (6th) | Required digit 0-5 index | 0-9 | Index of required digit from [0,1,2,3,4,5] |
| G (7th) | Digits 6-9 allowed | 0/1 | Whether digits 6-9 are allowed |
| H (8th) | Required digit 6-9 index | 0-9 | Index of required digit from [6,7,8,9] |
| I (9th) | Special chars allowed | 0/1 | Whether special characters are allowed |
| J (10th) | Required special char index | 0-9 | Index of required special character |
| K (11th) | Minimum length | 1-9 | Minimum password length |

### Cyclic Indexing

All indexes use **1-based cyclic indexing**:
- Index 0 = no requirement
- Index 1 = first character in the set
- Index 2 = second character in the set
- When index exceeds set length, it wraps around (e.g., index 27 for uppercase = index 1 = 'A')

## Examples

### Example 1: `10110510128`
- **1**: Uppercase letters allowed
- **0**: No required uppercase letter
- **1**: Lowercase letters allowed  
- **1**: Required lowercase letter 'a' (index 1)
- **0**: Digits 0-5 not allowed
- **5**: (Ignored since digits 0-5 not allowed)
- **1**: Digits 6-9 allowed
- **0**: No required digit 6-9
- **1**: Special characters allowed
- **2**: Required special character '@' (index 2)
- **8**: Minimum length 8 characters

**Valid passwords**: `Aa7@xxxx`, `Z9p!@RNa`, etc.

### Example 2: `11100100109`
- Only uppercase and lowercase letters allowed
- Required uppercase 'A' (index 1)
- No other requirements
- Minimum length 9

**Valid passwords**: `AaBbCcDdE`, `HelloWorA`, etc.

### Example 3: `00001010015`
- Only digits 0-5 allowed
- Required digit '0' (index 1)
- Minimum length 5

**Valid passwords**: `00123`, `30451`, etc.

## Features

### 1. Password Validation
```javascript
import { validatePassword } from './utils/passwordMask.js'

const result = validatePassword('Aa7@xxxx', '10110510128')
console.log(result.isValid) // true
console.log(result.errors) // []
```

### 2. Password Generation
```javascript
import { generatePassword } from './utils/passwordMask.js'

const password = generatePassword('10110510128')
console.log(password) // e.g., "Z9p!@RNa"
```

### 3. Mask Description
```javascript
import { describeMask } from './utils/passwordMask.js'

const description = describeMask('10110510128')
console.log(description.rules)
// ['Must contain lowercase letter: a', 'Must contain special character: @', 'Minimum length: 8 characters']
```

### 4. Custom Special Characters
```javascript
const customSpecialChars = ['!', '@', '#', '$', '%']
const password = generatePassword('10110510128', customSpecialChars)
```

## Web Interface

The application provides a user-friendly web interface with:

- **Mask Configuration**: Input 11-digit mask and customize special characters
- **Real-time Validation**: Test passwords against your mask
- **Password Generation**: Generate random passwords that satisfy the mask
- **Rule Description**: Human-readable explanation of mask rules
- **Example Masks**: Pre-configured examples to get started

## Technical Implementation

### Core Functions

- `parseMask(mask, specialChars)`: Parse 11-digit mask into configuration
- `validatePassword(password, mask, specialChars)`: Validate password against mask
- `generatePassword(mask, specialChars, targetLength)`: Generate compliant password
- `describeMask(mask, specialChars)`: Get human-readable mask description

### Character Sets

- **Uppercase**: A-Z (26 characters)
- **Lowercase**: a-z (26 characters)  
- **Digits 0-5**: 0,1,2,3,4,5 (6 characters)
- **Digits 6-9**: 6,7,8,9 (4 characters)
- **Special**: Default `!@#$%^&*()` (customizable)

## Use Cases

1. **Personal Password Management**: Create memorable patterns for different services
2. **Corporate Password Policy**: Enforce consistent password requirements
3. **Security Training**: Demonstrate password complexity requirements
4. **Password Auditing**: Validate existing passwords against policies

## Getting Started

1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`
4. Open browser to `http://localhost:5173`
5. Try the example masks or create your own!

## Testing

Run the test suite to verify functionality:
```bash
node src/utils/passwordMask.test.js
```

The tests cover:
- Basic mask parsing and validation
- Password generation and validation
- Cyclic indexing logic
- Edge cases and error handling
- Various mask configurations 