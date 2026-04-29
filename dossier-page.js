// =========================================================================
// DOSSIER PAGE — Standalone logic for dossier.html
// Reads student name from URL params, renders full dossier with coding stats
// =========================================================================

// --- SHARED DATA (same as script.js) ---
const mentorsData = [];
const studentsData = [];

// Make globally accessible (needed by coding-stats.js)
window.mentorsData = mentorsData;
window.studentsData = studentsData;
window.dossierStates = {};
window.currentActiveSubject = "";

const SUPABASE_URL = "https://gjkbbbklxqgxvjoqhvue.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Z-ZLJ1kdtSnjYqXFwwDAQw_JKMikQQr";
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

function extractGitHubUsername(url) {
  if (!url) return "";
  const parts = url.replace(/\/$/, "").split("/");
  return parts[parts.length - 1];
}

const SUPABASE_BUCKET_IMAGE_BASE =
  "https://gjkbbbklxqgxvjoqhvue.supabase.co/storage/v1/object/public/dossier_assets/Profile/profile_picture/";

const PROFILE_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

let profilePictureLookupClient = null;
const profilePictureLookupCache = new Map();

function getProfilePictureLookupClient() {
  if (profilePictureLookupClient) return profilePictureLookupClient;
  if (!window.supabase) return null;

  profilePictureLookupClient = window.supabase.createClient(
    "https://gjkbbbklxqgxvjoqhvue.supabase.co",
    "sb_publishable_Z-ZLJ1kdtSnjYqXFwwDAQw_JKMikQQr",
  );

  return profilePictureLookupClient;
}

function findProfilePictureUrlByEmail(email) {
  const normalized = (email || "").trim().toLowerCase();
  if (!normalized) return Promise.resolve("");
  // Always fetch latest profile images from storage (no cached promise)
  const promise = (async () => {
    const client = getProfilePictureLookupClient();
    if (!client) return "";

    const { data, error } = await client
      .storage
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
  })().catch(() => "");

  return promise;
}

