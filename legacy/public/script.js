$(document).ready(function () {
  $("nav a").click(function (e) {
    e.preventDefault();
    loadPage(e.target.href);
  });

  function loadPage(page) {
    $("main").load(page + " main");
  }
});
