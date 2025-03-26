document.querySelector(".logout-btn").addEventListener("click", function() {
    window.location.href = "login.html"; // Changed from landing.html to login.html
});
document.addEventListener('DOMContentLoaded', async function () {
    // Fetch email from localStorage
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('User email not found. Please go back and fill in personal details.');
        return;
    }

    try {
        // Fetch user data from the backend
        const response = await fetch('http://localhost:5000/get-user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        console.log('Server Response:', result); // Log the response

        if (response.ok) {
            const userData = result.data;

            // Helper function to safely get nested values
            const safeGet = (obj, path, defaultValue = 'N/A') => {
                const keys = path.split('.');
                let value = obj;
                for (const key of keys) {
                    if (value === null || value === undefined || value[key] === undefined) {
                        return defaultValue;
                    }
                    value = value[key];
                }
                return value === null || value === undefined || value === '' ? defaultValue : value;
            };

            const skillsList = (skill) => {
                if (!skill || (Array.isArray(skill) && skill.length === 0)) {
                    return '<li>No skill provided</li>';
                }
            
                // If it's an array, map over each skill
                if (Array.isArray(skill)) {
                    return skill.map(skillItem => {
                        const skillName = skillItem?.skill || 'Unnamed Skill';
                        const skillDescription = skillItem?.description || 'No description provided';
                        return `<li>${skillName} - ${skillDescription}</li>`;
                    }).join('');
                }
            
                // If it's an object, directly access the 'skill' and 'description' properties
                if (typeof skill === 'object') {
                    const skillName = skill?.skill || 'Unnamed Skill';
                    const skillDescription = skill?.description || 'No description provided';
                    return `<li>${skillName} - ${skillDescription}</li>`;
                }
            
                return '<li>No valid skill data available</li>';
            };
            




            // Template HTMLs with placeholders dynamically populated
            const templates = {
                minimal: `
                    <div class="resume-template template-minimal">
                        <header>
                            <h1 id="summary-fullname">${safeGet(userData, 'name')} ${safeGet(userData, 'surname')}</h1>
                            <p id="summary-profession">${safeGet(userData, 'profession')}</p>
                        </header>
                        <section class="contact-info">
                            <div><span>Email:</span> ${safeGet(userData, 'email')}</div>
                            <div><span>Phone:</span> ${safeGet(userData, 'phone')}</div>
                            <div><span>Location:</span> ${safeGet(userData, 'city')}, ${safeGet(userData, 'division')}</div>
                            <div><span>Postcode:</span> ${safeGet(userData, 'postcode')}</div>
                        </section>
                        <section class="education">
                            <h2>Education</h2>
                            <div>
                                <h3>${safeGet(userData, 'institution')}</h3>
                                <p>${safeGet(userData, 'degree')} in ${safeGet(userData, 'fieldOfStudy')}</p>
                                <p>${safeGet(userData, 'graduationMonth')} ${safeGet(userData, 'graduationYear')}</p>
                            </div>
                        </section>
                        <section class="experience">
                            <h2>Experience</h2>
                            <div>
                                <h3>${safeGet(userData, 'experience.title')}</h3>
                                <p>${safeGet(userData, 'experience.company')}</p>
                                <p>${safeGet(userData, 'experience.location')}</p>
                                <p>${safeGet(userData, 'experience.startMonth')} ${safeGet(userData, 'experience.startYear')} - ${safeGet(userData, 'experience.currentWork') ? 'Present' : `${safeGet(userData, 'experience.endMonth')} ${safeGet(userData, 'experience.endYear')}`}</p>
                            </div>
                        </section>
                        <section class="skills">
                            <h2>Skills</h2>
                            <ul>
                                ${skillsList(userData.skill)}
                            </ul>
                        </section>
                    </div>
                `,
                elegant: `
                    <div class="resume-template template-elegant">
                        <header>
                            <h1>${safeGet(userData, 'name')} ${safeGet(userData, 'surname')}</h1>
                            <h2>${safeGet(userData, 'profession')}</h2>
                        </header>
                        <section class="contact-info">
                            <p><strong>Email:</strong> ${safeGet(userData, 'email')}</p>
                            <p><strong>Phone:</strong> ${safeGet(userData, 'phone')}</p>
                            <p><strong>Address:</strong> ${safeGet(userData, 'city')}, ${safeGet(userData, 'division')} ${safeGet(userData, 'postcode')}</p>
                        </section>
                        <section class="education">
                            <h2>Education</h2>
                            <div>
                                <p><strong>${safeGet(userData, 'institution')}</strong></p>
                                <p>${safeGet(userData, 'degree')} in ${safeGet(userData, 'fieldOfStudy')}</p>
                                <p>${safeGet(userData, 'graduationMonth')} ${safeGet(userData, 'graduationYear')}</p>
                            </div>
                        </section>
                        <section class="experience">
                            <h2>Experience</h2>
                            <div>
                                <p><strong>${safeGet(userData, 'experience.title')}</strong> at ${safeGet(userData, 'experience.company')}</p>
                                <p>${safeGet(userData, 'experience.startMonth')} ${safeGet(userData, 'experience.startYear')} - ${safeGet(userData, 'experience.currentWork') ? 'Present' : `${safeGet(userData, 'experience.endMonth')} ${safeGet(userData, 'experience.endYear')}`}</p>
                                <p>${safeGet(userData, 'experience.location')}</p>
                            </div>
                        </section>
                        <section class="skills">
                            <h2>Skills</h2>
                            <ul>${skillsList(userData.skill)}</ul>
                        </section>
                    </div>
                `,
                modern: `
                    <div class="resume-template template-modern">
                        <header>
                            <h1>${safeGet(userData, 'name')} ${safeGet(userData, 'surname')}</h1>
                            <p>${safeGet(userData, 'profession')}</p>
                        </header>
                        <section class="contact-info">
                            <p>Email: ${safeGet(userData, 'email')}</p>
                            <p>Phone: ${safeGet(userData, 'phone')}</p>
                            <p>Location: ${safeGet(userData, 'city')}, ${safeGet(userData, 'division')} ${safeGet(userData, 'postcode')}</p>
                        </section>
                        <section class="education">
                            <h2>Education</h2>
                            <div>
                                <p>${safeGet(userData, 'degree')} in ${safeGet(userData, 'fieldOfStudy')}</p>
                                <p>${safeGet(userData, 'institution')}</p>
                                <p>${safeGet(userData, 'graduationMonth')} ${safeGet(userData, 'graduationYear')}</p>
                            </div>
                        </section>
                        <section class="experience">
                            <h2>Experience</h2>
                            <p>${safeGet(userData, 'experience.title')} at ${safeGet(userData, 'experience.company')}</p>
                            <p>${safeGet(userData, 'experience.startMonth')} ${safeGet(userData, 'experience.startYear')} - ${safeGet(userData, 'experience.currentWork') ? 'Present' : `${safeGet(userData, 'experience.endMonth')} ${safeGet(userData, 'experience.endYear')}`}</p>
                            <p>${safeGet(userData, 'experience.location')}</p>
                        </section>
                        <section class="skills">
                            <h2>Skills</h2>
                            <ul>${skillsList(userData.skills)}</ul>
                        </section>
                    </div>
                `
            };

            // Populate and display the initial template
            const templateDisplay = document.querySelector('.template-display');
            templateDisplay.innerHTML = templates.minimal;

            // Add event listeners to switch templates dynamically
            const templatePreviews = document.querySelectorAll('.template-preview');
            templatePreviews.forEach(preview => {
                preview.addEventListener('click', () => {
                    templatePreviews.forEach(p => p.classList.remove('selected'));
                    preview.classList.add('selected');
                    const templateName = preview.dataset.template;
                    templateDisplay.innerHTML = templates[templateName];
                });
            });

        } else {
            console.error('Error fetching data:', result.message);
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('Failed to load summary data: ' + error.message);
    }
});