async function tryResolveProfileImage(imgEl, email, localSrc) {
  if (!imgEl) return;
  const resolvedUrl = await findProfilePictureUrlByEmail(email);
  if (resolvedUrl) {
    const bust = `t=${Date.now()}`;
    imgEl.src = resolvedUrl + (resolvedUrl.includes('?') ? '&' : '?') + bust;
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

function resolveDossierImageSrc(src) {
  if (!src) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;

  const fileName = src.replace(/^\.\/Src\//, "");
  if (!fileName || fileName === src) return src;

  return `${SUPABASE_BUCKET_IMAGE_BASE}${encodeURIComponent(fileName)}`;
}

function getProfilePictureSrc(email) {
  if (!email) return "";
  const normalizedEmail = email.trim().toLowerCase();
  return `${SUPABASE_BUCKET_IMAGE_BASE}${normalizedEmail}`;
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
  };
}

function replaceArrayContents(target, entries) {
  target.splice(0, target.length, ...entries);
}

async function loadPeopleFromTables() {
  if (!supabaseClient) return;

  const [managementResult, kalvianResult] = await Promise.all([
    supabaseClient
      .from("management")
      .select("full_name, role, img_url, linkedin_url, email, bio, created_at")
      .order("full_name", { ascending: true }),
    supabaseClient
      .from("kalvian")
      .select("full_name, role, img_url, github_url, linkedin_url, email, bio, created_at, squad")
      .order("full_name", { ascending: true }),
  ]);

  const loadedMentors = [];
  if (!managementResult.error && Array.isArray(managementResult.data)) {
    managementResult.data.forEach((row) => {
      loadedMentors.push(normalizeTablePerson(row, row?.role || "LEADERSHIP"));
    });
  }

  const loadedStudents = [];
  if (!kalvianResult.error && Array.isArray(kalvianResult.data)) {
    kalvianResult.data.forEach((row) => {
      loadedStudents.push(normalizeTablePerson(row, row?.role || "KALVIAN"));
    });
  }

  replaceArrayContents(mentorsData, loadedMentors);
  replaceArrayContents(studentsData, loadedStudents);
  window.mentorsData = mentorsData;
  window.studentsData = studentsData;
}

window.getDossierState = function (n) {
  if (!window.dossierStates[n]) {
    const p = [...mentorsData, ...studentsData].find((x) => x.name === n);
    const ghUsername = p ? extractGitHubUsername(p.github) : "";
    window.dossierStates[n] = {
      projects: [],
      certs: [],
      skills: [
        { name: "JavaScript / TS", pct: 75 },
        { name: "Python", pct: 60 },
        { name: "C++ / Algorithms", pct: 85 },
      ],
      platforms: {
        github: ghUsername,
        leetcode: p?.leetcode || "",
        hackerrank: p?.hackerrank || "",
        codechef: p?.codechef || "",
      },
    };
  }

  if (window.remoteDossier && window.currentActiveSubject === n) {
    const remote = window.remoteDossier;
    const localState = window.dossierStates[n];
    const normalizedSkills = Array.isArray(remote.skills)
      ? remote.skills.map((s) => (typeof s === "string" ? { name: s, pct: 85 } : s))
      : localState.skills;

    window.dossierStates[n] = {
      ...localState,
      projects: Array.isArray(remote.projects) ? remote.projects : localState.projects,
      certs: Array.isArray(remote.certs) ? remote.certs : localState.certs,
      skills: normalizedSkills,
      platforms: {
        ...(localState.platforms || {}),
        github: remote.github_username || localState.platforms?.github || "",
        leetcode: remote.leetcode_username || localState.platforms?.leetcode || "",
        hackerrank: remote.hackerrank_username || localState.platforms?.hackerrank || "",
        codechef: remote.codechef_username || localState.platforms?.codechef || "",
      },
    };
  }

  return window.dossierStates[n];
};

// --- INIT: Read URL params and render ---
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");
  const emailParam = (params.get("email") || '').trim().toLowerCase();

  await loadPeopleFromTables();

  if (!name) {
    document.getElementById("dossierContent").innerHTML =
      '<div class="lg:col-span-3 text-center py-20"><p class="text-gray-500 mono uppercase tracking-widest">No subject specified</p><a href="index.html" class="text-red-600 mono text-sm mt-4 inline-block hover:underline">← Return to Main</a></div>';
    return;
  }

  // 1. Fetch Remote operative data to ensure sync
  if (supabaseClient) {
    try {
      const [mRes, sRes] = await Promise.all([
        supabaseClient.from('mentors').select('*'),
        supabaseClient.from('students').select('*')
      ]);
      if (mRes.data?.length > 0) {
        mentorsData.length = 0;
        mRes.data.forEach(m => mentorsData.push({
          name: m.full_name, role: m.role, img: m.img_url, linkedin: m.linkedin_url, email: m.email
        }));
      }
      if (sRes.data?.length > 0) {
        studentsData.length = 0;
        sRes.data.forEach(s => studentsData.push({
          name: s.full_name, role: s.role, img: s.img_url, github: s.github_url, linkedin: s.linkedin_url, email: s.email
        }));
      }
    } catch (e) {
      console.warn("Dossier Match Protocol: Offline Mode.");
    }
  }

  // Find the person locally (now synced with database)
  const allPeople = [...mentorsData, ...studentsData];
  const person = emailParam
    ? allPeople.find((p) => (p.email || '').trim().toLowerCase() === emailParam)
    : allPeople.find((p) => p.name && p.name.trim().toLowerCase() === (name || '').trim().toLowerCase());
  window.currentDossierPerson = person || null;

  // Debug: log loaded people when troubleshooting
  console.log('Dossier: requested name=', name, 'email=', emailParam);
  console.log('Dossier: loaded mentors=', mentorsData.length, mentorsData.map(m=>m.name));
  console.log('Dossier: loaded students=', studentsData.length, studentsData.map(s=>s.name));

  if (!person) {
    const available = allPeople.map((p) => `<li class="text-sm text-gray-400 mono">${p.name} ${p.email ? `(${p.email})` : ''}</li>`).join('');
    document.getElementById("dossierContent").innerHTML =
      `<div class="lg:col-span-3 text-center py-20"><p class="text-gray-500 mono uppercase tracking-widest">Subject "${emailParam || name}" not found</p><p class="text-gray-400 mono text-sm mt-2">Available subjects loaded from DB:</p><ul class="mt-3 space-y-1">${available || '<li class="text-sm text-gray-500 mono">(no entries)</li>'}</ul><a href="index.html" class="text-red-600 mono text-sm mt-4 inline-block hover:underline">← Return to Main</a></div>`;
    return;
  }

  // Set page title
  document.title = `${person.name} — Dossier | Kalvium Squad`;
  window.currentActiveSubject = person.name;

  // --- FETCH REMOTE DATA ---
  let remoteDossier = null;
  const isMentor = mentorsData.some((m) => m.name === name);
  let roleGitHubUsername = "";

  async function fetchManagementGithub(email, fullName) {
    return "";
  }

  async function fetchAndRender() {
    if (!supabaseClient) return;
    try {
      // Use Email as the primary link between studentsData and Supabase
      let { data } = await supabaseClient
        .from('dossiers')
        .select('*')
        .eq('email', person.email)
        .maybeSingle();

      // FALLBACK: If email is NULL in DB (common for existing records), try matching by name
      if (!data) {
        const { data: nameData } = await supabaseClient
          .from('dossiers')
          .select('*')
          .ilike('full_name', name)
          .maybeSingle();
        data = nameData;
      }

      if (data) {
        remoteDossier = data;
        window.remoteDossier = data;
        // Normalize Skills (Dashboard saves strings, UI needs objects)
        if (remoteDossier.skills && Array.isArray(remoteDossier.skills)) {
          remoteDossier.skills = remoteDossier.skills.map(s => {
            if (typeof s === 'string') return { name: s, pct: 85 };
            return s;
          });
        }
        if (!remoteDossier.certs) remoteDossier.certs = [];
        if (!remoteDossier.projects) remoteDossier.projects = [];
        if (!window.dossierStates[name]) {
          window.dossierStates[name] = {};
        }

        if (isMentor && !(remoteDossier.github_username || remoteDossier.github_url)) {
          const managementGithub = await fetchManagementGithub(person.email, name);
          if (managementGithub) {
            roleGitHubUsername = extractGitHubUsername(managementGithub);
            remoteDossier.github_username = roleGitHubUsername;
            remoteDossier.github_url = managementGithub;
          }
        }

        window.dossierStates[name] = {
          ...window.dossierStates[name],
          projects: remoteDossier.projects,
          certs: remoteDossier.certs,
          skills: remoteDossier.skills || window.dossierStates[name].skills || [],
          platforms: {
            ...(window.dossierStates[name].platforms || {}),
            github: remoteDossier.github_username || remoteDossier.github_url || window.dossierStates[name].platforms?.github || "",
            leetcode: remoteDossier.leetcode_username || window.dossierStates[name].platforms?.leetcode || "",
            hackerrank: remoteDossier.hackerrank_username || window.dossierStates[name].platforms?.hackerrank || "",
            codechef: remoteDossier.codechef_username || window.dossierStates[name].platforms?.codechef || "",
          },
        };

        // Redraw page header components that might have changed
        const innerBio = document.querySelector("#profileHeader p");
        if (innerBio) innerBio.innerText = remoteDossier.bio;
        
        renderDossier();
      }
    } catch (e) {
      console.error("Sync Error:", e);
    }
  }

  // Initial load
  await fetchAndRender();

  // --- ENABLE REALTIME SUBSCRIPTION ---
  if (supabaseClient) {
    supabaseClient
      .channel('dossier_changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'dossiers',
        filter: `email=eq.${person.email}` 
      }, (payload) => {
        console.log("Remote Override Detected. Synchronizing Matrix...");
        fetchAndRender();
      })
      .subscribe();
  }

  // Set header via initial data or person
  document.getElementById("dossier-name").innerText = `ID_${name.replace(/\s+/g, "_")}`;

  // Render profile header (prefer remote bio/links if available)
  const displayBio = remoteDossier ? remoteDossier.bio : person.bio;
  const displayEmail = person.email;
  const displayLinkedIn = remoteDossier?.linkedin_url || person.linkedin;
  const displayGitHub = remoteDossier?.github_username || remoteDossier?.github_url
    ? (remoteDossier?.github_username
      ? `https://github.com/${remoteDossier.github_username}`
      : remoteDossier?.github_url)
    : roleGitHubUsername
      ? `https://github.com/${roleGitHubUsername}`
      : person.github;
  const displayAvatar = PROFILE_PLACEHOLDER;

  document.getElementById("profileHeader").innerHTML = `
        <div class="dossier-card relative overflow-hidden">
            <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
            <div class="flex flex-col sm:flex-row items-center gap-8 p-4">
                <div class="relative group flex-shrink-0">
                    <div class="absolute inset-0 border-2 border-red-600/20 rounded-full group-hover:border-red-600/60 transition-all duration-500 animate-[spin_8s_linear_infinite]"></div>
        <img src="${displayAvatar}" data-profile-email="${person.email || ''}" data-local-src="${person.img || ''}" class="w-28 h-28 rounded-full object-cover p-2 transition-all duration-700 shadow-[0_0_30px_rgba(255,0,0,0.15)]" alt="${person.name}">
                </div>
                <div class="text-center sm:text-left flex-grow">
                    <div class="flex items-center gap-3 mb-2 justify-center sm:justify-start">
                        <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                        <span class="text-red-600 mono text-xs uppercase tracking-[0.3em] font-bold">${isMentor ? "MENTOR" : "KALVIAN"} // ONLINE</span>
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-2">${person.name}</h2>
                    <p class="text-gray-400 mono text-[10px] sm:text-xs leading-relaxed max-w-xl">${displayBio}</p>
                </div>
                <div class="flex gap-3 flex-shrink-0">
                    <a href="${displayLinkedIn}" target="_blank" class="btn-cyber-main px-5 py-3 rounded-lg font-black text-xs uppercase tracking-[0.1em] flex items-center gap-2">
                        <i class="fa-brands fa-linkedin-in"></i>
                    </a>
                    ${displayGitHub ? `<a href="${displayGitHub}" target="_blank" class="btn-cyber-icon px-5 py-3 rounded-lg font-black text-xs uppercase tracking-[0.1em] flex items-center gap-2"><i class="fa-brands fa-github"></i></a>` : ""}
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${displayEmail}" target="_blank" class="btn-cyber-icon px-4 py-3 rounded-lg text-lg flex items-center justify-center">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                </div>
            </div>
        </div>`;

  // Resolve profile image candidates then render dossier content
  resolveAllProfileImages();
  // Render dossier content
  renderDossier();
  loadCodingStats(name);
  // dossier saving is handled from the dashboard/kalvian flows; page-side auto-save helper removed
});

