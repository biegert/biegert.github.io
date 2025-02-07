(() => {
  const Utils = {
    getParam: function(param) {
      const params = new URLSearchParams(window.location.search);
      return params.get(param) || "";
    }
  };

  // Set header and basic text elements
  document.getElementById("widgetCategory").textContent = Utils.getParam("cat");
  document.getElementById("widgetDepartment").textContent = Utils.getParam("dept");
  document.getElementById("widgetTitle").textContent = Utils.getParam("title");
  document.getElementById("widgetDescription").textContent = Utils.getParam("desc");
  document.getElementById("widgetHeader").style.background = Utils.getParam("headColor") || "#009688";

  // Parse tabs data with error handling
  let tabsData = [];
  try {
    tabsData = JSON.parse(Utils.getParam("tabs"));
    if (!Array.isArray(tabsData)) throw new Error("Invalid tabs data");
  } catch (e) {
    tabsData = [{
      name: "Anästhesie",
      rows: [{ heading: "Overview", content: "Details regarding anesthesia protocols." }]
    }];
  }

  // Build tab navigation
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
      heading.textContent = row.heading;
      const content = document.createElement("div");
      content.className = "row-content";
      content.textContent = row.content;
      contentDiv.appendChild(heading);
      contentDiv.appendChild(content);
    });
  }
  if (tabsData.length) renderTabContent(0);

  // Parse and render optional sections
  let optSections = [];
  try {
    optSections = JSON.parse(Utils.getParam("opt_sections"));
    if (!Array.isArray(optSections)) throw new Error("Invalid optional sections data");
  } catch (e) {
    optSections = [];
  }
  const optDiv = document.getElementById("widgetOptional");
  if (optSections.length > 0) {
    optSections.forEach(opt => {
      const heading = document.createElement("div");
      heading.className = "optional-heading";
      heading.textContent = opt.heading;
      const content = document.createElement("div");
      content.className = "optional-content";
      content.textContent = opt.content;
      optDiv.appendChild(heading);
      optDiv.appendChild(content);
    });
  } else {
    optDiv.style.display = "none";
  }
})();
