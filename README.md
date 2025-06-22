# Password Mask System

A sophisticated Vue.js application that implements a unique password masking system based on an 11-digit numeric template. This system enables users to create consistent, memorable password patterns that can be reused across different services while maintaining security requirements.

## 🎯 Motivation and Use Case

Traditional password managers store your actual passwords, but what if you could remember a simple 11-digit pattern that generates different secure passwords for each service? This project solves several key problems:

- **Memorable Security**: Create complex passwords using a simple, memorable numeric pattern
- **Consistency**: Apply the same password rules across different platforms
- **Flexibility**: Customize character requirements while maintaining pattern consistency
- **Auditability**: Easily verify if existing passwords meet your security standards
- **No Storage Required**: Your 11-digit mask is all you need to remember

Perfect for individuals who want password security without dependence on password managers, or organizations that need to enforce consistent password policies.

## 🔧 How It Works

The system uses an **11-digit mask** where each digit defines specific password requirements. The mask format is: `ABCDEFGHIJK`

### Mask Structure

| Position | Meaning | Values | Description |
|----------|---------|--------|-------------|
| **A** (1st) | Uppercase allowed | 0/1 | Whether uppercase letters (A-Z) are permitted |
| **B** (2nd) | Required uppercase index | 0-9 | Cyclic index of required uppercase letter (0 = none) |
| **C** (3rd) | Lowercase allowed | 0/1 | Whether lowercase letters (a-z) are permitted |
| **D** (4th) | Required lowercase index | 0-9 | Cyclic index of required lowercase letter (0 = none) |
| **E** (5th) | Digits 0-5 allowed | 0/1 | Whether digits 0-5 are permitted |
| **F** (6th) | Required digit 0-5 index | 0-9 | Cyclic index from [0,1,2,3,4,5] (0 = none) |
| **G** (7th) | Digits 6-9 allowed | 0/1 | Whether digits 6-9 are permitted |
| **H** (8th) | Required digit 6-9 index | 0-9 | Cyclic index from [6,7,8,9] (0 = none) |
| **I** (9th) | Special chars allowed | 0/1 | Whether special characters are permitted |
| **J** (10th) | Required special char index | 0-9 | Cyclic index of required special character (0 = none) |
| **K** (11th) | Minimum length | 1-9 | Minimum password length requirement |

### 🔄 Cyclic Indexing Logic

The system uses **1-based cyclic indexing** for character selection:

- **Index 0**: No requirement for this character type
- **Index 1**: First character in the set (A, a, 0, 6, or first special char)
- **Index 2**: Second character in the set (B, b, 1, 7, or second special char)
- **Wraparound**: When index exceeds set length, it cycles back (index 27 for uppercase = index 1 = 'A')

**Character Sets:**
- **Uppercase**: A-Z (26 characters)
- **Lowercase**: a-z (26 characters)
- **Digits 0-5**: 0,1,2,3,4,5 (6 characters)
- **Digits 6-9**: 6,7,8,9 (4 characters)
- **Special**: Default `!@#$%^&*()` (customizable)

## ✨ Features

### 🎯 Core Functionality
- **Mask-based password generation**: Create passwords that match your exact requirements
- **Real-time validation**: Instantly verify if passwords comply with your mask
- **Cyclic character indexing**: Predictable character selection using simple numeric indexes
- **Custom symbol sets**: Define your own special characters for different platforms
- **Flexible length control**: Set minimum length requirements

### 🖥️ User Interface
- **Interactive mask builder**: Visual interface for creating and testing masks
- **Live rule description**: Human-readable explanation of your mask requirements
- **Password testing**: Real-time validation with detailed error reporting
- **Random generation**: Generate compliant passwords with optional length targeting
- **Responsive design**: Works seamlessly on desktop and mobile devices

### 🚀 Technical Features
- **Vue 3 + Vite**: Modern, fast development and build process
- **Vercel-ready**: Optimized for easy deployment
- **Accessibility**: WCAG-compliant interface with proper ARIA labels
- **No dependencies**: Core logic uses vanilla JavaScript
- **Comprehensive validation**: Detailed error reporting and success feedback

## 📦 Installation and Setup

### Prerequisites
- Node.js 16+ and npm
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/own-password-logic.git
   cd own-password-logic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:5173
   ```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

### Deploy to Vercel

#### Option 1: Vercel Dashboard (Recommended)
1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Vercel will auto-detect the Vite framework
5. Click "Deploy"

#### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow the prompts to configure your project
```

## 🎮 Usage Instructions

### Creating a Password Mask

1. **Open the application** in your browser
2. **Enter an 11-digit mask** in the "Password Mask Configuration" section
3. **Customize special characters** if needed (optional)
4. **Review the generated rules** to ensure they match your requirements

### Validating Existing Passwords

