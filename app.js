const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playlist = $('.playlist');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const ramdomBtn = $('.btn-ramdom');
const repeatBtn = $('.btn-repeat');
// console.log(ramdomBtn);
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamDom: false,
    isRepeat: false,
    songs: [{
            name: 'Ánh Nắng Của Anh',
            singer: 'Đức Phúc',
            path: './music/Anh-Nang-Cua-Anh-Cho-Em-Den-Ngay-Mai-OST-Duc-Phuc.mp3',
            image: './image/anh-nang-cua-anh.png'
        },
        {
            name: 'Cùng Anh',
            singer: 'Ngọc Dolil',
            path: './music/Cung-Anh-Ngoc-Dolil-Hagii-STee.mp3',
            image: './image/cung-anh.png'
        },
        {
            name: 'Đếm Ngày Xa Em',
            singer: 'Lou Hoàng',
            path: './music/Dem-Ngay-Xa-Em-OnlyC-Lou-Hoang.mp3',
            image: './image/dem-ngay-xa-em.png'
        },
        {
            name: 'Điều Anh Biết',
            singer: 'Chi Dân',
            path: './music/Dieu-Anh-Biet-Chi-Dan.mp3',
            image: './image/dieu-anh-biet.png'
        },
        {
            name: 'Giúp Anh Trả Lời Những Câu Hỏi',
            singer: 'Vương Anh Tú',
            path: './music/Giup-Anh-Tra-Loi-Nhung-Cau-Hoi-Vuong-Anh-Tu.mp3',
            image: './image/giup-anh-tra-loi-n-cau-hoi.png'
        },
        {
            name: 'Người Ấy',
            singer: 'Trịnh Thăng Bình',
            path: './music/Nguoi-Ay-Trinh-Thang-Binh.mp3',
            image: './image/nguoi-ay.png'
        },
        {
            name: 'Spectre',
            singer: 'Alan Walker',
            path: './music/Spectre-Alan-Walker.mp3',
            image: './image/alan-walker.png'
        }
    ],
    render: function() {
        const html = this.songs.map(function(song, index) {
            return `
        <div class="song ${index === app.currentIndex ?'active' :''}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>`
        })
        playlist.innerHTML = html.join('');
    },
    handleEvent: function() {
        const _this = this;
        const cd = $('.cd');
        const cdWidth = cd.offsetWidth;
        //xuli cd quay dung
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            iterations: Infinity,
        })
        cdThumbAnimate.pause();
        //xuli phong to thu nho
        document.onscroll = function() {
                const scrollTop = document.documentElement.scrollTop || window.scrollY;
                const newWidth = cdWidth - scrollTop;
                cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
                cd.style.opacity = newWidth / cdWidth;
            }
            // xuli khi click play
        playBtn.onclick = function() {
                if (_this.isPlaying) {
                    audio.pause();
                } else {
                    audio.play();
                }
            }
            // khi song duoc play
        audio.onplay = function() {
                player.classList.add('playing');
                _this.isPlaying = true;
                cdThumbAnimate.play();

            }
            // khi song duoc pause
        audio.onpause = function() {
                player.classList.remove('playing');
                _this.isPlaying = false;
                cdThumbAnimate.pause();

            }
            //tien do bai hat thay doi
        audio.ontimeupdate = function() {
                if (audio.duration) {
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                    progress.value = progressPercent;
                }
            }
            //xu li khi tua song 
        progress.onchange = function(e) {
            // console.log(e.target.value)
            const progressPercent = Math.floor(e.target.value / 100 * audio.duration)
            audio.currentTime = progressPercent;

        }
        nextBtn.onclick = function() {
            if (_this.isRamDom) {
                _this.playRamdom();
            } else {
                _this.nextSong();
            }
            _this.render();
            audio.play();
            _this.scrollTopActive();

        }
        prevBtn.onclick = function() {
            if (_this.isRamDom) {
                _this.playRamdom();
            } else {
                _this.prevSong();
            }
            _this.render();
            audio.play();
            _this.scrollTopActive();

        }
        ramdomBtn.onclick = function(e) {
                //Cach 1
                // if (_this.isRamDom) {
                //     ramdomBtn.classList.remove('active');
                //     _this.isRamDom = false;
                // } else {
                //     ramdomBtn.classList.add('active');
                //     _this.isRamDom = true;
                // }
                //Cach 2
                _this.isRamDom = !_this.isRamDom;
                ramdomBtn.classList.toggle('active');
                if (_this.isRamDom) {
                    _this.playRamdom();
                    _this.render();
                    audio.play();
                    _this.scrollTopActive();

                }
            }
            //xuli khi audio ended
        audio.onended = function() {
                if (_this.isRepeat) {
                    _this.loadCurrentSong();
                } else {
                    if (_this.isRamDom) {
                        _this.playRamdom();
                    } else {
                        _this.nextSong();
                    }
                }
                _this.scrollTopActive();
                _this.render();
                audio.play();
            }
            //lap lai 1 bai hat
        repeatBtn.onclick = function() {
                _this.isRepeat = !_this.isRepeat;
                repeatBtn.classList.toggle('active');
            }
            //
        playlist.onclick = function(e) {
            if (e.target.closest('.song:not(.active)') && !e.target.closest('.option')) {

            }
        }
    },
    defineProperties: function() { //
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    loadCurrentSong: function() {
        console.log(this.currentIndex);
        console.log(this.currentSong)
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    playRamdom: function() {
        do {
            var currentIndexRandom = Math.floor(Math.random() * this.songs.length);
        } while (this.currentIndex == currentIndexRandom);
        this.currentIndex = currentIndexRandom;
        this.loadCurrentSong();
    },
    scrollTopActive() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 500)
    },
    start: function() {
        //Dinh Nghia Thuoc Tinh Cho Object
        this.defineProperties();
        // Lang Nghe Xu Li Su Kien
        this.handleEvent();
        //Tai Thong Tin Bai Hat Dau Tien UI khi chay ung dung
        this.loadCurrentSong();
        // Render List
        this.render();
    }
}
app.start();