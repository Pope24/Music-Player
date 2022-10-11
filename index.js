const cd = document.querySelector('.cd');
const cdWidth= cd.offsetWidth;
const nameSong = document.querySelector('header h2');
const cd_thumb = document.querySelector('.cd-thumb');
const audio = document.querySelector('#audio');
const playBtn = document.querySelector('.btn-toggle-play');
const player = document.querySelector('.player');
const isPlaying = true;
const isRandom = false;
const isRepeat = false;
const progress = document.querySelector('#progress');
const nextBtn = document.querySelector('.btn-next');
const prevBtn = document.querySelector('.btn-prev');
const randomBtn = document.querySelector('.btn-random');
const repeatBtn = document.querySelector('.btn-repeat');
const songBtn = document.querySelectorAll('.song');
const playList = document.querySelector('.playlist');
var app = {
    currentIndex: 0,
    songs: [
        {
          name: "Bước qua mùa cô đơn",
          singer: "Vũ",
          path: "./music/BuocQuaMuaCoDon-Vu.mp3",
          image: "https://event.mediacdn.vn/2020/11/30/vu-p-16067234297342144615946.png"
        },
        {
          name: "Bước qua nhau",
          singer: "Vũ",
          path: "./music/Buoc Qua Nhau - Vu.mp3",
          image:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Vu_monsoon2019.jpg/1200px-Vu_monsoon2019.jpg"
        },
        {
          name: "Ước mơ của mẹ",
          singer: "Quân AP",
          path: "./music/Uoc Mo Cua Me - Quan A_P.mp3",
          image: "https://event.mediacdn.vn/2020/9/8/quan-ap-1-1599551997967780850368.png"
        },
        {
          name: "Ba kể con nghe",
          singer: "Dương Trần Nghĩa",
          path: "./music/Ba Ke Con Nghe - Duong Tran Nghia.mp3",
          image:
            "https://photo-baomoi.bmcdn.me/w720x480/2018_12_07_106_28893180/5384691f715c9802c14d.jpg"
        },
        {
          name: "Khoan Thai",
          singer: "Khai Dang",
          path: "./music/Khoan Thai - Khai Dang.mp3",
          image:
            "https://trixie.com.vn/media/images/article/95476823/ava-1609824170888218790105.jpg"
        },
        {
          name: "Sài Gòn Yếu Đuối",
          singer: "Lofi_Chill",
          path:
            "./music/Sai Gon Yeu Duoi Biet Dua Vao Ai Lofi Ve.mp3",
          image:
            "https://static.tuoitre.vn/tto/i/s626/2015/04/25/Wz7PF0Ll.jpg"
        },
        {
          name: "Khi phải quên đi",
          singer: "Phan Mạnh Quỳnh",
          path: "./music/Khi Phai Quen Di - Phan Manh Quynh.mp3",
          image:
            "https://image.thanhnien.vn/w1024/Uploaded/2022/mftum/2022_06_07/phan-manh-quynh-5-4064.jpeg"
        },
        {
            name: "Mơ Hồ",
            singer: "Hà Anh Tuấn",
            path: "./music/Mo Ho - Bui Anh Tuan.mp3",
            image:
              "https://nld.mediacdn.vn/2018/7/8/hat-6-15310139568281582745769.jpg"
          },
          {
            name: "Cảm ơn và xin lỗi",
            singer: "Chillies",
            path: "./music/Cam On Va Xin Loi Thua Me Con Di OST_ -.mp3",
            image:
              "./music/unnamed.jpg"
          }
      ],

    //   Define properties for object
      defineProperties: function() {
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
      },


    //   Render song
      render:async function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
        playList.innerHTML = htmls.join('\n');
      },


    //   Handle event scroll
      handleEvent: function() {
        const _this = this;
        // Xu ly hinh anh quay 360 do
        const cdAnimate = cd_thumb.animate([
            {
                transform: 'rotate(360deg)',
            }
        ], {
            duration: 100000,
            iterations: Infinity,
        })
        cdAnimate.pause();

        // Xu ly scroll list bai hat
        document.onscroll = function() {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth/cdWidth;
        }

        // Xu ly repeat bai hat
        repeatBtn.onclick =function() {
          _this.isRepeat = !_this.isRepeat;
          this.classList.toggle('active',_this.isRepeat);
        }
        // Xu ly play/pause
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                _this.isPlaying = false;
                player.classList.remove('playing');
                audio.pause();
                cdAnimate.pause()
            }
            else {
                _this.isPlaying = true;
                player.classList.add('playing');
                audio.play();
                cdAnimate.play()
            }
        // Xu ly thanh thoi gian chay audio
        audio.ontimeupdate = function() {
            const progressCurrent = audio.currentTime / audio.duration * 100;
            progress.value = progressCurrent;
            }
        }

        // Tua nhanh audio 
        progress.onchange = function(e) {
            const progressChanged = e.target.value /100 * audio.duration;
            audio.currentTime = progressChanged;
        }

        // Click chuyen bai hat tiep theo
        nextBtn.onclick = function() {
            if (_this.isRandom) {
              _this.randomSong();
            }
            else {
              _this.nextSong()
            }
            player.classList.add('playing');
            audio.play();
            _this.render();
            _this.scrollToSong()
        }

        // Click lui xuong bai truoc
        prevBtn.onclick = function() {
            if(_this.isRandom) {
              _this.randomSong();
            }
            else {
              _this.prevSong();
            }
            player.classList.add('playing');
            audio.play();
            _this.render();
            _this.scrollToSong()
        }

        // Click random list bai hat
        randomBtn.onclick = function() {
          _this.isRandom = !_this.isRandom;
          randomBtn.classList.toggle('active', _this.isRandom);
        }
        // Tu dong chuyen bai neu da chay xong bai hat hien tai
        audio.onended = function() {
          if (_this.isRepeat) {
            audio.play();
          }
          else {
            nextBtn.click();
        }
      }
        // Click bai hat nao thi toi bai hat do
        playList.onclick = function(e) {
          const nodeList = e.target.closest('.song:not(.active)')
          if (nodeList || e.target.closest('.option')) {
            if (nodeList) {
              _this.currentIndex = Number(nodeList.dataset.index);
              player.classList.add('playing');
              _this.loadCurrentSong();
              _this.render();
              audio.play();
            }
          }
        }
    },
    //   Load ra thong tin, ten, url bai hat
      loadCurrentSong: function() {
        nameSong.textContent = this.currentSong.name;
        cd_thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
      },

        // Bai hat tiep theo
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
                this.currentIndex = this.songs.length-1;
            }
            this.loadCurrentSong();
            audio.currentTime = 0;
            audio.play();
       }, 
       randomSong: function() {
        let newIndex;
        do {
          newIndex = Math.floor(Math.random()*this.songs.length);
        } while(newIndex == this.currentSong)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
       },
       scrollToSong: function() {
        setTimeout(() => {
          document.querySelector('.song.active').scrollIntoView({
             behavior: 'smooth',
             block: 'center',
            })
        }, 200)
       },

      start: function() {
        // Dinh nghia cac thuoc tinh Obj
        this.defineProperties();

        // In ra list song
        this.render();

        // Lang nghe xu ly su kien
        this.handleEvent();

        // Load bai hat hien tai len man hinh
        this.loadCurrentSong()

        // Click nut chuyen bai hat tiep theo
        this.nextSong();
      }
}
app.start();
