const state = {
  users: [],
  activeUser: null,
  compensationStep: 1,
  maintenanceEnabled: false,
  toastTimer: null,
  activeBugId: null,
  activeSuggestionId: null,
  activeApplicationId: null,
  bugFilters: {
    search: "",
    priority: "all",
    area: "all",
  },
  suggestionFilters: {
    search: "",
    area: "all",
  },
  applicationFilters: {
    search: "",
    role: "all",
    status: "all",
  },
};

const bugReports = [
  {
    id: "bug-1",
    title: "Login fails on first attempt",
    priority: "High",
    area: "Auth",
    resolution: null,
    summary: "Some users must click log in twice after entering credentials.",
    description: "On fresh sessions, the first login submit occasionally returns invalid credentials even when correct values are used. A second attempt succeeds immediately. This appears related to initialization timing between user data load and submit handling.",
  },
  {
    id: "bug-2",
    title: "Compensation review step loses chips",
    priority: "Medium",
    area: "Compensation",
    resolution: null,
    summary: "Review panel does not always reflect selected option labels.",
    description: "When rapidly changing compensation type before hitting next, the review panel can show stale selection values. Reproduced by switching from currency to character and immediately moving to review. Expected behavior is live synchronized values.",
  },
  {
    id: "bug-3",
    title: "Sidebar wraps in narrow tablet view",
    priority: "Low",
    area: "Navigation",
    resolution: null,
    summary: "Navigation labels crowd between 680px and 740px width.",
    description: "At certain viewport widths, sidebar buttons clip text or wrap awkwardly. This impacts readability but does not block interactions. Suggested fix is responsive font scaling and tighter button padding for that range.",
  },
];

const applications = [
  {
    id: "app-1",
    title: "Kai R.",
    role: "Operations Analyst",
    status: "Pending Review",
    decision: null,
    answers: [
      { question: "How many years of relevant experience do you have?", answer: "3 years in operations analytics." },
      { question: "What tools are you strongest with?", answer: "Excel, SQL, and dashboard reporting." },
      { question: "Why do you want this role?", answer: "I enjoy optimizing workflows and building reliable reports." },
    ],
    summary: "Strong spreadsheet and reporting background.",
    description: "Kai has 3 years of operational analytics experience, focusing on process metrics and dashboard reporting. Applied for Operations Analyst and included references from two prior team leads.",
  },
  {
    id: "app-2",
    title: "Mira T.",
    role: "Support Specialist",
    status: "Interview Scheduled",
    decision: null,
    answers: [
      { question: "How do you handle upset users?", answer: "I acknowledge impact first, then provide clear next steps." },
      { question: "What is your escalation process?", answer: "Triage severity, gather logs, and handoff with full context." },
      { question: "Preferred shift window?", answer: "Afternoons and evenings." },
    ],
    summary: "Customer support lead with escalation handling history.",
    description: "Mira has 4 years of support experience and specializes in incident triage and communication workflows. Interview is scheduled for next Tuesday 14:00.",
  },
  {
    id: "app-3",
    title: "Ren S.",
    role: "Maintenance Tech",
    status: "Approved",
    decision: null,
    answers: [
      { question: "Experience with preventive maintenance?", answer: "Handled weekly and monthly checklists for 2 years." },
      { question: "Comfort with emergency procedures?", answer: "Certified, and experienced in incident response drills." },
      { question: "Earliest available start date?", answer: "Within 2 weeks." },
    ],
    summary: "Approved after technical practical assessment.",
    description: "Ren completed the maintenance assessment with high marks in preventive checks and emergency procedures. Start date pending onboarding confirmation.",
  },
];

