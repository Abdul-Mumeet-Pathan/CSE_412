let selectedTemplate = "";

async function showPreview(template) {
  selectedTemplate = template;
  const previewContent = document.getElementById("previewContent");
  const previewSection = document.getElementById("previewSection");

  // Show the preview section
  previewSection.style.display = "block";

  // Fetch user data from localStorage or backend
  const email = localStorage.getItem("userEmail");
  if (!email) {
    alert("User email not found. Please go back and fill in personal details.");
    return;
  }

  try {
    // Fetch user data from backend
    const response = await fetch("http://localhost:5000/get-user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch user data.");
    }

    const userData = result.data;

    // Helper function to safely get property or return placeholder
    const safeGet = (obj, path, defaultValue = "N/A") => {
      const keys = path.split(".");
      let value = obj;
      for (const key of keys) {
        if (value === null || value === undefined || value[key] === undefined) {
          return defaultValue;
        }
        value = value[key];
      }
      return value === null || value === undefined || value === "" ? defaultValue : value;
    };

    // Generate portfolio content based on the selected template
    let portfolioContent = "";

    if (template === "template1") {
      // Template 1: Clean and Minimal
      portfolioContent = `
        <div class="template1 p-6">
          <div class="border-b pb-4">
            <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
            <p class="text-lg mb-2">${safeGet(userData, "profession")}</p>
            <p class="text-sm">${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
          </div>
          <div class="border-b py-4">
            <h4 class="text-lg font-semibold mb-3">Contact Information</h4>
            <p>Email: ${safeGet(userData, "email")}</p>
            <p>Phone: ${safeGet(userData, "phone")}</p>
          </div>
          <div class="border-b py-4">
            <h4 class="text-lg font-semibold mb-3">Education</h4>
            <p>Institution: ${safeGet(userData, "institution")}</p>
            <p>Degree: ${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
            <p>Graduation Date: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
            <p>Location: ${safeGet(userData, "institutionLocation")}</p>
            <p>Coursework: ${safeGet(userData, "additionalCoursework", "None specified")}</p>
          </div>
          <div class="border-b py-4">
            <h4 class="text-lg font-semibold mb-3">Professional Experience</h4>
            <p>Job Title: ${safeGet(userData, "experience.title")}</p>
            <p>Company: ${safeGet(userData, "experience.company")}</p>
            <p>Location: ${safeGet(userData, "experience.location")}</p>
            <p>Dates: ${safeGet(userData, "experience.startMonth")} ${safeGet(userData, "experience.startYear")} - 
              ${safeGet(userData, "experience.currentWork") ? "Present" : `${safeGet(userData, "experience.endMonth")} ${safeGet(userData, "experience.endYear")}`}</p>
            <p>Remote: ${safeGet(userData, "experience.remote") ? "Yes" : "No"}</p>
            <p>Description: ${safeGet(userData, "experience.description")}</p>
          </div>
          <div class="py-4">
            <h4 class="text-lg font-semibold mb-3">Skills</h4>
            <ul>
              ${safeGet(userData, "skills", []).map(skill => `
                <li>${skill.skill || "N/A"}: ${skill.description || "No description provided."}</li>
              `).join("")}
            </ul>
          </div>
        </div>
      `;
    } else if (template === "template2") {
      // Template 2: Two-Column Layout with Soft Backgrounds
      portfolioContent = `
        <div class="template2 p-6">
          <div class="section">
            <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
            <p class="text-lg mb-2">${safeGet(userData, "profession")}</p>
            <p class="text-sm">${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Contact Information</h4>
            <p>Email: ${safeGet(userData, "email")}</p>
            <p>Phone: ${safeGet(userData, "phone")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Education</h4>
            <p>Institution: ${safeGet(userData, "institution")}</p>
            <p>Degree: ${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
            <p>Graduation Date: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
            <p>Location: ${safeGet(userData, "institutionLocation")}</p>
            <p>Coursework: ${safeGet(userData, "additionalCoursework", "None specified")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Professional Experience</h4>
            <p>Job Title: ${safeGet(userData, "experience.title")}</p>
            <p>Company: ${safeGet(userData, "experience.company")}</p>
            <p>Location: ${safeGet(userData, "experience.location")}</p>
            <p>Dates: ${safeGet(userData, "experience.startMonth")} ${safeGet(userData, "experience.startYear")} - 
              ${safeGet(userData, "experience.currentWork") ? "Present" : `${safeGet(userData, "experience.endMonth")} ${safeGet(userData, "experience.endYear")}`}</p>
            <p>Remote: ${safeGet(userData, "experience.remote") ? "Yes" : "No"}</p>
            <p>Description: ${safeGet(userData, "experience.description")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Skills</h4>
            <ul>
              ${safeGet(userData, "skills", []).map(skill => `
                <li>${skill.skill || "N/A"}: ${skill.description || "No description provided."}</li>
              `).join("")}
            </ul>
          </div>
        </div>
      `;
    } else if (template === "template3") {
      // Template 3: Creative and Bold with Gradient Backgrounds
      portfolioContent = `
        <div class="template3 p-6">
          <div class="header">
            <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
            <p class="text-lg mb-2">${safeGet(userData, "profession")}</p>
            <p class="text-sm">${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Contact Information</h4>
            <p>Email: ${safeGet(userData, "email")}</p>
            <p>Phone: ${safeGet(userData, "phone")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Education</h4>
            <p>Institution: ${safeGet(userData, "institution")}</p>
            <p>Degree: ${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
            <p>Graduation Date: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
            <p>Location: ${safeGet(userData, "institutionLocation")}</p>
            <p>Coursework: ${safeGet(userData, "additionalCoursework", "None specified")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Professional Experience</h4>
            <p>Job Title: ${safeGet(userData, "experience.title")}</p>
            <p>Company: ${safeGet(userData, "experience.company")}</p>
            <p>Location: ${safeGet(userData, "experience.location")}</p>
            <p>Dates: ${safeGet(userData, "experience.startMonth")} ${safeGet(userData, "experience.startYear")} - 
              ${safeGet(userData, "experience.currentWork") ? "Present" : `${safeGet(userData, "experience.endMonth")} ${safeGet(userData, "experience.endYear")}`}</p>
            <p>Remote: ${safeGet(userData, "experience.remote") ? "Yes" : "No"}</p>
            <p>Description: ${safeGet(userData, "experience.description")}</p>
          </div>
          <div class="section">
            <h4 class="text-lg font-semibold mb-3">Skills</h4>
            <ul>
              ${safeGet(userData, "skills", []).map(skill => `
                <li>${skill.skill || "N/A"}: ${skill.description || "No description provided."}</li>
              `).join("")}
            </ul>
          </div>
        </div>
      `;
    }

    // Display the preview
    previewContent.innerHTML = portfolioContent;

    // Store the portfolio content for printing
    document.getElementById("printable-portfolio").innerHTML = portfolioContent;
  } catch (error) {
    console.error("Error fetching user data:", error);
    alert("Failed to load preview data: " + error.message);
  }
}

