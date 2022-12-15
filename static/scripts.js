
document.addEventListener('DOMContentLoaded', () => {
  if (new Date().getMonth() === 11) {
    const tag = document.createElement("script");
    tag.src = "static/snow.js";
    document.getElementsByTagName("head")[0].appendChild(tag);
  }
});
