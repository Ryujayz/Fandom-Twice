// ========== SMOOTH SCROLL ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

// ========== MODAL BIODATA MEMBER ==========
const members = {
  nayeon: { name: "Im Na yeon (임나연)", img: "Nayeon.jpg", bio: "Tanggal Lahir : 22 September 1995, Nama Panggung : Nayeon (나연), Kebangsaan : Korea, Golongan Darah : A" },
  jeongyeon: { name: "Yoo Jeong Yeon (유정연)", img: "Jeongyeon.jpg", bio: "Tanggal Lahir : 1 November 1996, Nama Panggung : Jeongyeon (정연), Kebangsaan : Korea, Golongan Darah : O" },
  momo: { name: "Hirai Momo (平井 もも)", img: "Momo.jpg", bio: "Tanggal Lahir : 9 November 1996, Nama Panggung : Momo (모모), Kebangsaan : Jepang, Golongan Darah : A" },
  sana: { name: "Minatozaki Sana (湊崎 紗夏)", img: "Sana.jpg", bio: "Tanggal Lahir : 29 Desember 1996, Nama Panggung : Sana (사나), Kebangsaan : Jepang, Golongan Darah : B" },
  jihyo: { name: "Park Ji Hyo (박지효)", img: "Jihyo.jpg", bio: "Tanggal Lahir : 1 Februari 1997, Nama Panggung : Jihyo (지효), Kebangsaan : Korea, Golongan Darah : O" },
  mina: { name: "Myoui Mina (名井 南)", img: "Mina.jpg", bio: "Tanggal Lahir : 24 Maret 1997, Nama Panggung : Mina (미나), Kebangsaan : Jepang-Amerika, Golongan Darah : A" },
  dahyun: { name: "Kim Da Hyun (김다현)", img: "Dahyun.jpg", bio: "Tanggal Lahir : 28 Mei 1998, Nama Panggung : Dahyun (다현), Kebangsaan : Korea, Golongan Darah : O" },
  chaeyoung: { name: "Son Chae Young (손채영)", img: "Chaeyoung.jpg", bio: "Tanggal Lahir : 23 April 1999, Nama Panggung : Chaeyoung (채영), Kebangsaan : Korea, Golongan Darah : B" },
  tzuyu: { name: "Chou Tzuyu (周子瑜)", img: "Tzuyu.jpg", bio: "Tanggal Lahir : 14 Juni 1999, Nama Panggung : Tzuyu (쯔위), Kebangsaan : Taiwan, Golongan Darah : A, Nama Korea : Chou Tzu Yu ( 저우쯔위 / 주자유 )" }
};

const modal = document.getElementById("memberModal");
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalBio = document.getElementById("modalBio");
const closeBtn = document.querySelector(".close");

function openModal(memberKey) {
  const member = members[memberKey];
  if (member) {
    modal.style.display = "flex";
    modalImg.src = member.img;
    modalName.textContent = member.name;

    modalBio.innerHTML = "";
    member.bio.split(", ").forEach(info => {
      const li = document.createElement("li");
      li.textContent = info;
      modalBio.appendChild(li);
    });
  }
}

closeBtn.onclick = () => modal.style.display = "none";
window.onclick = e => { if (e.target == modal) modal.style.display = "none"; };

// ========== SEARCH BAR ==========
const searchToggle = document.getElementById("searchToggle");
const searchBar = document.getElementById("searchBar");
const clearBtn = document.querySelector(".clear-btn");

// Munculkan tombol X kalau ada input
searchBar.addEventListener("input", () => {
  clearBtn.style.display = searchBar.value.trim() !== "" ? "block" : "none";
});

// Klik tombol X → kosongkan input + reset
clearBtn.addEventListener("click", () => {
  searchBar.value = "";
  clearBtn.style.display = "none";
  resetSearch();
});

