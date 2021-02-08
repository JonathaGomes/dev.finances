const html = document.querySelector("html");
const checkbox = document.querySelector("input[name=theme]");

const getStyle = (element, style) =>
  window.getComputedStyle(element).getPropertyValue(style);

const initialColors = {
  bg: getStyle(html, "--bg"),
  lightGray: getStyle(html, "--light-gray"),
  bgHeader: getStyle(html, "--bg-header"),
  colorFooter: getStyle(html, "--color-footer"),
};
//

const darkMode = {
  bg: "#333",
  lightGray: "#292C35",
  bgHeader: "#000",
  colorFooter: "#fff",
};

const transformKey = (key) =>
  "--" + key.replace(/([A-Z])/, "-$1").toLowerCase();

const changeColors = (colors) => {
  Object.keys(colors).map((key) =>
    html.style.setProperty(transformKey(key), colors[key])
  );
};

checkbox.addEventListener("change", ({ target }) => {
  target.checked ? changeColors(darkMode) : changeColors(initialColors);
});
