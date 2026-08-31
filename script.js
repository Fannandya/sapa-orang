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

// Tambahkan event listener ke tombol
showMessageBtn.addEventListener('click', showPopup);

// Opsional: Tutup popup jika user mengklik di luar konten popup
window.onclick = function(event) {
    if (event.target == messagePopup) {
        messagePopup.style.display = "none";
    }
}