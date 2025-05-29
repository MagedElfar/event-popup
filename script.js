document.addEventListener('DOMContentLoaded', function () {

    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userPhone = document.getElementById('userPhone');
    const userAddress = document.getElementById('userAddress');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const phoneError = document.getElementById('phoneError');
    const closeBtn = document.getElementById("close-popup")
    const giftBtn = document.getElementById('giftBtn');

    let products = [];
    let selectedProducts = [];
    let maxSelections = 3;

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

            userFormPopup.style.display = 'none';
            giftContainer.style.display = "block"
            // Initialize the game
            createGiftBoxes();
        }
    });

    document.getElementById('close-popup').addEventListener('click', function () {
        window.parent.postMessage({ action: 'closePopup' }, '*');

    });

    // Redirect after spin
    closeBtn.addEventListener('click', function () {
        window.parent.postMessage({ action: 'skipEvent' }, '*');
    });

    giftBtn.addEventListener('click', eventSubmit)

    function eventSubmit() {
        const data = {
            name: "first-100-user-Event",
            data: {
                name: userName.value.trim(),
                email: userEmail.value.trim(),
                phone: userPhone.value.trim(),
                address: userAddress.value.trim(),
                products: selectedProducts.map(item => item.id.trim())
            }
        };


        giftBtn.classList.add('disabled');

        fetch('https://api.dhamer.co/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(response => {
                window.parent.postMessage({ action: 'startSetCookies' }, '*');
                giftContainer.style.display = "none"
                winnerPopup.style.display = "flex";
                setTimeout(() => {
                    window.parent.postMessage({ action: 'closePopup' }, '*');
                }, 5000)
            })
            .catch(err => {
                console.error('Failed to send data:', err);
            }).finally(() => {
                giftBtn.classList.remove('disabled');
            });
    }

    function createGiftBoxes() {
        fetch('https://api.dhamer.co/api/v1/search/stocks?page=1&limit=6&includeInpublish=false&includeInactive=false&inStock=true&groupByProduct=true&random=true', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        })
            .then(res => res.json())
            .then(response => {
                products = response.items || [];
                renderProducts();
            })
            .catch(err => {
                console.error('Failed to load products:', err);
                displayError('Failed to load products. Please try again.');
            });
    }

    function renderProducts() {
        const giftGrid = document.getElementById('giftGrid');
        giftGrid.innerHTML = '';

        if (products.length === 0) {
            giftGrid.innerHTML = '<p style="color: white; font-size: 1.2rem;">No products available</p>';
            return;
        }

        products.slice(0, 6).forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.id = `product-${product.id}`;

            productCard.innerHTML = `
                    <div class="product-inner">
                        <div class="product-image">
                            <img src="${product?.productImages?.[0].path || '/media/image-1.jpg'}" alt="${product.productName_en}" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSIjZjNmNGY2Ii8+Cjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD4KPC9zdmc+'" />
                        </div>
                        <div class="product-info">
                            <h2 class="product-name">${product.productName_en}</h2>
                        </div>
                        <div class="selection-indicator">✓</div>
                    </div>
                `;

            productCard.addEventListener('click', () => toggleProductSelection(product, productCard));
            giftGrid.appendChild(productCard);
        });
    }

    function toggleProductSelection(product, cardElement) {
        const isSelected = selectedProducts.some(p => p.id === product.id);

        if (isSelected) {
            // Deselect product
            selectedProducts = selectedProducts.filter(p => p.id !== product.id);
            cardElement.classList.remove('selected');
        } else {
            // Check if we can select more products
            if (selectedProducts.length >= maxSelections) {
                return;
            }

            // Select product
            selectedProducts.push(product);
            cardElement.classList.add('selected');
        }

        updateUI();
    }

    function updateUI() {
        // Update remaining selections
        document.getElementById('remaining').textContent = maxSelections - selectedProducts.length;

        // Enable/disable submit button
        if (selectedProducts.length === maxSelections) {
            giftBtn.disabled = false;
            giftBtn.classList.remove('disabled');
        } else {
            giftBtn.disabled = true;
            giftBtn.classList.add('disabled');
        }
    }

    function displayError(message) {
        const giftGrid = document.getElementById('giftGrid');
        giftGrid.innerHTML = `<p style="color: #ff6b6b; font-size: 1.2rem;">${message}</p>`;
    }



});
