// Function to store data in localStorage
function storeData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Function to retrieve data from localStorage
function getData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}




document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get values from form fields
    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const profession = document.getElementById('profession').value;
    const city = document.getElementById('city').value;
    const postcode = document.getElementById('postcode').value;
    const division = document.getElementById('division').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Basic validation (check if required fields are filled)
    if (name === '' || surname === '' || email === '') {
        alert('Please fill in all required fields.');
        return;
    }

    // Store the data in localStorage
    const contactData = {
        name: name,
        surname: surname,
        profession: profession,
        city: city,
        postcode: postcode,
        division: division,
        phone: phone,
        email: email
    };
    storeData('contactData', contactData);

    // Navigate to the next page
    window.location.href = 'page2.html';
});