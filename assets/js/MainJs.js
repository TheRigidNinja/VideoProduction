window.onload = function Listen() {
	var confirmClone = false,
		active = null,
		activeKey = [],
		cnt = -1;

	var dataDaseEquipment = {
		"Tripod":"#SjJz0",
		"Camera Light":"#KVx3z",
		"Wireless Microphone":"#iXRCi",
		"Camera lens":"#2m9AR",
		"Shotgun Microphone":"#1c6kH",
		"Boom Pole":"#TSVHG",
		"Wireless Microphone":"#FCyHF",
		"Audio (XLR) Cables":"#3yedH",
		"Light Reflector":"#Fu381",		
		"Video Camera":"#7a0d1",
		"Headphones":"#k2ohk",
		"Camera":"#skZXm",
	}


	// Initialize Firebase
	var config = {
	  apiKey: "AIzaSyB02C3leQrgHdHhS35wCuRT8wogpF9D1So",
	  authDomain: "m2e25d3i6ap65r6o6duc35tion.firebaseapp.com",
	  databaseURL: "https://m2e25d3i6ap65r6o6duc35tion.firebaseio.com",
	  projectId: "m2e25d3i6ap65r6o6duc35tion",
	  storageBucket: "m2e25d3i6ap65r6o6duc35tion.appspot.com",
	  messagingSenderId: "923396059715"
	};
	firebase.initializeApp(config);

	function StudentName(){
	 	var UserName = window.location.search.replace("?","");
	 	var data = UserName.substr(UserName.indexOf("/Trg")+4,UserName.length);
	 	var validateUser = CryptoJS.AES.decrypt(UserName.substr(0,UserName.indexOf("/Trg")), data);

	 	return validateUser.toString(CryptoJS.enc.Utf8)
	}

	 //--------------// Load this data if detect the equipment page 
	 if (window.location.href.indexOf("assets/Borrow.html?") > 0) {
	 		console.log("equipment autoload sector")
	 		var validateAccount = firebase.database().ref("Students/"+StudentName()+"");	
	 		validateAccount.once("value").then(function(snapshot,e) {
	 			keyNames = snapshot.child("Borrowed Equipments").val();
	 			keyDates = snapshot.child("Return Dates").val();
	 			
	 			for (var key in keyNames) {
	 				cnt++;
	 				activeKey[cnt] = key;

	 				var tbody = document.getElementsByTagName('tbody')[1];
	 				if (confirmClone == true) {
	 					var tr = tbody.getElementsByTagName('tr')[0];
	 					var cloneTr = tr.cloneNode(true);
	 						cloneTr.getElementsByTagName('td')[0].innerHTML= keyNames[key];
	 						cloneTr.getElementsByTagName('td')[1].innerHTML= keyDates[key];
	 						tbody.appendChild(cloneTr);
	 				}else{ 
	 					confirmClone = true;
	 					tbody.getElementsByTagName('tr')[0].getElementsByTagName('td')[0].innerHTML= keyNames[key];
	 					tbody.getElementsByTagName('tr')[0].getElementsByTagName('td')[1].innerHTML= keyDates[key];
	 				}
	 			}
	 		});
	 	confirmClone = false;
	 }


	try{ 

		var form = document.getElementById('form'),
			equipmentB = document.querySelector(".equipmentB"),
			selectSample = document.getElementById("selectSample");

		document.addEventListener('click', function(e){
		  //--------------// equipmentB function
		  var equipmentName = selectSample.options[selectSample.selectedIndex].innerHTML;
		  	  equipNameInput = document.getElementsByTagName('INPUT')[0];
		  	  equipIDInput = document.getElementsByTagName('INPUT')[1];
		  	  returnDate = document.getElementsByTagName('INPUT')[2];
		  	  currentDate = new Date();

		  if (selectSample == e.target) {
		  	if (equipmentName != "---------Test a Sample---------") {
		  		equipNameInput.value = equipmentName;
		  		equipIDInput.value = dataDaseEquipment[""+equipmentName];
		  	}
		  }

		  
		  if(equipmentB == e.target && equipmentB.innerHTML == "Borrow"){
		  	console.log("Borrow equipment sector")

		  		if (form.checkValidity() == true) {
		  			var month,date;

		  			if (currentDate.getMonth() < 9) {month = "-0"+(currentDate.getMonth()+1)}else{month = "-"+(currentDate.getMonth()+1)}
		  			if (currentDate.getDate() < 9) {date = "-0"+currentDate.getDate()}else{date = "-"+currentDate.getDate()}

		  			if (returnDate.value > currentDate.getFullYear()+month+date) {
		  				var tbody = document.getElementsByTagName('tbody')[1];

		  				if (confirmClone == true) {
		  					var tr = tbody.getElementsByTagName('tr')[0];
		  					var cloneTr = tr.cloneNode(true);
		  						cloneTr.getElementsByTagName('td')[0].innerHTML= equipNameInput.value;
		  						cloneTr.getElementsByTagName('td')[1].innerHTML= returnDate.value;
		  						tbody.appendChild(cloneTr);
		  				}else{ 
		  					confirmClone = true;
		  					tbody.getElementsByTagName('tr')[0].getElementsByTagName('td')[0].innerHTML=  equipNameInput.value;
		  					tbody.getElementsByTagName('tr')[0].getElementsByTagName('td')[1].innerHTML=  returnDate.value;
		  				}


		  				// store data online
	 					var validateAccount = firebase.database().ref("Students/"+StudentName()+"");	
	 					validateAccount.once("value").then(function(snapshot) {

	 						if (snapshot.child("Borrowed Equipments/0").val() == null) {keyLength = 0;}else{
	 							keyLength = (snapshot.child("Borrowed Equipments").val().length);
	 						}

		  					firebase.database().ref("Students/"+StudentName()+"/Borrowed Equipments").child(keyLength).set(equipNameInput.value);
		  					firebase.database().ref("Students/"+StudentName()+"/Return Dates").child(keyLength).set(returnDate.value);

		  					// clear fileds
		  					equipNameInput.value = "";
		  					returnDate.value = "";
		  					equipIDInput.value = "";
		  				});

		  			}else{
		  				returnDate.setCustomValidity("Return Date is invalid");
		  				setTimeout(function(){returnDate.setCustomValidity("");},2000);
		  			}
		  		}
		  	}


		  	//--------------// Return 
		  	var submit = document.getElementById('submit-id-submit');

		  	if(equipmentB == e.target && equipmentB.innerHTML == "Return"){
		  		var parent = document.querySelector(".equipDisplay");
		  		parent.removeChild(active);
		  		firebase.database().ref("Students/"+StudentName()+"/Return Dates").child(rmvKey).remove();
		  		firebase.database().ref("Students/"+StudentName()+"/Borrowed Equipments").child(rmvKey).remove();
		  	}

		  	if(e.target.tagName == "TD"){
		  		console.log("Return equipment sector")
		  		submit.innerHTML = "Return";
		  		submit.style.background="#dc3545";

		  		if (active != null) {
		  			active.style.background="";
		  			active.style.color="";
		  		}

		  		e.path[1].style.background="#212529";
		  		e.path[1].style.color="white";
		  		active = e.path[1];
		  		rmvKey = activeKey[e.path[1].rowIndex-1];

		  	}else{
		  		submit.innerHTML = "Borrow";
		  		submit.style.background="#1a8a6f";

		  		if (active != null) {
		  			active.style.background="";
		  			active.style.color="";
		  		}
		  	}


		});
	}catch(err){console.log(err)};		
}