document.querySelector(".logout-btn").addEventListener("click", function() {
    window.location.href = "login.html"; // Changed from landing.html to login.html
});
document.getElementById('education-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get values from form fields
    const educationData = {
        institution: document.getElementById('institution').value,
        institutionLocation: document.getElementById('institution-location').value,
        degree: document.getElementById('degree').value,
        fieldOfStudy: document.getElementById('field-of-study').value,
        graduationMonth: document.getElementById('graduation-month').value,
        graduationYear: document.getElementById('graduation-year').value,
        additionalCoursework: document.getElementById('additional-coursework').value
    };

    if (!educationData.institution || !educationData.degree || !educationData.fieldOfStudy || !educationData.graduationMonth || !educationData.graduationYear) {
        alert('Please fill in all required fields.');
        return;
    }

    // Fetch email from localStorage (set in previous form)
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('User email not found. Please go back and fill in personal details.');
        return;
    }

    try {
        // Send education data to backend for database update
        const response = await fetch('http://localhost:5000/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, updateData: educationData })
        });

        const result = await response.json();
        if (response.ok) {
            alert('Education details updated successfully!');
            window.location.href = 'page3.html'; // Navigate to next page
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update education details.');
    }
});
