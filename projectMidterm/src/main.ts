const slider = document.getElementById("slider") as HTMLElement;
const container = document.getElementById("slider-container") as HTMLElement;
const dotsContainer = document.getElementById("dots") as HTMLElement;
const search_box = document.getElementById('search_box') as HTMLInputElement;
const clear_btn = document.getElementById('clear_btn') as HTMLButtonElement;
const slides = slider.children;
const totalSlides = slides.length;
let index = 0;
let autoplay:number;

function startAutoplay() {
  clearInterval(autoplay);
  autoplay = window.setInterval(() => {
    index = (index + 1) % totalSlides;
    showSlide(index);
  }, 5000);
}
// แสดงปุ่มกากบาทเมื่อมีข้อความ
search_box.addEventListener('input', () => {
  if (search_box.value.length > 0) {
    clear_btn.classList.remove('hidden');
  } else {
    clear_btn.classList.add('hidden');
  }
});

// ล้างข้อความเมื่อกดปุ่ม
clear_btn.addEventListener('click', (e) => {
  e.preventDefault();
  search_box.value = '';
  clear_btn.classList.add('hidden');
  search_box.focus();
});

// สร้าง dots ตามจำนวนสไลด์
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement("button");
  dot.className = "w-3 h-3 rounded-full bg-gray-400 hover:bg-yellow-400 transition";
  dot.addEventListener("click", () => {
    index = i;
    showSlide(index);
  });
  dotsContainer.appendChild(dot);
}
const dots = dotsContainer.children as HTMLCollectionOf<HTMLButtonElement>;

function showSlide(i: number) {
  const slideWidth = container.offsetWidth;
  slider.style.transform = `translateX(-${i * slideWidth}px)`;
  updateDots(i);
}

function updateDots(i: number) {
  for (let j = 0; j < dots.length; j++) {
    dots[j].className = "w-3 h-3 rounded-full transition " + 
      (j === i ? "bg-yellow-400" : "bg-gray-400 hover:bg-yellow-400");
  }
}

document.getElementById("next")!.addEventListener("click", () => {
  index = (index + 1) % totalSlides;
  showSlide(index);
  startAutoplay(); // รีเซ็ตเวลา
});

document.getElementById("prev")!.addEventListener("click", () => {
  index = (index - 1 + totalSlides) % totalSlides;
  showSlide(index);
  startAutoplay(); // รีเซ็ตเวลา
});


// auto play
setInterval(() => {
  index = (index + 1) % totalSlides;
  showSlide(index);
}, 5000);

// ปรับตำแหน่งเวลา resize
window.addEventListener("resize", () => showSlide(index));

// เริ่มต้น
showSlide(index);
// auto play
startAutoplay();