// Toggle search bar
searchToggle.addEventListener("click", () => {
  searchBar.classList.toggle("active");
  searchBar.focus();
});

// Highlight teks
function highlightText(element, query) {
  if (!query) {
    element.innerHTML = element.textContent;
    element.classList.remove("fade-in");
    return;
  }
  const regex = new RegExp(`(${query})`, "gi");
  element.innerHTML = element.textContent.replace(regex, `<span class="highlight">$1</span>`);
  element.classList.add("fade-in");
}

// Filter hasil search
searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase();

  document.querySelectorAll(".member-card").forEach(card => {
    const nameElement = card.querySelector("h3");
    const name = nameElement.innerText.toLowerCase();
    card.style.display = name.includes(query) ? "block" : "none";
    highlightText(nameElement, name.includes(query) ? query : "");
  });

  document.querySelectorAll(".album-card").forEach(card => {
    const titleElement = card.querySelector("p");
    const title = titleElement.innerText.toLowerCase();
    card.style.display = title.includes(query) ? "block" : "none";
    highlightText(titleElement, title.includes(query) ? query : "");
  });
});

// ENTER → BUKA MODAL
searchBar.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const query = searchBar.value.toLowerCase().trim();

    // CARI MEMBER
    for (const key in members) {
      if (members[key].name.toLowerCase().includes(query)) {
        openModal(key);
        showToast(`Menampilkan profil ${members[key].name}`, "success");
        return;
      }
    }

    // CARI ALBUM
    for (const year in albums) {
      if (
        albums[year].title.toLowerCase().includes(query) ||
        year.toString().includes(query)
      ) {
        openAlbum(year);
        showToast(`Menampilkan album ${albums[year].title}`, "success");
        return;
      }
    }

    // JIKA TIDAK ADA HASIL
    showToast("Member atau album tidak ditemukan!", "error");
  }
});

// Reset search
function resetSearch() {
  document.querySelectorAll(".member-card").forEach(card => {
    card.style.display = "block";
    highlightText(card.querySelector("h3"), "");
  });
  document.querySelectorAll(".album-card").forEach(card => {
    card.style.display = "block";
    highlightText(card.querySelector("p"), "");
  });
}

// ========== AUTOCOMPLETE ==========
const suggestionsBox = document.createElement("div");
suggestionsBox.id = "suggestions";
suggestionsBox.classList.add("suggestions");
searchBar.parentNode.appendChild(suggestionsBox);

