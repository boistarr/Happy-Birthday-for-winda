const pinBoxes = document.querySelectorAll('.pin-box');
pinBoxes.forEach((box, index) => {
    box.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < pinBoxes.length - 1) pinBoxes[index + 1].focus();
    });
    box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) pinBoxes[index - 1].focus();
    });
});

function checkPassword() {
    let pin = '';
    pinBoxes.forEach(box => pin += box.value);

    const correctPin = '1707'; 
    const errorMessage = document.getElementById('error-message');
    const pinContainer = document.querySelector('.pin-container');

    if (pin === correctPin) {
        errorMessage.style.display = 'none';
        startExperience(); 

    } else {
        errorMessage.style.display = 'block';
        pinContainer.classList.add('shake');
        setTimeout(() => { pinContainer.classList.remove('shake'); }, 400);
        pinBoxes.forEach(box => box.value = '');
        pinBoxes[0].focus();
    }
}

function startExperience() {
    // Confetti setelah welcome hilang
    setTimeout(() => {
        fireWelcomeConfetti();
    }, 250);
    const welcomeScreen = document.getElementById('welcome-screen');
    document.querySelector('nav').style.display = 'flex';
    document.querySelector('.container').style.display = 'block';

    welcomeScreen.style.opacity = '0';
    welcomeScreen.style.transform = 'scale(1.1)';
    setTimeout(() => {
        welcomeScreen.style.display = 'none';
        revealOnScroll();
        window.dispatchEvent(new Event('scroll'));
    }, 300);

    const audio = document.getElementById('bg-music');
    if (audio) {
        // Tombol play/pause (mirip Spotify sederhana)
        const toggleBtn = document.getElementById('music-toggle');
        const statusEl = document.getElementById('music-status');

        const updateUI = () => {
            if (!statusEl) return;
            const isPlaying = !audio.paused && !audio.ended;
            document.getElementById('music-badge')?.classList.toggle('playing', isPlaying);
            toggleBtn && (toggleBtn.textContent = isPlaying ? '⏸' : '▶');
            statusEl.textContent = isPlaying ? 'Sedang memutar lagu...' : 'Lagu dijeda';

        };

        audio.addEventListener('play', updateUI);
        audio.addEventListener('pause', updateUI);
        audio.addEventListener('ended', updateUI);

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                if (audio.paused) audio.play();
                else audio.pause();
            });
        }

        // Jangan autoplay supaya setelah deploy audio tetap bisa diputar (butuh user gesture).
        updateUI();
    }

}

// ==========================================
// 2. ANIMASI SCROLL & PARTIKEL
// ==========================================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < window.innerHeight - 100) element.classList.add('active');
    });
}
window.addEventListener('scroll', revealOnScroll);

window.onload = function() {
    // Buat background untuk halaman utama sekali saja.
    const particles = document.getElementById('particles-container');
    const emojis = document.getElementById('emoji-container');
    if (particles) createParticles();
    if (emojis) initEmojiBackground();

    // Clone untuk welcome supaya animasi tidak “restart” saat welcome menghilang.
    const welcomeParticles = document.getElementById('welcome-particles');
    const welcomeEmojis = document.getElementById('welcome-emoji-container');
    if (welcomeParticles && particles) welcomeParticles.innerHTML = particles.innerHTML;
    if (welcomeEmojis && emojis) welcomeEmojis.innerHTML = emojis.innerHTML;
};

function initEmojiBackground() {
    const container = document.getElementById('emoji-container');
    const emojis = ['✨', '💖', '⭐', '🌸', '🎁', '🎂'];
    for (let i = 0; i < 20; i++) {
        const span = document.createElement('span');
        span.className = 'moving-emoji';
        span.innerText = emojis[Math.floor(Math.random() * emojis.length)];
        span.style.left = Math.random() * 100 + '%';
        span.style.animationDuration = (Math.random() * 10 + 10) + 's';
        span.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(span);
    }
}

function createParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    // Hindari dobel create kalau reload/trigger ulang
    container.innerHTML = '';

    const symbols =  ['✨', '💖', '⭐', '🌸', '🎁', '🎂']; 
    for (let i = 0; i < 20; i++) {
        let p = document.createElement('div');
        p.classList.add('particle');
        p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        container.appendChild(p);
    }
}


// ==========================================
// 3. FITUR BUKA KADO & KETIK OTOMATIS
// ==========================================
const letterText = "Selamat ulang tahun yaa. 🥳 Semoga di umur yang baru ini kamu selalu sehat, bahagia, dan semua yang lagi kamu usahain bisa berjalan sesuai yang kamu harapkan. Semoga hari ini jadi hari yang menyenangkan dan penuh sama hal-hal baik buat kamu.\n\nMakasih ya udah hadir dan jadi salah satu orang yang bikin hari-hariku lebih berwarna. I hope this new chapter brings you more happiness, more laughter, and so many reasons to smile. Jangan lupa tetap jadi diri kamu yang selalu baik dan hangat.\n\nHave the happiest birthday, pretty. Enjoy your day, don't forget to smile, and let yourself be spoiled today. You deserve all the good things. 🤍";

