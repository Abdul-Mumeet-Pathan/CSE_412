// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}




// Retrieve data from localStorage
const contactData = getData('contactData');
const educationData = getData('educationData');
const experienceData = getData('experienceData');
const skillsData = getData('skillsData');

// Populate the summary sections
document.getElementById('summary-name').textContent = contactData.name + ' ' + contactData.surname;
document.getElementById('summary-profession').textContent = contactData.profession;
document.getElementById('summary-location').textContent = contactData.city + ', ' + contactData.postcode + ', ' + contactData.division;

// Add education details to the summary
const educationList = document.getElementById('summary-education');
const educationItem = document.createElement('li');
educationItem.textContent = educationData.degree + ' in ' + educationData.fieldOfStudy + ' from ' + educationData.institution + ', ' + educationData.institutionLocation + ' (' + educationData.graduationMonth + ' ' + educationData.graduationYear + ')';
educationList.appendChild(educationItem);

// Add experience details to the summary
const experienceList = document.getElementById('summary-experience');
const experienceItem = document.createElement('li');
experienceItem.textContent = experienceData.title + ' at ' + experienceData.company + ', ' + experienceData.location + ' (' + experienceData.startMonth + ' ' + experienceData.startYear + ' - ' + experienceData.endMonth + ' ' + experienceData.endYear + ')';
experienceList.appendChild(experienceItem);

// Add skills to the summary
const skillsList = document.getElementById('summary-skills');
const skillsArray = skillsData.skills.split('\n'); // Assuming skills are separated by newlines
skillsArray.forEach(skill => {
    const skillItem = document.createElement('li');
    skillItem.textContent = skill;
    skillsList.appendChild(skillItem);
});

// Navigation for "Back" and "Finalize" buttons
const backButton = document.querySelector('.bg-gray-300'); // Select the "Back" button
const finalizeButton = document.querySelector('.bg-blue-500'); // Select the "Finalize" button

backButton.addEventListener('click', function() {
    // Navigate back to page 4
    window.location.href = 'page4.html';
});

finalizeButton.addEventListener('click', function() {
    // Navigate to page 6
    window.location.href = 'page6.html';
});