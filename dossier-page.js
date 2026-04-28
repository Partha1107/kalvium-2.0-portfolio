// =========================================================================
// DOSSIER PAGE — Standalone logic for dossier.html
// Reads student name from URL params, renders full dossier with coding stats
// =========================================================================

// --- SHARED DATA (same as script.js) ---
const mentorsData = [
  {
    name: "Aravind R",
    role: "MENTOR",
    img: "./Src/Aravind - Mentor.png",
    linkedin: "https://www.linkedin.com/in/aravind-r-812634245/",
    email: "aravind.r@kalvium.com",
  },
  {
    name: "H. Karunakaran",
    role: "CAMPUS MANAGER",
    img: "./Src/Karunakaran - Mentor.png",
    linkedin: "https://www.linkedin.com/in/h-karunakaran-3b1285376",
    email: "karunakaran.h@kalvium.com",
  },
  {
    name: "Hanuram T",
    role: "MENTOR",
    img: "./Src/Hanuram - Mentor.png",
    linkedin: "http://www.linkedin.com/in/hanuram-t",
    email: "hanuram.t@kalvium.com",
  },
];

const studentsData = [
  {
    name: "Dhinesh Babu G",
    role: "Kalvian/Creator_1",
    img: "./Src/Dhinesh Babu.png",
    github: "https://github.com/dhineshbabus138-commit",
    linkedin: "https://www.linkedin.com/in/dhinesh-babu-software-engg",
    email: "dhinesh.babu.s.138@kalvium.community",
  },
  {
    name: "Sanjay Chelliah C",
    role: "Kalvian/Creator_2",
    img: "./Src/Sanjay Chelliah.png",
    github: "https://github.com/SanCheS138",
    linkedin: "https://www.linkedin.com/in/sanjay-c-606981384",
    email: "sanjay.chelliah.s.138@kalvium.community",
  },
  {
    name: "Ashwin raj J J",
    role: "Kalvian/Creator_3",
    img: "./Src/Ashwin Raj.png",
    github: "https://github.com/Partha1107",
    linkedin: "https://www.linkedin.com/in/ashwin-raj-j-j-a8034a383",
    email: "ashwin.raj.s.138@kalvium.community",
  },
  {
    name: "Purushoth K",
    role: "Kalvian",
    img: "./Src/PURUSHOTHAMAN K.png",
    github: "https://github.com/purushothaman-k",
    linkedin: "https://www.linkedin.com/in/purushothaman-k-82129a325",
    email: "purushothaman.k.s.138@kalvium.community",
  },
  {
    name: "Vignesh M ",
    role: "Kalvian",
    img: "./Src/Vignesh M.png",
    github: "https://github.com/vigneshms138-creator",
    linkedin: "https://www.linkedin.com/in/vignesh-m-2b1690383",
    email: "vignesh.m.s.138@kalvium.community",
  },
  {
    name: "Manoj Kumar P",
    role: "Kalvian",
    img: "./Src/Manoj Kumar Ponnusamy.png",
    github: "https://github.com/manojponnusamy2032-star",
    linkedin: "https://www.linkedin.com/in/manoj-kumar-p-621049386",
    email: "manoj.ponnusamy.s.138@kalvium.community",
  },
  {
    name: "Pradheesh S",
    role: "Kalvian",
    img: "./Src/Pradheesh S.png",
    github: "https://github.com/pradheesh08-s",
    linkedin: "https://www.linkedin.com/in/pradheesh-s-a7a7a0381",
    email: "pradheesh.s.s.138@kalvium.community",
  },
  {
    name: "Shree Vidhya T ",
    role: "Kalvian",
    img: "./Src/Srividhya (1).png",
    github: "https://github.com/shreevidhyats138-cmyk",
    linkedin: "https://www.linkedin.com/in/shree-v-5a60a0382",
    email: "shree.vidhya.t.s.138@kalvium.community",
  },
  {
    name: "Arun Ragav G K G",
    role: "Kalvian",
    img: "./Src/Arun ragav G.K.G.png",
    github: "https://github.com/arun-ragav",
    linkedin: "https://www.linkedin.com/in/arun-ragav-589061384",
    email: "arun.ragav.s.138@kalvium.community",
  },
  {
    name: "Prasanna kumar A",
    role: "Kalvian",
    img: "./Src/Prasanna Kumar A.png",
    github: "https://github.com/prasannaas138-alt",
    linkedin: "https://www.linkedin.com/in/prasanna-kumar-a0a055384",
    email: "prasanna.a.s.138@kalvium.community",
  },
  {
    name: "Deboraah Issac I",
    role: "Kalvian",
    img: "./Src/DeboraahIssac I.png",
    github: "https://github.com/deboraahissacats138-cmyx",
    linkedin: "https://www.linkedin.com/in/deboraah-issac-ab0813388",
    email: "deboraahissac.i.s.138@kalvium.community",
  },
  {
    name: "Sasi Mahesh Y",
    role: "Kalvian",
    img: "./Src/Sasi Mahesh.png",
    github: "https://github.com/sasimaheshs138-loop",
    linkedin: "https://www.linkedin.com/in/sasi-mahesh-2aa3b4384",
    email: "sasi.mahesh.s.138@kalvium.community",
  },
  {
    name: "chandru A",
    role: "Kalvian",
    img: "./Src/Chandru A.png",
    github: "https://github.com/chandrua138",
    linkedin: "https://www.linkedin.com/in/chandru-a-331451384",
    email: "chandru.a.s.138@kalvium.community",
  },
  {
    name: "Sandeep V",
    role: "Kalvian",
    img: "./Src/Sandeep V.jpeg",
    github: "https://github.com/sandeepvs138-dev",
    linkedin: "https://www.linkedin.com/in/sandeep-v-947063384",
    email: "sandeep.v.s.138@kalvium.community",
  },
  {
    name: "ARVIND SELVA JAS J S",
    role: "Kalvian",
    img: "./Src/Arvind selva Jas J. S.jpg",
    github: "https://github.com/arvindselvajas0222-coder",
    linkedin: "https://www.linkedin.com/in/arvind-selva-jas-j-s-68a79b381",
    email: "arvind.j.s.138@kalvium.community",
  },
  {
    name: "Nithyanandharaj M",
    role: "Kalvian",
    img: "./Src/Nithyanadharaj.png",
    github: "https://github.com/nithyanandharajms138-debug",
    linkedin: "https://www.linkedin.com/in/nithyanandharaj-m-728189383",
    email: "nithyanandharaj.m.s.138@kalvium.community",
  },
  {
    name: "Tavanidhiragavi B B ",
    role: "Kalvian",
    img: "./Src/Tavanidhiragavi B.B.jpg",
    github: "https://github.com/tavanidhiragavibbs138-rgb",
    linkedin: "https://www.linkedin.com/in/tavanidhiragavi-b-b-0068b03a2",
    email: "tavanidhiragavi.bb.s.138@kalvium.community",
  },
  {
    name: "SHERLY N",
    role: "Kalvian",
    img: "./Src/Sherly N.jpg",
    github: "https://github.com/sherlyns138-crypto",
    linkedin: "https://www.linkedin.com/in/sherly-n-407881382",
    email: "sherly.n.s.138@kalvium.community",
  },
  {
    name: "chandru S ",
    role: "Kalvian",
    img: "./Src/Chandru S.jpg",
    github: "https://github.com/chandru24126",
    linkedin: "https://www.linkedin.com/in/chandru-sk-999077384",
    email: "chandru.s.s.138@kalvium.community",
  },
  {
    name: "Ashwath Palanisamy",
    role: "Kalvian",
    img: "./Src/Ashwath Palanisamy.jpg",
    github: "https://github.com/Ashwath-Palanisamy",
    linkedin: "https://www.linkedin.com/in/ashwathpalanisamy",
    email: "ashwath.p.s.138@kalvium.community",
  },
  {
    name: "kishore R",
    role: "Kalvian",
    img: "./Src/Kishore. R.png",
    github: "https://github.com/kishorers138-cyber",
    linkedin: "https://www.linkedin.com/in/kishore-r-6bb4a6383",
    email: "kishore.r.s.138@kalvium.community",
  },
  {
    name: "Deepika V",
    role: "Kalvian",
    img: "./Src/Deepika (1).jpg",
    github: "https://github.com/deepikavs138-design",
    linkedin: "https://www.linkedin.com/in/deepika-v-957099382",
    email: "deepika.v.s.138@kalvium.community",
  },
  {
    name: "HARICHARAN P",
    role: "Kalvian",
    img: "./Src/Hari charan (1).png",
    github: "https://github.com/harips138-droid",
    linkedin: "https://www.linkedin.com/in/hari-charan-p-5006393b1",
    email: "hari.p.s.138@kalvium.community",
  },
  {
    name: "karthikeyan",
    role: "Kalvian",
    img: "./Src/Karthikeyan A.E.png",
    github: "https://github.com/karthikeyan24-kk",
    linkedin: "https://www.linkedin.com/in/karthikeyan-a-e-8b3847381",
    email: "karthikeyan.ae.s.138@kalvium.community",
  },
  {
    name: "MOHAMMED THARIK S",
    role: "Kalvian",
    img: "./Src/Mohammed Tharik S.jpg",
    github: "https://github.com/MohammedTharikS",
    linkedin: "https://www.linkedin.com/in/mohammed-tharik-s-26b108384",
    email: "mohammed.tharik.s.138@kalvium.community",
  },
  {
    name: "Saigoutham G",
    role: "Kalvian",
    img: "./Src/Gundla Sai Gowtham.png",
    github: "https://github.com/gundlagowthams138-cell",
    linkedin: "https://www.linkedin.com/in/gundla-sai-gowtham-985460390",
    email: "gundla.gowtham.s.138@kalvium.community",
  },
  {
    name: "Ram CHARAN M",
    role: "Kalvian",
    img: "./Src/Ram Charan.png",
    github: "https://github.com/medaboinacharan-pixel",
    linkedin: "https://www.linkedin.com/in/ram-charan-b551133ab",
    email: "medaboina.charan.s.138@kalvium.community",
  },
  {
    name: "Dinesh p",
    role: "Kalvian",
    img: "./Src/Dinesh P.webp",
    github: "https://github.com/dineshps138-ds",
    linkedin: "https://www.linkedin.com/in/dinesh-prakasam-a8279a381",
    email: "dinesh.p.s.138@kalvium.community",
  },
  {
    name: "Surjith sri k",
    role: "Kalvian",
    img: "./Src/Surjith Sri K.jpeg",
    github: "https://github.com/surjithks138",
    linkedin: "https://kalvium.community",
    email: "surjith.k.s.138@kalvium.community",
  },
  {
    name: "Navya D ",
    role: "Kalvian",
    img: "./Src/Navya D.jpg",
    github: "https://github.com/navyads138-star",
    linkedin: "https://www.linkedin.com/in/navya-d-a1b187383",
    email: "navya.d.s.138@kalvium.community",
  },
  {
    name: "DAVID G",
    role: "Kalvian",
    img: "./Src/DAVID G.png",
    github: "https://github.com/davidgs138-cyber",
    linkedin: "https://www.linkedin.com/in/david-g-6bb3323b1",
    email: "david.g.s.138@kalvium.community",
  },
  {
    name: "Harshini J",
    role: "Kalvian",
    img: "./Src/Harshini J.png",
    github: "https://github.com/harshinijs138-svg",
    linkedin: "https://www.linkedin.com/in/harshini-j-244611383",
    email: "harshini.j.s.138@kalvium.community",
  },
  {
    name: "Udhaya E",
    role: "Kalvian",
    img: "./Src/Udhaya E.png",
    github: "https://github.com/udhayaes138-spec",
    linkedin: "https://www.linkedin.com/in/udhaya-e-a1b443383",
    email: "udhaya.e.s.138@kalvium.community",
  },
  {
    name: "Jeevanand J",
    role: "Kalvian",
    img: "./Src/Jeevanand j.png",
    github: "https://github.com/jeevanand-jaisankar",
    linkedin: "https://www.linkedin.com/in/jeevanand-j-575676281",
    email: "jeevanand.j.s.138@kalvium.community",
  },
  {
    name: "Edupalli sai praneeth",
    role: "Kalvian",
    img: "./Src/Edupalli Sai Praneeth Lokesh.png",
    github: "https://github.com/edupallilokeshs138-bot",
    linkedin: "https://www.linkedin.com/in/edupalli-sai-praneeth-3ab348383",
    email: "edupalli.lokesh.s.138@kalvium.community",
  },
  {
    name: "Chandana",
    role: "Kalvian",
    img: "./Src/Chadhana (1).png",
    github: "https://github.com/chandanaes139-lang",
    linkedin: "https://www.linkedin.com/in/chandana-elavarasan-a10964384",
    email: "chandana.e.s.139@kalvium.community",
  },
];

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

