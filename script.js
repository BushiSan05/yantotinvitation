const SUPABASE_URL = 'https://mpbzwdvwcaefxtzotywo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wYnp3ZHZ3Y2FlZnh0em90eXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MjkzNTIsImV4cCI6MjA5OTIwNTM1Mn0.dvbsfw79hl9aV9SJRo3D-q5SAnrnSC9-m6rNw7OqTV0';
function setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
setRealViewportHeight();
window.addEventListener('resize', setRealViewportHeight);
window.addEventListener('orientationchange', () => {
    setTimeout(setRealViewportHeight, 100);
});
if (window.visualViewport) { window.visualViewport.addEventListener('resize', setRealViewportHeight); }
let invitationVideo = null;
function generateAmbientEffects() {
    const container = document.getElementById('ambient-wrapper');
    const colors = ['#ff1e00', '#ffcc00', '#ffffff', '#000000'];
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = Math.random() * -20 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.animationDuration = Math.random() * 4 + 3 + 's';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(confetti);
    }
    const animations = ['floatUp', 'floatUp2', 'floatUp3', 'floatUp4'];
    for (let j = 0; j < 20; j++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = Math.random() * 90 + '%';
        balloon.style.bottom = Math.random() * 30 + '%';
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDuration = Math.random() * 4 + 3 + 's';
        balloon.style.animationDelay = Math.random() * 3 + 's';
        balloon.style.animationName = animations[Math.floor(Math.random() * animations.length)];
        balloon.addEventListener('click', () => popBalloon(balloon));
        if (Math.random() < 0.3) {
            const popTime = Math.random() * 2000 + 1000;
            setTimeout(() => {
                if (!balloon.classList.contains('popped')) { popBalloon(balloon); }
            }, popTime);
        }
        container.appendChild(balloon);
    }
    for (let k = 0; k < 30; k++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.color = colors[Math.floor(Math.random() * colors.length)];
        star.style.fontSize = Math.random() * 15 + 10 + 'px';
        star.style.animationDuration = Math.random() * 2 + 1 + 's';
        star.style.animationDelay = Math.random() * 3 + 's';
        star.innerHTML = '✦';
        container.appendChild(star);
    }
    for (let l = 0; l < 25; l++) {
        const sparkle = document.createElement('div');
        sparkle.classList.add('sparkle');
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.width = sparkle.style.height = Math.random() * 6 + 3 + 'px';
        sparkle.style.animationDuration = Math.random() * 3 + 2 + 's';
        sparkle.style.animationDelay = Math.random() * 4 + 's';
        container.appendChild(sparkle);
    }
}
function popBalloon(balloon) {
    if (balloon.classList.contains('popped')) return;
    balloon.classList.add('popped');
    const container = document.getElementById('ambient-wrapper');
    const containerRect = container.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();
    const colors = ['#ff1e00', '#ffcc00', '#ffffff', '#000000'];
    const centerX = balloonRect.left - containerRect.left + balloonRect.width / 2;
    const centerY = balloonRect.top - containerRect.top + balloonRect.height / 2;
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = centerX + 'px';
        particle.style.top = centerY + 'px';
        particle.style.width = '6px';
        particle.style.height = '6px';
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.pointerEvents = 'none';
        particle.style.transition = 'all 0.5s ease-out';
        particle.style.zIndex = '3';
        container.appendChild(particle);
        setTimeout(() => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
        }, 10);
        setTimeout(() => {
            particle.remove();
        }, 500);
    }
    setTimeout(() => {
        balloon.remove();
    }, 300);
}
window.addEventListener('load', () => {
    generateAmbientEffects();
    if (typeof window.supabase === 'undefined') {
        showDiagnosticError('Supabase library failed to load — check your network connection.');
        markMediaReady();
        return;
    }
    initApp();
});
async function initApp() {
    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        bindModalControls();
        loadRSVPList();
        const [slides, video] = await Promise.all([setupSlideshow(), setupVideo()]);
        await preloadMedia([...slides, video, audio, engineSound]);
    } catch (err) {
        showDiagnosticError(`App init failed: ${err.message || err}`);
    } finally {
        markMediaReady();
    }
}
const PRELOAD_TIMEOUT = 20000;
const ASSET_TIMEOUT = 6000;
function preloadMedia(elements) {
    const targets = elements.filter(Boolean);
    if (!targets.length) return Promise.resolve();
    const buffered = targets.map(el => new Promise(resolve => {
        let finished = false;
        const done = () => {
            if (finished) return;
            finished = true;
            clearTimeout(deadline);
            resolve();
        };
        const deadline = setTimeout(done, ASSET_TIMEOUT);
        if (el.tagName === 'IMG') {
            if (el.complete) { done(); return; }
            el.addEventListener('load', done, { once: true });
            el.addEventListener('error', done, { once: true });
            return;
        }
        const wanted = el.tagName === 'VIDEO' ? 3 : 4;
        if (el.readyState >= wanted) { done(); return; }
        el.preload = 'auto';
        el.addEventListener(wanted === 4 ? 'canplaythrough' : 'canplay', done, { once: true });
        el.addEventListener('error', done, { once: true });
        el.load();
    }));
    return Promise.race([
        Promise.all(buffered),
        new Promise(resolve => setTimeout(resolve, PRELOAD_TIMEOUT)),
    ]);
}
function showDiagnosticError(message) {
    const logger = document.getElementById('error-logger');
    if (!logger) return;
    const text = message || 'Something went wrong loading this page.';
    const line = document.createElement('div');
    line.textContent = text;
    logger.appendChild(line);
    logger.style.display = 'block';
}
let slideshowInterval = null;
const SLIDE_INTERVAL = 3000;
async function setupSlideshow() {
    const container = document.getElementById('slideshowBox');
    container.innerHTML = '<div class="placeholder-text">Loading memories...</div>';
    if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_')) {
        container.innerHTML = '<div class="slideshow-error-text">Missing Configuration URL placeholder attributes.</div>';
        return [];
    }
    try {
        const { data: mediaData, error } =
            await window.supabaseClient
                .from('media')
                .select('url, caption')
                .eq('type', 'photo')
                .order('order_no', { ascending: true });
        if (error) throw error;
        if (!mediaData || mediaData.length === 0) {
            container.innerHTML = '<div class="no-photos-text">No photos found</div>';
            return [];
        }
        container.innerHTML = '';
        return mediaData.map((media, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            const img = document.createElement('img');
            img.src = media.url;
            img.alt = `Birthday memory photo ${index + 1}`;
            slide.appendChild(img);
            if (media.caption) {
                const caption = document.createElement('div');
                caption.classList.add('slide-caption');
                const captionText = document.createElement('span');
                captionText.classList.add('slide-caption-text');
                captionText.textContent = media.caption;
                caption.appendChild(captionText);
                slide.appendChild(caption);
            }
            container.appendChild(slide);
            return img;
        });
    } catch (err) {
        console.error('Slideshow error:', err);
        container.innerHTML = '<div class="slideshow-error-text">Failed to load photos</div>';
        return [];
    }
}
function startSlideshow() {
    const container = document.getElementById('slideshowBox');
    const slides = container.querySelectorAll('.slide');
    if (!slides.length || slideshowInterval) return;
    let currentSlideIndex = 0;
    slides[0].classList.add('active');
    if (slides.length === 1) return;
    slideshowInterval = setInterval(() => {
        slides[currentSlideIndex].classList.remove('active');
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        slides[currentSlideIndex].classList.add('active');
    }, SLIDE_INTERVAL);
}
window.addEventListener('beforeunload', () => {
    if (slideshowInterval) { clearInterval(slideshowInterval); }
});
async function setupVideo() {
    const container = document.getElementById("videoBox");
    container.innerHTML = "Loading video...";
    if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_")) {
        container.innerHTML = '<div class="video-error-text">Missing Configuration URL placeholder attributes.</div>';
        return null;
    }
    try {
        const { data: videoData, error } = await window.supabaseClient
            .from("media")
            .select("url")
            .eq("type", "video")
            .order("order_no", { ascending: true })
            .limit(1);
        if (error) throw error;
        if (!videoData || videoData.length === 0) {
            container.innerHTML = '<div class="no-video-text">No video found</div>';
            return null;
        }
        container.innerHTML = "";
        const video = document.createElement("video");
        invitationVideo = video;
        video.src = videoData[0].url;
        video.muted = false;
        video.loop = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        video.preload = "auto";
        video.volume = 1.0;
        video.onerror = () => {
            console.error("Video failed to load.");
            container.innerHTML = '<div class="video-error-text">Failed to load video</div>';
        };
        video.addEventListener("loadedmetadata", () => {
            console.log(
                "Video duration:",
                video.duration,
                "seconds"
            );
        });
        container.appendChild(video);
        return video;
    } catch (err) {
        console.error("setupVideo error:", err);
        container.innerHTML = '<div class="video-error-text">Failed to load video</div>';
        return null;
    }
}
function toggleCard(event) {
    const card = document.querySelector(".card-container");
    if (
        !event.target.closest(".rsvp-form") &&
        !event.target.closest(".guest-list-centered")
    ) {
        card.classList.toggle("flipped");
        if (card.classList.contains("flipped")) {
            if (audio && !audio.paused) {
                audio.pause();
                audio.currentTime = 0;
            }
            if (invitationVideo) {
                invitationVideo.currentTime = 0;
                invitationVideo.muted = false;
                invitationVideo.volume = 1.0;
                invitationVideo.play()
                    .then(() => {
                        console.log("Video + H2R audio playing");
                    })
                    .catch(err => {
                        console.error(
                            "Video playback failed:",
                            err
                        );
                    });
            }
        }
        else {
            if (invitationVideo) {
                invitationVideo.pause();
                invitationVideo.currentTime = 0;
            }
            if (audio) {
                audio.currentTime = 0;
                audio.play()
                    .catch(err => {
                        console.log(
                            "Birthday audio playback failed:",
                            err
                        );
                    });
            }
        }
    }
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        const card = document.querySelector('.card-container');
        if (document.activeElement === card || card.contains(document.activeElement)) {
            if (!event.target.closest('.rsvp-form') && !event.target.closest('.guest-list-centered')) {
                event.preventDefault();
                toggleCard(event);
            }
        }
    }
});
async function submitRSVP(event) {
    event.stopPropagation();
    const nameInput = document.getElementById('guestName');
    const messageInput = document.getElementById('guestMessage');
    const goingBtn = document.getElementById('goingBtn');
    const guestName = nameInput.value.trim();
    const guestMessage = messageInput ? messageInput.value.trim() : '';
    if (!guestName) {
        showAlertDialog(
            "Missing Name",
            "Please type your name before responding.",
            "warning"
        );
        return;
    }
    if (!guestMessage) {
        showAlertDialog(
            "Missing Message",
            "Please add a message before responding.",
            "warning"
        );
        return;
    }
    if (guestName.length < 2) {
        showAlertDialog(
            "Invalid Name",
            "Please enter at least 2 characters for your name.",
            "warning"
        );
        return;
    }
    if (guestName.length > 50) {
        showAlertDialog(
            "Invalid Name",
            "Please enter a name shorter than 50 characters.",
            "warning"
        );
        return;
    }
    const sanitizedName = guestName;
    const sanitizedMessage = guestMessage;
    goingBtn.disabled = true;
    nameInput.disabled = true;
    if (messageInput) messageInput.disabled = true;
    const originalText = goingBtn.textContent;
    goingBtn.textContent = "Sending...";
    try {
        const { error } = await window.supabaseClient
            .from('rsvp')
            .insert([{ name: sanitizedName, attendance: 'Going', message: sanitizedMessage }]);
        if (error) throw error;
        goingBtn.textContent = "✓ ON THE GRID!";
        goingBtn.style.backgroundColor = "#00cc00";
        goingBtn.style.color = "white";
        nameInput.value = '';
        if (messageInput) messageInput.value = '';
        loadRSVPList();
        showAlertDialog(
            "Success",
            `Let's go racing, ${sanitizedName}!`,
            "success"
        );
    } catch (err) {
        showDiagnosticError(`RSVP submit failed: ${err.message || err}`);
        showAlertDialog(
            "Submission Failed",
            "Unable to send message at the moment. Please try again later.",
            "error"
        );
        goingBtn.disabled = false;
        nameInput.disabled = false;
        if (messageInput) messageInput.disabled = false;
        goingBtn.textContent = originalText;
    }
}
async function probeRSVPSchema() {
    try {
        const res = await window.supabaseClient.from('rsvp').select('*').limit(1);
        if (res.error || !res.data || res.data.length === 0) {
            return {
                cols: new Set(),
                nameCol: 'name',
                msgCol: 'message',
                dateCol: null,
                attendanceCol: null
            };
        }
        const cols = new Set(Object.keys(res.data[0]));
        const pickFirst = (candidates) => candidates.find((c) => cols.has(c)) || null;
        return {
            cols,
            nameCol: pickFirst(['name', 'Name', 'guest_name', 'full_name']) || 'name',
            msgCol: pickFirst(['message', 'Message', 'guest_message', 'note']) || 'message',
            dateCol: pickFirst(['created_at', 'CreatedAt', 'inserted_at', 'date_submitted', 'updated_at']),
            attendanceCol: pickFirst(['attendance', 'status', 'Attendance', 'going'])
        };
    } catch (_) {
        return {
            cols: new Set(),
            nameCol: 'name',
            msgCol: 'message',
            dateCol: null,
            attendanceCol: null
        };
    }
}
function renderGuestItems(container, data, schema) {
    container.innerHTML = '';
    const fragment = document.createDocumentFragment();
    data.forEach((entry, index) => {
        const rawName = entry[schema.nameCol] ?? '';
        const rawMsg = entry[schema.msgCol] ?? '';
        const safeName = String(rawName || 'Anonymous');
        const safeMessage = String(rawMsg || '');
        const item = document.createElement('div');
        item.className = 'guest-item';
        item.setAttribute('role', 'listitem');
        if (index === 0) item.classList.add('guest-item-new');
        const nameEl = document.createElement('div');
        nameEl.className = 'guest-name';
        nameEl.textContent = safeName;
        item.appendChild(nameEl);
        if (safeMessage) {
            const msgEl = document.createElement('div');
            msgEl.className = 'guest-message';
            msgEl.textContent = safeMessage;
            item.appendChild(msgEl);
        }
        if (schema.dateCol) {
            const createdAt = entry[schema.dateCol];
            if (createdAt) {
                const dateEl = document.createElement('div');
                dateEl.className = 'guest-date';
                try {
                    const d = new Date(createdAt);
                    if (!isNaN(d.getTime())) {
                        dateEl.textContent = d.toLocaleDateString(undefined, {
                            month: 'short', day: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                        });
                    }
                } catch (_) { }
                if (dateEl.textContent) item.appendChild(dateEl);
            }
        }
        fragment.appendChild(item);
    });
    container.appendChild(fragment);
}
async function loadRSVPList() {
    const listBox = document.getElementById('guestListBoxModal');
    const countSpan = document.getElementById('guestCount');
    const countSpanModal = document.getElementById('guestCountModal');
    if (!listBox || !countSpan) return;
    if (!window.supabaseClient) {
        listBox.innerHTML = '<div class="guest-list-error">Guest list unavailable (Supabase not ready).</div>';
        return;
    }
    if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_')) {
        listBox.innerHTML = '<div class="guest-list-error">Guest list unavailable (missing config).</div>';
        return;
    }
    listBox.innerHTML = '<div class="guest-list-placeholder">Loading guest list…</div>';
    try {
        const schema = await probeRSVPSchema();
        console.log('[GuestList] detected schema columns:', [...schema.cols], '→ using', schema);
        const selectList = [schema.nameCol, schema.msgCol];
        if (schema.dateCol) selectList.push(schema.dateCol);
        if (schema.attendanceCol) selectList.push(schema.attendanceCol);
        let query = window.supabaseClient.from('rsvp').select(selectList.join(','));
        if (schema.dateCol) {
            query = query.order(schema.dateCol, { ascending: false, nullsFirst: false });
        }
        const result = await query;
        if (result.error) throw result.error;
        const data = result.data || [];
        console.log('[GuestList] query rows (ALL RSVPs, no attendance filter):', data.length, 'raw:', data);
        if (countSpan) countSpan.textContent = `(${data.length})`;
        if (countSpanModal) countSpanModal.textContent = `(${data.length})`;
        if (data.length === 0) {
            listBox.innerHTML = '<div class="guest-list-empty">No messages yet.</div>';
            if (countSpan) countSpan.textContent = '(0)';
            if (countSpanModal) countSpanModal.textContent = '(0)';
            return;
        }
        renderGuestItems(listBox, data, schema);
    } catch (err) {
        console.error('[GuestList] error:', err);
        listBox.innerHTML = '<div class="guest-list-empty">No messages yet.</div>';
        if (countSpan) countSpan.textContent = '(0)';
        if (countSpanModal) countSpanModal.textContent = '(0)';
    }
}
function openMessagesModal() {
    const modal = document.getElementById('messagesModal');
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}
function closeMessagesModal() {
    const modal = document.getElementById('messagesModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}
function bindModalControls() {
    const viewBtn = document.getElementById('viewMessagesBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const overlay = document.getElementById('messagesModal');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openMessagesModal();
            loadRSVPList();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeMessagesModal);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMessagesModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const modal = document.getElementById('messagesModal');
            if (modal && modal.classList.contains('is-open')) closeMessagesModal();
        }
    });
}
function showAlertDialog(title, message, type = "warning") {
    const modal = document.getElementById("alertModal");
    const icon = document.getElementById("alertIcon");
    const titleEl = document.getElementById("alertTitle");
    const msgEl = document.getElementById("alertMessage");
    const btn = document.getElementById("alertOkBtn");
    titleEl.textContent = title;
    msgEl.textContent = message;
    switch (type) {
        case "success":
            icon.textContent = "✅";
            btn.style.background = "#2ecc71";
            break;
        case "error":
            icon.textContent = "❌";
            btn.style.background = "#e74c3c";
            break;
        case "info":
            icon.textContent = "ℹ️";
            btn.style.background = "#3498db";
            break;
        default:
            icon.textContent = "⚠️";
            btn.style.background = "#f39c12";
            break;
    }
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    btn.focus();
}
function closeAlertDialog() {
    const modal = document.getElementById("alertModal");
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
}
document.getElementById("alertOkBtn")
    .addEventListener("click", closeAlertDialog);
