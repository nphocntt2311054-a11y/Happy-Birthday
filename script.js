let isBlown = false;
const correctPass = "1906";
let heartInterval; 

// ==========================================
// CÀI ĐẶT CHUNG: TẠO TRÁI TIM BAY NỀN
// ==========================================
function spawnHeart() {
    const container = document.getElementById('heart-container');
    if(!container) return;
    const heartSymbols = ['❤', '💗', '💖', '💕', '♥'];
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
}

function createHearts() {
    heartInterval = setInterval(spawnHeart, 400); 
}


// ==========================================
// TRANG 1: LOGIC XỬ LÝ ĐĂNG NHẬP
// ==========================================
function appendNum(num) {
    const p = document.getElementById('password');
    if (p.value.length < 4) p.value += num;
}
function clearPass() { document.getElementById('password').value = ''; }

function checkPassword() {
    const passwordInput = document.getElementById('password');
    const correctPassword = "1906"; // Giữ nguyên mật mã của ông

    if (passwordInput.value === correctPassword) {
        // 1. Tạo phần tử thông báo (Giữ nguyên text của ông)
        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.innerHTML = 'Cuối cùng bé nhà anh cũng biết đây là ngày đặt biệt rùi. Em dỏi đóa❤️';
        document.body.appendChild(msg);

        // 2. Chờ 3 giây rồi mới chuyển sang trang thổi nến
        setTimeout(() => {
            msg.remove(); // Xóa thông báo xịn sau khi hết 3s
            
            // Ẩn trang đăng nhập của ông đi
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) loginScreen.classList.add('hidden');
            
            // HIỆN CHÍNH XÁC TRANG THỔI NẾN (Đã sửa từ main-content thành cake-screen)
            const cakeScreen = document.getElementById('cake-screen');
            if (cakeScreen) {
                cakeScreen.classList.remove('hidden');
            }
        }, 3000);

    } else {
        // Xử lý khi sai mật mã (Giữ nguyên và fix lỗi chữ bị đen)
        const errorMsg = document.getElementById('login-error');
        if (errorMsg) {
            errorMsg.style.color = "#ff477e"; // Ép màu đỏ rực rỡ nổi bật trên nền tối
            errorMsg.classList.remove('hidden');
        }
        passwordInput.value = "";
    }
}
// Thêm hiệu ứng cho ảnh hint khi click
document.addEventListener('DOMContentLoaded', () => {
    const loginFrame = document.querySelector('.image-frame-neon');
    if (loginFrame) {
        loginFrame.addEventListener('click', function() {
            this.classList.add('img-active');
            // Sau khi chạy xong animation thì xóa class đi để lần sau bấm lại vẫn hiện
            setTimeout(() => {
                this.classList.remove('img-active');
            }, 500);
        });
    }
});

// ==========================================
// TRANG 2: LOGIC XỬ LÝ THỔI NẾN (MIC + CLICK)
// ==========================================
function startListening() {
    const flame = document.querySelector('.flame');
    const candle = document.querySelector('.candle'); // FIX: Thêm dòng này để chọn toàn bộ cây nến
    
    // Hàm dùng chung để xử lý khi nến bị tắt (tối ưu để không lặp lại code)
    const extinguishCandle = (stream) => {
        if (isBlown) return; // Nếu đã tắt rồi thì không chạy lại
        isBlown = true;
        
        if (flame) flame.style.display = 'none'; // Tắt lửa
        document.getElementById('instruction').innerText = "Chúc mừng sinh nhật! ✨";
        
        const nextBtn = document.getElementById('btn-to-book');
        if (nextBtn) nextBtn.classList.remove('hidden'); // Hiện nút bấm chuyển trang
        
        // Nếu có stream micro thì tắt đi để bảo mật/tiết kiệm pin
        if (stream) {
            stream.getTracks().forEach(t => t.stop());
        }
    };

    // CÁCH 1: TẮT NẾN BẰNG CLICK 
    // FIX: Gắn sự kiện click vào 'candle' thay vì 'flame' để click phát ăn ngay
    if (candle) {
        candle.style.cursor = 'pointer'; // Tạo hiệu ứng bàn tay khi rê chuột vào cây nến
        candle.addEventListener('click', () => {
            extinguishCandle(); // Gọi hàm tắt nến ngay khi click
        });
    }

    // CÁCH 2: TẮT NẾN BẰNG CÁCH THỔI (Giữ nguyên logic mic của ông)
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        function detect() {
            if (isBlown) return;
            analyser.getByteFrequencyData(dataArray);
            let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
            
            if (avg > 50) { 
                extinguishCandle(stream); // Thổi đủ mạnh thì tắt nến
            }
            requestAnimationFrame(detect);
        }
        detect();

        // FIX: Cập nhật lại sự kiện click nếu mic đang hoạt động cho 'candle'
        if (candle) {
            candle.onclick = () => extinguishCandle(stream);
        }
    }).catch(() => {
        // Nếu không cho dùng mic, vẫn đợi 3s hoặc cho phép người dùng click
        setTimeout(() => {
            if (!isBlown) extinguishCandle();
        }, 3000);
    });
}


