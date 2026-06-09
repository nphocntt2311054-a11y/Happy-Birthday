let isBlown = false;
const correctPass = "1906";

// 1. TẠO TRÁI TIM BAY (Chạy ngay khi load)
function createHearts() {
    const container = document.getElementById('heart-container');
    if(!container) return;
    const heartSymbols = ['❤', '💗', '💖', '💕', '♥'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 15 + 10;
        heart.style.fontSize = size + 'px';
        const duration = Math.random() * 5 + 5;
        heart.style.animationDuration = duration + 's';
        container.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }, 400);
}

// 2. LOGIC ĐĂNG NHẬP
function appendNum(num) {
    const p = document.getElementById('password');
    if (p.value.length < 6) p.value += num;
}

function clearPass() { document.getElementById('password').value = ''; }

function checkPassword() {
    const pass = document.getElementById('password').value;
    if (pass === correctPass) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('gallery-screen').classList.remove('hidden');
    } else {
        alert("Sai mật mã rồi!");
        clearPass();
    }
}

// 3. LOGIC SÁCH
function openBook() {
    document.getElementById('myBook').classList.toggle('open');
}

function nextToCake(event) {
    if (event) event.stopPropagation();
    document.getElementById('gallery-screen').classList.add('hidden');
    document.getElementById('cake-screen').classList.remove('hidden');
    
    const music = document.getElementById('bg-music');
    if (music) music.play().catch(() => console.log("Cần click để phát nhạc"));
    
    startListening();
}

// 4. LOGIC THỔI NẾN
function startListening() {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detect() {
            if (isBlown) return;
            analyser.getByteFrequencyData(dataArray);
            let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
            if (avg > 50) {
                isBlown = true;
                document.querySelector('.flame').style.display = 'none';
                document.getElementById('instruction').innerText = "Happy Birthday! ✨🥳";
                stream.getTracks().forEach(t => t.stop());
            }
            requestAnimationFrame(detect);
        }
        detect();
    }).catch(e => alert("Hãy cho phép dùng Mic để thổi nến nhé!"));
}

// Khởi tạo
window.onload = createHearts;