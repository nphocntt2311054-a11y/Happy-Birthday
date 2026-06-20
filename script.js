let isBlown = false;
const correctPass = "1906";
let heartInterval; 

// ==========================================
// CÀI ĐẶT CHUNG: TẠO TRÁI TIM BAY NỀN
// ==========================================
function spawnHeart() {
    const container = document.getElementById('heart-container');
    if(!container) return;
    const heartSymbols = [ '💗', '💖', '💕','🌸', ]; //'🩵'
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
    heartInterval = setInterval(spawnHeart, 70); 
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
                
                // 🔥 CHỖ FIX CHO ÔNG: Gọi hàm để kích hoạt tính năng Mic + Click thổi nến hoạt động
                startListening(); 
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
// TRANG 2: LOGIC XỬ LÝ THỔI NẾN (MIC + CLICK) - FIX LỖI TRÊN ĐIỆN THOẠI
// ==========================================
function startListening() {
    if (typeof window.isBlown === 'undefined') {
        window.isBlown = false;
    }
    window.isBlown = false; 

    const flame = document.querySelector('.flame');
    const candle = document.querySelector('.candle'); 
    
    // Hàm dùng chung để xử lý khi nến bị tắt
    const extinguishCandle = (stream) => {
        if (window.isBlown) return; 
        window.isBlown = true;
        
        // 🌟 NƠI THAY ĐỔI: FIX LỖI ÉP IPHONE / ĐIỆN THOẠI PHẢI PHÁT NHẠC
        const bgMusic = document.getElementById('bg-music');
        const volumeSlider = document.getElementById('volume-slider');

        if (bgMusic) {
            // Mẹo cực độc cho iOS/Safari: Tải lại cấu trúc âm thanh một nhịp trước khi chạy
            bgMusic.load(); 
            bgMusic.volume = 0.5; // Giữ nguyên mức âm lượng 50% như mày muốn
            
            // Ép trình duyệt kích hoạt phát bài hát ngay lập tức khi có hành động thổi/click
            bgMusic.play().catch(e => {
                console.log("Lỗi ép phát nhạc trên thiết bị di động: ", e);
            });

            // Lắng nghe sự kiện kéo thanh trượt để thay đổi âm lượng trực tiếp
            if (volumeSlider) {
                volumeSlider.addEventListener('input', (e) => {
                    bgMusic.volume = e.target.value;
                });
            }
        }
        
        if (flame) flame.style.display = 'none'; // Tắt lửa
        const instruction = document.getElementById('instruction');
        if (instruction) instruction.innerText = "Chúc mừng sinh nhật em ❤️"; // Thay đổi hướng dẫn thành lời chúc mừng
        
        const nextBtn = document.getElementById('btn-to-book');
        if (nextBtn) nextBtn.classList.remove('hidden'); // Hiện nút bấm chuyển trang
        
        // 🌟 NƠI THAY ĐỔI QUAN TRỌNG NHẤT: Trì hoãn việc đóng Micrô
        // Thay vì tắt mic ngay lập tức làm sập luồng âm thanh, ta cho nó chờ 400 mili giây (0.4 giây)
        // để trình duyệt di động mở khóa và kích hoạt bài nhạc xong xuôi rồi mới đóng mic.
        if (stream) {
            setTimeout(() => {
                try {
                    stream.getTracks().forEach(t => t.stop()); // Tắt mic rôm rả sau khi nhạc đã chạy
                } catch(e) { console.log("Lỗi dừng mic: ", e); }
            }, 400);
        }
    };

    // // CÁCH 1: TẮT NẾN BẰNG CLICK / CHẠM (Ưu tiên cài đặt trước để luôn luôn bấm được)
    // const applyClickEvents = (stream) => {
    //     const handler = () => extinguishCandle(stream);
    //     if (candle) {
    //         candle.style.cursor = 'pointer';
    //         candle.onclick = handler;
    //     }
    //     if (flame) {
    //         flame.style.cursor = 'pointer';
    //         flame.onclick = handler;
    //     }
    // };

    // // Bật tính năng click ngay lập tức
    // applyClickEvents();

    // // Hàm dự phòng tự tắt sau 3 giây nếu không cho dùng mic
    // const runFallback = () => {
    //     setTimeout(() => {
    //         if (!window.isBlown) extinguishCandle();
    //     }, 30000);
    // };

    // CÁCH 2: TẮT NẾN BẰNG CÁCH THỔI (Kiểm tra an toàn để không bị sập code trên HTTP điện thoại)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const analyser = audioContext.createAnalyser();
            const microphone = audioContext.createMediaStreamSource(stream);
            microphone.connect(analyser);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);

            function detect() {
                if (window.isBlown) return;
                analyser.getByteFrequencyData(dataArray);
                let avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
                
                if (avg > 40) { 
                    extinguishCandle(stream); // Thổi đủ mạnh thì tắt nến
                }
                requestAnimationFrame(detect);
            }
            detect();

            // Nếu xin quyền mic thành công, cập nhật click kèm tắt stream mic
            applyClickEvents(stream);
            
        }).catch(() => {
            // Nếu người dùng từ chối mic, chạy chế độ dự phòng
            runFallback();
        });
    } else {
        // Nếu trình duyệt chặn mic hoàn toàn (do chạy link HTTP trên điện thoại), chạy dự phòng ngay
        runFallback();
    }
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
        setTimeout(() => { page.style.zIndex = (5 - pageNum); }, 200); // Trả lại lớp cũ
    } else {
        page.classList.add('flipped'); // Lật trang
        page.style.zIndex = 10 + pageNum; // Đẩy lên trên cùng
    }
}

