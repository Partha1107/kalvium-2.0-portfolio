// =========================================================================
// PREVENT SCROLL RESTORATION ON REFRESH
// =========================================================================
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
});

// --- EARLY THEME, ACCENT & FONT INITIALIZATION (Prevents Flash) ---         
const colors = {             
    red: { main: '#FF3131', glow: 'rgba(255, 49, 49, 0.5)', trans: 'rgba(255, 49, 49, 0.15)' },             
    cyan: { main: '#00f0ff', glow: 'rgba(0, 240, 255, 0.5)', trans: 'rgba(0, 240, 255, 0.15)' },             
    green: { main: '#00ff00', glow: 'rgba(0, 255, 0, 0.5)', trans: 'rgba(0, 255, 0, 0.15)' },             
    purple: { main: '#b026ff', glow: 'rgba(176, 38, 255, 0.5)', trans: 'rgba(176, 38, 255, 0.15)' },             
    amber: { main: '#ff9900', glow: 'rgba(255, 153, 0, 0.5)', trans: 'rgba(255, 153, 0, 0.15)' },
    pink: { main: '#ff00aa', glow: 'rgba(255, 0, 170, 0.5)', trans: 'rgba(255, 0, 170, 0.15)' },
    blue: { main: '#0066ff', glow: 'rgba(0, 102, 255, 0.5)', trans: 'rgba(0, 102, 255, 0.15)' },
    lime: { main: '#ccff00', glow: 'rgba(204, 255, 0, 0.5)', trans: 'rgba(204, 255, 0, 0.15)' },
    white: { main: '#ffffff', glow: 'rgba(255, 255, 255, 0.5)', trans: 'rgba(255, 255, 255, 0.15)' },
    matrix: { main: '#03A062', glow: 'rgba(0, 255, 65, 0.5)', trans: 'rgba(0, 255, 65, 0.15)' }         
};          

let currentTheme = localStorage.getItem('cyber_theme') || 'dark';         
let currentAccent = localStorage.getItem('cyber_accent') || 'red';         
let currentFont = localStorage.getItem('cyber_font') || 'sans'; 
let currentFontSize = localStorage.getItem('cyber_fontsize') || 'md'; 

function applyTheme(mode) {             
    let isDark = true;             
    if (mode === 'device') isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;             
    else if (mode === 'light') isDark = false;              

    if (isDark) { document.documentElement.classList.remove('light-mode'); document.body.classList.remove('light-mode'); }             
    else { document.documentElement.classList.add('light-mode'); document.body.classList.add('light-mode'); }         
}          

function applyAccent(colorKey) {             
    const c = colors[colorKey];             
    document.documentElement.style.setProperty('--k-red', c.main);             
    document.documentElement.style.setProperty('--k-red-glow', c.glow);             
    document.documentElement.style.setProperty('--k-red-transparent', c.trans);         
}                  

function applyFont(fontKey) {
    const fontMap = {
        scifi: "'Rajdhani', sans-serif",
        orbit: "'Orbitron', sans-serif",
        mono: "'JetBrains Mono', monospace",
        space: "'Space Mono', monospace",
        pixel: "'VT323', monospace",
        mecha: "'Chakra Petch', sans-serif",
        sans: "'Inter', sans-serif"
    };
    document.documentElement.style.setProperty('--font-main', fontMap[fontKey] || fontMap.sans);
}

function applyFontSize(sizeKey) {
    if (sizeKey === 'sm') document.documentElement.style.setProperty('--font-scale', '14px');
    else if (sizeKey === 'lg') document.documentElement.style.setProperty('--font-scale', '18px');
    else document.documentElement.style.setProperty('--font-scale', '16px'); // md
}

applyTheme(currentTheme);         
applyAccent(currentAccent);          
applyFont(currentFont);
applyFontSize(currentFontSize);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {             
    if (currentTheme === 'device') applyTheme('device');         
});     

