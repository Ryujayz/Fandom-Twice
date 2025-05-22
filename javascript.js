// Smooth Scrolling Effect for Navigation Links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        window.scrollTo({
            top: targetSection.offsetTop - 50,
            behavior: 'smooth'
        });
    });
});

// Gallery Pop-up on Click
const galleryImages = document.querySelectorAll('.gallery-grid img');
const popupOverlay = document.createElement('div');
popupOverlay.className = 'popup-overlay';
popupOverlay.innerHTML = `
    <div class="popup-content">
        <span class="close-btn">&times;</span>
        <img class="popup-img" src="" alt="Gallery Image">
    </div>
`;
document.body.appendChild(popupOverlay);

galleryImages.forEach(img => {
    img.addEventListener('click', function() {
        document.querySelector('.popup-img').src = img.src;
        popupOverlay.style.display = 'flex';
    });
});

document.querySelector('.close-btn').addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});

// Buka modal saat member-card diklik
document.addEventListener('DOMContentLoaded', function () {
    const memberCards = document.querySelectorAll('.member-card');

    memberCards.forEach(card => {
        const img = card.querySelector('img');
        const memberName = img.alt.toLowerCase(); // alt-nya sesuai nama member
        const modalId = `${memberName}-modal`;
        const modal = document.getElementById(modalId);

        if (modal) {
            const closeBtn = modal.querySelector(".close");

            card.addEventListener('click', function () {
                modal.style.display = "block";
            });

            closeBtn.addEventListener('click', function () {
                modal.style.display = "none";
            });

            window.addEventListener('click', function (e) {
                if (e.target === modal) {
                    modal.style.display = "none";
                }
            });
        }
    });
});