1. **Enter your mask** (as above)
2. **Type a password** in the "Test Password" section
3. **View real-time validation** results with detailed feedback
4. **Fix any issues** highlighted in the error messages

### Generating New Passwords

1. **Configure your mask** (as above)
2. **Set target length** (optional - leave empty for automatic)
3. **Click "Generate Password"** to create a compliant password
4. **Generate multiple options** by clicking the button repeatedly

## 📚 Examples

### Example 1: Balanced Security
**Mask**: `10110510128`
```
1 - Uppercase letters allowed
0 - No specific uppercase required
1 - Lowercase letters allowed  
1 - Required lowercase: 'a' (index 1)
0 - Digits 0-5 not allowed
5 - (Ignored - digits 0-5 disabled)
1 - Digits 6-9 allowed
0 - No specific digit 6-9 required
1 - Special characters allowed
2 - Required special: '@' (index 2, default set)
8 - Minimum length: 8 characters
```
**Valid passwords**: `Aa7@xxxx`, `Z9p@RNaB`, `Hello@a8`

### Example 2: Letters Only
**Mask**: `11100100109`
```
Only uppercase and lowercase letters
Required uppercase: 'A' (index 1)
No other specific requirements
Minimum length: 9 characters
```
**Valid passwords**: `AaBbCcDdE`, `HelloWorA`, `AbcdefghA`

### Example 3: Digits Only
**Mask**: `00001010015`
```
Only digits 0-5 allowed
Required digit: '0' (index 1)
Minimum length: 5 characters
```
**Valid passwords**: `00123`, `30451`, `12340`

### Example 4: High Security
**Mask**: `12345123459`
```
All character types required:
- Uppercase: 'B' (index 2)
- Lowercase: 'e' (index 5) 
- Digit 0-5: '4' (index 5)
- Digit 6-9: '8' (index 3)
- Special: '$' (index 4, default set)
Minimum length: 9 characters
```
**Valid passwords**: `B4e8$xYzQ`, `MyB4e8$Pw`

## 🛠️ Customization

### Modifying Special Characters

```javascript
// In the web interface
// Change the "Special Characters" input field
// Example: !@#$%^&*()_+-=[]{}|;:,.<>?

// In code (src/utils/passwordMask.js)
export const DEFAULT_SPECIAL_CHARS = ['!', '@', '#', '$', '%', '^', '&', '*'];
```

### Extending Character Sets

```javascript
// Add new character categories by modifying passwordMask.js
const CUSTOM_SYMBOLS = '₹€£¥';
const ACCENTED_LETTERS = 'àáâãäåæçèéêë';

// Extend the getAllowedChars function to include new sets
```

### Adding New Validation Rules

```javascript
// In validatePassword function, add custom checks
if (password.includes('password')) {
  result.isValid = false;
  result.errors.push('Password cannot contain the word "password"');
}
```

## 📁 Project Structure

```
own-password-logic/
├── src/
│   ├── components/
│   │   ├── PasswordMaskTester.vue    # Main UI component
│   │   └── HelloWorld.vue            # Default Vue component
│   │   
│   ├── utils/
│   │   └── passwordMask.js           # Core password logic
│   │   
│   ├── App.vue                       # Root component
│   │   
│   ├── main.js                       # Application entry point
│   │   
│   └── style.css                     # Global styles
│   
├── public/
│   └── vite.svg                      # Vite logo
│   
├── dist/                             # Production build output
│   
├── package.json                      # Dependencies and scripts
│   
├── vite.config.js                    # Vite configuration
│   
├── index.html                        # HTML template
│   
└── README.md                         # This file
```

### Key Files

- **`src/utils/passwordMask.js`**: Core password masking logic with functions for parsing, validation, generation, and description
- **`src/components/PasswordMaskTester.vue`**: Complete UI interface with real-time validation and generation
- **`src/App.vue`**: Main application wrapper with global styles

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test` (if tests exist)
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### Areas for Contribution
- **Additional character sets**: Support for Unicode, emojis, or language-specific characters
- **Export/Import**: Save and load mask configurations
- **Password history**: Track generated passwords (without storing them)
- **Batch generation**: Generate multiple passwords at once
- **Mobile app**: React Native or Flutter implementation
- **Browser extension**: Direct integration with login forms

### Code Style
- Use ESLint configuration provided
- Follow Vue.js style guide
- Add JSDoc comments for new functions
- Maintain accessibility standards

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Password Mask System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🚀 Quick Start

**Try it now:**
1. Open the application
2. Use mask `10110510128` 
3. Generate a password
4. Test it in the validation field
5. Experiment with your own masks!

**Need help?** Check the examples above or hover over any input field for helpful tooltips.

Built with ❤️ using Vue 3, Vite, and modern web standards.
