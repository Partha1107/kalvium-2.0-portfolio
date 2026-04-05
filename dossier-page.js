// =========================================================================
// DOSSIER PAGE — Standalone logic for dossier.html
// Reads student name from URL params, renders full dossier with coding stats
// =========================================================================

// --- SHARED DATA (same as script.js) ---
const mentorsData = [
    { name: "Aravind R", role: "MENTOR", bio: "Academic Mentor specializing in debugging, problem-solving, and guiding future developers at Kalvium.", img: "./Src/Aravind - Mentor.png", linkedin: "https://www.linkedin.com/in/aravind-r-812634245/", email: "aravind.r@kalvium.com" },
    { name: "H. Karunakaran", role: "CAMPUS MANAGER", bio: "Academic Mentor focused on student development, problem-solving excellence, and career readiness through technology-driven learning.", img: "./Src/Karunakaran - Mentor.png", linkedin: "https://www.linkedin.com/in/h-karunakaran-3b1285376", email: "karunakaran.h@kalvium.com" },
    { name: "Hanuram T", role: "MENTOR", bio: "Academic mentor cum business analyst, balancing logic, data, and good vibes.", img: "./Src/Hanuram - Mentor.png", linkedin: "http://www.linkedin.com/in/hanuram-t", email: "hanuram.t@kalvium.com" }
];