// =========================================================================
// WAIT FOR DOM TO LOAD BEFORE EXECUTING REMAINDER OF SCRIPT
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {

    // Prevent scrolling while loader is active
    document.body.style.overflow = 'hidden';

    // --- DATA & STATE ---         
    const mentorsData = [
        { name: "Aravind R", role: "MENTOR", bio: "Academic Mentor specializing in debugging, problem-solving, and guiding future developers at Kalvium.", img: "/src/Aravind - Mentor.png", linkedin: "https://www.linkedin.com/in/aravind-r-812634245/", email: "aravind.r@kalvium.com" },
        { name: "H. Karunakaran", role: "CAMPUS MANAGER", bio: "Academic Mentor focused on student development, problem-solving excellence, and career readiness through technology-driven learning.", img: "/src/Karunakaran - Mentor.png", linkedin: "https://www.linkedin.com/in/h-karunakaran-3b1285376", email: "karunakaran.h@kalvium.com" },
        { name: "Hanuram T", role: "MENTOR", bio: "Academic mentor cum business analyst, balancing logic, data, and good vibes.", img: "/src/Hanuram - Mentor.png", linkedin: "http://www.linkedin.com/in/hanuram-t", email: "hanuram.t@kalvium.com" }
        ];          

    const studentsData = [
            { name: "Dhinesh Babu",           role: "Kalvian/Creator_1", bio: "I am Dhinesh Babu, a focused and ambitious student who is working hard to build strong technical skills in programming and problem-solving.I care about organizing your life, improving your knowledge step by step, and preparing yourself for a successful future career.",                                                 img: "/Src/Dhinesh Babu.png", github: "https://github.com/dhineshbabus138-commit",      linkedin: "https://www.linkedin.com/in/dhinesh-babu-software-engg", email: "dhinesh.babu.s.138@kalvium.community" },
            { name: "Sanjay Chelliah",        role: "Kalvian/Creator_2", bio: "I tend to show up quietly, like I was already there before anyone noticed. I say normal things, but there’s usually something slightly off about the timing. I enjoy silence, late hours, and watching the world do its strange little routines. Sometimes I feel like I’m just passing through, taking mental notes for no clear reason. If you ask what I’m thinking, I might say “nothing”… but if you listen closely, you might hear me mumble a certain number more than once.",                                                                      img: "/src/Sanjay Chelliah.png", github: "https://github.com/SanCheS138",                  linkedin: "https://www.linkedin.com/in/sanjay-c-606981384", email: "sanjay.chelliah.s.138@kalvium.community" },
            { name: "Ashwin raj",             role: "Kalvian/Creator_3", bio: "My name is Ashwin, and I am currently studying at St. Joseph University. I am very interested in improving my communication skills and becoming more confident in speaking. I enjoy learning programming and exploring new technologies. I always try to develop my skills step by step and work towards becoming a better version of myself.",                                                     img: "/src/Ashwin Raj.png", github: "https://github.com/Partha1107",                  linkedin: "https://www.linkedin.com/in/ashwin-raj-j-j-a8034a383", email: "ashwin.raj.s.138@kalvium.community" },
            { name: "k.Purushoth",            role: "Kalvian", bio: "B.Tech CSE Fresher | Future Software Developer | Passionate about Coding, AI & Web Technologies.", img: "/src/PURUSHOTHAMAN K.png",  github: "https://github.com/purushothaman-k",             linkedin: "https://www.linkedin.com/in/purushothaman-k-82129a325", email: "purushothaman.k.s.138@kalvium.community" },
            { name: "Vignesh M ",             role: "Kalvian", bio: "I am a first-year Computer Science student at Kalvium, passionate about learning and growing in the field of technology. I enjoy coding, problem-solving, and exploring new technologies. My goal is to build a successful career as a software developer and contribute to innovative projects.",                                     img: "/src/Vignesh M.png",  github: "https://github.com/vigneshms138-creator",        linkedin: "https://www.linkedin.com/in/vignesh-m-2b1690383", email: "vignesh.m.s.138@kalvium.community" },
            { name: "Manoj Kumar P",          role: "Kalvian", bio: "I am a dedicated learner focused on building strong fundamentals and practical skills in software development.",                                 img: "/src/Manoj Kumar Ponnusamy.png",  github: "https://github.com/manojponnusamy2032-star",     linkedin: "https://www.linkedin.com/in/manoj-kumar-p-621049386", email: "manoj.ponnusamy.s.138@kalvium.community" },
            { name: "Pradheesh S",            role: "Kalvian", bio: "I am a First-Year B.Tech student at Kalvium with a strong interest in technology and cybersecurity. As a beginner in cybersecurity, I am actively learning the fundamentals of network security, ethical hacking, and system protection.I am passionate about understanding how systems work and how to secure them against vulnerabilities and threats. Currently, I am building my programming skills and exploring concepts like encryption, secure coding practices, and digital safety.My goal is to grow into a skilled cybersecurity professional who can help organizations protect their data and infrastructure. I am always eager to learn, experiment, and improve my technical skills.",                                     img: "/src/Pradheesh S.png",  github: "https://github.com/pradheesh08-s",               linkedin: "https://www.linkedin.com/in/pradheesh-s-a7a7a0381", email: "pradheesh.s.s.138@kalvium.community" },
            { name: "Shree Vidhya T ",        role: "Kalvian", bio: "Hi, I’m Shree Vidhya. I’m currently a first-year college student who is passionate about learning and improving my skills. I’m a dedicated and responsible person who enjoys teamwork and taking on new challenges. I’m always eager to grow both personally and professionally.",                                               img: "/src/Shree Vidhya T.png",  github: "https://github.com/shreevidhyats138-cmyk",       linkedin: "https://www.linkedin.com/in/shree-v-5a60a0382", email: "shree.vidhya.t.s.138@kalvium.community" },
            { name: "G.K.G.Arun Ragav",       role: "Kalvian", bio: "Hi, I’m Arun Ragav G.K.G, an aspiring developer passionate about JavaScript, Python, and web development. I enjoy solving problems, building interactive projects, and continuously improving my coding skills. ",                                                  img: "/src/Arun ragav G.K.G.png",  github: "https://github.com/arun-ragav",                  linkedin: "https://www.linkedin.com/in/arun-ragav-589061384", email: "arun.ragav.s.138@kalvium.community" },
            { name: "A.Prasanna kumar ",      role: "Kalvian", bio: "Hi, I’m Prasanna Kumar, a passionate programmer with a strong interest in Python and Artificial Intelligence. I enjoy solving problems, building projects, and exploring how AI can be used to create smart and useful applications. I am continuously learning and improving my skills in Python and AI, and I love turning ideas into real-world solutions through code. My goal is to grow as an AI developer and contribute to innovative and impactful technology.",                                                         img: "/src/Prasanna Kumar A.png",  github: "https://github.com/prasannaas138-alt",           linkedin: "https://www.linkedin.com/in/prasanna-kumar-a0a055384", email: "prasanna.a.s.138@kalvium.community" },
            { name: "Deboraah Issac I",       role: "Kalvian", bio: "Hi, I’m Deboraahissac, a first-year college student who’s curious, motivated, and always ready to learn. I enjoy working with others, taking on challenges, and continuously improving myself.",                                                            img: "/src/DeboraahIssac I.png",  github: "https://github.com/deboraahissacats138-cmyx",    linkedin: "https://www.linkedin.com/in/deboraah-issac-ab0813388", email: "deboraahissac.i.s.138@kalvium.community" },
            { name: "Sasi Mahesh ",           role: "Kalvian", bio: "Hi, I’m Sasi Mahesh a curious and driven first-year college student who believes growth begins where comfort ends. I’m passionate about learning new concepts, especially in technology, and constantly look for ways to sharpen my skills and think differently. I enjoy collaborating with people, brainstorming ideas, and solving problems that push me to think deeper.",                                                               img: "/src/Sasi Mahesh.png",  github: "https://github.com/sasimaheshs138-loop",             linkedin: "https://www.linkedin.com/in/sasi-mahesh-2aa3b4384", email: "sasi.mahesh.s.138@kalvium.community" },
            { name: "chandru.a",              role: "Kalvian", bio: "Motivated and dedicated student with a strong commitment to academic excellence and continuous learning. Eager to apply knowledge, develop practical skills, and contribute positively to team environments.",                                                        img: "/src/Chandru A.png", github: "https://github.com/chandrua138",                 linkedin: "https://www.linkedin.com/in/chandru-a-331451384", email: "chandru.a.s.138@kalvium.community" },
            { name: "Sandeep.V",              role: "Kalvian", bio: "My goal is to build a successful career and continue growing both personally and professionally.",                                         img: "/src/Sandeep V.jpeg", github: "https://github.com/sandeepvs138-dev",            linkedin: "https://www.linkedin.com/in/sandeep-v-947063384", email: "sandeep.v.s.138@kalvium.community" },
            { name: "ARVIND SELVA JAS J S",   role: "Kalvian", bio: "I am a passionate and dedicated student pursuing B.Tech in Computer Science Engineering. I have a strong interest in programming, problem-solving, and exploring new technologies. My goal is to become a skilled software developer and contribute to innovative projects.'",                                                          img: "/src/Arvind selva Jas J. S.jpg", github: "https://github.com/arvindselvajas0222-coder",    linkedin: "https://www.linkedin.com/in/arvind-selva-jas-j-s-68a79b381", email: "arvind.j.s.138@kalvium.community" },
            { name: "Nithyanandharaj.M",      role: "Kalvian", bio: "I am a first-year Computer Science student at Kalvium (St. Joseph’s University, Chennai), passionate about solving problems and building solutions through technology. I enjoy coding and have been learning Python, Java and JavaScript to strengthen my programming skills.I see myself as a creative thinker and logical problem solver who loves taking on challenges that require innovative solutions. ",                                                             img: "/src/Nithyanadharaj.png", github: "https://github.com/nithyanandharajms138-debug",  linkedin: "https://www.linkedin.com/in/nithyanandharaj-m-728189383", email: "nithyanandharaj.m.s.138@kalvium.community" },
            { name: "Tavanidhiragavi.B.B ",   role: "Kalvian", bio: "I am focused on learning, building, and growing as a software developer",                                                       img: "/src/Tavanidhiragavi B.B.jpg", github: "https://github.com/tavanidhiragavibbs138-rgb",   linkedin: "https://www.linkedin.com/in/tavanidhiragavi-b-b-0068b03a2", email: "tavanidhiragavi.bb.s.138@kalvium.community" },
            { name: "SHERLY N",              role: "Kalvian", bio: "First-Year B. Tech CSE Student, Aspiring Software Developer, Eager to Learn, Solve & Build. Computer Science Undergraduate, Exploring Coding, AI & Web Development",                                                             img: "/src/Sherly N.jpg", github: "https://github.com/sherlyns138-crypto",          linkedin: "https://www.linkedin.com/in/sherly-n-407881382", email: "sherly.n.s.138@kalvium.community" },
            { name: "chandru S ",             role: "Kalvian", bio: "Hi, I’m Chandru S. I’m someone who believes that every day is a new opportunity to learn and improve. As a first-year college student, I’m exploring new ideas, building my skills, and pushing myself beyond my comfort zone. I enjoy working with others, sharing ideas, and turning challenges into learning experiences. My goal is simple — to grow stronger and better every day",                                                                            img: "/src/Chandru S.jpg", github: "https://github.com/chandru24126",                linkedin: "https://www.linkedin.com/in/chandru-sk-999077384", email: "chandru.s.s.138@kalvium.community" },
            { name: "Ashwath Palanisamy",     role: "Kalvian", bio: "I’m a self‑taught Flutter developer with a passion for learning new technologies and building user‑friendly apps. Skilled in Python, Supabase, and Vercel deployment, I focus on creating secure, scalable solutions while continuously expanding my knowledge. My curiosity drives me to explore modern tools and frameworks to stay ahead in the tech landscape",                                                                img: "/src/Ashwath Palanisamy.jpg", github: "https://github.com/Ashwath-Palanisamy",          linkedin: "https://www.linkedin.com/in/ashwathpalanisamy", email: "ashwath.p.s.138@kalvium.community" },
            { name: "kishore.R",              role: "Kalvian", bio: "I am a friendly and hardworking person.I always try to learn new things and improve myself.",                                                         img: "/src/Kishore. R.png", github: "https://github.com/kishorers138-cyber",          linkedin: "https://www.linkedin.com/in/kishore-r-6bb4a6383", email: "kishore.r.s.138@kalvium.community" },
            { name: "Deepika V",              role: "Kalvian", bio: "B.Tech CSE Student | Aspiring Software Developer | Passionate About AI & Web Development | Learning, Building, Growing",                                                                        img: "/src/Deepika V.png", github: "https://github.com/deepikavs138-design",         linkedin: "https://www.linkedin.com/in/deepika-v-957099382", email: "deepika.v.s.138@kalvium.community" },
            { name: "HARICHARAN.P",           role: "Kalvian", bio: "I’m Haricharan, a focused and determined individual who believes in constant growth.I adapt quickly to new challenges and strive to improve every day. With a positive mindset and strong work ethic, I aim to achieve success.",                                                                    img: "/src/Hari Charan P.png", github: "https://github.com/harips138-droid",             linkedin: "https://www.linkedin.com/in/hari-charan-p-5006393b1", email: "hari.p.s.138@kalvium.community" },
            { name: "karthikeyan",            role: "Kalvian", bio: "Hello, I’m Karthikeyan. I am a first-year college student with a strong passion for learning and developing new skills. I consider myself a committed and responsible individual who works well in teams and enjoys taking on new challenges. I am continuously striving to grow both personally and professionally, and I look forward to gaining more experience and contributing effectively wherever I can.”",                                                                      img: "/src/Karthikeyan A.E.png", github: "https://github.com/karthikeyan24-kk",            linkedin: "https://www.linkedin.com/in/karthikeyan-a-e-8b3847381", email: "karthikeyan.ae.s.138@kalvium.community" },
            { name: "MOHAMMED THARIK S",      role: "Kalvian", bio: "Motivated and detail-oriented professional committed to excellence. Always eager to learn, adapt, and contribute effectively to meaningful projects.",                                                           img: "/src/Mohammed Tharik S.jpg", github: "https://github.com/MohammedTharikS",             linkedin: "https://www.linkedin.com/in/mohammed-tharik-s-26b108384", email: "mohammed.tharik.s.138@kalvium.community" },
            { name: "Saigoutham.G",           role: "Kalvian", bio: "My name is Gundla Sai Gutham. I am a hardworking and dedicated person. I always try to learn new things and improve myself.My goal is to achieve success and make my family proud.",                                                           img: "/src/Gundla Sai Gowtham.png", github: "https://github.com/gundlagowthams138-cell",      linkedin: "https://www.linkedin.com/in/gundla-sai-gowtham-985460390", email: "gundla.gowtham.s.138@kalvium.community" },
            { name: "Ram CHARAN M",          role: "Kalvian", bio: "I'm an editor.i turn the raw footage into emotional stories",                                                            img: "/src/Ram Charan.png", github: "https://github.com/medaboinacharan-pixel",       linkedin: "https://www.linkedin.com/in/ram-charan-b551133ab", email: "medaboina.charan.s.138@kalvium.community" },
            { name: "Dinesh p",               role: "Kalvian", bio: "Student at St. Joseph University, Palanchur, dedicated to academic growth and professional development.Focused on building a strong foundation in my field within the university's vibrant learning environment. Aspiring professional committed to excellence and contributing to the campus community.",                                                                               img: "/src/Dinesh P.webp", github: "https://github.com/dineshps138-ds",              linkedin: "https://www.linkedin.com/in/dinesh-prakasam-a8279a381", email: "dinesh.p.s.138@kalvium.community" },
            { name: "Surjith sri k",          role: "Kalvian", bio: "Hi, I’m Surjith Sri. I’m a student who loves technology and problem-solving. I’m currently preparing for a career as a software engineer and spending time learning Python and development skills.",                                                         img: "/src/Surjith Sri K.jpeg", github: "https://github.com/surjithks138",                linkedin: "https://kalvium.community", email: "surjith.k.s.138@kalvium.community" },
            { name: "Navya D ",               role: "Kalvian", bio: "I am Navya, a B.Tech CSE (Applied AI) student at St. Joseph University, powered by Kalvium, with my schooling completed at Sri Chaitanya Techno School. Passionate about combining creativity with technology, I bring a curious mindset that drives me to learn, explore, and solve real-world problems through innovative AI-driven solutions.",                                                                    img: "/src/Navya D.jpg", github: "https://github.com/navyads138-star",             linkedin: "https://www.linkedin.com/in/navya-d-a1b187383", email: "navya.d.s.138@kalvium.community" },
            { name: "DAVID G",                role: "Kalvian", bio: "Hi, I’m David. I’m someone who believes that every day is a new opportunity to learn and improve. As a first-year college student, I’m exploring new ideas, building my skills, and pushing myself beyond my comfort zone. I enjoy working with others, sharing ideas, and turning challenges into learning experiences. My goal is simple — to grow stronger and better every day",                                                                         img: "/src/DAVID G.png", github: "https://github.com/davidgs138-cyber",            linkedin: "https://www.linkedin.com/in/david-g-6bb3323b1", email: "david.g.s.138@kalvium.community" },
            { name: "Harshini J",             role: "Kalvian", bio: "B.Tech CSE Student @ St. Joseph’s University | Kalvium Program | Aspiring Full-Stack Developer | Passionate about Problem Solving",                                                            img: "/src/Harshini J.png", github: "https://github.com/harshinijs138-svg",           linkedin: "https://www.linkedin.com/in/harshini-j-244611383", email: "harshini.j.s.138@kalvium.community" },
            { name: "Udhaya.E",               role: "Kalvian", bio: "I am a first-year student who is passionate about learning new technologies and improving my skills.I have a strong interest in programming and web development.I enjoy solving problems and working on creative projects.I am always eager to learn, grow, and take on new challenges.My goal is to build a successful career in the technology field.",                                                                       img: "/src/Udhaya E.png", github: "https://github.com/udhayaes138-spec",            linkedin: "https://www.linkedin.com/in/udhaya-e-a1b443383", email: "udhaya.e.s.138@kalvium.community" },
            { name: "Jeevanand J",            role: "Kalvian", bio: "“I’m a CSE student. I’m into building things more than just studying them — electronics projects, hardware-software stuff, racing sim builds. I like figuring out how things work and making them better.”",                                                                   img: "/src/Jeevanand j.png", github: "https://github.com/jeevanand-jaisankar",         linkedin: "https://www.linkedin.com/in/jeevanand-j-575676281", email: "jeevanand.j.s.138@kalvium.community" },
            { name: "Edupalli sai praneeth",  role: "Kalvian", bio: "Hi, I’m Sai Praneeth. I am a passionate and curious student who loves learning new technologies. I enjoy coding and building projects using HTML, CSS, JavaScript, and Python. I am always eager to improve my skills and take on new challenges. My goal is to become a successful software developer and create innovative applications.",                                                                 img: "/src/Edupalli Sai Praneeth Lokesh.png", github: "https://github.com/edupallilokeshs138-bot",      linkedin: "https://www.linkedin.com/in/edupalli-sai-praneeth-3ab348383", email: "edupalli.lokesh.s.138@kalvium.community" },
            { name: "Chandana",               role: "Kalvian", bio: "I am a responsible and self-motivated individual who is always willing to learn and improve. I believe in continuous growth, both personally and professionally. I am disciplined, adaptable, and capable of handling responsibilities with sincerity.I value honesty, teamwork, and clear communication. I try to approach every task with dedication and a positive attitude. Even when I face challenges, I remain calm and focused on finding solutions rather than giving up.I am currently working on developing my technical and communication skills to become more confident and efficient in my field. My goal is to build a strong career by staying consistent, hardworking, and open to new opportunities. Passionate coder building modern web applications.",                                                              img: "/src/Chandana E.jpeg", github: "https://github.com/chandanaes139-lang",          linkedin: "https://www.linkedin.com/in/chandana-elavarasan-a10964384", email: "chandana.e.s.139@kalvium.community" }
        ];          

    while(studentsData.length < 36) {             
        let id = studentsData.length + 1;             
        studentsData.push({ name: `Subject Node ${id}`, role: "SDE Intern", bio: "Core engineer within the Kalvium class sync protocol.", img: `https://i.pravatar.cc/400?u=st${id}`, github: "https://github.com", linkedin: "#", email: "#" });         
    }          

    window.dossierStates = {}; // Make globally available         
    window.currentActiveSubject = "";          

    window.getDossierState = function(name) {             
        if (!window.dossierStates[name]) {                 
            window.dossierStates[name] = {                     
                projects: [                         
                    { title: "Project_Nexus", desc: "Distributed AI architecture bridging edge and cloud components." },                         
                    { title: "CyberShield v2.0", desc: "Automated packet analysis & anomaly detection firewall." }                     
                ],                     
                certs: ["Kalvium Sync Level_04", "AWS Certified Arch_Assoc"],                     
                skills: [                         
                    { name: "JavaScript / TS", pct: Math.floor(Math.random() * 30) + 40 },                         
                    { name: "Python", pct: Math.floor(Math.random() * 30) + 40 },                         
                    { name: "C++ / Algorithms", pct: Math.floor(Math.random() * 30) + 40 }                     
                ]                 
            };             
        }             
        return window.dossierStates[name];         
    }          

    const proverbsList = [             
        "“Talk is cheap. Show me the code.”",             
        "“First, solve the problem. Then, write the code.”",             
        "“Simplicity is the soul of efficiency.”",             
        "“Make it work, make it right, make it fast.”"         
    ];         
    let currentProverbIdx = 0;          

    // --- INIT ---         
    function init() {             
        setTimeout(() => {                 
            window.scrollTo(0, 0); // Force to top one last time before revealing 
            document.getElementById('loader').style.display = 'none';                 
            document.body.style.overflow = 'auto'; // Re-enable scrolling                
            if (!localStorage.getItem('cyber_v22')) document.getElementById('instruction-overlay').style.display = 'flex';             
        }, 3000);              

        document.getElementById('mentorGrid').innerHTML = mentorsData.map(m => renderCard(m, true)).join('');             
        document.getElementById('studentScroller').innerHTML = [...studentsData, ...studentsData].map(s => renderCard(s, false, 'scroll')).join('');             
        document.getElementById('studentGrid').innerHTML = studentsData.map(s => renderCard(s, false, 'grid')).join('');                          
        
        document.getElementById('proverbDisplay').innerText = proverbsList[currentProverbIdx];             
        setInterval(cycleProverbs, 30000);              

        // Sync UI Toggles with localStorage state             
        document.getElementById(`btn-theme-${currentTheme}`).classList.add('active');             
        document.getElementById(`swatch-${currentAccent}`).classList.add('active');                          
        document.getElementById(`btn-font-${currentFont}`).classList.add('active');                          
        document.getElementById(`btn-size-${currentFontSize}`).classList.add('active');                          
    }          

    // --- PROVERBS ---         
    function cycleProverbs() {             
        const display = document.getElementById('proverbDisplay');             
        display.style.opacity = 0;              
        setTimeout(() => {                 
            currentProverbIdx = (currentProverbIdx + 1) % proverbsList.length;                 
            display.innerText = proverbsList[currentProverbIdx];                 
            display.style.opacity = 1;              
        }, 800);         
    }          

    // --- RENDER CARDS ---         
    window.renderCard = function(p, isMentor, type = 'grid') {             
        const width = type === 'scroll' ? 'w-80 flex-shrink-0' : 'w-full';             
        const words = p.name.trim().split(/\s+/);             
        const watermark = words.reduce((l, c) => c.replace(/[^a-zA-Z]/g,'').length > l.replace(/[^a-zA-Z]/g,'').length ? c : l, words[0]);             
        return `                 
            <div class="card-perspective ${width}">                     
                <div class="tactical-card group" onmousemove="handleCardMove(event, this)" onclick="openModal(&quot;${p.name}&quot;, ${isMentor})" data-name="${p.name.toLowerCase()}">                         
                    <div class="card-glare"></div>                         
                    <div class="card-watermark">${watermark}</div>                         
                    <img src="${p.img}" class="w-32 h-32 mb-6 border border-red-600/30 p-1 transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:border-red-600 rounded-full z-10" loading="lazy">                         
                    <div class="text-center z-10 px-4">                             
                        <p class="text-red-600 mono text-[9px] uppercase font-bold tracking-widest mb-1 transition-colors duration-500 group-hover:text-white">${isMentor ? 'ARCHITECT' : 'OPERATOR'}</p>                             
                        <h3 class="text-xl font-black uppercase tracking-tighter">${p.name}</h3>                         
                    </div>                     
                </div>                 
            </div>`;         
    }          

    window.handleCardMove = function(e, card) {             
        const r = card.getBoundingClientRect();             
        card.style.setProperty('--x', `${e.clientX - r.left}px`);             
        card.style.setProperty('--y', `${e.clientY - r.top}px`);         
    }          

    // Make Data available to OpenModal
    window.mentorsData = mentorsData;
    window.studentsData = studentsData;

    document.getElementById('searchBox').addEventListener('input', (e) => {             
        const v = e.target.value.toLowerCase();             
        document.querySelectorAll('.tactical-card').forEach(c => {                 
            const n = c.dataset.name;                 
            c.classList.toggle('dimmed', v && !n.includes(v));             
        });         
    });          
    
    init();
});

