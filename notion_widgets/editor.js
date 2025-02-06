let tabs = [];
let optSections = [];
let tabCounter = 0, optCounter = 0;
const maxTabs = 4, minTabs = 1, maxOpts = 4;

function createTab(name = "Tab " + (tabCounter + 1)) {
  const tabId = tabCounter++;
  const tab = { id: tabId, name, rows: [] };
  addRowToTab(tab);
  tabs.push(tab);
  renderTabs();
}

function addRowToTab(tab, heading = "", content = "") {
  const rowId = Date.now() + Math.random();
  tab.rows.push({ id: rowId, heading, content });
}

function removeRowFromTab(tab, rowId) {
  if (tab.rows.length > 1) {
    tab.rows = tab.rows.filter(r => r.id !== rowId);
  }
}

function renderTabs() {
  const container = document.getElementById("tabsContainer");
  container.innerHTML = "";
  tabs.forEach((tab) => {
    const tabDiv = document.createElement("div");
    tabDiv.className = "tab-block";
    tabDiv.style.border = "1px solid #ccc";
    tabDiv.style.padding = "10px";
    tabDiv.style.marginBottom = "10px";
    tabDiv.dataset.tabId = tab.id;
    
    const headerRow = document.createElement("div");
    headerRow.style.display = "flex";
    headerRow.style.justifyContent = "space-between";
    
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = tab.name;
    nameInput.style.flex = "1";
    nameInput.addEventListener("input", () => {
      tab.name = nameInput.value;
      updatePreview();
    });
    headerRow.appendChild(nameInput);
    
    if (tabs.length > minTabs) {
      const removeTabBtn = document.createElement("button");
      removeTabBtn.textContent = "Remove";
      removeTabBtn.className = "remove small-btn";
      removeTabBtn.addEventListener("click", () => {
        tabs = tabs.filter(t => t.id !== tab.id);
        renderTabs();
        updatePreview();
      });
      headerRow.appendChild(removeTabBtn);
    }
    tabDiv.appendChild(headerRow);
    
    const rowsContainer = document.createElement("div");
    rowsContainer.style.marginTop = "10px";
    tab.rows.forEach(row => {
      const rowDiv = document.createElement("div");
      rowDiv.className = "row";
      
      const rowHeading = document.createElement("input");
      rowHeading.type = "text";
      rowHeading.placeholder = "Row Heading";
      rowHeading.value = row.heading;
      rowHeading.addEventListener("input", () => {
        row.heading = rowHeading.value;
        updatePreview();
      });
      rowDiv.appendChild(rowHeading);
      
      const rowContent = document.createElement("textarea");
      rowContent.rows = 2;
      rowContent.placeholder = "Row Content";
      rowContent.value = row.content;
      rowContent.addEventListener("input", () => {
        row.content = rowContent.value;
        updatePreview();
      });
      rowDiv.appendChild(rowContent);
      
      if (tab.rows.length > 1) {
        const removeRowBtn = document.createElement("button");
        removeRowBtn.textContent = "Remove Row";
        removeRowBtn.className = "remove small-btn";
        removeRowBtn.addEventListener("click", () => {
          removeRowFromTab(tab, row.id);
          renderTabs();
          updatePreview();
        });
        rowDiv.appendChild(removeRowBtn);
      }
      rowsContainer.appendChild(rowDiv);
    });
    tabDiv.appendChild(rowsContainer);
    
    const addRowBtn = document.createElement("button");
    addRowBtn.textContent = "Add Row";
    addRowBtn.className = "small-btn";
    addRowBtn.addEventListener("click", () => {
      addRowToTab(tab);
      renderTabs();
      updatePreview();
    });
    tabDiv.appendChild(addRowBtn);
    
    container.appendChild(tabDiv);
  });
  document.getElementById("addTab").disabled = (tabs.length >= maxTabs);
  updatePreview();
}

function renderOptSections() {
  const container = document.getElementById("optContainer");
  container.innerHTML = "";
  optSections.forEach(opt => {
    const optDiv = document.createElement("div");
    optDiv.style.border = "1px solid #ccc";
    optDiv.style.padding = "10px";
    optDiv.style.marginBottom = "10px";
    optDiv.dataset.optId = opt.id;
    
    const headingInput = document.createElement("input");
    headingInput.type = "text";
    headingInput.placeholder = "Optional Heading";
    headingInput.value = opt.heading;
    headingInput.addEventListener("input", () => {
      opt.heading = headingInput.value;
      updatePreview();
    });
    optDiv.appendChild(headingInput);
    
    const contentInput = document.createElement("textarea");
    contentInput.rows = 2;
    contentInput.placeholder = "Optional Content";
    contentInput.value = opt.content;
    contentInput.addEventListener("input", () => {
      opt.content = contentInput.value;
      updatePreview();
    });
    optDiv.appendChild(contentInput);
    
    const removeOptBtn = document.createElement("button");
    removeOptBtn.textContent = "Remove";
    removeOptBtn.className = "remove small-btn";
    removeOptBtn.addEventListener("click", () => {
      optSections = optSections.filter(o => o.id !== opt.id);
      renderOptSections();
      updatePreview();
    });
    optDiv.appendChild(removeOptBtn);
    
    container.appendChild(optDiv);
  });
  document.getElementById("addOpt").disabled = (optSections.length >= maxOpts);
  updatePreview();
}

