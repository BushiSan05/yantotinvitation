// CRITICAL PARAMETERS — INPUT YOUR ACCURATE CREDENTIALS HERE
const SUPABASE_URL = 'https://mpbzwdvwcaefxtzotywo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wYnp3ZHZ3Y2FlZnh0em90eXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2MjkzNTIsImV4cCI6MjA5OTIwNTM1Mn0.dvbsfw79hl9aV9SJRo3D-q5SAnrnSC9-m6rNw7OqTV0';

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
        return;
    }
    initApp();
});

function initApp() {
    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        setupSlideshow();
        setupVideo();
        bindModalControls();
        loadRSVPList();
    } catch (err) {
        showDiagnosticError();
    }
}

function showDiagnosticError() { }

// 1. DYNAMIC SLIDESHOW SYSTEM
let slideshowInterval = null;

async function setupSlideshow() {
    const container = document.getElementById('slideshowBox');
    container.innerHTML = '<div class="placeholder-text">Loading memories...</div>';

    if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_')) {
        container.innerHTML = `<div class="slideshow-error-text">Missing Configuration URL placeholder attributes.</div>`;
        return;
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
            return;
        }

        // Debug: Log the URLs being loaded
        console.log('Media URLs found:', mediaData.map(m => m.url));

        container.innerHTML = '';

        mediaData.forEach((media, index) => {
            const img = document.createElement('img');
            img.src = media.url;
            img.classList.add('slide');
            if (index === 0) img.classList.add('active');
            img.alt = `Birthday memory photo ${index + 1}`;
            img.setAttribute('role', 'img');

            img.onerror = () => { img.src = "https://via.placeholder.com/400x300?text=Image+Not+Found"; };
            container.appendChild(img);
        });

        let currentSlideIndex = 0;
        // Clear any existing interval
        if (slideshowInterval) {
            clearInterval(slideshowInterval);
        }
        slideshowInterval = setInterval(() => {
            const slides = container.querySelectorAll('.slide');
            if (slides.length <= 1) return;

            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }, 3000);

    } catch (err) {
        container.innerHTML = '<div class="slideshow-error-text">Failed to load photos</div>';
    }
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
    }
});

// 4. VIDEO PLAYER SYSTEM
async function setupVideo() {
    const container = document.getElementById('videoBox');
    container.innerHTML = '<div class="video-placeholder-text">Loading video...</div>';

    if (!SUPABASE_URL || SUPABASE_URL.includes('YOUR_')) {
        container.innerHTML = `<div class="video-error-text">Missing Configuration URL placeholder attributes.</div>`;
        return;
    }

    try {
        // Fetch video from Supabase
        const { data: videoData, error } = await window.supabaseClient
            .from('media')
            .select('url')
            .eq('type', 'video')
            .order('order_no', { ascending: true })
        // .limit(1);

        if (error) throw error;

        if (!videoData || videoData.length === 0) {
            container.innerHTML = '<div class="no-video-text">No video found</div>';
            return;
        }

        // Debug: Log the video URL being loaded
        // console.log('Video URL found:', videoData[0].url);

        container.innerHTML = '';

        const video = document.createElement('video');
        video.src = videoData[0].url;
        video.autoplay = true;
        video.muted = true;
        // video.loop = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');

        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.objectPosition = 'center';

        let currentIndex = 0;

        function playVideo(index) {
            console.log('Playing:', videoData[index].url);

            video.src = videoData[index].url;
            video.load();

            video.play().catch(err => {
                console.error('Playback error:', err);
            });
        }

        video.addEventListener('ended', () => {
            currentIndex++;

            if (currentIndex >= videoData.length) {
                currentIndex = 0; // Start over
            }

            playVideo(currentIndex);
        });

        // Add rotation class if needed (change 'rotate-90' to 'rotate-180', 'rotate-270', or remove for no rotation)
        // video.classList.add('rotate-90');

        video.onerror = () => {
            container.innerHTML = '<div class="video-error-text">Failed to load video</div>';
        };

        container.appendChild(video);

        playVideo(currentIndex);

    } catch (err) {
        console.error(err);
        container.innerHTML =
            '<div class="video-error-text">Failed to load video</div>';
    }
}

function toggleCard(event) {
    const card = document.querySelector('.card-container');
    if (!event.target.closest('.rsvp-form') && !event.target.closest('.guest-list') && !event.target.closest('.guest-list-centered')) {
        card.classList.toggle('flipped');
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
        alert("Please type your name before responding!");
        return;
    }

    if (!guestMessage) {
        alert("Please add a message before responding!");
        return;
    }

    if (guestName.length < 2) {
        alert("Please enter at least 2 characters for your name.");
        return;
    }

    if (guestName.length > 50) {
        alert("Please enter a name shorter than 50 characters.");
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

        alert(`Let's go racing, ${sanitizedName}! 🏁🏍️`);
    } catch (err) {
        showDiagnosticError();
        alert("Database Submission Failed! Check the diagnostic log at the bottom.");

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
                '<div class="guest-list-empty">No Messages yet.</div>';

            // Update counters
            if (countSpan) countSpan.textContent = '(0)';
            if (countSpanModal) countSpanModal.textContent = '(0)';

            return;
        }

        renderGuestItems(listBox, data, schema);

    } catch (err) {
        console.error('[GuestList] error:', err);

        listBox.innerHTML =
            '<div class="guest-list-empty">No RSVPs yet.</div>';

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
