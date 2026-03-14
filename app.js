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
  homeRoleValue: document.getElementById("homeRoleValue"),
  lastLoginValue: document.getElementById("lastLoginValue"),
  notesValue: document.getElementById("notesValue"),
  logoutButton: document.getElementById("logoutButton"),
  navButtons: document.querySelectorAll(".nav-item"),
  sections: document.querySelectorAll("[data-section-view]"),
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

function disableLogin(reason) {
  els.loginButton.disabled = true;
  els.username.disabled = true;
  els.password.disabled = true;
  setMessage(reason);
}

function showPanel(user) {
  els.displayName.textContent = user.displayName || user.username;
  els.roleValue.textContent = user.role || "Unknown";
  els.homeRoleValue.textContent = user.role || "Unknown";
  els.lastLoginValue.textContent = new Date().toLocaleString();
  els.notesValue.textContent = user.notes || "No notes available.";

  els.loginCard.classList.add("hidden");
  els.panelCard.classList.remove("hidden");
  setActiveSection("home");
}

function showLogin() {
  els.panelCard.classList.add("hidden");
  els.loginCard.classList.remove("hidden");
  els.loginForm.reset();
  setMessage("");
}

function setActiveSection(sectionName) {
  els.navButtons.forEach((button) => {
    const isActive = button.dataset.section === sectionName;
    button.classList.toggle("active", isActive);
  });

  els.sections.forEach((section) => {
    const shouldShow = section.dataset.sectionView === sectionName;
    section.classList.toggle("hidden", !shouldShow);
  });
}

function onSectionClick(event) {
  const selectedSection = event.currentTarget.dataset.section;
  if (!selectedSection) {
    return;
  }

  setActiveSection(selectedSection);
}

function decodeBase64(base64Value) {
  const binary = atob(base64Value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function toBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function derivePasswordHash(password, saltBase64, iterations) {
  const encoder = new TextEncoder();
  const passwordBytes = encoder.encode(password);
  const saltBytes = decodeBase64(saltBase64);
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBytes,
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return toBase64(new Uint8Array(bits));
}

async function verifyUserPassword(user, password) {
  if (typeof user.password === "string") {
    return user.password === password;
  }

  if (!user || !user.salt || !user.passwordHash || !user.iterations) {
    return false;
  }

  const derived = await derivePasswordHash(password, user.salt, user.iterations);
  return derived === user.passwordHash;
}

async function findUser(username, password) {
  const user = state.users.find((entry) => entry.username === username);
  if (!user) {
    return null;
  }

  const isValid = await verifyUserPassword(user, password);
  return isValid ? user : null;
}

async function onLoginSubmit(event) {
  event.preventDefault();

  const username = els.username.value.trim();
  const password = els.password.value;

  if (!username || !password) {
    setMessage("Enter both username and password.");
    return;
  }

  try {
    const user = await findUser(username, password);
    if (!user) {
      setMessage("Invalid username or password.");
      return;
    }

    state.activeUser = user;
    sessionStorage.setItem("teamzenkai-auth", user.username);
    setMessage("Login successful.", "success");
    showPanel(user);
  } catch (error) {
    setMessage(error.message || "Login check failed. Use HTTPS or localhost static server.");
  }
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
  if (location.protocol === "file:") {
    disableLogin("This page cannot authenticate from file://. Start a local server and open http://localhost.");
    return;
  }

  if (!window.crypto || !window.crypto.subtle) {
    disableLogin("Secure crypto is unavailable in this browser context. Use HTTPS or localhost.");
    return;
  }

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
els.navButtons.forEach((button) => {
  button.addEventListener("click", onSectionClick);
});

init();
