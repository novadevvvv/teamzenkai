const state = {
  users: [],
  activeUser: null,
};

const els = {
  loginCard: document.getElementById("loginCard"),
  panelCard: document.getElementById("panelCard"),
  loginForm: document.getElementById("loginForm"),
  loginMessage: document.getElementById("loginMessage"),
  loginButton: document.getElementById("loginButton"),
  username: document.getElementById("username"),
  password: document.getElementById("password"),
  displayName: document.getElementById("displayName"),
  roleValue: document.getElementById("roleValue"),
  lastLoginValue: document.getElementById("lastLoginValue"),
  notesValue: document.getElementById("notesValue"),
  logoutButton: document.getElementById("logoutButton"),
};

async function loadUsers() {
  try {
    const response = await fetch("./users.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Could not load user database.");
    }

    const data = await response.json();
    state.users = Array.isArray(data.users) ? data.users : [];
  } catch (error) {
    setMessage(error.message || "Unable to initialize login panel.");
    state.users = [];
  }
}

function setMessage(text, tone = "error") {
  els.loginMessage.textContent = text;
  els.loginMessage.style.color = tone === "success" ? "#0f7a4e" : "#9a2f2f";
}

function showPanel(user) {
  els.displayName.textContent = user.displayName || user.username;
  els.roleValue.textContent = user.role || "Unknown";
  els.lastLoginValue.textContent = new Date().toLocaleString();
  els.notesValue.textContent = user.notes || "No notes available.";

  els.loginCard.classList.add("hidden");
  els.panelCard.classList.remove("hidden");
}

function showLogin() {
  els.panelCard.classList.add("hidden");
  els.loginCard.classList.remove("hidden");
  els.loginForm.reset();
  setMessage("");
}

function findUser(username, password) {
  return state.users.find((user) => {
    return user.username === username && user.password === password;
  });
}

function onLoginSubmit(event) {
  event.preventDefault();

  const username = els.username.value.trim();
  const password = els.password.value;

  if (!username || !password) {
    setMessage("Enter both username and password.");
    return;
  }

  const user = findUser(username, password);
  if (!user) {
    setMessage("Invalid username or password.");
    return;
  }

  state.activeUser = user;
  sessionStorage.setItem("teamzenkai-auth", user.username);
  setMessage("Login successful.", "success");
  showPanel(user);
}

function restoreSession() {
  const rememberedUser = sessionStorage.getItem("teamzenkai-auth");
  if (!rememberedUser) {
    return;
  }

  const user = state.users.find((entry) => entry.username === rememberedUser);
  if (user) {
    state.activeUser = user;
    showPanel(user);
  }
}

function logout() {
  state.activeUser = null;
  sessionStorage.removeItem("teamzenkai-auth");
  showLogin();
}

async function init() {
  els.loginButton.disabled = true;
  setMessage("Loading account data...", "success");
  await loadUsers();
  els.loginButton.disabled = false;

  if (state.users.length === 0) {
    setMessage("No users available in users.json.");
  } else {
    setMessage("");
  }

  restoreSession();
}

els.loginForm.addEventListener("submit", onLoginSubmit);
els.logoutButton.addEventListener("click", logout);

init();
