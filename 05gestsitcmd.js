
function fncCmdExec(event, dx, dy)
{
    var max, idx;
    var clsTA;

    if(event = SETEVENT){
        // fncCmdDebugPos(dx, dy);
        max = m_aryTableArea.length;
        for(idx = 0; idx < max; idx++){
            clsTA = m_aryTableArea[idx];
            if(clsTA.sx < x && x < clsTA.ex 
            && clsTA.sy < y && y < clsTA.ey){
                fncResetSitNames(clsTA);
                break;
             }
        }
    }
}
function fncResetSitNames(clsTA)
{
    if(m_nLeftTA == 0){
        m_nLeftTA = clsTA;
    }else{
        m_nLeftTA = m_nRightTA;
        m_nRightTA = clsTA;
    }
    if(m_nLeftTA == null){
        return;
    }
    fncSitLeftGestName("txtSit1R1", 0);


    
     
}
function fncSitLeftGestName(sCid, nIdx)
{
    clsTbl = m_clsLayout.tlines[m_nLeftTA.nLine].tables[m_nLeftTA.nClum];
    var txtCnt = document.getElementById(sCid);
    if(clsTbl.left[0] == 0){
        txtCnt.textContent = "";
    }else{
        name = fncGetGestName(clsTbl.left[0]);
        txtCnt.textContent = name;
    }

}
function fncGetGestName(nId)
{
    var max, idx;

    max = m_aryGestSit.length;
    for(idx = 0; idx < max; idx++){
        if(m_aryGestSit[idx].nId == nId){
            return(m_aryGestSit[idx].name);
        }
    }
    return("");
}
function fncCmdDebugPos(dx, dy)
{
	var sx, sy, ex, ey;

	sx = dx - m_dLimit;
	sy = dy - m_dLimit;
	ex = dx + m_dLimit;
	ey = dy + m_dLimit;
	sx = fncScrnTrnsMRX(sx);
	sy = fncScrnTrnsMRY(sy);
	ex = fncScrnTrnsMRX(ex);
	ey = fncScrnTrnsMRY(ey);
	fncCtxSetPen(m_ctxPaper, "#000000", 1);
	fncCtxLine(m_ctxPaper, sx, sy, ex, ey);
	fncCtxLine(m_ctxPaper, sx, ey, ex, sy);
}

function fncCtxSetPen(ctx, color, thick)
{
	ctx_sStrokeColor = color
	ctx_nStrokeThick = thick;
	ctx.strokeStyle = ctx_sStrokeColor;
	ctx.lineWidth = ctx_nStrokeThick;
}

function fncCtxLine(ctx, sx, sy, ex, ey)
{
	ctx.beginPath();
	ctx.moveTo(sx,sy);
	ctx.lineTo(ex,ey);
	ctx.stroke();
}
function fncScrnTrnsRMX(rltvx)
{
	var absx;
	var mmx;

	absx = (rltvx - m_dScrnRltvSX);
	mmx = absx - m_dScrnBaseX;
	return(absx);
}

function fncScrnTrnsRMY(rltvy)
{
	var absy;
	var mmy;

	absy = (rltvy - m_dScrnRltvSY);
	mmy = absy - m_dScrnBaseY;
	return(absy);
}
function fncScrnTrnsMRX(mmx)
{
	var absx;
	var rltvx;

	absx = mmx + m_dScrnBaseX;
	rltvx = absx + m_dScrnRltvSX;
	return(rltvx);
}

function fncScrnTrnsMRY(mmy)
{
	var absx;
	var rltvy;

	absy = mmy + m_dScrnBaseY;
	rltvy = absy + m_dScrnRltvSY;
	return(rltvy);
}