// =========================================================================
// GLOBAL FUNCTIONS (Bound to HTML onClick events)
// =========================================================================

// --- SETTINGS CONTROLS ---         
function openSettings() { 
    document.getElementById('settings-page').classList.add('active'); 
    document.body.style.overflow = 'hidden';
}         
function closeSettings() { 
    document.getElementById('settings-page').classList.remove('active'); 
    setTimeout(() => { document.body.style.overflow = 'auto'; }, 400);
}
function openAbout() { 
    document.getElementById('about-page').classList.add('active'); 
    document.body.style.overflow = 'hidden';
}
function closeAbout() { 
    document.getElementById('about-page').classList.remove('active'); 
    setTimeout(() => { document.body.style.overflow = 'auto'; }, 400);
}

function setTheme(mode) {             
    currentTheme = mode;             
    localStorage.setItem('cyber_theme', mode);             
    applyTheme(mode);             
    document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));             
    document.getElementById(`btn-theme-${mode}`).classList.add('active');         
}          

function setAccent(colorKey) {             
    currentAccent = colorKey;             
    localStorage.setItem('cyber_accent', colorKey);             
    applyAccent(colorKey);             
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));             
    document.getElementById(`swatch-${colorKey}`).classList.add('active');         
}          

function setFont(fontKey) {             
    currentFont = fontKey;             
    localStorage.setItem('cyber_font', fontKey);             
    applyFont(fontKey);             
    document.querySelectorAll('.font-btn').forEach(btn => btn.classList.remove('active'));             
    document.getElementById(`btn-font-${fontKey}`).classList.add('active');         
}          

