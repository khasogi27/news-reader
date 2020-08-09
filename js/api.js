const baseURL = "https://berita-news.herokuapp.com";

// Jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Ubah objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Parsing json menjadi array JavaScript
function toJson(response) {
  return response.json();
}

// Handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

function getArticles() {
  if ("caches" in window) {
    caches.match(baseURL).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          let articlesHTML = "";
          data.data.forEach(function (article) {
            let articlePoster = article.poster;
            if (articlePoster === null || articlePoster === undefined) {
              articlePoster = "./assets/news.jpg";
            }
            articlesHTML += /*html*/ `
              <div class="card">
                <a href="./article.html?url=${article.link}">
                  <div class="card-image waves-effect waves-block waves-light">
                    <img src="${articlePoster}" />
                  </div>
                </a>
                <div class="card-content">
                  <span class="card-title truncate">${article.judul}</span>
                  <p>${article.kutipan}</p>
                </div>
              </div>
            `;
          });
          document.getElementById("articles").innerHTML = articlesHTML;
        });
      }
    });
  }
  fetch(baseURL)
    .then(status)
    .then(toJson)
    // Objek/array JavaScript dari response.json() masuk lewat parameter data
    .then(function (data) {
      // Menyusun komponen card artikel secara dinamis
      let articlesHTML = "";
      data.data.forEach(function (article) {
        let articlePoster = article.poster;
        if (articlePoster === null || articlePoster === undefined) {
          articlePoster = "./assets/news.jpg";
        }
        articlesHTML += /*html*/ `
          <div class="card">
            <a href="./article.html?url=${article.link}">
              <div class="card-image waves-effect waves-block waves-light">
                <img src="${articlePoster}" />
              </div>
            </a>
            <div class="card-content">
              <span class="card-title truncate">${article.judul}</span>
              <p>${article.kutipan}</p>
            </div>
          </div>
          `;
      });
      document.getElementById("articles").innerHTML = articlesHTML;
    })
    .catch(error);
}

function getArticlesById() {
  return new Promise(function (resolve, reject) {

    let urlParams = new URLSearchParams(window.location.search);
    let idParam = urlParams.get("url");

    if ("caches" in window) {
      caches.match(baseURL + "/detail/?url=" + idParam).then(function (response) {
        if (response) {
          response.json().then(function (data) {
            let articleHTML = /*html*/ `
            <div class="card">
            <div class="card-image waves-effect waves-block waves-light">
            <img src="${data.data[0].poster}" />
            </div>
            <div class="card-content">
            <span class="card-title">${data.data[0].judul}</span>
            ${data.data[0].konten}
            </div>
            </div>
            `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = articleHTML;
            resolve(data);
          });
        }
      });
    }

    fetch(baseURL + "/detail/?url=" + idParam)
      .then(status)
      .then(toJson)
      .then(function (data) {
        console.log(data);
        let articleHTML = /*html*/ `
          <div class="card">
          <div class="card-image waves-effect waves-block waves-light">
          <img src="${data.data[0].poster}" />
          </div>
          <div class="card-content">
          <span class="card-title">${data.data[0].judul}</span>
          ${data.data[0].konten}
          </div>
          </div>
          `;
        document.getElementById("body-content").innerHTML = articleHTML;
        resolve(data);
      });
  });
}