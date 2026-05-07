// =========================================================================
// PREVENT SCROLL RESTORATION ON REFRESH
// =========================================================================


if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
window.scrollTo(0, 0);

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

// --- EARLY THEME, ACCENT & FONT INITIALIZATION (Prevents Flash) ---
const colors = {
  red: {
    main: "#FF3131",
    glow: "rgba(255, 49, 49, 0.5)",
    trans: "rgba(255, 49, 49, 0.15)",
  },
  cyan: {
    main: "#2ef2e2",
    glow: "rgba(15, 47, 47, 0.5)",
    trans: "rgba(15, 47, 47, 0.15)",
  },
  green: {
    main: "#A4F000",
    glow: "rgba(0, 63, 58, 0.5)",
    trans: "rgba(0, 63, 58, 0.15)",
  },
  purple: {
    main: "#7c83ff",
    glow: "rgba(31, 33, 64, 0.5)",
    trans: "rgba(31, 33, 64, 0.15)",
  },
  amber: {
    main: "#FF9E6D",
    glow: "rgba(255, 153, 0, 0.5)",
    trans: "rgba(255, 153, 0, 0.15)",
  },
  pink: {
    main: "#ff00aa",
    glow: "rgba(255, 0, 170, 0.5)",
    trans: "rgba(255, 0, 170, 0.15)",
  },
  blue: {
    main: "#0066ff",
    glow: "rgba(0, 102, 255, 0.5)",
    trans: "rgba(0, 102, 255, 0.15)",
  },
  white: {
    main: "#ffffff",
    glow: "rgba(255, 255, 255, 0.5)",
    trans: "rgba(255, 255, 255, 0.15)",
  },
  matrix: {
    main: "#03A062",
    glow: "rgba(0, 255, 65, 0.5)",
    trans: "rgba(0, 255, 65, 0.15)",
  },
  gold: {
    main: "#FFD700",
    glow: "rgba(255, 215, 0, 0.5)",
    trans: "rgba(255, 215, 0, 0.15)",
  },
};

let currentTheme = localStorage.getItem("cyber_theme") || "dark";
let currentAccent = localStorage.getItem("cyber_accent") || "red";
let currentFont = localStorage.getItem("cyber_font") || "sans";
let currentFontSize = localStorage.getItem("cyber_fontsize") || "md";
let squad = localStorage.getItem('squad') || "138";
// Global data arrays used across render/fetch helpers
const mentorsData = [];
const studentsData = [];
const SUPABASE_BUCKET_IMAGE_BASE =
  "https://gjkbbbklxqgxvjoqhvue.supabase.co/storage/v1/object/public/dossier_assets/Profile/profile_picture/";

const PROFILE_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
let profilePictureLookupClient = null;

let kalvianRosterCache = null;
let leadershipProfilesCache = null;
const PORTFOLIO_DATA_VERSION_KEY = 'portfolio_data_version';

function resolveDossierImageSrc(src) {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  const fileName = src.replace(/^\.\/Src\//, "");
  if (!fileName || fileName === src) return src;

  return `${SUPABASE_BUCKET_IMAGE_BASE}${encodeURI(fileName)}`;
}

function getProfilePictureSrc(email) {
  if (!email) return "";
  return `${SUPABASE_BUCKET_IMAGE_BASE}${email.trim().toLowerCase()}`;
}

function getProfilePictureLookupClient() {
  if (profilePictureLookupClient) return profilePictureLookupClient;
  if (!window.supabase) return null;

  profilePictureLookupClient = window.supabase.createClient(
    "https://gjkbbbklxqgxvjoqhvue.supabase.co",
    "sb_publishable_Z-ZLJ1kdtSnjYqXFwwDAQw_JKMikQQr",
  );

  return profilePictureLookupClient;
}

async function findProfilePictureUrlByEmail(email) {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return "";

  const client = getProfilePictureLookupClient();
  if (!client) return "";

  const { data, error } = await client.storage
    .from("dossier_assets")
    .list("Profile/profile_picture", { limit: 1000 });

  if (error || !Array.isArray(data)) return "";

  const match = data.find((file) => {
    const fileName = (file?.name || "").toLowerCase();
    return fileName.includes(normalized);
  });

  if (!match) return "";

  return client.storage
    .from("dossier_assets")
    .getPublicUrl(`Profile/profile_picture/${match.name}`).data.publicUrl;
}

async function tryResolveProfileImage(imgEl, email, localSrc) {
  if (!imgEl) return;

  const resolvedUrl = await findProfilePictureUrlByEmail(email);
  if (resolvedUrl) {
    const bust = `t=${Date.now()}`;
    imgEl.src = resolvedUrl + (resolvedUrl.includes("?") ? "&" : "?") + bust;
    return;
  }

  if (localSrc && (localSrc.startsWith("http://") || localSrc.startsWith("https://") || localSrc.startsWith("data:"))) {
    imgEl.src = localSrc;
    return;
  }

  if (localSrc && localSrc.startsWith("./Src/")) {
    imgEl.src = resolveDossierImageSrc(localSrc);
    return;
  }

  imgEl.src = PROFILE_PLACEHOLDER;
}

function resolveAllProfileImages() {
  document.querySelectorAll("img[data-profile-email]").forEach((img) => {
    tryResolveProfileImage(img, img.dataset.profileEmail, img.dataset.localSrc);
  });
}

function normalizeTablePerson(row, fallbackRole = "") {
  return {
    name: row?.full_name || row?.name || "",
    full_name: row?.full_name || row?.name || "",
    role: row?.role || fallbackRole || "",
    email: row?.email || "",
    img: row?.avatar_url || row?.img_url || row?.img || "",
    github: row?.github_url || row?.github_username || row?.github || "",
    linkedin: row?.linkedin_url || row?.linkedin || "",
    bio: row?.bio || "",
    leetcode: row?.leetcode_username || row?.leetcode || "",
    hackerrank: row?.hackerrank_username || row?.hackerrank || "",
    codechef: row?.codechef_username || row?.codechef || "",
    squad: row?.squad ? String(row.squad) : "",
  };
}

function replaceArrayContents(target, entries) {
  target.splice(0, target.length, ...entries);
}

function invalidatePortfolioDataCaches() {
  kalvianRosterCache = null;
  leadershipProfilesCache = null;
}

async function refreshPortfolioSections() {
  invalidatePortfolioDataCaches();
  await Promise.all([renderLeadershipSection(), fetchKalvianRoster()]);

  const studentsSection = document.getElementById('students-section');
  if (studentsSection) {
    renderStudents();
  }
}

window.addEventListener('storage', (event) => {
  if (event.key !== PORTFOLIO_DATA_VERSION_KEY) return;

  // Normal portfolio data refresh
  refreshPortfolioSections().catch((error) => {
    console.warn('Portfolio refresh after storage update failed:', error);
  });
});

async function fetchKalvianRoster() {
  // Always fetch fresh roster data to avoid stale profile displays
  if (!supabaseClient) {
    kalvianRosterCache = new Set();
    replaceArrayContents(studentsData, []);
    return kalvianRosterCache;
  }

  const { data, error } = await supabaseClient
    .from('kalvian')
    .select('full_name, role, img_url, github_url, linkedin_url, email, bio, squad')
    .order('full_name', { ascending: true });

  const roster = new Set();
  const loadedStudents = [];
  if (!error && Array.isArray(data)) {
    data.forEach((row) => {
      const person = normalizeTablePerson(row, row?.role || 'KALVIAN');
      const fullName = (person?.name || '').trim().toLowerCase();
      const email = (person?.email || '').trim().toLowerCase();
      if (fullName || email) loadedStudents.push(person);
      if (fullName) roster.add(fullName);
      if (email) roster.add(email);
    });
  }

  replaceArrayContents(studentsData, loadedStudents);
  // keep a short-lived roster cache so other helpers can check membership
  kalvianRosterCache = roster;
  return roster;
}

function isInKalvianRoster(person) {
  if (!person) return false;
  const roster = kalvianRosterCache;
  if (!roster || roster.size === 0) return false;

  const name = (person.name || '').trim().toLowerCase();
  const email = (person.email || '').trim().toLowerCase();
  return roster.has(name) || roster.has(email);
}

function getVisibleKalvianStudents() {
  return (studentsData || []).filter((person) => isInKalvianRoster(person));
}

async function fetchLeadershipProfiles() {
  // Always fetch fresh leadership/profile data to reflect updates immediately
  if (!supabaseClient) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from("management")
    .select("full_name, role, img_url, linkedin_url, email, bio, created_at")
    .order("full_name", { ascending: true });

  const merged = new Map();

  const normalizeKey = (entry) => {
    const name = (entry?.name || entry?.full_name || "").trim().toLowerCase();
    const email = (entry?.email || "").trim().toLowerCase();
    return email || name;
  };

  if (!error && Array.isArray(data)) {
    data.forEach((row) => {
      const key = normalizeKey(row);
      if (!key) return;

      merged.set(key, normalizeTablePerson(row, row.role || "LEADERSHIP"));
    });
  }


  if (merged.size === 0) {
    replaceArrayContents(mentorsData, []);
    return [];
  }
  const profilesArray = Array.from(merged.values());
  replaceArrayContents(mentorsData, profilesArray);
  return profilesArray;
}

async function renderLeadershipSection() {
  const leadershipProfiles = await fetchLeadershipProfiles();
  replaceArrayContents(mentorsData, leadershipProfiles);
  window.mentorsData = mentorsData;

  const mentorGrid = document.getElementById("mentorGrid");
  console.debug('renderLeadershipSection: profiles=', leadershipProfiles.length, 'mentorGrid?', !!mentorGrid);
  if (mentorGrid) {
    mentorGrid.innerHTML = leadershipProfiles
      .map((mentor) => renderCard(mentor, true))
      .join("");
    // Resolve profile images for newly-rendered mentor cards
    resolveAllProfileImages();
  } else {
    console.warn('renderLeadershipSection: mentorGrid element not found');
  }
}

async function getDashboardRoleByEmail(email) {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized || !supabaseClient) return "default";

  const { data, error } = await supabaseClient
    .from("management")
    .select("email, role")
    .ilike("email", normalized)
    .maybeSingle();

  if (error || !data) return "default";

  const role = (data.role || "").toString().trim().toUpperCase();
  if (role.includes("MANAGER")) return "manager";
  if (role.includes("MENTOR")) return "mentor";
  return "default";
}