//================================================//
// TRANG 4: LOGIC XỬ LÝ ẢNH CHẠY & TIM BAY DÀY ĐẶC
//================================================//
function showFinalSurprise(event) {
    if(event) event.stopPropagation();
// chuyển từ trang 3 qua 4    
    document.getElementById('gallery-screen').classList.add('hidden');
    document.getElementById('final-surprise-screen').classList.remove('hidden');

    const bgLayer = document.getElementById('bg-heart-layer');
    const runnerContainer = document.getElementById('photo-runner-container');

    // 1. HIỆU ỨNG TIM NỀN GIỮ NGUYÊN
    function spawnBgHeart() {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart-fly');
        const heartSymbols = ['❤', '💗', '💖', '💕', '♥', '🌸','🌷'];
        heart.innerText = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 15 + 12;
        heart.style.fontSize = size + 'px';
        const duration = Math.random() * 4 + 4;
        heart.style.animationDuration = duration + 's';
        bgLayer.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }
    setInterval(spawnBgHeart, 80);

    // ==========================================
    // 2. MẢNG ẢNH CỦA MÀY (ĐÃ CÓ 36 TẤM)
    // ==========================================
    const myPhotos = [
        'image/1.jpg', 'image/2.jpg', 'image/3.jpg', 'image/4.jpg', 'image/5.jpg',
        'image/6.jpg', 'image/7.jpg', 'image/8.jpg', 'image/9.jpg', 'image/10.jpg',
        'image/11.jpg', 'image/12.jpg', 'image/13.jpg', 'image/14.jpg', 'image/15.jpg',
        'image/16.jpg', 'image/17.jpg', 'image/18.jpg', 'image/19.jpg', 'image/20.jpg',
        'image/21.jpg', 'image/22.jpg', 'image/23.jpg', 'image/24.jpg', 'image/25.jpg',
        'image/26.jpg', 'image/27.jpg', 'image/28.jpg', 'image/29.jpg', 'image/30.jpg', 
        'image/31.jpg', 'image/32.jpg', 'image/33.jpg', 'image/34.jpg', 'image/35.jpg',
        'image/36.jpg'
    ];

    // Tạo sẵn danh sách các tầng màn hình để ép ảnh chia đều ra từ trên xuống dưới
    // Chia màn hình làm 6 tầng cố định (từ 10% đến 85% chiều cao)
    const tracks = [10, 25, 40, 55, 70, 85];
    let trackIndex = 0;

    for(let i = 0; i < myPhotos.length; i++) {
        setTimeout(() => {
            const img = document.createElement('img');
            img.src = myPhotos[i];
            
            const shapeClass = Math.random() > 0.5 ? 'heart-shape' : 'square-shape';
            img.className = `running-photo ${shapeClass}`;
            
            // --- THUẬT TOÁN PHÂN BỐ ĐỀU CHỖ NÀY ---
            // Lấy tầng hiện tại + một chút lệch nhẹ (offset) ngẫu nhiên tầm -4% đến +4% cho tự nhiên
            const baseTop = tracks[trackIndex];
            const offset = (Math.random() * 8) - 4; 
            img.style.top = (baseTop + offset) + '%';
            
            // Xoay vòng các tầng (0 -> 1 -> 2 -> 3 -> 4 -> 5 -> quay lại 0)
            // Đảm bảo không có chuyện 3-4 tấm bay cùng một hàng dọc liên tục
            trackIndex = (trackIndex + 1) % tracks.length;
            // --------------------------------------

            // Cố định tốc độ bay ổn định (từ 5.5 đến 7 giây) để ảnh không bò rùa, không phóng tên lửa
            const speed = Math.random() * 2 + 8; 
            img.style.animationDuration = speed + 's';
            
            // Bỏ hẳn animationDelay ngẫu nhiên lớn để ảnh ra đều chằn chặn theo nhịp của vòng lặp
            img.style.animationDelay = '0s'; 
            img.style.zIndex = "5"; 

            runnerContainer.appendChild(img);
        }, i * 250); // Cứ 250ms là bắn ra 1 tấm đều đặn như vắt chanh
    }
}

