var dom = {};
var monthsDict = {1:"Jan", 2:"Feb", 3:"Mar", 4:"Apr", 5:"May", 6:"Jun", 7:"Jul", 8:"Aug", 9:"Sep", 10:"Oct", 11:"Nov", 12:"Dec"};
var currentChore = "";
var popupActive = false;

Util.events(document, {
	// Final initalization entry point: the Javascript code inside this block
	// runs at the end of start-up when the DOM is ready
	"DOMContentLoaded": function() {
		dom.root = Util.one(":root");
		dom.settings = Util.one("#settings");

		dom.chorePopup = Util.one("#chorePopup")
		dom.editChorePopup = Util.one("#editChorePopup")
		dom.settingsPopup = Util.one("#settingsPopup")

		dom.incomplete = Util.one("#incomplete")
		dom.checkoff = Util.one("#checkoff")
		dom.rewards = Util.one("#reward")
		dom.parentName = Util.one("#nameText");
		dom.center = Util.one("#center")
		dom.sidebar = Util.one("#sidebar")
		dom.saveChore = Util.one("#newchorePopupSave")

		fillChores();

		// // set color and name defaults
		dom.parentName.value = "Andrew";

		// edit popup for each chore
		Util.one("#pencil").addEventListener("click",
			function() {
				dom.chorePopup.style.display = "none"
				editChorePopup(currentChore);
			});

		Util.one("#trashcan").addEventListener("click",
			function() {
				Util.one("#deleteConfirmation").style.display = "block"
			});

		Util.one("#confirm").addEventListener("click",
			function() {
				Util.one("#deleteConfirmation").style.display = "none"
				dom.chorePopup.style.display = "none";
				Util.one("#"+currentChore).remove();
				dom.center.style.opacity = "1";
				dom.sidebar.style.opacity = "1";
			});

		Util.one("#cancel").addEventListener("click",
			function() {
				Util.one("#deleteConfirmation").style.display = "none"
			});
		
		// chore popup
		var items = Util.all(".item")
		for (let item of items) {
			item.addEventListener("click",
				function() {
					currentChore = item.id;
					regularChorePopup(item.id);
				});
		}

		// edit popup for each chore
		var edits = Util.all(".pencil")
		for (let item of edits) {
			item.addEventListener("click",
				function(event) {
					event.stopPropagation();
					currentChore = item.id
					editChorePopup(item.id);
				});
		}

		// don't have to save any info if it's exit
		Util.one("#editExit").addEventListener("click",
			function() {
				dom.editChorePopup.style.display = "none"
				dom.center.style.opacity = "1";
				dom.sidebar.style.opacity = "1";
				popupActive = false;
		});


		Util.one("#editSave").addEventListener("click",
			function() {
				dom.editChorePopup.style.display = "none"
				dom.center.style.opacity = "1";
				dom.sidebar.style.opacity = "1";
				popupActive = false;

				if(currentChore == "") {
					currentChore = Util.one("#editChoreText").value
					chores[currentChore] = {};
					chores[currentChore].chore = Util.one("#editChoreText").value;
					chores[currentChore].formatdate = Util.one("#editDateText").value;
					chores[currentChore].duedate = getDate(Util.one("#editDateText").value);
					chores[currentChore].reward = Util.one("#editRewardText").value;
					chores[currentChore].details = Util.one("#editDetailsText").value;
					chores[currentChore].picture = "assets/images/broom.png"
					dom.incomplete.appendChild(makeChore(currentChore, true));
				}
				else {
					chores[currentChore].chore = Util.one("#editChoreText").value;
					chores[currentChore].formatdate = Util.one("#editDateText").value;
					chores[currentChore].duedate = getDate(Util.one("#editDateText").value);
					chores[currentChore].reward = Util.one("#editRewardText").value;
					chores[currentChore].details = Util.one("#editDetailsText").value;
				}
			});

		Util.one("#newButton").addEventListener("click",
			function() {
				currentChore = "";
				newChorePopup();
			});

		var items = Util.all(".checkoffDone")
		for (let item of items) {
			item.addEventListener("click",
				function(event) {
					event.stopPropagation();
					dom.rewards.appendChild(makeReward(chores[item.id].reward));
					this.parentNode.remove();
				});
		}

		var items = Util.all(".rewardsDoneCheckoff")
		for (let item of items) {
			item.addEventListener("click",
				function(event) {
					event.stopPropagation();
					this.parentNode.remove();
				});
		}


		Util.one("#chorePopupClose").addEventListener("click", 
			function() {
				dom.chorePopup.style.display = "none"
				dom.center.style.opacity = "1";
				dom.sidebar.style.opacity = "1";
				popupActive = false;
			});

		// settings popup
		dom.settings.addEventListener("click",
			function() {
				dom.settingsPopup.style.display = "flex"
				dom.center.style.opacity = "0.15";
				dom.sidebar.style.opacity = "0.15";
			});

		Util.one("#settingsPopupClose").addEventListener("click",
			function() {
				dom.settingsPopup.style.display = "none"
				dom.center.style.opacity = "1";
				dom.sidebar.style.opacity = "1";
			});

		// color picker within settings
		var colors = Util.all(".color")
		for (let color of colors) {
			color.addEventListener("click",
				function() {
					removeOtherBorders();
					color.classList.add("colorSelected")
					dom.root.style.setProperty('--main-background', color.style.backgroundColor);
				});
		}

		var children = Util.all(".tab") 
		for (let child of children) {
			child.addEventListener("click",
				function() {
					removeOtherColors();
					child.style.backgroundColor = getComputedStyle(dom.root).getPropertyValue("--main-background");
					Util.one("#childChores").innerHTML = child.id + "'s Chores"
				});
		}
	},


	"keyup": function(evt) {
		Util.one("#welcome").innerHTML = "Hi, "+dom.parentName.value+"!"
	},
});

