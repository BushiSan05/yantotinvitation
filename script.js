// CRITICAL PARAMETERS — INPUT YOUR ACCURATE CREDENTIALS HERE
const SUPABASE_URL = 'https://mpbzwdvwcaefxtzotywo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wYnp3ZHZ3Y2FlZnh0em90eXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MjkzNTIsImV4cCI6MjA5OTIwNTM1Mn0.dvbsfw79hl9aV9SJRo3D-q5SAnrnSC9-m6rNw7OqTV0';

// FIX: iOS in-app browsers (Messenger, Instagram, etc.) miscalculate 100vh —
// it's based on the full screen, not the area actually visible under the
// browser's own toolbar, which crops fixed-height layouts like this card.
// This sets a --vh custom property from the real visible height instead.
function setRealViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setRealViewportHeight();
window.addEventListener('resize', setRealViewportHeight);
window.addEventListener('orientationchange', () => {
    // iOS fires resize before it finishes adjusting the toolbar; a short
    // delay avoids reading a stale innerHeight value.
    setTimeout(setRealViewportHeight, 100);
});
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setRealViewportHeight);
}

const bgRides = document.getElementById("bgRides");
let invitationVideo = null;

// 2. MIXED CELEBRATION EFFECTS
function generateAmbientEffects() {
    const container = document.getElementById('ambient-wrapper');
    const colors = ['#ff1e00', '#ffcc00', '#ffffff', '#000000'];

    // Confetti
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

    // Balloons
    const animations = ['floatUp', 'floatUp2', 'floatUp3', 'floatUp4'];
    for (let j = 0; j < 20; j++) {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        balloon.style.left = Math.random() * 90 + '%';
        balloon.style.bottom = Math.random() * 30 + '%'; // Start within visible area
        balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        balloon.style.animationDuration = Math.random() * 4 + 3 + 's'; // Faster: 3-7 seconds
        balloon.style.animationDelay = Math.random() * 3 + 's';
        balloon.style.animationName = animations[Math.floor(Math.random() * animations.length)]; // Random animation

        // Click to pop
        balloon.addEventListener('click', () => popBalloon(balloon));

        // Randomly pop some balloons during flight
        if (Math.random() < 0.3) { // 30% chance to auto-pop
            const popTime = Math.random() * 2000 + 1000; // Pop between 1-3 seconds
            setTimeout(() => {
                if (!balloon.classList.contains('popped')) {
                    popBalloon(balloon);
                }
            }, popTime);
        }

        container.appendChild(balloon);
    }

    // Stars
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

    // Sparkles
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
    // Create pop effect particles
    const container = document.getElementById('ambient-wrapper');
    const containerRect = container.getBoundingClientRect();
    const balloonRect = balloon.getBoundingClientRect();
    const colors = ['#ff1e00', '#ffcc00', '#ffffff', '#000000'];

    // Calculate position relative to container
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

        // Animate particles outward
        setTimeout(() => {
            const angle = (i / 8) * Math.PI * 2;
            const distance = 30 + Math.random() * 20;
            particle.style.transform = `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`;
            particle.style.opacity = '0';
        }, 10);

        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 500);
    }

    // Remove balloon after pop animation
    setTimeout(() => {
        balloon.remove();
    }, 300);
}