async function persistCurrentDossier() {
  if (!supabaseClient) return false;

  const activeName = window.currentActiveSubject;
  const person = window.currentDossierPerson;
  if (!activeName || !person) return false;

  const email = (person.email || '').trim().toLowerCase();
  if (!email) return false;

  const state = window.getDossierState(activeName) || {};
  const payload = {
    full_name: person.full_name || person.name || activeName,
    email,
    bio: state.bio || person.bio || '',
    projects: Array.isArray(state.projects) ? state.projects : [],
    certs: Array.isArray(state.certs) ? state.certs : [],
    skills: Array.isArray(state.skills) ? state.skills : [],
    github_username: state.platforms?.github || person.github || null,
    leetcode_username: state.platforms?.leetcode || person.leetcode || null,
    hackerrank_username: state.platforms?.hackerrank || person.hackerrank || null,
    codechef_username: state.platforms?.codechef || person.codechef || null,
    linkedin_url: state.platforms?.linkedin || person.linkedin || null,
  };

  const { error } = await supabaseClient.from('dossiers').upsert(payload, { onConflict: 'email' });
  if (error) {
    console.warn('Failed to persist dossier:', error);
    return false;
  }
  return true;
}

// =========================================================================
// DOSSIER RENDERING & INTERACTIVE FUNCTIONS
// =========================================================================

