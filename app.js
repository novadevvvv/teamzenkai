const state = {
  users: [],
  activeUser: null,
  compensationStep: 1,
  maintenanceEnabled: false,
  toastTimer: null,
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
  profileToggle: document.getElementById("profileToggle"),
  profileMenu: document.getElementById("profileMenu"),
  profileUsername: document.getElementById("profileUsername"),
  profileMenuUsername: document.getElementById("profileMenuUsername"),
  logoutButton: document.getElementById("logoutButton"),
  navButtons: document.querySelectorAll(".nav-item"),
  sections: document.querySelectorAll("[data-section-view]"),
  compensationForm: document.getElementById("compensationForm"),
  compSteps: document.querySelectorAll(".comp-step"),
  compUserInput: document.getElementById("compUserInput"),
  compTypeSelect: document.getElementById("compTypeSelect"),
  compCurrencyFields: document.getElementById("compCurrencyFields"),
  compCurrencySelect: document.getElementById("compCurrencySelect"),
  compCurrencyAmount: document.getElementById("compCurrencyAmount"),
  compCharacterFields: document.getElementById("compCharacterFields"),
  compCharacterSelect: document.getElementById("compCharacterSelect"),
  compCharacterAmount: document.getElementById("compCharacterAmount"),
  compResultMessage: document.getElementById("compResultMessage"),
  compNextToType: document.getElementById("compNextToType"),
  compBackToUser: document.getElementById("compBackToUser"),
  compNextToDetails: document.getElementById("compNextToDetails"),
  compBackToType: document.getElementById("compBackToType"),
  compNextToReview: document.getElementById("compNextToReview"),
  compBackToDetails: document.getElementById("compBackToDetails"),
  reviewUsername: document.getElementById("reviewUsername"),
  reviewType: document.getElementById("reviewType"),
  reviewSelection: document.getElementById("reviewSelection"),
  reviewAmount: document.getElementById("reviewAmount"),
  maintenanceStatusValue: document.getElementById("maintenanceStatusValue"),
  maintenanceToggleButton: document.getElementById("maintenanceToggleButton"),
  toast: document.getElementById("toast"),
};

function showToast(message) {
  if (!els.toast) {
    return;
  }

  if (state.toastTimer) {
    clearTimeout(state.toastTimer);
  }

  els.toast.textContent = message;
  els.toast.classList.remove("hidden");

  state.toastTimer = setTimeout(() => {
    els.toast.classList.add("hidden");
    state.toastTimer = null;
  }, 2200);
}

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
  els.displayName.textContent = user.username;
  els.profileUsername.textContent = user.username;
  els.profileMenuUsername.textContent = user.username;
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
  closeProfileMenu();
  setMessage("");
}

function openProfileMenu() {
  els.profileMenu.classList.remove("hidden");
  els.profileToggle.setAttribute("aria-expanded", "true");
}

function closeProfileMenu() {
  els.profileMenu.classList.add("hidden");
  els.profileToggle.setAttribute("aria-expanded", "false");
}

function toggleProfileMenu() {
  if (els.profileMenu.classList.contains("hidden")) {
    openProfileMenu();
    return;
  }
  closeProfileMenu();
}

function onDocumentClick(event) {
  if (!els.profileMenu || !els.profileToggle) {
    return;
  }

  const clickedInsideMenu = els.profileMenu.contains(event.target);
  const clickedToggle = els.profileToggle.contains(event.target);
  if (!clickedInsideMenu && !clickedToggle) {
    closeProfileMenu();
  }
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

  if (sectionName === "compensation") {
    resetCompensationWizard();
  }
}

function onSectionClick(event) {
  const selectedSection = event.currentTarget.dataset.section;
  if (!selectedSection) {
    return;
  }

  setActiveSection(selectedSection);
}

function setCompensationMessage(text, tone = "error") {
  if (!els.compResultMessage) {
    return;
  }

  els.compResultMessage.textContent = text;
  els.compResultMessage.style.color = tone === "success" ? "#0f7a4e" : "#9a2f2f";
}

function updateCompensationTypeFields() {
  const selectedType = els.compTypeSelect.value;
  const isCurrency = selectedType === "currency";
  const isCharacter = selectedType === "character";

  els.compCurrencyFields.classList.toggle("hidden", !isCurrency);
  els.compCharacterFields.classList.toggle("hidden", !isCharacter);

  els.compCurrencySelect.required = isCurrency;
  els.compCurrencyAmount.required = isCurrency;
  els.compCharacterSelect.required = isCharacter;
  els.compCharacterAmount.required = isCharacter;
}

function showCompensationStep(stepNumber) {
  state.compensationStep = stepNumber;
  els.compSteps.forEach((step) => {
    const isCurrent = Number(step.dataset.step) === stepNumber;
    step.classList.toggle("hidden", !isCurrent);
  });
}

