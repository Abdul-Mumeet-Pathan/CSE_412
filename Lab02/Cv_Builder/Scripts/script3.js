// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}




document.getElementById('experience-form').addEventListener('submit', function(event) {
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

    // Navigate to the next page
    window.location.href = 'page4.html';
});