function printPortfolio() {
  // Create a new window for printing
  const printWindow = window.open("", "_blank");
  const printableContent = document.getElementById("printable-portfolio").innerHTML;

  // Write the content to the new window
  printWindow.document.write(`
    <html>
      <head>
        <title>Portfolio</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          /* Template 1: Clean and Minimal */
          .template1 { background-color: #f3f4f6; color: #111827; }

          /* Template 2: Two-Column Layout with Soft Backgrounds */
          .template2 {
            background-color: #ffffff;
            color: #1e293b;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
          }
          .template2 .section {
            padding: 15px;
            border-radius: 8px;
            background-color: #f8fafc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .template2 .section:nth-child(odd) {
            background-color: #e2e8f0;
          }

          /* Template 3: Creative and Bold with Gradient Backgrounds */
          .template3 {
            background-color: #ffffff;
            color: #1e293b;
            padding: 20px;
          }
          .template3 .header {
            background: linear-gradient(to right, #6b46c1, #805ad5);
            padding: 20px;
            color: white;
            text-align: center;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .template3 .section {
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            background-color: #f8fafc;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .template3 .section:nth-child(even) {
            background: linear-gradient(to right, #f6e05e, #faf089);
          }
          .template3 .section:nth-child(odd) {
            background: linear-gradient(to right, #63b3ed, #90cdf4);
          }
        </style>
      </head>
      <body>
        ${printableContent}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
}