function resetCompensationWizard() {
  if (!els.compensationForm) {
    return;
  }

  els.compensationForm.reset();
  setCompensationMessage("");
  updateCompensationTypeFields();
  showCompensationStep(1);
}

function nextToTypeStep() {
  const userValue = els.compUserInput.value.trim();
  if (!userValue) {
    setCompensationMessage("Enter a user before continuing.");
    return;
  }

  setCompensationMessage("");
  showCompensationStep(2);
}

function nextToDetailsStep() {
  const selectedType = els.compTypeSelect.value;
  if (!selectedType) {
    setCompensationMessage("Select type before continuing.");
    return;
  }

  setCompensationMessage("");
  updateCompensationTypeFields();
  showCompensationStep(3);
}

function nextToReviewStep() {
  const selectedType = els.compTypeSelect.value;

  if (selectedType === "currency") {
    const currency = els.compCurrencySelect.value;
    const amount = Number(els.compCurrencyAmount.value);
    if (!currency || !Number.isFinite(amount) || amount <= 0) {
      setCompensationMessage("Choose a currency and enter a valid amount.");
      return;
    }
  }

  if (selectedType === "character") {
    const character = els.compCharacterSelect.value;
    const amount = Number(els.compCharacterAmount.value);
    if (!character || !Number.isFinite(amount) || amount <= 0) {
      setCompensationMessage("Choose a character and enter a valid amount.");
      return;
    }
  }

  const username = els.compUserInput.value.trim();
  let selection = "";
  let amountText = "";

  if (selectedType === "currency") {
    selection = els.compCurrencySelect.value;
    amountText = String(Number(els.compCurrencyAmount.value));
  } else {
    selection = els.compCharacterSelect.value;
    amountText = String(Number(els.compCharacterAmount.value));
  }

  els.reviewUsername.textContent = username;
  els.reviewType.textContent = selectedType;
  els.reviewSelection.textContent = selection;
  els.reviewAmount.textContent = amountText;

  setCompensationMessage("");
  showCompensationStep(4);
}

function onCompensationSubmit(event) {
  event.preventDefault();

  const userValue = els.compUserInput.value.trim();
  const selectedType = els.compTypeSelect.value;

  if (!userValue || !selectedType) {
    setCompensationMessage("Complete all previous steps first.");
    return;
  }

  if (selectedType === "currency") {
    const currency = els.compCurrencySelect.value;
    const amount = Number(els.compCurrencyAmount.value);
    if (!currency || !Number.isFinite(amount) || amount <= 0) {
      setCompensationMessage("Choose a currency and enter a valid amount.");
      return;
    }

    setCompensationMessage(
      `Submitted: ${userValue} receives ${amount} ${currency}.`,
      "success"
    );
    showToast("Compensation Successful");
    return;
  }

  if (selectedType === "character") {
    const character = els.compCharacterSelect.value;
    const amount = Number(els.compCharacterAmount.value);
    if (!character || !Number.isFinite(amount) || amount <= 0) {
      setCompensationMessage("Choose a character and enter a valid amount.");
      return;
    }

    setCompensationMessage(
      `Submitted: ${userValue} receives ${amount} of ${character}.`,
      "success"
    );
    showToast("Compensation Successful");
    return;
  }

  setCompensationMessage("Invalid compensation type selected.");
}

function updateMaintenanceUI() {
  if (!els.maintenanceStatusValue || !els.maintenanceToggleButton) {
    return;
  }

  if (state.maintenanceEnabled) {
    els.maintenanceStatusValue.textContent = "Enabled";
    els.maintenanceToggleButton.textContent = "Disable Maintenance";
    return;
  }

  els.maintenanceStatusValue.textContent = "Disabled";
  els.maintenanceToggleButton.textContent = "Enable Maintenance";
}

function toggleMaintenance() {
  state.maintenanceEnabled = !state.maintenanceEnabled;
  updateMaintenanceUI();
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
  closeProfileMenu();
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
els.profileToggle.addEventListener("click", toggleProfileMenu);
document.addEventListener("click", onDocumentClick);
els.navButtons.forEach((button) => {
  button.addEventListener("click", onSectionClick);
});

if (els.compensationForm) {
  els.compNextToType.addEventListener("click", nextToTypeStep);
  els.compBackToUser.addEventListener("click", () => showCompensationStep(1));
  els.compNextToDetails.addEventListener("click", nextToDetailsStep);
  els.compBackToType.addEventListener("click", () => showCompensationStep(2));
  els.compNextToReview.addEventListener("click", nextToReviewStep);
  els.compBackToDetails.addEventListener("click", () => showCompensationStep(3));
  els.compTypeSelect.addEventListener("change", updateCompensationTypeFields);
  els.compensationForm.addEventListener("submit", onCompensationSubmit);
  updateCompensationTypeFields();
}

if (els.maintenanceToggleButton) {
  els.maintenanceToggleButton.addEventListener("click", toggleMaintenance);
  updateMaintenanceUI();
}

init();