// ==========================================
// TRANG 3: LOGIC XỬ LÝ LẬT SÁCH (4 TRANG)
// ==========================================

// Hàm gọi khi ấn nút ở Trang 2 để chuyển sang Trang 3
function showBook() {
    document.getElementById('cake-screen').classList.add('hidden');
    document.getElementById('gallery-screen').classList.remove('hidden');
}

// Hàm lật từng trang sách
function flipPage(pageNum) {
    const page = document.getElementById(`p${pageNum}`);
    if (page.classList.contains('flipped')) {
        page.classList.remove('flipped'); // Đóng trang
        setTimeout(() => { page.style.zIndex = (5 - pageNum); }, 400); // Trả lại lớp cũ
    } else {
        page.classList.add('flipped'); // Lật trang
        page.style.zIndex = 10 + pageNum; // Đẩy lên trên cùng
    }
}

// ==========================================
// TRANG 4: NÂNG CẤP NỀN TIM BAY & ẢNH CHẠY
// ==========================================
function showFinalSurprise(event) {
    if(event) event.stopPropagation();
    
    document.getElementById('gallery-screen').classList.add('hidden');
    document.getElementById('final-surprise-screen').classList.remove('hidden');

    const bgLayer = document.getElementById('bg-heart-layer');
    const runnerContainer = document.getElementById('photo-runner-container');

    // 1. TẠO HIỆU ỨNG TIM NỀN DÀY ĐẶC & ĐẸP HƠN
    function spawnBgHeart() {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart-fly');
        
        // Danh sách nhiều loại tim cho đẹp giống trang đầu
        const heartSymbols = ['❤', '💗', '💖', '💕', '♥', '🌸'];
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        heart.style.left = Math.random() * 100 + 'vw';
        
        // Kích thước ngẫu nhiên từ nhỏ đến vừa
        const size = Math.random() * 15 + 12;
        heart.style.fontSize = size + 'px';
        
        // Tốc độ bay ngẫu nhiên (từ 4s đến 8s)
        const duration = Math.random() * 4 + 4;
        heart.style.animationDuration = duration + 's';
        
        bgLayer.appendChild(heart);
        
        setTimeout(() => heart.remove(), duration * 1000);
    }

    // TĂNG SỐ LƯỢNG: Cứ 80ms tạo 1 trái tim (Dày đặc hơn rất nhiều)
    setInterval(spawnBgHeart, 80);

    // 2. GIỮ NGUYÊN PHẦN ẢNH CHẠY NGANG CỦA ÔNG
    const myPhotos = [
        'image/1.jpg', 'image/2.jpg', 'image/3.jpg', 'image/4.jpg',
        'image/5.jpg', 'image/6.jpg', 'image/7.jpg', 'image/8.jpg'
    ];

    for(let i = 0; i < 30; i++) {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = myPhotos[i % myPhotos.length];
            
            const shapeClass = Math.random() > 0.5 ? 'heart-shape' : 'square-shape';
            img.className = `running-photo ${shapeClass}`;
            img.style.top = (Math.random() * 80 + 5) + '%';
            
            const speed = Math.random() * 7 + 5;
            img.style.animationDuration = speed + 's';
            img.style.animationDelay = (Math.random() * 5) + 's';
            img.style.zIndex = "5"; 

            runnerContainer.appendChild(img);
        }, i * 400);
    }
}
// Khởi chạy tim bay khi vừa mở web lên
window.onload = createHearts;