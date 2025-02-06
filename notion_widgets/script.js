document.addEventListener("DOMContentLoaded", function() {
  const titleInput = document.getElementById("surgeryName");
  const colorSelect = document.getElementById("colorBandSelect");
  const sectionsContainer = document.getElementById("sectionsContainer");
  const previewHeader = document.getElementById("previewHeader");
  const previewTitle = document.getElementById("previewTitle");
  const previewTabs = document.getElementById("previewTabs");
  const previewSections = document.getElementById("previewSections");

  function updatePreview() {
    previewTitle.textContent = titleInput.value.trim() || "Title";
    previewHeader.style.backgroundColor = colorSelect.value;

    previewTabs.innerHTML = "";
    previewSections.innerHTML = "";

    const sectionElements = sectionsContainer.querySelectorAll(".section");
    sectionElements.forEach((sectionElem, index) => {
      const title = sectionElem.querySelector(".section-title").value || `Section ${index + 1}`;
      const content = sectionElem.querySelector(".section-content").value || "";

      // Tabs
      const tab = document.createElement("span");
      tab.textContent = title;
      if (index === 0) tab.classList.add("active");
      previewTabs.appendChild(tab);

      // Content
      const sectionRow = document.createElement("div");
      sectionRow.className = "row";
      sectionRow.innerHTML = `<span class="label">${title}</span><span class="value">${content}</span>`;
      previewSections.appendChild(sectionRow);
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

    const contentLabel = document.createElement("label");
    contentLabel.textContent = "Section Content:";
    const contentInput = document.createElement("textarea");
    contentInput.className = "section-content";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.className = "remove-section";
    removeBtn.addEventListener("click", function() {
      sectionsContainer.removeChild(sectionDiv);
      updatePreview();
    });

    titleInput.addEventListener("input", updatePreview);
    contentInput.addEventListener("input", updatePreview);

    sectionDiv.append(removeBtn, titleLabel, titleInput, contentLabel, contentInput);
    sectionsContainer.appendChild(sectionDiv);
  }

  titleInput.addEventListener("input", updatePreview);
  colorSelect.addEventListener("change", updatePreview);

  document.getElementById("addSectionBtn").addEventListener("click", createSection);

  updatePreview();
});
