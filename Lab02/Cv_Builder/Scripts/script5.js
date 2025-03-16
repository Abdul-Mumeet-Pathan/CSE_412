document.addEventListener('DOMContentLoaded', async function() {
    // Fetch email from localStorage
    const email = localStorage.getItem('userEmail');
    if (!email) {
        alert('User email not found. Please go back and fill in personal details.');
        return;
    }

    try {
        // Fetch user data from backend
        const response = await fetch('http://localhost:5000/get-user-data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await response.json();
        console.log('Server Response:', result); // Log the response

        if (response.ok) {
            const userData = result.data;
            
            // Helper function to safely get property or return placeholder
            const safeGet = (obj, path, defaultValue = 'N/A') => {
                // Split the path by dots
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
            
            // Populate personal information
            document.getElementById('summary-fullname').textContent = 
                `${safeGet(userData, 'name')} ${safeGet(userData, 'surname')}`;
            document.getElementById('summary-profession').textContent = 
                safeGet(userData, 'profession');
            
            // Populate contact information
            document.getElementById('summary-email').textContent = safeGet(userData, 'email');
            document.getElementById('summary-phone').textContent = safeGet(userData, 'phone');
            document.getElementById('summary-location').textContent = 
                `${safeGet(userData, 'city')}, ${safeGet(userData, 'division')}`;
            document.getElementById('summary-postcode').textContent = safeGet(userData, 'postcode');
            
            // Populate education information
            document.getElementById('summary-institution').textContent = safeGet(userData, 'institution');
            document.getElementById('summary-degree-field').textContent = 
                `${safeGet(userData, 'degree')} in ${safeGet(userData, 'fieldOfStudy')}`;
            document.getElementById('summary-graduation-date').textContent = 
                `${safeGet(userData, 'graduationMonth')} ${safeGet(userData, 'graduationYear')}`;
            document.getElementById('summary-institution-location').textContent = 
                safeGet(userData, 'institutionLocation');
            document.getElementById('summary-coursework').textContent = 
                safeGet(userData, 'additionalCoursework', 'None specified');
            
            // Populate professional experience
            document.getElementById('summary-job-title').textContent = 
                safeGet(userData, 'experience.title');
            document.getElementById('summary-company').textContent = 
                safeGet(userData, 'experience.company');
            document.getElementById('summary-job-location').textContent = 
                safeGet(userData, 'experience.location');
            
            // Display employment dates
            const startDate = `${safeGet(userData, 'experience.startMonth')} ${safeGet(userData, 'experience.startYear')}`;
            let endDate = 'Present';
            
            if (userData.experience && userData.experience.currentWork !== true) {
                endDate = `${safeGet(userData, 'experience.endMonth')} ${safeGet(userData, 'experience.endYear')}`;
            }
            
            document.getElementById('summary-job-dates').textContent = startDate === 'N/A N/A' ? 'N/A' : `${startDate} - ${endDate}`;
            
            // Show remote status if applicable
            if (userData.experience && userData.experience.remote === true) {
                document.getElementById('summary-remote-status').textContent = 'Remote Position';
            } else {
                document.getElementById('summary-remote-status').textContent = 'On-site Position';
            }
            
            // Show current work status
            if (userData.experience && userData.experience.currentWork === true) {
                document.getElementById('summary-current-work').textContent = 'Currently working here';
            } else {
                document.getElementById('summary-current-work').textContent = '';
            }
            
            // Populate skills
            document.getElementById('summary-skill-name').textContent = 
                safeGet(userData, 'skill.skill');
            document.getElementById('summary-skill-description').textContent = 
                safeGet(userData, 'skill.description');
            
            // Check if any sections are completely empty and add a message
            const sections = [
                { id: 'summary-institution', section: 'Education' },
                { id: 'summary-job-title', section: 'Experience' },
                { id: 'summary-skill-name', section: 'Skills' }
            ];
            
            sections.forEach(section => {
                const element = document.getElementById(section.id);
                if (element.textContent === 'N/A') {
                    element.textContent = `No ${section.section} data available`;
                }
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