function setFontSize(sizeKey) {             
    currentFontSize = sizeKey;             
    localStorage.setItem('cyber_fontsize', sizeKey);             
    applyFontSize(sizeKey);             
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));             
    document.getElementById(`btn-size-${sizeKey}`).classList.add('active');         
}          

function resetSystem() {             
    if(confirm("WARNING: INITIATE FACTORY RESET PROTOCOL?\nThis will purge all local data and configurations.")) {                 
        localStorage.clear();                 
        window.location.reload();             
    }         
}          

// --- MODALS ---
function openModal(name, isMentor) {             
    const list = isMentor ? window.mentorsData : window.studentsData;             
    const p = list.find(x => x.name === name);             
    
    document.getElementById('modalContent').innerHTML = `                 
        <div class="flex flex-col lg:flex-row gap-10 md:gap-14 items-center relative z-10">                     
            <div class="absolute -right-10 -bottom-10 opacity-[0.03] text-red-600 pointer-events-none">                         
                <i class="fa-solid fa-fingerprint" style="font-size: 250px;"></i>                     
            </div>                     
            <div class="w-56 h-56 md:w-72 md:h-72 flex-shrink-0 relative group">                         
                <div class="absolute inset-0 border-2 border-red-600/20 rounded-full group-hover:border-red-600/60 transition-all duration-500 animate-[spin_8s_linear_infinite]"></div>                         
                <div class="absolute inset-3 border border-red-600/40 rounded-full border-dashed animate-[spin_12s_linear_infinite_reverse]"></div>                         
                <img src="${p.img}" class="w-full h-full object-cover rounded-full p-5 transition-all duration-700 shadow-[0_0_30px_rgba(255,0,0,0.15)]">                         
            </div>                     
            <div class="text-left max-w-xl w-full">                         
                <div class="flex items-center gap-3 mb-3">                             
                    <span class="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>                             
                    <span class="text-red-600 mono text-xs uppercase tracking-[0.3em] font-bold">${isMentor ? 'ARCHITECT' : 'OPERATOR'} // ONLINE</span>                         
                </div>                         
                <h2 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter mb-2 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.1)] leading-[0.9] break-words max-w-full">${p.name}</h2>                         
                <p class="text-gray-400 mono text-sm md:text-base font-bold mb-6 uppercase tracking-widest border-l-2 border-red-600 pl-4">${p.role}</p>                                                  
                
                <div class="bg-black/40 border border-white/10 rounded-xl p-5 mb-8 backdrop-blur-sm shadow-inner relative overflow-hidden flex flex-col items-start">                             
                    <div class="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-red-600/50 to-transparent"></div>                             
                    <p id="modalBioText" class="text-gray-300 text-base md:text-lg font-light bio-text" style="max-height: 3.2em;">${p.bio}</p>                             
                    <button id="modalBioToggle" onclick="toggleBio()" class="hidden text-red-500 hover:text-white mono text-[10px] uppercase font-bold tracking-widest mt-4 transition-all hover:translate-x-2 flex items-center gap-2 group">                                 
                        <i class="fa-solid fa-chevron-right text-[10px] group-hover:text-red-500"></i> Initialize_Decryption [Read_More]                             
                    </button>                         
                </div>                                                  
                
                <div class="flex flex-wrap gap-3 mt-4 w-full">                             
                    <button onclick="openAchievements(&quot;${p.name}&quot;)" class="btn-cyber-alt flex-1 min-w-[130px] py-3 rounded-lg font-black text-xs uppercase text-center tracking-[0.1em] flex justify-center items-center gap-2">                                 
                        <i class="fa-solid fa-chart-pie text-lg"></i> Dossier                             
                    </button>                             
                    <a href="${p.linkedin}" target="_blank" class="btn-cyber-main flex-1 min-w-[130px] py-3 rounded-lg font-black text-xs uppercase text-center tracking-[0.1em] flex justify-center items-center gap-2">                                 
                        <i class="fa-brands fa-linkedin-in text-lg"></i> Connect                             
                    </a>                             
                    ${p.github ? `                             
                    <a href="${p.github}" target="_blank" class="btn-cyber-icon flex-1 min-w-[130px] py-3 rounded-lg font-black text-xs uppercase text-center tracking-[0.1em] flex justify-center items-center gap-2">                                 
                        <i class="fa-brands fa-github text-lg"></i> GitHub                             
                    </a>` : ''}                             
                    <a href="mailto:${p.email}" class="btn-cyber-icon w-[46px] h-[46px] flex items-center justify-center rounded-lg text-lg flex-shrink-0">                                 
                        <i class="fa-solid fa-envelope"></i>                             
                    </a>                         
                </div>                     
            </div>                 
        </div>`;                          
    
    document.getElementById('modal-overlay').classList.add('active');             
    document.body.style.overflow = 'hidden';              

    setTimeout(() => {                 
        const bioEl = document.getElementById('modalBioText');                 
        const toggleBtn = document.getElementById('modalBioToggle');                 
        if (bioEl && toggleBtn) {                     
            if (bioEl.scrollHeight > bioEl.clientHeight) { toggleBtn.style.display = 'flex'; }                      
            else { toggleBtn.style.display = 'none'; }                 
        }             
    }, 50);          
}          

