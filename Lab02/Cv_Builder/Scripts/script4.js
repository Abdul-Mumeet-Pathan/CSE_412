// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Counter to keep track of skill fields
let skillCounter = 1;

// Function to add a new skill field
function addSkillField() {
    skillCounter++;

    // Create a new skill field
    const skillField = document.createElement('div');
    skillField.className = 'grid grid-cols-2 gap-4 mb-4 skill-field';
    skillField.innerHTML = `
        <div>
            <label for="skill-${skillCounter}" class="block text-sm font-medium text-gray-700">Skill *</label>
            <input
                type="text"
                id="skill-${skillCounter}"
                name="skill"
                class="mt-1 p-2 border rounded w-full"
                required
            />
        </div>
        <div>
            <label for="description-${skillCounter}" class="block text-sm font-medium text-gray-700">Description</label>
            <input
                type="text"
                id="description-${skillCounter}"
                name="description"
                class="mt-1 p-2 border rounded w-full"
            />
        </div>
    `;

    // Append the new skill field to the container
    document.getElementById('skills-container').appendChild(skillField);
}

// Add event listener to the "Add Another Skill" button
document.getElementById('add-skill').addEventListener('click', addSkillField);

// Handle form submission
document.getElementById('skill-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Fetch email from localStorage (set in previous form)
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('User email not found. Please go back and fill in personal details.');
        return;
    }

    // Collect all skill data
    const skillFields = document.querySelectorAll('.skill-field');
    const skills = [];

    for (let i = 0; i < skillFields.length; i++) {
        const skill = skillFields[i].querySelector(`#skill-${i + 1}`).value;
        const description = skillFields[i].querySelector(`#description-${i + 1}`).value;

        // Basic validation (check if required fields are filled)
        if (skill.trim() === '') {
            alert(`Please fill in the skill for field ${i + 1}.`);
            return;
        }

        // Add skill and description to the skills array
        skills.push({
            skill: skill,
            description: description,
        });
    }

    // Store the data in localStorage
    storeData('skillData', skills);

    try {
        // Send skill data to backend for database update
        const response = await fetch('http://localhost:5000/update-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, updateData: { skills: skills } })
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