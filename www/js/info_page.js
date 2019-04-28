
//var htmlstr = document.querySelector("#posture_info");
var RRAddr = "";
var uartUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
var txID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
var rxID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
function main()
{
    //htmlstr.innerHTML = "Initializing...";
    setTimeout(function(){
        bluetoothle.initialize(initializeSuccess, { request: true, statusReceiver: false });
    },1000);
}
function handleError(error) {
    var msg;
    if (error.error && error.message) {
        var errorItems = [];
        if (error.service) {
            errorItems.push("service: " + (uuids[error.service] || error.service));
        }
 
        if (error.characteristic) {
            errorItems.push("characteristic: " + (uuids[error.characteristic] || error.characteristic));
        }
        msg = "Error on " + error.error + ": " + error.message + (errorItems.length && (" (" + errorItems.join(", ") + ")"));
    }
    else { 
        msg = error;
    }
    log(msg, "error");
    if (error.error === "read" && error.service && error.characteristic) {
        reportValue(error.service, error.characteristic, "Error: " + error.message);
    }
}
function initializeSuccess(result) {
    if (result.status === "enabled") {
        //htmlstr.innerHTML = "Searching for RunRight..."
        bluetoothle.retrieveConnected(retrieveConnectedSuccess, handleError, {});
    }
}
function retrieveConnectedSuccess(result){
    result.forEach(function(device){
        if(device.name == "RunRightBT"){
            //htmlstr.innerHTML = "Found!"
            RRAddr = device.address
            bluetoothle.connect(connectSuccess,handleError, {address : RRAddr, autoConnect : true});
        }
    });
}
function connectSuccess(result){
    if (result.status == "connected") {
        //htmlstr.innerHTML = "Connected to RunRight!";
        bluetoothle.discover(discoverSuccess, handleError, {
            address : RRAddr,
            clearCache : true
        })
    }
}
function discoverSuccess(result){ // Once the device is discovered and connected
    /*result.services.forEach(function(service){
        if(service.uuid == uartUUID){
            service.characteristics.forEach(function(characteristic){
                htmlstr.innerHTML = htmlstr.innerHTML + characteristic.uuid + "<p>";
            });
        }
    });*/
    document.addEventListener("volumedownbutton",function(){
        bluetoothle.subscribe(subscribeSuccess, handleError, {
        address : RRAddr,
        service : uartUUID,
        characteristic : rxID
    })
     },false);

}
function subscribeSuccess(result){
    if(result.status == "subscribedResult"){
        //htmlstr.innerHTML = htmlstr.innerHTML + decoded(result.value) + "<p>";
        onRead(decoded(result.value));
    }
}
function writeSuccess(result){
}
function encoded(string){ // Helper function to encode string to base 64 string 
    return bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes(string));
}
function decoded(string){ // Helper function to decoded base 64 string to a normal string
    return bluetoothle.bytesToString(bluetoothle.encodedStringToBytes(string));
}
function send(string){ //Helper function to write a string to the RunRight
    if(RRAddr == "") {return;}
    bluetoothle.write(writeSuccess, handleError,{
        address : RRAddr,
        service : uartUUID,
        characteristic : txID,
        value : encoded(string+"\n\l")
    });
}
function onRead(str){ //Function that runs when a string is read to the device.
    var ar = str.split(" ");
    var cmd = ar[0]; //Contains the command
    var args = ar.slice(1); //Values sent with the command

    if(cmd == "SNEU"){
        send("BDST"); // Starts the data stream on 
    }
    if(cmd == "BDST"){ //Response to begin data stream.
    }
    if(cmd == "DVAL"){
        onCurvatureRecieved(parseFloat(args[0])); //Runs the event for when the device is receiving a value.
    }
    if(cmd == "SDST"){
    }
    if(cmd == "CHEK"){ //Responds to the device alive check.
        send("CHEK");
    }
}
function onCurvatureRecieved(value){ //Event for whenever a value is received
    var angle = 7.39*(value - 0.8); //Angle of the device
}
main();

/* Command set
Phone to device >
Device to phone <
> Description: Statement [Response]

> Set Neutral Position:   SNEU [SNEU]
----
> Begin Data Stream:    BDST [BDST]
----
< Value from device:    DVAL <number>
----
> Stop Data Steam:      SDST [SDST]
----
< Device alive?:        CHEK [CHEK]
----

*/
