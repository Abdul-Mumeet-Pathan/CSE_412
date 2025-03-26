let selectedTemplate = "";

async function showPreview(template) {
  selectedTemplate = template;
  const previewContent = document.getElementById("previewContent");
  const previewSection = document.getElementById("previewSection");

  // Show the preview section
  previewSection.style.display = "block";

  // Fetch user data
  const email = localStorage.getItem("userEmail");
  if (!email) {
    alert("User email not found. Please go back and fill in personal details.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/get-user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to fetch user data.");

    const userData = result.data;

    // Helper function for safe data access
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

    // Get profile picture or placeholder
    const profilePicSrc = localStorage.getItem("profilePicture") || 
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';

    // Generate template-specific content
    let portfolioContent = '';
    let printStyles = '';

    if (template === "template1") {
      // Classic CV Template - Picture top right
      portfolioContent = `
        <div class="template1 p-6 relative" style="min-height: 100vh;">
          <!-- Profile Picture -->
          <div style="position: absolute; top: 40px; right: 40px; width: 120px; height: 120px;
                      border-radius: 50%; overflow: hidden; border: 3px solid #e2e8f0;">
            <img src="${profilePicSrc}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          
          <!-- Personal Info -->
          <div class="border-b pb-4" style="margin-right: 140px;">
            <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
            <p class="text-lg mb-2">${safeGet(userData, "profession")}</p>
            <p class="text-sm">${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
          </div>

          <!-- Contact Info -->
          <div class="border-b py-4">
            <h4 class="text-lg font-semibold mb-3">Contact Information</h4>
            <p>Email: ${safeGet(userData, "email")}</p>
            <p>Phone: ${safeGet(userData, "phone")}</p>
          </div>

          <!-- Education -->
          <div class="border-b py-4">
            <h4 class="text-lg font-semibold mb-3">Education</h4>
            <p>Institution: ${safeGet(userData, "institution")}</p>
            <p>Degree: ${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
            <p>Graduation Date: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
            <p>Location: ${safeGet(userData, "institutionLocation")}</p>
            <p>Coursework: ${safeGet(userData, "additionalCoursework", "None specified")}</p>
          </div>

          <!-- Experience -->
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

          <!-- Skills -->
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
      
      printStyles = `
        @media print {
          .template1 {
            padding: 0 !important;
          }
          body {
            margin: 20px;
          }
        }
      `;

    } else if (template === "template2") {
      // Modern Two-Column Template
      portfolioContent = `
        <div class="template2 p-6">
          <!-- Header with Profile Picture -->
          <div class="header-section" style="display: flex; align-items: center; margin-bottom: 30px;">
            <div style="margin-right: 30px; width: 120px; height: 120px;
                        border-radius: 50%; overflow: hidden; border: 3px solid #e2e8f0; flex-shrink: 0;">
              <img src="${profilePicSrc}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
              <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
              <p class="text-lg mb-2">${safeGet(userData, "profession")}</p>
              <p class="text-sm">${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
            </div>
          </div>

          <!-- Two Column Layout -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px;">
            <!-- Left Column -->
            <div>
              <!-- Contact Info -->
              <div class="section" style="padding: 15px; border-radius: 8px; background-color: #f8fafc; margin-bottom: 20px;">
                <h4 class="text-lg font-semibold mb-3">Contact Information</h4>
                <p>Email: ${safeGet(userData, "email")}</p>
                <p>Phone: ${safeGet(userData, "phone")}</p>
              </div>

              <!-- Education -->
              <div class="section" style="padding: 15px; border-radius: 8px; background-color: #f8fafc; margin-bottom: 20px;">
                <h4 class="text-lg font-semibold mb-3">Education</h4>
                <p>Institution: ${safeGet(userData, "institution")}</p>
                <p>Degree: ${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
                <p>Graduation Date: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
                <p>Location: ${safeGet(userData, "institutionLocation")}</p>
                <p>Coursework: ${safeGet(userData, "additionalCoursework", "None specified")}</p>
              </div>
            </div>

            <!-- Right Column -->
            <div>
              <!-- Experience -->
              <div class="section" style="padding: 15px; border-radius: 8px; background-color: #f8fafc; margin-bottom: 20px;">
                <h4 class="text-lg font-semibold mb-3">Professional Experience</h4>
                <p>Job Title: ${safeGet(userData, "experience.title")}</p>
                <p>Company: ${safeGet(userData, "experience.company")}</p>
                <p>Location: ${safeGet(userData, "experience.location")}</p>
                <p>Dates: ${safeGet(userData, "experience.startMonth")} ${safeGet(userData, "experience.startYear")} - 
                  ${safeGet(userData, "experience.currentWork") ? "Present" : `${safeGet(userData, "experience.endMonth")} ${safeGet(userData, "experience.endYear")}`}</p>
                <p>Remote: ${safeGet(userData, "experience.remote") ? "Yes" : "No"}</p>
                <p>Description: ${safeGet(userData, "experience.description")}</p>
              </div>

              <!-- Skills -->
              <div class="section" style="padding: 15px; border-radius: 8px; background-color: #f8fafc;">
                <h4 class="text-lg font-semibold mb-3">Skills</h4>
                <ul>
                  ${safeGet(userData, "skills", []).map(skill => `
                    <li>${skill.skill || "N/A"}: ${skill.description || "No description provided."}</li>
                  `).join("")}
                </ul>
              </div>
            </div>
          </div>
        </div>
      `;

    } else if (template === "template3") {
      // Creative Template
      portfolioContent = `
        <div class="template3 p-6">
          <!-- Header with Gradient Background -->
          <div class="header" style="background: linear-gradient(to right, #6b46c1, #805ad5);
                                      padding: 30px; color: white; border-radius: 8px;
                                      display: flex; align-items: center; margin-bottom: 20px;">
            <div style="margin-right: 30px; width: 120px; height: 120px;
                        border-radius: 50%; overflow: hidden; border: 3px solid white; flex-shrink: 0;">
              <img src="${profilePicSrc}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div>
              <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
              <p class="text-lg mb-2">${safeGet(userData, "profession")}</p>
              <p class="text-sm">${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
            </div>
          </div>

          <!-- Content Sections -->
          <div class="section" style="padding: 20px; border-radius: 8px; margin-bottom: 20px;
                                      background: linear-gradient(to right, #63b3ed, #90cdf4);">
            <h4 class="text-lg font-semibold mb-3">Contact Information</h4>
            <p>Email: ${safeGet(userData, "email")}</p>
            <p>Phone: ${safeGet(userData, "phone")}</p>
          </div>

          <div class="section" style="padding: 20px; border-radius: 8px; margin-bottom: 20px;
                                      background: linear-gradient(to right, #f6e05e, #faf089);">
            <h4 class="text-lg font-semibold mb-3">Education</h4>
            <p>Institution: ${safeGet(userData, "institution")}</p>
            <p>Degree: ${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
            <p>Graduation Date: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
            <p>Location: ${safeGet(userData, "institutionLocation")}</p>
            <p>Coursework: ${safeGet(userData, "additionalCoursework", "None specified")}</p>
          </div>

          <div class="section" style="padding: 20px; border-radius: 8px; margin-bottom: 20px;
                                      background: linear-gradient(to right, #63b3ed, #90cdf4);">
            <h4 class="text-lg font-semibold mb-3">Professional Experience</h4>
            <p>Job Title: ${safeGet(userData, "experience.title")}</p>
            <p>Company: ${safeGet(userData, "experience.company")}</p>
            <p>Location: ${safeGet(userData, "experience.location")}</p>
            <p>Dates: ${safeGet(userData, "experience.startMonth")} ${safeGet(userData, "experience.startYear")} - 
              ${safeGet(userData, "experience.currentWork") ? "Present" : `${safeGet(userData, "experience.endMonth")} ${safeGet(userData, "experience.endYear")}`}</p>
            <p>Remote: ${safeGet(userData, "experience.remote") ? "Yes" : "No"}</p>
            <p>Description: ${safeGet(userData, "experience.description")}</p>
          </div>

          <div class="section" style="padding: 20px; border-radius: 8px;
                                      background: linear-gradient(to right, #f6e05e, #faf089);">
            <h4 class="text-lg font-semibold mb-3">Skills</h4>
            <ul>
              ${safeGet(userData, "skills", []).map(skill => `
                <li>${skill.skill || "N/A"}: ${skill.description || "No description provided."}</li>
              `).join("")}
            </ul>
          </div>
        </div>
      `;
    } else if (template === "template4") {
      // Professional Black & White Template
      portfolioContent = `
        <div class="template4 p-6">
          <!-- Profile Picture (Right Side) -->
          <div class="profile-pic" style="position: absolute; top: 40px; right: 40px; width: 120px; height: 120px; overflow: hidden; border: 2px solid #333;">
            <img src="${profilePicSrc}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          
          <!-- Personal Info -->
          <div class="section" style="margin-right: 160px; padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333; margin-bottom: 20px;">
            <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
            <p class="text-lg mb-2">${safeGet(userData, "profession")}</p>
            <p class="text-sm">${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
          </div>
    
          <!-- Contact Info -->
          <div class="section" style="padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333; margin-bottom: 20px;">
            <h4 class="text-xl font-semibold mb-3">Contact Information</h4>
            <p>Email: ${safeGet(userData, "email")}</p>
            <p>Phone: ${safeGet(userData, "phone")}</p>
          </div>
    
          <!-- Education -->
          <div class="section" style="padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333; margin-bottom: 20px;">
            <h4 class="text-xl font-semibold mb-3">Education</h4>
            <p>Institution: ${safeGet(userData, "institution")}</p>
            <p>Degree: ${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
            <p>Graduation Date: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
            <p>Location: ${safeGet(userData, "institutionLocation")}</p>
          </div>
    
          <!-- Experience -->
          <div class="section" style="padding: 20px; background-color: #f9f9f9; border-left: 4px solid #333;">
            <h4 class="text-xl font-semibold mb-3">Professional Experience</h4>
            <p>Job Title: ${safeGet(userData, "experience.title")}</p>
            <p>Company: ${safeGet(userData, "experience.company")}</p>
            <p>Location: ${safeGet(userData, "experience.location")}</p>
            <p>Dates: ${safeGet(userData, "experience.startMonth")} ${safeGet(userData, "experience.startYear")} - 
              ${safeGet(userData, "experience.currentWork") ? "Present" : `${safeGet(userData, "experience.endMonth")} ${safeGet(userData, "experience.endYear")}`}</p>
          </div>
        </div>
      `;
    
      printStyles = `
  @media print {
    .template4 {
      background-color: #ffffff !important;
      color: #111827 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    .template4 .section {
      background-color: #f9f9f9 !important;
      border-left: 4px solid #333 !important;
      margin-bottom: 20px !important;
    }
    .template4 .profile-pic {
      right: 70px !important;
      top: 65px !important; /* Changed from 40px to 60px to lower the picture */
      width: 140px !important;
      height: 140px !important;
      border: 2px solid #333 !important;
    }
    body {
      margin: 20px !important;
    }
  }
`;
    } else if (template === "template5") {
      // Sidebar with Timeline
      portfolioContent = `
        <div class="template5">
          <!-- Sidebar -->
          <div class="sidebar">
            <!-- Profile Picture -->
            <div style="width: 150px; height: 150px; margin: 0 auto 20px;
                        border-radius: 50%; overflow: hidden; border: 3px solid #4c51bf;">
              <img src="${profilePicSrc}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            
            <!-- Contact Info -->
            <div class="mb-6">
              <h4 class="text-lg font-semibold mb-3">Contact</h4>
              <p>${safeGet(userData, "email")}</p>
              <p>${safeGet(userData, "phone")}</p>
              <p>${safeGet(userData, "city")}, ${safeGet(userData, "division")}</p>
            </div>
    
            <!-- Skills -->
            <div>
              <h4 class="text-lg font-semibold mb-3">Skills</h4>
              <ul style="list-style-type: none; padding-left: 0;">
                ${safeGet(userData, "skills", []).map(skill => `
                  <li>${skill.skill || "N/A"}</li>
                `).join("")}
              </ul>
            </div>
          </div>
    
          <!-- Main Content -->
          <div style="padding-left: 20px;">
            <h1 class="text-3xl font-bold mb-2">${safeGet(userData, "name")} ${safeGet(userData, "surname")}</h1>
            <p class="text-xl mb-6">${safeGet(userData, "profession")}</p>
    
            <!-- Timeline Sections -->
            <div style="padding-left: 20px;">
              <!-- Education -->
              <div class="timeline-item">
                <h4 class="text-xl font-semibold mb-3">Education</h4>
                <p class="font-semibold">${safeGet(userData, "degree")} in ${safeGet(userData, "fieldOfStudy")}</p>
                <p class="text-sm text-gray-600 mb-2">${safeGet(userData, "institution")}</p>
                <p>Graduated: ${safeGet(userData, "graduationMonth")} ${safeGet(userData, "graduationYear")}</p>
                <p>Location: ${safeGet(userData, "institutionLocation")}</p>
              </div>
    
              <!-- Experience -->
              <div class="timeline-item">
                <h4 class="text-xl font-semibold mb-3">Professional Experience</h4>
                <p class="font-semibold">${safeGet(userData, "experience.title")} at ${safeGet(userData, "experience.company")}</p>
                <p class="text-sm text-gray-600 mb-2">
                  ${safeGet(userData, "experience.startMonth")} ${safeGet(userData, "experience.startYear")} - 
                  ${safeGet(userData, "experience.currentWork") ? "Present" : `${safeGet(userData, "experience.endMonth")} ${safeGet(userData, "experience.endYear")}`}
                  ${safeGet(userData, "experience.remote") ? " (Remote)" : ""}
                </p>
                <p>${safeGet(userData, "experience.description")}</p>
              </div>
            </div>
          </div>
        </div>
      `;
    
      printStyles = `
        @media print {
          @media print {
      .template5 {
        display: grid !important;
        grid-template-columns: 250px 1fr !important;
        gap: 20px !important;
        padding: 20px !important;
        position: relative !important;
      }
      .template5::before {
        content: '' !important;
        display: none !important;
        position: absolute !important;
        left: calc(250px + 20px) !important;
        top: 0 !important;
        bottom: 0 !important;
        width: 2px !important;
        background-color: #4299e1 !important;
        transform: translateX(-50%) !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
          .template5 .sidebar {
            background-color: #f7fafc !important;
      padding: 20px !important;
      height: auto !important;
            border-radius: 8px !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
            .template5::after {
      content: '' !important;
      position: absolute !important;
      left: calc(250px + 20px) !important;
      top: 20px !important;
      bottom: 20px !important;
      width: 2px !important;
      background-color: #4299e1 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      z-index: 1 !important;
      height: auto !important; /* Let top/bottom handle height */
    }
          .template5 .timeline-item {
            position: relative !important;
            padding-left: 30px !important;
            margin-bottom: 30px !important;
            border-left: 2px solid #e2e8f0 !important;
          }
          .template5 .timeline-item:before {
            content: '' !important;
            position: absolute !important;
            left: -8px !important;
            top: 0 !important;
            width: 14px !important;
            height: 14px !important;
            border-radius: 50% !important;
            background-color: #4c51bf !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            z-index: 1 !important;
          }
          .template5 img {
            display: block !important;
            margin: 0 auto 20px !important;
          }
          body {
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `;
    }

    // Display the preview
    previewContent.innerHTML = portfolioContent;

    // Store content for printing (with print-specific styles)
    document.getElementById("printable-portfolio").innerHTML = `
      <style>
        body { margin: 0; padding: 20px; }
        img { max-width: 100%; }
        @page { size: A4; margin: 15mm; }
        ${printStyles}
      </style>
      ${portfolioContent}
    `;

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to load preview: " + error.message);
  }
}

function printPortfolio() {
  const printWindow = window.open("", "_blank");
  const printableContent = document.getElementById("printable-portfolio").innerHTML;
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My Portfolio</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        <style>
          body { margin: 0; padding: 20px; }
          img { max-width: 100%; }
          @page { size: A4; margin: 15mm; }
        </style>
      </head>
      <body>
        ${printableContent}
        <script>
          window.onload = function() {
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}