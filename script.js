/**
 * ============================================================================
 * UNIVERSAL BIRTHDAY SURPRISE APP & VIRAL LINKEDIN SHOWCASE - ENGINE LOGIC
 * Includes: Web Audio Synthesizer Chimes, Particle Engine, Candle Blowing,
 * URLSearchParams Personalization Engine & Interactive Customizer Modal
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // State management
    let isSoundEnabled = true;
    let areCandlesLit = true;

    /* ==========================================================================
       1. WEB AUDIO API SYNTHESIZER SOUND ENGINE (No external MP3 files needed)
       ========================================================================== */
    class SoundEngine {
        constructor() {
            this.ctx = null;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        playChime(freq = 523.25, duration = 0.6, type = 'sine') {
            if (!isSoundEnabled) return;
            this.init();
            if (!this.ctx) return;

            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        }

        playUnlockCelebration() {
            if (!isSoundEnabled) return;
            const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
            notes.forEach((freq, idx) => {
                setTimeout(() => {
                    this.playChime(freq, 0.8, 'triangle');
                }, idx * 110);
            });
        }

        playCrazyPartySymphony() {
            if (!isSoundEnabled) return;
            const notes = [
                { f: 523.25, d: 0.15, t: 0 },       // C5
                { f: 659.25, d: 0.15, t: 150 },     // E5
                { f: 783.99, d: 0.15, t: 300 },     // G5
                { f: 1046.50, d: 0.4, t: 450 },     // C6
                { f: 880.00, d: 0.2, t: 750 },      // A5
                { f: 1046.50, d: 0.6, t: 950 },     // C6
                { f: 1318.51, d: 1.0, t: 1200 }     // E6 Grand Finale!
            ];
            notes.forEach((item) => {
                setTimeout(() => {
                    this.playChime(item.f, item.d, 'triangle');
                }, item.t);
            });
        }

        playBlowOutSound() {
            if (!isSoundEnabled) return;
            this.init();
            if (!this.ctx) return;

            // Gentle wind/whoosh sound using white noise
            const bufferSize = this.ctx.sampleRate * 0.8;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }

            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.setValueAtTime(600, this.ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.8);

            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);

            noise.start();
            noise.stop(this.ctx.currentTime + 0.8);
        }
    }

    const sound = new SoundEngine();

    // Toggle sound button logic
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    if (soundToggleBtn) {
        soundToggleBtn.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            const icon = soundToggleBtn.querySelector('.sound-icon');
            const text = soundToggleBtn.querySelector('.sound-text');
            if (isSoundEnabled) {
                icon.textContent = '🔔';
                text.textContent = 'Sound: ON';
                soundToggleBtn.style.background = 'rgba(255, 255, 255, 0.15)';
                sound.playChime(659.25, 0.4);
            } else {
                icon.textContent = '🔕';
                text.textContent = 'Sound: OFF';
                soundToggleBtn.style.background = 'rgba(255, 0, 100, 0.3)';
            }
        });
    }

    /* ==========================================================================
       2. PARTICLE ENGINE (Floating Stars & Glowing Orbs)
       ========================================================================== */
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let particles = [];

    function resizeCanvas() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            if (!canvas) return;
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 1;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6 - 0.3;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.colors = ['#ff9ebd', '#c77dff', '#ffd700', '#00f5ff', '#ffffff'];
            this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        }

        update() {
            if (!canvas) return;
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
                this.y = canvas.height + 10;
            }
        }

        draw() {
            if (!ctx) return;
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    if (canvas && ctx) {
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    /* ==========================================================================
       3. SURPRISE GATEWAY UNLOCK MECHANISM
       ========================================================================== */
    const unlockBtn = document.getElementById('unlock-btn');
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainContent = document.getElementById('main-content');

    if (unlockBtn && welcomeScreen && mainContent) {
        unlockBtn.addEventListener('click', () => {
            sound.playCrazyPartySymphony();

            // 1. Trigger Crazy Neon Shockwave Flash & Emojis
            const crazyOverlay = document.getElementById('crazy-overlay');
            const emojisContainer = document.getElementById('crazy-emojis-container');
            if (crazyOverlay && emojisContainer) {
                crazyOverlay.classList.remove('hidden');
                crazyOverlay.classList.add('exploding');

                const emojis = ['💥', '👑', '🎂', '💖', '🎉', '🎁', '✨', '🎈', '🌟', '🥳', '🚀', '🔥'];
                for (let i = 0; i < 30; i++) {
                    setTimeout(() => {
                        const span = document.createElement('span');
                        span.className = 'crazy-emoji-item';
                        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                        span.style.left = `${Math.random() * 90 + 5}%`;
                        span.style.top = `${Math.random() * 80 + 10}%`;
                        span.style.animationDuration = `${Math.random() * 0.8 + 1.2}s`;
                        emojisContainer.appendChild(span);
                    }, i * 40);
                }
            }

            // 2. Stage 1: Massive Dual Bottom Cannons
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150,
                    angle: 60,
                    spread: 80,
                    origin: { x: 0, y: 0.9 },
                    colors: ['#ffd700', '#ff4bc2', '#9d4edd', '#00f5d4']
                });
                confetti({
                    particleCount: 150,
                    angle: 120,
                    spread: 80,
                    origin: { x: 1, y: 0.9 },
                    colors: ['#ffd700', '#ff4bc2', '#9d4edd', '#00f5d4']
                });

                // Stage 2: Starburst Center Explosion at 400ms
                setTimeout(() => {
                    confetti({
                        particleCount: 120,
                        spread: 100,
                        startVelocity: 55,
                        origin: { y: 0.5 },
                        shapes: ['star', 'circle'],
                        colors: ['#ffd700', '#ffaa00', '#ffffff']
                    });
                }, 400);

                // Stage 3: High Fireworks Rockets at 800ms
                setTimeout(() => {
                    confetti({
                        particleCount: 100,
                        spread: 120,
                        startVelocity: 45,
                        origin: { y: 0.2 },
                        colors: ['#ff007f', '#00f5d4', '#ffd700']
                    });
                }, 800);

                // Stage 4: Continuous Confetti Rain Finale for 3 seconds
                let rainCount = 0;
                const rainInterval = setInterval(() => {
                    rainCount++;
                    if (rainCount > 15) {
                        clearInterval(rainInterval);
                    } else {
                        confetti({
                            particleCount: 15,
                            spread: 100,
                            origin: { y: 0, x: Math.random() },
                            colors: ['#ffd700', '#ff4bc2', '#ffffff']
                        });
                    }
                }, 200);
            }

            // 3. Fade out welcome screen smoothly into the main celebration
            welcomeScreen.classList.add('fade-out');
            setTimeout(() => {
                welcomeScreen.classList.add('hidden');
                mainContent.classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 900);
        });
    }

    /* ==========================================================================
       4. INTERACTIVE BIRTHDAY CAKE CANDLE BLOWING ENGINE
       ========================================================================== */
    const blowBtn = document.getElementById('blow-candles-btn');
    const relightBtn = document.getElementById('relight-candles-btn');
    const secretBox = document.getElementById('secret-message-box');
    const flames = document.querySelectorAll('.flame');
    const flameGlows = document.querySelectorAll('.flame-glow');
    const smokes = document.querySelectorAll('.smoke');

    function blowOutCandles() {
        if (!areCandlesLit) return;
        areCandlesLit = false;

        sound.playBlowOutSound();

        // Extinguish flames with slight stagger for realism
        flames.forEach((flame, idx) => {
            setTimeout(() => {
                flame.classList.add('extinguished');
                if (flameGlows[idx]) flameGlows[idx].classList.add('extinguished');
                if (smokes[idx]) smokes[idx].classList.add('puffing');
            }, idx * 80);
        });

        // Trigger Confetti Storm after candles go out
        setTimeout(() => {
            if (typeof confetti === 'function') {
                const duration = 2.5 * 1000;
                const end = Date.now() + duration;

                (function frame() {
                    confetti({
                        particleCount: 7,
                        angle: 60,
                        spread: 55,
                        origin: { x: 0 },
                        colors: ['#ffd700', '#ff4bc2', '#c77dff']
                    });
                    confetti({
                        particleCount: 7,
                        angle: 120,
                        spread: 55,
                        origin: { x: 1 },
                        colors: ['#ffd700', '#ff4bc2', '#c77dff']
                    });

                    if (Date.now() < end) {
                        requestAnimationFrame(frame);
                    }
                }());
            }

            // Reveal Secret Message Box
            if (secretBox) {
                secretBox.classList.remove('hidden');
                setTimeout(() => {
                    secretBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 300);
            }
            if (blowBtn) blowBtn.classList.add('hidden');
            if (relightBtn) relightBtn.classList.remove('hidden');
        }, 600);
    }

    function relightCandles() {
        if (areCandlesLit) return;
        areCandlesLit = true;

        sound.playChime(659.25, 0.5);

        flames.forEach((flame, idx) => {
            flame.classList.remove('extinguished');
            if (flameGlows[idx]) flameGlows[idx].classList.remove('extinguished');
            if (smokes[idx]) smokes[idx].classList.remove('puffing');
        });

        if (secretBox) secretBox.classList.add('hidden');
        if (blowBtn) blowBtn.classList.remove('hidden');
        if (relightBtn) relightBtn.classList.add('hidden');
    }

    if (blowBtn) blowBtn.addEventListener('click', blowOutCandles);
    if (relightBtn) relightBtn.addEventListener('click', relightCandles);

    /* ==========================================================================
       5. NAV CONFETTI SHOWER BUTTON
       ========================================================================== */
    const navConfettiBtn = document.getElementById('confetti-shower-btn');
    if (navConfettiBtn) {
        navConfettiBtn.addEventListener('click', () => {
            sound.playChime(783.99, 0.4);
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.3 },
                    colors: ['#ffd700', '#ff4bc2', '#9d4edd']
                });
            }
        });
    }

    /* ==========================================================================
       6. UNIVERSAL PERSONALIZATION ENGINE & PRESET PREVIEWS
       ========================================================================== */
    const presets = {
        friendly: "On your special day, I wanted to send you my very warmest birthday wishes! Your kindness, your contagious laugh, and your genuine heart make the world such a brighter place. May this new year of your life bring you exciting new adventures, endless happiness, and every dream your heart desires!",
        bestie: "To my absolute favorite partner-in-crime and most incredible friend! Life is a million times brighter, funnier, and better with you around. Thank you for all the legendary memories, the endless laughs, and for being such a rockstar. May this year be your biggest and best one yet!",
        romantic: "Happy birthday to the person who means the entire world to me. Every moment with you is a treasure, and your smile lights up my whole universe. Wishing you all the happiness, joy, and love today and forever!",
        party: "It’s time to pop the confetti, make some noise, and celebrate the most legendary person alive! May this year be packed with epic wins, nonstop celebrations, and unforgettable adventures!"
    };

    function applyPersonalization(toName, fromName, presetType, customMsgText) {
        const to = (toName && toName.trim() !== '') ? toName.trim() : 'Special One';
        const from = (fromName && fromName.trim() !== '') ? fromName.trim() : '';

        // 1. Update Title & Headers
        const pageTitle = document.getElementById('page-title');
        if (pageTitle) pageTitle.textContent = `Happy Birthday ${to}! ✨👑 | Universal Celebration App`;

        const gatewayRecipient = document.getElementById('gateway-recipient');
        if (gatewayRecipient) gatewayRecipient.textContent = to;

        const navRecipientName = document.getElementById('nav-recipient-name');
        if (navRecipientName) navRecipientName.textContent = to;

        const heroTitleTo = document.getElementById('hero-title-to');
        if (heroTitleTo) heroTitleTo.textContent = `${to}!`;

        const cakeTitleTo = document.getElementById('cake-title-to');
        if (cakeTitleTo) cakeTitleTo.textContent = to;

        const cakeRibbon = document.getElementById('cake-ribbon-text');
        if (cakeRibbon) cakeRibbon.textContent = `👑 HAPPY BIRTHDAY ${to.toUpperCase()} 👑`;

        // 2. Update Senders
        const gatewaySenderWrapper = document.getElementById('gateway-sender-wrapper');
        const gatewaySender = document.getElementById('gateway-sender');
        if (from !== '') {
            if (gatewaySenderWrapper) gatewaySenderWrapper.style.display = 'inline';
            if (gatewaySender) gatewaySender.textContent = from;
        } else {
            if (gatewaySenderWrapper) gatewaySenderWrapper.style.display = 'none';
        }

        const heroSignature = document.getElementById('hero-signature-from');
        if (heroSignature) {
            heroSignature.textContent = from !== '' 
                ? `✨ With Warmest & Best Birthday Wishes — From ${from} ✨` 
                : `✨ With Warmest & Best Birthday Wishes ✨`;
        }

        const secretSignature = document.getElementById('secret-signature-from');
        if (secretSignature) {
            secretSignature.textContent = from !== '' 
                ? `✨ Wishing you endless joy, smiles & success — From ${from} ✨` 
                : `✨ Wishing you endless joy, smiles & success ✨`;
        }

        // 3. Update Message Content
        const heroBody = document.getElementById('hero-message-body');
        let selectedMessage = presets[presetType] || presets.friendly;
        if (presetType === 'custom' && customMsgText && customMsgText.trim() !== '') {
            selectedMessage = customMsgText.trim();
        }
        if (heroBody) {
            heroBody.textContent = `"${selectedMessage}"`;
        }

        // Also sync secret body if appropriate
        const secretBody = document.getElementById('secret-body-text');
        if (secretBody) {
            secretBody.textContent = `"As the candle smoke rises, your wish takes flight! ${to}, never forget that your resilience, humor, and pure heart inspire everyone around you. Keep shining as brightly as you do every day. This year is yours to conquer!"`;
        }
    }

    // Parse URL parameters on load
    const params = new URLSearchParams(window.location.search);
    const urlTo = params.get('to') || '';
    const urlFrom = params.get('from') || '';
    const urlPreset = params.get('preset') || 'friendly';
    const urlMsg = params.get('msg') || '';

    applyPersonalization(urlTo, urlFrom, urlPreset, urlMsg);

    /* ==========================================================================
       7. INTERACTIVE CUSTOMIZER MODAL & SHARE CONTROLLERS
       ========================================================================== */
    const modal = document.getElementById('customizer-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const openButtons = [
        document.getElementById('open-customizer-btn'),
        document.getElementById('float-customizer-btn'),
        document.getElementById('gateway-open-customizer'),
        document.getElementById('footer-customizer-btn')
    ];

    const inputTo = document.getElementById('modal-input-to');
    const inputFrom = document.getElementById('modal-input-from');
    const selectPreset = document.getElementById('modal-select-preset');
    const inputMsg = document.getElementById('modal-input-msg');
    const previewLiveBtn = document.getElementById('preview-live-btn');
    const generateLinkBtn = document.getElementById('generate-link-btn');
    const whatsappBtn = document.getElementById('whatsapp-share-btn');
    const linkedinBtn = document.getElementById('linkedin-share-btn');
    const copyToast = document.getElementById('copy-toast');

    // Populate initial inputs if parameters present
    if (inputTo) inputTo.value = urlTo;
    if (inputFrom) inputFrom.value = urlFrom;
    if (selectPreset) {
        selectPreset.value = presets[urlPreset] ? urlPreset : 'custom';
        if (selectPreset.value === 'custom' && inputMsg) {
            inputMsg.value = urlMsg;
        } else if (inputMsg) {
            inputMsg.value = presets[selectPreset.value] || presets.friendly;
        }
    }

    function openModal() {
        if (!modal) return;
        modal.classList.remove('hidden');
        sound.playChime(659.25, 0.4);
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.add('hidden');
        sound.playChime(523.25, 0.3);
    }

    openButtons.forEach(btn => {
        if (btn) btn.addEventListener('click', openModal);
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    if (selectPreset && inputMsg) {
        selectPreset.addEventListener('change', () => {
            const val = selectPreset.value;
            if (presets[val]) {
                inputMsg.value = presets[val];
            } else if (val === 'custom') {
                inputMsg.placeholder = "Write your heartfelt, unique birthday wish here...";
                inputMsg.focus();
            }
        });
    }

    if (previewLiveBtn) {
        previewLiveBtn.addEventListener('click', () => {
            const toVal = inputTo ? inputTo.value : '';
            const fromVal = inputFrom ? inputFrom.value : '';
            const presetVal = selectPreset ? selectPreset.value : 'friendly';
            const msgVal = inputMsg ? inputMsg.value : '';

            applyPersonalization(toVal, fromVal, presetVal, msgVal);
            closeModal();
            sound.playUnlockCelebration();
            if (typeof confetti === 'function') {
                confetti({ particleCount: 60, spread: 80, origin: { y: 0.4 } });
            }
        });
    }

    function getGeneratedUrl() {
        const toVal = inputTo ? inputTo.value.trim() : '';
        const fromVal = inputFrom ? inputFrom.value.trim() : '';
        const presetVal = selectPreset ? selectPreset.value : 'friendly';
        const msgVal = inputMsg ? inputMsg.value.trim() : '';

        const url = new URL(window.location.origin + window.location.pathname);
        if (toVal) url.searchParams.set('to', toVal);
        if (fromVal) url.searchParams.set('from', fromVal);
        url.searchParams.set('preset', presetVal);
        if (presetVal === 'custom' && msgVal) {
            url.searchParams.set('msg', msgVal);
        }
        return url.toString();
    }

    function showToast(msg = "Magic Link Copied to Clipboard! 🎉") {
        if (!copyToast) return;
        const toastMsg = document.getElementById('toast-message');
        if (toastMsg) toastMsg.textContent = msg;
        copyToast.classList.remove('hidden');
        setTimeout(() => {
            copyToast.classList.add('hidden');
        }, 3500);
    }

    if (generateLinkBtn) {
        generateLinkBtn.addEventListener('click', () => {
            const magicLink = getGeneratedUrl();
            const toVal = inputTo ? inputTo.value : '';
            const fromVal = inputFrom ? inputFrom.value : '';
            const presetVal = selectPreset ? selectPreset.value : 'friendly';
            const msgVal = inputMsg ? inputMsg.value : '';

            // Apply immediately
            applyPersonalization(toVal, fromVal, presetVal, msgVal);

            navigator.clipboard.writeText(magicLink).then(() => {
                sound.playUnlockCelebration();
                showToast("Magic Link Copied to Clipboard! 🎉");
                if (typeof confetti === 'function') {
                    confetti({ particleCount: 100, spread: 90, origin: { y: 0.5 } });
                }
            }).catch(() => {
                // Fallback if clipboard API fails
                prompt("Copy your customized magic link below:", magicLink);
            });
        });
    }

    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            const magicLink = getGeneratedUrl();
            const toVal = (inputTo && inputTo.value.trim() !== '') ? inputTo.value.trim() : 'Special One';
            const text = `🎉 Happy Birthday, ${toVal}! I created a special interactive celebration surprise just for you right here: ${magicLink}`;
            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
        });
    }

    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', () => {
            const magicLink = getGeneratedUrl();
            const text = `Check out this magical universal birthday celebration web app! Created by Durga — personalize your own wishes instantly: ${magicLink}`;
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(magicLink)}`, '_blank');
        });
    }
});
