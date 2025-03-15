// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

document.getElementById('skill-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get values from form fields
    const skill = document.getElementById('skill').value;
    const description = document.getElementById('description').value;

    // Basic validation (check if required fields are filled)
    if (skill === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // Store the data in localStorage
    const skillData = {
        skill: skill,
        description: description,
    };
    storeData('skillData', skillData);

    // Fetch email from localStorage (set in previous form)
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('User email not found. Please go back and fill in personal details.');
        return;
    }

    try {
        // Send skill data to backend for database update
        const response = await fetch('http://localhost:5000/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, updateData: { skill: skillData } })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Skills updated successfully!');
            window.location.href = 'page5.html'; // Navigate to next page
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update skills.');
    }
});
