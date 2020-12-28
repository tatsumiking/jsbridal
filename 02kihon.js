
var m_szHotelName;
var m_szHotelDB;
var m_szKonreiTable;
var m_strID; // login value;
var m_strPW; // login value;
var m_strUserKind;

var m_nKonreiId; // 画面表示用一事保管
var m_sKonreiNo; // 画面表示用一事保管
var m_sKonreiPW;

var m_strOderSql;
var m_nDispNengo; // 0 西暦表示 1 年号表示

function fncInit()
{
	var sId;

	m_szHotelName = localStorage.getItem("HotelName");
	m_szHotelDB = localStorage.getItem("HotelDB");
	m_szKonreiTable = localStorage.getItem("KonreiTable");
	m_strID = localStorage.getItem("BridalID");
	m_strPW = localStorage.getItem("BridalPW");
	m_strUserKind = localStorage.getItem("UserKind");
	m_nDispNengo = 0;

	fncInitNengouComboBox();
	fncInitKaijyouComboBox();

	fncInitSinroZokugaraComboBox();
	fncInitSinpuZokugaraComboBox();
	var btnKonreiCopy = document.getElementById("btnKonreiCopy");
	btnKonreiCopy.onclick = fncOnClickKonreiCopy;
	var btnPCCsvLoad = document.getElementById("btnPCCsvLoad");
	btnPCCsvLoad.onchange = fncOnChangePCCsvLoad;
	var btnNew = document.getElementById("btnNew");
	btnNew.onclick = fncOnClickNew;
	var btnUpdate = document.getElementById("btnUpdate");
	btnUpdate.onclick = fncOnClickUpdate;
	var btnDelete = document.getElementById("btnDelete");
	var divKonreiListArea = document.getElementById("divKonreiListArea");
	if(m_strUserKind == "1")
	{
		btnNew.style.visibility = 'visible';
		btnDelete.style.visibility = 'visible';
		divKonreiListArea.style.visibility = 'visible';
		btnDelete.onclick = fncOnClickDelete;
		// var rdoItems = document.getElementsByName("sort");
		// if(rdoItems[idx].checked == true) rdoItems[idx].value;
		var rdoNoAsc = document.getElementById("rdoNoAsc");
		rdoNoAsc.onclick = fncOnClickRdoNoAsc;
		var rdoNoDesc = document.getElementById("rdoNoDesc");
		rdoNoDesc.onclick = fncOnClickRdoNoDesc;
		var rdoDateAsc = document.getElementById("rdoDateAsc");
		rdoDateAsc.onclick = fncOnClickRdoDateAsc;
		var rdoDateDesc = document.getElementById("rdoDateDesc");
		rdoDateDesc.onclick = fncOnClickRdoDateDesc;
		var lstKonrei = document.getElementById("lstKonrei");
		lstKonrei.onchange = fncOnChangeKonreiList;

		sId = localStorage.getItem("KonreiId");
		m_nKonreiId = fnclibStringToInt(sId);
		m_sKonreiNo = localStorage.getItem("KonreiNo");
		if(m_sKonreiNo != "0")
		{
			fncGetKonreiData();
		}
		fncOnClickRdoNoAsc(); // m_strOderSql = " ORDER BY userno ASC";
	}else{
		sId = localStorage.getItem("KonreiId");
		m_nKonreiId = fnclibStringToInt(sId);
		m_sKonreiNo = localStorage.getItem("KonreiNo");

		btnNew.style.visibility = 'hidden';
		btnDelete.style.visibility = 'hidden';
		divKonreiListArea.style.visibility = 'hidden';
		fncGetKonreiData();
	}
	var btnReturn = document.getElementById("btnReturn");
	btnReturn.onclick = fncOnClickReturn;
}
function fncOnChangeKonreiList()
{
	var lstKonrei = document.getElementById("lstKonrei");
	var idx = lstKonrei.selectedIndex;
	m_nKonreiId = lstKonrei.options[idx].value;
	fncGetKonreiData();
}
function fncOnClickKonreiCopy()
{
	txtKonreiId = document.getElementById("txtKonreiId");
	m_nKonreiId = fnclibStringToInt(txtKonreiId.textContent);
	txtKanriNo = document.getElementById("txtKanriNo");
	m_sKonreiNo = txtKanriNo.value;
	fncKonreiCopy(); // 02kihoncopy.jsで定義
}
function fncOnChangePCCsvLoad()
{
	if(this.files.length == 0){
		fnclibAlert("アップロードファイルが選択されていません");
		return;
	}
	txtKonreiId = document.getElementById("txtKonreiId");
	m_nKonreiId = fnclibStringToInt(txtKonreiId.textContent);
	txtKanriNo = document.getElementById("txtKanriNo");
	m_sKonreiNo = txtKanriNo.value;
	if(m_nKonreiId == 0){
		fnclibAlert("婚礼が選択されていません");
		return;
	}
	var fileObj = this.files[0];
	var fileReader = new FileReader();
	fileReader.onload = fncUploadOnPCCsvLoad;
	fileReader.readAsDataURL(fileObj);
}
function fncUploadOnPCCsvLoad(e)
{
	var base64img;
	
	base64img = e.target.result;
	var data = "file="+"../list/ge"+m_sKonreiNo+"/ge"+m_sKonreiNo+".csv";
	data = data + "&data="+base64img;
	sendRequest("POST","php/uploadcsv.php",data,false,fncUploadPCCsvCallBack);
}
function fncUploadPCCsvCallBack(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(',');
	if(ary[0] == "0"){
		return;
	}
	var dbnm = m_szHotelDB;
	var krtbl = m_szKonreiTable;
	var recid = m_nKonreiId;
	var data = "dbnm="+dbnm+"&krtbl="+krtbl+"&recid="+recid+"&krno="+m_sKonreiNo;
	sendRequest("POST","php/loadpccsv.php",data,false,fncLoadPCCsvCallBack);	
}
function fncLoadPCCsvCallBack(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(',');
	if(ary[0] == "0"){
		return;
	}
	fncSaveCsvData();
	fnclibAlert("PCから婚礼招待者情報を読み込みました");
}
function fncOnClickNew()
{
	var txtKonreiId = document.getElementById("txtKonreiId");
	m_nKonreiId = fnclibStringToInt(txtKonreiId.textContent);
	var txtKanriNo = document.getElementById("txtKanriNo");
	m_sKonreiNo = txtKanriNo.value;
	var txtKanriPW = document.getElementById("txtKanriPW");
	m_sKonreiPW = txtKanriPW.value;

	if(m_sKonreiNo == "")
	{
		fnclibAlert("婚礼管理番号が設定されていないため新規作成は出来ません");
		return;
	}
	if(m_sKonreiNo.length != 6)
	{
		fnclibAlert("婚礼管理番号は0を含む６桁で設定されていないため新規作成は出来ません");
		return;
	}
	if(m_sKonreiPW == "")
	{
		fnclibAlert("婚礼管理ＰＷが設定されていないため新規作成は出来ません");
		return;
	}
	if(m_sKonreiPW.length != 6)
	{
		fnclibAlert("婚礼管理ＰＷは0を含む６桁で設定されていないため新規作成は出来ません");
		return;
	}
	fncCheckNOPW();
}
function fncCheckNOPW()
{
	var data = "com="+m_sKonreiNo+","+m_sKonreiPW+",";
	var fnc = fncCheckNOPWCallback;
	sendRequest("POST","php/checkidpw.php",data,false,fnc);
}
function fncCheckNOPWCallback(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(',');
	if(ary[0] == "0"){
		fnclibAlert("パスワードが違います");
		return;
	}
	var dbnm = m_szHotelDB;
	var tble = m_szKonreiTable;
	var fild = "id,username";
	var where = "WHERE (username="+m_sKonreiNo+") LIMIT 1";
	var data = "dbnm="+dbnm+"&tble="+tble+"&fild="+fild+"&where="+where;
	var fnc = fncExistsKonreiNoCallBack;
	sendRequest("POST","php/getdata.php",data,false,fnc);
}
function fncExistsKonreiNoCallBack(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(',');
	if(ary[0] != "0"){
		fnclibAlert("ご使用の婚礼管理番号はすでに使用されています");
		m_nKonreiId = ary[0];
		var txtKonreiId = document.getElementById("txtKonreiId");
		txtKonreiId.textContent = txtKonreiId;
		fncGetKonreiData();
		return;
	}

	var dbnm = m_szHotelDB;
	var krtbl = m_szKonreiTable;
	var krno = m_sKonreiNo;
	var krpw = m_sKonreiPW;
	var data = "dbnm="+dbnm+"&krtbl="+krtbl+"&krno="+krno+"&krpw="+krpw;
	var fnc = fncCheckKonreiCallBack;
	sendRequest("POST","php/initkonrei.php",data,false,fnc);
}
function fncCheckKonreiCallBack(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(',');
	var txtKonreiId = document.getElementById("txtKonreiId");
	if(ary[0] == "0"){
		return;
	}
	txtKonreiId.textContent = ary[1];
	m_nKonreiId = fnclibStringToInt(txtKonreiId.textContent);
	fncUpdateKonreiData();
	if(m_strUserKind == "1")
	{
		fncInitKonreiListBox();	
	}
}
function fncOnClickUpdate()
{
	var txtKonreiId = document.getElementById("txtKonreiId");
	m_nKonreiId = fnclibStringToInt(txtKonreiId.textContent);
	var txtKanriNo = document.getElementById("txtKanriNo");
	m_sKonreiNo = txtKanriNo.value;
	
	fncUpdateKonreiData();
}
function fncUpdateKonreiData()
{
	var idx;
	var sKyosiki, sHirouen;
	var sKaijyou, sMukotori;
	var sSinroZoku, sSinroName1, sSinroName2;
	var sSinpuZoku, sSinpuName1, sSinpuName2;
	var sSinroDish, sSinpuDish;
	var sSinroSub, sSinpuSub;

	var cmbKyosikiNengo = document.getElementById("cmbKyosikiNengo");
	var txtKyosikiGG = document.getElementById("txtKyosikiGG");
	var nGG = fnclibStringToInt(txtKyosikiGG.value);
	idx = cmbKyosikiNengo.selectedIndex;
	var sNengo = cmbKyosikiNengo.options[idx].text;
	var sYY = fncNengouToFullYear(nGG, sNengo);
	txtKyosikiMM = document.getElementById("txtKyosikiMM");
	var sMM = txtKyosikiMM.value
	txtKyosikiDD = document.getElementById("txtKyosikiDD");
	var sDD = txtKyosikiDD.value;
	txtKyosikiHH = document.getElementById("txtKyosikiHH");
	var sHH = txtKyosikiHH.value;
	txtKyosikiMN = document.getElementById("txtKyosikiMN");
	var sMN = txtKyosikiMN.value;
	sKyosiki = sYY+"-"+sMM+"-"+sDD+" "+sHH+":"+sMN+":00";

	var cmbHirouenNengo = document.getElementById("cmbHirouenNengo");
	var txtHirouenGG = document.getElementById("txtHirouenGG");
	idx = cmbHirouenNengo.selectedIndex;
	var sNengo = cmbHirouenNengo.options[idx].text;
	var nGG = fnclibStringToInt(txtHirouenGG.value);
	var sNengo = cmbHirouenNengo.text;
	var sYY = fncNengouToFullYear(nGG, sNengo);
	txtHirouenMM = document.getElementById("txtHirouenMM");
	var sMM = txtHirouenMM.value
	txtHirouenDD = document.getElementById("txtHirouenDD");
	var sDD = txtHirouenDD.value;
	txtHirouenHH = document.getElementById("txtHirouenHH");
	var sHH = txtHirouenHH.value;
	txtHirouenMN = document.getElementById("txtHirouenMN");
	var sMN = txtHirouenMN.value;
	sHirouen = sYY+"-"+sMM+"-"+sDD+" "+sHH+":"+sMN+":00";

	cmbKaijyou = document.getElementById("cmbKaijyou");
	sKaijyou = cmbKaijyou.value;

	chkMukotori = document.getElementById("chkMukotori");
	if(chkMukotori.checked == true)
	{
		sMukotori = "1";
	}else{
		sMukotori = "0";
	}

	cmbSinroZokugara = document.getElementById("cmbSinroZokugara");
	sSinroZoku = cmbSinroZokugara.value;
	txtSinroMyouji = document.getElementById("txtSinroMyouji");
	sSinroName1 = txtSinroMyouji.value;
	txtSinroNamae = document.getElementById("txtSinroNamae");
	sSinroName2 = txtSinroNamae.value;
	
	cmbSinpuZokugara = document.getElementById("cmbSinpuZokugara");
	sSinpuZoku = cmbSinpuZokugara.value;
	txtSinpuMyouji = document.getElementById("txtSinpuMyouji");
	sSinpuName1 = txtSinpuMyouji.value;
	txtSinpuNamae = document.getElementById("txtSinpuNamae");
	sSinpuName2 = txtSinpuNamae.value;
	
	txtSinroRyouri = document.getElementById("txtSinroRyouri");
	sSinroDish = txtSinroRyouri.value;
	txtSinpuRyouri = document.getElementById("txtSinpuRyouri");
	sSinpuDish = txtSinpuRyouri.value;
	txtSinroBikou = document.getElementById("txtSinroBikou");
	sSinroSub = txtSinroBikou.value;
	txtSinpuBikou = document.getElementById("txtSinpuBikou");
	sSinpuSub = txtSinpuBikou.value;

	var dbnm = m_szHotelDB;
	sSql = "UPDATE "+m_szKonreiTable+" SET ";
	sSql = sSql+"kyosiki='"+sKyosiki+"',hirouen='"+sHirouen+"'";
	sSql = sSql+",kaijyou='"+sKaijyou+"',mukotori="+sMukotori;
	sSql = sSql+",sinrozoku='"+sSinroZoku+"',sinroname1='"+sSinroName1+"',sinroname2='"+sSinroName2+"'";
	sSql = sSql+",sinpuzoku='"+sSinpuZoku+"',sinpuname1='"+sSinpuName1+"',sinpuname2='"+sSinpuName2+"'";
	sSql = sSql+",sinrodish='"+sSinroDish+"',sinpudish='"+sSinpuDish+"'";
	sSql = sSql+",sinrosub='"+sSinroSub+"',sinpusub='"+sSinpuSub+"'";
	sSql = sSql+" WHERE (id="+m_nKonreiId+");";
	var data = "dbnm="+dbnm+"&sql="+sSql;
	var fnc = fncUpdateKonreiCallback;
	sendRequest("POST","php/execsql.php",data,false,fnc);
}
function fncUpdateKonreiCallback(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(",");
	if(ary[0] == "0"){
		fnclibAlert(m_szKonreiTable+"婚礼管理番号"+m_sKonreiNo+"の婚礼レコードの更新に失敗しました");
		return;
	}
	fncSaveCsvData();
}
function fncOnClickDelete()
{
	var txtKonreiId = document.getElementById("txtKonreiId");
	m_nKonreiId = fnclibStringToInt(txtKonreiId.textContent);
	var txtKanriNo = document.getElementById("txtKanriNo");
	m_sKonreiNo = txtKanriNo.value;

	if(m_nKonreiId != 0){
		var ret = fnclibMessageWindow("削除確認","現在表示されている婚礼を削除してよろしいですか？");
		if(ret == "Cancel"){
			return;
		}
	}else{
		fnclibAlert("婚礼が選択されていません");
		return;
	}
	var sGestTableName = "ge"+m_sKonreiNo;
	var sSql = "DROP TABLE "+sGestTableName; // テーブルの削除
	var data = "sql="+sSql;
	var fnc = fncDeleteGestTableCallback;
	sendRequest("POST","php/execsql.php",data,false,fnc);
}
function fncDeleteGestTableCallback(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(",");
	var sGestTableName = "ge"+m_sKonreiNo;
	if(ary[0] == "0"){
		fnclibAlert("招待者テーブル"+sGestTableName+"の削除に失敗しました");
		return;
	}
	var sSql = "DELETE FROM "+m_szKonreiTable+" WHERE (id="+m_nKonreiId+") LIMIT 1;"
	var data = "sql="+sSql;
	var fnc = fncDeleteKonreiCallback;
	sendRequest("POST","php/execsql.php",data,false,fnc);
}
function fncDeleteKonreiCallback(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(",");
	if(ary[0] == "0"){
		fnclibAlert(m_szKonreiTable+"テーブルの婚礼管理番号"+m_sKonreiNo+"のレコードの削除に失敗しました");
		return;
	}
	if(m_strUserKind == "1")
	{
		fncInitKonreiListBox();	
	}
	var txtKonreiId = document.getElementById("txtKonreiId");
	txtKonreiId.textContent = "";
}
function fncOnClickReturn()
{
	localStorage.setItem("KonreiId", m_nKonreiId);
	localStorage.setItem("KonreiNo", m_sKonreiNo);
	var url = "01menu.html";
	window.location.href = url;
}
function fncOnClickRdoNoAsc()
{
	m_strOderSql = " ORDER BY userno ASC";
	if(m_strUserKind == "1")
	{
		fncInitKonreiListBox();	
	}
}
function fncOnClickRdoNoDesc()
{
	m_strOderSql = "ORDER BY userno DESC";
	if(m_strUserKind == "1")
	{
		fncInitKonreiListBox();	
	}
}
function fncOnClickRdoDateAsc()
{
	m_strOderSql = "ORDER BY kyosiki ASC";
	if(m_strUserKind == "1")
	{
		fncInitKonreiListBox();	
	}
}
function fncOnClickRdoDateDesc()
{
	m_strOderSql = "ORDER BY kyosiki DESC";
	if(m_strUserKind == "1")
	{
		fncInitKonreiListBox();	
	}
}
function fncSaveCsvData()
{
	var dbnm = m_szHotelDB;
	var krtbl = m_szKonreiTable;
	var recid = m_nKonreiId;
	var krno = m_sKonreiNo;

	if(m_nKonreiId == 0){
		return;
	}
	var data = "dbnm="+dbnm+"&krtbl="+krtbl+"&recid="+recid+"&krno="+krno;
	var fnc = fncSaveCsvCallBack;
	sendRequest("POST","php/savecsv.php",data,false,fnc);
}
function fncSaveCsvCallBack(xmlhttp)
{
	var data = xmlhttp.responseText;
	var ary = data.split(',');
	if(m_strUserKind == "1")
	{
		fncInitKonreiListBox();	
	}
	if(ary[0] == "0"){
		return;
	}
	var aCsvSave = document.getElementById("aCsvSave");
	aCsvSave.href = "temp/download/ge"+m_sKonreiNo+".csv";
}
// 
