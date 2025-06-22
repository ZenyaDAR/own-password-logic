<script setup>
import PasswordMaskTester from './components/PasswordMaskTester.vue'
</script>

<template>
  <main id="app">
    <PasswordMaskTester />
  </main>
</template>

<style>
/* CSS Reset and Base Styles */
*, *::before, *::after {
  box-sizing: border-box;
}

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #2c3e50;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* Remove default button styles */
button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* Improve readability */
h1, h2, h3, h4, h5, h6 {
  line-height: 1.2;
  margin-top: 0;
}

/* Responsive images */
img {
  max-width: 100%;
  height: auto;
}

/* Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
