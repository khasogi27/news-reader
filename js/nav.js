document.addEventListener("DOMContentLoaded", function () {
  // element sidebar navigation
  const sideNavElements = document.querySelectorAll(".sidenav");
  M.Sidenav.init(sideNavElements);
  loadNav();

  function loadNav() {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status !== 200) return;

        // muat daftar tautan menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function (elm) {
          elm.innerHTML = xhttp.responseText;
        });

        // terapkan event listener untuk setiap item menu
        document
          .querySelectorAll(".topnav a, .sidenav a")
          .forEach(function (elm) {
            elm.addEventListener("click", function (event) {
              // apabila item sidenav diclick
              // maka sidenav akan secara otomatis tertutup
              const sideNav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sideNav).close();

              // muat konten halaman yang dipanggil
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });
      }
    };
    xhttp.open("GET", "nav.html", true);
    xhttp.send();
  }

  let page = window.location.hash.substr(1);
  if (!page) {
    page = "home";
  }
  loadPage(page);

  function loadPage(page) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const content = document.querySelector("#body-content");

        if (page === "home") {
          getArticles();
        } else if (page === "saved") {
          getSavedArticles();
        }

        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan</p>";
        } else {
          content.innerHTML = "<p>Halaman tidak dapat diakses</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }
});