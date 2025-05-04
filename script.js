document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const userFormPopup = document.getElementById('userFormPopup');
    const userForm = document.getElementById('userForm');
    const wheelContainer = document.getElementById('wheelContainer');
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const winnerPopup = document.getElementById('winnerPopup');
    const closeBtn = document.getElementById('closeBtn');
    const winColor = document.getElementById('winColor');
    const colorName = document.getElementById('colorName');

    // Form inputs
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');

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
            nameError.textContent = 'Name must be at least 2 characters';
            return false;
        }
        nameError.textContent = '';
        return true;
    }

    function validateEmail() {
        const value = userEmail.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            emailError.textContent = 'Enter a valid email';
            return false;
        }
        emailError.textContent = '';
        return true;
    }

    function validatePhone() {
        const digits = userPhone.value.replace(/\D/g, '');
        if (!/^\d{10,15}$/.test(digits)) {
            phoneError.textContent = 'Enter 10–15 digits';
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
                color: winningColor.name
            };

            fetch('https://your-server.com/api/save-winner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(response => {
                    console.log('Data saved:', response);
                })
                .catch(err => {
                    console.error('Failed to send data:', err);
                });

            launchConfetti(); // 🎉


            isSpinning = false;
        }, spinDuration);
    });

    // Redirect after spin
    closeBtn.addEventListener('click', function () {
        window.location.href = 'https://dhamer.co/'; // ← Change if needed
    });
});
