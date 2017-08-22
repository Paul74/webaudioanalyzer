function penta(canvas,ctx, numberOfSides, size, values, onlyPenta, fullStar){

    var Xcenter = canvas.width / 2 -13,
        Ycenter = canvas.height / 2 +25,
        step  = 2 * Math.PI / numberOfSides,
        shift = (Math.PI / -180.0) * -18;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height); // to clear up
    ctx.fillStyle = "white";
    if (onlyPenta) ctx.beginPath();
    //ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

    var vPunti = [{},{},{},{},{},{}]; // x,y inner vertex
    var vStelle = [{},{},{},{},{}]; // x,y triangles spikes

    // find penta vertex on circle
    for (var i = 0; i <= numberOfSides; i++) {
    	var curStep = i * step + shift;
    	var x,y;
    	x = Xcenter + size * Math.cos(curStep);
    	y = Ycenter + size * Math.sin(curStep);
        if (onlyPenta) ctx.lineTo (x,y);
        
        //console.log(x + " " + y);
        vPunti[i].x = x;
        vPunti[i].y = y;
        //console.log(vPunti[i])
    }

	//ctx.strokeStyle = "hsl(100,100%,50%)";
    ctx.fillStyle = "yellow";
    ctx.font = ("12px Arial");
	ctx.lineWidth = 2;
   	if (onlyPenta) ctx.stroke();

    if (!onlyPenta)  {
    // draw triangles
        for (var i = 0; i < 5; i++) {

            // draw point to the triagles outer vertex as max value reference = -0.866
            var Xvertex = (vPunti[i].x + vPunti[i+1].x)/2 - (-0.866)*(vPunti[i+1].y-vPunti[i].y);
            var Yvertex = (vPunti[i].y + vPunti[i+1].y)/2 + (-0.866)*(vPunti[i+1].x-vPunti[i].x);
            ctx.fillRect(Xvertex-1, Yvertex-1,3,3); //draw a spot as vertex reference
                        
            var coeff = calcRemap(i,values,Xvertex,Yvertex,ctx);
            //console.log(values.slope.val)
            if (fullStar) coeff= -0.866; //draw full star
        	vStelle[i].x = (vPunti[i].x + vPunti[i+1].x)/2 - coeff*(vPunti[i+1].y-vPunti[i].y);
        	vStelle[i].y = (vPunti[i].y + vPunti[i+1].y)/2 + coeff*(vPunti[i+1].x-vPunti[i].x);

    	    ctx.beginPath();

            ctx.moveTo(vPunti[i].x,vPunti[i].y);
            ctx.lineTo(vStelle[i].x,vStelle[i].y);
            ctx.lineTo(vPunti[i+1].x,vPunti[i+1].y);

            ctx.strokeStyle = "hsl(0" + (i+1)*15 + ",100%,50%)";
    	    ctx.stroke();

        }
    }
};


function calcRemap(j, valobj, x, y, c) {
    var calc = 0;    
    for (xx in valobj) {
        if (valobj[xx].pos == j+1) {
            //console.log(xx + " " +valobj[xx].pos)
            switch (xx) {
            case "rms":
                c.fillText(j+1 + ":  rms",x+5,y);
                calc = valobj[xx].val.map(-60,0,0,-0.866);
                break;
            case "energy":
                c.fillText(j+1 + ":  energy",x+5,y);
                calc = valobj[xx].val.map(0,1058,0,-0.866);
                break;
            case "zcr":
                c.fillText(j+1 + ":  zcr",x+5,y);
                calc = valobj[xx].val.map(0,1,0,-0.866);
                break;
            case "centroid":
                c.fillText(j+1 + ":  centroid",x+5,y);
                calc = valobj[xx].val.map(0,22050,0,-0.866);
                break;
            case "flatness":
                c.fillText(j+1 + ":  flatness",x+5,y);
                calc = valobj[xx].val.map(0,1,0,-0.866);
                break;
            case "slope":
                c.fillText(j+1 + ":  slope",x+5,y);
                //console.log(valobj[xx].val)
                calc = valobj[xx].val.map(0,0.00000030,0.0000053,-0.866);
                break;
            case "rolloff":
                c.fillText(j+1 + ":  rolloff",x+5,y);
                calc = valobj[xx].val.map(0,22050,0,-0.866);
                break;
            case "spread":
                c.fillText(j+1 + ":  spread",x+5,y);
                calc = valobj[xx].val.map(1,75,0,-0.866);
                break;
            case "skewness":
                c.fillText(j+1 + ":  skewness",x+5,y);
                calc = valobj[xx].val.map(-1,1,0,-0.866);
                break;
            case "kurtosis":
                c.fillText(j+1 + ":  kurtosis",x+5,y);
                calc = valobj[xx].val.map(5,-300,0,-0.866);
                break;
            default:
                calc = -0.866;
            }
        }
    }
    return calc;
}


Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}