# AI-Assisted Development Workflow: Antigravity & Jules

This guide explains how to effectively "Vibe Code" using Google's suite of AI agents: **Antigravity** (IDE-integrated) and **Jules** (Repo-native).

## The Roles

| Feature | **Antigravity** (My Role) | **Jules** (Google's Repo Agent) |
| :--- | :--- | :--- |
| **Location** | Inside VS Code (Local Environment) | GitHub/GitLab (Cloud Repo) |
| **Best For** | "Fast Loop" Development | "Slow Loop" Maintenance |
| **Tasks** | • Building features live<br>• Debugging runtime errors<br>• Refactoring active files<br>• Running commands (`npm run dev`) | • Code Reviews on PRs<br>• Dependency updates<br>• Writing test suites<br>• Migrating legacy code |
| **Context** | Has access to your running terminal, open files, and local DB. | Has access to the entire commit history and PR comments. |

## The "Vibe Coding" Workflow

1.  **Start with Antigravity (Planning & MVP)**
    *   Use me to scaffold features, run the server, and fix immediate bugs.
    *   *Example*: "Build the Workout API and make sure it compiles."

2.  **Push to GitHub**
    *   Once a feature is working locally (e.g., "Day 9 Complete"), commit and push.
    *   `git push origin feature/workout-api`

3.  **Assign Jules (Refinement & Safety)**
    *   Open a Pull Request on GitHub.
    *   Tag `@jules` to review the code.
    *   *Prompt for Jules*: "Review this PR for security vulnerabilities, specifically checking if Server Actions validate input using Zod."
    *   *Prompt for Jules*: "Generate a Jest test suite for `lib/services/workouts.ts` covering edge cases."

4.  **Merge & deployments**
    *   Jules approves the PR or pushes fixes directly.
    *   You merge the cleanup code into `main`.

## Usage Rules for Success

*   **Don't Duplicate**: Don't ask Jules to "debug why localhost:3000 isn't working"—it can't see your local server. Ask me (Antigravity) instead.
*   **Do Delegate**: Don't ask me to "write 50 unit tests for the entire project" if you don't want to wait. Push the code and ask Jules to do it asynchronously.
*   **Security Check**: Always have Jules review your PRs for common CVEs before merging to production.
