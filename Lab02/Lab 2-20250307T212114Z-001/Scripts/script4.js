// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Function to update the skills preview
function updateSkillsPreview() {
    const skillsEditor = document.getElementById('skills-editor');
    const skillsPreview = document.getElementById('skills-preview');
    skillsPreview.innerHTML = skillsEditor.value.replace(/\n/g, '<br>');
}

// Event listener for updating the skills preview on input
document.getElementById('skills-editor').addEventListener('input', updateSkillsPreview);

// Function to add a skill to the editor
function addSkillToEditor(skill) {
    const skillsEditor = document.getElementById('skills-editor');
    skillsEditor.value += (skillsEditor.value ? '\n' : '') + skill;
    updateSkillsPreview();
}

// Event listeners for adding skills from the examples
const addSkillButtons = document.querySelectorAll('.bg-blue-500');
addSkillButtons.forEach(button => {
    button.addEventListener('click', function() {
        const skill = this.parentElement.querySelector('span:last-child').textContent;
        addSkillToEditor(skill);
    });
});

// Event listener for the "Update" button
document.querySelector('.flex.justify-between.mt-2 button:last-child').addEventListener('click', function() {
    updateSkillsPreview();
});

// Event listener for the dropdown menu
const jobTitleDropdown = document.getElementById('job-title');
const selectedJobTitle = document.getElementById('selected-job-title');
const skillExamplesContainer = document.querySelector('.space-y-2'); // Select the container for skill examples

jobTitleDropdown.addEventListener('change', function() {
    const selectedValue = this.value;
    selectedJobTitle.textContent = selectedValue ? this.options[this.selectedIndex].text : 'Select a job title';

    // Clear previous skill examples
    skillExamplesContainer.innerHTML = '';

    // Add new skill examples based on the selected job title
    const newSkillExamples = getSkillExamples(selectedValue);
    newSkillExamples.forEach(example => {
        const skillDiv = document.createElement('div');
        skillDiv.classList.add('flex', 'items-center', 'justify-between', 'bg-gray-100', 'p-2', 'rounded');
        skillDiv.innerHTML = `
            <div>
                <span class="font-medium">${example.recommended ? 'Expert Recommended' : ''}</span><br>
                <span>${example.skill}</span>
            </div>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">+</button>
        `;
        skillExamplesContainer.appendChild(skillDiv);

        // Add event listener to the new "+" button
        skillDiv.querySelector('.bg-blue-500').addEventListener('click', function() {
            addSkillToEditor(example.skill);
        });
    });
});

// Function to get skill examples based on job title
function getSkillExamples(jobTitle) {
    // Replace with your actual skill examples for each job title
    switch (jobTitle) {
        case 'salesman':
            return [
                { skill: 'Sales and marketing strategies', recommended: true },
                { skill: 'Client presentations', recommended: true },
                { skill: 'Lead prospecting', recommended: true },
                { skill: 'Territory development', recommended: true },
                { skill: 'CRM tracking', recommended: false },
                { skill: 'Customer relationship building', recommended: false },
                { skill: 'Product maintenance', recommended: false }
            ];
        case 'cashier':
            return [
                { skill: 'Cash handling', recommended: true },
                { skill: 'Customer service', recommended: true },
                { skill: 'Basic math skills', recommended: true },
                { skill: 'POS systems', recommended: false },
                { skill: 'Inventory management', recommended: false }
            ];
        // Add more cases for other job titles
        default:
            return;
    }
}

// Event listener for form submission
document.getElementById('skills-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get skills from the editor
    const skills = document.getElementById('skills-editor').value;

    // Basic validation
    if (skills === '') {
        alert('Please enter your skills.');
        return;
    }

    // Store the data in localStorage
    const skillsData = {
        skills: skills
    };
    storeData('skillsData', skillsData);

    // Navigate to the next page
    window.location.href = 'page5.html';
});