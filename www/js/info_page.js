
var htmlstr = document.querySelector("#posture_info");
var RRAddr = "";
var uartUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
var txID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
var rxID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
function main()
{
    htmlstr.innerHTML = "Initializing...";
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
        htmlstr.innerHTML = "Searching for RunRight..."
        bluetoothle.retrieveConnected(retrieveConnectedSuccess, handleError, {});
    }
}
function retrieveConnectedSuccess(result){
    result.forEach(function(device){
        if(device.name == "RunRightBT"){
            htmlstr.innerHTML = "Found!"
            RRAddr = device.address
            bluetoothle.connect(connectSuccess,handleError, {address : RRAddr, autoConnect : true});
        }
    });
}
function connectSuccess(result){
    if (result.status == "connected") {
        htmlstr.innerHTML = "Connected to RunRight!";
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
    htmlstr.innerHTML = "Press volume down to set neutral position.";
    document.addEventListener("volumedownbutton",function(){
        write("RR_NSET");
        htmlstr.innerHTML = "Neutral Position Set!<p>";
        bluetoothle.subscribe(subscribeSuccess, handleError, {
            address : RRAddr,
            service : uartUUID,
            characteristic : rxID
        })
     },false);

}
function subscribeSuccess(result){
    if(result.status == "subscribedResult"){
        htmlstr.innerHTML = htmlstr.innerHTML + decoded(result.value) + "<p>";
        readString(decoded(result.value));
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
function write(string){ //Helper function to write a string to the RunRight
    if(RRAddr == "") {return;}
    bluetoothle.write(writeSuccess, handleError,{
        address : RRAddr,
        service : uartUUID,
        characteristic : txID,
        value : encoded(string+"\n\l")
    });
}
function readString(str){
    
}
main();