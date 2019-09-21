var demo = document.getElementById("demo");
var $controls = $("#controls");
var colorArray = ["#46a4cc", "#94c356", "#eae047", "#a63e4b", "#e3aa59", "#a63ba0", "#a2a2a2", "#4c42d1", "#cf5b21"];
var $swatches = $("#swatches rect");
var speed = 1;
var tl = new TimelineMax({repeat:-1});
var ease = Linear.easeNone;
var ease2 = Power2.easeInOut;
var highlight = "#3fa9f5";

// get path data for all six pieces using MorphSVG plugin
var handPath1 = MorphSVGPlugin.pathDataToBezier("#Rada1", {align: "#hand"});
var handPath2 = MorphSVGPlugin.pathDataToBezier("#Rada2", {align: "#hand"});
var handPath3 = MorphSVGPlugin.pathDataToBezier("#Rada3", {align: "#hand"});
var handPath4 = MorphSVGPlugin.pathDataToBezier("#Rada4", {align: "#hand"});

// basic alignment and initial color settings
TweenMax.set([$controls, demo], {transformOrigin:"center", xPercent:-50, autoAlpha:1});
TweenMax.set("#hand", { yPercent:-100, transformOrigin:"center"});
TweenMax.set("#handSlider", { x:26});
TweenMax.set(".theWords path", {stroke:colorArray[0], drawSVG:0});
TweenMax.set("#speedControl", {transformOrigin:"center center"});
TweenMax.set(".theWords ellipse", {autoAlpha:0, fill:colorArray[0]});
TweenMax.set("#groupSizer", {autoAlpha:0});

// fill color swatches from array
$swatches.each(function(i) {
	TweenMax.set(this, {fill:colorArray[i]}) 
});

// toggle control timelines
var iconTl = new TimelineMax({reversed: true, paused:true});

iconTl.to("#handSlider", 0.35, {x:0});
iconTl.to("#hand", 0.35, {autoAlpha:0},0);
iconTl.to(".off", 0.35, {opacity:1, fill:highlight}, 0);
iconTl.to(".on", 0.35, {opacity:0.35, fill:"#fff"}, 0);

var themeTl = new TimelineMax({reversed: true, paused:true});

themeTl.to("#themeSlider", 0.4, {x:26});
themeTl.to("#bg", 0.4, {fill:"#fff"}, 0);
themeTl.to(".light", 0.4, {opacity:1, fill:highlight}, 0);
themeTl.to(".dark", 0.4, {opacity:0.35, fill:"#fff"}, 0);

// button listeners
document.getElementById("playButton").addEventListener("click", playTimeline);
document.getElementById("pauseButton").addEventListener("click", pauseTimeline);
document.getElementById("handControl").addEventListener("click", function() {
	toggle(iconTl)
});
document.getElementById("themeControl").addEventListener("click", function() {
	toggle(themeTl)
});

// create the tween speed draggable
Draggable.create("#speedControl", {
	type:"rotation",
	bounds: {
		minRotation:-136,
		maxRotation: 136
	},
	onDrag: speedUpdate
		
		});  // end draggable create

// adjust the animation timeScale()
function speedUpdate() {
	var r = this.rotation;
	if (r < 0) {
		speed = 1+(r/150);
	} else {
		speed = (r/25)+1;
	} 
	tl.timeScale(speed.toFixed(2));
}

// timeline play/pause controls
function playTimeline() {
	if (tl.paused() ) {
		tl.play();
		TweenMax.to(tl, 0.75, {timeScale:speed});
		TweenMax.to(".play", 0.4, {fill:highlight, opacity:1});
		TweenMax.to(".pause", 0.4, {fill:"#fff", opacity:0.35});
	}
}

function pauseTimeline() {
	if (!tl.paused() ) {
		TweenMax.to(tl, 0.75, {
		timeScale:0, 
		onComplete: function() {
			tl.pause();
			}
		});
		TweenMax.to(".pause", 0.4, {fill:highlight, opacity:1});
		TweenMax.to(".play", 0.4, {fill:"#fff", opacity:0.35});
	}
}


// function for the toggle switch timelines
function toggle(t) {
	t.reversed() ? t.play() : t.reverse();
	
}


//change the  color of the stroke and dots
$swatches.click(function() {
	var newColor = colorArray[ $(this).index() ];
	TweenMax.to( ".theWords path", 1, { stroke:newColor });
	TweenMax.to( ".theWords ellipse", 1, { fill:newColor });
})	

// main timeline creation
// Rada1
tl.to("#Rada1", 7, {drawSVG:true, ease:ease});
tl.to("#hand", 7, { bezier:{values:handPath1, type:"cubic"}, ease:ease }, 0);
// Rada2
tl.add("path2");
tl.to("#Rada2", 7, {drawSVG:true, ease:ease}, "path2");
tl.to("#hand", 7, { bezier:{values:handPath2, type:"cubic"}, ease:ease }, "path2");
// Rada3
tl.add("path3");
tl.to("#Rada3", 2, {drawSVG:true, ease:ease}, "path3");
tl.to("#hand", 2, { bezier:{values:handPath3, type:"cubic"}, ease:ease }, "path3");
// Rada4
tl.add("path4");
tl.to("#Rada4", 9, {drawSVG:true, ease:ease}, "path4");
tl.to("#hand", 9, { bezier:{values:handPath4, type:"cubic"}, ease:ease }, "path4");
// move hand out of the way
tl.to("#hand", 0.75, { x:1300, y:675, ease:ease2 });
// move to beginning and fade out text for a seamless loop
tl.add("ending", "+=1");
tl.to("#hand", 1, { x:236.07, y:153.69, ease:ease2 }, "ending");
tl.to(".theWords path, .theWords ellipse", 0.75, {autoAlpha:0}, "ending");


// resize and center SVG demo and controls
function sizeAll() {
	var h = window.innerHeight;
	var	w = window.innerWidth;
	
	if ( w > (h-250)*2) {
		TweenMax.set(demo, {height:h-240, width:(h-250)*2});
		TweenMax.set($controls, {y:h-240});	
	}	else {
		TweenMax.set(demo, {y:0, width:w-10, height:w/2});
		TweenMax.set($controls, {y:w/2+10});	
	}
}


$(window).resize(sizeAll);
sizeAll();
