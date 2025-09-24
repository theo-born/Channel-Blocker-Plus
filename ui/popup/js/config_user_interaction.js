{
	const SENDER = "popup_config_user_interaction";

	function createAddMsg(userChannelName){
		return {
			sender: SENDER,
			receiver: "background_storage_filter",
			info: "add",
			content: {
				filter_type: FilterType.BLOCKED_USERS,
				user_channel_name: userChannelName
			}
		};
	}

	function createDeleteMsg(filterVal){
		return {
			sender: SENDER,
			receiver: "background_storage_filter",
			info: "delete",
			content: {
				filter_type: FilterType.BLOCKED_USERS,
				filter_val: filterVal
			}
		};
	}

	function createFilterValuesRequestMsg(){
		return {
			sender: SENDER,
			receiver: "background_storage_filter",
			info: "filter_values_request",
			content: {
				filter_type: FilterType.BLOCKED_USERS
			}
		};
	}

	function createOpenConfigMsg(){
		return {
			sender: SENDER,
			receiver: "background_browser_action",
			info: "open_config"
		};
	}

	function clearSelection(){
		let selection = document.getElementById("popupSelection");

		for(let i = selection.options.length - 1 ; i >= 0 ; i--){
			selection.remove(i);
		}
	}

	function addUserToSelection(user){
		let selection = document.getElementById("popupSelection");

		let option = document.createElement("option");
		selection.appendChild(option);

		option.setAttribute("value", user);
		option.textContent = "\"" + user + "\"";
	}

	async function sendAndProcessFilterValuesRequestMsg(){
		let values = await browser.runtime.sendMessage(createFilterValuesRequestMsg());

		clearSelection();

		for(let val of Object.keys(values)){
			addUserToSelection(val, values[val]);
		}
	}

	function openConfigHandler() {
		browser.runtime.sendMessage(createOpenConfigMsg());
	}

	async function addBtnHandler() {
		if(document.getElementById("popupTextField").value === ""){
			return;
		}

		browser.runtime.sendMessage(createAddMsg(document.getElementById("popupTextField").value));
		document.getElementById("popupTextField").value = "";

		sendAndProcessFilterValuesRequestMsg();
	}

	async function popupDelBtnHandler() {
		function getSelectedOptions(){
			let selection = document.getElementById("popupSelection");
			let options = [];

			for(let opt of selection.selectedOptions){
				options.push(opt.getAttribute("value"));
			}

			return options;
		}

		let input = getSelectedOptions();

		for(let filterVal of input){
			browser.runtime.sendMessage(createDeleteMsg(filterVal));
		}

		sendAndProcessFilterValuesRequestMsg();
	}

	document.getElementById("popupOptions").addEventListener('click', openConfigHandler);

	document.getElementById("popupAddBtn").addEventListener('click', addBtnHandler);

	document.getElementById("popupDelBtn").addEventListener('click', popupDelBtnHandler);

	document.getElementById("popupTextField").onkeypress = (e) => {
		if(e.key==="Enter" || e.keyCode===13){
			addBtnHandler();
		}
	};

	sendAndProcessFilterValuesRequestMsg();
}
