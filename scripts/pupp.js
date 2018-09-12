class content {
	constructor(){
		this.id = 0;
		this.title = "";
		this.emojititle = "";
		this.level = 0;
		this.media  = {"startTime" : "", "endTime": "", "id" : "", "provider" : "", "type" : ""};
		this.questions = [];
		this.scenario = [];
		this.skills = [];
		this.tags = [];

	}
}

class question {
	constructor(){
		this.speechText = "";
		this.intentName = "";
		this.expectedAnswers = [];
		this.hint = {choices : [], type : "multi-choice"};
		this.indicator = {image: "arrow",angle : 0,width : 50,center : {x : 0, y : 0}};
		this.startTime = 0;
		this.stopTime = 0;
	}
}

function intToTime(int){
	var dakika = 0, saniye = 0, saat;
	saniye = int % 60;
	dakika = (int - saniye) % 3600;
	saat = (int - saniye - dakika) % (60 * 60 * 60);
	saat = saat / 3600;
	dakika = dakika / 60;
	if(saat==0){
		return dakika + ":" + saniye;
	}else{
		return saat + ":" + dakika + ":" + saniye;
	}
}

function activeQuestion(index){
	selectQuestion = index;
	var ques = document.querySelectorAll(".question span");
	if(selectQuestion >= ques.length){
		selectQuestion = ques.length - 1;
	}

	if(ques.length > 1){
		if(ques.length <= index){ index = ques.length - 1;}
		var width = Math.floor((100 - (ques.length * 2 / 10)) / (ques.length + 4));
		for (var i = 1; i < ques.length; i++){
			ques[i].style.width = width + "%";
			if(ques[i].classList)
				ques[i].classList.remove("active");
		}
		ques[index].classList.add("active");
		ques[index].style.width = (3 * width) + "%";
		getQuestion();
	}
}

function createQuestion(){
	cont.questions.push(new question());
	selectQuestion = cont.questions.length;
	var questi = document.querySelector(".question");
	questi.innerHTML = questi.innerHTML + '<span onclick="activeQuestion(' + (selectQuestion) + ')">' + selectQuestion + '<abbr onclick="deleteQuestin(' + (selectQuestion) + ')"><i class="fas fa-times"></i></abbr></span>';
	activeQuestion(selectQuestion);
}

function GetTime(is){
	var time = Math.floor(player.getCurrentTime());
	if(selectQuestion == -1)
		return false;
	var i = selectQuestion - 1;
	var start = document.querySelector("input[name=startTime]");
	var stop = document.querySelector("input[name=stopTime]");
	if(is == "stop"){
		if(i < cont.questions.length - 1){
			if(cont.questions[i + 1].startTime < time && cont.questions[i + 1].startTime != "0"){
				time = cont.questions[i + 1].startTime - 1;
			}
		}
		if(start.value.trim() != "" && start.value.trim() != "0" ){
			if(time <= start.value){
				time = Number(start.value) + 1;
			}
		}
		cont.questions[i].stopTime = time;
		stop.value = time;
	}else{
		if(i>0){
			if(cont.questions[i - 1].stopTime > time){
				time = cont.questions[i - 1].stopTime + 1;
			}
		}
		if(stop.value.trim() != "" && stop.value.trim() != "0"){
			if(time >= stop.value){
				time = Number(stop.value) - 1;
			}
		}
		cont.questions[i].startTime = time;
		start.value = time;
	}
	var ques = document.querySelectorAll(".question span");
	ques[selectQuestion].innerHTML = intToTime(cont.questions[i].startTime) + "-" + intToTime(cont.questions[i].stopTime);
}

function setPlayerID(event, th){
	if(event.keyCode == 13){
		var txt = th.value;
		var txts = txt.split('&');
		var index = txts[0].indexOf('v=');
		if(index > -1){
			var id = txts[0].slice(index+2);
			player.loadVideoById(id);
			cont.media.id = id,
			cont.media.provider = "youtube";
			cont.media.type = "video";
		}else {
			alert("Sadece Video URL'i kabul edilir.");
		}
	}
}