// Strict Instance Bootstrapper to prevent "supabase is not defined" issues
window.addEventListener('load', () => {
    // Initialize basic functionality regardless of Supabase
    generateAmbientEffects();

    // Try to initialize Supabase-dependent features
    if (typeof window.supabase === 'undefined') {
        showDiagnosticError();
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

        // Build the photo and video elements, then hold the envelope shut
        // until every photo, the video and all three audio tracks are
        // buffered, so nothing pops in mid-invitation.
        const [slides, video] = await Promise.all([setupSlideshow(), setupVideo()]);
        await preloadMedia([...slides, video, audio, engineSound, bgRides]);
    } catch (err) {
        showDiagnosticError();
    } finally {
        markMediaReady();
    }
}

// ---- Media preloading ----
// Resolves once every element has buffered, lighting one start light per
// finished element. Elements that error out still count: a missing photo
// must not leave the guest staring at a sealed envelope.
const PRELOAD_TIMEOUT = 20000;
// iOS WKWebView — which is what Messenger and Instagram open links in — defers
// audio and video loading until a user gesture, so canplaythrough may never
// fire before the tap. Each element therefore gets its own deadline: one
// element that refuses to buffer costs a few seconds, not the whole gate.
const ASSET_TIMEOUT = 6000;

function preloadMedia(elements) {
    const targets = elements.filter(Boolean);
    if (!targets.length) return Promise.resolve();

    let settled = 0;
    const onSettled = () => {
        settled += 1;
        setStartLights(settled / targets.length);
    };

    const buffered = targets.map(el => new Promise(resolve => {
        let finished = false;
        const done = () => {
            if (finished) return;
            finished = true;
            clearTimeout(deadline);
            onSettled();
            resolve();
        };
        const deadline = setTimeout(done, ASSET_TIMEOUT);

        if (el.tagName === 'IMG') {
            // complete covers both outcomes: a photo that already failed
            // fires nothing once we attach listeners, so it would otherwise
            // hold the envelope shut until the timeout.
            if (el.complete) { done(); return; }
            el.addEventListener('load', done, { once: true });
            el.addEventListener('error', done, { once: true });
            return;
        }

        // Audio waits for HAVE_ENOUGH_DATA (readyState 4) since it starts the
        // moment the envelope opens; the video only needs enough to play
        // (readyState 3) because it lives on the card's back face.
        const wanted = el.tagName === 'VIDEO' ? 3 : 4;
        if (el.readyState >= wanted) { done(); return; }
        el.preload = 'auto';
        el.addEventListener(wanted === 4 ? 'canplaythrough' : 'canplay', done, { once: true });
        el.addEventListener('error', done, { once: true });
        el.load();
    }));

    // A stalled asset on a bad connection must not trap the guest either.
    return Promise.race([
        Promise.all(buffered),
        new Promise(resolve => setTimeout(resolve, PRELOAD_TIMEOUT)),
    ]);
}

function setStartLights(fraction) {
    const lights = document.querySelectorAll('.start-light');
    const lit = Math.round(fraction * lights.length);
    lights.forEach((light, i) => light.classList.toggle('is-lit', i < lit));
}

function showDiagnosticError() { }

// 1. DYNAMIC SLIDESHOW SYSTEM
let slideshowInterval = null;
const SLIDE_INTERVAL = 3000;

// Builds the slides but does NOT start cycling them — startSlideshow() does
// that once the card is actually on screen, so the first photo gets its full
// turn instead of being swapped out behind the envelope.
async function setupSlideshow() {
    const container = document.getElementById('slideshowBox');
    container.innerHTML = '<div class="placeholder-text">Loading memories...</div>';

    if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_')) {
        container.innerHTML = `<div class="slideshow-error-text">Missing Configuration URL placeholder attributes.</div>`;
        return [];
    }

    try {
        // Fetch media from Supabase, ordered by order_no
        const { data: mediaData, error } = await window.supabaseClient
            .from('media')
            .select('url')
            .eq('type', 'photo')
            .order('order_no', { ascending: true });


        if (error) throw error;

        if (!mediaData || mediaData.length === 0) {
            container.innerHTML = '<div class="no-photos-text">No photos found</div>';
            return [];
        }

        container.innerHTML = '';

        return mediaData.map((media, index) => {
            const img = document.createElement('img');
            img.src = media.url;
            img.classList.add('slide');
            img.alt = `Birthday memory photo ${index + 1}`;
            img.setAttribute('role', 'img');
            container.appendChild(img);
            return img;
        });

    } catch (err) {
        container.innerHTML = '<div class="slideshow-error-text">Failed to load photos</div>';
        return [];
    }
}

// Shows the first photo and starts the rotation. Called when the card is
// revealed, so no photo is spent while the envelope is still closed.
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

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
});