// --- DOSSIER PAGE LOGIC ---         
function openAchievements(name) {             
    document.getElementById('modal-overlay').classList.remove('active');             
    window.currentActiveSubject = name;             
    document.getElementById('dossier-name').innerText = `ID_${name.replace(/\s+/g, '_')}`;             
    renderDossier();             
    document.getElementById('dossier-overlay').classList.add('active');         
}          

function closeAchievements() {             
    document.getElementById('dossier-overlay').classList.remove('active');             
    document.querySelectorAll('.skill-fill').forEach(el => el.style.transform = "scaleX(0)");             
    setTimeout(() => { document.body.style.overflow = 'auto'; }, 400);         
}          

function renderDossier() {             
    const state = window.getDossierState(window.currentActiveSubject);             
    const content = `                 
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
                        <div class="skill-track">                                     
                            <div class="skill-fill" id="skill-bar-${idx}" style="width: ${s.pct}%"></div>                                 
                        </div>                             
                    </div>                         
                `).join('')}                     
            </div>                 
        </div>             
    `;             
    document.getElementById('dossierContent').innerHTML = content;             
    setTimeout(() => { document.querySelectorAll('.skill-fill').forEach(el => el.style.transform = "scaleX(1)"); }, 50);         
}          

// --- ADD/REMOVE DATA LOGIC ---         
function promptAddProject() {             
    document.getElementById('input-modal-title').innerText = "NEW_DEPLOYMENT_NODE";             
    document.getElementById('input-modal-body').innerHTML = `                 
        <input type="text" id="in-proj-title" placeholder="Project Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">                 
        <input type="text" id="in-proj-desc" placeholder="Brief Description" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">             
    `;             
    document.getElementById('input-modal-save').onclick = () => {                 
        const t = document.getElementById('in-proj-title').value;                 
        const d = document.getElementById('in-proj-desc').value;                 
        if(t && d) { window.getDossierState(window.currentActiveSubject).projects.push({title: t, desc: d}); renderDossier(); }                 
        closeInputModal();             
    };             
    document.getElementById('input-modal').style.display = 'flex';         
}          

function promptAddCert() {             
    document.getElementById('input-modal-title').innerText = "NEW_SECURITY_CLEARANCE";             
    document.getElementById('input-modal-body').innerHTML = `                 
        <input type="text" id="in-cert-title" placeholder="Certification Name" class="bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">             
    `;             
    document.getElementById('input-modal-save').onclick = () => {                 
        const t = document.getElementById('in-cert-title').value;                 
        if(t) { window.getDossierState(window.currentActiveSubject).certs.push(t); renderDossier(); }                 
        closeInputModal();             
    };             
    document.getElementById('input-modal').style.display = 'flex';         
}          

function promptAddSkill() {             
    document.getElementById('input-modal-title').innerText = "NEW_COMBAT_SKILL";
    
    const languages = [
        "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", 
        "Rust", "Go", "Swift", "Kotlin", "PHP", "Ruby", "SQL", 
        "HTML/CSS", "R", "Dart", "Shell Scripting", "Assembly"
    ];

    let options = languages.map(lang => `<option value="${lang}">${lang}</option>`).join('');

    document.getElementById('input-modal-body').innerHTML = `
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
    
    document.getElementById('input-modal-save').onclick = () => {                 
        const t = document.getElementById('in-skill-name').value;                 
        if(t) { window.getDossierState(window.currentActiveSubject).skills.push({name: t, pct: 0}); renderDossier(); }                 
        closeInputModal();             
    };             
    document.getElementById('input-modal').style.display = 'flex';         
}          

