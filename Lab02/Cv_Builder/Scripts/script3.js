// Function to store data in localStorage
document.querySelector(".logout-btn").addEventListener("click", function() {
    window.location.href = "login.html"; // Changed from landing.html to login.html
});
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
        alert('Please fill in the job title (required field).');
        return;
    }

    // Date validation - only check if not current work
    if (!currentWork) {
        // Convert dates to comparable format (YYYYMM)
        const startDate = parseInt(startYear + String(monthToNumber(startMonth)).padStart(2, '0'));
        const endDate = parseInt(endYear + String(monthToNumber(endMonth)).padStart(2, '0'));
        
        if (startDate > endDate) {
            alert('Start date cannot be after end date.');
            return;
        }
        
        if (startDate === endDate) {
            alert('Start date and end date cannot be the same.');
            return;
        }
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

// Helper function to convert month name to number (1-12)
function monthToNumber(monthName) {
    const months = {
        'January': 1, 'February': 2, 'March': 3, 'April': 4,
        'May': 5, 'June': 6, 'July': 7, 'August': 8,
        'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    return months[monthName] || 0;
}