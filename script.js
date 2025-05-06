document.addEventListener('DOMContentLoaded', function () {

    // URL language param
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get("lang") === "ar" ? "ar" : "en";

    const htmlTag = document.getElementById("htmlTag");
    const body = document.body;

    if (lang === "ar") {
        htmlTag.setAttribute("lang", "ar");
        htmlTag.setAttribute("dir", "rtl");
        body.classList.add("rtl");
    } else {
        htmlTag.setAttribute("lang", "en");
        htmlTag.setAttribute("dir", "ltr");
        body.classList.remove("rtl");
    }

    // Translations
    const translations = {
        en: {
            welcome: "Welcome to the Spinning Wheel Game!",
            formText: "Please enter your information to continue:",
            nameLabel: "Name",
            emailLabel: "Email",
            phoneLabel: "Phone Number",
            submitBtn: "Start Play",
            gameTitle: "Spinning Color Wheel",
            spinBtn: "SPIN",
            winnerText: "Congratulations! You Won! 🎉",
            winnerColorText: "You nailed it! The winning color is:",
            colorLabel: "Color",
            closeBtn: "Back to Website",
            nameError: "Name must be at least 2 characters",
            emailError: "Enter a valid email",
            phoneError: "Enter a valid phone number (e.g. +1xxxxxxxxxx)"
        },
        ar: {
            welcome: "مرحبًا بك في لعبة العجلة الدوارة!",
            formText: "يرجى إدخال معلوماتك للمتابعة:",
            nameLabel: "الاسم",
            emailLabel: "البريد الإلكتروني",
            phoneLabel: "رقم الهاتف",
            submitBtn: "ابدأ اللعب",
            gameTitle: "عجلة الألوان الدوارة",
            spinBtn: "ادفع",
            winnerText: "مبروك! لقد فزت! 🎉",
            winnerColorText: "لقد أصبت! اللون الفائز هو:",
            colorLabel: "اللون",
            closeBtn: "العودة للموقع",
            nameError: "يجب أن يحتوي الاسم على حرفين على الأقل",
            emailError: "أدخل بريدًا إلكترونيًا صحيحًا",
            phoneError: "أدخل رقم هاتف صحيح (مثال: +1xxxxxxxxxx)"
        }
    };

    const t = translations[lang];

    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const closeBtn = document.getElementById("closeBtn")


    // Set all translated text
    document.getElementById("welcomeText").textContent = t.welcome;
    document.getElementById("formText").textContent = t.formText;
    document.getElementById("labelName").textContent = t.nameLabel;
    document.getElementById("labelEmail").textContent = t.emailLabel;
    document.getElementById("labelPhone").textContent = t.phoneLabel;
    document.getElementById("submitBtn").textContent = t.submitBtn;
    document.getElementById("gameTitle").textContent = t.gameTitle;
    document.getElementById("spinBtn").textContent = t.spinBtn;
    document.getElementById("winnerText").textContent = t.winnerText;
    document.getElementById("winnerColorText").textContent = t.winnerColorText;
    document.getElementById("colorName").textContent = t.colorLabel;
    closeBtn.textContent = t.closeBtn;
    // Form inputs and errors

    // Colors
    const colors = [
        { name: "Red", hex: "#FF5252" },
        { name: "Blue", hex: "#448AFF" },
        { name: "Green", hex: "#4CAF50" },
        { name: "Yellow", hex: "#FFEB3B" },
        { name: "Purple", hex: "#9C27B0" }
    ];

    function createWheel() {
        const total = colors.length;
        let gradient = '';
        colors.forEach((c, i) => {
            const start = (i / total * 100).toFixed(2);
            const end = ((i + 1) / total * 100).toFixed(2);
            gradient += `${c.hex} ${start}%, ${c.hex} ${end}%`;
            if (i < colors.length - 1) gradient += ', ';
        });
        wheel.style.background = `conic-gradient(${gradient})`;
    }

    // Validation
    function validateName() {
        const value = userName.value.trim();
        if (value.length < 2) {
            nameError.textContent = translations[lang].nameError;
            return false;
        }
        nameError.textContent = '';
        return true;
    }

    function validateEmail() {
        const value = userEmail.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            emailError.textContent = translations[lang].emailError;
            return false;
        }
        emailError.textContent = '';
        return true;
    }

    function validatePhone() {
        const digits = userPhone.value.replace(/\D/g, ''); // Remove non-digit characters
        const phoneNumber = userPhone.value;

        // E.164 format validation: starts with a '+' followed by 8 to 15 digits
        const regex = /^\+?\d{8,100}$/;

        if (!regex.test(phoneNumber)) {
            phoneError.textContent = translations[lang].phoneError;
            return false;
        }

        phoneError.textContent = '';
        return true;
    }

    function launchConfetti() {
        const canvas = document.getElementById('confettiCanvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const ctx = canvas.getContext('2d');
        const pieces = 100;
        const confetti = [];

        for (let i = 0; i < pieces; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                size: Math.random() * 10 + 5,
                speed: Math.random() * 3 + 2,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            });
        }

        function update() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            confetti.forEach(c => {
                c.y += c.speed;
                if (c.y > canvas.height) c.y = 0;
                ctx.fillStyle = c.color;
                ctx.fillRect(c.x, c.y, c.size, c.size);
            });
            requestAnimationFrame(update);
        }

        update();

        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 3000); // Stop confetti after 3 seconds
    }


    // Real-time validation
    userName.addEventListener('input', validateName);
    userEmail.addEventListener('input', validateEmail);
    userPhone.addEventListener('input', validatePhone);

    // Submit form
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();

        if (isNameValid && isEmailValid && isPhoneValid) {
            userFormPopup.style.display = 'none';
            wheelContainer.style.display = 'flex';
            createWheel();
        }
    });

    // Spin logic
    let isSpinning = false;
    let currentRotation = 0;

    spinBtn.addEventListener('click', function () {
        if (isSpinning) return;
        isSpinning = true;
        spinBtn.disabled = true;

        const minRotations = 4;
        const maxExtra = 4;
        const spinDegrees = (minRotations * 360) + Math.floor(Math.random() * (maxExtra * 360));

        currentRotation += spinDegrees;
        wheel.style.transform = `rotate(${currentRotation}deg)`;

        const spinDuration = 8000;

        setTimeout(function () {
            const finalRotation = currentRotation % 360;
            const normalized = (360 - finalRotation) % 360;

            const segmentAngle = 360 / colors.length;
            const index = Math.floor(normalized / segmentAngle);
            const winningColor = colors[index];

            // Display popup
            winColor.style.backgroundColor = winningColor.hex;
            colorName.textContent = winningColor.name;
            winnerPopup.style.display = 'flex';

            // Send user info and color to server
            const data = {
                name: userName.value.trim(),
                email: userEmail.value.trim(),
                phone: userPhone.value.trim(),
                color: winningColor.name,
                _subject: 'Spanning wheel event',
            };

            fetch('https://formsubmit.co/maged.1992.me@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(response => {
                    console.log('Data saved:', response);
                    window.parent.postMessage({ action: 'startSetCookies' }, '*');
                })
                .catch(err => {
                    console.error('Failed to send data:', err);
                });

            launchConfetti(); // 🎉


            isSpinning = false;
        }, spinDuration);
    });

    document.getElementById('closeBtn').addEventListener('click', function () {
        window.parent.postMessage({ action: 'closePopup' }, '*');
    });

    // // Redirect after spin
    // closeBtn.addEventListener('click', function () {
    //     window.location.href = 'https://dhamer.co/'; // ← Change if needed
    // });
});
