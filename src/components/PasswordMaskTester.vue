<template>
  <div class="password-mask-tester">
    <!-- Header Section -->
    <header class="header">
      <h1 class="title">Password Masking System</h1>
      <p class="subtitle">
        Create and test passwords using an 11-digit mask that defines character requirements and constraints.
      </p>
    </header>

    <!-- Main Content -->
    <div class="content">
      <!-- Mask Configuration Section -->
      <section class="card" aria-labelledby="mask-config-title">
        <h2 id="mask-config-title" class="card-title">
          <span class="icon">⚙️</span>
          Password Mask Configuration
        </h2>
        
        <div class="form-group">
          <label for="mask" class="label">11-Digit Mask</label>
          <div class="input-wrapper">
            <input
              id="mask"
              v-model="mask"
              type="text"
              placeholder="e.g., 10110510128"
              maxlength="11"
              pattern="\d{11}"
              class="input input-mask"
              :class="{ 'input-error': maskError }"
              @input="validateMask"
              aria-describedby="mask-help mask-error"
            />
            <small id="mask-help" class="help-text">Enter exactly 11 digits</small>
          </div>
          <div v-if="maskError" id="mask-error" class="error-message" role="alert">
            {{ maskError }}
          </div>
        </div>

        <div class="form-group">
          <label for="specialChars" class="label">Special Characters</label>
          <div class="input-wrapper">
            <input
              id="specialChars"
              v-model="specialCharsInput"
              type="text"
              placeholder="!@#$%^&*()"
              class="input"
              aria-describedby="special-help"
            />
            <small id="special-help" class="help-text">
              Enter characters without spaces or separators
            </small>
          </div>
        </div>

        <!-- Mask Description -->
        <div v-if="maskDescription && !maskError" class="mask-description" aria-labelledby="mask-rules-title">
          <h3 id="mask-rules-title" class="description-title">
            <span class="icon">📋</span>
            Mask Rules
          </h3>
          
          <div class="rules-container">
            <div class="rules-section">
              <h4 class="rules-subtitle">Allowed Character Types</h4>
              <ul class="rules-list" role="list">
                <li v-for="type in maskDescription.allowedCharacterTypes" :key="type" class="rule-item">
                  <span class="rule-bullet">•</span>
                  {{ type }}
                </li>
              </ul>
            </div>
            
            <div class="rules-section">
              <h4 class="rules-subtitle">Requirements</h4>
              <ul class="rules-list" role="list">
                <li v-for="rule in maskDescription.rules" :key="rule" class="rule-item">
                  <span class="rule-bullet">•</span>
                  {{ rule }}
                </li>
              </ul>
            </div>
          </div>
          
          <div v-if="maskDescription.requiredCharacters.length > 0" class="required-chars">
            <strong class="required-label">Required Characters:</strong>
            <code class="char-list">{{ maskDescription.requiredCharacters.join(', ') }}</code>
          </div>
        </div>
      </section>

      <!-- Password Testing Section -->
      <section class="card" aria-labelledby="test-title">
        <h2 id="test-title" class="card-title">
          <span class="icon">🔍</span>
          Test Password
        </h2>
        
        <div class="form-group">
          <label for="testPassword" class="label">Password to Test</label>
          <div class="input-wrapper">
            <input
              id="testPassword"
              v-model="testPassword"
              type="text"
              placeholder="Enter password to validate"
              class="input"
              :class="{ 
                'input-success': validationResult?.isValid, 
                'input-error': validationResult && !validationResult.isValid 
              }"
              @input="validateTestPassword"
              aria-describedby="test-help"
            />
            <small id="test-help" class="help-text">
              Enter a password to check against your mask
            </small>
          </div>
        </div>
        
        <!-- Validation Results -->
        <div v-if="validationResult" class="validation-result" role="region" aria-labelledby="validation-status">
          <div 
            id="validation-status"
            class="validation-status" 
            :class="{ 'status-valid': validationResult.isValid, 'status-invalid': !validationResult.isValid }"
          >
            <span class="status-icon" aria-hidden="true">
              {{ validationResult.isValid ? '✅' : '❌' }}
            </span>
            <span class="status-text">
              {{ validationResult.isValid ? 'Valid Password' : 'Invalid Password' }}
            </span>
          </div>
          
          <!-- Errors -->
          <div v-if="!validationResult.isValid && validationResult.errors.length > 0" class="errors">
            <h4 class="errors-title">Issues Found:</h4>
            <ul class="errors-list" role="list">
              <li v-for="error in validationResult.errors" :key="error" class="error-item">
                <span class="error-bullet">⚠️</span>
                {{ error }}
              </li>
            </ul>
          </div>
          
          <!-- Details -->
          <div v-if="validationResult.details" class="validation-details">
            <div class="detail-item">
              <span class="detail-label">Length:</span>
              <span class="detail-value">
                {{ validationResult.details.length }} / {{ validationResult.details.minLength }} (min)
              </span>
            </div>
            <div v-if="validationResult.details.foundRequiredChars.length > 0" class="detail-item">
              <span class="detail-label">Found Required Characters:</span>
              <code class="detail-value char-list">
                {{ validationResult.details.foundRequiredChars.join(', ') }}
              </code>
            </div>
          </div>
        </div>
      </section>

      <!-- Password Generation Section -->
      <section class="card" aria-labelledby="generate-title">
        <h2 id="generate-title" class="card-title">
          <span class="icon">🎲</span>
          Generate Password
        </h2>
        
        <div class="generation-controls">
          <div class="form-group form-group-inline">
            <label for="targetLength" class="label">Target Length (optional)</label>
            <input
              id="targetLength"
              v-model.number="targetLength"
              type="number"
              min="1"
              max="50"
              placeholder="Auto"
              class="input input-number"
              aria-describedby="length-help"
            />
            <small id="length-help" class="help-text">Leave empty for automatic length</small>
          </div>
          
          <button 
            @click="generateNewPassword" 
            :disabled="!!maskError"
            class="btn btn-primary btn-generate"
            :aria-describedby="maskError ? 'generate-error' : undefined"
          >
            <span class="btn-icon" aria-hidden="true">🔐</span>
            Generate Password
          </button>
          
          <div v-if="maskError" id="generate-error" class="error-message" role="alert">
            Please fix mask errors first
          </div>
        </div>
        
        <!-- Generated Password Display -->
        <div v-if="generatedPassword" class="generated-password">
          <label class="label">Generated Password</label>
          <div class="password-display">
            <code class="password-code" aria-label="Generated password">{{ generatedPassword }}</code>
            <button 
              @click="copyToClipboard(generatedPassword)" 
              class="btn btn-secondary btn-copy"
              title="Copy to clipboard"
              aria-label="Copy password to clipboard"
            >
              <span aria-hidden="true">📋</span>
              Copy
            </button>
          </div>
          <small class="success-text">
            ✅ This password satisfies your mask requirements
          </small>
        </div>
        
        <div v-if="generationError" class="error-message" role="alert">
          {{ generationError }}
        </div>
      </section>

      <!-- Examples Section -->
      <section class="card" aria-labelledby="examples-title">
        <h2 id="examples-title" class="card-title">
          <span class="icon">💡</span>
          Example Masks
        </h2>
        
        <div class="examples-grid">
          <button 
            v-for="example in examples" 
            :key="example.mask"
            class="example-item"
            @click="loadExample(example)"
            :aria-label="`Load example mask ${example.mask}: ${example.description}`"
          >
            <div class="example-mask">{{ example.mask }}</div>
            <div class="example-description">{{ example.description }}</div>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { validatePassword, generatePassword, describeMask, DEFAULT_SPECIAL_CHARS } from '../utils/passwordMask.js'