// ==========================================================
// TỰ ĐỘNG KÍCH HOẠT TRANG 4 (ẢNH CHẠY & TIM BAY) KHI TỪ TRANG TIM ĐẬP QUAY VỀ
// ==========================================================
window.addEventListener("DOMContentLoaded", () => {
    // Nếu phát hiện trên đường dẫn URL có chữ '#final'
    if (window.location.hash === "#final") {
        
        // 1. Ẩn ngay lập tức trang đăng nhập (nếu có)
        const loginScreen = document.getElementById('login-screen');
        if (loginScreen) loginScreen.classList.add('hidden');
        
        // 2. Ẩn luôn trang thổi nến hoặc trang cuốn sách cũ
        const cakeScreen = document.getElementById('cake-screen');
        if (cakeScreen) cakeScreen.classList.add('hidden');
        
        const galleryScreen = document.getElementById('gallery-screen');
        if (galleryScreen) galleryScreen.classList.add('hidden');

        // 3. Kích hoạt thẳng hàm showFinalSurprise của mày sau 300ms cho ổn định cấu trúc
        setTimeout(() => {
            if (typeof showFinalSurprise === "function") {
                showFinalSurprise(null); // Gọi hàm chạy ảnh và tim bay dày đặc luôn!
            }
        }, 300);
    }
});
// Khởi chạy tim bay khi vừa mở web lên
window.onload = createHearts;


