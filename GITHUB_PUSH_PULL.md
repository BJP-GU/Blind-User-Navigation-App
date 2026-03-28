# GitHub: pull and push

This project is intended to track the remote repository:

**https://github.com/BJP-GU/Blind-User-Navigation-App.git**

**Local project path (this machine):**  
`/Users/bryceparsons/Desktop/DET/gemini-live-genai-python-sdk`

---

## Pull (get updates from GitHub)

From your project directory (the folder that contains `.git`):

```bash
cd /Users/bryceparsons/Desktop/DET/gemini-live-genai-python-sdk
git pull origin main
```

If your default branch is named `master` instead of `main`, use:

```bash
git pull origin master
```

To see which branch you are on:

```bash
git branch --show-current
```

If you have local changes that conflict with the pull, Git will tell you. Resolve conflicts in the listed files, then:

```bash
git add <resolved-files>
git commit -m "Resolve merge conflicts after pull"
```

---

## Push (send your updates to GitHub)

**Recommended:** pull (or rebase) first so you integrate others’ work and reduce push rejections.

### 1. Pull latest from GitHub

```bash
cd /Users/bryceparsons/Desktop/DET/gemini-live-genai-python-sdk
git pull origin main
```

(Use `master` if that is your default branch.)

### 2. Check what changed locally

```bash
git status
```

### 3. Stage the files you want to include

Stage everything that should go into this commit:

```bash
git add .
```

Or stage specific paths:

```bash
git add path/to/file
```

### 4. Commit with a clear message

```bash
git commit -m "Short description of your changes"
```

If Git says there is nothing to commit, either there are no staged changes or you need to stage files first (`git add`).

### 5. Push to GitHub

```bash
git push origin main
```

(Again, use `master` if that is your branch name.)

---

## First-time setup on this machine

### Clone the repo (if you do not have a copy yet)

```bash
git clone https://github.com/BJP-GU/Blind-User-Navigation-App.git
cd Blind-User-Navigation-App
```

That creates a folder named `Blind-User-Navigation-App`. Your current working copy uses the folder name `gemini-live-genai-python-sdk` at the path above; both are fine as long as `git remote -v` points at this GitHub repo.

### Existing folder: point `origin` at this repo

If the project already exists but `origin` is wrong or missing:

```bash
git remote -v
```

Set or update `origin`:

```bash
git remote add origin https://github.com/BJP-GU/Blind-User-Navigation-App.git
```

If `origin` already exists:

```bash
git remote set-url origin https://github.com/BJP-GU/Blind-User-Navigation-App.git
```

Push the current branch and set upstream (first push from this clone):

```bash
git push -u origin main
```

---

## Authentication

- **HTTPS:** GitHub may prompt for credentials; use a [Personal Access Token](https://github.com/settings/tokens) instead of your account password when asked for a password.
- **SSH:** Use `git@github.com:BJP-GU/Blind-User-Navigation-App.git` as the remote URL if you use SSH keys with GitHub.

---

## Quick reference

| Goal              | Command                    |
|-------------------|----------------------------|
| Update from remote| `git pull origin main`     |
| See local changes | `git status`               |
| Stage all         | `git add .`                |
| Save a snapshot   | `git commit -m "message"`  |
| Upload commits    | `git push origin main`     |

Replace `main` with your actual default branch name if different.