// Reactive data
const mask = ref('10110510128')
const specialCharsInput = ref(DEFAULT_SPECIAL_CHARS.join(''))
const testPassword = ref('')
const targetLength = ref('')
const generatedPassword = ref('')
const maskError = ref('')
const generationError = ref('')
const validationResult = ref(null)

// Computed properties
const specialCharsArray = computed(() => {
  return specialCharsInput.value.split('').filter(char => char.trim() !== '')
})

const maskDescription = computed(() => {
  if (maskError.value) return null
  try {
    return describeMask(mask.value, specialCharsArray.value)
  } catch (error) {
    return null
  }
})

// Example masks
const examples = [
  {
    mask: '10110510128',
    description: 'Uppercase + lowercase allowed, required lowercase + special char, min length 8'
  },
  {
    mask: '11100100109',
    description: 'Only uppercase and lowercase letters, min length 9'
  },
  {
    mask: '00001010015',
    description: 'Only digits 0-5, digit 0 required, min length 5'
  },
  {
    mask: '10010010108',
    description: 'Uppercase + digits 6-9, specific chars required, min length 8'
  },
  {
    mask: '11111111116',
    description: 'All character types allowed with specific requirements, min length 6'
  }
]

// Methods
const validateMask = () => {
  if (!/^\d{11}$/.test(mask.value)) {
    maskError.value = 'Mask must be exactly 11 digits'
  } else {
    maskError.value = ''
  }
  
  // Re-validate test password when mask changes
  if (testPassword.value) {
    validateTestPassword()
  }
}