function setVideoTime(e) {
	var time = Math.floor(player.getCurrentTime());
	if(e=="start"){
		var input = document.querySelector("input[name=videoStartTime]");
		cont.media.startTime = time;
	} else {
		var input = document.querySelector("input[name=videoStopTime]");
		cont.media.endTime = time;
	}
	input.value = time;
}

function setContentInfo(id){
	switch (id.name) {
		case "id":
			cont.id = id.value;
		break;
		case "title":
			cont.title = id.value;
		break;
		case "emojititle":
			cont.emojititle = id.value;
		break;
		case "level":
			cont.level = id.value;
		break;
		case "scenario":
			cont.scenario = [];
			var params = id.value.split(',');
			var i=0;
			for(i=0; i < params.length; i++){
				if(params[i].trim() != ""){
					cont.scenario.push(params[i].trim());
				}
			}
		break;
		case "skills":
			cont.skills = [];
			var params = id.value.split(',');
			var i=0;
			for(i=0; i < params.length; i++){
				if(params[i].trim() != ""){
					cont.skills.push(params[i].trim());
				}
			}
		break;
		case "tags":
			cont.tags = [];
			var params = id.value.split(',');
			var i=0;
			for(i=0; i < params.length; i++){
				if(params[i].trim() != ""){
					cont.tags.push(params[i].trim());
				}
			}
		break;
	}
}

function deleteQuestin(index){
	var ques = document.querySelectorAll(".question span");
	ques[ques.length - 1].remove();
	for(var i = index; i < ques.length - 1;i++){
		cont.questions[i-1] = cont.questions[i];
	}
	cont.questions.pop();
}

function setQuestion(id){
	if(selectQuestion != -1){
		var i = selectQuestion - 1;
		switch (id.name) {
			case "question":
				cont.questions[i].speechText = id.value.trim();
			break;
			case "intentName":
				cont.questions[i].intentName = id.value.trim();
			break;
			case "startTime":
				cont.questions[i].startTime = id.value.trim();
			break;
			case "stopTime":
				cont.questions[i].stopTime = id.value.trim();
			break;
		}
	}else {
		id.value = "";
	}
}

function createExpectedAnswers() {
	if(selectQuestion != -1){
		var i = selectQuestion - 1;
		var length = cont.questions[i].expectedAnswers.length;
		var expectedAnswers = document.querySelector(".expectedAnswers");
		expectedAnswers.innerHTML += '<div class="expectedAnswer" index="' + length + '"><label> <abbr title="index">' + (length + 1) + ':</abbr> <input type="text" name="eaID'+length+'"/><input type="text" name="eaValue'+length+'" /><span class="add" onclick="createEAitem(' + length + ')"><i>+</i></span></label></div>';

		cont.questions[i].expectedAnswers.push([]);
	}
}

function createEAitem(index) {
	if(selectQuestion != -1){
		var i = selectQuestion - 1,
			length = cont.questions[i].expectedAnswers.length,
			expectedAnswers = document.querySelectorAll(".expectedAnswer"),
			id = document.querySelector("input[name=eaID" + (index) + "]").value,
			value = document.querySelector("input[name=eaValue" + (index) + "]").value;
		if(id!="" && value!=""){
			var cou = cont.questions[i].expectedAnswers[index].length;
			expectedAnswers[index].innerHTML += '<span index="' + cou + '">' + id + '<br>' + value + '</span>';
			cont.questions[i].expectedAnswers[index].push({ id : id , value : value });
		}else{
			alert("Please do not leave blank");
		}
	}
}

function createHint() {
	if(selectQuestion != -1){
		var i = selectQuestion - 1,
			hint = document.querySelector(".hint"),
			hintSpeechText = document.querySelector("input[name=hintSpeechText]"),
			hintViewUri = document.querySelector("input[name=hintViewUri]"),
			hintIsCorrect = document.querySelector("input[name=hintIsCorrect]"),
			choicesType = document.querySelector("input[name=choicesType]");
			if(hintSpeechText.value=="" || hintViewUri.value=="" || choicesType.value==""){alert("Please do not leave blank");return false;}
		hint.innerHTML += '<span index="">' + hintSpeechText.value + '<br />' + hintViewUri.value + '<br />' + hintIsCorrect.checked + '<br />' + choicesType.value + '</span>';
		cont.questions[i].hint.choices.push({ "attributes" : {"speechText" : hintSpeechText.value, "viewUri" : hintViewUri.value } ,"isCorrect" : hintIsCorrect.checked, "type" : choicesType.value});
		hintViewUri.value  = choicesType.value = hintSpeechText.value = "";
		hintIsCorrect.checked = "";
	}
}

