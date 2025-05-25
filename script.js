document.addEventListener('DOMContentLoaded', function () {

    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const userAddress = document.getElementById('userAddress');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');


    // Validation
    function validateName() {
        const value = userName.value.trim();
        if (value.length < 2) {
            nameError.textContent = "Name must be at least 2 characters";
            return false;
        }
        nameError.textContent = '';
        return true;
    }

    function validateAddress() {
        const value = userName.value.trim();
        if (value.length <= 0) {
            nameError.textContent = "Address is required";
            return false;
        }
        nameError.textContent = '';
        return true;
    }

    function validateEmail() {
        const value = userEmail.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(value)) {
            emailError.textContent = "Enter a valid email";
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
            phoneError.textContent = "Enter a valid phone number (e.g. +1xxxxxxxxxx)";
            return false;
        }

        phoneError.textContent = '';
        return true;
    }

    // Real-time validation
    userName.addEventListener('input', validateName);
    userEmail.addEventListener('input', validateEmail);
    userPhone.addEventListener('input', validatePhone);
    userAddress.addEventListener('input', validateAddress);

    // Submit form
    userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isAddressValid = validateAddress();

        if (isNameValid && isEmailValid && isPhoneValid && isAddressValid) {

            const data = {
                name: "first-100-user-Event",
                data: {
                    name: userName.value.trim(),
                    email: userEmail.value.trim(),
                    phone: userPhone.value.trim(),
                    address: userAddress.value.trim(),
                }
            };


            fetch('https://api.dhamer.co/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(response => {
                    userFormPopup.style.display = 'none';
                    winnerPopup.style.display = "flex";
                    window.parent.postMessage({ action: 'startSetCookies' }, '*');
                    setTimeout(() => {
                        window.parent.postMessage({ action: 'closePopup' }, '*');
                    })
                })
                .catch(err => {
                    console.error('Failed to send data:', err);
                });
        }
    });

    document.getElementById('closeBtn').addEventListener('click', function () {
        window.parent.postMessage({ action: 'closePopup' }, '*');

    });

    // // Redirect after spin
    // closeBtn.addEventListener('click', function () {
    //     window.location.href = 'https://dhamer.co/'; // ← Change if needed
    // });
});