const suggestions = [
  {
    id: "sug-1",
    decision: null,
    title: "Add queue summary widget",
    areas: ["Lobby", "Game"],
    summary: "Show active queue and estimated wait time in lobby header.",
    description: "Introduce a compact widget in the lobby that displays current queue population and estimated wait time. This helps players decide whether to stay in queue or switch modes.",
  },
  {
    id: "sug-2",
    decision: null,
    title: "Improve combo training prompts",
    areas: ["Game", "Character"],
    summary: "Provide contextual hint prompts during combo practice sessions.",
    description: "In training sessions, add optional prompts when players repeatedly drop combo sequences. The prompt should identify the missed timing window and suggest a correction.",
  },
  {
    id: "sug-3",
    decision: null,
    title: "Character loadout presets",
    areas: ["Character", "Lobby"],
    summary: "Allow saving and loading up to three quick build presets.",
    description: "Users want to switch between PvP and PvE builds quickly. Add character presets with naming support and one-click apply on the character management screen.",
  },
];

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
  bugSearchInput: document.getElementById("bugSearchInput"),
  bugPriorityFilters: document.getElementById("bugPriorityFilters"),
  bugAreaFilters: document.getElementById("bugAreaFilters"),
  bugList: document.getElementById("bugList"),
  bugProcessedList: document.getElementById("bugProcessedList"),
  bugDetailTitle: document.getElementById("bugDetailTitle"),
  bugDetailMeta: document.getElementById("bugDetailMeta"),
  bugDetailDescription: document.getElementById("bugDetailDescription"),
  bugMarkCompleted: document.getElementById("bugMarkCompleted"),
  bugMarkIntended: document.getElementById("bugMarkIntended"),
  bugMarkDenied: document.getElementById("bugMarkDenied"),
  suggestionSearchInput: document.getElementById("suggestionSearchInput"),
  suggestionAreaFilters: document.getElementById("suggestionAreaFilters"),
  suggestionList: document.getElementById("suggestionList"),
  suggestionProcessedList: document.getElementById("suggestionProcessedList"),
  suggestionDetailTitle: document.getElementById("suggestionDetailTitle"),
  suggestionDetailMeta: document.getElementById("suggestionDetailMeta"),
  suggestionDetailDescription: document.getElementById("suggestionDetailDescription"),
  suggestionMarkAccepted: document.getElementById("suggestionMarkAccepted"),
  suggestionMarkPlanned: document.getElementById("suggestionMarkPlanned"),
  suggestionMarkDenied: document.getElementById("suggestionMarkDenied"),
  applicationSearchInput: document.getElementById("applicationSearchInput"),
  applicationRoleFilters: document.getElementById("applicationRoleFilters"),
  applicationStatusFilters: document.getElementById("applicationStatusFilters"),
  applicationList: document.getElementById("applicationList"),
  applicationProcessedList: document.getElementById("applicationProcessedList"),
  applicationDetailTitle: document.getElementById("applicationDetailTitle"),
  applicationDetailMeta: document.getElementById("applicationDetailMeta"),
  applicationDetailDescription: document.getElementById("applicationDetailDescription"),
  applicationDetailAnswers: document.getElementById("applicationDetailAnswers"),
  applicationMarkAccepted: document.getElementById("applicationMarkAccepted"),
  applicationMarkDenied: document.getElementById("applicationMarkDenied"),
};

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setSingleChipToggle(container, key, value) {
  if (!container) {
    return;
  }

  const buttons = container.querySelectorAll(".chip-toggle");
  buttons.forEach((button) => {
    const matches = button.dataset[key] === value;
    button.classList.toggle("active", matches);
  });
}

function getFilteredBugReports() {
  const searchValue = state.bugFilters.search.toLowerCase();
  return bugReports.filter((report) => {
    const matchesPriority = state.bugFilters.priority === "all" || report.priority === state.bugFilters.priority;
    const matchesArea = state.bugFilters.area === "all" || report.area === state.bugFilters.area;
    const matchesSearch = !searchValue
      || report.title.toLowerCase().includes(searchValue)
      || report.summary.toLowerCase().includes(searchValue)
      || report.description.toLowerCase().includes(searchValue);
    return matchesPriority && matchesArea && matchesSearch;
  });
}

function renderBugDetail(report) {
  if (!report) {
    els.bugDetailTitle.textContent = "No matching bug reports";
    els.bugDetailMeta.textContent = "Try adjusting search or filter toggles.";
    els.bugDetailDescription.textContent = "";
    if (els.bugMarkCompleted) {
      els.bugMarkCompleted.disabled = true;
      els.bugMarkIntended.disabled = true;
      els.bugMarkDenied.disabled = true;
    }
    return;
  }

  els.bugDetailTitle.textContent = report.title;
  const statusText = report.resolution ? ` | Status: ${report.resolution}` : " | Status: Open";
  els.bugDetailMeta.textContent = `Priority: ${report.priority} | Area: ${report.area}${statusText}`;
  els.bugDetailDescription.textContent = report.description;
  if (els.bugMarkCompleted) {
    const isProcessed = Boolean(report.resolution);
    els.bugMarkCompleted.disabled = isProcessed;
    els.bugMarkIntended.disabled = isProcessed;
    els.bugMarkDenied.disabled = isProcessed;
  }
}