// begin helper functions
function regularChorePopup(choreName) {
	dom.chorePopup.style.display = "flex";
	dom.center.style.opacity = "0.15";
	dom.sidebar.style.opacity = "0.15";
	popupActive = true;

	Util.one("#choreText").innerHTML = chores[choreName].chore;
	Util.one("#dateText").innerHTML = chores[choreName].duedate;
	Util.one("#rewardText").innerHTML = chores[choreName].reward;
	Util.one("#detailsText").innerHTML = chores[choreName].details;
}

function editChorePopup(choreName) {
	dom.editChorePopup.style.display = "flex";
	dom.center.style.opacity = "0.15";
	dom.sidebar.style.opacity = "0.15";
	Util.one("#editTitle").innerHTML = "Edit Chore";
	popupActive = true;

	Util.one("#editChoreText").value = chores[choreName].chore;
	Util.one("#editDateText").value = chores[choreName].formatdate;
	Util.one("#editRewardText").value = chores[choreName].reward;
	Util.one("#editDetailsText").value = chores[choreName].details;
}

function newChorePopup(choreName) {
	dom.editChorePopup.style.display = "flex";
	dom.center.style.opacity = "0.15";
	dom.sidebar.style.opacity = "0.15";
	Util.one("#editTitle").innerHTML = "Add Chore";
	popupActive = true;


	Util.one("#editChoreText").value = "";
	Util.one("#editChoreText").focus();
	Util.one("#editDateText").value = "";
	Util.one("#editRewardText").value = "";
	Util.one("#editDetailsText").value = "";
}

function fillChores() {
	dom.incomplete.appendChild(makeChore("lawn", true));
	dom.incomplete.appendChild(makeChore("clothes", true));
	dom.incomplete.appendChild(makeChore("dishes", true));
	
	dom.checkoff.appendChild(makeChore("dog", false));
	
	dom.rewards.appendChild(makeReward("park"));
}

function makeChore(choreName, isEdit) {
	var div = document.createElement("div");
	div.classList = "item";
	div.id = choreName;

	// image
	var img = document.createElement("img");
	img.src = chores[choreName].picture;
	img.classList = "itemImg"

	// chore name
	var name = document.createElement("div");
	name.innerHTML = chores[choreName].chore;
	name.classList = "choreName"

	// due date
	var duedate = document.createElement("div");
	duedate.innerHTML = chores[choreName].duedate;

	// icon 
	if (!isEdit) {
		var icon = document.createElement("i");
		icon.classList = "material-icons checkoffDone";
		icon.innerHTML = "done";
		icon.id = choreName;
	}

	div.appendChild(img);
	div.appendChild(name);
	div.appendChild(duedate);
	if(!isEdit) {
		div.appendChild(icon)
	}
	

	return div;
}

function makeReward(rewardName) {
	var div = document.createElement("div");
	div.classList = "reward-item";
	div.id = rewardName;

	// image
	var img = document.createElement("img");
	img.src = rewards[rewardName].picture;
	img.classList = "itemImg"

	// chore name
	var name = document.createElement("div");
	name.innerHTML = rewards[rewardName].name;
	name.classList = "choreName"

	// icon 
	var icon = document.createElement("i");
	icon.classList = "material-icons rewardsDoneCheckoff";
	icon.innerHTML = "done"
	icon.id = rewardName;

	div.appendChild(img);
	div.appendChild(name);
	div.appendChild(icon)

	return div;
}

function disableAroundPopup() {
	Util.one("#newButton").disabled = "true";
	dom.settings.disabled = "true";
}

function enableAroundPopup() {
	Util.one("#newButton").disabled = "false";
	dom.settings.disabled = "false";
}

function removeOtherBorders() {
	var colors = Util.all(".color")
	for (let color of colors) {
		color.classList.remove("colorSelected")
	}
}

function removeOtherColors() {
	var children = Util.all(".tab")
	for (let child of children) {
		child.style.backgroundColor = getComputedStyle(dom.root).getPropertyValue("--secondary-color")
	}
}

function getDate(date){
	var split = date.split("-");
	var month = parseInt(split[1]);
	return monthsDict[month] + " " + parseInt(split[2]);
}