async function handleDashboardAccess() {
  if (!supabaseClient) {
    window.location.href = "dashboard.html?view=default";
    return;
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session?.user?.email) {
    handleLogin();
    return;
  }

  const dashboardRole = await getDashboardRoleByEmail(session.user.email);
  window.location.href = `dashboard.html?view=${encodeURIComponent(dashboardRole)}`;
}

window.getDashboardRoleByEmail = getDashboardRoleByEmail;
window.handleDashboardAccess = handleDashboardAccess;

function applyTheme(mode) {
  let isDark = true;
  if (mode === "device")
    isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  else if (mode === "light") isDark = false;

  if (isDark) {
    document.documentElement.classList.remove("light-mode");
    document.body.classList.remove("light-mode");
  } else {
    document.documentElement.classList.add("light-mode");
    document.body.classList.add("light-mode");
  }
}

function applyAccent(colorKey) {
  const c = colors[colorKey];
  document.documentElement.style.setProperty("--k-red", c.main);
  document.documentElement.style.setProperty("--k-red-glow", c.glow);
  document.documentElement.style.setProperty("--k-red-transparent", c.trans);
}
function smoothScrollTo(targetId, duration = 400) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const startPosition = window.scrollY;
  const targetPosition = target.offsetTop;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-in-out curve
    const ease =
      progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startPosition + distance * ease);

    if (elapsed < duration) {
      requestAnimationFrame(animation);
    }
  }

  requestAnimationFrame(animation);
}
function applyFont(fontKey) {
  const fontMap = {
    scifi: "'Rajdhani', sans-serif",
    orbit: "'Orbitron', sans-serif",
    mono: "'JetBrains Mono', monospace",
    space: "'Space Mono', monospace",
    pixel: "'VT323', monospace",
    mecha: "'Chakra Petch', sans-serif",
    sans: "'Inter', sans-serif",
  };
  document.documentElement.style.setProperty(
    "--font-main",
    fontMap[fontKey] || fontMap.sans,
  );
}

function applyFontSize(sizeKey) {
  if (sizeKey === "sm")
    document.documentElement.style.setProperty("--font-scale", "14px");
  else if (sizeKey === "lg")
    document.documentElement.style.setProperty("--font-scale", "18px");
  else document.documentElement.style.setProperty("--font-scale", "16px"); // md
}

applyTheme(currentTheme);
applyAccent(currentAccent);
applyFont(currentFont);
applyFontSize(currentFontSize);

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (currentTheme === "device") applyTheme("device");
  });