// --- INIT: Read URL params and render ---
document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

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
  const person = allPeople.find((p) => p.name.trim().toLowerCase() === name.trim().toLowerCase());

  if (!person) {
    document.getElementById("dossierContent").innerHTML =
      `<div class="lg:col-span-3 text-center py-20"><p class="text-gray-500 mono uppercase tracking-widest">Subject "${name}" not found</p><a href="index.html" class="text-red-600 mono text-sm mt-4 inline-block hover:underline">← Return to Main</a></div>`;
    return;
  }

  // Set page title
  document.title = `${person.name} — Dossier | Kalvium Squad 138`;
  window.currentActiveSubject = name;

  // --- FETCH REMOTE DATA ---
  let remoteDossier = null;

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
        // Normalize Skills (Dashboard saves strings, UI needs objects)
        if (remoteDossier.skills && Array.isArray(remoteDossier.skills)) {
          remoteDossier.skills = remoteDossier.skills.map(s => {
            if (typeof s === 'string') return { name: s, pct: 85 };
            return s;
          });
        }
        if (!remoteDossier.certs) remoteDossier.certs = [];
        if (!remoteDossier.projects) remoteDossier.projects = [];

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
  const isMentor = mentorsData.some((m) => m.name === name);
  const displayBio = remoteDossier ? remoteDossier.bio : person.bio;
  const displayEmail = person.email;
  const displayLinkedIn = remoteDossier?.linkedin_url || person.linkedin;
  const displayGitHub = remoteDossier?.github_username ? `https://github.com/${remoteDossier.github_username}` : person.github;

  document.getElementById("profileHeader").innerHTML = `
        <div class="dossier-card relative overflow-hidden">
            <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
            <div class="flex flex-col sm:flex-row items-center gap-8 p-4">
                <div class="relative group flex-shrink-0">
                    <div class="absolute inset-0 border-2 border-red-600/20 rounded-full group-hover:border-red-600/60 transition-all duration-500 animate-[spin_8s_linear_infinite]"></div>
                    <img src="${person.img}" class="w-28 h-28 rounded-full object-cover p-2 transition-all duration-700 shadow-[0_0_30px_rgba(255,0,0,0.15)]" alt="${person.name}">
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

  // getDossierState (Fallback to local if no remote)
  window.getDossierState = function (n) {
    if (remoteDossier) return remoteDossier;
    
    if (!window.dossierStates[n]) {
      const p = allPeople.find((x) => x.name === n);
      const ghUsername = p ? extractGitHubUsername(p.github) : "";
      window.dossierStates[n] = {
        projects: [],
        certs: [],
        skills: [
          { name: "JavaScript / TS", pct: 75 },
          { name: "Python", pct: 60 },
          { name: "C++ / Algorithms", pct: 85 },
        ],
      };
    }
    return window.dossierStates[n];
  };

  // Render dossier content
  renderDossier();
  loadCodingStats(name);
});

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
  lines.forEach((line) => {
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
