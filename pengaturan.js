document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const cancelBtn = document.querySelector(".cancel-btn");
    const deleteBtn = document.querySelector(".delete-btn");
    const saveButton = document.querySelector(".save-btn");

    if (!form || !cancelBtn || !deleteBtn || !saveButton) {
        console.error("Salah satu elemen tidak ditemukan!");
        return;
    }

    // Simpan data awal form untuk pembatalan
    const initialFormData = new FormData(form);
    const initialValues = {};
    
    // Simpan nilai awal dari input dan textarea
    for (let [key, value] of initialFormData.entries()) {
        initialValues[key] = value;
    }

    // Tambahkan event listener untuk tombol Simpan Perubahan
    saveButton.addEventListener("click", function (event) {
        event.preventDefault(); // Mencegah form terkirim
        alert("Perubahan berhasil disimpan");
    });

    // Fungsi untuk membatalkan perubahan
    function cancelChanges() {
        if (confirm("Apakah Anda yakin ingin membatalkan perubahan?")) {
            for (let key in initialValues) {
                if (form.elements[key]) {
                    form.elements[key].value = initialValues[key];
                }
            }
        }
    }

    // Fungsi untuk konfirmasi penghapusan akun
    function deleteAccount() {
        if (confirm("Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan!")) {
            alert("Akun berhasil dihapus!");
            window.location.href = "index.html"; // Redirect ke halaman utama
        }
    }

    // Event listener untuk tombol Batalkan
    cancelBtn.addEventListener("click", cancelChanges);

    // Event listener untuk tombol Hapus Akun
    deleteBtn.addEventListener("click", deleteAccount);
});
