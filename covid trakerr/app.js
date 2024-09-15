window.onload = function () {
    if ("array" in localStorage && "object" in localStorage) {
      const countriesArray = JSON.parse(localStorage.getItem("array"))
      const countriesObject = JSON.parse(localStorage.getItem("object"))
      createSelectItem(countriesArray, countriesObject)
    } else {
      fetchCountries()
    }
    currentDateForSecondDate()
  }
  
  const button = document.querySelector("#submitButton");
  button.addEventListener("click", dataGather);
  
  const countryList = document.querySelector("#country");
  
  function dataGather(event) {
    event.preventDefault()
    const country = document.querySelector("select").value;
    const firstDate = document.querySelector("#firstDate").value;
    const lastDate = document.querySelector("#lastDate").value;
  
    graphDraw(country, firstDate, lastDate)
  };
  
  function fetchCountries() {
    fetch("https://api.covid19api.com/countries")
      .then((response) => response.json())
      .then(function (responseData) {
        let countriesAndSlugObject = {}
        let countries = []
  
        for (let country = 0; country < responseData.length; country++) {
          countriesAndSlugObject[responseData[country]["Country"]] = responseData[country]["Slug"]
          countries.push(responseData[country]["Country"])
        }
        countries = countries.sort()
        localStorage.setItem("array", JSON.stringify(countries))
        localStorage.setItem("object", JSON.stringify(countriesAndSlugObject))
        // createSelectItem(countries);
      });
  };
  
  function createSelectItem(data, objectOfSlug) {
    data = data.sort()
    const select = document.querySelector("select")
    for (let i = 0; i < data.length; i++) {
      select.appendChild(createOptionItem(data[i], objectOfSlug[data[i]]))
    }
  }
  
  function createOptionItem(content, value) {
    let option = document.createElement("option");
    if (content === "India") {
      option.textContent = content;
      option.value = value;
      option.selected = true;
    }
    option.textContent = content;
    option.value = value;
    return option;
  };
  
  function graphDraw(country, firstDate, lastDate) {
    const requiredFirstDate = firstDate + "T00:00:00Z"
    const requiredLastDate = lastDate + "T00:00:00Z"
  
    fetch(`https://api.covid19api.com/country/${country}?from=${requiredFirstDate}&to=${requiredLastDate}`)
      .then((response) => response.json())
      .then((data) => draw(data))
  }
  
  function currentDateForSecondDate() {
    let d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
  
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
  
    let fullDate = [year, month, day].join('-');
    document.querySelector("#lastDate").max = fullDate
  
    /*
    let day = new Date().getDay()
    let month = new Date().getMonth() + 1
    let year = new Date().getFullYear()
    if (month.length < 10) {
      month = "0" + month;
    };
    if (day.length < 10) {
      day = "0" + day;
    };
    let fullDate = `${year}-${month + 1}-${day}`
    document.querySelector(".dates:nth-child(3)").innerHTML = `\n        <label for=\"lastDate\">Select End Date: </label>\n        <input class=\"input-class\" type=\"date\" name=\"lastDate\" id=\"lastDate\" value=\"2020-10-02\" min=\"2020-01-02\" max=\"${fullDate}\">\n      `
    */
  }
  
  function draw(data) {
    // Don't forget to handle those cases where data is not available.
    if (!data) {
      console.log("No Data Found");
    }
    else {
      let dates = []
      let confirmedCases = []
      let activeCases = []
      let deaths = []
      let recoveredPatients = []
  
      for (let i = 0; i < data.length; i++) {
        dates.push([data[i]["Date"].slice(0, 10)])
        confirmedCases.push(data[i]["Confirmed"])
        activeCases.push(data[i]["Active"])
        deaths.push(data[i]["Deaths"])
        recoveredPatients.push(data[i]["Recovered"])
      };
  
      // To clear the canvas if there is any chart available there.
      document.querySelector("#chartReport").innerHTML = '\n      <div class="chartBox">\n        <canvas id="canvas-1"></canvas>\n      </div>\n      <div class="chartBox">\n        <canvas id="canvas-2"></canvas>\n      </div>\n      <div class="chartBox">\n        <canvas id="canvas-3"></canvas>\n      </div>\n      <div class="chartBox">\n        <canvas id="canvas-4"></canvas>\n      </div>\n    '
  
      const ctx = document.getElementById('canvas-1');
      const ctx2 = document.getElementById('canvas-2');
      const ctx3 = document.getElementById('canvas-3');
      const ctx4 = document.getElementById('canvas-4');
  
      new Chart(ctx, {
        type: 'line',
        data: {
          // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          labels: dates,
          datasets: [{
            label: 'Confirmed Cases',
            // data: [2, 4, 6, 8, 16, 32],
            data: confirmedCases,
            backgroundColor: 'transparent',
            borderColor: '#FD8A8A',
            borderWidth: 0.5
          },
          {
            label: 'Active Cases',
            data: activeCases,
            backgroundColor: 'transparent',
            borderColor: '#FF7B54',
            borderWidth: 0.5
          },
          {
            label: 'Recovered',
            data: recoveredPatients,
            backgroundColor: 'transparent',
            borderColor: '#6ECCAF',
            borderWidth: 0.5
          },
          {
            label: 'Deaths',
            data: deaths,
            backgroundColor: 'transparent',
            borderColor: '#CD0404',
            borderWidth: 0.5
          }
          ]
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Complete Summary of Covid Data"
            }
          },
          elements: {
            line: {
              tension: 0
            }
          },
          scales: {
            y: {
              beginAtZero: true
            },
          }
        }
      });
  
      new Chart(ctx2, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Confirmed Cases',
            data: confirmedCases,
            backgroundColor: 'transparent',
            borderColor: '#FD8A8A',
            borderWidth: 1.5
          }]
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
  
          plugins: {
            title: {
              display: true,
              text: "Confirmed Case Chart"
            }
          },
          elements: {
            line: {
              tension: 0
            }
          },
          scales: {
            y: {
              beginAtZero: true
            },
          }
        }
      });
  
      new Chart(ctx3, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Total Deaths',
            data: deaths,
            backgroundColor: 'transparent',
            borderColor: '#CD0404',
            borderWidth: 1.5
          }]
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
  
          plugins: {
            title: {
              display: true,
              text: "Total Deaths Summary"
            }
          },
          elements: {
            line: {
              tension: 0
            }
          },
          scales: {
            y: {
              beginAtZero: true
            },
          }
        }
      });
  
      new Chart(ctx4, {
        type: 'line',
        data: {
          labels: dates,
          datasets: [{
            label: 'Confirmed Cases',
            data: confirmedCases,
            backgroundColor: 'transparent',
            borderColor: '#FD8A8A',
            borderWidth: 1
          },
          {
            label: 'Total Deaths',
            data: deaths,
            backgroundColor: 'transparent',
            borderColor: '#CD0404',
            borderWidth: 1
          }
          ]
        },
        options: {
          maintainAspectRatio: true,
          responsive: true,
  
          plugins: {
            title: {
              display: true,
              text: "Confirmed Cases and Total Deaths Comparison"
            }
          },
          elements: {
            line: {
              tension: 0
            }
          },
          scales: {
            y: {
              beginAtZero: true
            },
          }
        }
      });
    }
  }