
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
function initializeSuccess(result) { // Bluetooth enabled
    if (result.status === "enabled") {
        htmlstr.innerHTML = "Searching for RunRight..."
        bluetoothle.retrieveConnected(retrieveConnectedSuccess, handleError, {});
    }
}
function retrieveConnectedSuccess(result){ //Successfully retrieved connected devices
    result.forEach(function(device){
        if(device.name == "RunRightBT"){
            htmlstr.innerHTML = "Found!"
            RRAddr = device.address
            bluetoothle.connect(connectSuccess,handleError, {address : RRAddr, autoConnect : true});
        }
    });
}
function connectSuccess(result){ //Callback function for successful connection to BTUART.
    if (result.status == "connected") {
        htmlstr.innerHTML = "Connected to RunRight!";
        /*bluetoothle.discover(discoverSuccess, handleError, {
            address : RRAddr,
            clearCache : true
        })*/ //Discovery is unneccessary if we already know the service UUID.
        bluetoothle.subscribe(handleBTUARTRX, handleError, {
            address : RRAddr,
            service : uartUUID,
            characteristic : rxID
        })
    }
}
/*function discoverSuccess(result){ //Callback on successful discovery of BT device
    result.services.forEach(function(service){ //Commented code shows all of the running bluetooth services
        if(service.uuid == uartUUID){
            service.characteristics.forEach(function(characteristic){
                htmlstr.innerHTML = htmlstr.innerHTML + characteristic.uuid + "<p>";
            });
        }
    });
    htmlstr.innerHTML = "Data in<p>...<p>";
    bluetoothle.subscribe(handleBTUARTRX, handleError, {
        address : RRAddr,
        service : uartUUID,
        characteristic : rxID
    })
}*/
function handleBTUARTRX(result){ //Callback handles changes to the UART service
    if(result.status == "subscribedResult"){
        //htmlstr.innerHTML = htmlstr.innerHTML + decoded(result.value) + "<p>"; //Commented just appendes the value to whatever is there.


    }
}

function encoded(string){ //Shorthand to encode string to Base 64 string
    return bluetoothle.bytesToEncodedString(bluetoothle.stringToBytes(string));
}
function decoded(string){//Shorthand to decode base 64 string to string
    return bluetoothle.bytesToString(bluetoothle.encodedStringToBytes(string));
}

function write(string){ //Writes a string to the bluetooth reciever
    bluetoothle.write(writeSuccess, handleError,{
        address : RRAddr,
        service : uartUUID,
        characteristic : txID,
        value : encoded(string)
    });
}
function writeSuccess(result){ // Just a blank call back for a successful write.
}
main();