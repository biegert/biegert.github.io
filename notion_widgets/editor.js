(() => {
  // Data and Constants
  let tabs = [];
  let optSections = [];
  const maxTabs = 4, minTabs = 1, maxOpts = 4;

  // Utility functions
  const Utils = {
    createEl: function(tag, options = {}) {
      const el = document.createElement(tag);
      if (options.classes) el.classList.add(...options.classes);
      if (options.attrs) Object.entries(options.attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (options.text) el.textContent = options.text;
      if (options.html) el.innerHTML = options.html;
      return el;
    },
    uniqueId: (() => {
      let id = 0;
      return () => ++id;
    })(),
    showMessage: function(message) {
      const container = document.getElementById("embedLinkContainer");
      container.textContent = message;
      container.classList.add("show");
      setTimeout(() => container.classList.remove("show"), 3000);
    },
    sanitizeText: function(text) {
      return text.trim();
    },
    isValidColor: function(color) {
      return /^#[0-9A-Fa-f]{6}$/.test(color);
    },
    getTextContent: function(element) {
      return element.textContent.trim();
    }
  };

  // Tab Management
  function createTab(name = "New Tab") {
    if (tabs.length >= maxTabs) return;
    const tab = { id: Utils.uniqueId(), name, rows: [] };
    addRowToTab(tab);
    tabs.push(tab);
    renderTabs();
  }

  function addRowToTab(tab, heading = "New Heading", content = "Content") {
    tab.rows.push({ id: Utils.uniqueId(), heading, content });
  }

  function removeRowFromTab(tab, rowId) {
    if (tab.rows.length > 1) {
      tab.rows = tab.rows.filter(r => r.id !== rowId);
      renderTabs();
    }
  }

  // Render Functions
  function renderTabs() {
    const nav = document.getElementById("widgetTabNav");
    const content = document.getElementById("widgetTabContent");
    nav.innerHTML = "";
    content.innerHTML = "";

    tabs.forEach((tab, index) => {
      // Create tab button
      const tabBtn = Utils.createEl("button", {
        attrs: { 
          contenteditable: "plaintext-only",
          "data-tab-id": tab.id
        }
      });
      tabBtn.textContent = tab.name;
      
      tabBtn.classList.toggle("active", index === 0);
      
      // Handle tab switching on click
      tabBtn.addEventListener("click", (e) => {
        if (!e.target.classList.contains('tab-remove')) {
          // Remove active class from all tabs
          nav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked tab
          tabBtn.classList.add('active');
          // Render content for this tab
          renderTabContent(tab);
        }
      });

      // Handle title editing
      tabBtn.addEventListener("input", (e) => {
        // Only update if the change wasn't from removing the x button
        const removeBtn = tabBtn.querySelector('.tab-remove');
        if (!removeBtn || removeBtn.parentNode === tabBtn) {
          tab.name = Utils.sanitizeText(tabBtn.textContent.replace('×', ''));
        }
      });
      
      if (tabs.length > minTabs) {
        const removeBtn = Utils.createEl("span", {
          text: "×",
          classes: ["tab-remove"],
          attrs: { contenteditable: "false" }
        });
        removeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          tabs = tabs.filter(t => t.id !== tab.id);
          renderTabs();
        });
        tabBtn.appendChild(removeBtn);
      }
      
      nav.appendChild(tabBtn);
    });

    // Render content for first tab
    if (tabs.length) renderTabContent(tabs[0]);
    
    document.getElementById("addTab").style.display = 
      tabs.length >= maxTabs ? "none" : "block";
  }

  function renderTabContent(tab) {
    const contentDiv = document.getElementById("widgetTabContent");
    contentDiv.innerHTML = "";

    tab.rows.forEach(row => {
      const rowContainer = Utils.createEl("div", { classes: ["row-container"] });
      
      const heading = Utils.createEl("div", {
        classes: ["row-heading", "editable"],
        attrs: { contenteditable: "true" }
      });
      heading.textContent = row.heading;
      heading.addEventListener("input", () => {
        row.heading = Utils.sanitizeText(heading.innerText); // Use innerText to preserve line breaks
      });
      
      const content = Utils.createEl("div", {
        classes: ["row-content", "editable"],
        attrs: { contenteditable: "true" }
      });
      content.textContent = row.content;
      content.addEventListener("input", () => {
        row.content = Utils.sanitizeText(content.innerText); // Use innerText to preserve line breaks
      });
      
      const controls = Utils.createEl("div", { classes: ["row-edit-controls"] });
      
      if (tab.rows.length > 1) {
        const removeBtn = Utils.createEl("button", {
          classes: ["icon-button"],
          text: "×",
          attrs: { title: "Remove Row" }
        });
        removeBtn.addEventListener("click", () => removeRowFromTab(tab, row.id));
        controls.appendChild(removeBtn);
      }
      
      const addBtn = Utils.createEl("button", {
        classes: ["icon-button"],
        text: "+",
        attrs: { title: "Add Row Below" }
      });
      addBtn.addEventListener("click", () => {
        addRowToTab(tab);
        renderTabs();
      });
      controls.appendChild(addBtn);
      
      rowContainer.append(heading, content, controls);
      contentDiv.appendChild(rowContainer);
    });
  }

  function renderOptSections() {
    const container = document.getElementById("widgetOptional");
    container.innerHTML = "";
    
    optSections.forEach(opt => {
      const section = Utils.createEl("div", { classes: ["opt-section-container"] });
      
      const heading = Utils.createEl("div", {
        classes: ["optional-heading", "editable"],
        attrs: { contenteditable: "true" }
      });
      heading.textContent = opt.heading;
      heading.addEventListener("input", () => {
        opt.heading = Utils.sanitizeText(heading.innerText); // Use innerText to preserve line breaks
      });
      
      const content = Utils.createEl("div", {
        classes: ["optional-content", "editable"],
        attrs: { contenteditable: "true" }
      });
      content.textContent = opt.content;
      content.addEventListener("input", () => {
        opt.content = Utils.sanitizeText(content.innerText); // Use innerText to preserve line breaks
      });
      
      const removeBtn = Utils.createEl("button", {
        classes: ["icon-button"],
        text: "×",
        attrs: { title: "Remove Section" }
      });
      removeBtn.addEventListener("click", () => {
        optSections = optSections.filter(o => o.id !== opt.id);
        renderOptSections();
      });
      
      section.append(heading, content, removeBtn);
      container.appendChild(section);
    });
    
    document.getElementById("addOptional").style.display = 
      optSections.length >= maxOpts ? "none" : "block";
  }

  // URL and Data Management
  function buildEmbedUrl() {
    const headColor = document.getElementById("headingColor").value;
    if (!Utils.isValidColor(headColor)) {
      Utils.showMessage("Invalid header color");
      return null;
    }

    const config = {
      cat: Utils.getTextContent(document.getElementById("widgetCategory")),
      dept: Utils.getTextContent(document.getElementById("widgetDepartment")),
      title: Utils.getTextContent(document.getElementById("widgetTitle")),
      desc: Utils.getTextContent(document.getElementById("widgetDescription")),
      headColor: headColor,
      tabs: tabs.map(tab => ({
        name: Utils.sanitizeText(tab.name),
        rows: tab.rows.map(r => ({ 
          heading: Utils.sanitizeText(r.heading), 
          content: Utils.sanitizeText(r.content) 
        }))
      })),
      opt_sections: optSections.map(opt => ({ 
        heading: Utils.sanitizeText(opt.heading), 
        content: Utils.sanitizeText(opt.content) 
      }))
    };

    const json = JSON.stringify(config);
    const compressed = LZString.compressToEncodedURIComponent(json);
    // Use URL constructor to handle path resolution
    const widgetUrl = new URL('widget.html', window.location.href);
    return `${widgetUrl.href}?data=${compressed}`;
  }

  function loadWidget(link) {
    try {
      const url = new URL(link);
      const params = new URLSearchParams(url.search);
      const compressedData = params.get("data");

      if (!compressedData) {
        Utils.showMessage("No valid data found in URL");
        return;
      }

      const json = LZString.decompressFromEncodedURIComponent(compressedData);
      const config = JSON.parse(json);

      // Update basic content
      document.getElementById("widgetCategory").textContent = config.cat || "";
      document.getElementById("widgetDepartment").textContent = config.dept || "";
      document.getElementById("widgetTitle").textContent = config.title || "";
      document.getElementById("widgetDescription").textContent = config.desc || "";
      document.getElementById("headingColor").value = config.headColor || "#508b8b";
      document.getElementById("widgetHeader").style.background = config.headColor || "#508b8b";

      // Update tabs
      tabs = (config.tabs || []).map(t => ({
        id: Utils.uniqueId(),
        name: t.name,
        rows: t.rows.map(r => ({
          id: Utils.uniqueId(),
          heading: r.heading,
          content: r.content
        }))
      }));

      // Update optional sections
      optSections = (config.opt_sections || []).map(o => ({
        id: Utils.uniqueId(),
        heading: o.heading,
        content: o.content
      }));

      renderTabs();
      renderOptSections();
    } catch (e) {
      Utils.showMessage("Invalid embed link");
    }
  }

  // Event Listeners
  document.getElementById("headingColor").addEventListener("input", (e) => {
    const color = e.target.value;
    if (Utils.isValidColor(color)) {
      document.getElementById("widgetHeader").style.background = color;
    }
  });

  document.getElementById("addTab").addEventListener("click", () => createTab());
  
  document.getElementById("addOptional").addEventListener("click", () => {
    if (optSections.length < maxOpts) {
      optSections.push({
        id: Utils.uniqueId(),
        heading: "New Optional Section",
        content: "Optional content"
      });
      renderOptSections();
    }
  });

  document.getElementById("generateLink").addEventListener("click", () => {
    const embedUrl = buildEmbedUrl();
    if (embedUrl) {
      navigator.clipboard.writeText(embedUrl)
        .then(() => Utils.showMessage("Embed link copied to clipboard!"))
        .catch(() => Utils.showMessage("Failed to copy embed link"));
    }
  });

  document.getElementById("loadWidget").addEventListener("click", () => {
    const link = document.getElementById("loadLink").value.trim();
    if (link) loadWidget(link);
  });

  // Initialize widget with consistent default color
  document.getElementById("headingColor").value = "#508b8b";
  createTab("Tab 1");
  renderTabs();
  renderOptSections();
})();