// =========================================================================
// WAIT FOR DOM TO LOAD BEFORE EXECUTING REMAINDER OF SCRIPT
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Prevent scrolling while loader is active
  document.body.style.overflow = "hidden";

  // --- DATA & STATE ---

  window.dossierStates = {}; // Make globally available
  window.currentActiveSubject = "";

  window.getDossierState = function (name) {
    if (!window.dossierStates[name]) {
      const allPeople = [
        ...(window.mentorsData || []),
        ...(window.studentsData || []),
      ];
      const person = allPeople.find((p) => p.name === name);
      const ghUsername = person ? extractGitHubUsername(person.github) : "";
      // Check for saved platform config (persists across refreshes)
      const savedPlatforms = getSavedPlatformConfig(name);
      window.dossierStates[name] = {
        projects: [],
        certs: [],
        skills: [
          { name: "JavaScript / TS", pct: Math.floor(Math.random() * 30) + 40 },
          { name: "Python", pct: Math.floor(Math.random() * 30) + 40 },
          {
            name: "C++ / Algorithms",
            pct: Math.floor(Math.random() * 30) + 40,
          },
        ],
        platforms: savedPlatforms || {
          github: ghUsername,
          leetcode: person?.leetcode || "",
          hackerrank: person?.hackerrank || "",
          codechef: person?.codechef || "",
        },
      };
    }
    return window.dossierStates[name];
  };

  const proverbsList = [
    "“Talk is cheap. Show me the code.”",
    "“First, solve the problem. Then, write the code.”",
    "“Simplicity is the soul of efficiency.”",
    "“Make it work, make it right, make it fast.”",
  ];
  let currentProverbIdx = 0;

  // --- INIT ---
  async function init() {
    // 1. Fetch Remote Data from Dedicated Tables
    if (supabaseClient) {
      try {
        const [mRes, sRes] = await Promise.all([
          supabaseClient.from('management').select('*'),
          supabaseClient.from('kalvian').select('*')
        ]);

        if (mRes.data && mRes.data.length > 0) {
          mentorsData.length = 0; // Clear hardcoded
          mRes.data.forEach(m => mentorsData.push({
            name: m.full_name,
            role: m.role,
            img: m.img_url,
            linkedin: m.linkedin_url,
            email: m.email
          }));
        }

        if (sRes.data && sRes.data.length > 0) {
          studentsData.length = 0; // Clear hardcoded
          sRes.data.forEach(s => studentsData.push({
            name: s.full_name,
            role: s.role,
            img: s.img_url,
            github: s.github_url,
            linkedin: s.linkedin_url,
            email: s.email
          }));
        }

        // 2. Fetch avatar overrides from dossiers (for dashboard users)
        const { data: remoteDossiers } = await supabaseClient.from('dossiers').select('full_name, avatar_url');
        if (remoteDossiers) {
          remoteDossiers.forEach(remote => {
            if (remote.avatar_url) {
              const s = studentsData.find(st => st.name.trim().toLowerCase() === remote.full_name.trim().toLowerCase());
              if (s) s.img = remote.avatar_url;
              const m = mentorsData.find(mn => mn.name === remote.full_name);
              if (m) m.img = remote.avatar_url;
            }
          });
        }
      } catch (e) {
        console.warn("Matrix Sync Error: Falling back to local cache.", e);
      }
    }
    // Keep dossier images local for now.
    // Supabase avatars can be enabled later, but they must not override `Src/` images.

    setTimeout(() => {
      window.scrollTo(0, 0);
      document.getElementById("loader").style.display = "none";
      document.body.style.overflow = "";
      if (!localStorage.getItem("cyber_v22"))
        document.getElementById("instruction-overlay").style.display = "flex";
    }, 3000);

    await renderLeadershipSection();

    await fetchKalvianRoster();

    // Pre-render students immediately so the section isn't blank for users
    // (keeps lazy loading as a fallback when the list is very large)
    try {
      renderStudents();
    } catch (e) {
      console.warn('Pre-render students failed:', e);
    }

    // Defer rendering of the heavy students section until it's in view.
    // Place lightweight placeholders so first paint is fast.
    const scrollerEl = document.getElementById("studentScroller");
    const gridEl = document.getElementById("studentGrid");
    if (scrollerEl) scrollerEl.innerHTML = '<div class="stats-loader">LOADING_STUDENTS...</div>';
    if (gridEl) gridEl.innerHTML = '<div class="stats-loader">LOADING_STUDENTS...</div>';

    const studentsSection = document.getElementById('students-section');
    if (studentsSection && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries, obs) => {
        if (entries[0].isIntersecting) {
          renderStudents();
          obs.disconnect();
        }
      }, { rootMargin: '400px' });
      io.observe(studentsSection);
    } else {
      // Fallback: render immediately
      renderStudents();
    }

    document.getElementById("proverbDisplay").innerText =
      proverbsList[currentProverbIdx];
    setInterval(cycleProverbs, 20000);

    // Sync UI Toggles
    const themeBtn = document.getElementById(`btn-theme-${currentTheme}`);
    if (themeBtn) themeBtn.classList.add("active");
    const accentBtn = document.getElementById(`swatch-${currentAccent}`);
    if (accentBtn) accentBtn.classList.add("active");
    const fontBtn = document.getElementById(`btn-font-${currentFont}`);
    if (fontBtn) fontBtn.classList.add("active");
    const sizeBtn = document.getElementById(`btn-size-${currentFontSize}`);
    if (sizeBtn) sizeBtn.classList.add("active");

  }

  // --- PROVERBS ---
  function cycleProverbs() {
    const display = document.getElementById("proverbDisplay");
    display.style.opacity = 0;
    setTimeout(() => {
      currentProverbIdx = (currentProverbIdx + 1) % proverbsList.length;
      display.innerText = proverbsList[currentProverbIdx];
      display.style.opacity = 1;
    }, 800);
  }

  // --- LAZY RENDER STUDENTS ---
  function renderStudents() {
    const scrollerEl = document.getElementById("studentScroller");
    const gridEl = document.getElementById("studentGrid");
    const visibleStudents = getVisibleKalvianStudents();

    const normalizeSquad = (value) => {
      const raw = String(value || "").toLowerCase().trim();
      const digits = raw.replace(/[^0-9]/g, "");
      return digits || raw;
    };

    // Filter by active squad (if squad data exists on any person)
    const hasSquadData = visibleStudents.some(s => s.squad);
    const activeSquad = normalizeSquad(squad);
    const strictFiltered = hasSquadData
      ? visibleStudents.filter((s) => {
        if (!s.squad) return true;
        return normalizeSquad(s.squad) === activeSquad;
      })
      : visibleStudents;

    // Do not render blank sections if squad metadata format is inconsistent.
    const filtered = strictFiltered.length > 0 ? strictFiltered : visibleStudents;

    // Scroller: show a smaller set to avoid heavy duplication
    const scrollerItems = filtered.slice(0, 12);
    if (scrollerEl) {
      scrollerEl.innerHTML = scrollerItems
        .map((s) => renderCard(s, false, "scroll"))
        .join("");
      const wrapper = scrollerEl.closest('.scroll-wrapper');
      if (wrapper) wrapper.style.animationPlayState = 'running';
    }

    // Grid: render filtered students
    console.debug('renderStudents: visible=', visibleStudents.length, 'filtered=', filtered.length, 'scroller?', !!scrollerEl, 'grid?', !!gridEl);
    if (gridEl) {
      gridEl.innerHTML = filtered.map((s) => renderCard(s, false, 'grid')).join('');
    }

    // Resolve profile images for newly-rendered student cards
    resolveAllProfileImages();
  }

  // --- SQUAD SWITCHER ---
  window.switchSquad = function (selectedSquad) {
    squad = selectedSquad;
    localStorage.setItem('squad', squad);

    // Update button states
    const btn138 = document.getElementById('btn-squad-138');
    const btn139 = document.getElementById('btn-squad-139');
    if (btn138 && btn139) {
      if (squad === '138') {
        btn138.classList.add('squad-active'); btn138.classList.remove('squad-inactive');
        btn139.classList.add('squad-inactive'); btn139.classList.remove('squad-active');
      } else {
        btn139.classList.add('squad-active'); btn139.classList.remove('squad-inactive');
        btn138.classList.add('squad-inactive'); btn138.classList.remove('squad-active');
      }
    }

    // Re-render with new filter
    renderStudents();
  };



  // --- RENDER CARDS ---
  window.renderCard = function (p, isMentor, type = "grid") {
    const width = type === "scroll" ? "w-80 flex-shrink-0" : "w-full";
    const personName = (p && (p.name || p.full_name)) ? (p.name || p.full_name) : "Unknown";
    const safeName = String(personName);
    const words = safeName.trim().split(/\s+/);
    const watermark = words.reduce(
      (l, c) =>
        c.replace(/[^a-zA-Z]/g, "").length > l.replace(/[^a-zA-Z]/g, "").length
          ? c
          : l,
      words[0],
    );
    return `
            <div class="card-perspective ${width}">
                <div class="tactical-card group" onmousemove="handleCardMove(event, this)" onclick="openModal(&quot;${safeName}&quot;, ${isMentor})" data-name="${safeName.toLowerCase()}">                         
                    <div class="card-glare"></div>                         
                    <div class="card-watermark">${watermark}</div>                         
                    <img src="${PROFILE_PLACEHOLDER}" data-profile-email="${p.email || ''}" data-local-src="${p.img || ''}" class="w-32 h-32 mb-6 border border-red-600/30 p-1 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:border-red-600 rounded-full z-10" loading="lazy">                         
                    <div class="text-center z-10 px-4">                             
                        <p class="text-red-600 mono text-[9px] uppercase font-bold tracking-widest mb-1 transition-colors duration-500 group-hover:text-white">${isMentor ? p.role : "KALVIAN"}</p>
                        <h3 class="text-xl font-black uppercase tracking-tighter">${safeName}</h3>
                    </div>                     
                </div>                 
            </div>`;
  };

  window.handleCardMove = function (e, card) {
    const r = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - r.left}px`);
    card.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  // Make Data available to OpenModal
  window.mentorsData = mentorsData;
  window.studentsData = studentsData;

  // --- COLLAPSIBLE SEARCH LOGIC ---
  window.toggleSearch = function () {
    const wrap = document.getElementById("searchWrap");
    const input = document.getElementById("searchBox");
    const isExpanded = wrap.classList.contains("expanded");
    if (isExpanded) {
      // Collapse
      wrap.classList.remove("expanded");
      input.value = "";
      input.dispatchEvent(new Event("input")); // Reset filter
    } else {
      // Expand
      wrap.classList.add("expanded");
      setTimeout(() => input.focus(), 350);
    }
  };

  // Close search on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const wrap = document.getElementById("searchWrap");
      if (wrap && wrap.classList.contains("expanded")) toggleSearch();
    }
  });

  // Close search when clicking outside
  document.addEventListener("click", (e) => {
    const wrap = document.getElementById("searchWrap");
    if (
      wrap &&
      wrap.classList.contains("expanded") &&
      !wrap.contains(e.target)
    ) {
      toggleSearch();
    }
  });

  document.getElementById("searchBox").addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    // Only filter static grid cards – never touch the infinite-scroll strip
    // (hiding scroll-strip cards shifts layout and breaks anchor scroll targets)
    const staticCards = document.querySelectorAll(
      "#studentGrid .card-perspective, #mentorGrid .card-perspective",
    );

    staticCards.forEach((card) => {
      const tacticalCard = card.querySelector(".tactical-card");
      if (!tacticalCard) return;
      const name = tacticalCard.dataset.name || "";
      card.style.display = value === "" || name.includes(value) ? "" : "none";
    });
  });

  // --- BULLETPROOF JS SMOOTH SCROLL ANIMATION ---
  document.querySelectorAll('nav a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      smoothScrollTo(targetId, 350);
    });
  });

  init();
});

// =========================================================================
// GLOBAL FUNCTIONS (Bound to HTML onClick events)
// =========================================================================

// --- SETTINGS CONTROLS ---
function openSettings() {
  document.getElementById("settings-page").classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeSettings() {
  document.getElementById("settings-page").classList.remove("active");
  setTimeout(() => {
    document.body.style.overflow = "auto";
  }, 400);
}
function openAbout() {
  document.getElementById("about-page").classList.add("active");
  document.body.style.overflow = "hidden";
}
function closeAbout() {
  document.getElementById("about-page").classList.remove("active");
  setTimeout(() => {
    document.body.style.overflow = "auto";
  }, 400);
}

function setTheme(mode) {
  currentTheme = mode;
  localStorage.setItem("cyber_theme", mode);
  applyTheme(mode);
  document
    .querySelectorAll(".theme-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`btn-theme-${mode}`).classList.add("active");
}

function setAccent(colorKey) {
  currentAccent = colorKey;
  localStorage.setItem("cyber_accent", colorKey);
  applyAccent(colorKey);
  document
    .querySelectorAll(".swatch")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(`swatch-${colorKey}`).classList.add("active");
}

function setFont(fontKey) {
  currentFont = fontKey;
  localStorage.setItem("cyber_font", fontKey);
  applyFont(fontKey);
  document
    .querySelectorAll(".font-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`btn-font-${fontKey}`).classList.add("active");
}

function setFontSize(sizeKey) {
  currentFontSize = sizeKey;
  localStorage.setItem("cyber_fontsize", sizeKey);
  applyFontSize(sizeKey);
  document
    .querySelectorAll(".size-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document.getElementById(`btn-size-${sizeKey}`).classList.add("active");
}

function resetSystem() {
  if (
    confirm(
      "WARNING: INITIATE FACTORY RESET PROTOCOL?\nThis will purge all local data and configurations.",
    )
  ) {
    localStorage.clear();
    window.location.reload();
  }
}

// --- MODALS ---
async function fetchRoleBio(isMentor, email, fullName) {
  if (!supabaseClient) return '';

  const tableName = isMentor ? 'management' : 'kalvian';
  const normalizedEmail = (email || '').trim().toLowerCase();
  const normalizedName = (fullName || '').trim();
  const filters = [];

  if (normalizedEmail) {
    filters.push({ column: 'email', value: normalizedEmail });
  }
  if (normalizedName) {
    filters.push({ column: 'full_name', value: normalizedName });
  }

  for (const filter of filters) {
    const { data, error } = await supabaseClient
      .from(tableName)
      .select('*')
      .ilike(filter.column, filter.value)
      .maybeSingle();

    if (!error && data && typeof data.bio === 'string' && data.bio.trim()) {
      return data.bio;
    }
  }

  return '';
}

async function openModal(name, isMentor) {
  const list = isMentor ? window.mentorsData : window.studentsData;
  const p = list.find((x) => x.name === name);

  document.getElementById("modalContent").innerHTML = `                 
        <div class="flex flex-col lg:flex-row gap-10 md:gap-14 items-center relative z-10">                     
            <div class="absolute -right-10 -bottom-10 opacity-[0.03] text-red-600 pointer-events-none">                         
                <i class="fa-solid fa-fingerprint" style="font-size: 250px;"></i>                     
            </div>                     
            <div class="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 relative group">                         
                <div class="absolute inset-0 border-2 border-red-600/20 rounded-full group-hover:border-red-600/60 transition-all duration-500 animate-[spin_8s_linear_infinite]"></div>                         
                <div class="absolute inset-3 border border-red-600/40 rounded-full border-dashed animate-[spin_12s_linear_infinite_reverse]"></div>                         
                <img src="${PROFILE_PLACEHOLDER}" data-profile-email="${p.email || ''}" data-local-src="${p.img || ''}" loading="lazy" class="w-full h-full object-cover rounded-full p-5 transition-all duration-700 shadow-[0_0_30px_rgba(255,0,0,0.15)]">                         
            </div>                     
            <div class="text-left max-w-xl w-full">                         
                <div class="flex items-center gap-3 mb-3">                             
                    <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>                             
                    <span class="text-red-600 mono text-xs uppercase tracking-[0.3em] font-bold">${isMentor ? "MENTOR" : "KALVIAN"} // ONLINE</span>                         
                </div>                         
                <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.1)] leading-[0.9] break-words max-w-full">${p.name}</h2>                         
                <p class="text-gray-400 mono text-sm md:text-base font-bold mb-6 uppercase tracking-widest border-l-2 border-red-600 pl-4">${p.role}</p>                                                  
                
                <div class="bg-black/40 border border-white/10 rounded-xl p-5 mb-8 backdrop-blur-sm shadow-inner relative overflow-hidden flex flex-col items-start">                             
                    <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-red-600/50 to-transparent"></div>                             
                    <p id="modalBioText" class="text-gray-300 text-base md:text-lg font-light bio-text" style="max-height: 3.2em;">>> SYNCING_WITH_MAINFRAME...</p>                             
                    <button id="modalBioToggle" onclick="toggleBio()" class="hidden text-red-500 hover:text-white mono text-[10px] uppercase font-bold tracking-widest mt-4 transition-all hover:translate-x-2 flex items-center gap-2 group">                                 
                        <i class="fa-solid fa-chevron-right text-[10px] group-hover:text-red-500"></i> Initialize_Decryption [Read_More]                             
                    </button>                         
                </div>                                                  
                
                <div class="flex flex-wrap gap-3 mt-4 w-full">                             
                    ${!isMentor
      ? `
                    <button onclick="openAchievements(&quot;${p.name}&quot;)" class="btn-cyber-alt flex-1 min-w-[130px] py-3 rounded-lg font-black text-xs uppercase text-center tracking-[0.1em] flex justify-center items-center gap-2">                                 
                        <i class="fa-solid fa-chart-pie text-lg"></i> Dossier                             
                    </button>`
      : ""
    }                             
                    ${p.linkedin
      ? `
                    <a href="${p.linkedin}" target="_blank" class="btn-cyber-main flex-1 min-w-[130px] py-3 rounded-lg font-black text-xs uppercase text-center tracking-[0.1em] flex justify-center items-center gap-2">                                 
                        <i class="fa-brands fa-linkedin-in text-lg"></i> Connect                             
                    </a>`
      : ""
    }                             
                    ${p.github
      ? `                             
                    <a href="${p.github}" target="_blank" class="btn-cyber-icon flex-1 min-w-[130px] py-3 rounded-lg font-black text-xs uppercase text-center tracking-[0.1em] flex justify-center items-center gap-2">                                 
                        <i class="fa-brands fa-github text-lg"></i> GitHub                             
                    </a>`
      : ""
    }                             
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}" class="btn-cyber-icon w-[46px] h-[46px] flex items-center justify-center rounded-lg text-lg flex-shrink-0">                                 
                        <i class="fa-solid fa-envelope"></i>                             
                    </a>                         
                </div>                     
            </div>                 
        </div>`;

  document.getElementById("modal-overlay").classList.add("active");
  document.body.style.overflow = "hidden";

  // Resolve modal image candidates (tries multiple filename variants)
  const modalImg = document.querySelector('#modalContent img[data-profile-email]');
  if (modalImg) tryResolveProfileImage(modalImg, p.email, p.img);

  // Background Sync for Bio if not mentor
  if (supabaseClient) {
    const bioEl = document.getElementById("modalBioText");
    if (bioEl) bioEl.classList.add('opacity-50');

    const resolvedBio = await fetchRoleBio(isMentor, p.email, p.name);
    if (bioEl) {
      bioEl.classList.remove('opacity-50');
      if (resolvedBio && resolvedBio.trim() !== "") {
        bioEl.innerText = resolvedBio;
        bioEl.classList.remove('text-red-900/40', 'italic');
      } else {
        bioEl.innerText = ">> NO_ANY_BIO_ADDED // PLEASE_UPDATE_VIA_DASHBOARD";
        bioEl.classList.add('text-red-900/40', 'italic');
      }
      const toggleBtn = document.getElementById("modalBioToggle");
      if (toggleBtn) {
        toggleBtn.style.display = bioEl.scrollHeight > bioEl.clientHeight ? "flex" : "none";
      }
    }
  }

  setTimeout(() => {
    const bioEl = document.getElementById("modalBioText");
    const toggleBtn = document.getElementById("modalBioToggle");
    if (bioEl && toggleBtn) {
      if (bioEl.scrollHeight > bioEl.clientHeight) {
        toggleBtn.style.display = "flex";
      } else {
        toggleBtn.style.display = "none";
      }
    }
  }, 50);
}

// --- DOSSIER PAGE LOGIC ---
function openAchievements(name) {
  document.getElementById("modal-overlay").classList.remove("active");
  document.body.style.overflow = "auto";
  // Open dossier in the same tab
  window.location.href = `dossier.html?name=${encodeURIComponent(name)}`;
}

function closeAchievements() {
  document.getElementById("dossier-overlay").classList.remove("active");
  document
    .querySelectorAll(".skill-fill")
    .forEach((el) => (el.style.transform = "scaleX(0)"));
  setTimeout(() => {
    document.body.style.overflow = "auto";
  }, 400);
}

function renderDossier() {
  const state = window.getDossierState(window.currentActiveSubject);
  const statsHTML = renderCodingStatsSection();
  const content = `
        ${statsHTML}                 
        <div class="flex flex-col gap-4">                     
            <div class="flex justify-between items-center border-b border-red-900/50 pb-2 mb-2">                         
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-folder-tree"></i> Deployed_Systems</h3>                         
                <button onclick="promptAddProject()" class="text-[10px] mono text-gray-400 hover:text-white border border-white/10 hover:border-white px-2 py-1 transition-all rounded bg-white/5">+ ADD</button>                     
            </div>                     
            ${state.projects
      .map(
        (pr, idx) => `                         
                <div class="dossier-card group">                             
                    <button onclick="removeProject(${idx})" class="absolute top-4 right-4 text-gray-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all" title="Remove"><i class="fa-solid fa-trash-can"></i></button>                             
                    <h4 class="text-white font-bold text-lg mb-1 pr-6">${pr.title}</h4>                             
                    <p class="text-gray-400 text-sm font-light">${pr.desc}</p>                             
                    <span class="inline-block mt-3 px-2 py-1 bg-red-600/10 text-red-500 text-[9px] mono uppercase rounded border border-red-600/30">Active_Node</span>                         
                </div>                     
            `,
      )
      .join("")}                 
        </div>                  

        <div class="flex flex-col gap-4">                     
            <div class="flex justify-between items-center border-b border-red-900/50 pb-2 mb-2">                         
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-id-badge"></i> Clearances</h3>                         
                <button onclick="promptAddCert()" class="text-[10px] mono text-gray-400 hover:text-white border border-white/10 hover:border-white px-2 py-1 transition-all rounded bg-white/5">+ ADD</button>                     
            </div>                     
            <div class="grid grid-cols-1 gap-4">                         
                ${state.certs
      .map(
        (c, idx) => `                             
                    <div class="dossier-card flex items-center gap-4 justify-between !py-4 group">                                 
                        <div class="flex items-center gap-4">                                     
                            <div class="w-8 h-8 rounded-full border border-red-600/50 flex items-center justify-center bg-red-600/10 text-red-500 text-xs">                                         
                                <i class="fa-solid fa-check"></i>                                     
                            </div>                                     
                            <span class="font-bold text-gray-200 text-sm">${c}</span>                                 
                        </div>                                 
                        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">                                     
                            <label class="cursor-pointer text-gray-500 hover:text-green-500 transition-colors p-2" title="Attach Document">                                         
                                <i class="fa-solid fa-paperclip text-lg"></i>                                         
                                <input type="file" class="hidden" onchange="alert(&quot;Simulated Upload: File attached successfully to ${c}&quot;)">                                     
                            </label>                                     
                            <button onclick="removeCert(${idx})" class="cursor-pointer text-gray-600 hover:text-red-600 transition-colors p-2" title="Remove"><i class="fa-solid fa-trash-can text-lg"></i></button>                                 
                        </div>                             
                    </div>                         
                `,
      )
      .join("")}                     
            </div>                 
        </div>                  

        <div class="flex flex-col gap-4">                     
            <div class="flex justify-between items-center border-b border-red-900/50 pb-2 mb-2">                         
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-microchip"></i> Combat_Matrix</h3>                         
                <button onclick="promptAddSkill()" class="text-[10px] mono text-gray-400 hover:text-white border border-white/10 hover:border-white px-2 py-1 transition-all rounded bg-white/5">+ ADD</button>                     
            </div>                     
            <div class="dossier-card space-y-6">                         
                ${state.skills
      .map(
        (s, idx) => `                             
                    <div class="group">                                 
                        <div class="flex justify-between items-end text-xs mono mb-2 text-gray-300">                                     
                            <div class="flex items-center gap-2">                                         
                                <span>${s.name}</span>                                         
                                <button onclick="removeSkill(${idx})" class="text-gray-600 hover:text-red-600 transition-colors text-[10px] opacity-0 group-hover:opacity-100" title="Remove"><i class="fa-solid fa-trash-can"></i></button>                                     
                            </div>                                     
                            <div class="flex items-center gap-3">                                         
                                <span class="text-red-500 font-bold text-sm" id="skill-val-${idx}">${s.pct}%</span>                                         
                                <button onclick="simulateHackerRankTest(${idx}, '${s.name}')" class="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 text-[9px] px-2 py-0.5 rounded transition-colors uppercase tracking-widest">Run_Test</button>                                     
                            </div>                                 
                        </div>                                 
                        <div class="skill-track">                                     
                            <div class="skill-fill" id="skill-bar-${idx}" style="width: ${s.pct}%"></div>                                 
                        </div>                             
                    </div>                         
                `,
      )
      .join("")}                     
            </div>                 
        </div>             
    `;
  document.getElementById("dossierContent").innerHTML = content;
  setTimeout(() => {
    document
      .querySelectorAll(".skill-fill")
      .forEach((el) => (el.style.transform = "scaleX(1)"));
  }, 50);
}

// --- ADD/REMOVE DATA LOGIC ---
function promptAddProject() {
  document.getElementById("input-modal-title").innerText =
    "NEW_DEPLOYMENT_NODE";
  document.getElementById("input-modal-body").innerHTML = `                 
        <input type="text" id="in-proj-title" placeholder="Project Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">                 
        <input type="text" id="in-proj-desc" placeholder="Brief Description" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">             
    `;
  document.getElementById("input-modal-save").onclick = () => {
    const t = document.getElementById("in-proj-title").value;
    const d = document.getElementById("in-proj-desc").value;
    if (t && d) {
      window
        .getDossierState(window.currentActiveSubject)
        .projects.push({ title: t, desc: d });
      renderDossier();
    }
    closeInputModal();
  };
  document.getElementById("input-modal").style.display = "flex";
}

function promptAddCert() {
  document.getElementById("input-modal-title").innerText =
    "NEW_SECURITY_CLEARANCE";
  document.getElementById("input-modal-body").innerHTML = `                 
        <input type="text" id="in-cert-title" placeholder="Certification Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">             
    `;
  document.getElementById("input-modal-save").onclick = () => {
    const t = document.getElementById("in-cert-title").value;
    if (t) {
      window.getDossierState(window.currentActiveSubject).certs.push(t);
      renderDossier();
    }
    closeInputModal();
  };
  document.getElementById("input-modal").style.display = "flex";
}

function promptAddSkill() {
  document.getElementById("input-modal-title").innerText = "NEW_COMBAT_SKILL";

  const languages = [
    "JavaScript",
    "TypeScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "Rust",
    "Go",
    "Swift",
    "Kotlin",
    "PHP",
    "Ruby",
    "SQL",
    "HTML/CSS",
    "R",
    "Dart",
    "Shell Scripting",
    "Assembly",
  ];

  let options = languages
    .map((lang) => `<option value="${lang}">${lang}</option>`)
    .join("");

  document.getElementById("input-modal-body").innerHTML = `
        <div class="relative">
            <select id="in-skill-name" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600 appearance-none cursor-pointer">
                <option value="" disabled selected>SELECT PROTOCOL (LANGUAGE)...</option>
                ${options}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-red-600">
                <i class="fa-solid fa-chevron-down text-xs"></i>
            </div>
        </div>
    `;

  document.getElementById("input-modal-save").onclick = () => {
    const t = document.getElementById("in-skill-name").value;
    if (t) {
      window
        .getDossierState(window.currentActiveSubject)
        .skills.push({ name: t, pct: 0 });
      renderDossier();
    }
    closeInputModal();
  };
  document.getElementById("input-modal").style.display = "flex";
}

function closeInputModal() {
  document.getElementById("input-modal").style.display = "none";
}
function removeProject(idx) {
  window.getDossierState(window.currentActiveSubject).projects.splice(idx, 1);
  renderDossier();
}
function removeCert(idx) {
  window.getDossierState(window.currentActiveSubject).certs.splice(idx, 1);
  renderDossier();
}
function removeSkill(idx) {
  window.getDossierState(window.currentActiveSubject).skills.splice(idx, 1);
  renderDossier();
}

// --- HACKERRANK SIMULATION ---
function simulateHackerRankTest(skillIndex, skillName) {
  const terminal = document.getElementById("terminal-modal");
  const termText = document.getElementById("terminal-text");
  const status = document.getElementById("term-status");

  terminal.style.display = "flex";
  termText.innerHTML = "";
  status.innerText = "CONNECTING...";
  status.className = "text-yellow-500 animate-pulse";

  const lines = [
    `> ESTABLISHING SECURE LINK TO HACKERRANK_API...`,
    `> AUTHENTICATING USER PROFILE... [OK]`,
    `> FETCHING ALGORITHMIC CHALLENGE: ${skillName.toUpperCase()} [LEVEL: MODERATE]...`,
    `> COMPILING SUBMITTED SOURCE CODE...`,
    `> RUNNING TEST CASES (0/15)...`,
    `> TEST CASES PASSED: 12/15. TIME COMPLEXITY: O(N log N).`,
  ];

  let delay = 0;
  lines.forEach((line, i) => {
    setTimeout(() => {
      const p = document.createElement("p");
      p.innerText = line;
      termText.appendChild(p);
    }, delay);
    delay += Math.random() * 500 + 400;
  });

  setTimeout(() => {
    const newScore = Math.floor(Math.random() * 20) + 80;
    const p = document.createElement("p");
    p.innerHTML = `<span class="text-white bg-green-600 px-2 mt-2 inline-block">ASSESSMENT COMPLETE. NEW SCORE: ${newScore}%</span>`;
    termText.appendChild(p);
    status.innerText = "SYNC_COMPLETE";
    status.className = "text-green-500";

    window.getDossierState(window.currentActiveSubject).skills[skillIndex].pct =
      newScore;
    setTimeout(() => {
      terminal.style.display = "none";
      document.getElementById(`skill-val-${skillIndex}`).innerText =
        `${newScore}%`;
      document.getElementById(`skill-bar-${skillIndex}`).style.width =
        `${newScore}%`;

      const bar = document.getElementById(`skill-bar-${skillIndex}`);
      bar.style.backgroundColor = "#0f0";
      bar.style.boxShadow = "0 0 20px #0f0";
      setTimeout(() => {
        bar.style.backgroundColor = "var(--k-red)";
        bar.style.boxShadow = "0 0 10px var(--k-red)";
      }, 1000);
    }, 1500);
  }, delay + 500);
}

// --- UPGRADED CHATBOT LOGIC ---
const chatKnowledge = {
  greetings: {
    triggers: ["hello", "hi", "hey", "sup", "yo", "greetings", "good morning", "good evening", "good afternoon", "what's up", "howdy"],
    responses: [
      "Greetings, operator. Neural_Assist_v3 is online and fully synchronized. How may I assist?",
      "Welcome back, agent. All systems nominal. What do you need?",
      "Connection established. I'm ready to process your queries.",
      "Hey there! Neural pathways active. Fire away with your question."
    ],
    suggestions: ["Who are the mentors?", "Show me features", "How many kalvians?"]
  },
  about: {
    triggers: ["about", "what is this", "what is kalvium", "tell me about", "explain", "purpose", "what does this"],
    responses: [
      "📡 <b>Kalvium 2.0 Portfolio</b> — Squad 138's tactical showcase. Built by Ashwin Raj, Dhinesh Babu & Sanjay Chelliah. Features include:<br>• Interactive student/mentor profiles<br>• Real-time coding stats (LeetCode, GitHub, HackerRank, CodeChef)<br>• Customizable themes & fonts<br>• Editable dossier system<br>• This Neural Assist chatbot"
    ],
    suggestions: ["Who built this?", "Show features", "Open settings"]
  },
  features: {
    triggers: ["features", "what can you do", "capabilities", "function", "tools", "options"],
    responses: [
      "⚡ <b>Available Systems:</b><br><br>🎨 <b>Theme Engine</b> — 3 modes, 10 accents, 7 fonts<br>📊 <b>Coding Intelligence</b> — Live stats from LeetCode/GitHub/HackerRank/CodeChef<br>📁 <b>Subject Dossiers</b> — Editable projects, certs & skills<br>🔍 <b>Database Scanner</b> — Real-time student search<br>🤖 <b>Neural Assist</b> — That's me!<br>🗺️ <b>Guided Tour</b> — Interactive walkthrough<br><br>Try asking me to navigate somewhere!"
    ],
    suggestions: ["Start tour", "Open settings", "Go to kalvians"]
  },
  students: {
    triggers: ["students", "kalvians", "how many students", "squad", "members", "classmates", "batch"],
    responses: [
      `📋 <b>Squad 138 Registry:</b> 36 active operatives enrolled in B.Tech CSE at St. Joseph's University, Chennai — powered by <b>Kalvium</b>.<br><br>Notable operatives include the 3 creators: <b>Dhinesh Babu G</b>, <b>Sanjay Chelliah C</b>, and <b>Ashwin Raj J J</b>.<br><br>Want me to look up a specific kalvian?`
    ],
    suggestions: ["Who are creators?", "Go to kalvians", "Open a profile"]
  },
  mentors: {
    triggers: ["mentor", "mentors", "teachers", "faculty", "guide", "instructor", "aravind", "karunakaran", "hanuram"],
    responses: [
      "👨‍🏫 <b>Leadership Nodes (Mentors):</b><br><br>• <b>Aravind R</b> — Academic Mentor, specializes in debugging & problem-solving<br>• <b>H. Karunakaran</b> — Campus Manager, focused on kalvian development<br>• <b>Hanuram T</b> — Mentor & Business Analyst, balancing logic, data & good vibes"
    ],
    suggestions: ["Go to mentors", "Tell me about Kalvium", "Show kalvians"]
  },
  creators: {
    triggers: ["who built", "who made", "creator", "developer", "who created", "built by"],
    responses: [
      "🛠️ <b>System Architects:</b><br><br>• <b>Ashwin Raj J J</b> — Creator_3, Lead Developer<br>• <b>Dhinesh Babu G</b> — Creator_1<br>• <b>Sanjay Chelliah C</b> — Creator_2<br><br>Built with HTML, CSS, JavaScript & deployed on Netlify."
    ],
    suggestions: ["Open Ashwin's profile", "Show features", "About Kalvium"]
  },
  coding: {
    triggers: ["coding", "leetcode", "github", "hackerrank", "codechef", "score", "coding stats", "rank", "dossier stats", "programming"],
    responses: [
      "📊 <b>Coding Intelligence System:</b><br><br>The portfolio tracks real-time coding skills across 4 platforms:<br><br>• <b>LeetCode</b> (35% weight) — Problem difficulty breakdown<br>• <b>GitHub</b> (25% weight) — Repos, stars, languages<br>• <b>HackerRank</b> (20% weight) — Profile level, practice signals<br>• <b>CodeChef</b> (20% weight) — Rating & ranks<br><br>Composite scores range from 0–100 with ranks: RECRUIT → OPERATIVE → SPECIALIST → ELITE → LEGENDARY<br><br>Open any student's <b>Dossier</b> to see their score!"
    ],
    suggestions: ["What ranks exist?", "Go to kalvians", "About features"]
  },
  ranks: {
    triggers: ["rank", "ranks", "legendary", "elite", "specialist", "operative", "recruit"],
    responses: [
      "🏆 <b>Rank Classification:</b><br><br>⬛ 0–19 — <span style='color:#888'>INITIALIZING</span><br>🟥 20–39 — <span style='color:#ff6b35'>RECRUIT</span><br>🟧 40–59 — <span style='color:#ffa500'>OPERATIVE</span><br>🟨 60–74 — <span style='color:#a0ff00'>SPECIALIST</span><br>🟩 75–89 — <span style='color:#00ff88'>ELITE</span><br>🟪 90–100 — <span style='color:#ff00aa'>LEGENDARY</span>"
    ],
    suggestions: ["How is score calculated?", "Open a dossier", "Show features"]
  },
  theme: {
    triggers: ["theme", "dark mode", "light mode", "color", "accent", "font", "customize", "settings"],
    responses: [
      "🎨 <b>Customization Matrix:</b><br><br>• <b>3 Themes</b> — Dark, Light, Device-adaptive<br>• <b>10 Accents</b> — Red, Cyan, Green, Purple, Amber, Pink, Blue, White, Matrix, Gold<br>• <b>7 Fonts</b> — Corp, Sci-Fi, Orbit, Terminal, Space, Mecha, Pixel<br>• <b>3 Sizes</b> — Small, Normal, Large<br><br>Want me to open Settings for you?"
    ],
    suggestions: ["Open settings", "Set dark mode", "Set accent cyan"]
  },
  help: {
    triggers: ["help", "commands", "what can i ask", "how to use"],
    responses: [
      "📖 <b>Neural_Assist Commands:</b><br><br>💬 <b>Ask anything</b> — Kalvians, mentors, features, coding stats<br>🧭 <b>Navigate</b> — \"Go to kalvians\", \"Go to mentors\", \"Go to contact\"<br>👤 <b>Open profiles</b> — \"Open Ashwin's profile\"<br>⚙️ <b>Settings</b> — \"Open settings\", \"Set dark mode\", \"Set accent cyan\"<br>🗺️ <b>Tour</b> — \"Start tour\"<br>🔄 <b>Actions</b> — \"Switch to gallery\", \"Switch to scroll\"<br><br>Or just chat — I don't bite! 🤖"
    ],
    suggestions: ["About this site", "Show kalvians", "Start tour"]
  },
  fun: {
    triggers: ["joke", "funny", "lol", "haha", "bored", "entertain", "fun"],
    responses: [
      "Why do programmers prefer dark mode? Because light attracts bugs. 🐛",
      "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?' 🍺",
      "There are only 10 types of people in the world: those who understand binary, and those who don't. 💻",
      "!false — It's funny because it's true. 😄",
      "A programmer's wife says: 'Go to the store, buy a gallon of milk. If they have eggs, get a dozen.' He returns with 12 gallons of milk. 🥛"
    ],
    suggestions: ["Tell another joke", "About this site", "Show features"]
  },
  thanks: {
    triggers: ["thank", "thanks", "thx", "appreciate", "great", "awesome", "cool", "nice"],
    responses: [
      "Happy to assist, operator! Neural pathways remain active. 🫡",
      "Acknowledged! Let me know if you need anything else. ⚡",
      "Mission accomplished. Standing by for further orders. 🎯"
    ],
    suggestions: ["Show features", "About Kalvium", "Help"]
  },
  goodbye: {
    triggers: ["bye", "goodbye", "see you", "exit", "quit", "close"],
    responses: [
      "Disconnecting neural link... Until next time, operator. 👋",
      "Session terminated. Stay sharp out there, agent. 🔒",
      "Logging off. Remember: the code never sleeps. 🌙"
    ],
    suggestions: []
  }
};