// 4. VIDEO PLAYER SYSTEM
async function setupVideo() {
    const container = document.getElementById("videoBox");
    container.innerHTML = "Loading video...";

    if (!SUPABASE_URL || SUPABASE_URL.includes("YOUR_")) {
        container.innerHTML =
            '<div class="video-error-text">Missing Configuration URL placeholder attributes.</div>';
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
            container.innerHTML =
                '<div class="no-video-text">No video found</div>';
            return null;
        }

        container.innerHTML = "";

        const video = document.createElement("video");

        invitationVideo = video;

        video.src = videoData[0].url;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";

        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");

        video.addEventListener("ended", () => {
            bgRides.currentTime = 0;
            bgRides.play().catch(() => { });
        });

        // Keep audio synchronized
        video.addEventListener("timeupdate", () => {
            if (!bgRides.paused) {
                const diff = Math.abs(video.currentTime - bgRides.currentTime);

                if (diff > 0.25) {
                    bgRides.currentTime = video.currentTime;
                }
            }
        });

        video.onerror = () => {
            container.innerHTML =
                '<div class="video-error-text">Failed to load video</div>';
        };

        container.appendChild(video);
        return video;

    } catch (err) {
        container.innerHTML =
            '<div class="video-error-text">Failed to load video</div>';
        return null;
    }
}

function toggleCard(event) {
    const card = document.querySelector(".card-container");

    if (
        !event.target.closest(".rsvp-form") &&
        !event.target.closest(".guest-list") &&
        !event.target.closest(".guest-list-centered")
    ) {
        card.classList.toggle("flipped");

        if (card.classList.contains("flipped")) {
            if (invitationVideo) {
                invitationVideo.currentTime = 0;
                invitationVideo.play().catch(console.error);
            }
            bgRides.currentTime = 0;
            bgRides.play().catch(console.error);

            // Don't let the birthday music and the ride sound play together
            if (!audio.paused) audio.pause();
        } else {
            if (invitationVideo) {
                invitationVideo.pause();
                invitationVideo.currentTime = 0;
            }

            bgRides.pause();
            bgRides.currentTime = 0;

            audio.play().catch(() => { });
        }
    }
}

// Add keyboard navigation support
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
        const card = document.querySelector('.card-container');
        if (document.activeElement === card || card.contains(document.activeElement)) {
            if (!event.target.closest('.rsvp-form') && !event.target.closest('.guest-list') && !event.target.closest('.guest-list-centered')) {
                event.preventDefault();
                toggleCard(event);
            }
        }
    }
});

// 3. SECURE RSVP ACTION HANDLING WITH DIRECT VISUAL LOGGING
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

    const sanitizedName = guestName.replace(/[<>]/g, '');
    const sanitizedMessage = guestMessage.replace(/[<>]/g, '');

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
        showDiagnosticError();
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

// 4. GUEST LIST — SHOW RSVP NAMES + MESSAGES FROM SUPABASE
async function probeRSVPSchema() {
    // First SELECT with '*' and a tiny LIMIT 1 just to sniff which columns exist,
    // without failing on missing columns like created_at / attendance / message.
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
        const safeName = String(rawName || 'Anonymous').replace(/[<>]/g, '');
        const safeMessage = String(rawMsg || '').replace(/[<>]/g, '');

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
        // Keep attendance in select if it exists, so future display can use it,
        // but never filter on it anymore (we want ALL RSVPs).
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
            listBox.innerHTML =
                '<div class="guest-list-empty">No messages yet.</div>';

            // Update counters
            if (countSpan) countSpan.textContent = '(0)';
            if (countSpanModal) countSpanModal.textContent = '(0)';

            return;
        }

        renderGuestItems(listBox, data, schema);

    } catch (err) {
        console.error('[GuestList] error:', err);

        listBox.innerHTML =
            '<div class="guest-list-empty">No messages yet.</div>';

        if (countSpan) countSpan.textContent = '(0)';
        if (countSpanModal) countSpanModal.textContent = '(0)';
    }
}

// ---- Guest Messages Modal open/close helpers ----
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
            // Refresh the list when user opens it so they always see latest submissions
            loadRSVPList();
        });
    }
    if (closeBtn) closeBtn.addEventListener('click', closeMessagesModal);
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            // Close only when clicking the dark overlay itself, not the dialog content
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
        if (e.target === this) {
            closeAlertDialog();
        }
    });

document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        closeAlertDialog();
    }
});

const audio = document.getElementById("bgMusic");
audio.load();

// ---- Engine sound: boosted volume + pre-primed for a snappy first play ----
const engineSound = document.getElementById('engineSound');
let engineAudioCtx = null;
let engineGainNode = null;

// function setupEngineSound() {
//     if (!engineSound) return;
//     engineSound.volume = 1; // native max, used if Web Audio isn't available
//     engineSound.load();