function updatePreview() {
  document.getElementById("previewCategory").textContent = document.getElementById("category").value;
  document.getElementById("previewDepartment").textContent = document.getElementById("department").value;
  document.getElementById("previewTitle").textContent = document.getElementById("title").value;
  document.getElementById("previewDescription").textContent = document.getElementById("description").value;
  document.getElementById("previewHeader").style.background = document.getElementById("headingColor").value;
  
  const nav = document.getElementById("previewTabNav");
  nav.innerHTML = "";
  tabs.forEach((tab, index) => {
    const btn = document.createElement("button");
    btn.textContent = tab.name;
    btn.className = index === 0 ? "active" : "";
    btn.addEventListener("click", () => renderTabContent(tab));
    nav.appendChild(btn);
  });
  if (tabs.length) renderTabContent(tabs[0]);
  
  const optDiv = document.getElementById("previewOptional");
  optDiv.innerHTML = "";
  if (optSections.length > 0) {
    optSections.forEach(opt => {
      const h = document.createElement("div");
      h.style.fontWeight = "bold";
      h.textContent = opt.heading;
      const p = document.createElement("div");
      p.style.color = "gray";
      p.textContent = opt.content;
      optDiv.appendChild(h);
      optDiv.appendChild(p);
    });
  }
}

function renderTabContent(tab) {
  document.querySelectorAll("#previewTabNav button").forEach((btn, idx) => {
    btn.classList.toggle("active", tabs[idx].id === tab.id);
  });
  const contentDiv = document.getElementById("previewTabContent");
  contentDiv.innerHTML = "";
  tab.rows.forEach(row => {
    const h = document.createElement("div");
    h.style.fontSize = "14px";
    h.style.color = "gray";
    h.textContent = row.heading;
    const p = document.createElement("div");
    p.style.fontWeight = "bold";
    p.style.fontSize = "16px";
    p.textContent = row.content;
    contentDiv.appendChild(h);
    contentDiv.appendChild(p);
  });
}

document.querySelectorAll("#category, #department, #title, #description, #headingColor")
  .forEach(el => el.addEventListener("input", updatePreview));

document.getElementById("addTab").addEventListener("click", () => {
  createTab();
});

document.getElementById("addOpt").addEventListener("click", () => {
  const newOpt = { id: optCounter++, heading: "", content: "" };
  optSections.push(newOpt);
  renderOptSections();
});

document.getElementById("generateLink").addEventListener("click", () => {
  const params = new URLSearchParams();
  params.set("cat", document.getElementById("category").value);
  params.set("dept", document.getElementById("department").value);
  params.set("title", document.getElementById("title").value);
  params.set("desc", document.getElementById("description").value);
  params.set("headColor", document.getElementById("headingColor").value);
  
  const tabsData = tabs.map(tab => ({
    name: tab.name,
    rows: tab.rows.map(r => ({ heading: r.heading, content: r.content }))
  }));
  params.set("tabs", JSON.stringify(tabsData));
  params.set("opt_sections", JSON.stringify(optSections.map(opt => ({ heading: opt.heading, content: opt.content }))));
  
  const embedUrl = window.location.origin +
    window.location.pathname.replace('editor.html', 'widget.html') + "?" + params.toString();
  
  navigator.clipboard.writeText(embedUrl).then(() => {
    const container = document.getElementById("embedLinkContainer");
    container.textContent = "Embed link copied to clipboard!";
    setTimeout(() => { container.textContent = ""; }, 3000);
  });
});

document.getElementById("loadWidget").addEventListener("click", () => {
  const link = document.getElementById("loadLink").value.trim();
  if (!link) return;
  try {
    const url = new URL(link);
    const params = new URLSearchParams(url.search);

    // Update basic fields.
    document.getElementById("category").value = params.get("cat") || "";
    document.getElementById("department").value = params.get("dept") || "";
    document.getElementById("title").value = params.get("title") || "";
    document.getElementById("description").value = params.get("desc") || "";
    document.getElementById("headingColor").value = params.get("headColor") || "#009688";

    // Parse and update tabs
    const parsedTabs = JSON.parse(params.get("tabs") || "[]");
    tabs = [];
    tabCounter = 0;
    parsedTabs.forEach(t => {
      let newTab = { id: tabCounter++, name: t.name, rows: [] };
      t.rows.forEach(r => {
        newTab.rows.push({ id: Date.now() + Math.random(), heading: r.heading, content: r.content });
      });
      tabs.push(newTab);
    });

    // Parse and update optional sections.
    const parsedOpts = JSON.parse(params.get("opt_sections") || "[]");
    optSections = [];
    optCounter = 0;
    parsedOpts.forEach(o => {
      optSections.push({ id: optCounter++, heading: o.heading, content: o.content });
    });

    renderTabs();
    renderOptSections();
    updatePreview();
  } catch(e) {
    alert("Invalid embed link");
  }
});


createTab();
renderTabs();
renderOptSections();
updatePreview();
