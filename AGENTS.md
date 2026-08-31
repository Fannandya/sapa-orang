# AGENTS.md

Guide for pushing this project to GitHub, and how to recover when a push fails
(rejected push, diverged history, pull / rebase / merge, conflicts, safe
force-push).

---

## 1. Project snapshot

- Static site: `index.html` + `style.css`. No build step, no dependencies, no
  tests.
- Remote: `origin` → `https://github.com/Fannandya/sapa-orang.git` (HTTPS).
- Default branch: `main`, tracking `origin/main`.
- There is a `backup-before-rebase` branch kept as a safety snapshot. Keep making
  branches like this before risky operations (see section 5).

---

## 2. Standard push workflow

Run these in order from the project root.

```bash
# 1. See what changed locally
git status

# 2. Sync with the remote BEFORE committing/pushing (rebase keeps history linear)
git pull --rebase origin main

# 3. Stage changes
git add -A                 # or: git add index.html style.css

# 4. Commit with a short prefixed message
git commit -m "style: adjust header spacing"

# 5. Push
git push origin main

# 6. Confirm on GitHub
#    https://github.com/Fannandya/sapa-orang
```

### Commit message style

Match the existing history — a type prefix plus a short summary:

- `feat:` new feature / content
- `fix:` bug fix
- `style:` formatting, CSS, markup tweaks (e.g. `style: link stylesheet and add basic centered styling`)
- `chore:` config, housekeeping, docs

---

## 3. First-time setup (authentication)

The remote uses **HTTPS**, so Git asks for a username and password on push. The
password must be a **Personal Access Token (PAT)**, not your GitHub account
password.

### Create a token

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** →
   **Tokens (classic)** → **Generate new token**.
2. Scope: check **`repo`**.
3. Copy the token now — GitHub shows it only once.

### Cache the token so you enter it once

```bash
# Store permanently in ~/.git-credentials (plaintext on disk)
git config --global credential.helper store

# ...or keep it in memory for 1 hour only
git config --global credential.helper 'cache --timeout=3600'
```

Then push once and enter:

- Username: `Fannandya`
- Password: *paste the PAT*

### Prefer SSH instead?

```bash
git remote set-url origin git@github.com:Fannandya/sapa-orang.git
# Requires an SSH key added to GitHub: https://github.com/settings/keys
```

---

## 4. Troubleshooting: push was rejected

### 4.1 `! [rejected] main -> main (non-fast-forward)` / `(fetch first)`

**Cause:** `origin/main` has commits that your local `main` does not. Git refuses
to overwrite them.

**Fix:**

```bash
git pull --rebase origin main
git push origin main
```

**`--rebase` vs plain merge pull:**

| Command | Result |
| --- | --- |
| `git pull --rebase origin main` | Your local commits are replayed on top of the remote ones. Linear history, no merge commit. **Preferred here.** |
| `git pull --no-rebase origin main` | Creates a merge commit joining the two histories. Works, but messier log. |

Make rebase the default so `git pull` always does the right thing:

```bash
git config --global pull.rebase true
```

### 4.2 Rebase stops with a conflict

You'll see `CONFLICT (content): Merge conflict in style.css` and
`git status` lists the file under "Unmerged paths".

```bash
# 1. See which files conflict
git status

# 2. Open each file, find the conflict markers, keep the correct version:
#    <<<<<<< HEAD
#    (version already on the remote)
#    =======
#    (your version)
#    >>>>>>> your commit message
#    Delete the markers and leave the final desired content.

# 3. Mark each resolved file
git add style.css

# 4. Continue the rebase
git rebase --continue

# 5. When the rebase finishes
git push origin main
```

**Bail out** and return to how things were before the pull:

```bash
git rebase --abort
```

### 4.3 Merge conflict (if you used a merge pull instead of rebase)

Same resolve loop, but you finish with a commit instead of `--continue`:

```bash
git status
# ...resolve files...
git add <file>
git commit                 # accepts the default merge message
git push origin main
```

Bail out:

```bash
git merge --abort
```

### 4.4 `hint: You have divergent branches and need to specify how to reconcile them`

Git doesn't know whether to rebase or merge on pull. Set it once:

```bash
git config --global pull.rebase true
git pull origin main
```

### 4.5 "detached HEAD" after a confusing rebase

You're not on a branch. Get back:

```bash
git switch main            # or: git checkout main
```

If you did useful work while detached, create a branch from it first:
`git branch rescue-work` before switching.

### 4.6 `Updates were rejected because the remote contains work that you do not have` on a brand-new repo

The GitHub repo was created with a README/license and your local repo doesn't
have it.

```bash
git pull --rebase origin main --allow-unrelated-histories
git push origin main
```

---

## 5. Safety net: back up before risky operations

Before any `rebase`, `reset --hard`, or force-push:

```bash
git branch backup-$(date +%Y%m%d-%H%M)
```

This creates a local branch pointing at your current commit. It costs nothing and
is the fastest way to undo a mistake.

**Restore from a backup branch:**

```bash
git switch main
git reset --hard backup-20260831-1200      # use the branch name you created
```

List your backup branches:

```bash
git branch --list 'backup-*'
```

---

## 6. Force-push (last resort)

Only needed when you **rewrote history that was already pushed** (e.g. an
interactive rebase, an amended commit, a `reset --hard` to an older commit).

```bash
# 1. Back up first (section 5)
git branch backup-$(date +%Y%m%d-%H%M)

# 2. Force-push safely
git push --force-with-lease origin main
```

- `--force-with-lease` refuses the push if someone else pushed to `origin/main`
  since your last fetch — it protects other people's work.
- **Never** use bare `git push --force` on a shared branch.

---

## 7. Quick reference

| Situation | Command |
| --- | --- |
| See what changed | `git status` |
| Sync before pushing | `git pull --rebase origin main` |
| Push | `git push origin main` |
| Push rejected (non-fast-forward) | `git pull --rebase origin main && git push origin main` |
| Conflict during rebase | resolve → `git add <file>` → `git rebase --continue` |
| Abort a rebase | `git rebase --abort` |
| Abort a merge | `git merge --abort` |
| Undo last commit, keep changes staged | `git reset --soft HEAD~1` |
| Discard all uncommitted changes | `git restore .` (add `git clean -fd` for new files) |
| Snapshot before risky work | `git branch backup-$(date +%Y%m%d-%H%M)` |
| Safe force-push | `git push --force-with-lease origin main` |
| Inspect local vs remote | `git fetch && git log --oneline --graph --all -15` |
| Set rebase as default pull | `git config --global pull.rebase true` |