const studentsData = [
    { name: "Dhinesh Babu G", role: "Kalvian/Creator_1", bio: "I am Dhinesh Babu, a focused and ambitious student who is working hard to build strong technical skills in programming and problem-solving.I care about organizing your life, improving your knowledge step by step, and preparing yourself for a successful future career.", img: "./Src/Dhinesh Babu.png", github: "https://github.com/dhineshbabus138-commit", linkedin: "https://www.linkedin.com/in/dhinesh-babu-software-engg", email: "dhinesh.babu.s.138@kalvium.community" },
    { name: "Sanjay Chelliah C", role: "Kalvian/Creator_2", bio: "I tend to show up quietly, like I was already there before anyone noticed.", img: "./Src/Sanjay Chelliah.png", github: "https://github.com/SanCheS138", linkedin: "https://www.linkedin.com/in/sanjay-c-606981384", email: "sanjay.chelliah.s.138@kalvium.community" },
    { name: "Ashwin raj J J", role: "Kalvian/Creator_3", bio: "My name is Ashwin, and I am currently studying at St. Joseph University. I am very interested in improving my communication skills and becoming more confident in speaking.", img: "./Src/Ashwin Raj.png", github: "https://github.com/Partha1107", linkedin: "https://www.linkedin.com/in/ashwin-raj-j-j-a8034a383", email: "ashwin.raj.s.138@kalvium.community" },
    { name: "Purushoth K", role: "Kalvian", bio: "B.Tech CSE Fresher | Future Software Developer | Passionate about Coding, AI & Web Technologies.", img: "./Src/PURUSHOTHAMAN K.png", github: "https://github.com/purushothaman-k", linkedin: "https://www.linkedin.com/in/purushothaman-k-82129a325", email: "purushothaman.k.s.138@kalvium.community" },
    { name: "Vignesh M ", role: "Kalvian", bio: "I am a first-year Computer Science student at Kalvium, passionate about learning and growing in the field of technology.", img: "./Src/Vignesh M.png", github: "https://github.com/vigneshms138-creator", linkedin: "https://www.linkedin.com/in/vignesh-m-2b1690383", email: "vignesh.m.s.138@kalvium.community" },
    { name: "Manoj Kumar P", role: "Kalvian", bio: "I am a dedicated learner focused on building strong fundamentals and practical skills in software development.", img: "./Src/Manoj Kumar Ponnusamy.png", github: "https://github.com/manojponnusamy2032-star", linkedin: "https://www.linkedin.com/in/manoj-kumar-p-621049386", email: "manoj.ponnusamy.s.138@kalvium.community" },
    { name: "Pradheesh S", role: "Kalvian", bio: "I am a First-Year B.Tech student at Kalvium with a strong interest in technology and cybersecurity.", img: "./Src/Pradheesh S.png", github: "https://github.com/pradheesh08-s", linkedin: "https://www.linkedin.com/in/pradheesh-s-a7a7a0381", email: "pradheesh.s.s.138@kalvium.community" },
    { name: "Shree Vidhya T ", role: "Kalvian", bio: "Hi, I'm Shree Vidhya. I'm currently a first-year college student who is passionate about learning and improving my skills.", img: "./Src/Srividhya (1).png", github: "https://github.com/shreevidhyats138-cmyk", linkedin: "https://www.linkedin.com/in/shree-v-5a60a0382", email: "shree.vidhya.t.s.138@kalvium.community" },
    { name: "Arun Ragav G K G", role: "Kalvian", bio: "Hi, I'm Arun Ragav G.K.G, an aspiring developer passionate about JavaScript, Python, and web development.", img: "./Src/Arun ragav G.K.G.png", github: "https://github.com/arun-ragav", linkedin: "https://www.linkedin.com/in/arun-ragav-589061384", email: "arun.ragav.s.138@kalvium.community" },
    { name: "Prasanna kumar A", role: "Kalvian", bio: "Hi, I'm Prasanna Kumar, a passionate programmer with a strong interest in Python and Artificial Intelligence.", img: "./Src/Prasanna Kumar A.png", github: "https://github.com/prasannaas138-alt", linkedin: "https://www.linkedin.com/in/prasanna-kumar-a0a055384", email: "prasanna.a.s.138@kalvium.community" },
    { name: "Deboraah Issac I", role: "Kalvian", bio: "Hi, I'm Deboraahissac, a first-year college student who's curious, motivated, and always ready to learn.", img: "./Src/DeboraahIssac I.png", github: "https://github.com/deboraahissacats138-cmyx", linkedin: "https://www.linkedin.com/in/deboraah-issac-ab0813388", email: "deboraahissac.i.s.138@kalvium.community" },
    { name: "Sasi Mahesh Y", role: "Kalvian", bio: "Hi, I'm Sasi Mahesh a curious and driven first-year college student who believes growth begins where comfort ends.", img: "./Src/Sasi Mahesh.png", github: "https://github.com/sasimaheshs138-loop", linkedin: "https://www.linkedin.com/in/sasi-mahesh-2aa3b4384", email: "sasi.mahesh.s.138@kalvium.community" },
    { name: "chandru A", role: "Kalvian", bio: "Motivated and dedicated student with a strong commitment to academic excellence and continuous learning.", img: "./Src/Chandru A.png", github: "https://github.com/chandrua138", linkedin: "https://www.linkedin.com/in/chandru-a-331451384", email: "chandru.a.s.138@kalvium.community" },
    { name: "Sandeep V", role: "Kalvian", bio: "My goal is to build a successful career and continue growing both personally and professionally.", img: "./Src/Sandeep V.jpeg", github: "https://github.com/sandeepvs138-dev", linkedin: "https://www.linkedin.com/in/sandeep-v-947063384", email: "sandeep.v.s.138@kalvium.community" },
    { name: "ARVIND SELVA JAS J S", role: "Kalvian", bio: "I am a passionate and dedicated student pursuing B.Tech in Computer Science Engineering.", img: "./Src/Arvind selva Jas J. S.jpg", github: "https://github.com/arvindselvajas0222-coder", linkedin: "https://www.linkedin.com/in/arvind-selva-jas-j-s-68a79b381", email: "arvind.j.s.138@kalvium.community" },
    { name: "Nithyanandharaj M", role: "Kalvian", bio: "I am a first-year Computer Science student at Kalvium, passionate about solving problems and building solutions through technology.", img: "./Src/Nithyanadharaj.png", github: "https://github.com/nithyanandharajms138-debug", linkedin: "https://www.linkedin.com/in/nithyanandharaj-m-728189383", email: "nithyanandharaj.m.s.138@kalvium.community" },
    { name: "Tavanidhiragavi B B ", role: "Kalvian", bio: "I am focused on learning, building, and growing as a software developer", img: "./Src/Tavanidhiragavi B.B.jpg", github: "https://github.com/tavanidhiragavibbs138-rgb", linkedin: "https://www.linkedin.com/in/tavanidhiragavi-b-b-0068b03a2", email: "tavanidhiragavi.bb.s.138@kalvium.community" },
    { name: "SHERLY N", role: "Kalvian", bio: "First-Year B. Tech CSE Student, Aspiring Software Developer.", img: "./Src/Sherly N.jpg", github: "https://github.com/sherlyns138-crypto", linkedin: "https://www.linkedin.com/in/sherly-n-407881382", email: "sherly.n.s.138@kalvium.community" },
    { name: "chandru S ", role: "Kalvian", bio: "Hi, I'm Chandru S. I'm someone who believes that every day is a new opportunity to learn and improve.", img: "./Src/Chandru S.jpg", github: "https://github.com/chandru24126", linkedin: "https://www.linkedin.com/in/chandru-sk-999077384", email: "chandru.s.s.138@kalvium.community" },
    { name: "Ashwath Palanisamy", role: "Kalvian", bio: "I'm a self-taught Flutter developer with a passion for learning new technologies and building user-friendly apps.", img: "./Src/Ashwath Palanisamy.jpg", github: "https://github.com/Ashwath-Palanisamy", linkedin: "https://www.linkedin.com/in/ashwathpalanisamy", email: "ashwath.p.s.138@kalvium.community" },
    { name: "kishore R", role: "Kalvian", bio: "I am a friendly and hardworking person. I always try to learn new things and improve myself.", img: "./Src/Kishore. R.png", github: "https://github.com/kishorers138-cyber", linkedin: "https://www.linkedin.com/in/kishore-r-6bb4a6383", email: "kishore.r.s.138@kalvium.community" },
    { name: "Deepika V", role: "Kalvian", bio: "B.Tech CSE Student | Aspiring Software Developer | Passionate About AI & Web Development.", img: "./Src/Deepika (1).jpg", github: "https://github.com/deepikavs138-design", linkedin: "https://www.linkedin.com/in/deepika-v-957099382", email: "deepika.v.s.138@kalvium.community" },
    { name: "HARICHARAN P", role: "Kalvian", bio: "I'm Haricharan, a focused and determined individual who believes in constant growth.", img: "./Src/Hari charan (1).png", github: "https://github.com/harips138-droid", linkedin: "https://www.linkedin.com/in/hari-charan-p-5006393b1", email: "hari.p.s.138@kalvium.community" },
    { name: "karthikeyan", role: "Kalvian", bio: "Hello, I'm Karthikeyan. I am a first-year college student with a strong passion for learning and developing new skills.", img: "./Src/Karthikeyan A.E.png", github: "https://github.com/karthikeyan24-kk", linkedin: "https://www.linkedin.com/in/karthikeyan-a-e-8b3847381", email: "karthikeyan.ae.s.138@kalvium.community" },
    { name: "MOHAMMED THARIK S", role: "Kalvian", bio: "Motivated and detail-oriented professional committed to excellence.", img: "./Src/Mohammed Tharik S.jpg", github: "https://github.com/MohammedTharikS", linkedin: "https://www.linkedin.com/in/mohammed-tharik-s-26b108384", email: "mohammed.tharik.s.138@kalvium.community" },
    { name: "Saigoutham G", role: "Kalvian", bio: "My name is Gundla Sai Gutham. I am a hardworking and dedicated person.", img: "./Src/Gundla Sai Gowtham.png", github: "https://github.com/gundlagowthams138-cell", linkedin: "https://www.linkedin.com/in/gundla-sai-gowtham-985460390", email: "gundla.gowtham.s.138@kalvium.community" },
    { name: "Ram CHARAN M", role: "Kalvian", bio: "I'm an editor. I turn the raw footage into emotional stories.", img: "./Src/Ram Charan.png", github: "https://github.com/medaboinacharan-pixel", linkedin: "https://www.linkedin.com/in/ram-charan-b551133ab", email: "medaboina.charan.s.138@kalvium.community" },
    { name: "Dinesh p", role: "Kalvian", bio: "Student at St. Joseph University, dedicated to academic growth and professional development.", img: "./Src/Dinesh P.webp", github: "https://github.com/dineshps138-ds", linkedin: "https://www.linkedin.com/in/dinesh-prakasam-a8279a381", email: "dinesh.p.s.138@kalvium.community" },
    { name: "Surjith sri k", role: "Kalvian", bio: "Hi, I'm Surjith Sri. I'm a student who loves technology and problem-solving.", img: "./Src/Surjith Sri K.jpeg", github: "https://github.com/surjithks138", linkedin: "https://kalvium.community", email: "surjith.k.s.138@kalvium.community" },
    { name: "Navya D ", role: "Kalvian", bio: "I am Navya, a B.Tech CSE (Applied AI) student at St. Joseph University, powered by Kalvium.", img: "./Src/Navya D.jpg", github: "https://github.com/navyads138-star", linkedin: "https://www.linkedin.com/in/navya-d-a1b187383", email: "navya.d.s.138@kalvium.community" },
    { name: "DAVID G", role: "Kalvian", bio: "Hi, I'm David. I'm someone who believes that every day is a new opportunity to learn and improve.", img: "./Src/DAVID G.png", github: "https://github.com/davidgs138-cyber", linkedin: "https://www.linkedin.com/in/david-g-6bb3323b1", email: "david.g.s.138@kalvium.community" },
    { name: "Harshini J", role: "Kalvian", bio: "B.Tech CSE Student @ St. Joseph's University | Kalvium Program | Aspiring Full-Stack Developer.", img: "./Src/Harshini J.png", github: "https://github.com/harshinijs138-svg", linkedin: "https://www.linkedin.com/in/harshini-j-244611383", email: "harshini.j.s.138@kalvium.community" },
    { name: "Udhaya E", role: "Kalvian", bio: "I am a first-year student passionate about learning new technologies and improving my skills.", img: "./Src/Udhaya E.png", github: "https://github.com/udhayaes138-spec", linkedin: "https://www.linkedin.com/in/udhaya-e-a1b443383", email: "udhaya.e.s.138@kalvium.community" },
    { name: "Jeevanand J", role: "Kalvian", bio: "I'm a CSE student. I'm into building things more than just studying them.", img: "./Src/Jeevanand j.png", github: "https://github.com/jeevanand-jaisankar", linkedin: "https://www.linkedin.com/in/jeevanand-j-575676281", email: "jeevanand.j.s.138@kalvium.community" },
    { name: "Edupalli sai praneeth", role: "Kalvian", bio: "Hi, I'm Sai Praneeth. I am a passionate and curious student who loves learning new technologies.", img: "./Src/Edupalli Sai Praneeth Lokesh.png", github: "https://github.com/edupallilokeshs138-bot", linkedin: "https://www.linkedin.com/in/edupalli-sai-praneeth-3ab348383", email: "edupalli.lokesh.s.138@kalvium.community" },
    { name: "Chandana", role: "Kalvian", bio: "I am a responsible and self-motivated individual who is always willing to learn and improve.", img: "./Src/Chadhana (1).png", github: "https://github.com/chandanaes139-lang", linkedin: "https://www.linkedin.com/in/chandana-elavarasan-a10964384", email: "chandana.e.s.139@kalvium.community" }
];

