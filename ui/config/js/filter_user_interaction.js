{
	const SENDER = "config_filter_user_interaction";

	function createAddMsg(filterType, userChannelNameOrRegExp, regExpType){
		let msg = {
			sender: SENDER,
			receiver: "background_storage_filter",
			info: "add",
			content: {
				filter_type: filterType
			}
		};

		if(regExpType === undefined){
			msg.content.user_channel_name = userChannelNameOrRegExp;
		}else{
			msg.content.reg_exp = userChannelNameOrRegExp;
			msg.content.reg_exp_type = regExpType;
		}

		return msg;
	}

	function createDeleteMsg(filterType, filterVal){
		return {
			sender: SENDER,
			receiver: "background_storage_filter",
			info: "delete",
			content: {
				filter_type: filterType,
				filter_val: filterVal
			}
		};
	}

	function createFilterValuesRequestMsg(filterType){
		return {
			sender: SENDER,
			receiver: "background_storage_filter",
			info: "filter_values_request",
			content: {
				filter_type: filterType
			}
		};
	}

	function clearSelection(containerId){
		let selection = document.getElementById(containerId + "_selection");

		for(let i = selection.options.length - 1 ; i >= 0 ; i--){
			selection.remove(i);
		}
	}

	function addUserChannelNameOrRegExToFilterBox(containerId, userChannelNameOrRegEx, regExType){
		let selection = document.getElementById(containerId + "_selection");

		let option = document.createElement("option");
		selection.appendChild(option);

		option.setAttribute("value", userChannelNameOrRegEx);
		option.textContent = "\"" + userChannelNameOrRegEx + "\"";

		if(containerId.toUpperCase() === "TITLE_REGEXS" || containerId.toUpperCase() === "NAME_REGEXS" || containerId.toUpperCase() === "COMMENT_REGEXS"){
			if(regExType === RegExType.CASE_INSENSITIVE){
				option.textContent += " *";
			}
		}
	}

	async function sendAndProcessFilterValuesRequestMsg() {
		for(let filterType in FilterType){
			let filterTypeStr = filterType.toLowerCase();
			let values = await browser.runtime.sendMessage(createFilterValuesRequestMsg(FilterType[filterType]));

			clearSelection(filterTypeStr);

			for(let val of Object.keys(values)){
				addUserChannelNameOrRegExToFilterBox(filterTypeStr, val, values[val]);
			}
		}
	}

	function sendAddMessage(filterType){
		let input = document.getElementById(filterType.toLowerCase() + "_input_textfield").value;
		document.getElementById(filterType.toLowerCase() + "_input_textfield").value = "";

		input = input.trim();
		if(input !== ""){
			if(filterType === "BLOCKED_USERS" || filterType === "EXCLUDED_USERS"){
				browser.runtime.sendMessage(createAddMsg(FilterType[filterType], input));
			}else if(document.getElementById(filterType.toLowerCase() + "_caseInsensitive_checkbox").checked){
				browser.runtime.sendMessage(createAddMsg(FilterType[filterType], input, RegExType.CASE_INSENSITIVE));
			}else{
				browser.runtime.sendMessage(createAddMsg(FilterType[filterType], input, RegExType.CASE_SENSITIVE));
			}
		}
	}

	function sendDeleteMessage(filterType){
		function getSelectedOptions(selectionId){
			let selection = document.getElementById(selectionId);
			let options = [];

			for(let opt of selection.selectedOptions){
				options.push(opt.getAttribute("value"));
			}

			return options;
		}

		let selectionId = filterType.toLowerCase() + "_selection";
		let input = getSelectedOptions(selectionId);

		for(let filterVal of input){
			browser.runtime.sendMessage(createDeleteMsg(FilterType[filterType], filterVal));
		}
	}

	sendAndProcessFilterValuesRequestMsg();

	for(let filterType in FilterType){
		let filterTypeStr = filterType.toLowerCase();

	 	let addBtnId = filterTypeStr + "_add_btn";
	 	let deleteBtnId = filterTypeStr + "_delete_btn";
	 	let inputTextfieldId = filterTypeStr + "_input_textfield";

	 	document.getElementById(addBtnId).onclick = () => {
	 		sendAddMessage(filterType);
	 	};
	 	document.getElementById(deleteBtnId).onclick = () => {
			sendDeleteMessage(filterType);
	 	};
		document.getElementById(inputTextfieldId).onkeypress = (e) => {
			if(e.key==="Enter" || e.keyCode===13){
	 			sendAddMessage(filterType);
			}
	 	};
	}

	browser.runtime.onMessage.addListener((msg, sender) => {
  		if(msg.receiver !== SENDER)
    		return;

		if(msg.info === "filter_storage_modified"){

			if(msg.sender === "background_storage_filter"){
				sendAndProcessFilterValuesRequestMsg();
			}
		}
	});
}