function renderBugReports() {
  if (!els.bugList) {
    return;
  }

  const filtered = getFilteredBugReports();
  const openReports = filtered.filter((report) => !report.resolution);
  const processedReports = filtered.filter((report) => report.resolution);

  if (openReports.length === 0 && processedReports.length === 0) {
    els.bugList.innerHTML = '<div class="empty-state">No bug reports match current filters.</div>';
    if (els.bugProcessedList) {
      els.bugProcessedList.innerHTML = '<div class="empty-state">No processed bug reports yet.</div>';
    }
    renderBugDetail(null);
    return;
  }

  if (!filtered.some((entry) => entry.id === state.activeBugId)) {
    state.activeBugId = filtered[0].id;
  }

  els.bugList.innerHTML = openReports.length === 0
    ? '<div class="empty-state">No open bug reports for this filter.</div>'
    : openReports
    .map((report) => {
      const isActive = report.id === state.activeBugId;
      return `
        <article class="item-card ${isActive ? "active" : ""}" data-bug-id="${escapeHtml(report.id)}">
          <p class="item-title">${escapeHtml(report.title)}</p>
          <div>
            <span class="chip chip-priority-${escapeHtml(report.priority)}">${escapeHtml(report.priority)}</span>
            <span class="chip chip-area">${escapeHtml(report.area)}</span>
          </div>
          <p>${escapeHtml(report.summary)}</p>
        </article>
      `;
    })
    .join("");

  if (els.bugProcessedList) {
    els.bugProcessedList.innerHTML = processedReports.length === 0
      ? '<div class="empty-state">No processed bug reports yet.</div>'
      : processedReports
      .map((report) => {
        const isActive = report.id === state.activeBugId;
        return `
          <article class="item-card ${isActive ? "active" : ""}" data-bug-id="${escapeHtml(report.id)}">
            <p class="item-title">${escapeHtml(report.title)}</p>
            <div>
              <span class="chip chip-priority-${escapeHtml(report.priority)}">${escapeHtml(report.priority)}</span>
              <span class="chip chip-area">${escapeHtml(report.area)}</span>
              <span class="chip chip-decision">${escapeHtml(report.resolution)}</span>
            </div>
            <p>${escapeHtml(report.summary)}</p>
          </article>
        `;
      })
      .join("");
  }

  const active = filtered.find((entry) => entry.id === state.activeBugId) || filtered[0];
  renderBugDetail(active);
}

function getFilteredApplications() {
  const searchValue = state.applicationFilters.search.toLowerCase();
  return applications.filter((application) => {
    const matchesRole = state.applicationFilters.role === "all" || application.role === state.applicationFilters.role;
    const matchesStatus = state.applicationFilters.status === "all" || application.status === state.applicationFilters.status;
    const matchesSearch = !searchValue
      || application.title.toLowerCase().includes(searchValue)
      || application.summary.toLowerCase().includes(searchValue)
      || application.description.toLowerCase().includes(searchValue);
    return matchesRole && matchesStatus && matchesSearch;
  });
}

function getFilteredSuggestions() {
  const searchValue = state.suggestionFilters.search.toLowerCase();
  return suggestions.filter((suggestion) => {
    const matchesArea = state.suggestionFilters.area === "all" || suggestion.areas.includes(state.suggestionFilters.area);
    const matchesSearch = !searchValue
      || suggestion.title.toLowerCase().includes(searchValue)
      || suggestion.summary.toLowerCase().includes(searchValue)
      || suggestion.description.toLowerCase().includes(searchValue);
    return matchesArea && matchesSearch;
  });
}

