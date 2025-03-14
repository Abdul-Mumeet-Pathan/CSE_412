// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

document.getElementById('experience-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get values from form fields
    const title = document.getElementById('title').value;
    const company = document.getElementById('company').value;
    const location = document.getElementById('location').value;
    const remote = document.getElementById('remote').checked;
    const startMonth = document.getElementById('start-month').value;
    const startYear = document.getElementById('start-year').value;
    const endMonth = document.getElementById('end-month').value;
    const endYear = document.getElementById('end-year').value;
    const currentWork = document.getElementById('current-work').checked;

    // Basic validation (check if required fields are filled)
    if (title === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // Store the data in localStorage
    const experienceData = {
        title: title,
        company: company,
        location: location,
        remote: remote,
        startMonth: startMonth,
        startYear: startYear,
        endMonth: endMonth,
        endYear: endYear,
        currentWork: currentWork
    };
    storeData('experienceData', experienceData);

    // Fetch email from localStorage (set in previous form)
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('User email not found. Please go back and fill in personal details.');
        return;
    }

    try {
        // Send experience data to backend for database update
        const response = await fetch('http://localhost:5000/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, updateData: { experience: experienceData } })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Experience details updated successfully!');
            window.location.href = 'page4.html'; // Navigate to next page
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update experience details.');
    }
});
