// function addCanvas(elementRef, index) {
//     let idName = "myChart";
//     let canvas = document.createElement("canvas");
//     canvas.setAttribute("id", idName + index);
//     elementRef.before(canvas);
//     return canvas.getAttribute("id");
// }

const addCanvas = (elementRef, index, height, caption) => {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "myChart" + index);
    canvas.setAttribute("height", height);
    elementRef.before(canvas);
    if (caption != undefined) {
      let newElement = document.createElement("p");
      newElement.setAttribute(
        "style",
        "text-align: center; font-size: 14px; font-style: italic"
      );
      let newContent = document.createTextNode(caption);
      newElement.appendChild(newContent);
      elementRef.before(newElement);
    }
    return canvas.getAttribute("id");
  };

function createChart(canvasID, chartType, labelsArray, dataSetJSONArray, optionsJSON){
    let charRef = new Chart(document.getElementById(canvasID).getContext("2d"), {
        type : chartType, //bar, horizontalBar, pie, line , doughtnut, radar, polarArea
        data : {
            labels : labelsArray,
            datasets : dataSetJSONArray,
        },
        options:optionsJSON,
    });
    return charRef;
}

function fetchData(){
    let resource ="https://canvasjs.com/services/data/datapoints.php?xstart=1&ystart=0&length=10&type=json";
    fetch(resource) //retrieve the content of the json file, via HTTP  
    .then( response => {
        // test if HTTP error
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }
        // Examine the text in the response (json file)
        response.json()
        .then( dataJSON => {
            //console.log("data : " + dataJSON);

            dataJSON.forEach(element => {
                labelsArray.push(`label-${element[0]}`);//set the array of labels
                dataArray.push(parseInt(element[1]));//set the array of data
            });
        
            let dataSetJSONArray=[{
                label : "label",
                data:dataArray,
                backgroundColor : 'green',
                borderWidth : 1 ,
                borderColor : "grey",
                hoverBorderWidth : 5,
                hoverBorderColor : "black",
                }
            ];
            
            let optionsJSON={
                title : { display : true,  text : 'statistics with Fetch', fontSize:25 },
                legend : { display : true,  position : 'right', labels : {fontColor : "red"} },
                layout : { padding : {left : 30, right : 30, bottom : 50, top : 50} },
                tooltips : { enabled : true }
            };
        
            chart3Ref = createChart(canvastID, "bar", labelsArray, dataSetJSONArray, optionsJSON);
            updateChartFetch();
        })
        .catch( err => {
          console.log("error :" + err);
        });
    })
    .catch( err => {
      console.log('Fetch Error :-S', err);
    });
}

//to update the chart
function updateChartFetch(){
    counter++;//add this counter to the default value[0] to go upper than label-10
    //console.log("counter:"+ counter);
    //console.log("dataArray:"+ dataArray);
    let resource ="https://canvasjs.com/services/data/datapoints.php?xstart=" + (dataArray.length + 1) 
    + "&ystart=" + (dataArray[dataArray.length-1].y) + "&length=1&type=json";

    fetch(resource) //retrieve the content of the json file, via HTTP  
    .then( response => {
        // test if HTTP error
        if (response.status !== 200) {
          console.log('Looks like there was a problem. Status Code: ' + response.status);
          return;
        }
        // Examine the text in the response (json file)
        response.json()
        .then( dataJSON => {
            //console.log("data : " + dataJSON);
            dataJSON.forEach(element => {
                labelsArray.shift();//remove the 1st one
                labelsArray.push(`label-${element[0]+counter}`);//add the new one at the end of the array
                dataArray.shift();
                dataArray.push(parseInt(element[1]));
            });
        })
        .catch( err => {
        console.log("error :" + err);
        });
    })
    .catch( err => {
    console.log('Fetch Error :-S', err);
    });
    chart3Ref.update();
    timer = setTimeout(function(){updateChartFetch()}, 1000);//run again, after one seconde , the update fct
};

function JQueryData(){
    //with JQuery, get the 10 first data from the API, with use of a callback function executed ONLY after the execution of function getJSON()
    $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=1&ystart=0&length=10&type=json", function(data) {  
        $.each(data, function(key, value){
            labelsArray.push(`label-${value[0]}`);//set the array of labels
            dataArray.push(parseInt(value[1]));//set the array of data
        });
        
        let dataSetJSONArray=[{
            label : "label",
            data:dataArray,
            backgroundColor : 'green',
            borderWidth : 1 ,
            borderColor : "grey",
            hoverBorderWidth : 5,
            hoverBorderColor : "black",
            }
        ];
        
        let optionsJSON={
            title : { display : true,  text : 'statistics with JQuery', fontSize:25 },
            legend : { display : true,  position : 'right', labels : {fontColor : "red"} },
            layout : { padding : {left : 30, right : 30, bottom : 50, top : 50} },
            tooltips : { enabled : true }
        };
        chart3Ref = createChart(canvastID, "bar", labelsArray, dataSetJSONArray, optionsJSON);
        updateChartJQuery();
    });
}