function renderSuggestionDetail(suggestion) {
  if (!suggestion) {
    els.suggestionDetailTitle.textContent = "No matching suggestions";
    els.suggestionDetailMeta.textContent = "Try adjusting search or filter toggles.";
    els.suggestionDetailDescription.textContent = "";
    if (els.suggestionMarkAccepted) {
      els.suggestionMarkAccepted.disabled = true;
      els.suggestionMarkPlanned.disabled = true;
      els.suggestionMarkDenied.disabled = true;
    }
    return;
  }

  els.suggestionDetailTitle.textContent = suggestion.title;
  const areasText = suggestion.areas.join(", ");
  const statusText = suggestion.decision ? ` | Status: ${suggestion.decision}` : " | Status: Open";
  els.suggestionDetailMeta.textContent = `Areas: ${areasText}${statusText}`;
  els.suggestionDetailDescription.textContent = suggestion.description;
  if (els.suggestionMarkAccepted) {
    const isProcessed = Boolean(suggestion.decision);
    els.suggestionMarkAccepted.disabled = isProcessed;
    els.suggestionMarkPlanned.disabled = isProcessed;
    els.suggestionMarkDenied.disabled = isProcessed;
  }
}

function renderSuggestions() {
  if (!els.suggestionList) {
    return;
  }

  const filtered = getFilteredSuggestions();
  const openSuggestions = filtered.filter((suggestion) => !suggestion.decision);
  const processedSuggestions = filtered.filter((suggestion) => suggestion.decision);

  if (openSuggestions.length === 0 && processedSuggestions.length === 0) {
    els.suggestionList.innerHTML = '<div class="empty-state">No suggestions match current filters.</div>';
    if (els.suggestionProcessedList) {
      els.suggestionProcessedList.innerHTML = '<div class="empty-state">No processed suggestions yet.</div>';
    }
    renderSuggestionDetail(null);
    return;
  }

  if (!filtered.some((entry) => entry.id === state.activeSuggestionId)) {
    state.activeSuggestionId = filtered[0].id;
  }

  els.suggestionList.innerHTML = openSuggestions.length === 0
    ? '<div class="empty-state">No open suggestions for this filter.</div>'
    : openSuggestions
    .map((suggestion) => {
      const isActive = suggestion.id === state.activeSuggestionId;
      const chips = suggestion.areas
        .map((area) => `<span class="chip chip-area">${escapeHtml(area)}</span>`)
        .join("");
      return `
        <article class="item-card ${isActive ? "active" : ""}" data-suggestion-id="${escapeHtml(suggestion.id)}">
          <p class="item-title">${escapeHtml(suggestion.title)}</p>
          <div>${chips}</div>
          <p>${escapeHtml(suggestion.summary)}</p>
        </article>
      `;
    })
    .join("");

  if (els.suggestionProcessedList) {
    els.suggestionProcessedList.innerHTML = processedSuggestions.length === 0
      ? '<div class="empty-state">No processed suggestions yet.</div>'
      : processedSuggestions
      .map((suggestion) => {
        const isActive = suggestion.id === state.activeSuggestionId;
        const chips = suggestion.areas
          .map((area) => `<span class="chip chip-area">${escapeHtml(area)}</span>`)
          .join("");
        return `
          <article class="item-card ${isActive ? "active" : ""}" data-suggestion-id="${escapeHtml(suggestion.id)}">
            <p class="item-title">${escapeHtml(suggestion.title)}</p>
            <div>${chips}<span class="chip chip-decision">${escapeHtml(suggestion.decision)}</span></div>
            <p>${escapeHtml(suggestion.summary)}</p>
          </article>
        `;
      })
      .join("");
  }

  const active = filtered.find((entry) => entry.id === state.activeSuggestionId) || filtered[0];
  renderSuggestionDetail(active);
}

function renderApplicationDetail(application) {
  if (!application) {
    els.applicationDetailTitle.textContent = "No matching applications";
    els.applicationDetailMeta.textContent = "Try adjusting search or filter toggles.";
    els.applicationDetailDescription.textContent = "";
    if (els.applicationDetailAnswers) {
      els.applicationDetailAnswers.innerHTML = "";
    }
    if (els.applicationMarkAccepted) {
      els.applicationMarkAccepted.disabled = true;
      els.applicationMarkDenied.disabled = true;
    }
    return;
  }

  els.applicationDetailTitle.textContent = application.title;
  const decisionText = application.decision ? ` | Decision: ${application.decision}` : " | Decision: Open";
  els.applicationDetailMeta.textContent = `Role: ${application.role} | Status: ${application.status}${decisionText}`;
  els.applicationDetailDescription.textContent = application.description;
  if (els.applicationDetailAnswers) {
    els.applicationDetailAnswers.innerHTML = application.answers
      .map((entry) => {
        return `
          <article class="qa-item">
            <p class="qa-question">${escapeHtml(entry.question)}</p>
            <p class="qa-answer">${escapeHtml(entry.answer)}</p>
          </article>
        `;
      })
      .join("");
  }
  if (els.applicationMarkAccepted) {
    const isProcessed = Boolean(application.decision);
    els.applicationMarkAccepted.disabled = isProcessed;
    els.applicationMarkDenied.disabled = isProcessed;
  }
}