// // js của heart
//       /* =========================================================
//    * BỘ ĐẾM 3 NHỊP ĐẬP ĐỂ TỰ ĐỘNG CHUYỂN ĐẾN TRANG ẢNH CHẠY
//    * ========================================================= */
//         setTimeout(function () {
//             // Thêm '#final' ở đuôi để báo hiệu cho file JS bên kia kích hoạt màn cuối
//             window.location.href = "index.html#final";
//         }, 4500);


        /*
         * Settings gốc của mày giữ nguyên bên dưới...
         */
        var settings = {
            particles: {
                length: 1500,
                duration: 2,
                velocity: 135,
                effect: -0.35,
                size: 14,
            },
        };

        /*
         * RequestAnimationFrame polyfill
         */
        (function () {
            var b = 0;
            var c = ["ms", "moz", "webkit", "o"];
            for (var a = 0; a < c.length && !window.requestAnimationFrame; ++a) {
                window.requestAnimationFrame = window[c[a] + "RequestAnimationFrame"];
                window.cancelAnimationFrame = window[c[a] + "CancelAnimationFrame"] || window[c[a] + "CancelRequestAnimationFrame"]
            }
            if (!window.requestAnimationFrame) {
                window.requestAnimationFrame = function (h, e) {
                    var d = new Date().getTime();
                    var f = Math.max(0, 16 - (d - b));
                    var g = window.setTimeout(function () {
                        h(d + f)
                    }, f);
                    b = d + f;
                    return g
                }
            }
            if (!window.cancelAnimationFrame) {
                window.cancelAnimationFrame = function (d) {
                    clearTimeout(d)
                }
            }
        }());

        /*
         * Point class
         */
        var Point = (function () {
            function Point(x, y) {
                this.x = (typeof x !== 'undefined') ? x : 0;
                this.y = (typeof y !== 'undefined') ? y : 0;
            }
            Point.prototype.clone = function () {
                return new Point(this.x, this.y);
            };
            Point.prototype.length = function (length) {
                if (typeof length == 'undefined')
                    return Math.sqrt(this.x * this.x + this.y * this.y);
                this.normalize();
                this.x *= length;
                this.y *= length;
                return this;
            };
            Point.prototype.normalize = function () {
                var length = this.length();
                this.x /= length;
                this.y /= length;
                return this;
            };
            return Point;
        })();

        /*
         * Particle class
         */
        var Particle = (function () {
            function Particle() {
                this.position = new Point();
                this.velocity = new Point();
                this.acceleration = new Point();
                this.age = 0;
            }
            Particle.prototype.initialize = function (x, y, dx, dy) {
                this.position.x = x;
                this.position.y = y;
                this.velocity.x = dx;
                this.velocity.y = dy;
                this.acceleration.x = dx * settings.particles.effect;
                this.acceleration.y = dy * settings.particles.effect;
                this.age = 0;
            };
            Particle.prototype.update = function (deltaTime) {
                this.position.x += this.velocity.x * deltaTime;
                this.position.y += this.velocity.y * deltaTime;
                this.velocity.x += this.acceleration.x * deltaTime;
                this.velocity.y += this.acceleration.y * deltaTime;
                this.age += deltaTime;
            };
            Particle.prototype.draw = function (context, image) {
                function ease(t) {
                    return (--t) * t * t + 1;
                }
                var size = image.width * ease(this.age / settings.particles.duration);
                context.globalAlpha = 1 - this.age / settings.particles.duration;
                context.drawImage(image, this.position.x - size / 2, this.position.y - size / 2, size, size);
            };
            return Particle;
        })();

        /*
         * ParticlePool class
         */
        var ParticlePool = (function () {
            var particles,
                firstActive = 0,
                firstFree = 0,
                duration = settings.particles.duration;

            function ParticlePool(length) {
                particles = new Array(length);
                for (var i = 0; i < particles.length; i++)
                    particles[i] = new Particle();
            }
            ParticlePool.prototype.add = function (x, y, dx, dy) {
                particles[firstFree].initialize(x, y, dx, dy);
                firstFree++;
                if (firstFree == particles.length) firstFree = 0;
                if (firstActive == firstFree) firstActive++;
                if (firstActive == particles.length) firstActive = 0;
            };
            ParticlePool.prototype.update = function (deltaTime) {
                var i;
                if (firstActive < firstFree) {
                    for (i = firstActive; i < firstFree; i++)
                        particles[i].update(deltaTime);
                }
                if (firstFree < firstActive) {
                    for (i = firstActive; i < particles.length; i++)
                        particles[i].update(deltaTime);
                    for (i = 0; i < firstFree; i++)
                        particles[i].update(deltaTime);
                }
                while (particles[firstActive].age >= duration && firstActive != firstFree) {
                    firstActive++;
                    if (firstActive == particles.length) firstActive = 0;
                }
            };
            ParticlePool.prototype.draw = function (context, image) {
                if (firstActive < firstFree) {
                    for (i = firstActive; i < firstFree; i++)
                        particles[i].draw(context, image);
                }
                if (firstFree < firstActive) {
                    for (i = firstActive; i < particles.length; i++)
                        particles[i].draw(context, image);
                    for (i = 0; i < firstFree; i++)
                        particles[i].draw(context, image);
                }
            };
            return ParticlePool;
        })();

        /*
         * Putting it all together
         */
        (function (canvas) {
            var context = canvas.getContext('2d'),
                particles = new ParticlePool(settings.particles.length),
                particleRate = settings.particles.length / settings.particles.duration,
                time;

            function pointOnHeart(t) {
                return new Point(
                    160 * Math.pow(Math.sin(t), 3),
                    130 * Math.cos(t) - 50 * Math.cos(2 * t) - 20 * Math.cos(3 * t) - 10 * Math.cos(4 * t) + 25
                );
            }

            var image = (function () {
                var canvas = document.createElement('canvas'),
                    context = canvas.getContext('2d');
                canvas.width = settings.particles.size;
                canvas.height = settings.particles.size;
                function to(t) {
                    var point = pointOnHeart(t);
                    point.x = settings.particles.size / 3 + point.x * settings.particles.size / 550;
                    point.y = settings.particles.size / 3 - point.y * settings.particles.size / 550;
                    return point;
                }
                context.beginPath();
                var t = -Math.PI;
                var point = to(t);
                context.moveTo(point.x, point.y);
                while (t < Math.PI) {
                    t += 0.01;
                    point = to(t);
                    context.lineTo(point.x, point.y);
                }
                context.closePath();
                context.fillStyle = '#ea80b0';
                context.fill();
                var image = new Image();
                image.src = canvas.toDataURL();
                return image;
            })();

            function render() {
                requestAnimationFrame(render);
                var newTime = new Date().getTime() / 1000,
                    deltaTime = newTime - (time || newTime);
                time = newTime;
                context.clearRect(0, 0, canvas.width, canvas.height);
                var amount = particleRate * deltaTime;
                for (var i = 0; i < amount; i++) {
                    var pos = pointOnHeart(Math.PI - 2 * Math.PI * Math.random());
                    var dir = pos.clone().length(settings.particles.velocity);
                    particles.add(canvas.width / 2 + pos.x, canvas.height / 2 - pos.y, dir.x, -dir.y);
                }
                particles.update(deltaTime);
                particles.draw(context, image);
            }

            function onResize() {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
            }
            window.onresize = onResize;

            setTimeout(function () {
                onResize();
                render();
            }, 10);
        })(document.getElementById('pinkboard'));