function closeInputModal() { document.getElementById('input-modal').style.display = 'none'; }          
function removeProject(idx) { window.getDossierState(window.currentActiveSubject).projects.splice(idx, 1); renderDossier(); }         
function removeCert(idx) { window.getDossierState(window.currentActiveSubject).certs.splice(idx, 1); renderDossier(); }         
function removeSkill(idx) { window.getDossierState(window.currentActiveSubject).skills.splice(idx, 1); renderDossier(); }          

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
    lines.forEach((line, i) => {                 
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

// --- CHATBOT LOGIC ---         
function toggleChatbot() {             
    const panel = document.getElementById('chatbot-panel');             
    if (panel.style.display === 'flex') {                 
        panel.style.opacity = '0';                 
        panel.style.transform = 'translateY(20px) scale(0.95)';                 
        setTimeout(() => panel.style.display = 'none', 300);             
    } else {                 
        panel.style.display = 'flex';                 
        setTimeout(() => {                     
            panel.style.opacity = '1';                     
            panel.style.transform = 'translateY(0) scale(1)';                 
        }, 10);                 
        document.getElementById('chatbot-input').focus();                                  
        
        const msgs = document.getElementById('chatbot-messages');                 
        if(msgs.children.length === 0) {                     
            appendChatbotMessage('SYSTEM', 'Neural_Assist_v2 online. How can I assist with your deployment?');                 
        }             
    }         
}          

function sendChatMessage() {             
    const input = document.getElementById('chatbot-input');             
    const msg = input.value.trim();             
    if (!msg) return;              

    appendChatbotMessage('USER', msg);             
    input.value = '';              

    const typingId = 'typing-' + Date.now();             
    setTimeout(() => {                 
        appendChatbotMessage('SYSTEM', '<span class="animate-pulse">PROCESSING_QUERY...</span>', typingId);             
    }, 400);              

    setTimeout(() => {                 
        const typingEl = document.getElementById(typingId);                 
        if (typingEl) typingEl.remove();                  

        const lower = msg.toLowerCase();                 
        let reply = "Query acknowledged. Cross-referencing database arrays.";                 
        const responses = [                     
            "Access denied. Clearance level insufficient.",                     
            "Data synthesized successfully.",                     
            "Logic checks out. Validating packet streams.",                     
            "Please refine parameters. Syntax anomaly detected."                 
        ];                  

        if (lower.includes('hello') || lower.includes('hi')) reply = "Greetings, operator. Systems are nominal.";                 
        else if (lower.includes('kalvium')) reply = "Kalvium: The peak of immersive, work-integrated engineering synthesis.";                 
        else if (lower.includes('clearance')) reply = "Your current protocol clearance is OPERATOR_L1. Escalate to Lead Architect for elevation.";                 
        else if (lower.includes('help')) reply = "Available commands: 'SCAN_NODES', 'CHECK_CLEARANCE', 'INIT_KALVIUM'.";                 
        else reply = responses[Math.floor(Math.random() * responses.length)];                  

        appendChatbotMessage('SYSTEM', reply);             
    }, 1500);         
}          

function appendChatbotMessage(sender, text, id = '') {             
    const messages = document.getElementById('chatbot-messages');             
    const isUser = sender === 'USER';                          
    
    const alignClass = isUser ? 'items-end' : 'items-start';             
    const bubbleClass = isUser ? 'chat-user-bubble rounded-l-xl rounded-br-xl' : 'chat-bot-bubble rounded-r-xl rounded-bl-xl';             
    const senderColor = isUser ? 'text-gray-500' : 'text-red-500';              
    
    const div = document.createElement('div');             
    div.className = `flex flex-col ${alignClass} w-full`;             
    if (id) div.id = id;                          
    
    div.innerHTML = `                 
        <span class="text-[9px] ${senderColor} mb-1 tracking-widest font-bold">${sender}</span>                 
        <div class="${bubbleClass} p-3 max-w-[85%] leading-relaxed shadow-md">                     
            ${text}                 
        </div>             
    `;                          
    
    messages.appendChild(div);             
    messages.scrollTop = messages.scrollHeight;         
}          

// --- MISC UTILS ---         
function toggleBio() {             
    const bioEl = document.getElementById('modalBioText'); const toggleBtn = document.getElementById('modalBioToggle');             
    if (!bioEl || !toggleBtn) return;             
    const isExpanded = bioEl.classList.contains('expanded');             
    if (!isExpanded) {                 
        bioEl.classList.add('expanded'); bioEl.style.maxHeight = bioEl.scrollHeight + 'px';                 
        toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-up text-[10px] group-hover:text-red-500"></i> Execute_Collapse [Show_Less]';             
    } else {                 
        bioEl.classList.remove('expanded'); bioEl.style.maxHeight = '3.2em';                 
        toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-right text-[10px] group-hover:text-red-500"></i> Initialize_Decryption [Read_More]';             
    }         
}          

function closeModal() { document.getElementById('modal-overlay').classList.remove('active'); document.body.style.overflow = 'auto'; }         
function closeInstructions() { localStorage.setItem('cyber_v22','done'); document.getElementById('instruction-overlay').style.display = 'none'; }         

function switchView(v) {             
    document.getElementById('btn-scroll').classList.toggle('active', v === 'scroll');             
    document.getElementById('btn-scroll').classList.toggle('text-gray-500', v !== 'scroll');             
    document.getElementById('btn-gallery').classList.toggle('active', v === 'gallery');             
    document.getElementById('btn-gallery').classList.toggle('text-gray-500', v !== 'gallery');             
    document.getElementById('view-scroll').classList.toggle('hidden-view', v === 'gallery');             
    document.getElementById('view-gallery').classList.toggle('hidden-view', v === 'scroll');         
}

// --- TOUR LOGIC ---
const tourSteps = [
    { sel: 'nav', title: 'Global Sync Array', text: 'Top-level navigation node. Access main sectors, run global database scans, or configure system settings.' },
    { sel: '#searchBox', title: 'Database Scanner', text: 'Input parameters here to instantly filter operatives and architects by their identification tags.' },
    { sel: '#mentorGrid', title: 'Leadership Nodes', text: 'The architects guiding the protocol. Click any node to open their detailed dossier.' },
    { sel: '#students-section .flex.gap-2', title: 'Matrix View Control', text: 'Toggle the structural layout between linear scrolling (Feed) and grid alignment (Gallery).' },
    { sel: '#chatbot-toggle', title: 'Neural Assist v2', text: 'Initiate localized AI communication. Query the system or ask for operational assistance.' }
];

let currentTourStep = 0;
let currentHighlightedEl = null;

function startTour() {
    closeSettings();
    setTimeout(() => {
        currentTourStep = 0;
        document.getElementById('tour-overlay').classList.remove('hidden');
        setTimeout(() => document.getElementById('tour-overlay').classList.add('active'), 10);
        document.getElementById('tour-tooltip').classList.remove('hidden');
        setTimeout(() => document.getElementById('tour-tooltip').classList.add('active'), 10);
        renderTourStep();
    }, 500); 
}

function renderTourStep() {
    if (currentHighlightedEl) {
        currentHighlightedEl.classList.remove('tour-highlight');
    }

    const step = tourSteps[currentTourStep];
    const el = document.querySelector(step.sel);

    if (el) {
        currentHighlightedEl = el;
        el.classList.add('tour-highlight');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    document.getElementById('tour-title').innerText = step.title;
    document.getElementById('tour-text').innerText = step.text;
    document.getElementById('tour-counter').innerText = `${currentTourStep + 1}/${tourSteps.length}`;

    const nextBtn = document.getElementById('tour-next-btn');
    if (currentTourStep === tourSteps.length - 1) {
        nextBtn.innerText = 'Finish';
    } else {
        nextBtn.innerText = 'Next';
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
    if (currentHighlightedEl) currentHighlightedEl.classList.remove('tour-highlight');
    currentHighlightedEl = null;
    document.getElementById('tour-overlay').classList.remove('active');
    document.getElementById('tour-tooltip').classList.remove('active');
    setTimeout(() => {
        document.getElementById('tour-overlay').classList.add('hidden');
        document.getElementById('tour-tooltip').classList.add('hidden');
    }, 300);
}
{/* <span class="text-red-600">squad138</span>#hove {
    display: inline-block;
    transition: all 0.3s ease;
}
#hove:hover {
    color: var(--k-bright);
    transform: translateY(-4px) scale(1.05);
    text-shadow: var(--k-bright) 0px 0px 8px, var(--k-bright) 0px 0px 5px;
} */}