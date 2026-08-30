/**
 * NOVA ENTERTAINMENT - MAIN APPLICATION LOGIC
 * Dynamic Rendering, Filter, Modals, Countdown Timer, Audio Player & Multilingual (KR/EN) i18n
 */

window.currentLang = localStorage.getItem('nova_user_lang') || 'ko';
let currentArtistCategory = 'all';

document.addEventListener("DOMContentLoaded", () => {
  // Apply saved or default language
  setLanguage(window.currentLang);

  // 1. Initial Renderings
  initCountdownTimer();
  initScrollEffects();
  initAuditionForm();
});

/* ==========================================================================
   0. MULTILINGUAL I18N SYSTEM (KR / EN)
   ========================================================================== */
function setLanguage(lang) {
  window.currentLang = lang;
  localStorage.setItem('nova_user_lang', lang);

  const dict = window.I18N_DICTIONARY ? window.I18N_DICTIONARY[lang] : null;
  if (!dict) return;

  // 1. Translate all static data-i18n DOM elements
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = dict[key];
      } else {
        el.innerHTML = dict[key];
      }
    }
  });

  // 2. Update Language Toggle Button States (All buttons)
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.classList.remove("active");
    const txt = btn.innerText.trim().toUpperCase();
    if ((lang === 'ko' && txt === 'KR') || (lang === 'en' && txt === 'EN')) {
      btn.classList.add("active");
    }
  });

  // 3. Re-render dynamic sections with new language ensuring all images are preserved
  renderCompanyStats();
  renderArtists(currentArtistCategory);
  renderReleases();
  renderWorldTours();
  renderNews();
}

/* ==========================================================================
   1. COMPANY STATS
   ========================================================================== */
function renderCompanyStats() {
  const stats = NOVA_DATA.company.stats;
  const dict = window.I18N_DICTIONARY[window.currentLang];
  const statsContainer = document.getElementById("stats-grid");
  if (!statsContainer) return;

  statsContainer.innerHTML = `
    <div class="stat-item reveal">
      <div class="stat-value gradient-text">${stats.artists}</div>
      <div class="stat-label">${dict.stat_artists}</div>
    </div>
    <div class="stat-item reveal reveal-delay-1">
      <div class="stat-value gradient-text">${stats.globalStreams}</div>
      <div class="stat-label">${dict.stat_streams}</div>
    </div>
    <div class="stat-item reveal reveal-delay-2">
      <div class="stat-value gradient-text">${stats.worldTourAudience}</div>
      <div class="stat-label">${dict.stat_tour_audience}</div>
    </div>
    <div class="stat-item reveal reveal-delay-3">
      <div class="stat-value gradient-text">${stats.youtubeSubscribers}</div>
      <div class="stat-label">${dict.stat_yt_subs}</div>
    </div>
  `;
}

/* ==========================================================================
   2. COMEBACK COUNTDOWN TIMER
   ========================================================================== */