// Action commands the bot can execute
const chatActions = [
  { triggers: ["go to student", "show student", "go to kalvian", "navigate student"], action: () => { smoothScrollTo('students-section'); return "🧭 Navigating to the Kalvians registry..."; } },
  { triggers: ["go to mentor", "show mentor", "navigate mentor"], action: () => { smoothScrollTo('mentorGrid'); return "🧭 Navigating to Leadership Nodes..."; } },
  { triggers: ["go to contact", "show contact", "navigate contact"], action: () => { smoothScrollTo('contact-footer'); return "🧭 Navigating to Contact sector..."; } },
  { triggers: ["go to top", "go home", "scroll top"], action: () => { smoothScrollTo('home-top'); return "🧭 Returning to base..."; } },
  { triggers: ["open setting", "show setting"], action: () => { openSettings(); return "⚙️ Opening System Configuration..."; } },
  { triggers: ["start tour", "guided tour", "show tour", "take a tour"], action: () => { setTimeout(() => startTour(), 500); return "🗺️ Initiating guided tour sequence..."; } },
  { triggers: ["gallery mode", "switch gallery", "show gallery"], action: () => { switchView('gallery'); smoothScrollTo('students-section'); return "🖼️ Switching to Gallery mode..."; } },
  { triggers: ["scroll mode", "switch scroll", "feed mode"], action: () => { switchView('scroll'); smoothScrollTo('students-section'); return "📜 Switching to Scroll mode..."; } },
  { triggers: ["dark mode", "set dark"], action: () => { setTheme('dark'); return "🌙 Dark mode activated."; } },
  { triggers: ["light mode", "set light"], action: () => { setTheme('light'); return "☀️ Light mode activated."; } },
  { triggers: ["accent red"], action: () => { setAccent('red'); return "🔴 Accent set to Red."; } },
  { triggers: ["accent cyan"], action: () => { setAccent('cyan'); return "🔵 Accent set to Cyan."; } },
  { triggers: ["accent green"], action: () => { setAccent('green'); return "🟢 Accent set to Green."; } },
  { triggers: ["accent purple"], action: () => { setAccent('purple'); return "🟣 Accent set to Purple."; } },
  { triggers: ["accent gold"], action: () => { setAccent('gold'); return "🟡 Accent set to Gold."; } },
  { triggers: ["accent matrix"], action: () => { setAccent('matrix'); return "💚 Accent set to Matrix."; } },
  { triggers: ["accent pink"], action: () => { setAccent('pink'); return "💗 Accent set to Pink."; } },
];