//     try {
//         const AudioContextClass = window.AudioContext || window.webkitAudioContext;
//         if (AudioContextClass) {
//             engineAudioCtx = new AudioContextClass();
//             const source = engineAudioCtx.createMediaElementSource(engineSound);
//             engineGainNode = engineAudioCtx.createGain();
//             // Silent for now — only boosted right before the real tap-triggered
//             // play, so this setup never causes an audible blip on page load.
//             engineGainNode.gain.value = 0;
//             source.connect(engineGainNode).connect(engineAudioCtx.destination);
//         }
//     } catch (err) {
//         console.log('Engine sound boost unavailable, using native volume only:', err);
//     }

//     // Prime the decoder with a silent play+pause so the very first REAL
//     // play() (on envelope tap) starts instantly instead of buffering.
//     engineSound.muted = true;
//     engineSound.play().then(() => {
//         engineSound.pause();
//         engineSound.currentTime = 0;
//         engineSound.muted = false;
//     }).catch(() => {
//         // Some browsers block even muted autoplay before any interaction —
//         // harmless, the real tap-triggered play will still work fine.
//         engineSound.muted = false;
//     });
// }

// setupEngineSound();

// ---- Tap-to-Open Envelope: the gesture that unlocks bgMusic autoplay ----
// The envelope stays sealed until every asset is buffered. A tap before then
// is remembered rather than ignored, so an eager guest isn't left tapping a
// dead envelope.
let mediaReady = false;
let openWasRequested = false;

// iOS only allows audio that was started from a user gesture. When the guest
// taps early we consume that gesture here, so the engine sound still plays
// when the queued open runs a moment later.
function unlockAudioPlayback() {
    [engineSound, audio, bgRides].filter(Boolean).forEach(el => {
        const wasMuted = el.muted;
        el.muted = true;
        el.play().then(() => {
            el.pause();
            el.currentTime = 0;
            el.muted = wasMuted;
        }).catch(() => { el.muted = wasMuted; });
    });
}

function markMediaReady() {
    if (mediaReady) return;
    mediaReady = true;

    const overlay = document.getElementById('envelopeOverlay');
    if (overlay) overlay.classList.remove('is-loading');
    setStartLights(1);

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

    overlay.classList.add('is-triggered'); // guard against double-tap

    let bgMusicStarted = false;
    const startBgMusic = () => {
        if (bgMusicStarted) return;
        bgMusicStarted = true;
        audio.play().catch(err => console.log(err));
    };

    // Play the engine sound the INSTANT the envelope is tapped — this is
    // the tap feedback itself, fired before any animation classes are
    // added, so it never feels tied to the flap/slide motion.
    if (engineSound) {
        engineSound.currentTime = 0;
        engineSound.volume = 1;

        // Boost above the file's native 100% volume and unlock the audio
        // graph now, on this same user gesture.
        if (engineAudioCtx) {
            if (engineAudioCtx.state === 'suspended') {
                engineAudioCtx.resume().catch(() => { });
            }
            if (engineGainNode) engineGainNode.gain.value = 1.6;
        }

        engineSound.play().catch(() => {
            // Engine file missing/blocked — fall back to the birthday music
            // directly on this same tap so audio still starts.
            startBgMusic();
        });
        engineSound.addEventListener('ended', startBgMusic, { once: true });
        // Safety net in case 'ended' never fires for some reason.
        setTimeout(startBgMusic, 4000);
    } else {
        startBgMusic();
    }

    overlay.setAttribute('aria-hidden', 'true');
    const card = document.querySelector('.card-container');

    // Give the engine sound a brief beat on its own before the flap swings
    // open, right-to-left.
    const OPEN_DELAY = 300;
    const ANIMATION_DURATION = 850; // flap 750ms + a beat on the open envelope

    setTimeout(() => {
        overlay.classList.add('is-opening');
    }, OPEN_DELAY);

    // The first photo goes up in the same frame the card starts fading in,
    // so the card is never revealed with an empty photo frame.
    setTimeout(() => {
        if (card) card.classList.remove('pre-reveal');
        overlay.classList.add('is-hidden');
        startSlideshow();
    }, OPEN_DELAY + ANIMATION_DURATION);

    setTimeout(() => {
        overlay.style.display = 'none';
    }, OPEN_DELAY + ANIMATION_DURATION + 650);
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