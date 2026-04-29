// =========================================================================
// CODING STATS ENGINE — Multi-Platform Intelligence System
// =========================================================================

const STATS_CACHE_DURATION = 4 * 60 * 60 * 1000; // 4 hours

// --- CACHE MANAGEMENT ---
function getStatsCache() {
    try { return JSON.parse(localStorage.getItem('coding_stats_cache') || '{}'); }
    catch { return {}; }
}
function getCachedStats(key) {
    const cache = getStatsCache();
    if (cache[key] && (Date.now() - cache[key].ts) < STATS_CACHE_DURATION) return cache[key].data;
    return null;
}
function setCachedStats(key, data) {
    const cache = getStatsCache();
    cache[key] = { data, ts: Date.now() };
    try { localStorage.setItem('coding_stats_cache', JSON.stringify(cache)); } catch {}
}

// --- UTILITY ---
function extractGitHubUsername(url) {
    if (!url) return '';
    const match = url.match(/github\.com\/([^\/\?#]+)/);
    return match ? match[1] : '';
}

function normalizeHandle(value) {
    return String(value || '').trim();
}

function extractHackerRankUsername(value) {
    const raw = normalizeHandle(value);
    if (!raw) return '';
    const m = raw.match(/hackerrank\.com\/(?:profile\/)?([^\/\?#]+)/i);
    if (m && m[1]) return m[1].trim();
    return raw.replace(/^@/, '');
}

function extractCodeChefUsername(value) {
    const raw = normalizeHandle(value);
    if (!raw) return '';
    const m = raw.match(/codechef\.com\/(?:users\/)?([^\/\?#]+)/i);
    if (m && m[1]) return m[1].trim();
    return raw.replace(/^@/, '');
}

function normalizeHackerRankTitle(rawTitle) {
    const title = normalizeHandle(rawTitle);
    if (!title) return 'HackerRank Learner';
    // Titles like O(2^N) are fun but not useful as a learning label.
    if (/^o\s*\(/i.test(title) || /^[a-z]\(.*\)$/i.test(title)) return 'Problem Solving';
    return title;
}

// --- PLATFORM CONFIG PERSISTENCE ---
function savePlatformConfig(name, platforms) {
    try {
        const configs = JSON.parse(localStorage.getItem('platform_configs') || '{}');
        configs[name] = platforms;
        localStorage.setItem('platform_configs', JSON.stringify(configs));
    } catch {}
}
function getSavedPlatformConfig(name) {
    try {
        const configs = JSON.parse(localStorage.getItem('platform_configs') || '{}');
        return configs[name] || null;
    } catch { return null; }
}

// --- LEETCODE API (via alfa-leetcode-api proxy) ---
async function fetchLeetCodeStats(username) {
    if (!username) return null;
    const cached = getCachedStats(`lc_${username}`);
    if (cached) return cached;
    try {
        const [profileRes, LangRes, RecentRes] = await Promise.all([
            fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`),
            fetch(`https://alfa-leetcode-api.onrender.com/languageStats/${username}`),
            fetch(`https://alfa-leetcode-api.onrender.com/recentSubmissions/${username}`)
        ]);
        
        const d = await profileRes.json();
        const l = LangRes.ok ? await LangRes.json() : { languageProblemCount: [] };
        const r = RecentRes.ok ? await RecentRes.json() : { count: 0, submission: [] };

        const stats = {
            easy: d.easySolved || 0, medium: d.mediumSolved || 0, hard: d.hardSolved || 0,
            total: d.totalSolved || 0, ranking: d.ranking || null,
            totalEasy: d.totalEasy || 0, totalMedium: d.totalMedium || 0, totalHard: d.totalHard || 0,
            languages: (l.languageProblemCount || []).slice(0, 3).map(lang => ({ name: lang.languageName, count: lang.problemsSolved })),
            recent: (r.submission || []).slice(0, 2).map(s => ({ title: s.title, time: s.relativeTime }))
        };
        setCachedStats(`lc_${username}`, stats);
        return stats;
    } catch (err) { console.warn(`LeetCode fetch failed for ${username}:`, err); return null; }
}

// --- GITHUB API ---
async function fetchGitHubStats(username) {
    if (!username) return null;
    const cached = getCachedStats(`gh_${username}`);
    if (cached) return cached;
    try {
        const [userRes, reposRes] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
        ]);
        if (!userRes.ok) throw new Error('GitHub API error');
        const user = await userRes.json();
        const repos = reposRes.ok ? await reposRes.json() : [];
        const stats = {
            publicRepos: user.public_repos || 0,
            followers: user.followers || 0,
            totalStars: Array.isArray(repos) ? repos.reduce((s, r) => s + (r.stargazers_count || 0), 0) : 0,
            totalForks: Array.isArray(repos) ? repos.reduce((s, r) => s + (r.forks_count || 0), 0) : 0,
            languages: Array.isArray(repos) ? [...new Set(repos.map(r => r.language).filter(Boolean))] : [],
            topRepos: Array.isArray(repos) ? repos.slice(0, 3).map(r => ({ name: r.name, stars: r.stargazers_count || 0, lang: r.language })) : []
        };
        setCachedStats(`gh_${username}`, stats);
        return stats;
    } catch (err) { console.warn(`GitHub fetch failed for ${username}:`, err); return null; }
}

// --- HACKERRANK API (using profile data) ---
async function fetchHackerRankStats(username) {
    if (!username) return null;

    const cached = getCachedStats(`hr_${username}`);
    if (cached) return cached;

    try {
        const encoded = encodeURIComponent(username);

        function parseProxyJson(text) {
            if (!text) return null;
            const start = text.indexOf('{');
            const end = text.lastIndexOf('}');
            if (start === -1 || end === -1 || end <= start) return null;
            try {
                return JSON.parse(text.slice(start, end + 1));
            } catch {
                return null;
            }
        }

        async function fetchJson(url) {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    // Browser fetch already sends a User-Agent automatically.
                    // Setting User-Agent manually is blocked by browsers.
                    headers: { 'Accept': 'application/json' }
                });
                if (response.ok) return await response.json();
            } catch {}

            // CORS/anti-bot fallback for client-side rendering.
            try {
                const proxyUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//, '')}`;
                const proxyRes = await fetch(proxyUrl, { method: 'GET' });
                if (!proxyRes.ok) return null;
                const proxyText = await proxyRes.text();
                return parseProxyJson(proxyText);
            } catch {
                return null;
            }
        }

        // New/working profile endpoint for public HackerRank handles.
        const profilePayload =
            await fetchJson(`https://www.hackerrank.com/rest/contests/master/hackers/${encoded}/profile`) ||
            await fetchJson(`https://www.hackerrank.com/rest/contests/master/users/${encoded}`);

        if (!profilePayload) {
            throw new Error('HackerRank profile not found');
        }

        const model = profilePayload?.model || {};

        // Badges endpoint can be empty for many profiles; keep it optional.
        const badgePayload = await fetchJson(`https://www.hackerrank.com/rest/hackers/${encoded}/badges`);
        const badgesRaw = Array.isArray(badgePayload?.models)
            ? badgePayload.models
            : (Array.isArray(model.badges) ? model.badges : []);
        const recentPayload = await fetchJson(`https://www.hackerrank.com/rest/hackers/${encoded}/recent_challenges`);
        const recentRaw = Array.isArray(recentPayload?.models) ? recentPayload.models : [];
        const languagesRaw = Array.isArray(model.languages) ? model.languages : [];
        const practiceFocus = languagesRaw
            .map(l => (typeof l === 'string' ? l : l?.name || l?.language || ''))
            .filter(Boolean)
            .slice(0, 3);
        const recent = recentRaw.slice(0, 3).map(item => ({
            name: item?.name || item?.challenge?.name || item?.challenge_name || 'Challenge',
            status: item?.status || item?.verdict || 'Attempted'
        }));

        const stats = {
            badges: badgesRaw.map(b => b.badge_name || b.name).filter(Boolean),
            badgeStars: badgesRaw.reduce((acc, b) => Math.max(acc, Number(b.stars) || 0), 0),
            followers: Number(model.followers_count) || 0,
            rank: normalizeHackerRankTitle(model.title || model.personal_achievements?.highest_rank || 'N/A'),
            totalSubmissions: Number(model.submissions_count) || 0,
            level: Number(model.level) || 0,
            currentPractice: practiceFocus,
            currentLearning: normalizeHackerRankTitle(badgesRaw[0]?.badge_name || badgesRaw[0]?.name || model.title || 'General Problem Solving'),
            recent
        };

        setCachedStats(`hr_${username}`, stats);
        return stats;

    } catch (err) {
        console.warn(`HackerRank fetch failed for ${username}:`, err);
        return null;
    }
}

// --- CODECHEF API ---
async function fetchCodeChefStats(username) {
    if (!username) return null;
    const cached = getCachedStats(`cc_${username}`);
    if (cached) return cached;
    try {
        const res = await fetch(`https://codechef-api.vercel.app/handle/${username}`);
        if (!res.ok) throw new Error('CC API error');
        const d = await res.json();
        const stats = {
            rating: d.currentRating || 0, 
            stars: d.stars || '0★',
            maxRating: d.highestRating || 0,
            globalRank: d.globalRank || '—',
            countryRank: d.countryRank || '—'
        };
        setCachedStats(`cc_${username}`, stats);
        return stats;
    } catch (err) { console.warn(`CodeChef fetch failed for ${username}:`, err); return null; }
}

// --- RENDER CODING STATS SECTION (returns HTML string) ---
function renderCodingStatsSection() {
    return `
        <div class="lg:col-span-3 mb-2">
            <div class="flex flex-wrap justify-between items-center border-b border-red-900/50 pb-2 mb-6">
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <i class="fa-solid fa-satellite-dish"></i> Coding_Intelligence
                </h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="coding-stats-grid">
                <!-- LeetCode -->
                <div class="dossier-card platform-card relative overflow-hidden">
                    <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fa-solid fa-code" style="color:#FFA116"></i>
                        <span class="font-bold text-xs uppercase tracking-widest" style="color:#FFA116">LeetCode</span>
                    </div>
                    <div id="lc-stats-content">
                        <div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Scanning...</div>
                    </div>
                </div>
                <!-- GitHub -->
                <div class="dossier-card platform-card relative overflow-hidden">
                    <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fa-brands fa-github text-white"></i>
                        <span class="font-bold text-xs uppercase tracking-widest text-white">GitHub</span>
                    </div>
                    <div id="gh-stats-content">
                        <div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Scanning...</div>
                    </div>
                </div>
                <!-- HackerRank -->
                <div class="dossier-card platform-card relative overflow-hidden">
                    <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fa-brands fa-hackerrank" style="color:#2ec866"></i>
                        <span class="font-bold text-xs uppercase tracking-widest" style="color:#2ec866">HackerRank</span>
                    </div>
                    <div id="hr-stats-content">
                        <div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Scanning...</div>
                    </div>
                </div>
                <!-- CodeChef -->
                <div class="dossier-card platform-card relative overflow-hidden">
                    <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fa-solid fa-utensils" style="color:#5f4b32"></i>
                        <span class="font-bold text-xs uppercase tracking-widest" style="color:#5f4b32">CodeChef</span>
                    </div>
                    <div id="cc-stats-content">
                        <div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Scanning...</div>
                    </div>
                </div>
            </div>
        </div>`;
}

// --- RENDER INDIVIDUAL PLATFORM STATS ---
function renderLCStats(data) {
    if (!data) return `<div class="stats-empty"><i class="fa-solid fa-lock text-gray-700"></i> Locked<p class="text-[9px] mt-2 text-gray-600">Sync via Dashboard</p></div>`;
    const easyPct = data.totalEasy > 0 ? (data.easy / data.totalEasy * 100).toFixed(0) : 0;
    const medPct = data.totalMedium > 0 ? (data.medium / data.totalMedium * 100).toFixed(0) : 0;
    const hardPct = data.totalHard > 0 ? (data.hard / data.totalHard * 100).toFixed(0) : 0;
    
    const languagesHTML = data.languages.length > 0 ? `
        <div class="flex gap-1.5 mt-2">
            ${data.languages.map(l => `<span class="text-[8px] mono text-gray-500 bg-white/5 border border-white/10 px-1 py-0.5 rounded">${l.name}</span>`).join('')}
        </div>` : '';

    const recentHTML = data.recent.length > 0 ? `
        <div class="border-t border-white/5 pt-2 mt-3 space-y-1">
            <span class="text-[8px] text-gray-600 uppercase tracking-tighter">Recent Solve Intelligence</span>
            ${data.recent.map(s => `<div class="text-[9px] mono text-gray-400 truncate"><i class="fa-solid fa-bolt-lightning text-[8px] text-yellow-600 mr-1"></i> ${s.title}</div>`).join('')}
        </div>` : '';

    return `
        <div class="space-y-2">
            <div class="stat-row"><span class="text-green-400">Easy</span><span class="font-bold text-white text-xs">${data.easy}<span class="text-gray-600">/${data.totalEasy}</span></span></div>
            <div class="lc-diff-bar"><div class="lc-diff-fill lc-easy" style="width:${easyPct}%"></div></div>
            <div class="stat-row"><span class="text-yellow-400">Med</span><span class="font-bold text-white text-xs">${data.medium}<span class="text-gray-600">/${data.totalMedium}</span></span></div>
            <div class="lc-diff-bar"><div class="lc-diff-fill lc-medium" style="width:${medPct}%"></div></div>
            <div class="stat-row"><span class="text-red-400">Hard</span><span class="font-bold text-white text-xs">${data.hard}<span class="text-gray-600">/${data.totalHard}</span></span></div>
            <div class="lc-diff-bar"><div class="lc-diff-fill lc-hard" style="width:${hardPct}%"></div></div>
            <div class="stat-row pt-1 mt-1 border-t border-white/10"><span class="text-gray-500">Solved</span><span class="font-bold text-white">${data.total}</span></div>
            ${languagesHTML}
            ${recentHTML}
        </div>`;
}

function renderGHStats(data) {
    if (!data) return `<div class="stats-empty"><i class="fa-solid fa-unlink"></i> Not linked<p class="text-[9px] mt-2 text-gray-600">Click Link_Platforms to connect</p></div>`;
    const topReposHTML = data.topRepos && data.topRepos.length > 0 ? `
        <div class="border-t border-white/5 pt-2 mt-1 space-y-1.5">
            <span class="text-[9px] text-gray-500 uppercase tracking-widest">Recent Repos</span>
            ${data.topRepos.map(r => `<div class="flex justify-between items-center text-[10px] mono"><span class="text-gray-300 truncate mr-2">${r.name}</span><span class="text-gray-600 flex-shrink-0">${r.lang || '—'}</span></div>`).join('')}
        </div>` : '';
    return `
        <div class="space-y-3">
            <div class="stat-row"><span class="text-gray-400">Repos</span><span class="font-bold text-white">${data.publicRepos}</span></div>
            <div class="stat-row"><span class="text-gray-400">Stars</span><span class="font-bold text-yellow-400">★ ${data.totalStars}</span></div>
            <div class="stat-row"><span class="text-gray-400">Followers</span><span class="font-bold text-white">${data.followers}</span></div>
            <div class="stat-row"><span class="text-gray-400">Languages</span><span class="font-bold text-white">${data.languages.length}</span></div>
            ${data.languages.length > 0 ? `<div class="flex flex-wrap gap-1 mt-1">${data.languages.slice(0, 6).map(l => `<span class="text-[9px] mono px-2 py-0.5 bg-white/5 border border-white/10 rounded text-gray-400">${l}</span>`).join('')}</div>` : ''}
            ${topReposHTML}
        </div>`;
}

function renderHRStats(data, username = '', fallbackSkills = []) {
    if (!data) {
        if (username) {
            const profileUrl = `https://www.hackerrank.com/profile/${encodeURIComponent(username)}`;
            const safeSkills = Array.isArray(fallbackSkills) ? fallbackSkills : [];
            const practicingList = safeSkills
                .map(s => (typeof s === 'string' ? s : s?.name || ''))
                .filter(Boolean)
                .slice(0, 3);
            const learningText = normalizeHackerRankTitle(practicingList[0] || 'General Problem Solving');
            const practicingHTML = practicingList.length > 0
                ? `<div class="flex flex-wrap gap-1 mt-1">${practicingList.map(p => `<span class="text-[8px] mono px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-300">${p}</span>`).join('')}</div>`
                : `<span class="text-[9px] mono text-gray-500">Building fundamentals</span>`;
            return `
                <div class="space-y-3.5">
                    <div class="stat-row"><span class="text-gray-400">Status</span><span class="font-bold text-green-500">Connected</span></div>
                    <div class="stat-row"><span class="text-gray-400">Handle</span><span class="font-bold text-white text-xs tracking-wide">${username}</span></div>
                    <a href="${profileUrl}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-[10px] mono px-2 py-1 bg-green-950/20 border border-green-600/30 text-green-400 hover:text-white hover:border-green-500 transition-all">
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i> Open Profile
                    </a>
                    <div class="pt-2 border-t border-white/5 space-y-2">
                        <div class="stat-row"><span class="text-gray-400">Current Learning</span><span class="font-bold text-white text-[10px] truncate ml-2">${learningText}</span></div>
                        <div>
                            <span class="text-[8px] text-gray-500 uppercase">Current Practicing</span>
                            ${practicingHTML}
                        </div>
                    </div>
                    <p class="text-[8px] text-gray-600">Live HackerRank sync is temporarily unavailable in browser mode.</p>
                </div>`;
        }
        return `<div class="stats-empty"><i class="fa-solid fa-lock text-gray-700"></i> Locked<p class="text-[9px] mt-2 text-gray-600">Sync via Dashboard</p></div>`;
    }

    const cleanRole = normalizeHackerRankTitle(data.rank || 'HackerRank Learner');
    const cleanLearning = normalizeHackerRankTitle(data.currentLearning || 'General Problem Solving');
    const practiceHTML = Array.isArray(data.currentPractice) && data.currentPractice.length > 0
        ? `<div class="flex flex-wrap gap-1 mt-1">${data.currentPractice.map(p => `<span class="text-[8px] mono px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-gray-300">${p}</span>`).join('')}</div>`
        : `<span class="text-[9px] mono text-gray-500">Building fundamentals</span>`;
    const recentHTML = Array.isArray(data.recent) && data.recent.length > 0
        ? `<div class="space-y-1">${data.recent.map(r => `<div class="text-[9px] mono text-gray-300 truncate"><i class="fa-solid fa-bolt-lightning text-[8px] text-green-500 mr-1"></i>${r.name} <span class="text-gray-500">(${r.status})</span></div>`).join('')}</div>`
        : `<span class="text-[9px] mono text-gray-500">No public recent challenges found</span>`;
    const badgesHTML = Array.isArray(data.badges) && data.badges.length > 0
        ? `<div class="flex flex-wrap gap-1">${data.badges.map(b => `<span class="text-[8px] mono px-1.5 py-0.5 bg-green-950/30 border border-green-600/20 text-green-500 rounded">${b}</span>`).join('')}</div>`
        : `<span class="text-[9px] mono text-gray-500">No verified badges yet</span>`;

    return `
        <div class="space-y-3.5">
            <div class="stat-row"><span class="text-gray-400">Level</span><span class="font-bold text-white text-[11px]">${data.level || 0}</span></div>
            <div class="stat-row"><span class="text-gray-400">Badge Stars</span><span class="font-bold text-yellow-500 text-[11px]">${data.badgeStars ? `${'★'.repeat(Math.min(5, data.badgeStars))} (${data.badgeStars})` : '—'}</span></div>
            <div class="stat-row"><span class="text-gray-400">Role</span><span class="font-bold text-white text-[11px]">${cleanRole}</span></div>
            <div class="stat-row"><span class="text-gray-400">Current Learning</span><span class="font-bold text-white text-[11px] truncate ml-2">${cleanLearning}</span></div>
            <div class="border-t border-white/5 pt-2 space-y-1.5">
                <span class="text-[8px] text-gray-500 uppercase">Current Practicing</span>
                ${practiceHTML}
            </div>
            <div class="border-t border-white/5 pt-2 space-y-1.5">
                <span class="text-[8px] text-gray-500 uppercase">Recent Practice</span>
                ${recentHTML}
            </div>
            <div class="border-t border-white/5 pt-2 space-y-1.5">
                <span class="text-[8px] text-gray-500 uppercase">Verified Badges</span>
                ${badgesHTML}
            </div>
        </div>`;
}

function renderCCStats(data) {
    if (!data) return `<div class="stats-empty"><i class="fa-solid fa-lock text-gray-700"></i> Locked<p class="text-[9px] mt-2 text-gray-600">Sync via Dashboard</p></div>`;
    return `
        <div class="space-y-3">
            <div class="stat-row"><span class="text-gray-400">Rating</span><span class="font-bold text-xl text-yellow-500">${data.rating}</span></div>
            <div class="stat-row"><span class="text-gray-400">Stars</span><span class="font-bold text-white">${data.stars}</span></div>
            <div class="stat-row"><span class="text-gray-400">Global Rank</span><span class="mono text-xs text-gray-300">#${data.globalRank}</span></div>
            <div class="stat-row"><span class="text-gray-400">Country Rank</span><span class="mono text-xs text-gray-400">#${data.countryRank}</span></div>
            <div class="stat-row border-t border-white/5 pt-2 mt-1"><span class="text-gray-500">Peak Rating</span><span class="font-bold text-white text-xs">${data.maxRating}</span></div>
        </div>`;
}

// --- LOAD CODING STATS (main async function) ---
async function loadCodingStats(name) {
    const allPeople = [...(window.mentorsData || []), ...(window.studentsData || [])];
    const person = allPeople.find(p => p.name && p.name.trim().toLowerCase() === name.trim().toLowerCase()) || {};

    const state = window.getDossierState(name);
    const ghUsername = normalizeHandle(
        state.github_username || state.platforms?.github || extractGitHubUsername(person.github || person.github_url)
    );
    const lcUsername = normalizeHandle(
        state.leetcode_username || state.platforms?.leetcode || person.leetcode || person.leetcode_username || ''
    );
    const hrUsername = extractHackerRankUsername(
        state.hackerrank_username || state.platforms?.hackerrank || person.hackerrank || person.hackerrank_username || ''
    );
    const ccUsername = extractCodeChefUsername(
        state.codechef_username || state.platforms?.codechef || person.codechef || person.codechef_username || ''
    );

    // Fetch all in parallel
    const [lcData, ghData, hrData, ccData] = await Promise.all([
        fetchLeetCodeStats(lcUsername),
        fetchGitHubStats(ghUsername),
        fetchHackerRankStats(hrUsername),
        fetchCodeChefStats(ccUsername)
    ]);

    // Update UI
    const lcEl = document.getElementById('lc-stats-content');
    const ghEl = document.getElementById('gh-stats-content');
    const hrEl = document.getElementById('hr-stats-content');
    const ccEl = document.getElementById('cc-stats-content');
    if (lcEl) lcEl.innerHTML = renderLCStats(lcData);
    if (ghEl) ghEl.innerHTML = renderGHStats(ghData);
    if (hrEl) hrEl.innerHTML = renderHRStats(hrData, hrUsername, state.skills);
    if (ccEl) ccEl.innerHTML = renderCCStats(ccData);

}

// --- REFRESH STATS (clear cache for current subject) ---
function refreshCodingStats() {
    const name = window.currentActiveSubject;
    if (!name) return;
    const state = window.getDossierState(name);
    const allPeople = [...(window.mentorsData || []), ...(window.studentsData || [])];
    const person = allPeople.find(p => p.name === name);
    // Clear cached entries
    const cache = getStatsCache();
    const ghU = state.github_username || state.platforms?.github || extractGitHubUsername(person?.github);
    const lcU = state.leetcode_username || state.platforms?.leetcode || person?.leetcode || '';
    const hrU = state.hackerrank_username || state.platforms?.hackerrank || person?.hackerrank || '';
    const ccU = state.codechef_username || state.platforms?.codechef || person?.codechef || '';
    delete cache[`lc_${lcU}`];
    delete cache[`gh_${ghU}`];
    delete cache[`hr_${hrU}`];
    delete cache[`cc_${ccU}`];
    try { localStorage.setItem('coding_stats_cache', JSON.stringify(cache)); } catch {}
    // Re-render loading state
    const grid = document.getElementById('coding-stats-grid');
    if (grid) {
        document.getElementById('lc-stats-content').innerHTML = '<div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Re-syncing...</div>';
        document.getElementById('gh-stats-content').innerHTML = '<div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Re-syncing...</div>';
        document.getElementById('hr-stats-content').innerHTML = '<div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Re-syncing...</div>';
        document.getElementById('cc-stats-content').innerHTML = '<div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Re-syncing...</div>';
    }
    // Spin the refresh button
    const btn = document.getElementById('refresh-stats-btn');
    if (btn) { btn.querySelector('i').classList.add('fa-spin'); setTimeout(() => btn.querySelector('i').classList.remove('fa-spin'), 2000); }
    loadCodingStats(name);
}

// --- CONFIGURE PLATFORMS MODAL ---
function promptConfigPlatforms() {
    const name = window.currentActiveSubject;
    const state = window.getDossierState(name);
    const allPeople = [...(window.mentorsData || []), ...(window.studentsData || [])];
    const person = allPeople.find(p => p.name === name);
    if (!state.platforms) {
        state.platforms = {
            github: extractGitHubUsername(person?.github),
            leetcode: person?.leetcode || '',
            hackerrank: person?.hackerrank || '',
            codechef: person?.codechef || ''
        };
    }
    document.getElementById('input-modal-title').innerText = "PLATFORM_LINK_CONFIG";
    document.getElementById('input-modal-body').innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">LeetCode Username</label>
                <input type="text" id="in-lc-user" value="${state.platforms.leetcode}" placeholder="e.g. ashwin_raj" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
            </div>
            <div>
                <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">GitHub Username</label>
                <input type="text" id="in-gh-user" value="${state.platforms.github}" placeholder="e.g. Partha1107" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
            </div>
            <div>
                <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">HackerRank Username</label>
                <input type="text" id="in-hr-user" value="${state.platforms.hackerrank || ''}" placeholder="e.g. ashwin_hr" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
            </div>
            <div>
                <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">CodeChef Username</label>
                <input type="text" id="in-cc-user" value="${state.platforms.codechef || ''}" placeholder="e.g. ashwin_cc" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
            </div>
        </div>`;
    document.getElementById('input-modal-save').onclick = () => {
        state.platforms = {
            leetcode: document.getElementById('in-lc-user').value.trim(),
            github: document.getElementById('in-gh-user').value.trim(),
            hackerrank: document.getElementById('in-hr-user').value.trim(),
            codechef: document.getElementById('in-cc-user').value.trim()
        };
        savePlatformConfig(name, state.platforms);
        closeInputModal();
        refreshCodingStats();
    };
    document.getElementById('input-modal').style.display = 'flex';
}