function findStudentByName(query) {
  const lower = query.toLowerCase();
  const allPeople = [...(window.mentorsData || []), ...(window.studentsData || [])];
  return allPeople.find(p => {
    const nameLower = p.name.toLowerCase();
    return nameLower.includes(lower) || lower.includes(nameLower.split(' ')[0]);
  });
}

function generateReply(msg) {
  const lower = msg.toLowerCase().trim();

  // 1. Check action commands first
  for (const cmd of chatActions) {
    if (cmd.triggers.some(t => lower.includes(t))) {
      return { text: cmd.action(), suggestions: ["Show features", "Help"] };
    }
  }

  // 2. Check for "open profile" commands
  if (lower.includes("open") && (lower.includes("profile") || lower.includes("dossier"))) {
    const nameQuery = lower.replace(/open|profile|dossier|'s|the|of/gi, '').trim();
    const person = findStudentByName(nameQuery);
    if (person) {
      const isMentor = (window.mentorsData || []).some(m => m.name === person.name);
      setTimeout(() => openModal(person.name, isMentor), 600);
      return { text: `👤 Opening profile for <b>${person.name}</b>...`, suggestions: ["Show kalvians", "Go to mentors"] };
    }
  }

  // 3. Check for student/mentor name lookups
  const nameMatch = findStudentByName(lower.replace(/who is|tell me about|find|search|look up/gi, '').trim());
  if (nameMatch && lower.length > 3 && (lower.includes("who") || lower.includes("tell") || lower.includes("find") || lower.includes("about"))) {
    const isMentor = (window.mentorsData || []).some(m => m.name === nameMatch.name);
    const role = isMentor ? nameMatch.role : 'Kalvian';
    return {
      text: `👤 <b>${nameMatch.name}</b><br>Role: ${role}<br><br>"${nameMatch.bio.substring(0, 150)}${nameMatch.bio.length > 150 ? '...' : ''}"<br><br>${nameMatch.github ? `<a href="${nameMatch.github}" target="_blank" class="text-red-500 hover:underline">GitHub ↗</a> · ` : ''}<a href="${nameMatch.linkedin}" target="_blank" class="text-red-500 hover:underline">LinkedIn ↗</a>`,
      suggestions: [`Open ${nameMatch.name.split(' ')[0]}'s profile`, "Show all kalvians", "Back to help"]
    };
  }

  // 4. Check knowledge base
  for (const [, knowledge] of Object.entries(chatKnowledge)) {
    if (knowledge.triggers.some(t => lower.includes(t))) {
      const reply = knowledge.responses[Math.floor(Math.random() * knowledge.responses.length)];
      return { text: reply, suggestions: knowledge.suggestions || [] };
    }
  }

  // 5. Fallback
  const fallbacks = [
    "🤔 I couldn't parse that query. Try asking about <b>kalvians</b>, <b>mentors</b>, <b>features</b>, or type <b>help</b> for all commands.",
    "⚠️ Signal unclear. I can help with navigation, student info, coding stats, and more. Type <b>help</b> to see what I can do.",
    "📡 Query not recognized in the database. Try: \"Who are the mentors?\" or \"Show features\" or \"Go to kalvians\"."
  ];
  return { text: fallbacks[Math.floor(Math.random() * fallbacks.length)], suggestions: ["Help", "Show features", "About"] };
}

function toggleChatbot() {
  const panel = document.getElementById("chatbot-panel");
  if (panel.style.display === "flex") {
    panel.style.opacity = "0";
    panel.style.transform = "translateY(20px) scale(0.95)";
    setTimeout(() => (panel.style.display = "none"), 300);
  } else {
    panel.style.display = "flex";
    setTimeout(() => {
      panel.style.opacity = "1";
      panel.style.transform = "translateY(0) scale(1)";
    }, 10);
    document.getElementById("chatbot-input").focus();

    const msgs = document.getElementById("chatbot-messages");
    if (msgs.children.length === 0) {
      appendChatbotMessage("SYSTEM", "Neural_Assist_v3 online. All systems synchronized. How can I assist, operator?");
      setTimeout(() => {
        renderSuggestions(["Help", "About this site", "Show features"]);
      }, 600);
    }
  }
}

function sendChatMessage() {
  const input = document.getElementById("chatbot-input");
  const msg = input.value.trim();
  if (!msg) return;

  // Remove old suggestion chips
  const oldChips = document.getElementById("chatbot-messages").querySelector('.chat-suggestions');
  if (oldChips) oldChips.remove();

  appendChatbotMessage("USER", msg);
  input.value = "";

  const typingId = "typing-" + Date.now();
  setTimeout(() => {
    appendChatbotMessage(
      "SYSTEM",
      '<span class="animate-pulse flex items-center gap-2"><span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce"></span><span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style="animation-delay:0.1s"></span><span class="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce" style="animation-delay:0.2s"></span> Analyzing...</span>',
      typingId,
    );
  }, 300);

  const replyDelay = 800 + Math.random() * 700;
  setTimeout(() => {
    const typingEl = document.getElementById(typingId);
    if (typingEl) typingEl.remove();

    const result = generateReply(msg);
    appendChatbotMessage("SYSTEM", result.text);

    if (result.suggestions && result.suggestions.length > 0) {
      setTimeout(() => renderSuggestions(result.suggestions), 400);
    }
  }, replyDelay);
}

function renderSuggestions(suggestions) {
  if (!suggestions || suggestions.length === 0) return;
  const messages = document.getElementById("chatbot-messages");

  // Remove existing
  const old = messages.querySelector('.chat-suggestions');
  if (old) old.remove();

  const container = document.createElement('div');
  container.className = 'chat-suggestions flex flex-wrap gap-2 mt-2 mb-1';
  suggestions.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'text-[9px] mono uppercase tracking-wider px-3 py-1.5 border border-red-600/30 text-red-500 bg-red-600/5 hover:bg-red-600 hover:text-white rounded-full transition-all duration-200 cursor-pointer';
    btn.textContent = s;
    btn.onclick = () => {
      document.getElementById("chatbot-input").value = s;
      sendChatMessage();
    };
    container.appendChild(btn);
  });
  messages.appendChild(container);
  messages.scrollTop = messages.scrollHeight;
}