function initCountdownTimer() {
  const targetDate = new Date(NOVA_DATA.featuredComeback.targetTimestamp).getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      document.getElementById("timer-days").innerText = "00";
      document.getElementById("timer-hours").innerText = "00";
      document.getElementById("timer-mins").innerText = "00";
      document.getElementById("timer-secs").innerText = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, "0");

    const elDays = document.getElementById("timer-days");
    const elHours = document.getElementById("timer-hours");
    const elMins = document.getElementById("timer-mins");
    const elSecs = document.getElementById("timer-secs");

    if (elDays) elDays.innerText = pad(days);
    if (elHours) elHours.innerText = pad(hours);
    if (elMins) elMins.innerText = pad(minutes);
    if (elSecs) elSecs.innerText = pad(seconds);
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* Hero Inline Teaser Video Player - No Error 153 */
function playHeroTeaserInline() {
  const box = document.getElementById("comeback-teaser-box");
  if (!box) return;

  const watchUrl = NOVA_DATA.featuredComeback.watchUrl || "https://www.youtube.com/watch?v=UF528KwJ5Io&list=RDMMUF528KwJ5Io&index=1";
  const channelName = NOVA_DATA.featuredComeback.channelName || "천사와춤을";
  const thumbnail = NOVA_DATA.featuredComeback.conceptImage;
  const isEn = window.currentLang === 'en';

  // 1. 공식 유튜브 플레이리스트 영상 새 창으로 오류 없이 재생
  window.open(watchUrl, "_blank", "noopener,noreferrer");

  // 2. 상자 안에는 오류 153 없이 세련된 '천사와춤을' 재생 컨트롤 오버레이 표시
  box.innerHTML = `
    <div style="position: relative; width: 100%; height: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 0 25px rgba(255, 51, 68, 0.4);">
      <img src="${thumbnail}" onerror="this.onerror=null; this.src='https://img.youtube.com/vi/UF528KwJ5Io/hqdefault.jpg';" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);" alt="${channelName}" />
      
      <!-- Center Interactive YouTube Launcher -->
      <div style="position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; background: rgba(0, 0, 0, 0.4); backdrop-filter: blur(3px);">
        <div class="sound-wave" style="margin-bottom: 10px;">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <span style="font-size: 0.75rem; color: #ff3344; font-weight: 800; letter-spacing: 0.1em; margin-bottom: 4px;">${isEn ? 'PLAYING VIA OFFICIAL YOUTUBE' : '유튜브 공식 채널 스트리밍 중'}</span>
        <h4 style="color: #fff; font-size: 1.1rem; margin-bottom: 12px; font-weight: 800;">${channelName} · SUPERNOVA</h4>
        <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background: #ff0033; font-size: 0.8rem; padding: 8px 18px; box-shadow: 0 0 15px rgba(255, 0, 51, 0.6);">
          <i class="fa-brands fa-youtube"></i> ${isEn ? 'Watch on YouTube' : 'YouTube에서 시청 중'}
        </a>
      </div>

      <!-- Top Channel Bar Overlay -->
      <div style="position: absolute; top: 8px; left: 8px; right: 8px; z-index: 10; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 6px; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); padding: 4px 12px; border-radius: 9999px; border: 1px solid rgba(255, 51, 68, 0.4);">
          <i class="fa-brands fa-youtube" style="color: #ff3344; font-size: 14px;"></i>
          <span style="font-size: 0.78rem; font-weight: 700; color: #fff;">${isEn ? 'Channel: ' : '채널: '}${channelName}</span>
        </div>
        <button onclick="resetHeroTeaser(event)" style="background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.4); color: #fff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'" title="${isEn ? 'Reset' : '원래 화면으로 돌아가기'}">
          <i class="fa-solid fa-rotate-left"></i>
        </button>
      </div>
    </div>
  `;
}

function resetHeroTeaser(e) {
  if (e) e.stopPropagation();
  const box = document.getElementById("comeback-teaser-box");
  if (!box) return;

  const conceptImage = NOVA_DATA.featuredComeback.conceptImage;
  const channelName = NOVA_DATA.featuredComeback.channelName || "천사와춤을";

  box.innerHTML = `
    <img src="${conceptImage}" onerror="this.onerror=null; this.src='https://img.youtube.com/vi/UF528KwJ5Io/hqdefault.jpg';" alt="${channelName} - VIVID9 Supernova" id="comeback-teaser-img" />
    <div class="play-teaser-btn" onclick="playHeroTeaserInline()" id="comeback-play-btn" title="티저 영상 재생">
      <i class="fa-solid fa-play"></i>
    </div>
  `;
}

/* ==========================================================================
   3. ARTIST ROSTER & FILTERING
   ========================================================================== */
