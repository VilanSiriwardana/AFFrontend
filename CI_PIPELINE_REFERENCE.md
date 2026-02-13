# CI/CD Hardening & Quality Gates: Reference Guide

**Date:** February 2026
**Project:** React Country Search App (Frontend)
**Objective:** Implement a robust, "Fail-Fast" CI pipeline using Jenkins, ESLint, and Jest, deploying to DirectAdmin shared hosting.

---

## 1. What We Did: "Fail-Fast" Architecture
We restructured the CI pipeline to execute in a strict sequence where **failing any step immediately halts the process**.

### **Pipeline Stages**
1.  **Checkout & Install**: Uses `npm ci` for exact, deterministic dependency installation.
2.  **Lint**: Runs `eslint src`. Fails fast if any syntax errors or bad patterns are found.
3.  **Test**: Runs `npm test -- --ci`. Fails if any unit tests break.
4.  **Build**: Compiles the React app (`npm run build`).
5.  **Deploy (SFTP)**: Deploys static files to DirectAdmin shared hosting.
    *   **Target**: `domains/test.invoiceflow.nl/public_html`
    *   **Method**: `sshpass` + `sftp` (Strict SFTP mode, no shell required)

---

## 2. Why We Did It

| Problem | Solution | Benefit |
| :--- | :--- | :--- |
| **Silent Failures** | Code with "warnings" was being deployed. | **Strict Linting**: Promoted specific warnings (like unused vars) to Errors. |
| **Docker Not Allowed** | Host environment (DirectAdmin) doesn't support Docker. | **SFTP Deployment**: Direct upload of static assets to the web root. |
| **"It works on my machine"** | Dependencies were inconsistent between Local & Jenkins. | **`npm ci`**: Forces Jenkins to respect `package-lock.json` exactly. |
| **No Shell Access** | Server blocks SSH shell sessions (`exec request failed`). | **Strict SFTP**: Uses `sftp` batch commands which don't require the shell subsystem. |

---

## 3. Technical Implementation

### **A. ESLint Configuration (`eslint.config.mjs`)**
Modern Flat Config used to trigger "Fail-Fast" on messy code.

### **B. Jest Test Setup (`src/setupTests.js`)**
Manually mock `axios` and other ESM modules to ensure test stability in the CI environment.

### **C. Jenkinsfile SFTP Deployment**
The pipeline now uses `sshpass` to authenticate with the SFTP server using `sftp` in batch mode (via heredoc).

**Key Logic:**
```groovy
withCredentials([usernamePassword(credentialsId: 'invoiceflow-sftp', ...)]) {
    sh """
        sshpass -p "${SFTP_PASS}" sftp -o StrictHostKeyChecking=no ${SFTP_USER}@${HOST} <<EOF
        cd domains/test.invoiceflow.nl/public_html
        put -r build/*
        bye
EOF
    """
}
```

---

## 4. Branch-Based Deployment Strategy

| Branch | Environment | Target Path | Config Source |
| :--- | :--- | :--- | :--- |
| `dev` | **Development** | `domains/test.invoiceflow.nl/public_html` | `env-file-dev` |
| `staging` | **Staging** | `domains/test.invoiceflow.nl/public_html` | `env-file-staging` |
| `main` | **Production** | `domains/test.invoiceflow.nl/public_html` | `env-file-prod` |

*Note: All branches currently deploy to the test domain as per initial refactor requirements.*

---

## 5. Secure Environment Configuration (Secrets Management)

1.  **Secret File Injection**: `.env` content is stored as a Secret File in Jenkins.
2.  **Pipeline Injection**: The `Jenkinsfile` detects the branch and downloads the matching secret file.
3.  **Build Process**: `npm run build` uses the injected `.env` to bake variables into the React artifacts.

---

## 6. Removed Components (Legacy Docker Architecture)

The following components have been removed to accommodate the shared hosting environment:
*   `Dockerfile`: No longer building container images.
*   `deploy.sh`: Replaced by native SFTP logic in Jenkinsfile.
*   `nginx/`: Nginx configuration is now handled by the DirectAdmin host.
*   `Docker Build` stage in Jenkinsfile.
*   Container-based port mapping (3000/3001/3002).
