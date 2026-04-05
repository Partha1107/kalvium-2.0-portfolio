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

// --- SCORE RANK LABEL ---
function getScoreRank(score) {
    if (score >= 90) return { label: 'LEGENDARY', color: '#ff00aa' };
    if (score >= 75) return { label: 'ELITE', color: '#00ff88' };
    if (score >= 60) return { label: 'SPECIALIST', color: '#A4F000' };
    if (score >= 40) return { label: 'OPERATIVE', color: '#FFA116' };
    if (score >= 20) return { label: 'RECRUIT', color: '#FF6B35' };
    return { label: 'INITIALIZING', color: '#666' };
}

// --- LEETCODE API (via alfa-leetcode-api proxy) ---
async function fetchLeetCodeStats(username) {
    if (!username) return null;
    const cached = getCachedStats(`lc_${username}`);
    if (cached) return cached;
    try {
        const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
        if (!res.ok) throw new Error('API error');
        const d = await res.json();
        const stats = {
            easy: d.easySolved || 0, medium: d.mediumSolved || 0, hard: d.hardSolved || 0,
            total: d.totalSolved || 0, ranking: d.ranking || null,
            totalEasy: d.totalEasy || 0, totalMedium: d.totalMedium || 0, totalHard: d.totalHard || 0,
            acceptance: d.acceptanceRate ? parseFloat(d.acceptanceRate) : 0
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

// --- CODEFORCES API ---
async function fetchCodeforcesStats(handle) {
    if (!handle) return null;
    const cached = getCachedStats(`cf_${handle}`);
    if (cached) return cached;
    try {
        const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
        if (!res.ok) throw new Error('CF API error');
        const d = await res.json();
        if (d.status !== 'OK' || !d.result || !d.result[0]) throw new Error('No data');
        const u = d.result[0];
        const stats = {
            rating: u.rating || 0, maxRating: u.maxRating || 0,
            rank: u.rank || 'unrated', maxRank: u.maxRank || 'unrated'
        };
        setCachedStats(`cf_${handle}`, stats);
        return stats;
    } catch (err) { console.warn(`Codeforces fetch failed for ${handle}:`, err); return null; }
}

// --- COMPOSITE SCORE ---
function calculateCompositeScore(lc, gh, cf) {
    let totalWeight = 0, weighted = 0;
    if (lc) {
        const raw = (lc.easy * 1) + (lc.medium * 3) + (lc.hard * 7);
        weighted += Math.min(100, raw / 2) * 40;
        totalWeight += 40;
    }
    if (gh) {
        const ghScore = Math.min(100, (gh.publicRepos * 4) + (gh.totalStars * 8) + (gh.followers * 3) + (gh.languages.length * 5));
        weighted += ghScore * 30;
        totalWeight += 30;
    }
    if (cf && cf.rating > 0) {
        weighted += Math.min(100, cf.rating / 22) * 30;
        totalWeight += 30;
    }
    return totalWeight === 0 ? 0 : Math.round(weighted / totalWeight);
}

// --- GET SCORE COLOR ---
function getScoreColor(score) {
    if (score >= 80) return '#00ff88';
    if (score >= 60) return '#A4F000';
    if (score >= 40) return '#FFA116';
    if (score >= 20) return '#FF6B35';
    return '#ff3131';
}

// --- RENDER CODING STATS SECTION (returns HTML string) ---
function renderCodingStatsSection() {
    return `
        <div class="lg:col-span-3 mb-2">
            <div class="flex flex-wrap justify-between items-center border-b border-red-900/50 pb-2 mb-6">
                <h3 class="mono text-red-500 font-bold uppercase tracking-widest flex items-center gap-2">
                    <i class="fa-solid fa-satellite-dish"></i> Coding_Intelligence
                </h3>
                <div class="flex gap-2 mt-2 sm:mt-0">
                    <button onclick="promptConfigPlatforms()" class="text-[10px] mono text-gray-400 hover:text-white border border-white/10 hover:border-white/50 px-3 py-1.5 transition-all rounded bg-white/5 flex items-center gap-2">
                        <i class="fa-solid fa-link"></i> Link_Platforms
                    </button>
                    <button onclick="refreshCodingStats()" class="text-[10px] mono text-red-500/70 hover:text-red-500 border border-red-600/30 hover:border-red-600 px-3 py-1.5 transition-all rounded bg-red-600/5 flex items-center gap-2" id="refresh-stats-btn">
                        <i class="fa-solid fa-rotate"></i> Sync
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="coding-stats-grid">
                <!-- Score Ring -->
                <div class="dossier-card flex flex-col items-center justify-center py-8 relative overflow-hidden">
                    <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
                    <div class="score-ring-wrap">
                        <svg class="score-ring" width="140" height="140" viewBox="0 0 140 140">
                            <circle class="score-ring-bg" cx="70" cy="70" r="60"/>
                            <circle class="score-ring-fill" cx="70" cy="70" r="60" id="score-ring-fill" stroke-dasharray="377" stroke-dashoffset="377"/>
                        </svg>
                        <div class="score-center">
                            <span class="score-val" id="composite-score-val">--</span>
                            <span class="score-max">/ 100</span>
                        </div>
                    </div>
                    <p class="mono text-[9px] text-gray-500 mt-3 uppercase tracking-[0.3em]">Composite Score</p>
                    <p class="mono text-[10px] font-bold mt-1 uppercase tracking-[0.4em]" id="score-rank-label" style="color:#666">INITIALIZING</p>
                </div>
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
                <!-- Codeforces -->
                <div class="dossier-card platform-card relative overflow-hidden">
                    <div class="bracket tl"></div><div class="bracket tr"></div><div class="bracket bl"></div><div class="bracket br"></div>
                    <div class="flex items-center gap-2 mb-4">
                        <i class="fa-solid fa-trophy" style="color:#1890ff"></i>
                        <span class="font-bold text-xs uppercase tracking-widest" style="color:#1890ff">Codeforces</span>
                    </div>
                    <div id="cf-stats-content">
                        <div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Scanning...</div>
                    </div>
                </div>
            </div>
        </div>`;
}

// --- RENDER INDIVIDUAL PLATFORM STATS ---
function renderLCStats(data) {
    if (!data) return `<div class="stats-empty"><i class="fa-solid fa-unlink"></i> Not linked<p class="text-[9px] mt-2 text-gray-600">Click Link_Platforms to connect</p></div>`;
    const easyPct = data.totalEasy > 0 ? (data.easy / data.totalEasy * 100).toFixed(0) : 0;
    const medPct = data.totalMedium > 0 ? (data.medium / data.totalMedium * 100).toFixed(0) : 0;
    const hardPct = data.totalHard > 0 ? (data.hard / data.totalHard * 100).toFixed(0) : 0;
    return `
        <div class="space-y-3">
            <div class="stat-row"><span class="text-green-400">Easy</span><span class="font-bold text-white">${data.easy}<span class="text-gray-600">/${data.totalEasy}</span></span></div>
            <div class="lc-diff-bar"><div class="lc-diff-fill lc-easy" style="width:${easyPct}%"></div></div>
            <div class="stat-row"><span class="text-yellow-400">Medium</span><span class="font-bold text-white">${data.medium}<span class="text-gray-600">/${data.totalMedium}</span></span></div>
            <div class="lc-diff-bar"><div class="lc-diff-fill lc-medium" style="width:${medPct}%"></div></div>
            <div class="stat-row"><span class="text-red-400">Hard</span><span class="font-bold text-white">${data.hard}<span class="text-gray-600">/${data.totalHard}</span></span></div>
            <div class="lc-diff-bar"><div class="lc-diff-fill lc-hard" style="width:${hardPct}%"></div></div>
            <div class="stat-row border-t border-white/10 pt-2 mt-2"><span class="text-gray-400">Total Solved</span><span class="font-bold text-white text-lg">${data.total}</span></div>
            ${data.ranking ? `<div class="stat-row"><span class="text-gray-400">Global Rank</span><span class="mono text-xs text-gray-300">#${data.ranking.toLocaleString()}</span></div>` : ''}
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

function renderCFStats(data) {
    if (!data) return `<div class="stats-empty"><i class="fa-solid fa-unlink"></i> Not linked<p class="text-[9px] mt-2 text-gray-600">Click Link_Platforms to connect</p></div>`;
    const rankColors = { 'newbie': '#808080', 'pupil': '#008000', 'specialist': '#03a89e', 'expert': '#0000ff', 'candidate master': '#aa00aa', 'master': '#ff8c00', 'international master': '#ff8c00', 'grandmaster': '#ff0000' };
    const color = rankColors[data.rank.toLowerCase()] || '#808080';
    const ratingPct = Math.min(100, (data.rating / 2400) * 100);
    return `
        <div class="space-y-3">
            <div class="stat-row"><span class="text-gray-400">Rating</span><span class="font-bold text-xl" style="color:${color}">${data.rating}</span></div>
            <div class="lc-diff-bar"><div class="lc-diff-fill" style="width:${ratingPct}%;background:${color};box-shadow:0 0 8px ${color}"></div></div>
            <div class="stat-row"><span class="text-gray-400">Max Rating</span><span class="font-bold text-white">${data.maxRating}</span></div>
            <div class="stat-row"><span class="text-gray-400">Rank</span><span class="font-bold uppercase text-xs tracking-widest" style="color:${color}">${data.rank}</span></div>
            <div class="stat-row"><span class="text-gray-400">Max Rank</span><span class="mono text-xs text-gray-300 uppercase">${data.maxRank}</span></div>
        </div>`;
}

// --- UPDATE SCORE RING ---
function updateScoreRing(score) {
    const ring = document.getElementById('score-ring-fill');
    const valEl = document.getElementById('composite-score-val');
    const rankEl = document.getElementById('score-rank-label');
    if (!ring || !valEl) return;
    const circumference = 2 * Math.PI * 60; // r=60
    const offset = circumference - (score / 100) * circumference;
    const color = getScoreColor(score);
    ring.style.strokeDashoffset = offset;
    ring.style.stroke = color;
    ring.style.filter = `drop-shadow(0 0 8px ${color})`;
    valEl.textContent = score;
    valEl.style.color = color;
    valEl.style.textShadow = `0 0 20px ${color}`;
    // Update rank label
    if (rankEl) {
        const rank = getScoreRank(score);
        rankEl.textContent = rank.label;
        rankEl.style.color = rank.color;
        rankEl.style.textShadow = `0 0 10px ${rank.color}`;
    }
}

// --- LOAD CODING STATS (main async function) ---
async function loadCodingStats(name) {
    const allPeople = [...(window.mentorsData || []), ...(window.studentsData || [])];
    const person = allPeople.find(p => p.name === name);
    if (!person) return;

    const state = window.getDossierState(name);
    const ghUsername = state.platforms?.github || extractGitHubUsername(person.github);
    const lcUsername = state.platforms?.leetcode || person.leetcode || '';
    const cfHandle = state.platforms?.codeforces || person.codeforces || '';

    // Fetch all in parallel
    const [lcData, ghData, cfData] = await Promise.all([
        fetchLeetCodeStats(lcUsername),
        fetchGitHubStats(ghUsername),
        fetchCodeforcesStats(cfHandle)
    ]);

    // Update UI
    const lcEl = document.getElementById('lc-stats-content');
    const ghEl = document.getElementById('gh-stats-content');
    const cfEl = document.getElementById('cf-stats-content');
    if (lcEl) lcEl.innerHTML = renderLCStats(lcData);
    if (ghEl) ghEl.innerHTML = renderGHStats(ghData);
    if (cfEl) cfEl.innerHTML = renderCFStats(cfData);

    // Calculate and show composite score
    const score = calculateCompositeScore(lcData, ghData, cfData);
    updateScoreRing(score);
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
    const ghU = state.platforms?.github || extractGitHubUsername(person?.github);
    const lcU = state.platforms?.leetcode || person?.leetcode || '';
    const cfU = state.platforms?.codeforces || person?.codeforces || '';
    delete cache[`lc_${lcU}`]; delete cache[`gh_${ghU}`]; delete cache[`cf_${cfU}`];
    try { localStorage.setItem('coding_stats_cache', JSON.stringify(cache)); } catch {}
    // Re-render loading state
    const grid = document.getElementById('coding-stats-grid');
    if (grid) {
        document.getElementById('lc-stats-content').innerHTML = '<div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Re-syncing...</div>';
        document.getElementById('gh-stats-content').innerHTML = '<div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Re-syncing...</div>';
        document.getElementById('cf-stats-content').innerHTML = '<div class="stats-loader"><i class="fa-solid fa-spinner fa-spin"></i> Re-syncing...</div>';
        document.getElementById('composite-score-val').textContent = '--';
        document.getElementById('score-ring-fill').style.strokeDashoffset = 377;
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
            codeforces: person?.codeforces || ''
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
                <label class="block text-[9px] mono text-gray-500 uppercase tracking-widest mb-1 font-bold">Codeforces Handle</label>
                <input type="text" id="in-cf-user" value="${state.platforms.codeforces}" placeholder="e.g. ashwin_cf" class="w-full bg-black border border-white/20 p-3 text-white text-sm mono outline-none focus:border-red-600">
            </div>
        </div>`;
    document.getElementById('input-modal-save').onclick = () => {
        state.platforms = {
            leetcode: document.getElementById('in-lc-user').value.trim(),
            github: document.getElementById('in-gh-user').value.trim(),
            codeforces: document.getElementById('in-cf-user').value.trim()
        };
        savePlatformConfig(name, state.platforms);
        closeInputModal();
        refreshCodingStats();
    };
    document.getElementById('input-modal').style.display = 'flex';
}