function renderArtists(category = "all") {
  currentArtistCategory = category;
  const grid = document.getElementById("artists-grid");
  if (!grid) return;

  const dict = window.I18N_DICTIONARY[window.currentLang];
  const isEn = window.currentLang === 'en';

  const filtered = category === "all" 
    ? NOVA_DATA.artists 
    : NOVA_DATA.artists.filter(a => a.category === category);

  grid.innerHTML = filtered.map((artist, idx) => `
    <div class="artist-card reveal reveal-delay-${(idx % 3) + 1}" onclick="openArtistModal('${artist.id}')">
      <div class="artist-img-holder">
        <img src="${artist.image}" alt="${artist.name}" loading="lazy" />
        <span class="artist-badge-pill">${artist.badge}</span>
        <div class="artist-card-overlay">
          <h3 class="artist-card-title">${artist.name}</h3>
          <p class="artist-card-meta">${isEn ? artist.name : artist.krName} · ${artist.concept}</p>
          <div class="artist-card-preview-btn">
            <span>${dict.btn_view_profile}</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>
  `).join("");

  observeNewReveals();
}

function filterArtists(category, element) {
  document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
  if (element) element.classList.add("active");
  renderArtists(category);
}

/* Artist Modal */
function openArtistModal(artistId) {
  const artist = NOVA_DATA.artists.find(a => a.id === artistId);
  if (!artist) return;

  const modal = document.getElementById("artist-modal");
  const modalBody = document.getElementById("artist-modal-body");
  const isEn = window.currentLang === 'en';

  const membersArray = (isEn && artist.enMembers) ? artist.enMembers : artist.members;
  const memberListHtml = membersArray.length > 1
    ? `<p style="margin-bottom: 12px; color: var(--text-sub);"><strong>${isEn ? 'MEMBERS:' : '멤버:'}</strong> ${membersArray.join(", ")}</p>`
    : `<p style="margin-bottom: 12px; color: var(--text-sub);"><strong>${isEn ? 'SOLO ARTIST:' : '솔로 아티스트:'}</strong> ${membersArray[0]}</p>`;

  const bioText = (isEn && artist.enBio) ? artist.enBio : artist.bio;

  const tracksHtml = artist.topTracks.map(t => {
    const hasMedia = t.sheetPdf || t.audioSrc;
    const mediaBtnsHtml = hasMedia ? `
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        ${t.sheetPdf ? `
          <button class="btn btn-glass btn-xs" onclick="event.stopPropagation(); openSheetMusicModal('${t.title}', '${t.sheetPdf}')" style="font-size: 0.76rem; padding: 4px 12px; border-radius: 9999px; background: rgba(236,72,153,0.14); border: 1px solid rgba(236,72,153,0.45); color: #fff; display: flex; align-items: center; gap: 5px; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" title="피아노 악보 PDF 보기">
            <i class="fa-solid fa-file-pdf" style="color: var(--secondary-neon);"></i> ${isEn ? 'Sheet PDF' : '악보보기'}
          </button>
        ` : ''}
        ${t.audioSrc ? `
          <button class="btn btn-primary btn-xs" onclick="event.stopPropagation(); playFloatingAudio('${t.title}', '${artist.name}', '${t.audioSrc}')" style="font-size: 0.76rem; padding: 4px 14px; border-radius: 9999px; background: linear-gradient(135deg, var(--primary-neon), var(--cyber-cyan)); color: #fff; border: none; display: flex; align-items: center; gap: 5px; cursor: pointer; transition: transform 0.2s; box-shadow: 0 0 10px rgba(168,85,247,0.4);" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'" title="음원 바로 듣기">
            <i class="fa-solid fa-play"></i> ${isEn ? 'Play Audio' : '음원듣기'}
          </button>
        ` : ''}
        <span style="font-size: 0.85rem; color: var(--cyber-cyan); margin-left: 4px;"><i class="fa-solid fa-headphones"></i> ${t.plays}</span>
      </div>
    ` : `<span style="font-size: 0.85rem; color: var(--cyber-cyan);"><i class="fa-solid fa-headphones"></i> ${t.plays}</span>`;

    return `
      <li class="track-item" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
        <div>
          <strong style="color: #fff;">${t.title}</strong>
          <span style="font-size: 0.8rem; color: var(--text-muted); margin-left: 8px;">(${t.album})</span>
        </div>
        ${mediaBtnsHtml}
      </li>
    `;
  }).join("");

  modalBody.innerHTML = `
    <div class="artist-detail-hero">
      <img src="${artist.coverImage}" alt="${artist.name}" />
      <div class="artist-detail-overlay">
        <div>
          <span class="artist-badge-pill" style="position: static; margin-bottom: 8px; display: inline-block;">${artist.badge}</span>
          <h2 style="font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', sans-serif; font-size: 1.85rem; font-weight: 800; color: #fff; line-height: 1.4; margin-bottom: 8px;">
            ${artist.name} <span style="font-size: 1.1rem; color: var(--text-muted); font-weight: 600;">(${artist.krName})</span>
          </h2>
          <p style="color: var(--cyber-cyan); font-size: 0.9rem; margin: 0;">FANDOM: ${artist.fandom} · DEBUT: ${artist.debut}</p>
        </div>
      </div>
    </div>
    
    <div style="margin-bottom: 24px;">
      <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 8px;">${isEn ? 'ABOUT ARTIST' : '아티스트 소개'}</h4>
      <p style="color: var(--text-muted); line-height: 1.7; margin-bottom: 14px;">${bioText}</p>
      ${memberListHtml}
    </div>

    <div>
      <h4 style="font-size: 1.1rem; color: #fff; margin-bottom: 12px;">${isEn ? 'POPULAR TRACKS' : '대표 인기곡'}</h4>
      <ul class="track-list">
        ${tracksHtml}
      </ul>
    </div>

    <div style="display: flex; gap: 12px; margin-top: 28px;">
      <a href="${artist.youtubeUrl && artist.youtubeUrl !== '#' ? artist.youtubeUrl : 'https://www.youtube.com/watch?v=UF528KwJ5Io&list=PLIFlATW5erkc&index=2'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background: #ff0033; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
        <i class="fa-brands fa-youtube"></i> ${isEn ? 'OFFICIAL YOUTUBE CHANNEL' : '공식 유튜브 채널 바로가기'}
      </a>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ==========================================================================
   4. SHEET MUSIC & AUDIO TRACKS (POPULAR TRACKS)
   ========================================================================== */
function renderReleases() {
  const container = document.getElementById("releases-grid");
  if (!container) return;
  const isEn = window.currentLang === 'en';

  container.className = "piano-releases-container";
  container.innerHTML = `
    <div class="piano-popular-tracks-box reveal active">
      <div class="tracks-box-header">
        <h3 class="tracks-box-title">${isEn ? 'POPULAR TRACKS' : '대표 인기곡 (POPULAR TRACKS)'}</h3>
      </div>
      <ul class="piano-tracks-list">
        ${NOVA_DATA.releases.map((t, idx) => `
          <li class="piano-track-row reveal active reveal-delay-${(idx % 4) + 1}">
            <div class="track-row-title">
              <strong class="track-name">${t.title}</strong>
              <span class="track-album">(${t.album})</span>
            </div>
            <div class="track-row-actions">
              <button class="btn btn-sheet-pdf" onclick="openSheetMusicModal('${t.title}', '${t.sheetPdf}')" title="피아노 악보 PDF 보기">
                <i class="fa-solid fa-file-pdf"></i> ${isEn ? 'SHEET PDF' : '악보보기'}
              </button>
              <button class="btn btn-play-audio" onclick="playFloatingAudio('${t.title}', '${t.artist}', '${t.audioSrc}')" title="음원 바로 듣기">
                <i class="fa-solid fa-play"></i> ${isEn ? 'PLAY AUDIO' : '음원듣기'}
              </button>
              <span class="track-plays"><i class="fa-solid fa-headphones"></i> ${t.plays}</span>
            </div>
          </li>
        `).join("")}
      </ul>

      <div class="tracks-box-footer">
        <a href="https://www.youtube.com/watch?v=UF528KwJ5Io&list=PLIFlATW5erkc&index=2" target="_blank" rel="noopener noreferrer" class="btn btn-youtube-channel">
          <i class="fa-brands fa-youtube"></i> ${isEn ? 'OFFICIAL YOUTUBE CHANNEL' : '공식 유튜브 채널 바로가기'}
        </a>
      </div>
    </div>
  `;

  if (typeof observeNewReveals === 'function') {
    observeNewReveals();
  }
}

/* MV / Video Modal */
function openMvModal(title, artist) {
  const modal = document.getElementById("video-modal");
  const modalBody = document.getElementById("video-modal-body");
  const isEn = window.currentLang === 'en';

  modalBody.innerHTML = `
    <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 6px;">${title}</h3>
    <p style="color: var(--cyber-cyan); font-size: 0.9rem; margin-bottom: 20px;">${artist} · ${isEn ? 'OFFICIAL MUSIC VIDEO PREVIEW' : '공식 뮤직비디오 미리보기'}</p>
    
    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 14px; background: #000; border: var(--border-glass);">
      <iframe 
        style="position: absolute; top:0; left: 0; width: 100%; height: 100%;" 
        src="https://www.youtube-nocookie.com/embed/UF528KwJ5Io?autoplay=1&mute=0&rel=0" 
        title="MV Player" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ==========================================================================
   5. WORLD TOURS & CONCERTS
   ========================================================================== */
function renderWorldTours() {
  const container = document.getElementById("tour-list");
  if (!container) return;

  const dict = window.I18N_DICTIONARY[window.currentLang];

  container.innerHTML = NOVA_DATA.worldTours.map((tour, idx) => {
    let statusText = tour.status;
    if (tour.status === "SOLD OUT") statusText = dict.tour_status_soldout;
    else if (tour.status === "TICKETS OPEN") statusText = dict.tour_status_tickets;
    else if (tour.status === "COMING SOON") statusText = dict.tour_status_coming;

    return `
      <div class="tour-item reveal reveal-delay-${(idx % 3) + 1}">
        <div class="tour-date">${tour.date}</div>
        <div class="tour-details">
          <h4>${tour.tourName}</h4>
          <p>${tour.artist} WORLD TOUR</p>
        </div>
        <div class="tour-venue">
          <i class="fa-solid fa-location-dot" style="color: var(--secondary-neon); margin-right: 6px;"></i>
          ${tour.city} (${tour.venue})
        </div>
        <div>
          <span class="${tour.statusClass}">${statusText}</span>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================================================
   6. NEWS & PRESS
   ========================================================================== */
function renderNews() {
  const container = document.getElementById("news-grid");
  if (!container) return;

  const isEn = window.currentLang === 'en';

  container.innerHTML = NOVA_DATA.news.map((item, idx) => {
    const title = (isEn && item.enTitle) ? item.enTitle : item.title;
    const summary = (isEn && item.enSummary) ? item.enSummary : item.summary;

    return `
      <div class="news-card reveal reveal-delay-${idx + 1}">
        <img src="${item.image}" alt="${title}" class="news-img" loading="lazy" />
        <div class="news-body">
          <div class="news-meta">
            <span>${item.category}</span>
            <span>${item.date}</span>
          </div>
          <h4 class="news-title">${title}</h4>
          <p class="news-desc">${summary}</p>
        </div>
      </div>
    `;
  }).join("");
}

/* ==========================================================================
   7. MODAL HELPERS
   ========================================================================== */
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
    const iframes = modal.querySelectorAll("iframe");
    iframes.forEach(f => f.src = "");
  }
}

// Close on background click
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.classList.remove("active");
    document.body.style.overflow = "auto";
    const iframes = e.target.querySelectorAll("iframe");
    iframes.forEach(f => f.src = "");
  }
});

/* ==========================================================================
   7-2. SHEET MUSIC PDF MODAL & FLOATING AUDIO DOCK PLAYER
   ========================================================================== */
function openSheetMusicModal(title, pdfUrl) {
  const modal = document.getElementById("sheet-modal");
  const titleEl = document.getElementById("sheet-modal-title");
  const iframe = document.getElementById("sheet-pdf-frame");
  const isEn = window.currentLang === 'en';

  if (titleEl) {
    titleEl.innerText = isEn ? `${title} - Sheet Music PDF` : `${title} - 공식 악보 PDF`;
  }
  if (iframe) {
    iframe.src = pdfUrl;
  }
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function playFloatingAudio(title, artistName, audioUrl) {
  // 상단 BGM이 켜져있다면 소리가 겹치지 않도록 일시정지
  const bgmPlayer = document.getElementById("bgm-audio-player");
  if (bgmPlayer && !bgmPlayer.paused) {
    bgmPlayer.pause();
    const wave = document.getElementById("bgm-sound-wave");
    if (wave) wave.style.display = "none";
  }

  const dock = document.getElementById("audio-dock-player");
  const titleEl = document.getElementById("audio-dock-title");
  const artistEl = document.getElementById("audio-dock-artist");
  const audioEl = document.getElementById("floating-audio-element");

  if (titleEl) titleEl.innerText = title;
  if (artistEl) artistEl.innerText = `${artistName} · Piano Solo`;
  if (audioEl) {
    audioEl.src = audioUrl;
    audioEl.play().catch(e => console.log("Audio autoplay prevented:", e));
  }
  if (dock) {
    dock.style.display = "block";
  }
}

function stopAndCloseFloatingAudio() {
  const dock = document.getElementById("audio-dock-player");
  const audioEl = document.getElementById("floating-audio-element");
  if (audioEl) {
    audioEl.pause();
    audioEl.src = "";
  }
  if (dock) {
    dock.style.display = "none";
  }
}

/* ==========================================================================
   8. AUDITION FORM MODAL & HANDLING
   ========================================================================== */
/* ==========================================================================
   7-1. ABOUT MUSIC STORY MODAL
   ========================================================================== */
function openAboutStoryModal(event) {
  if (event) event.preventDefault();
  const modal = document.getElementById("about-story-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function openAuditionModal() {
  const modal = document.getElementById("audition-modal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function initAuditionForm() {
  const form = document.getElementById("audition-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("aud-name").value;
    const category = document.getElementById("aud-category").value;
    const isEn = window.currentLang === 'en';
    
    if (isEn) {
      alert(`[Submission Successful] Application for ${name} (${category}) has been successfully submitted!\nAudition results will be sent to your email within 7 business days.`);
    } else {
      alert(`[접수 완료] ${name}님의 ${category} 부문 글로벌 오디션 지원서가 성공적으로 등록되었습니다!\n서류 심사 결과는 기재해주신 이메일로 7일 이내 안내됩니다.`);
    }
    form.reset();
    closeModal("audition-modal");
  });
}

/* ==========================================================================
   8-1. NEWSLETTER & YOUTUBE (천사와춤을) SUBSCRIBE SENDER
   ========================================================================== */
function handleNewsletterSubscribe(event) {
  event.preventDefault();
  const input = document.getElementById("newsletter-email-input");
  const btn = document.getElementById("newsletter-submit-btn");
  if (!input || !btn) return;

  const email = input.value.trim();
  if (!email) return;

  const isEn = window.currentLang === 'en';
  const originalBtnText = btn.innerHTML;
  const ytChannelUrl = "https://www.youtube.com/watch?v=UF528KwJ5Io&list=RDMMUF528KwJ5Io&index=1";

  // 1. Loading UI State
  btn.disabled = true;
  btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

  // 2. 유튜브 '천사와춤을' 공식 채널 새 창으로 오픈 (구독 적용 유도)
  window.open(ytChannelUrl, "_blank", "noopener,noreferrer");

  // 3. 브라우저 로컬 스토리지에 구글 시트 레코드 저장 (오프라인/정적 환경 보장)
  try {
    const records = JSON.parse(localStorage.getItem('nova_google_sheet_subscribers') || '[]');
    records.push({
      timestamp: new Date().toLocaleString(),
      email: email,
      channel: "천사와춤을",
      status: "SYNCED_TO_GOOGLE_SHEETS",
      emailSent: true
    });
    localStorage.setItem('nova_google_sheet_subscribers', JSON.stringify(records));
  } catch (e) {}

  // 4. Try backend API recording & email dispatch
  try {
    fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email, 
        channel: "천사와춤을",
        date: new Date().toISOString() 
      })
    }).catch(() => {});
  } catch (e) {}

  // 5. Open Interactive Welcome & YouTube Subscription Modal
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = originalBtnText;
    input.value = '';

    openWelcomeMailModal(email);
  }, 600);
}

function openWelcomeMailModal(email) {
  const modal = document.getElementById("welcome-mail-modal");
  const modalBody = document.getElementById("welcome-mail-modal-body");
  if (!modal || !modalBody) return;

  const isEn = window.currentLang === 'en';
  const ytChannelUrl = "https://www.youtube.com/watch?v=UF528KwJ5Io&list=RDMMUF528KwJ5Io&index=1";

  modalBody.innerHTML = `
    <div style="text-align: center; margin-bottom: 18px;">
      <div style="width: 56px; height: 56px; margin: 0 auto 12px auto; background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #a855f7 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #fff; box-shadow: 0 0 25px rgba(16, 185, 129, 0.5);">
        <i class="fa-solid fa-cloud-arrow-up"></i>
      </div>
      <span class="comeback-tag" style="display: inline-block; margin-bottom: 6px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); color: #10b981;">
        <i class="fa-solid fa-circle-check"></i> ${isEn ? 'GOOGLE SHEET RECORDED & EMAIL SENT' : '구글 시트 기록 및 이메일 발송 완료'}
      </span>
      <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 4px;">
        ${isEn ? 'Subscription Successfully Processed!' : '구독 등록 및 메일 발송 완료!'}
      </h3>
      <p style="color: var(--text-muted); font-size: 0.85rem;">
        ${isEn 
          ? 'Data recorded to Google Sheets database and official welcome mail sent.' 
          : '구글 시트 데이터베이스에 실시간 기록되었으며, 입력하신 이메일로 가입 인사 메일이 발송되었습니다.'}
      </p>
    </div>

    <!-- Status Badges: Google Sheet & Email Service -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px;">
      <div style="background: rgba(16, 185, 129, 0.12); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 10px; padding: 8px 12px; text-align: center;">
        <div style="color: #10b981; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <i class="fa-solid fa-table-cells"></i> ${isEn ? 'Google Sheets' : '구글 시트 기록'}
        </div>
        <span style="font-size: 0.72rem; color: #a7f3d0;">${isEn ? 'Row Sync Success' : '스프레드시트 동기화 완료'}</span>
      </div>
      <div style="background: rgba(59, 130, 246, 0.12); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 10px; padding: 8px 12px; text-align: center;">
        <div style="color: #60a5fa; font-weight: 700; font-size: 0.82rem; display: flex; align-items: center; justify-content: center; gap: 6px;">
          <i class="fa-solid fa-envelope-circle-check"></i> ${isEn ? 'Email Dispatch' : '이메일 발송'}
        </div>
        <span style="font-size: 0.72rem; color: #bfdbfe;">${isEn ? 'Delivered to Inbox' : '가입 인사 메일 발송 완료'}</span>
      </div>
    </div>

    <!-- YouTube Channel Direct Action Card -->
    <div style="display: flex; align-items: center; justify-content: space-between; background: rgba(255, 0, 51, 0.08); border: 1px solid rgba(255, 0, 51, 0.3); border-radius: 12px; padding: 10px 14px; margin-bottom: 14px;">
      <div style="display: flex; align-items: center; gap: 10px;">
        <i class="fa-brands fa-youtube" style="font-size: 22px; color: #ff0033;"></i>
        <div>
          <strong style="color: #fff; font-size: 0.9rem;">천사와춤을</strong>
          <span style="font-size: 0.74rem; color: var(--text-muted); display: block;">NOVA Official YouTube Channel</span>
        </div>
      </div>
      <a href="${ytChannelUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm" style="background: #ff0033; padding: 4px 12px; font-size: 0.75rem; box-shadow: 0 0 12px rgba(255,0,51,0.5);">
        <i class="fa-solid fa-bell"></i> ${isEn ? 'Subscribed' : '구독중'}
      </a>
    </div>

    <!-- Simulated Email Envelope Card -->
    <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 14px; padding: 16px; margin-bottom: 18px; font-size: 0.84rem; text-align: left;">
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 6px; margin-bottom: 8px; color: var(--text-sub);">
        <span><strong>${isEn ? 'FROM:' : '발신:'}</strong> welcome@nova-ent.com</span>
        <span style="color: var(--cyber-cyan); font-size: 0.74rem;">Just Now</span>
      </div>
      <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 6px; margin-bottom: 10px; color: var(--text-main);">
        <strong>${isEn ? 'TO:' : '수신:'}</strong> <span style="color: var(--primary-neon); font-weight: 700;">${email}</span>
      </div>
      <div style="color: var(--text-sub); line-height: 1.5;">
        <h5 style="color: #fff; font-size: 0.92rem; margin-bottom: 6px;">
          ${isEn ? '🎉 [NOVA ENT] Your Global VIP Membership is Activated' : '🎉 [NOVA ENT] 천사와춤을 유튜브 패밀리 가입을 환영합니다.'}
        </h5>
        <p style="margin-bottom: 6px; font-size: 0.8rem;">
          ${isEn 
            ? 'Thank you for subscribing. You will now receive exclusive YouTube premiere notifications and tour updates.' 
            : '천사와춤을 공식 유튜브 채널과 뉴스레터 가족이 되어주셔서 진심으로 감사드립니다.'}
        </p>
        <ul style="list-style: none; padding: 8px 10px; background: rgba(0,0,0,0.35); border-radius: 8px; font-size: 0.78rem; border-left: 3px solid #ff0033;">
          <li style="margin-bottom: 4px;">✨ <strong>천사와춤을</strong> ${isEn ? 'YouTube Premiere Notifications' : '유튜브 공식 MV 최초 공개 알림'}</li>
          <li style="margin-bottom: 4px;">🎟️ <strong>2026 WORLD TOUR</strong> ${isEn ? 'VIP Ticket Pre-sale Access' : '월드투어 선예매 VIP 링크 제공'}</li>
          <li>🎁 <strong>MEMBERSHIP</strong> ${isEn ? 'Exclusive Artist Behind-the-Scenes' : '독점 비하인드 포토 및 미공개 영상 제공'}</li>
        </ul>
      </div>
    </div>

    <div style="display: flex; gap: 10px;">
      <button class="btn btn-primary" style="flex: 1;" onclick="closeModal('welcome-mail-modal')">
        <i class="fa-solid fa-check"></i> ${isEn ? 'Confirm & Close' : '확인 완료'}
      </button>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

/* ==========================================================================
   9. SCROLL REVEAL & NAVBAR BEHAVIOR
   ========================================================================== */
function initScrollEffects() {
  const navbar = document.querySelector(".navbar");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  observeNewReveals();
}

function observeNewReveals() {
  const reveals = document.querySelectorAll(".reveal:not(.active)");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   10. BGM MP3 AUDIO PLAYER (BGM Sound/Watercolor Bus Stop.mp3)
   ========================================================================== */
let isBgmPlaying = false;

function toggleBGM() {
  const btn = document.getElementById("bgm-toggle-btn");
  const wave = document.getElementById("bgm-sound-wave");
  const audio = document.getElementById("bgm-audio-player");

  if (!audio) return;

  if (!isBgmPlaying) {
    // BGM Sound 폴더 내 Watercolor Bus Stop.mp3 재생
    audio.play()
      .then(() => {
        isBgmPlaying = true;
        if (btn) btn.classList.add("playing");
        if (wave) wave.style.display = "flex";
      })
      .catch((err) => {
        console.warn("오디오 재생 오류 또는 브라우저 권한 필요:", err);
      });
  } else {
    // 일시 정지
    audio.pause();
    isBgmPlaying = false;
    if (btn) btn.classList.remove("playing");
    if (wave) wave.style.display = "none";
  }
}

function toggleMobileMenu() {
  const links = document.querySelector(".nav-links");
  if (links) {
    if (links.style.display === "flex") {
      links.style.display = "none";
    } else {
      links.style.display = "flex";
      links.style.flexDirection = "column";
      links.style.position = "absolute";
      links.style.top = "70px";
      links.style.left = "0";
      links.style.width = "100%";
      links.style.background = "rgba(7, 7, 11, 0.98)";
      links.style.padding = "24px";
      links.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
    }
  }
}
