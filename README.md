# Team Zenkai GitHub Pages Login Panel

This is a GitHub Pages-friendly static website with:

- A login panel (`index.html`)
- Credential records stored in an internal JSON file (`users.json`)
- A simple protected panel shown after successful login (`app.js`)

## Important Security Note

Because this is a fully static site, all files are public in the browser, including `users.json`.
This setup is suitable only for demos, prototypes, or non-sensitive internal mockups.

For real authentication, use a backend service and never store passwords in a public client repo.

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

## Default Demo Accounts

- `admin` / `admin123`
- `analyst` / `zenkai456`