function renderDossier() {
  const state = window.getDossierState(window.currentActiveSubject);
  const statsHTML = renderCodingStatsSection();
  const content = `
        ${statsHTML}
        <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center border-b border-red-900/50 pb-2 mb-2">
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-folder-tree"></i> Deployed_Systems</h3>
            </div>
            ${state.projects && state.projects.length > 0
              ? state.projects.map(
                  (pr, idx) => `
                <div class="dossier-card group">
                    <h4 class="text-white font-bold text-lg mb-1 pr-6">${pr.title}</h4>
                    <p class="text-gray-400 text-[11px] mb-3 leading-relaxed">${pr.desc}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${pr.link ? `<a href="${pr.link}" target="_blank" class="px-2 py-1 bg-green-600/10 text-green-500 text-[9px] mono uppercase border border-green-600/30 hover:bg-green-600 hover:text-white transition-all"><i class="fa-solid fa-link mr-1"></i> Live_Demo</a>` : ''}
                        ${pr.video ? `<a href="${pr.video}" target="_blank" class="px-2 py-1 bg-red-600/10 text-red-500 text-[9px] mono uppercase border border-red-600/30 hover:bg-red-600 hover:text-white transition-all"><i class="fa-solid fa-play mr-1"></i> Video_Demo</a>` : ''}
                        ${pr.github ? `<a href="${pr.github}" target="_blank" class="px-2 py-1 bg-white/5 text-gray-400 text-[9px] mono uppercase border border-white/10 hover:border-white hover:text-white transition-all"><i class="fa-brands fa-github mr-1"></i> Repo</a>` : ''}
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="flex flex-col">
                            <span class="text-[9px] mono text-gray-500 uppercase tracking-widest">${pr.type === 'team' ? '<i class="fa-solid fa-users mr-1"></i> Squad_Mission' : '<i class="fa-solid fa-user mr-1"></i> Solo_Ops'}</span>
                            ${pr.type === 'team' && pr.members ? `<span class="text-[8px] mono text-gray-600 uppercase mt-0.5">Operatives: ${pr.members}</span>` : ''}
                        </div>
                        <span class="inline-block px-2 py-1 bg-red-600/10 text-red-500 text-[9px] mono uppercase rounded border border-red-600/30">Active_Node</span>
                    </div>
                </div>
            `,
                ).join("")
              : `
                <div class="dossier-card flex items-center gap-4 !py-8 justify-center opacity-50 grayscale">
                    <div class="text-center">
                        <i class="fa-solid fa-microchip text-red-600 text-2xl mb-2"></i>
                        <p class="mono text-[10px] text-gray-500 uppercase tracking-widest">No_Active_Nodes_Detected</p>
                        <p class="text-[9px] text-gray-600 mt-1">Deploy projects via Dashboard matrix.</p>
                    </div>
                </div>
              `
            }
        </div>

        <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center border-b border-red-900/50 pb-2 mb-2">
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-id-badge"></i> Advancement</h3>
            </div>
            <div class="grid grid-cols-1 gap-4">
                ${state.certs && state.certs.length > 0 
                  ? state.certs.map((c, idx) => `
                    <div class="dossier-card flex items-center gap-4 justify-between !py-4 group">
                        <div class="flex items-center gap-4">
                            <div class="w-8 h-8 rounded-full border border-red-600/50 flex items-center justify-center bg-red-600/10 text-red-500 text-xs"><i class="fa-solid fa-check"></i></div>
                            <div class="flex flex-col">
                                <span class="font-bold text-gray-200 text-sm">${c.title || c}</span>
                                <div class="flex gap-2 mt-1">
                                    ${c.link ? `<a href="${c.link}" target="_blank" class="text-[9px] text-blue-400 hover:text-blue-300 mono uppercase border-b border-blue-900/50 leading-none pb-0.5"><i class="fa-solid fa-up-right-from-square mr-1"></i> Verify</a>` : ''}
                                    ${c.image ? `<a href="${c.image}" target="_blank" class="text-[9px] text-red-400 hover:text-red-300 mono uppercase border-b border-red-900/50 leading-none pb-0.5"><i class="fa-solid fa-image mr-1"></i> View_Proof</a>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                  `).join("")
                  : `
                    <div class="dossier-card flex items-center gap-4 !py-8 justify-center opacity-50 grayscale">
                        <div class="text-center">
                            <i class="fa-solid fa-triangle-exclamation text-red-600 text-2xl mb-2"></i>
                            <p class="mono text-[10px] text-gray-500 uppercase tracking-widest">Advancement_Data_Missing</p>
                            <p class="text-[9px] text-gray-600 mt-1">Sync certifications via Dashboard nodes.</p>
                        </div>
                    </div>
                  `
                }
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