const validateTestPassword = () => {
  if (!testPassword.value || maskError.value) {
    validationResult.value = null
    return
  }
  
  try {
    validationResult.value = validatePassword(testPassword.value, mask.value, specialCharsArray.value)
  } catch (error) {
    validationResult.value = {
      isValid: false,
      errors: [error.message],
      details: null
    }
  }
}

const generateNewPassword = () => {
  generationError.value = ''
  generatedPassword.value = ''
  
  if (maskError.value) {
    generationError.value = 'Please fix mask errors first'
    return
  }
  
  try {
    const length = targetLength.value || null
    generatedPassword.value = generatePassword(mask.value, specialCharsArray.value, length)
  } catch (error) {
    generationError.value = error.message
  }
}

const loadExample = (example) => {
  mask.value = example.mask
  testPassword.value = ''
  generatedPassword.value = ''
  generationError.value = ''
  validationResult.value = null
  validateMask()
}

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

// Watchers
watch(mask, validateMask, { immediate: true })
watch(specialCharsInput, () => {
  if (testPassword.value) {
    validateTestPassword()
  }
})

// Initialize with example
loadExample(examples[0])
</script>

<style scoped>
.password-mask-tester {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem 1rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
}

.title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: #64748b;
  margin: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

/* Content Layout */
.content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Card Styles */
.card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
}

.icon {
  font-size: 1.25rem;
}

/* Form Styles */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group-inline {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
}

.input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  background: #ffffff;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-mask {
  max-width: 240px;
  text-align: center;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}

.input-number {
  max-width: 140px;
}

.input-success {
  border-color: #10b981;
  background-color: #f0fdf4;
}

.input-error {
  border-color: #ef4444;
  background-color: #fef2f2;
}

.help-text {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.4;
}

.error-message {
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
}

