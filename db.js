/**
 * Created by Aaron on 1/2/2017.
 */
//http://stackoverflow.com/questions/1053843/get-the-element-with-the-highest-occurrence-in-an-array
function mode(array)
{
    if(array.length == 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] == null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}



var ugh;
// Initialize Firebase
var config = {
    apiKey: "AIzaSyDncxPi0tTJ58-6P0jNLe560AAfHuXuLvk",
    authDomain: "traintracker-265ac.firebaseapp.com",
    databaseURL: "https://traintracker-265ac.firebaseio.com",
    storageBucket: "traintracker-265ac.appspot.com",
    messagingSenderId: "172047919352"
};
firebase.initializeApp(config);

var database = firebase.database();

var ref = database.ref("/trains/data");
var averageRef = database.ref("/stats/average");
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        var average;
        // User is signed in.
        $(".submitData").click(function () {
            var trainLength = $("#trainLength").val();
            var trainLoc = $("#trainLoc").val();

            var trainData = {
                length: parseInt(trainLength),
                location: trainLoc
            };

            if(isNaN(parseInt(trainLength))){
                alert("The length of the train must be numerical.");
            }else{
                if(average > 1 && 660 > parseInt(trainLength) && parseInt(trainLength) < average * 3){
                    ref.push(trainData);
                }else{
                    alert("Your data seems.. off");
                }

            }






        });


averageRef.on('value', gotAvg, gotErr);
ref.on('value', gotData, gotErr);

function gotAvg(data) {
    average = data.val();
    avgKeys = Object.keys(average);
    recievedAverage = average[avgKeys].average;
    // alert(recievedAverage);
    console.log(recievedAverage);
    $(".average").remove();
    $(".data").prepend("<h2 class='average'> The average train has " + recievedAverage + " cars.");
    console.log('appended avg');
}

function gotData(data) {
    trainData = data.val();
    trainKeys = Object.keys(trainData);
    $(".allTrains").html("");
    var trainLengths = [];
    var lengthsTotal = 0;
    var trainLocs = [];
    for(i = 0; i < trainKeys.length; i++){
        var key = trainKeys[i];
        var selData = trainData[key];
        var selLength = selData.length;
        var selLoc = selData.location;
        $(".allTrains").append("<p>Length: " + selLength + " Cars, Location: " + selLoc);
        trainLengths.push(parseInt(selLength));
        trainLocs.push(selLoc);

    }
    for(i = 0; i < trainLengths.length; i++){
        lengthsTotal += trainLengths[i];
    }
    var localAverage = lengthsTotal / trainLengths.length;
    averageRef.remove();
    var avgDataToUpdate = {
        average: localAverage
    };
    averageRef.push(avgDataToUpdate);
    console.log("Pushed local average " + localAverage);
    // alert(localAverage);
    $(".data").prepend("<h1>" + trainLengths.length + " trains have been logged.");
    $(".data").append("<h2>" + mode(trainLocs) + " is the most frequently refrenced location");


}


function gotErr(error) {
    console.log(error);
}

ugh = function pushTestAverage() {
    var testAvgData = {
        average: 1
    };
averageRef.push(testAvgData);
}








    } else {
        window.location.assign("./auth.html")
    }
});

var hidden = true;
function expandAllTrains(){
    if(hidden){
        $(".allTrains").css("display", "block");
        $(".expandTrainsLink").html("Hide All Train Data");
    }else{
        $(".allTrains").css("display", "None");
        $(".expandTrainsLink").html("Show All Train Data");
    }
    hidden = !hidden;
}