function hintTypeChange(th) {
	if(selectQuestion != -1){
		var i = selectQuestion - 1;
		cont.questions[i].hint.type = th.value;
	}
}

function getQuestion(){
	var i = selectQuestion - 1;
	var names = ["question", "intentName", "startTime", "stopTime"];
	var values = [cont.questions[i].speechText, cont.questions[i].intentName, cont.questions[i].startTime, cont.questions[i].stopTime];
	for (var c = 0; c < names.length; c++) {
		document.querySelector("input[name=" + names[c] + "]").value = values[c];
	}

	var expectedAnswers = document.querySelector(".expectedAnswers");
	expectedAnswers.innerHTML = "";
	for(var c = 0; c < cont.questions[i].expectedAnswers.length; c++){
		var html = "";
		html += '<div class="expectedAnswer" index="' + c + '"><label> <abbr title="index">' + (c+1) + ':</abbr> <input type="text" name="eaID' + c + '"><input type="text" name="eaValue' + c + '"><span class="add" onclick="createEAitem(' + c + ')"><i>+</i></span></label>';
		for(var j = 0;j <  cont.questions[i].expectedAnswers[c].length; j++){
			html += '<span index="' + j + '">' + cont.questions[i].expectedAnswers[c][j].id + '<br>' + cont.questions[i].expectedAnswers[c][j].value + '</span>';
		}
		html += "</div>";
		expectedAnswers.innerHTML += html;
	}

	var hint = document.querySelector(".hint");
	hint.innerHTML = "";
	for(var c = 0; c < cont.questions[i].hint.choices.length; c++){
		hint.innerHTML += '<span index="' + c + '">' + cont.questions[i].hint.choices[c].attributes.speechText + '<br />' + cont.questions[i].hint.choices[c].attributes.viewUri + '<br />' + cont.questions[i].hint.choices[c].isCorrect + '<br />' + cont.questions[i].hint.choices[c].type + '</span>';
	}

	var indicator = document.querySelector(".indicatorImg");
	var indicatorImg = document.querySelector(".indicatorImg img");
	var indicatorControl = document.querySelector(".indicatorControl");
	indicator.style.top = cont.questions[i].indicator.center.y + "%";
	indicator.style.left = cont.questions[i].indicator.center.x + "%";
	indicatorControl.style.left = "calc(" + cont.questions[i].indicator.center.x + "% + 60px)";
	indicatorControl.style.top = cont.questions[i].indicator.center.y + "%";
	indicatorImg.style.width = cont.questions[i].indicator.width + "px";
	indicator.style.transform = "rotate(" + cont.questions[i].indicator.angle + "deg)";
	indicatorImg.src = "images/" + cont.questions[i].indicator.image + ".png";

}

function showJson(){
	backupJson();
	document.querySelector(".jsonPrint").style.display = "block";
	document.querySelector(".backClose").style.display = "block";
}

function backupJson(){
	var json = JSON.stringify(cont, undefined, 4);
	document.querySelector("textarea[name=json]").value = json;
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem("backup", json);
	}
}

function closeJson(){
	document.querySelector(".jsonPrint").style.display = "none";
	document.querySelector(".backClose").style.display = "none";
}

