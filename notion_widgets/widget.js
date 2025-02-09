(() => {
  const Utils = {
    getParam: function(param) {
      const params = new URLSearchParams(window.location.search);
      return params.get(param) || "";
    }
  };

  // Retrieve and decompress the configuration
  const compressedData = Utils.getParam("data");
  let config = {};
  try {
    const json = LZString.decompressFromEncodedURIComponent(compressedData);
    config = JSON.parse(json);
  } catch (e) {
    // Fallback default configuration
    config = {
      cat: "Header Left",
      dept: "Header Right",
      title: "Procedure Title",
      desc: "Description",
      headColor: "#009688",
      tabs: [{
        name: "Anästhesie",
        rows: [{ heading: "Overview", content: "Details regarding anesthesia protocols." }]
      }],
      opt_sections: []
    };
  }

  // Set header and basic text elements
  document.getElementById("widgetCategory").innerHTML = config.cat;
  document.getElementById("widgetDepartment").innerHTML = config.dept;
  document.getElementById("widgetTitle").innerHTML = config.title;
  document.getElementById("widgetDescription").innerHTML = config.desc;
  document.getElementById("widgetHeader").style.background = config.headColor || "#009688";

  // Use config.tabs for tab navigation
  let tabsData = config.tabs || [];
  const tabNav = document.getElementById("widgetTabNav");
  tabsData.forEach((tab, index) => {
    const btn = document.createElement("button");
    btn.textContent = tab.name;
    btn.classList.toggle("active", index === 0);
    btn.addEventListener("click", () => renderTabContent(index));
    tabNav.appendChild(btn);
  });

  function renderTabContent(tabIndex) {
    document.querySelectorAll("#widgetTabNav button").forEach((btn, idx) => {
      btn.classList.toggle("active", idx === tabIndex);
    });
    const contentDiv = document.getElementById("widgetTabContent");
    contentDiv.innerHTML = "";
    const rows = tabsData[tabIndex].rows;
    rows.forEach(row => {
      const heading = document.createElement("div");
      heading.className = "row-heading";
      heading.innerHTML = row.heading;
      const content = document.createElement("div");
      content.className = "row-content";
      content.innerHTML = row.content;
      contentDiv.appendChild(heading);
      contentDiv.appendChild(content);
    });
  }
  if (tabsData.length) renderTabContent(0);

  // Process optional sections
  let optSections = config.opt_sections || [];
  const optDiv = document.getElementById("widgetOptional");
  if (optSections.length > 0) {
    optSections.forEach(opt => {
      const heading = document.createElement("div");
      heading.className = "optional-heading";
      heading.innerHTML = opt.heading;
      const content = document.createElement("div");
      content.className = "optional-content";
      content.innerHTML = opt.content;
      optDiv.appendChild(heading);
      optDiv.appendChild(content);
    });
  } else {
    optDiv.style.display = "none";
  }
})();
