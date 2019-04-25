
function main()
{
    var p = document.querySelector("#posture_info")
    var discriminant = 0;
    document.addEventListener("volumeupbutton",function(){
        var devices = bluetoothle.retrieveConnected(retrievedDevices, function(){}, function(){});
        //discriminant = discriminant+1;
        //p.innerHTML = "<font size = 20>"+discriminant+"</font>";
    },false);
    document.addEventListener("volumedownbutton",function(){
        //discriminant = discriminant-1;
        //p.innerHTML = "<font size = 20>"+discriminant+"</font>";
    },false);
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
function retrievedDevices(devices){
    var p = document.querySelector("#posture_info");

    p.innerHTML = "<font size = 20>"+devices.tostring()+"</font>";
}
main();