function parseJson(){
	closeJson();
	var json = document.querySelector("textarea[name=json]").value;
	cont = JSON.parse(json);
	var ques = document.querySelectorAll(".question span:not(.add)");
	for(var i = 0; i < ques.length; i++){
		ques[i].outerHTML = "";
	}

	var select = ['id','level','scenario','skills','tags','title','emojititle'];
	for(var i = 0;i < select.length; i++){
		var input = document.querySelector("input[name=\"" + select[i] + "\"]");
		var data = cont[select[i]];
		input.value = data;
	}

	var questi = document.querySelector(".question");
	for(var i = 0;i < cont.questions.length;i++){
		var time;
		if(cont.questions[i].startTime != "0" || cont.questions[i].stopTime != "0"){
			time = intToTime(cont.questions[i].startTime) + "-" + intToTime(cont.questions[i].stopTime);
		}else{
			time = i+1;
		}
		questi.innerHTML = questi.innerHTML + '<span onclick="activeQuestion(' + (i+1) + ')">' + time + '<abbr onclick="deleteQuestin(' + (i+1) + ')"><i class="fas fa-times"></i></abbr></span>';
	}
	if( cont.media.id != ""){
		document.querySelector("input[name=url]").value = "https://youtube.com/watch?v=" + cont.media.id;
		document.querySelector("input[name=videoStartTime]").value = cont.media.startTime;
		document.querySelector("input[name=videoStopTime]").value = cont.media.endTime;
		player.loadVideoById(cont.media.id);
	}
	activeQuestion(cont.questions.length);
}

function decimalAdjust(type, value, exp) {
	if (typeof exp === 'undefined' || +exp === 0) {
		return Math[type](value);
	}
	value = +value;
	exp = +exp;
	if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
		return NaN;
	}
	value = value.toString().split('e');
	value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
	value = value.toString().split('e');
	return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

if (!Math.round10) {
	Math.round10 = function(value, exp) {
		return decimalAdjust('round', value, exp);
	};
}

function indicatorMove(e, th) {
	if(event.target!=th){
		return false;
	}
	if(selectQuestion != -1){
		var indicator = document.querySelector(".indicator"),
			i = selectQuestion - 1;
			videoEmbed = document.querySelector(".videoEmbed"),
			indicatorTop = videoEmbed.offsetTop,
			indicatorLeft = (w - indicator.clientWidth) / 2,
			indicatorImg = document.querySelector(".indicator .indicatorImg"),
			indicatorImgW = document.querySelector(".indicator .indicatorImg img").clientWidth,
			indicatorControl = document.querySelector(".indicator .indicatorControl");

			var topMod = Math.round10(((e.clientY - indicatorTop) * 100 ) / 455, -1),
			leftMod =  Math.round10((e.clientX - indicatorLeft)  / 8, -1);
			cont.questions[i].indicator.center.x = leftMod;
			cont.questions[i].indicator.center.y = topMod;
			indicatorControl.style.top = indicatorImg.style.top = topMod + "%";
			indicatorImg.style.left = leftMod + "%";
			indicatorControl.style.left = (e.clientX - indicatorLeft) + 10 + indicatorImgW + "px";
	} else {
		alert("Please Select Question");
	}
}

function setAngle(th){
	if(selectQuestion != -1){
		var i = selectQuestion - 1;
		var indicator = document.querySelector(".indicator"),
		indicatorImg = document.querySelector(".indicator .indicatorImg");
		indicatorImg.style.transform = "rotate(" + th.value + "deg)";
		cont.questions[i].indicator.angle = th.value.trim();
	}
}

function toggleEdit(th) {
	var indicator = document.querySelector(".indicator");
	if(th.classList.contains("down")){
		indicator.classList.add("none");
		th.classList.replace("down","up");
	}else{
		indicator.classList.remove("none");
		th.classList.replace("up","down");
	}
}

function changeIndicator(th){
	if(selectQuestion != -1){
		var i = selectQuestion - 1;
		var indicatorImg = document.querySelector(".indicator .indicatorImg img");
		indicatorImg.src = "images/" + th.value + ".png";
		cont.questions[i].indicator.image = th.value.trim();

	}
}

function setIndicatorWidth(th){
	if(selectQuestion != -1){
		var i = selectQuestion - 1;
		var indicatorImg = document.querySelector(".indicator .indicatorImg img");
		indicatorImg.width = th.value;
		cont.questions[i].indicator.width = th.value.trim();
	}
}

window.onload = function(e){
	w = window.innerWidth,
	h = window.innerHeight;

	document.querySelector("textarea[name=json]").value = localStorage.getItem("backup");
	parseJson();

	setInterval(function(){ backupJson(); }, 1000);
}

var w, h;
var cont = new content();
var countQuestion = 0;
var selectQuestion = -1;
