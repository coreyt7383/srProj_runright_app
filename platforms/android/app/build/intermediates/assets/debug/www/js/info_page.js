var info_scr = {
    main: function(){
        var p = document.querySelector("#posture_info")
        var discriminant = 0;
        document.addEventListener("volumeupbutton",function(){
            discriminant = discriminant+1;
            p.innerHTML = "<font size = 20>"+discriminant+"</font>";
        },false);
        document.addEventListener("volumedownbutton",function(){
            discriminant = discriminant-1;
            p.innerHTML = "<font size = 20>"+discriminant+"</font>";
        },false);
    }
};
info_scr.main();