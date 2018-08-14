class content {
	constructor(){
		this.id = 0;
		this.level = 0;
		this.media  = {"id" : "","provider":"","type":""};
		this.questions = [];
		this.scenario = [];
		this.skills = [];
		this.tags = [];
		this.title;
	}
}

class question {
	constructor(){
		this.correctHints = [];
		this.intentions = [];
		this.speechText = "";
		this.startTime = 0;
		this.stopTime = 0;
		this.wrongHints = [];
	}
}

class correctHint {
	constructor(){
		 this.attributes = {"speechText" : "", "viewUri" : ""};
		 this.type = "";
	}
}

class intention {
	constructor(){
		this.entityParameter = "";
		this.entityValue = "";
		this.name = "";
	}
}
class indicator {
	constructor(){
		this.center = {"x": 0, "y": 0.3};
		this.angle = 0;
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
	cont.questions[selectQuestion-1].correctHints.push(new correctHint());
	cont.questions[selectQuestion-1].wrongHints.push(new correctHint());
// 	cont.questions[selectQuestion-1].intentions.push(new intention());
//	cont.questions[selectQuestion-1].indicator.push(new indicator());
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

function getPlayerID(event, th){
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

function setContentInfo(id){
	switch (id.name) {
		case "id":
			cont.id = id.value;
		break;
		case "title":
			cont.title = id.value;
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
			case "correctHintText":
				cont.questions[i].correctHints[0].attributes.speechText = id.value.trim();
				cont.questions[i].correctHints[0].type = "image"
			break;
			case "correctViewUri":
				cont.questions[i].correctHints[0].attributes.viewUri = id.value.trim();
			break;
			case "wrongHintText":
				cont.questions[i].wrongHints[0].attributes.speechText = id.value.trim();
				cont.questions[i].wrongHints[0].type = "image"
			break;
			case "wrongViewUri":
				cont.questions[i].wrongHints[0].attributes.viewUri = id.value.trim();
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

function getQuestion(){
	var i = selectQuestion - 1;
	var names = ["question","correctHintText","correctViewUri","wrongHintText","wrongViewUri","startTime","stopTime"];
	var values = [cont.questions[i].speechText, cont.questions[i].correctHints[0].attributes.speechText, cont.questions[i].correctHints[0].attributes.viewUri, cont.questions[i].wrongHints[0].attributes.speechText, cont.questions[i].wrongHints[0].attributes.viewUri , cont.questions[i].startTime, cont.questions[i].stopTime];

	for (var i = 0; i < names.length; i++) {
		document.querySelector("input[name=" + names[i] + "]").value = values[i];
	}
}

function showJson(){
	var json = JSON.stringify(cont, undefined, 4);
	document.querySelector("textarea[name=json]").value = json;
	document.querySelector(".jsonPrint").style.display = "block";
	document.querySelector(".backClose").style.display = "block";
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

	var select = ['id','level','scenario','skills','tags','title'];
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
			time = i;
		}
		questi.innerHTML = questi.innerHTML + '<span onclick="activeQuestion(' + (i+1) + ')">' + time + '<abbr onclick="deleteQuestin(' + (i+1) + ')"><i class="fas fa-times"></i></abbr></span>';
	}
	document.querySelector("input[name=url]").value = "https://youtube.com/watch?v=" + cont.media.id;
	player.loadVideoById(cont.media.id);
	activeQuestion(cont.questions.length);
}

var cont = new content();
var countQuestion = 0;
var selectQuestion = -1;
