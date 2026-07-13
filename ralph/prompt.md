# ISSUES

Open issues from GitHub (label `ready-for-agent`) are provided at start of context as `## Issue #N: <title>` blocks, each with its full body (including any "Blocked by" list). Parse them to understand the open work.

Only work on issues labeled `ready-for-agent` — that is the AFK-ready set. Skip any issue whose "Blocked by" list references another issue number that is still open.

You've also been passed a file containing the last few commits. Review these to understand what work has been done.

If all AFK-ready issues are complete or blocked, output <promise>NO MORE TASKS</promise>.

# TASK SELECTION

Pick the next task. Prioritize tasks in this order:

1. Critical bugfixes
2. Development infrastructure

Getting development infrastructure like tests and types and dev scripts ready is an important precursor to building features.

3. Tracer bullets for new features

Tracer bullets are small slices of functionality that go through all layers of the system, allowing you to test and validate your approach early. This helps in identifying potential issues and ensures that the overall architecture is sound before investing significant time in development.

TL;DR - build a tiny, end-to-end slice of the feature first, then expand it out.

4. Polish and quick wins
5. Refactors

# EXPLORATION

Explore the repo.

# IMPLEMENTATION

Use /tdd to complete the task.

# FEEDBACK LOOPS

The app lives at the repo root — plain Node (`http` module, no framework), `better-sqlite3` as the only dependency, plain HTML/CSS/JS on the front end. No build step, no TypeScript, no Next.js, no Supabase. Before committing:

- Start the server (`node server.js`) and manually verify the change in a browser.
- If a test script exists in `package.json`, run `npm test`.

# COMMIT

Make a git commit. The commit message must:

1. Include key decisions made
2. Include files changed
3. Blockers or notes for next iteration
4. Reference the issue (e.g. `Refs #N`)

# THE ISSUE

If the task is complete, close the GitHub issue with a summary comment:

`gh issue close <N> --comment "<summary of what was built and how it was verified>"`

If the task is not complete, leave it open and record progress instead:

`gh issue comment <N> --body "<what was done, what's left, any blockers>"`

# FINAL RULES

ONLY WORK ON A SINGLE TASK.
