// Dapatkan elemen tombol dan popup
const showMessageBtn = document.getElementById('showMessageBtn');
const messagePopup = document.getElementById('messagePopup');

// Fungsi untuk menampilkan popup
function showPopup() {
    messagePopup.style.display = 'flex'; // Gunakan flex untuk centering
}

// Fungsi untuk menutup popup
function closePopup() {
    messagePopup.style.display = 'none';
}

// Tambahkan event listener ke tombol popup
showMessageBtn.addEventListener('click', showPopup);

// Opsional: Tutup popup jika user mengklik di luar konten popup
window.onclick = function(event) {
    if (event.target == messagePopup) {
        messagePopup.style.display = "none";
    }
}

// FAQ Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling; // Elemen setelah tombol pertanyaan adalah jawaban
            question.classList.toggle('active'); // Tambah/hapus class 'active' untuk mengubah ikon '+'/'−'

            if (answer.style.maxHeight) {
                // Jika sudah terbuka, tutup
                answer.style.maxHeight = null;
                answer.style.paddingBottom = null; // Hapus padding bottom saat ditutup
            } else {
                // Jika tertutup, buka
                // Set maxHeight ke tinggi konten sebenarnya untuk animasi yang mulus
                // Jika kontennya dinamis, perhitungan ini mungkin perlu disesuaikan
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.paddingBottom = "15px"; // Tambahkan padding saat terbuka
            }
        });
    });
});