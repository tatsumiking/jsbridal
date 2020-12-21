

// マウスイベント定数
var INITEVENT=1;
var SETEVENT=2;
var UPSETEVENT=3;
var MOVEEVENT=4;
var UPMOVEEVENT=5;
var ENDEVENT=9;

var m_nMouseDown = 0;
var m_nMouseCrtX;
var m_nMouseCrtY;
var m_nMouseAdjustX = 0; // 微調整用データ
var m_nMouseAdjustY = -1;
var m_dScrnRltvSX = 0;
var m_dScrnRltvSY = 0;
var m_dScrnBaseX = 0;
var m_dScrnBaseY = 0;
var m_dLimit = 3;

var userAgent = window.navigator.userAgent.toLowerCase();

if(userAgent.indexOf('msie') != -1 && window.navigator.msPointerEnabled){
	document.addEventListener("MSPointerDown",fncMouseDown);
	document.addEventListener("MSPointerMove",fncMouseMove);
	document.addEventListener("MSPointerUp",fncMouseUp);
}else if(document.addEventListener){
	document.addEventListener("mousedown",fncMouseDown);
	document.addEventListener("mousemove",fncMouseMove);
	document.addEventListener("mouseup",fncMouseUp);
	//document.addEventListener("touchstart",fncTouchDown);
	//document.addEventListener("touchmove",fncTouchMove);
	//document.addEventListener("touchend",fncTouchUp);
}else if(document.attachEvent){
	document.attachEvent("onmousedown" , fncMouseDown);
	document.attachEvent("onmousemove" , fncMouseMove);
	document.attachEvent("onmouseup" , fncMouseUp);
}

function fncTouchDown(event)
{
	var x = event.targetTouches[0].pageX-m_nScrnLeft;
	var y = event.targetTouches[0].pageY-m_nScrnTop;
	if(fncCheckCanvasArea(x, y) == true){
		//event.preventDefault();
		fncMouseDownXY(x, y);
	}
}

function fncTouchMove(event)
{
	var x = event.targetTouches[0].pageX-m_nScrnLeft;
	var y = event.targetTouches[0].pageY-m_nScrnTop;
	if(fncCheckCanvasArea(x, y) == true){
		//event.preventDefault();
		m_nMouseCrtX = x;
		m_nMouseCrtY = y;
		fncMouseMoveXY(x, y);
	}
}

function fncTouchUp(event)
{
	x = m_nMouseCrtX;
	y = m_nMouseCrtY;
	if(fncCheckCanvasArea(x, y) == true){
		//event.preventDefault();
		fncMouseUpXY(x, y);
	}
}

function fncGetPointAdd()
{
	var pt;
	pt = new Point();
	var area = document.body.parentElement
	if(area == null || area.scrollLeft == null){
		pt.x = -m_nScrnLeft-m_nMouseAdjustX;
	}else{
		pt.x = -m_nScrnLeft-m_nMouseAdjustX+area.scrollLeft;
	}
	if(area == null || area.scrollTop == null){
		pt.y = -m_nScrnTop-m_nMouseAdjustY;
	}else{
		pt.y = -m_nScrnTop-m_nMouseAdjustY+area.scrollTop;
	}
	return(pt);
}
function fncCheckCanvasArea(x, y)
{
	var sx, sy, ex, ey;
	var area = document.getElementById("cnvsPaper");
	if(area == null){
		return(false);
	}
	sx = 0;
	sy = 0;
	ex = area.offsetWidth;
	ey = area.offsetHeight;
	if(sx < x && x < ex && sy < y && y < ey){
		return(true);
	}
	return(false);
}

function fncMouseDown(event)
{
	var pt = fncGetPointAdd();
	var x = event.clientX + pt.x;
	var y = event.clientY + pt.y;
	if(fncCheckCanvasArea(x, y) == true){
		fncMouseDownXY(x, y);
	}
	//m_txtInfo.textContent = "("+x+","+y+")";
}

function fncMouseUp(event)
{
	var pt = fncGetPointAdd();
	var x = event.clientX + pt.x;
	var y = event.clientY + pt.y;
	if(fncCheckCanvasArea(x, y) == true){
		fncMouseUpXY(x, y);
	}
	//m_txtInfo.textContent = "("+x+","+y+")";
}

function fncMouseMove(event)
{
	var pt = fncGetPointAdd();
	var x = event.clientX + pt.x;
	var y = event.clientY + pt.y;
	if(fncCheckCanvasArea(x, y) == true){
		fncMouseMoveXY(x, y);
	}
	//m_txtInfo.textContent = "("+x+","+y+")";
}

function fncMouseDownXY(x, y)
{
	var event;
	var dx, dy;
	var tx, ty;

	event = SETEVENT;
	m_nMouseDown = 1;
	dx = fncScrnTrnsRMX(x);
	dy = fncScrnTrnsRMY(y);
	tx = fncScrnTrnsMRX(dx);
	ty = fncScrnTrnsMRY(dy);
	dx = parseInt(dx);
	dy = parseInt(dy);
	fncCmdExec(event, dx, dy);
}

function fncMouseUpXY(x, y)
{
	var event;
	var dx, dy;

	event = UPSETEVENT;
	m_nMouseDown = 0;
	dx = fncScrnTrnsRMX(x);
	dy = fncScrnTrnsRMY(y);
	dx = parseInt(dx);
	dy = parseInt(dy);
	fncCmdExec(event, dx, dy);
}

function fncMouseMoveXY(x, y)
{
	var event;
	var dx, dy;

	if(m_nMouseDown == 1){
		event = MOVEEVENT;
	}else{
		event = UPMOVEEVENT;
	}
	dx = fncScrnTrnsRMX(x);
	dy = fncScrnTrnsRMY(y);
	dx = parseInt(dx);
	dy = parseInt(dy);
	fncCmdExec(event, dx, dy);
}

