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
*   **Agent Label**: Updated to `label 'built-in || master || Jenkins'` to ensure the pipeline runs on a Linux-compatible node (the Jenkins controller) and avoids Windows nodes that lack proper Docker socket mapping.
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

---

## 5. Branch-Based Deployment Strategy

We utilize a **Multibranch Pipeline** to support three distinct environments running simultaneously.

### **Environment Configuration**

| Branch | Environment | Port | URL (Local) | Docker Container Name | Config Source (Jenkins Credential) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `dev` | **Development** | `:3001` | `http://localhost:3001` | `af-frontend-dev` | `env-file-dev` |
| `staging` | **Staging** | `:3002` | `http://localhost:3002` | `af-frontend-staging` | `env-file-staging` |
| `main` | **Production** | `:3000` | `http://localhost:3000` | `af-frontend` | `env-file-prod` |


## 6. Secure Environment Configuration (Secrets Management)

We have migrated from hardcoded secrets to **Secret File Injection**.

### **How it works:**
1.  **No Secrets in Code**: The repo contains NO `.env` files.
2.  **Jenkins Credentials**: We store the entire `.env` content as a **Secret File** in Jenkins.
3.  **Pipeline Injection**:
    *   The `Jenkinsfile` detects the branch (e.g., `main`).
    *   It securely downloads the corresponding secret file (e.g., `env-file-prod`).
    *   It temporarily saves it as `.env` in the workspace.
4.  **Build Process**:
    *   Docker copies this `.env` file (`COPY .env* ./`).
    *   `npm run build` uses it to "bake" the variables into the React build.

### **How to add a new Variable:**
You do NOT need to edit `Jenkinsfile` or `Dockerfile`.
1.  Add the variable to your local `.env.dev` / `.env.prod` file.
2.  Go to Jenkins -> Credentials -> Update `env-file-dev` (or prod).
3.  Upload the updated file.
4.  Re-run the build.

### **The Deployment Script (`deploy.sh`)**
The `deploy.sh` script is the engine behind this isolation. It accepts two arguments: `ENVIRONMENT` and `PORT`.

**Key features:**
1.  **Conflict Resolution**: It checks if the target port is in use. If so, it forcibly removes the conflicting container.
2.  **Idempotency**: It cleans up old containers of the same name before starting a new one.
3.  **Naming Convention**: Containers are suffixed (e.g., `-dev`, `-staging`) to avoid collisions.

### **Jenkinsfile Logic**
The pipeline uses `when` conditionals to trigger the correct deployment:

```groovy
stage('Deploy Development') {
    when { branch 'dev' }
    steps { sh "./deploy.sh dev 3001" }
}
```