function renderApplications() {
  if (!els.applicationList) {
    return;
  }

  const filtered = getFilteredApplications();
  const openApplications = filtered.filter((application) => !application.decision);
  const processedApplications = filtered.filter((application) => application.decision);

  if (openApplications.length === 0 && processedApplications.length === 0) {
    els.applicationList.innerHTML = '<div class="empty-state">No applications match current filters.</div>';
    if (els.applicationProcessedList) {
      els.applicationProcessedList.innerHTML = '<div class="empty-state">No processed applications yet.</div>';
    }
    renderApplicationDetail(null);
    return;
  }

  if (!filtered.some((entry) => entry.id === state.activeApplicationId)) {
    state.activeApplicationId = filtered[0].id;
  }

  els.applicationList.innerHTML = openApplications.length === 0
    ? '<div class="empty-state">No open applications for this filter.</div>'
    : openApplications
    .map((application) => {
      const isActive = application.id === state.activeApplicationId;
      return `
        <article class="item-card ${isActive ? "active" : ""}" data-application-id="${escapeHtml(application.id)}">
          <p class="item-title">${escapeHtml(application.title)}</p>
          <div>
            <span class="chip chip-role">${escapeHtml(application.role)}</span>
            <span class="chip chip-status">${escapeHtml(application.status)}</span>
          </div>
          <p>${escapeHtml(application.summary)}</p>
        </article>
      `;
    })
    .join("");

  if (els.applicationProcessedList) {
    els.applicationProcessedList.innerHTML = processedApplications.length === 0
      ? '<div class="empty-state">No processed applications yet.</div>'
      : processedApplications
      .map((application) => {
        const isActive = application.id === state.activeApplicationId;
        return `
          <article class="item-card ${isActive ? "active" : ""}" data-application-id="${escapeHtml(application.id)}">
            <p class="item-title">${escapeHtml(application.title)}</p>
            <div>
              <span class="chip chip-role">${escapeHtml(application.role)}</span>
              <span class="chip chip-status">${escapeHtml(application.status)}</span>
              <span class="chip chip-decision">${escapeHtml(application.decision)}</span>
            </div>
            <p>${escapeHtml(application.summary)}</p>
          </article>
        `;
      })
      .join("");
  }

  const active = filtered.find((entry) => entry.id === state.activeApplicationId) || filtered[0];
  renderApplicationDetail(active);
}

function handleBugListClick(event) {
  const card = event.target.closest("[data-bug-id]");
  if (!card) {
    return;
  }

  state.activeBugId = card.dataset.bugId;
  renderBugReports();
}

function handleApplicationListClick(event) {
  const card = event.target.closest("[data-application-id]");
  if (!card) {
    return;
  }

  state.activeApplicationId = card.dataset.applicationId;
  renderApplications();
}

function handleSuggestionListClick(event) {
  const card = event.target.closest("[data-suggestion-id]");
  if (!card) {
    return;
  }

  state.activeSuggestionId = card.dataset.suggestionId;
  renderSuggestions();
}

function markActiveBug(resolution) {
  const active = bugReports.find((entry) => entry.id === state.activeBugId);
  if (!active || active.resolution) {
    return;
  }

  active.resolution = resolution;
  showToast(`Bug marked as ${resolution}`);
  renderBugReports();
}

function markActiveSuggestion(decision) {
  const active = suggestions.find((entry) => entry.id === state.activeSuggestionId);
  if (!active || active.decision) {
    return;
  }

  active.decision = decision;
  showToast(`Suggestion marked as ${decision}`);
  renderSuggestions();
}

function markActiveApplication(decision) {
  const active = applications.find((entry) => entry.id === state.activeApplicationId);
  if (!active || active.decision) {
    return;
  }

  active.decision = decision;
  showToast(`Application ${decision}`);
  renderApplications();
}

