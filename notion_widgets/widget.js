function getParam(param) {
  const params = new URLSearchParams(window.location.search);
  return params.get(param) || "";
}

document.getElementById("widgetCategory").textContent = getParam("cat");
document.getElementById("widgetDepartment").textContent = getParam("dept");
document.getElementById("widgetTitle").textContent = getParam("title");
document.getElementById("widgetDescription").textContent = getParam("desc");
document.getElementById("widgetHeader").style.background = getParam("headColor") || "#009688";

let tabsData = [];
try {
  tabsData = JSON.parse(getParam("tabs"));
} catch(e) {
  tabsData = [{
    name: "Anästhesie",
    rows: [{ heading: "Overview", content: "Details regarding anesthesia protocols." }]
  }];
}

const tabNav = document.getElementById("widgetTabNav");
tabsData.forEach((tab, index) => {
  const btn = document.createElement("button");
  btn.textContent = tab.name;
  btn.className = index === 0 ? "active" : "";
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
    const h = document.createElement("div");
    h.className = "row-heading";
    h.textContent = row.heading;
    const p = document.createElement("div");
    p.className = "row-content";
    p.textContent = row.content;
    contentDiv.appendChild(h);
    contentDiv.appendChild(p);
  });
}

if (tabsData.length) renderTabContent(0);

let optSections = [];
try {
  optSections = JSON.parse(getParam("opt_sections"));
} catch(e) {
  optSections = [];
}
const optDiv = document.getElementById("widgetOptional");
if(optSections.length > 0) {
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
} else {
  optDiv.style.display = "none";
}
