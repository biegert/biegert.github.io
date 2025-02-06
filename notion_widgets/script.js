document.addEventListener("DOMContentLoaded", function() {
  const surgeryNameInput = document.getElementById("surgeryName");
  const sectionsContainer = document.getElementById("sectionsContainer");
  const addSectionBtn = document.getElementById("addSectionBtn");
  const generateLinkBtn = document.getElementById("generateLink");
  const previewTitle = document.getElementById("previewTitle");
  const previewContent = document.getElementById("previewContent");

  // Update the live preview
  function updatePreview() {
    // Update the main title or fallback to default text
    previewTitle.textContent = surgeryNameInput.value.trim() || "Summary Box";

    // Clear existing preview sections
    previewContent.innerHTML = "";

    // For each section, add a preview block
    const sectionElements = sectionsContainer.querySelectorAll(".section");
    sectionElements.forEach((sectionElem, index) => {
      const titleInput = sectionElem.querySelector(".section-title");
      const contentInput = sectionElem.querySelector(".section-content");
      const title = titleInput.value.trim() || `Section ${index + 1}`;
      const content = contentInput.value.trim() || "";
      
      const previewSection = document.createElement("div");
      previewSection.className = "preview-section";
      previewSection.innerHTML = `
        <div class="preview-section-title">${title}</div>
        <div class="preview-section-content">${content}</div>
      `;
      previewContent.appendChild(previewSection);
    });
  }

  // Create a new section in the editor
  function createSection() {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "section";

    // Section title input
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Section Title:";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "section-title";
    titleInput.placeholder = "Enter section title";

    // Section content input
    const contentLabel = document.createElement("label");
    contentLabel.textContent = "Section Content:";
    const contentInput = document.createElement("textarea");
    contentInput.className = "section-content";
    contentInput.rows = 3;
    contentInput.placeholder = "Enter section content";

    // Remove button for the section
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "remove-section";
    removeBtn.addEventListener("click", function(e) {
      e.preventDefault();
      sectionsContainer.removeChild(sectionDiv);
      updatePreview();
    });

    // Update preview when user types
    titleInput.addEventListener("input", updatePreview);
    contentInput.addEventListener("input", updatePreview);

    // Append all elements
    sectionDiv.appendChild(removeBtn);
    sectionDiv.appendChild(titleLabel);
    sectionDiv.appendChild(titleInput);
    sectionDiv.appendChild(contentLabel);
    sectionDiv.appendChild(contentInput);
    
    sectionsContainer.appendChild(sectionDiv);
  }

  // Update preview when surgery name changes
  surgeryNameInput.addEventListener("input", updatePreview);

  // Add an initial section when the page loads
  createSection();

  // Add section button click handler
  addSectionBtn.addEventListener("click", function(e) {
    e.preventDefault();
    createSection();
  });

  // Generate embed link by serializing all data into URL parameters
  generateLinkBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("surgeryName", surgeryNameInput.value);

    // Loop over each section to get title and content values
    const sections = sectionsContainer.querySelectorAll(".section");
    sections.forEach((section, index) => {
      const title = section.querySelector(".section-title").value;
      const content = section.querySelector(".section-content").value;
      params.append(`sectionTitle${index}`, title);
      params.append(`sectionContent${index}`, content);
    });
    // Pass section count to help reconstruct the widget later
    params.append("sectionCount", sections.length);

    // Replace 'username' and 'notion-widgets' with your GitHub Pages details.
    const embedURL = `https://username.github.io/notion-widgets/widget.html?${params.toString()}`;
    prompt("Embed URL (copy and paste into Notion):", embedURL);
  });
});