let typeIndex = 0;
let isTyping = false;

function openGift() {
    // Menghilangkan kado dan memunculkan kotak surat
    document.getElementById('gift-container').style.display = 'none';
    document.getElementById('letter-content').style.display = 'block';
    
    // Mulai efek ketik jika belum pernah dijalankan
    if (!isTyping) {
        isTyping = true;
        typeWriter();
    }
}

function typeWriter() {
    const speed = 40; // Kecepatan ngetik dalam milidetik
    const textContainer = document.getElementById('typewriter-text');
    
    if (typeIndex < letterText.length) {
        // Tampilkan teks karakter demi karakter, ditambah kursor berkedip di ujungnya
        textContainer.innerHTML = letterText.substring(0, typeIndex + 1) + '<span class="cursor"></span>';
        typeIndex++;
        setTimeout(typeWriter, speed);
    } else {
        // Jika sudah selesai ngetik, hilangkan kursor dan munculkan nama pengirim
        textContainer.innerHTML = letterText;
        setTimeout(() => {
            document.getElementById('typewriter-signature').style.display = 'block';
            // Trigger animasi munculnya signature
            document.getElementById('typewriter-signature').style.animation = 'zoomIn 0.5s ease';
        }, 500);
    }
}

// ==========================================
// 4. FITUR INTERAKTIF LAINNYA
// ==========================================

// A. Hati Melayang Tiap Kali Layar Diklik
document.addEventListener('click', function(e) {
    // Jangan munculkan hati jika klik area fungsional seperti kado, sandi, atau lilin
    if(e.target.closest('.pin-container') || e.target.closest('.btn-open') || e.target.closest('#gift-container') || e.target.id === 'candles') return;
    
    const heart = document.createElement('div');
    heart.classList.add('click-heart');
    heart.innerHTML = '💖';
    heart.style.left = e.pageX + 'px';
    heart.style.top = e.pageY + 'px';
    document.body.appendChild(heart);
    
    setTimeout(() => { heart.remove(); }, 1000);
});

// B. Lightbox Galeri (Klik Foto untuk Memperbesar)
const modal = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const galleryWrappers = document.querySelectorAll('.img-wrapper');

galleryWrappers.forEach(wrapper => {
    wrapper.addEventListener('click', function() {
        const img = this.querySelector('img');
        modal.style.display = 'block';
        modalImg.src = img.src;
    });
});
function closeModal() { modal.style.display = 'none'; }

// C. Tiup Lilin & Hujan Confetti
function createConfetti() {
    const colors = ['#e6c875', '#ff6b6b', '#ffffff', '#4ecdc4', '#ff9f43'];
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';

    document.body.appendChild(confetti);
    setTimeout(() => { confetti.remove(); }, 4000);
}

function fireWelcomeConfetti() {
    const container = document.getElementById('welcome-confetti');
    if (!container) return;

    // bersihkan dulu biar gak numpuk
    container.innerHTML = '';

    const colors = ['#e6c875', '#ff6b6b', '#ffffff', '#4ecdc4', '#ff9f43'];
    const count = 180;

    for (let i = 0; i < count; i++) {
        const d = document.createElement('div');
        d.className = 'welcome-confetti-piece';
        d.style.left = (Math.random() * 100) + '%';
        d.style.background = colors[Math.floor(Math.random() * colors.length)];
        d.style.animationDuration = (Math.random() * 1.2 + 1.2) + 's';
        d.style.animationDelay = (Math.random() * 0.25) + 's';
        d.style.transform = `rotate(${Math.random() * 360}deg)`;
        container.appendChild(d);
    }

    setTimeout(() => {
        container.innerHTML = '';
    }, 2800);
}

function blowCandles() {
    const candles = document.getElementById('candles');
    if (!candles || candles.dataset.blowed === 'true') return;
    candles.dataset.blowed = 'true';

    const candleNodes = candles.querySelectorAll('.candle');
    candleNodes.forEach((c) => {
        c.classList.remove('on');
        c.classList.add('out');
    });

    // efek “tiup” text
    const sparkle = document.getElementById('wish-sparkle');
    if (sparkle) {
        sparkle.classList.add('showing');
        setTimeout(() => sparkle.classList.remove('showing'), 900);
    }

    // Confetti
    for (let i = 0; i < 120; i++) {
        setTimeout(createConfetti, i * 20);
    }
}

