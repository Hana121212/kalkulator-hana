
//  Menunggu semua elemen HTML selesai dimuat sebelum menjalankan skrip.
document.addEventListener('DOMContentLoaded', function() {
    
    //  Mendapatkan elemen HTML (layar input, gambar status, dan semua tombol kalkulator) berdasarkan ID atau kelas.
    const display = document.getElementById('display');
    const statusImage = document.getElementById('statusImage');
    const buttons = document.querySelectorAll('.btn-calc');

    //  Mendefinisikan URL gambar untuk tiga status kalkulator: normal, sukses, dan error.
    const imgNormal = 'https://placehold.co/400x100/374151/E5E7EB?text=Kalkulator';
    const imgSuccess = 'https://placehold.co/400x100/16A34A/FFFFFF?text=Sukses!';
    const imgError = 'https://placehold.co/400x100/DC2626/FFFFFF?text=Error!';

    /**
      Fungsi untuk mengganti sumber (*src*) gambar status (statusImage) menjadi gambar normal, sukses, atau error sesuai kondisi.
     */
    function changeImage(state) {
        if (state === 'success') {
            statusImage.src = imgSuccess;
            statusImage.alt = "Perhitungan Sukses";
        } else if (state === 'error') {
            statusImage.src = imgError;
            statusImage.alt = "Error Perhitungan";
        } else {
            //  Mengatur ulang gambar status ke mode normal.
            statusImage.src = imgNormal;
            statusImage.alt = "Status Kalkulator";
        }
    }

    /**
     Fungsi untuk mengosongkan layar (*display*) input dan mengatur ulang gambar status kembali normal.
     */
    function clearDisplay() {
        display.value = '';
        changeImage('normal'); // Memanggil function untuk merubah gambar
    }

    /**
      Fungsi untuk menghapus karakter terakhir dari nilai yang ada di layar input.
     */
    function deleteLastChar() {
        display.value = display.value.slice(0, -1);
    }

    /**
     Fungsi untuk menambahkan nilai (*value*) baru (angka atau operator) ke layar input.
     */
    function appendToDisplay(value) {
        display.value += value;
    }

    /**
      Fungsi utama untuk mengevaluasi ekspresi matematika di layar dan menampilkan hasilnya.
     */
    function calculateResult() {
        //  Memeriksa jika layar kosong, lalu menampilkan 'Kosong!' dan status error.
        if (display.value === '') {
            changeImage('error');
            display.value = 'Kosong!';
            //  Menghapus layar setelah 1.5 detik setelah pesan error ditampilkan.
            setTimeout(clearDisplay, 1500);
            return;
        }

        try {
            //  Menggunakan eval() untuk menghitung ekspresi matematika, sekaligus mengganti simbol '%' dengan '/100' untuk perhitungan persentase.
            let result = eval(display.value
                .replace(/%/g, '/100') //  Mengganti semua simbol persentase (%) menjadi operasi bagi 100 sebelum dihitung.
            ); 
            
            //  Memastikan hasil perhitungan adalah angka yang valid (bukan tak terbatas atau NaN).
            if (isFinite(result)) {
                display.value = result;
                changeImage('success'); //  Mengganti gambar status menjadi 'Sukses' setelah perhitungan berhasil.
            } else {
                throw new Error("Hasil tidak valid");
            }

        } catch (error) {
            console.error("Error kalkulasi:", error);
            display.value = 'Error';
            changeImage('error'); //  Mengganti gambar status menjadi 'Error' jika terjadi kesalahan dalam perhitungan.
            setTimeout(clearDisplay, 1500);
        }
    }


    //  Iterasi melalui setiap tombol kalkulator dan menambahkan pendengar (*listener*) event klik.
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.getAttribute('data-value');

            //  Memeriksa nilai tombol yang diklik untuk menentukan operasi yang akan dilakukan.
            switch(value) {
                case 'C':
                    //  Memanggil fungsi untuk membersihkan layar dan mengatur ulang status.
                    clearDisplay();
                    break;
                case 'DEL':
                    //  Memanggil fungsi untuk menghapus karakter terakhir.
                    deleteLastChar();
                    break;
                case '=':
                    //  Memanggil fungsi untuk menghitung hasil.
                    calculateResult();
                    break;
                default:
                    //  Logika untuk menambahkan input ke layar. Jika statusnya Sukses atau Error, layar dibersihkan terlebih dahulu.
                    if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                        clearDisplay();
                    }
                    appendToDisplay(value);
                    break;
            }
        });
    });

    //  Menambahkan pendengar (*listener*) untuk input keyboard, memungkinkan pengguna mengetik angka, operator, Enter, Backspace, dan Escape untuk berinteraksi dengan kalkulator.
    document.addEventListener('keydown', (e) => {
        const key = e.key;

        if (key >= '0' && key <= '9' || key === '.' || key === '+' || key === '-' || key === '*' || key === '/' || key === '%') {
            if (statusImage.src === imgSuccess || statusImage.src === imgError) {
                clearDisplay();
            }
            appendToDisplay(key);
            e.preventDefault();
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
            e.preventDefault();
        } else if (key === 'Backspace') {
            deleteLastChar();
            e.preventDefault();
        } else if (key === 'Escape' || key.toLowerCase() === 'c') {
            clearDisplay();
            e.preventDefault();
        }
    });

});