function updateChartJQuery(){
    counter++;//add this counter to the default value[0] to go upper than label-10
    //console.log("counter:"+ counter);
    //console.log("dataArray:"+ dataArray);
    //get ONLY the 1st value from the API
    $.getJSON("https://canvasjs.com/services/data/datapoints.php?xstart=" + (dataArray.length + 1) 
    + "&ystart=" + (dataArray[dataArray.length-1].y) + "&length=1&type=json", function(data) {
        $.each(data, function(key, value) {
            labelsArray.shift();//remove the 1st one
            labelsArray.push(`label-${value[0]+counter}`);//add the new one at the end of the array
            dataArray.shift();
            dataArray.push(parseInt(value[1]));
       });
       //chart.update();//update display of the chart
       chart3Ref.update();
       timer = setTimeout(function(){updateChartJQuery()}, 1000);//run again, after one seconde , the update fct
 });
}

//------------------ Main code ----------------------------
let dataArray = [];
let labelsArray = [];
let counter = -1;
let timer;
let chart3Ref;

// radio button Fetch & associated label
let radioButtonFetch = document.createElement("INPUT");
radioButtonFetch.setAttribute("type", "radio");
radioButtonFetch.setAttribute("id", "fetch");
radioButtonFetch.setAttribute("name", "method");
radioButtonFetch.checked = true;
document.getElementById("bodyContent").before(radioButtonFetch);
// Label creation
let labelForRadioButtonFetch = document.createElement("label");
labelForRadioButtonFetch.setAttribute("for" , "fetch");
labelForRadioButtonFetch.innerHTML= "Fetch method";
document.getElementById("bodyContent").before(labelForRadioButtonFetch);
// radio button JQuery & associated label
let radioButtonJQuery = document.createElement("INPUT");
radioButtonJQuery.setAttribute("type", "radio");
radioButtonJQuery.setAttribute("id", "JQuery");
radioButtonJQuery.setAttribute("name", "method");
document.getElementById("bodyContent").before(radioButtonJQuery);
// Label creation
let labelForRadioButtonJQuery = document.createElement("label");
labelForRadioButtonJQuery.setAttribute("for" , "JQuery");
labelForRadioButtonJQuery.innerHTML= "JQuery method";
labelForRadioButtonJQuery.style.color = "grey";
document.getElementById("bodyContent").before(labelForRadioButtonJQuery);

//get the ID of the canvas dynamically created, (3 = chart index)
let canvastID = addCanvas(document.getElementById("bodyContent"), 3);//

//1st, launch a fetch to get data
fetchData();

// event click on radio button Fetch
radioButtonFetch.addEventListener("click", () => {
    //if method to get data changes, then reset variables & stop the timer
    dataArray = []; //clear the labels & data arrays
    labelsArray = [];
    counter = -1;//reset counter for timer 
    clearTimeout(timer); //clear the timer
    chart3Ref="";
    
    document.getElementById("myChart3").remove();//remove the chart from the DOM
    canvastID = addCanvas(document.getElementById("bodyContent"), 3);//recrate the canvas
    labelForRadioButtonJQuery.style.color = "grey";//change color to grey the label |-> other radio button
    labelForRadioButtonJQuery.style.display = "none";//force to hide & re-display the label
    labelForRadioButtonJQuery.style.display = "inline-block"

    labelForRadioButtonFetch.style.color = "black";//set color to black for the label |-> chosen radio button
    labelForRadioButtonFetch.style.display = "none";//force to hide & re-display the label
    labelForRadioButtonFetch.style.display = "inline-block"
    fetchData();
});

// event click on radio button JQuery
radioButtonJQuery.addEventListener("click", () => {
    //if method to get data changes, then reset variables & stop the timer
    dataArray = []; //clear the labels & data arrays
    labelsArray = [];
    counter = -1;//reset counter for timer 
    clearTimeout(timer); //clear the timer
    chart3Ref="";

    document.getElementById("myChart3").remove();//remove the chart from the DOM
    canvastID = addCanvas(document.getElementById("bodyContent"), 3);//recrate the canvas
    
    labelForRadioButtonJQuery.style.color = "black";//change color to grey the label |-> other radio button
    labelForRadioButtonJQuery.style.display = "none";//force to hide & re-display the label
    labelForRadioButtonJQuery.style.display = "inline-block"

    labelForRadioButtonFetch.style.color = "grey";//set color to black for the label |-> chosen radio button
    labelForRadioButtonFetch.style.display = "none";//force to hide & re-display the label
    labelForRadioButtonFetch.style.display = "inline-block"

    JQueryData();
});