// --- ADD/REMOVE FUNCTIONS ---
function promptAddProject() {
  document.getElementById("input-modal-title").innerText =
    "NEW_DEPLOYMENT_NODE";
  document.getElementById("input-modal-body").innerHTML = `
        <input type="text" id="in-proj-title" placeholder="Project Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
        <input type="text" id="in-proj-desc" placeholder="Brief Description" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">`;
  document.getElementById("input-modal-save").onclick = () => {
    const t = document.getElementById("in-proj-title").value;
    const d = document.getElementById("in-proj-desc").value;
      if (t && d) {
        window
          .getDossierState(window.currentActiveSubject)
          .projects.push({ title: t, desc: d });
        renderDossier();
        loadCodingStats(window.currentActiveSubject);
        persistCurrentDossier().catch((error) => console.warn('Project persist failed:', error));
    }
    closeInputModal();
  };
  document.getElementById("input-modal").style.display = "flex";
}

function promptAddCert() {
  document.getElementById("input-modal-title").innerText =
    "NEW_SECURITY_CLEARANCE";
  document.getElementById("input-modal-body").innerHTML =
    `<input type="text" id="in-cert-title" placeholder="Certification Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">`;
  document.getElementById("input-modal-save").onclick = () => {
    const t = document.getElementById("in-cert-title").value;
      if (t) {
      window.getDossierState(window.currentActiveSubject).certs.push(t);
      renderDossier();
      loadCodingStats(window.currentActiveSubject);
      persistCurrentDossier().catch((error) => console.warn('Cert persist failed:', error));
    }
    closeInputModal();
  };
  document.getElementById("input-modal").style.display = "flex";
}

