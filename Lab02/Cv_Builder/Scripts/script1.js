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
        email: document.getElementById('email').value
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

            // ✅ Store email in localStorage
            localStorage.setItem('userEmail', contactData.email);

            window.location.href = '../page2.html'; // Navigate to next page
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to connect to server.');
    }
});