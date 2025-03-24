// Profile Picture Handling
document.addEventListener('DOMContentLoaded', function() {
    // Load saved profile picture if exists
    const savedImage = localStorage.getItem('profilePicture');
    if (savedImage) {
        document.getElementById('profile-picture').src = savedImage;
    } else {
        // Fallback if placeholder fails
        document.getElementById('profile-picture').onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
        };
        document.getElementById('profile-picture').src = 'https://via.placeholder.com/150';
    }

    // Handle profile picture upload
    document.getElementById('profile-upload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Quick validation
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file (JPEG, PNG, etc.)');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                const imageData = event.target.result;
                document.getElementById('profile-picture').src = imageData;
                localStorage.setItem('profilePicture', imageData);
                console.log('Image saved to localStorage. To view it:', {
                    inConsole: "localStorage.getItem('profilePicture')",
                    inBrowser: "Right-click → Inspect → Application → Local Storage"
                });
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle remove picture button
    document.getElementById('remove-picture').addEventListener('click', function() {
        localStorage.removeItem('profilePicture');
        document.getElementById('profile-picture').src = 'https://via.placeholder.com/150';
        document.getElementById('profile-upload').value = '';
        console.log('Image removed from localStorage');
    });

    // Add a button to view stored image (for debugging)
    const viewImageBtn = document.createElement('button');
    viewImageBtn.textContent = 'View Stored Image (Debug)';
    viewImageBtn.style.marginTop = '10px';
    viewImageBtn.style.padding = '5px 10px';
    viewImageBtn.style.backgroundColor = '#f0f0f0';
    viewImageBtn.style.border = '1px solid #ccc';
    viewImageBtn.addEventListener('click', function() {
        const imgData = localStorage.getItem('profilePicture');
        if (imgData) {
            const win = window.open();
            win.document.write(`<img src="${imgData}" style="max-width:100%">`);
        } else {
            alert('No image stored in localStorage');
        }
    });
    document.querySelector('.profile-picture-container').appendChild(viewImageBtn);
});

// ===== YOUR ORIGINAL FORM SUBMISSION CODE (UNCHANGED) =====
document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get values from form fields
    const contactData = {
        name: document.getElementById('name').value,
        surname: document.getElementById('surname').value,
        profession: document.getElementById('profession').value,
        city: document.getElementById('city').value,
        postcode: document.getElementById('postcode').value,
        division: document.getElementById('division').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        // Profile picture is already saved in localStorage
    };

    // Basic validation
    if (!contactData.name || !contactData.surname || !contactData.email) {
        alert('Please fill in all required fields.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/submit-contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contactData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Data saved successfully!');

            // Store email in localStorage
            localStorage.setItem('userEmail', contactData.email);

            // Save other form data to localStorage as well
            localStorage.setItem('contactData', JSON.stringify(contactData));

            window.location.href = '../page2.html'; // Navigate to next page
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to server.');
    }
});