searchBar.addEventListener("input", () => {
  const query = searchBar.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  if (!query) {
    suggestionsBox.style.display = "none";
    return;
  }

  const results = [];

  for (const key in members) {
    if (members[key].name.toLowerCase().includes(query)) {
      results.push({ type: "member", key, name: members[key].name });
    }
  }

  for (const year in albums) {
    if (albums[year].title.toLowerCase().includes(query) || year.includes(query)) {
      results.push({ type: "album", year, name: albums[year].title });
    }
  }

  if (results.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  results.forEach(item => {
    const div = document.createElement("div");
    div.textContent = item.type === "member" ? `👤 ${item.name}` : `💿 ${item.name}`;
    div.addEventListener("click", () => {
      if (item.type === "member") openModal(item.key);
      else openAlbum(item.year);
      searchBar.value = "";
      suggestionsBox.style.display = "none";
    });
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
});

// ========== HEADER HIDE ON SCROLL ==========
let lastScrollTop = 0;
const header = document.querySelector("header");
const logo = document.querySelector(".logo img");

window.addEventListener("scroll", () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop) {
    header.classList.add("header-hidden");
  } else {
    header.classList.remove("header-hidden");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

logo.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ========== HAMBURGER ==========
const menuToggle = document.getElementById("menu-toggle");
const navUl = document.querySelector("nav ul");

menuToggle.addEventListener("click", () => {
  navUl.classList.toggle("show");
});

// ========== DATA ALBUM ==========
const albums = {
  2015: { img: "the story begins.jpg", title: "The Story Begins (2015)", desc: "Debut mini album TWICE dengan lagu utama 'Like OOH-AHH'.", tracks: ["• Like OOH-AHH", "• Do It Again", "• Going Crazy", "• Truth", "• Candy Boy", "• Like a Fool"] },
  2016: { img: "page two.jfif", title: "Page Two (2016)", desc: "Mini album kedua dengan hits 'Cheer Up'.", tracks: ["• Cheer Up", "• Precious Love", "• Touchdown", "• Tuk Tok", "• Woohoo", "• My Headphones On"] },
  2017: { img: "twicetagram.jfif", title: "Twicetagram (2017)", desc: "Full album pertama dengan title track 'Likey'.", tracks: ["• Likey", "• Turtle", "• Missing U", "• Wow", "• FFW", "• Ding Dong", "• 24/7", "• Look at Me", "• Rollin'", "• Love Line"] },
  2018: { img: "what is love.jfif", title: "What is Love? (2018)", desc: "Mini album dengan lagu ikonik 'What is Love?'.", tracks: ["• What is Love?", "• Sweet Talker", "• Ho!", "• Déjà Vu", "• Say Yes", "• Stuck"] },
  2019: { img: "feel special album.jpg", title: "Feel Special (2019)", desc: "Mini album ketujuh dengan title track 'Feel Special'.", tracks: ["• Feel Special", "• Rainbow", "• Get Loud", "• Trick It", "• Love Foolish", "• 21:29"] },
  2020: { img: "Eyes Wide Open.png", title: "Eyes Wide Open (2020)", desc: "Album penuh kedua TWICE dengan konsep retro.", tracks: ["• I Can't Stop Me", "• Hell In Heaven", "• Up No More", "• Do What We Like", "• Bring It Back", "• Shot Clock"] },
  2021: { img: "formula of love.jpg", title: "Formula of Love (2021)", desc: "Album penuh ketiga dengan berbagai unit song.", tracks: ["• Scientist", "• Moonlight", "• Icon", "• Cruel", "• Real You", "• F.I.L.A", "• Candy"] },
  2022: { img: "Between 1&2.png", title: "Between 1&2 (2022)", desc: "Mini album ke-11 dengan title track 'Talk That Talk'.", tracks: ["• Talk That Talk", "• Queen of Hearts", "• Basics", "• Trouble", "• Brave", "• Gone", "• When We Were Kids"] },
  2023: { img: "ready to be.jfif", title: "Ready to Be (2023)", desc: "Mini album ke-12 dengan lagu utama 'Set Me Free'.", tracks: ["• Set Me Free", "• Moonlight Sunrise", "• Got the Thrills", "• Blame It On Me", "• Wallflower", "• Crazy Stupid Love"] },
  2024: { img: "WithYOU-th.png", title: "With YOU-th (2024)", desc: "Mini album ke-13 TWICE dengan vibes fresh dan youthful.", tracks: ["• One Spark", "• I Got You", "• Rush", "• New New", "• Bloom"] },
  2025: { img: "This Is For.jpg", title: "This Is For (2025)", desc: "Album ini debut di nomor satu di Tangga Album Circle Korea Selatan dan nomor enam di Billboard 200 AS.", tracks: ["• Four", "• This Is For", "• Options", "• Mars", "• Right Hand Girl", "• Peach Gelato", "• Hi Hello", "• Battitude (Nayeon, Jeongyeon, Momo, Mina)", "• Dat Ahh Dat Ooh (Sana, Jihyo, Dahyun, Chaeyoung, Tzuyu)", "• Let Love Go (Jeongyeon, Momo, Sana, Tzuyu)", "• G.O.A.T. (Mina, Dahyun, Chaeyoung)", "• Talk (Nayeon, Jihyo)", "• Seesaw", "• Heartbreak Avenue"] }
};

// ========== FILTER & SORT ALBUM ==========
const albumContainer = document.querySelector(".albums-grid");
const filterYear = document.getElementById("filterYear");
const sortOrder = document.getElementById("sortOrder");

// Fungsi render album ke halaman
function renderAlbums(albumData, order = "desc") {
  albumContainer.innerHTML = ""; // kosongkan kontainer dulu

  // Ambil semua key album (tahun)
  let albumKeys = Object.keys(albumData);

  // Urutkan berdasarkan dropdown
  albumKeys.sort((a, b) => (order === "asc" ? a - b : b - a));

  // Loop album berdasarkan urutan terpilih
  albumKeys.forEach((year, index) => {
    const album = albumData[year];
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card", "fade-in-album");
    albumCard.style.animationDelay = `${index * 0.1}s`; // biar muncul satu-satu

    albumCard.innerHTML = `
      <img src="${album.img}" alt="${album.title}">
      <p>${album.title}</p>
    `;
    albumCard.addEventListener("click", () => openAlbum(year));
    albumContainer.appendChild(albumCard);
  });
}

// Event: Filter Tahun
filterYear.addEventListener("change", updateAlbumList);
sortOrder.addEventListener("change", updateAlbumList);

// Fungsi gabungan update tampilan album
function updateAlbumList() {
  const selectedYear = filterYear.value;
  const order = sortOrder.value;
  let filteredAlbums = { ...albums };

  // Jika user pilih tahun tertentu
  if (selectedYear !== "all") {
    filteredAlbums = { [selectedYear]: albums[selectedYear] };
  }

  // Render ulang album berdasarkan filter & urutan
  renderAlbums(filteredAlbums, order);
}

// Render pertama kali (default terbaru ke lama)
updateAlbumList();

// ========== MODAL ALBUM ==========
const albumModal = document.getElementById("albumModal");
const albumImg = document.getElementById("albumImg");
const albumTitle = document.getElementById("albumTitle");
const albumDesc = document.getElementById("albumDesc");
const albumTracks = document.getElementById("albumTracks");
const albumClose = document.querySelector(".album-close");

function openAlbum(year) {
  const album = albums[year];
  albumImg.src = album.img;
  albumTitle.textContent = album.title;
  albumDesc.textContent = album.desc;

  albumTracks.innerHTML = "";
  album.tracks.forEach(track => {
    const li = document.createElement("li");
    li.textContent = track;
    albumTracks.appendChild(li);
  });

  albumModal.style.display = "block";
}

albumClose.onclick = () => albumModal.style.display = "none";
window.addEventListener("click", e => { if (e.target == albumModal) albumModal.style.display = "none"; });

// ========== MODAL GALLERY ==========
const galleryModal = document.getElementById("galleryModal");
const galleryModalImg = document.getElementById("galleryModalImg");
const galleryClose = document.querySelector(".gallery-close");

document.querySelectorAll(".gallery-grid img").forEach(img => {
  img.addEventListener("click", () => {
    galleryModal.style.display = "flex";
    galleryModalImg.src = img.src;
  });
});

galleryClose.onclick = () => galleryModal.style.display = "none";
galleryModal.addEventListener("click", e => { if (e.target === galleryModal) galleryModal.style.display = "none"; });

// ========== NOTIF AUDIO ==========
const searchSound = new Audio("Ping.mp3");

document.getElementById("searchToggle").addEventListener("click", () => {
  searchSound.currentTime = 0;
  searchSound.play();
});

document.getElementById("searchBar").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchSound.currentTime = 0;
    searchSound.play();
  }
});

// ======== TOAST NOTIFICATION ========
function showToast(message, type = "info", duration = 3000) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = `show ${type}`;

  // hilang perlahan
  setTimeout(() => {
    toast.classList.add("hide");
    setTimeout(() => toast.className = toast.className.replace("show hide", ""), 400);
  }, duration);
}
