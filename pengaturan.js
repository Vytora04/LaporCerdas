document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
    const cancelBtn = document.querySelector(".cancel-btn");
    const deleteBtn = document.querySelector(".delete-btn");
    const saveButton = document.querySelector(".save-btn");

    if (!form || !cancelBtn || !deleteBtn || !saveButton) {
        console.error("Salah satu elemen tidak ditemukan!");
        return;
    }

    const initialFormData = new FormData(form);
    const initialValues = {};
    
    for (let [key, value] of initialFormData.entries()) {
        initialValues[key] = value;
    }

    saveButton.addEventListener("click", function (event) {
        event.preventDefault(); 
        alert("Perubahan berhasil disimpan");
    });

    
    function cancelChanges() {
        if (confirm("Apakah Anda yakin ingin membatalkan perubahan?")) {
            for (let key in initialValues) {
                if (form.elements[key]) {
                    form.elements[key].value = initialValues[key];
                }
            }
        }
    }

 
    function deleteAccount() {
        if (confirm("Apakah Anda yakin ingin menghapus akun ini? Tindakan ini tidak dapat dibatalkan!")) {
            alert("Akun berhasil dihapus!");
            window.location.href = "index.html"; 
        }
    }

  
    cancelBtn.addEventListener("click", cancelChanges);

    deleteBtn.addEventListener("click", deleteAccount);
});
