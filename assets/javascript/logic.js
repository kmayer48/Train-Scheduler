  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB1pJbxuTKEvUuoLfTMxRL_krb_fAzO_PA",
    authDomain: "train-scheduler-edccf.firebaseapp.com",
    databaseURL: "https://train-scheduler-edccf.firebaseio.com",
    projectId: "train-scheduler-edccf",
    storageBucket: "train-scheduler-edccf.appspot.com",
    messagingSenderId: "863898313667"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  //shows current time
  $("#current-time").append(moment().format("hh:mm A"));

  //submit function to add new trains to current train schedule
  $("#add-train-btn").on("click", function() {
    event.preventDefault();
    // Grabs user input
    var trainName = $("#trainName-form").val().trim();
    console.log(trainName)
    var destination = $("#destination-form").val().trim();
    console.log(destination)
    var firstTrain = moment($("#firstTrainTime-form").val().trim(), "hh:mm").subtract(1, "years").format("X");
    console.log(firstTrain)
    var frequency = $("#frequency-form").val().trim();
    console.log(frequency)

    //creating local variable to store user input
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrainTime: firstTrain,
        frequency: frequency,
    }
    console.log(newTrain)

    //push to firebase
    database.ref().push(newTrain);

    //clear textboxes
    $("#trainName-form").val("");
    $("#destination-form").val("");
    $("#firstTrainTime-form").val("");
    $("#frequency-form").val("");
  });

  database.ref().on("child_added", function(childSnapshot, prevChildKey){
    console.log(childSnapshot.val());

    //assinging firebase variables to local variables
    var dbTrainName = childSnapshot.val().name;
    var dbDestination = childSnapshot.val().destination;
    var dbFirstTrain = childSnapshot.val().firstTrainTime;
    var dbFrequency = childSnapshot.val().frequency;

		var diffTime = moment().diff(moment.unix(dbFirstTrain), "minutes");
		var timeRemainder = moment().diff(moment.unix(dbFirstTrain), "minutes") % dbFrequency ;
		var minutes = dbFrequency - timeRemainder;

		var nextTrainArrival = moment().add(minutes, "m").format("hh:mm A"); 

    $("#trainTable > tbody").append("<tr><td>" + dbTrainName + "</td><td>" + dbDestination + "</td><td>"+  dbFrequency + " mins" + "</td><td>" + nextTrainArrival + "</td><td>" + minutes + "</td></tr>");
  });
