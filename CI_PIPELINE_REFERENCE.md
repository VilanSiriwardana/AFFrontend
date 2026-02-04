# CI/CD Hardening & Quality Gates: Reference Guide

**Date:** February 2026
**Project:** React Country Search App (Frontend)
**Objective:** Implement a robust, "Fail-Fast" CI pipeline using Jenkins, ESLint, and Jest.

---

## 1. What We Did: "Fail-Fast" Architecture
We restructured the CI pipeline to execute in a strict sequence where **failing any step immediately halts the process**.

### **Pipeline Stages**
1.  **Checkout & Install**: Uses `npm ci` for exact, deterministic dependency installation.
2.  **Lint (New)**: Runs `eslint src`. Fails fast if any syntax errors or bad patterns (e.g., unused vars) are found.
3.  **Test (New)**: Runs `npm test -- --ci`. Fails if any unit tests break.
4.  **Build**: Compiles the React app (`npm run build`). Skipped if previous steps fail.
5.  **Deploy**: Uses `deploy.sh` to deploy via Docker.
    *   **Dev**: Port 3001
    *   **Staging**: Port 3002
    *   **Prod**: Port 3000

---

## 2. Why We Did It

| Problem | Solution | Benefit |
| :--- | :--- | :--- |
| **Silent Failures** | Code with "warnings" was being deployed. | **Strict Linting**: Promoted specific warnings (like unused vars) to Errors. |
| **Wasted Resources** | Docker images were being built even if tests failed. | **Stage Ordering**: Lint/Test runs *before* Build. Saves CPU/Time. |
| **"It works on my machine"** | Dependencies were inconsistent between Local & Jenkins. | **`npm ci`**: Forces Jenkins to respect `package-lock.json` exactly. |
| **Brittle Tests** | Tests lacked Redux context and failed on ESM imports. | **Better Test setup**: Added global mocks and Providers. |

---

## 3. How We Did It (Technical Implementation)

### **A. ESLint Configuration (`eslint.config.mjs`)**
We replaced the legacy config with a modern **Flat Config**.
*   **Key setting**: `"no-unused-vars": "error"`
*   **Why**: This is the "Fail-Fast" trigger. It forces the pipeline to break on messy code.

### **B. Jest Test Setup (`src/setupTests.js`)**
React scripts use Jest, which struggles with modern ESM modules like `axios`.
*   **Fix**: Created `setupTests.js` to manually mock `axios`.
*   **Code**:
    ```javascript
    jest.mock('axios', () => ({
      create: () => ({ interceptors: { request: { use: jest.fn() }, ... } }),
      get: jest.fn(),
      post: jest.fn()
    }));
    ```

### **C. Redux Testing Wrapper**
Components connected to Redux cannot be tested in isolation.
*   **Fix**: Wrapped test renders in `<Provider store={store}>`.
*   **Example**: `src/tests/CountryCard.test.js`

### **D. Jenkinsfile Updates**
*   **Split Stages**: Removed the single "Test & Build" stage and split it into three discrete stages: `Lint`, `Test`, `Build`.
*   **Command**: `sh 'npm run lint'`
*   **Command**: `sh 'npm test -- --ci'`

---

## 4. Troubleshooting Reference

### **Common Error: `npm ci` fails**
*   **Cause**: `package.json` and `package-lock.json` are out of sync.
*   **Fix**: Run `npm install` locally, verify no changes, then commit the updated `package-lock.json`.

### **Common Error: "Cannot use import statement outside a module"**
*   **Cause**: Jest trying to parse an ESM library (like `axios`) as CommonJS.
*   **Fix**: Do not try to configure Babel manually. Instead, **mock the library** in `src/setupTests.js`.

### **Common Error: "Could not find react-redux context"**
*   **Cause**: Testing a component that uses `useSelector` or `useDispatch` without a Redux Store.
*   **Fix**: Wrap the component in `render(<Provider store={store}><Component /></Provider>)`.