// Make globally accessible (needed by coding-stats.js)
window.mentorsData = mentorsData;
window.studentsData = studentsData;
window.dossierStates = {};
window.currentActiveSubject = "";

// --- INIT: Read URL params and render ---
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name');

    if (!name) {
        document.getElementById('dossierContent').innerHTML = '<div class="lg:col-span-3 text-center py-20"><p class="text-gray-500 mono uppercase tracking-widest">No subject specified</p><a href="index.html" class="text-red-600 mono text-sm mt-4 inline-block hover:underline">← Return to Main</a></div>';
        return;
    }

    // Find the person
    const allPeople = [...mentorsData, ...studentsData];
    const person = allPeople.find(p => p.name === name);

    if (!person) {
        document.getElementById('dossierContent').innerHTML = `<div class="lg:col-span-3 text-center py-20"><p class="text-gray-500 mono uppercase tracking-widest">Subject "${name}" not found</p><a href="index.html" class="text-red-600 mono text-sm mt-4 inline-block hover:underline">← Return to Main</a></div>`;
        return;
    }

    // Set page title
    document.title = `${person.name} — Dossier | Kalvium Squad 138`;
    window.currentActiveSubject = name;

    // Set header
    document.getElementById('dossier-name').innerText = `ID_${name.replace(/\s+/g, '_')}`;

    // Render profile header
    const isMentor = mentorsData.some(m => m.name === name);
    document.getElementById('profileHeader').innerHTML = `
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
                        <span class="text-red-600 mono text-xs uppercase tracking-[0.3em] font-bold">${isMentor ? 'MENTOR' : 'KALVIAN'} // ONLINE</span>
                    </div>
                    <h2 class="text-3xl sm:text-4xl font-black uppercase tracking-tighter text-white mb-2">${person.name}</h2>
                    <p class="text-gray-400 mono text-sm font-bold uppercase tracking-widest border-l-2 border-red-600 pl-4 inline-block">${person.role}</p>
                </div>
                <div class="flex gap-3 flex-shrink-0">
                    <a href="${person.linkedin}" target="_blank" class="btn-cyber-main px-5 py-3 rounded-lg font-black text-xs uppercase tracking-[0.1em] flex items-center gap-2">
                        <i class="fa-brands fa-linkedin-in"></i> Connect
                    </a>
                    ${person.github ? `<a href="${person.github}" target="_blank" class="btn-cyber-icon px-5 py-3 rounded-lg font-black text-xs uppercase tracking-[0.1em] flex items-center gap-2"><i class="fa-brands fa-github"></i> GitHub</a>` : ''}
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=${person.email}" target="_blank" class="btn-cyber-icon px-4 py-3 rounded-lg text-lg flex items-center justify-center">
                        <i class="fa-solid fa-envelope"></i>
                    </a>
                </div>
            </div>
        </div>`;

    // getDossierState
    window.getDossierState = function(n) {
        if (!window.dossierStates[n]) {
            const p = allPeople.find(x => x.name === n);
            const ghUsername = p ? extractGitHubUsername(p.github) : '';
            const savedPlatforms = getSavedPlatformConfig(n);
            window.dossierStates[n] = {
                projects: [
                    { title: "Project_Nexus", desc: "Distributed AI architecture bridging edge and cloud components." },
                    { title: "CyberShield v2.0", desc: "Automated packet analysis & anomaly detection firewall." }
                ],
                certs: ["Kalvium Sync Level_04", "AWS Certified Arch_Assoc"],
                skills: [
                    { name: "JavaScript / TS", pct: Math.floor(Math.random() * 30) + 40 },
                    { name: "Python", pct: Math.floor(Math.random() * 30) + 40 },
                    { name: "C++ / Algorithms", pct: Math.floor(Math.random() * 30) + 40 }
                ],
                platforms: savedPlatforms || {
                    github: ghUsername,
                    leetcode: p?.leetcode || '',
                    codeforces: p?.codeforces || ''
                }
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
                <button onclick="promptAddProject()" class="text-[10px] mono text-gray-400 hover:text-white border border-white/10 hover:border-white px-2 py-1 transition-all rounded bg-white/5">+ ADD</button>
            </div>
            ${state.projects.map((pr, idx) => `
                <div class="dossier-card group">
                    <button onclick="removeProject(${idx})" class="absolute top-4 right-4 text-gray-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all" title="Remove"><i class="fa-solid fa-trash-can"></i></button>
                    <h4 class="text-white font-bold text-lg mb-1 pr-6">${pr.title}</h4>
                    <p class="text-gray-400 text-sm font-light">${pr.desc}</p>
                    <span class="inline-block mt-3 px-2 py-1 bg-red-600/10 text-red-500 text-[9px] mono uppercase rounded border border-red-600/30">Active_Node</span>
                </div>
            `).join('')}
        </div>

        <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center border-b border-red-900/50 pb-2 mb-2">
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-id-badge"></i> Clearances</h3>
                <button onclick="promptAddCert()" class="text-[10px] mono text-gray-400 hover:text-white border border-white/10 hover:border-white px-2 py-1 transition-all rounded bg-white/5">+ ADD</button>
            </div>
            <div class="grid grid-cols-1 gap-4">
                ${state.certs.map((c, idx) => `
                    <div class="dossier-card flex items-center gap-4 justify-between !py-4 group">
                        <div class="flex items-center gap-4">
                            <div class="w-8 h-8 rounded-full border border-red-600/50 flex items-center justify-center bg-red-600/10 text-red-500 text-xs"><i class="fa-solid fa-check"></i></div>
                            <span class="font-bold text-gray-200 text-sm">${c}</span>
                        </div>
                        <button onclick="removeCert(${idx})" class="cursor-pointer text-gray-600 hover:text-red-600 transition-colors p-2 opacity-0 group-hover:opacity-100" title="Remove"><i class="fa-solid fa-trash-can text-lg"></i></button>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div class="flex justify-between items-center border-b border-red-900/50 pb-2 mb-2">
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2"><i class="fa-solid fa-microchip"></i> Combat_Matrix</h3>
                <button onclick="promptAddSkill()" class="text-[10px] mono text-gray-400 hover:text-white border border-white/10 hover:border-white px-2 py-1 transition-all rounded bg-white/5">+ ADD</button>
            </div>
            <div class="dossier-card space-y-6">
                ${state.skills.map((s, idx) => `
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
                        <div class="skill-track"><div class="skill-fill" id="skill-bar-${idx}" style="width: ${s.pct}%"></div></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.getElementById('dossierContent').innerHTML = content;
    setTimeout(() => { document.querySelectorAll('.skill-fill').forEach(el => el.style.transform = "scaleX(1)"); }, 50);
}

// --- ADD/REMOVE FUNCTIONS ---
function promptAddProject() {
    document.getElementById('input-modal-title').innerText = "NEW_DEPLOYMENT_NODE";
    document.getElementById('input-modal-body').innerHTML = `
        <input type="text" id="in-proj-title" placeholder="Project Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
        <input type="text" id="in-proj-desc" placeholder="Brief Description" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">`;
    document.getElementById('input-modal-save').onclick = () => {
        const t = document.getElementById('in-proj-title').value;
        const d = document.getElementById('in-proj-desc').value;
        if (t && d) { window.getDossierState(window.currentActiveSubject).projects.push({ title: t, desc: d }); renderDossier(); loadCodingStats(window.currentActiveSubject); }
        closeInputModal();
    };
    document.getElementById('input-modal').style.display = 'flex';
}

function promptAddCert() {
    document.getElementById('input-modal-title').innerText = "NEW_SECURITY_CLEARANCE";
    document.getElementById('input-modal-body').innerHTML = `<input type="text" id="in-cert-title" placeholder="Certification Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">`;
    document.getElementById('input-modal-save').onclick = () => {
        const t = document.getElementById('in-cert-title').value;
        if (t) { window.getDossierState(window.currentActiveSubject).certs.push(t); renderDossier(); loadCodingStats(window.currentActiveSubject); }
        closeInputModal();
    };
    document.getElementById('input-modal').style.display = 'flex';
}

function promptAddSkill() {
    const languages = ["JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "Rust", "Go", "Swift", "Kotlin", "PHP", "Ruby", "SQL", "HTML/CSS", "R", "Dart", "Shell Scripting", "Assembly"];
    document.getElementById('input-modal-title').innerText = "NEW_COMBAT_SKILL";
    document.getElementById('input-modal-body').innerHTML = `
        <div class="relative">
            <select id="in-skill-name" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600 appearance-none cursor-pointer">
                <option value="" disabled selected>SELECT PROTOCOL (LANGUAGE)...</option>
                ${languages.map(l => `<option value="${l}">${l}</option>`).join('')}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-red-600"><i class="fa-solid fa-chevron-down text-xs"></i></div>
        </div>`;
    document.getElementById('input-modal-save').onclick = () => {
        const t = document.getElementById('in-skill-name').value;
        if (t) { window.getDossierState(window.currentActiveSubject).skills.push({ name: t, pct: 0 }); renderDossier(); loadCodingStats(window.currentActiveSubject); }
        closeInputModal();
    };
    document.getElementById('input-modal').style.display = 'flex';
}

function closeInputModal() { document.getElementById('input-modal').style.display = 'none'; }
function removeProject(idx) { window.getDossierState(window.currentActiveSubject).projects.splice(idx, 1); renderDossier(); loadCodingStats(window.currentActiveSubject); }
function removeCert(idx) { window.getDossierState(window.currentActiveSubject).certs.splice(idx, 1); renderDossier(); loadCodingStats(window.currentActiveSubject); }
function removeSkill(idx) { window.getDossierState(window.currentActiveSubject).skills.splice(idx, 1); renderDossier(); loadCodingStats(window.currentActiveSubject); }

// --- HACKERRANK SIMULATION ---
function simulateHackerRankTest(skillIndex, skillName) {
    const terminal = document.getElementById('terminal-modal');
    const termText = document.getElementById('terminal-text');
    const status = document.getElementById('term-status');
    terminal.style.display = 'flex';
    termText.innerHTML = '';
    status.innerText = "CONNECTING...";
    status.className = "text-yellow-500 animate-pulse";

    const lines = [
        `> ESTABLISHING SECURE LINK TO HACKERRANK_API...`,
        `> AUTHENTICATING USER PROFILE... [OK]`,
        `> FETCHING ALGORITHMIC CHALLENGE: ${skillName.toUpperCase()} [LEVEL: MODERATE]...`,
        `> COMPILING SUBMITTED SOURCE CODE...`,
        `> RUNNING TEST CASES (0/15)...`,
        `> TEST CASES PASSED: 12/15. TIME COMPLEXITY: O(N log N).`
    ];
    let delay = 0;
    lines.forEach((line) => {
        setTimeout(() => { const p = document.createElement('p'); p.innerText = line; termText.appendChild(p); }, delay);
        delay += (Math.random() * 500) + 400;
    });

    setTimeout(() => {
        const newScore = Math.floor(Math.random() * 20) + 80;
        const p = document.createElement('p');
        p.innerHTML = `<span class="text-white bg-green-600 px-2 mt-2 inline-block">ASSESSMENT COMPLETE. NEW SCORE: ${newScore}%</span>`;
        termText.appendChild(p);
        status.innerText = "SYNC_COMPLETE"; status.className = "text-green-500";
        window.getDossierState(window.currentActiveSubject).skills[skillIndex].pct = newScore;
        setTimeout(() => {
            terminal.style.display = 'none';
            document.getElementById(`skill-val-${skillIndex}`).innerText = `${newScore}%`;
            document.getElementById(`skill-bar-${skillIndex}`).style.width = `${newScore}%`;
            const bar = document.getElementById(`skill-bar-${skillIndex}`);
            bar.style.backgroundColor = '#0f0'; bar.style.boxShadow = '0 0 20px #0f0';
            setTimeout(() => { bar.style.backgroundColor = 'var(--k-red)'; bar.style.boxShadow = '0 0 10px var(--k-red)'; }, 1000);
        }, 1500);
    }, delay + 500);
}