function promptAddSkill() {
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
  document.getElementById("input-modal-title").innerText = "NEW_COMBAT_SKILL";
  document.getElementById("input-modal-body").innerHTML = `
        <div class="relative">
            <select id="in-skill-name" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600 appearance-none cursor-pointer">
                <option value="" disabled selected>SELECT PROTOCOL (LANGUAGE)...</option>
                ${languages.map((l) => `<option value="${l}">${l}</option>`).join("")}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-red-600"><i class="fa-solid fa-chevron-down text-xs"></i></div>
        </div>`;
  document.getElementById("input-modal-save").onclick = () => {
    const t = document.getElementById("in-skill-name").value;
    if (t) {
      window
        .getDossierState(window.currentActiveSubject)
        .skills.push({ name: t, pct: 0 });
      renderDossier();
      loadCodingStats(window.currentActiveSubject);
      persistCurrentDossier().catch((error) => console.warn('Skill persist failed:', error));
    }
    closeInputModal();
  };
  document.getElementById("input-modal").style.display = "flex";
}

function promptConfigPlatforms() {
  const person = window.currentDossierPerson || {};
  const state = window.getDossierState(window.currentActiveSubject) || {};
  const platforms = state.platforms || {};

  document.getElementById('input-modal-title').innerText = 'PLATFORM_LINK_CONFIG';
  document.getElementById('input-modal-body').innerHTML = `
    <div class="space-y-4">
      <div>
        <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">GitHub URL</label>
        <input type="text" id="in-gh-user" value="${platforms.github || person.github || ''}" placeholder="https://github.com/username" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
      </div>
      <div>
        <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">LeetCode Username</label>
        <input type="text" id="in-lc-user" value="${platforms.leetcode || person.leetcode || ''}" placeholder="e.g. ashwin_raj" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
      </div>
      <div>
        <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">HackerRank Username</label>
        <input type="text" id="in-hr-user" value="${platforms.hackerrank || person.hackerrank || ''}" placeholder="e.g. ashwin_hr" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
      </div>
      <div>
        <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">CodeChef Username</label>
        <input type="text" id="in-cc-user" value="${platforms.codechef || person.codechef || ''}" placeholder="e.g. ashwin_cc" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
      </div>
    </div>`;

  document.getElementById('input-modal-save').onclick = async () => {
    const state = window.getDossierState(window.currentActiveSubject);
    state.platforms = {
      github: document.getElementById('in-gh-user').value.trim(),
      leetcode: document.getElementById('in-lc-user').value.trim(),
      hackerrank: document.getElementById('in-hr-user').value.trim(),
      codechef: document.getElementById('in-cc-user').value.trim(),
    };
    const saved = await persistCurrentDossier();
    if (saved) {
      closeInputModal();
      refreshCodingStats();
      renderDossier();
    }
  };

  document.getElementById('input-modal').style.display = 'flex';
}

function closeInputModal() {
  document.getElementById("input-modal").style.display = "none";
}
function removeProject(idx) {
  window.getDossierState(window.currentActiveSubject).projects.splice(idx, 1);
  renderDossier();
  loadCodingStats(window.currentActiveSubject);
}
function removeCert(idx) {
  window.getDossierState(window.currentActiveSubject).certs.splice(idx, 1);
  renderDossier();
  loadCodingStats(window.currentActiveSubject);
}
function removeSkill(idx) {
  window.getDossierState(window.currentActiveSubject).skills.splice(idx, 1);
  renderDossier();
  loadCodingStats(window.currentActiveSubject);
}
