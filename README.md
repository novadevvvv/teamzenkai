# Team Zenkai GitHub Pages Login Panel

This is a GitHub Pages-friendly static website with:

- A login panel (`index.html`)
- Credential records stored in an internal JSON file (`users.json`) using salted PBKDF2 hashes
- A simple protected panel shown after successful login (`app.js`)

## Important Security Note

Because this is a fully static site, all files are delivered to the browser, including `users.json`.
Passwords are now stored as salted PBKDF2 hashes (not plaintext), but this is still client-side authentication.
This setup is suitable for demos, prototypes, or low-risk internal tooling.

For real authentication, use a backend service with server-side sessions/tokens.

## Local Preview

Open `index.html` in a static server context.

Examples:

```powershell
# Python 3
python -m http.server 8080
```

Then open <http://localhost:8080>.

## GitHub Pages Deploy

1. Push this folder to a GitHub repository.
2. In repository settings, enable Pages.
3. Set source to `Deploy from a branch` and choose your branch/root.
4. Visit the generated Pages URL.

## User Record Format

Each user should include these credential fields:

- `salt` (base64)
- `passwordHash` (base64)
- `iterations` (number)

The app verifies login by deriving a PBKDF2-SHA256 hash in the browser and comparing it to `passwordHash`.