function appendChatbotMessage(sender, text, id = "") {
  const messages = document.getElementById("chatbot-messages");
  const isUser = sender === "USER";

  const alignClass = isUser ? "items-end" : "items-start";
  const bubbleClass = isUser
    ? "chat-user-bubble rounded-l-xl rounded-br-xl"
    : "chat-bot-bubble rounded-r-xl rounded-bl-xl";
  const senderColor = isUser ? "text-gray-500" : "text-red-500";

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const div = document.createElement("div");
  div.className = `flex flex-col ${alignClass} w-full`;
  if (id) div.id = id;

  div.innerHTML = `
        <span class="text-[9px] ${senderColor} mb-1 tracking-widest font-bold flex items-center gap-2">${sender} <span class="text-gray-600 font-normal">${time}</span></span>
        <div class="${bubbleClass} p-3 max-w-[85%] leading-relaxed shadow-md">
            ${text}
        </div>
    `;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

// --- MISC UTILS ---
function toggleBio() {
  const bioEl = document.getElementById("modalBioText");
  const toggleBtn = document.getElementById("modalBioToggle");
  if (!bioEl || !toggleBtn) return;
  const isExpanded = bioEl.classList.contains("expanded");
  if (!isExpanded) {
    bioEl.classList.add("expanded");
    bioEl.style.maxHeight = bioEl.scrollHeight + "px";
    toggleBtn.innerHTML =
      '<i class="fa-solid fa-chevron-up text-[10px] group-hover:text-red-500"></i> Execute_Collapse [Show_Less]';
  } else {
    bioEl.classList.remove("expanded");
    bioEl.style.maxHeight = "3.2em";
    toggleBtn.innerHTML =
      '<i class="fa-solid fa-chevron-right text-[10px] group-hover:text-red-500"></i> Initialize_Decryption [Read_More]';
  }
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("active");
  document.body.style.overflow = "auto";
}
function closeInstructions() {
  localStorage.setItem("cyber_v22", "done");
  document.getElementById("instruction-overlay").style.display = "none";
}

function switchView(v) {
  document
    .getElementById("btn-scroll")
    .classList.toggle("active", v === "scroll");
  document
    .getElementById("btn-scroll")
    .classList.toggle("text-gray-500", v !== "scroll");
  document
    .getElementById("btn-gallery")
    .classList.toggle("active", v === "gallery");
  document
    .getElementById("btn-gallery")
    .classList.toggle("text-gray-500", v !== "gallery");
  document
    .getElementById("view-scroll")
    .classList.toggle("hidden-view", v === "gallery");
  document
    .getElementById("view-gallery")
    .classList.toggle("hidden-view", v === "scroll");
}

// --- TOUR LOGIC ---
const tourSteps = [
  {
    sel: "nav",
    title: "Global Sync Array",
    text: "Top-level navigation node. Access main sectors, run global database scans, or configure system settings.",
  },
  {
    sel: "#searchBox",
    title: "Database Scanner",
    text: "Input parameters here to instantly filter operatives and architects by their identification tags.",
  },
  {
    sel: "#mentorGrid",
    title: "Leadership Nodes",
    text: "The architects guiding the protocol. Click any node to open their detailed dossier.",
  },
  {
    sel: "#students-section .flex.gap-2",
    title: "Matrix View Control",
    text: "Toggle the structural layout between linear scrolling (Feed) and grid alignment (Gallery).",
  },
  {
    sel: "#chatbot-toggle",
    title: "Neural Assist v2",
    text: "Initiate localized AI communication. Query the system or ask for operational assistance.",
  },
  {
    sel: "#auth-login-btn, #auth-user-btn",
    title: "Identity Synchronization",
    text: "Access your personalized dashboard by synchronizing your Google Identity with the Kalvium structural matrix.",
  },
];

let currentTourStep = 0;
let currentHighlightedEl = null;

function startTour() {
  closeSettings();
  setTimeout(() => {
    currentTourStep = 0;
    document.getElementById("tour-overlay").classList.remove("hidden");
    setTimeout(
      () => document.getElementById("tour-overlay").classList.add("active"),
      10,
    );
    document.getElementById("tour-tooltip").classList.remove("hidden");
    setTimeout(
      () => document.getElementById("tour-tooltip").classList.add("active"),
      10,
    );
    renderTourStep();
  }, 500);
}

function renderTourStep() {
  if (currentHighlightedEl) {
    currentHighlightedEl.classList.remove("tour-highlight");
  }

  const step = tourSteps[currentTourStep];
  const el = document.querySelector(step.sel);

  if (el) {
    currentHighlightedEl = el;
    el.classList.add("tour-highlight");
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  document.getElementById("tour-title").innerText = step.title;
  document.getElementById("tour-text").innerText = step.text;
  document.getElementById("tour-counter").innerText =
    `${currentTourStep + 1}/${tourSteps.length}`;

  const nextBtn = document.getElementById("tour-next-btn");
  if (currentTourStep === tourSteps.length - 1) {
    nextBtn.innerText = "Finish";
  } else {
    nextBtn.innerText = "Next";
  }
}

function nextTourStep() {
  if (currentTourStep < tourSteps.length - 1) {
    currentTourStep++;
    renderTourStep();
  } else {
    endTour();
  }
}

function endTour() {
  if (currentHighlightedEl)
    currentHighlightedEl.classList.remove("tour-highlight");
  currentHighlightedEl = null;
  document.getElementById("tour-overlay").classList.remove("active");
  document.getElementById("tour-tooltip").classList.remove("active");
  setTimeout(() => {
    document.getElementById("tour-overlay").classList.add("hidden");
    document.getElementById("tour-tooltip").classList.add("hidden");
  }, 300);
}

// --- SUPABASE & OAUTH LOGIN LOGIC ---
const SUPABASE_URL = 'https://gjkbbbklxqgxvjoqhvue.supabase.co';
// NOTE TO USER: Replace 'YOUR_SUPABASE_ANON_KEY' with your actual Anon Key from Project Settings -> API
const SUPABASE_ANON_KEY = 'sb_publishable_Z-ZLJ1kdtSnjYqXFwwDAQw_JKMikQQr';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

async function checkSession() {
  if (!supabaseClient) return;
  const { data: { session } } = await supabaseClient.auth.getSession();
  const loginBtn = document.getElementById('auth-login-btn');
  const userBtn = document.getElementById('auth-user-btn');

  if (session && session.user) {
    if (loginBtn) loginBtn.classList.add('hidden');
    if (userBtn) {
      userBtn.classList.remove('hidden');
      userBtn.classList.add('flex');
    }
  } else {
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (userBtn) {
      userBtn.classList.add('hidden');
      userBtn.classList.remove('flex');
    }
  }
}

async function handleLogin() {
  if (!supabaseClient) {
    alert("Supabase client is not initialized. Please ensure the CDN is loaded and Anon Key is provided.");
    return;
  }

  // Initiate Supabase Google OAuth Flow
  const { data, error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://gjkbbbklxqgxvjoqhvue.supabase.co/auth/v1/callback' // As requested, though commonly window.location.origin is used for SPA redirects
    }
  });

  if (error) {
    console.error("Authentication Error:", error.message);
    alert("OAuth Error: " + error.message);
  }
}

// Automatically check session on page load if supabase client exists
document.addEventListener('DOMContentLoaded', () => {
  checkSession();

  // Also listen for auth state changes (e.g. returning from OAuth redirect)
  if (supabaseClient) {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      checkSession();
    });
  }
});

(function highlightActiveSquad() {
  const btn138 = document.getElementById('btn-squad-138');
  const btn139 = document.getElementById('btn-squad-139');
  if (!btn138 || !btn139) return;

  // Wire up click handlers
  btn138.onclick = () => window.switchSquad && window.switchSquad('138');
  btn139.onclick = () => window.switchSquad && window.switchSquad('139');

  // Set initial active state
  if (squad === '138') {
    btn138.classList.add('squad-active');
    btn138.classList.remove('squad-inactive');
    btn139.classList.add('squad-inactive');
    btn139.classList.remove('squad-active');
  } else {
    btn139.classList.add('squad-active');
    btn139.classList.remove('squad-inactive');
    btn138.classList.add('squad-inactive');
    btn138.classList.remove('squad-active');
  }
})();