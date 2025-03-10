// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}



document.getElementById('education-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get values from form fields
    const institution = document.getElementById('institution').value;
    const institutionLocation = document.getElementById('institution-location').value;
    const degree = document.getElementById('degree').value;
    const fieldOfStudy = document.getElementById('field-of-study').value;
    const graduationMonth = document.getElementById('graduation-month').value;
    const graduationYear = document.getElementById('graduation-year').value;
    const additionalCoursework = document.getElementById('additional-coursework').value;

    // Basic validation (check if required fields are filled)
    if (institution === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // Store the data in localStorage
    const educationData = {
        institution: institution,
        institutionLocation: institutionLocation,
        degree: degree,
        fieldOfStudy: fieldOfStudy,
        graduationMonth: graduationMonth,
        graduationYear: graduationYear,
        additionalCoursework: additionalCoursework
    };
    storeData('educationData', educationData);

    // Navigate to the next page
    window.location.href = 'page3.html';
});