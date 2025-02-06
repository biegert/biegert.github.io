document.addEventListener("DOMContentLoaded", function() {
  const surgeryNameInput = document.getElementById("surgeryName");
  const colorBandSelect = document.getElementById("colorBandSelect");
  const sectionsContainer = document.getElementById("sectionsContainer");
  const addSectionBtn = document.getElementById("addSectionBtn");
  const generateLinkBtn = document.getElementById("generateLink");
  const previewTitle = document.getElementById("previewTitle");
  const previewContent = document.getElementById("previewContent");
  const previewColorBand = document.getElementById("previewColorBand");

  function updatePreview() {
    previewTitle.textContent = surgeryNameInput.value.trim() || "Summary Box";
    previewColorBand.style.backgroundColor = colorBandSelect.value;
    previewContent.innerHTML = "";

    const sectionElements = sectionsContainer.querySelectorAll(".section");
    sectionElements.forEach((sectionElem, index) => {
      const titleInput = sectionElem.querySelector(".section-title");
      const contentInput = sectionElem.querySelector(".section-content");
      const title = titleInput.value.trim() || `Section ${index + 1}`;
      const content = contentInput.value.trim() || "";
      
      const sectionDiv = document.createElement("div");
      sectionDiv.className = "preview-section";
      sectionDiv.innerHTML = `
        <div class="preview-section-title">${title}</div>
        <div class="preview-section-content">${content}</div>
      `;
      previewContent.appendChild(sectionDiv);
    });
  }

  function createSection() {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "section";
    
    const titleLabel = document.createElement("label");
    titleLabel.textContent = "Section Title:";
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.className = "section-title";
    titleInput.placeholder = "Enter section title";
    
    const contentLabel = document.createElement("label");
    contentLabel.textContent = "Section Content:";
    const contentInput = document.createElement("textarea");
    contentInput.className = "section-content";
    contentInput.rows = 3;
    contentInput.placeholder = "Enter section content";
    
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "remove-section";
    removeBtn.addEventListener("click", function(e) {
      e.preventDefault();
      sectionsContainer.removeChild(sectionDiv);
      updatePreview();
    });
    
    titleInput.addEventListener("input", updatePreview);
    contentInput.addEventListener("input", updatePreview);
    
    sectionDiv.appendChild(removeBtn);
    sectionDiv.appendChild(titleLabel);
    sectionDiv.appendChild(titleInput);
    sectionDiv.appendChild(contentLabel);
    sectionDiv.appendChild(contentInput);
    
    sectionsContainer.appendChild(sectionDiv);
  }

  surgeryNameInput.addEventListener("input", updatePreview);
  colorBandSelect.addEventListener("change", updatePreview);
  
  // Add an initial section
  createSection();
  
  addSectionBtn.addEventListener("click", function(e) {
    e.preventDefault();
    createSection();
  });

  generateLinkBtn.addEventListener("click", function(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.append("surgeryName", surgeryNameInput.value);
    params.append("colorBand", colorBandSelect.value);
    
    const sections = sectionsContainer.querySelectorAll(".section");
    sections.forEach((section, index) => {
      const title = section.querySelector(".section-title").value;
      const content = section.querySelector(".section-content").value;
      params.append(`sectionTitle${index}`, title);
      params.append(`sectionContent${index}`, content);
    });
    params.append("sectionCount", sections.length);
    
    // Replace 'username' and 'notion-widgets' with your actual GitHub Pages details.
    const embedURL = `https://username.github.io/notion-widgets/widget.html?${params.toString()}`;
    prompt("Embed URL (copy and paste into Notion):", embedURL);
  });
  
  updatePreview();
});