.success-text {
  color: #059669;
  font-weight: 500;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-icon {
  font-size: 1rem;
}

.btn-copy {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

/* Mask Description Styles */
.mask-description {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.description-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.rules-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.rules-section {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.rules-subtitle {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 0.75rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.rules-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.rule-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem 0;
  color: #4b5563;
  line-height: 1.5;
}

.rule-item:not(:last-child) {
  border-bottom: 1px solid #f3f4f6;
}

.rule-bullet {
  color: #3b82f6;
  font-weight: bold;
  flex-shrink: 0;
}

.required-chars {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  flex-wrap: wrap;
}

.required-label {
  color: #065f46;
  font-weight: 600;
  font-size: 0.875rem;
}

.char-list {
  background: rgba(255, 255, 255, 0.8);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1e293b;
  border: 1px solid #e2e8f0;
}

/* Validation Result Styles */
.validation-result {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fafafa;
}

.validation-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.status-valid {
  color: #059669;
}

.status-invalid {
  color: #dc2626;
}

.status-icon {
  font-size: 1.25rem;
}

.errors {
  margin-top: 1rem;
  padding: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.errors-title {
  font-size: 1rem;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 0.75rem 0;
}

.errors-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.25rem 0;
  color: #b91c1c;
  font-size: 0.875rem;
  line-height: 1.5;
}

.error-bullet {
  flex-shrink: 0;
}

.validation-details {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.detail-value {
  color: #4b5563;
  font-size: 0.875rem;
}

/* Generation Controls */
.generation-controls {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.btn-generate {
  align-self: flex-start;
}

/* Generated Password Display */
.generated-password {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
}

.password-display {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.75rem 0;
  flex-wrap: wrap;
}

.password-code {
  flex: 1;
  min-width: 0;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #d1fae5;
  border-radius: 8px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  word-break: break-all;
}

/* Examples Grid */
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.example-item {
  display: block;
  width: 100%;
  padding: 1rem;
  background: #fafafa;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.example-item:hover {
  background: #f1f5f9;
  border-color: #3b82f6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.example-mask {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.example-description {
  color: #6b7280;
  font-size: 0.875rem;
  line-height: 1.4;
}

/* Responsive Design */
@media (min-width: 640px) {
  .generation-controls {
    flex-direction: row;
    align-items: flex-end;
  }
  
  .form-group-inline {
    flex: 0 0 auto;
  }
  
  .password-display {
    flex-wrap: nowrap;
  }
  
  .rules-container {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 768px) {
  .content {
    gap: 2rem;
  }
  
  .card {
    padding: 2.5rem;
  }
  
  .header {
    padding: 3rem 2rem;
  }
}

@media (max-width: 639px) {
  .password-mask-tester {
    padding: 0;
  }
  
  .card {
    margin: 0 -1rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .header {
    margin: 0 -1rem 1.5rem -1rem;
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
  
  .password-code {
    min-width: 100%;
  }
  
  .detail-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .required-chars {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .card {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(71, 85, 105, 0.3);
  }
  
  .title {
    color: #f1f5f9;
  }
  
  .subtitle {
    color: #94a3b8;
  }
  
  .card-title {
    color: #f1f5f9;
    border-color: #475569;
  }
  
  .label {
    color: #e2e8f0;
  }
  
  .input {
    background: #334155;
    border-color: #475569;
    color: #f1f5f9;
  }
  
  .input:focus {
    border-color: #60a5fa;
  }
  
  .help-text {
    color: #94a3b8;
  }
  
  .mask-description {
    background: #1e293b;
    border-color: #475569;
  }
  
  .rules-section {
    background: #334155;
    border-color: #475569;
  }
  
  .rule-item {
    color: #cbd5e1;
  }
  
  .validation-result {
    background: #1e293b;
    border-color: #475569;
  }
  
  .generated-password {
    background: #064e3b;
    border-color: #047857;
  }
  
  .password-code {
    background: #374151;
    border-color: #4b5563;
    color: #f1f5f9;
  }
  
  .example-item {
    background: #334155;
    border-color: #475569;
  }
  
  .example-item:hover {
    background: #475569;
    border-color: #60a5fa;
  }
  
  .example-mask {
    color: #f1f5f9;
  }
  
  .example-description {
    color: #94a3b8;
  }
}

/* Print styles */
@media print {
  .password-mask-tester {
    background: white !important;
  }
  
  .card {
    box-shadow: none !important;
    border: 1px solid #000 !important;
    break-inside: avoid;
  }
  
  .btn {
    display: none !important;
  }
  
  .examples-grid {
    display: none !important;
  }
}
</style> 