function onBugPriorityFilterClick(event) {
  const button = event.target.closest("[data-priority]");
  if (!button) {
    return;
  }

  state.bugFilters.priority = button.dataset.priority;
  setSingleChipToggle(els.bugPriorityFilters, "priority", state.bugFilters.priority);
  renderBugReports();
}

function onBugAreaFilterClick(event) {
  const button = event.target.closest("[data-area]");
  if (!button) {
    return;
  }

  state.bugFilters.area = button.dataset.area;
  setSingleChipToggle(els.bugAreaFilters, "area", state.bugFilters.area);
  renderBugReports();
}

function onApplicationRoleFilterClick(event) {
  const button = event.target.closest("[data-role]");
  if (!button) {
    return;
  }

  state.applicationFilters.role = button.dataset.role;
  setSingleChipToggle(els.applicationRoleFilters, "role", state.applicationFilters.role);
  renderApplications();
}

function onSuggestionAreaFilterClick(event) {
  const button = event.target.closest("[data-suggestion-area]");
  if (!button) {
    return;
  }

  state.suggestionFilters.area = button.dataset.suggestionArea;
  setSingleChipToggle(els.suggestionAreaFilters, "suggestionArea", state.suggestionFilters.area);
  renderSuggestions();
}

function onApplicationStatusFilterClick(event) {
  const button = event.target.closest("[data-status]");
  if (!button) {
    return;
  }

  state.applicationFilters.status = button.dataset.status;
  setSingleChipToggle(els.applicationStatusFilters, "status", state.applicationFilters.status);
  renderApplications();
}

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

if (els.bugSearchInput) {
  els.bugSearchInput.addEventListener("input", (event) => {
    state.bugFilters.search = event.target.value.trim();
    renderBugReports();
  });
}

if (els.bugPriorityFilters) {
  els.bugPriorityFilters.addEventListener("click", onBugPriorityFilterClick);
}

if (els.bugAreaFilters) {
  els.bugAreaFilters.addEventListener("click", onBugAreaFilterClick);
}

if (els.bugList) {
  els.bugList.addEventListener("click", handleBugListClick);
}

if (els.bugProcessedList) {
  els.bugProcessedList.addEventListener("click", handleBugListClick);
}

if (els.bugMarkCompleted) {
  els.bugMarkCompleted.addEventListener("click", () => markActiveBug("Completed"));
  els.bugMarkIntended.addEventListener("click", () => markActiveBug("Intended"));
  els.bugMarkDenied.addEventListener("click", () => markActiveBug("Denied"));
}

if (els.suggestionSearchInput) {
  els.suggestionSearchInput.addEventListener("input", (event) => {
    state.suggestionFilters.search = event.target.value.trim();
    renderSuggestions();
  });
}

if (els.suggestionAreaFilters) {
  els.suggestionAreaFilters.addEventListener("click", onSuggestionAreaFilterClick);
}

if (els.suggestionList) {
  els.suggestionList.addEventListener("click", handleSuggestionListClick);
}

if (els.suggestionProcessedList) {
  els.suggestionProcessedList.addEventListener("click", handleSuggestionListClick);
}

if (els.suggestionMarkAccepted) {
  els.suggestionMarkAccepted.addEventListener("click", () => markActiveSuggestion("Accepted"));
  els.suggestionMarkPlanned.addEventListener("click", () => markActiveSuggestion("Planned"));
  els.suggestionMarkDenied.addEventListener("click", () => markActiveSuggestion("Denied"));
}

if (els.applicationSearchInput) {
  els.applicationSearchInput.addEventListener("input", (event) => {
    state.applicationFilters.search = event.target.value.trim();
    renderApplications();
  });
}

if (els.applicationRoleFilters) {
  els.applicationRoleFilters.addEventListener("click", onApplicationRoleFilterClick);
}

if (els.applicationStatusFilters) {
  els.applicationStatusFilters.addEventListener("click", onApplicationStatusFilterClick);
}

if (els.applicationList) {
  els.applicationList.addEventListener("click", handleApplicationListClick);
}

if (els.applicationProcessedList) {
  els.applicationProcessedList.addEventListener("click", handleApplicationListClick);
}

if (els.applicationMarkAccepted) {
  els.applicationMarkAccepted.addEventListener("click", () => markActiveApplication("Accepted"));
  els.applicationMarkDenied.addEventListener("click", () => markActiveApplication("Denied"));
}

renderBugReports();
renderSuggestions();
renderApplications();

init();
