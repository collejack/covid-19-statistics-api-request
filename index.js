const title = document.querySelector(".title");
const countriesSelect = document.getElementById("countries");
const BASE_URL = "https://covid19.mathdro.id/api";

let error = null;
const errorDiv = document.querySelector(".error");
let info = "";
const infoDiv = document.querySelector(".info");
const statsElements = document.querySelector(".country-stats");

countriesSelect.addEventListener("change", (e) => {
  const countryCode = e.target.value;
  //console.log(countryCode);
  getStatistics(countryCode)
    .then((stats) => {
      /* const countryStats = `Cas confirmés : ${stats.confirmed.value} - Guéris : ${stats.recovered.value} - Décédés : ${stats.deaths.value}`;
      //console.log(countryStats);
      statsElements.innerText = countryStats; */
      displayStatistics(stats);
    })
    .catch((err) => {
      statsElements.innerText = "";
      errorDiv.innerText = err.message;
    });
});

function getCountries() {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/countries`)
      .then((data) => data.json())
      .then((countries) => {
        //console.log("countries", countries);
        resolve(countries);
        errorReset();
      })
      .catch((err) => {
        reject(err);
        errorDiv.innerText = "Impossible de récupérer la liste de pays";
      });
  });
}

function errorReset() {
  errorDiv.innerText = null;
}

getCountries().then((data) => {
  let option;
  Object.entries(data.countries).forEach((country) => {
    //console.log('country', country);
    option = document.createElement("option");
    option.text = country[1].name;
    option.value = country[1].iso2;
    countriesSelect.add(option);
  });
});

function getStatistics(countryCode) {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/countries/${countryCode}`)
      .then((data) => data.json())
      .then((stats) => {
        console.log("statistiques", stats);
        errorReset();
        if (stats.error) {
          throw Error(stats.error.message);
        }
        resolve(stats);
      })
      .catch((err) => {
        reject(err);
        errorDiv.innerText = `Impossible de récupérer les statistiques pour le pays ${countryCode}`;
      });
  });
}

function displayStatistics(stats) {
  const lastUpdate = new Date(stats.lastUpdate);
  const niceDate = getLastDateUpdate(lastUpdate);
  const countryStats = `
        <div class="row">
            <div class="col-sm-4">
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title">Cas confirmés</h5>
                        <h6 class="text-warning">${stats.confirmed.value}
                        </h6>
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title">Cas guéris</h5>
                        <h6 class="text-success">${stats.recovered.value}
                        </h6>
                    </div>
                </div>
            </div>
            <div class="col-sm-4">
                <div class="card bg-light">
                    <div class="card-body">
                        <h5 class="card-title">Nombre de morts</h5>
                        <h6 class="text-danger">${stats.deaths.value}
                        </h6>
                    </div>
                </div>
            </div>
           
            <div class="col-sm-12 mt-4 text-light">Les données ont été mis à jour le ${niceDate}</div>
        </div>
    `;
    statsElements.innerHTML = countryStats;
}

function getLastDateUpdate(lastUpdate) {
  return `${lastUpdate.getDate()}/${lastUpdate.getMonth() + 1}/${lastUpdate.getFullYear()} à ${lastUpdate.getHours()}H${lastUpdate.getMinutes()}min`;
}
