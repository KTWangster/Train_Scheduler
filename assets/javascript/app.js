$(document).ready(function() {
    // variables

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCHsv2KE0dgNTNjaSHa1Q1M5SVskQQQBt0",
        authDomain: "train-scheduler-563e5.firebaseapp.com",
        databaseURL: "https://train-scheduler-563e5.firebaseio.com",
        projectId: "train-scheduler-563e5",
        storageBucket: "train-scheduler-563e5.appspot.com",
        messagingSenderId: "483647046097"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    // Current Time
    var dateTime = moment().format("MMMM Do YYYY LT");
    $("#currentDateTime").html(dateTime);

    // Capture button click.
    $("#submitBtn").on("click", function(event) {
        event.preventDefault();

        // Stores and retrieves input.
        var trainName = $("#name-input").val().trim();
        var trainDestination = $("#destination-input").val().trim();
        var trainArrival = moment($("#arrival-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
        var trainFrequency = $("#frequency-input").val().trim();

        // Local temporary object for holding input data.
        var newTrain = {
            name: trainName,
            destination: trainDestination,
            arrival: trainArrival,
            frequency: trainFrequency,
        }

        // Push input to Firebase.
        database.ref().push(newTrain);

        // Logs everything to console.
        console.log(newTrain.name);
        console.log(newTrain.destination);
        console.log(newTrain.arrival);
        console.log(newTrain.frequency);

        // ** Alert
        alert("Train added!");

        // Clears all of the text-boxes
        $("#name-input").val("");
        $("#destination-input").val("");
        $("#arrival-input").val("");
        $("#frequency-input").val("");
    });


    // Creates Firebase event for adding train to timetable and row in html when user submits entry.
    database.ref().on("child_added", function(childSnapshot, prevChildKey) {
        console.log(childSnapshot.val());

        // Store everything into variables within Firebase.
        var trainName = childSnapshot.val().name;
        var trainDestination = childSnapshot.val().destination;
        var trainArrival = childSnapshot.val().arrival;
        var trainFrequency = childSnapshot.val().frequency;

        // New train info
        console.log(trainName);
        console.log(trainDestination);
        console.log(trainArrival);
        console.log(trainFrequency);

        // Shows difference between times using Unix timestamp.
        var diffTime = moment().diff(moment.unix(trainArrival), "minutes");
        var timeApart = moment().diff(moment.unix(trainArrival), "minutes") % trainFrequency;

        // Add Train data into table
        $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td>" +
            trainDestination + "</td><td>" + trainArrival +
            "</td><td>" + trainFrequency + "</td><td>");
    });
})