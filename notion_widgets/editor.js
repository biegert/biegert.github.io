(() => {
  // Utility functions
  const Utils = {
    createEl: function(tag, options = {}) {
      const el = document.createElement(tag);
      if (options.classes) {
        options.classes.forEach(cls => el.classList.add(cls));
      }
      if (options.attrs) {
        for (const key in options.attrs) {
          el.setAttribute(key, options.attrs[key]);
        }
      }
      if (options.text) {
        el.textContent = options.text;
      }
      return el;
    },
    uniqueId: (() => {
      let id = 0;
      return () => ++id;
    })(),
    debounce: function(func, delay) {
      let timeout;
      return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
      };
    }
  };

  // Data and Constants
  let tabs = [];
  let optSections = [];
  const maxTabs = 4, minTabs = 1, maxOpts = 4;
  const updatePreviewDebounced = Utils.debounce(updatePreview, 300);

  // Tab & Row Functions
  function createTab(name = "Tab " + (tabs.length + 1)) {
    const tab = { id: Utils.uniqueId(), name, rows: [] };
    addRowToTab(tab);
    tabs.push(tab);
    renderTabs();
  }

  function addRowToTab(tab, heading = "", content = "") {
    tab.rows.push({ id: Utils.uniqueId(), heading, content });
  }

  function removeRowFromTab(tab, rowId) {
    if (tab.rows.length > 1) {
      tab.rows = tab.rows.filter(r => r.id !== rowId);
    }
  }

  // Render Tabs
  function renderTabs() {
    const container = document.getElementById("tabsContainer");
    container.innerHTML = "";
    tabs.forEach(tab => {
      const tabDiv = Utils.createEl("div", { classes: ["tab-block"] });
      tabDiv.dataset.tabId = tab.id;

      // Header row for tab name and remove button
      const headerRow = Utils.createEl("div", { classes: ["tab-header"] });
      const nameInput = Utils.createEl("input", { classes: ["tab-name-input"] });
      nameInput.type = "text";
      nameInput.value = tab.name;
      nameInput.addEventListener("input", () => {
        tab.name = nameInput.value;
        updatePreviewDebounced();
      });
      headerRow.appendChild(nameInput);

      if (tabs.length > minTabs) {
        const removeTabBtn = Utils.createEl("button", { text: "Remove", classes: ["remove", "small-btn", "tab-remove-btn"] });
        removeTabBtn.addEventListener("click", () => {
          tabs = tabs.filter(t => t.id !== tab.id);
          renderTabs();
          updatePreviewDebounced();
        });
        headerRow.appendChild(removeTabBtn);
      }
      tabDiv.appendChild(headerRow);

      // Rows container for each tab
      const rowsContainer = Utils.createEl("div", { classes: ["rows-container"] });
      tab.rows.forEach(row => {
        const rowDiv = Utils.createEl("div", { classes: ["row"] });

        const rowHeading = Utils.createEl("input", { classes: ["row-heading-input"] });
        rowHeading.type = "text";
        rowHeading.placeholder = "Row Heading";
        rowHeading.value = row.heading;
        rowHeading.addEventListener("input", () => {
          row.heading = rowHeading.value;
          updatePreviewDebounced();
        });
        rowDiv.appendChild(rowHeading);

        const rowContent = Utils.createEl("textarea", { classes: ["row-content-textarea"] });
        rowContent.rows = 2;
        rowContent.placeholder = "Row Content";
        rowContent.value = row.content;
        rowContent.addEventListener("input", () => {
          row.content = rowContent.value;
          updatePreviewDebounced();
        });
        rowDiv.appendChild(rowContent);

        if (tab.rows.length > 1) {
          const removeRowBtn = Utils.createEl("button", { text: "Remove Row", classes: ["remove", "small-btn", "row-remove-btn"] });
          removeRowBtn.addEventListener("click", () => {
            removeRowFromTab(tab, row.id);
            renderTabs();
            updatePreviewDebounced();
          });
          rowDiv.appendChild(removeRowBtn);
        }
        rowsContainer.appendChild(rowDiv);
      });
      tabDiv.appendChild(rowsContainer);

      // Button to add a new row
      const addRowBtn = Utils.createEl("button", { text: "Add Row", classes: ["small-btn", "add-row-btn", "primary"] });
      addRowBtn.addEventListener("click", () => {
        addRowToTab(tab);
        renderTabs();
        updatePreviewDebounced();
      });
      tabDiv.appendChild(addRowBtn);
      container.appendChild(tabDiv);
    });
    document.getElementById("addTab").disabled = (tabs.length >= maxTabs);
    updatePreviewDebounced();
  }

  // Render Optional Sections
  function renderOptSections() {
    const container = document.getElementById("optContainer");
    container.innerHTML = "";
    optSections.forEach(opt => {
      const optDiv = Utils.createEl("div", { classes: ["opt-section-block"] });
      optDiv.dataset.optId = opt.id;

      const headingInput = Utils.createEl("input", { classes: ["opt-heading-input"] });
      headingInput.type = "text";
      headingInput.placeholder = "Optional Heading";
      headingInput.value = opt.heading;
      headingInput.addEventListener("input", () => {
        opt.heading = headingInput.value;
        updatePreviewDebounced();
      });
      optDiv.appendChild(headingInput);

      const contentInput = Utils.createEl("textarea", { classes: ["opt-content-textarea"] });
      contentInput.rows = 2;
      contentInput.placeholder = "Optional Content";
      contentInput.value = opt.content;
      contentInput.addEventListener("input", () => {
        opt.content = contentInput.value;
        updatePreviewDebounced();
      });
      optDiv.appendChild(contentInput);

      const removeOptBtn = Utils.createEl("button", { text: "Remove", classes: ["remove", "small-btn", "opt-remove-btn"] });
      removeOptBtn.addEventListener("click", () => {
        optSections = optSections.filter(o => o.id !== opt.id);
        renderOptSections();
        updatePreviewDebounced();
      });
      optDiv.appendChild(removeOptBtn);

      container.appendChild(optDiv);
    });
    document.getElementById("addOpt").disabled = (optSections.length >= maxOpts);
    updatePreviewDebounced();
  }

  // Update live preview
  function updatePreview() {
    document.getElementById("previewCategory").textContent = document.getElementById("category").value;
    document.getElementById("previewDepartment").textContent = document.getElementById("department").value;
    document.getElementById("previewTitle").textContent = document.getElementById("title").value;
    document.getElementById("previewDescription").textContent = document.getElementById("description").value;
    document.getElementById("previewHeader").style.background = document.getElementById("headingColor").value;

    // Build tab navigation
    const nav = document.getElementById("previewTabNav");
    nav.innerHTML = "";
    tabs.forEach((tab, index) => {
      const btn = Utils.createEl("button", { text: tab.name });
      btn.classList.toggle("active", index === 0);
      btn.addEventListener("click", () => renderTabContent(tab));
      nav.appendChild(btn);
    });
    if (tabs.length) renderTabContent(tabs[0]);

    // Render optional sections
    const optDiv = document.getElementById("previewOptional");
    optDiv.innerHTML = "";
    if (optSections.length > 0) {
      optSections.forEach(opt => {
        const h = Utils.createEl("div", { text: opt.heading });
        h.className = "optional-heading";
        const p = Utils.createEl("div", { text: opt.content });
        p.className = "optional-content";
        optDiv.appendChild(h);
        optDiv.appendChild(p);
      });
    }
  }

  // Render content for a selected tab
  function renderTabContent(tab) {
    document.querySelectorAll("#previewTabNav button").forEach((btn, idx) => {
      btn.classList.toggle("active", tabs[idx].id === tab.id);
    });
    const contentDiv = document.getElementById("previewTabContent");
    contentDiv.innerHTML = "";
    tab.rows.forEach(row => {
      const h = Utils.createEl("div", { text: row.heading });
      h.className = "row-heading";
      const p = Utils.createEl("div", { text: row.content });
      p.className = "row-content";
      contentDiv.appendChild(h);
      contentDiv.appendChild(p);
    });
  }

  // Build the embed URL using URLSearchParams (with proper encoding)
  function buildEmbedUrl() {
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

    const widgetPath = window.location.pathname.replace('editor.html', 'widget.html');
    return `${window.location.origin}${widgetPath}?${params.toString()}`;
  }

  // Attach event listeners for basic fields
  document.querySelectorAll("#category, #department, #title, #description, #headingColor")
    .forEach(el => el.addEventListener("input", updatePreviewDebounced));

  document.getElementById("addTab").addEventListener("click", () => createTab());
  document.getElementById("addOpt").addEventListener("click", () => {
    const newOpt = { id: Utils.uniqueId(), heading: "", content: "" };
    optSections.push(newOpt);
    renderOptSections();
  });

  document.getElementById("generateLink").addEventListener("click", () => {
    const embedUrl = buildEmbedUrl();
    navigator.clipboard.writeText(embedUrl)
      .then(() => {
        const container = document.getElementById("embedLinkContainer");
        container.textContent = "Embed link copied to clipboard!";
        setTimeout(() => { container.textContent = ""; }, 3000);
      })
      .catch(() => alert("Failed to copy embed link"));
  });

  document.getElementById("loadWidget").addEventListener("click", () => {
    const link = document.getElementById("loadLink").value.trim();
    if (!link) return;
    try {
      const url = new URL(link);
      const params = new URLSearchParams(url.search);

      // Update basic fields
      document.getElementById("category").value = params.get("cat") || "";
      document.getElementById("department").value = params.get("dept") || "";
      document.getElementById("title").value = params.get("title") || "";
      document.getElementById("description").value = params.get("desc") || "";
      document.getElementById("headingColor").value = params.get("headColor") || "#009688";

      // Parse and update tabs
      const parsedTabs = JSON.parse(params.get("tabs") || "[]");
      tabs = [];
      parsedTabs.forEach(t => {
        const newTab = { id: Utils.uniqueId(), name: t.name, rows: [] };
        t.rows.forEach(r => {
          newTab.rows.push({ id: Utils.uniqueId(), heading: r.heading, content: r.content });
        });
        tabs.push(newTab);
      });

      // Parse and update optional sections
      const parsedOpts = JSON.parse(params.get("opt_sections") || "[]");
      optSections = [];
      parsedOpts.forEach(o => {
        optSections.push({ id: Utils.uniqueId(), heading: o.heading, content: o.content });
      });

      renderTabs();
      renderOptSections();
      updatePreviewDebounced();
    } catch (e) {
      alert("Invalid embed link");
    }
  });

  // Initial rendering
  createTab();
  renderTabs();
  renderOptSections();
  updatePreviewDebounced();
})();