document.getElementById("alertModal")
    .addEventListener("click", function (e) {
        if (e.target === this) { closeAlertDialog(); }
    });
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeAlertDialog(); }
});
const audio = document.getElementById("bgMusic");
audio.load();
const engineSound = document.getElementById('engineSound');
let engineAudioCtx = null;
let engineGainNode = null;
let mediaReady = false;
let openWasRequested = false;
function unlockAudioPlayback() {
    [engineSound, audio, invitationVideo]
        .filter(Boolean)
        .forEach(el => {
            const wasMuted = el.muted;
            el.muted = true;
            el.play()
                .then(() => {
                    el.pause();
                    el.currentTime = 0;
                    el.muted = wasMuted;
                })
                .catch(() => {
                    el.muted = wasMuted;
                });
        });
}
function markMediaReady() {
    if (mediaReady) return;
    mediaReady = true;
    const overlay = document.getElementById('envelopeOverlay');
    if (overlay) overlay.classList.remove('is-loading');
    const tapText = document.getElementById('envelopeTapText');
    if (tapText) tapText.textContent = '🏁 START YOUR ENGINES 🏁';
    if (openWasRequested) openEnvelope();
}
function openEnvelope() {
    const overlay = document.getElementById('envelopeOverlay');
    if (!overlay || overlay.classList.contains('is-triggered')) return;
    if (!mediaReady) {
        openWasRequested = true;
        unlockAudioPlayback();
        return;
    }
    overlay.classList.add('is-triggered');
    let bgMusicStarted = false;
    const startBgMusic = () => {
        if (bgMusicStarted) return;
        bgMusicStarted = true;
        audio.play().catch(err => console.log(err));
    };
    if (engineSound) {
        engineSound.currentTime = 0;
        engineSound.volume = 1;
        if (engineAudioCtx) {
            if (engineAudioCtx.state === 'suspended') {
                engineAudioCtx.resume().catch(() => { });
            }
            if (engineGainNode) engineGainNode.gain.value = 1.6;
        }
        engineSound.play().catch(() => {
            startBgMusic();
        });
        engineSound.addEventListener('ended', startBgMusic, { once: true });
        setTimeout(startBgMusic, 4000);
    } else { startBgMusic(); }
    overlay.setAttribute('aria-hidden', 'true');
    const card = document.querySelector('.card-container');
    overlay.classList.add('is-opening');
    const GREEN_HOLD = 900;
    setTimeout(() => {
        if (card) card.classList.remove('pre-reveal');
        overlay.classList.add('is-hidden');
        startSlideshow();
    }, GREEN_HOLD);
    setTimeout(() => {
        overlay.style.display = 'none';
    }, GREEN_HOLD + 650);
}
function envelopeKeyHandler(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
    }
}
const envelopeOverlay = document.getElementById('envelopeOverlay');
if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', openEnvelope);
    envelopeOverlay.addEventListener('keydown', envelopeKeyHandler);
}
