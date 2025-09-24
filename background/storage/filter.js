{
	const SENDER = "background_storage_filter";

	let storageManager = new FilterStorageManager(STORAGE);
	storageManager.initSets();

	function createConfigFilterStorageModifiedMsg(filterType){
		return {
			sender: SENDER,
			receiver: "config_filter_user_interaction",
			info: "filter_storage_modified",
			content: {
				filter_type: filterType
			}
		};
	}

	function createContentFilterStorageModifiedMsg(){
		return {
			sender: SENDER,
			receiver: "content_controller",
			info: "filter_storage_modified"
		};
	}

	function onAddMsg(msgContent){
		let storageChanged;

		if(msgContent.filter_type === FilterType.BLOCKED_USERS || msgContent.filter_type === FilterType.EXCLUDED_USERS){
			storageChanged = storageManager.add(msgContent.filter_type, msgContent.user_channel_name, 53);
		}else{
			storageChanged = storageManager.add(msgContent.filter_type, msgContent.reg_exp, msgContent.reg_exp_type);
		}

		if(storageChanged){
			if(configTabId !== null)
				browser.tabs.sendMessage(configTabId, createConfigFilterStorageModifiedMsg(msgContent.filter_type));

			for(let tabId of YT_TAB_IDS.keys()){
				browser.tabs.sendMessage(Number(tabId), createContentFilterStorageModifiedMsg());
			}
		}
	}

	function onDelMsg(msgContent){

		let storageChanged = storageManager.remove(msgContent.filter_type, msgContent.filter_val);

		if(storageChanged){
			if(configTabId !== null)
				browser.tabs.sendMessage(configTabId, createConfigFilterStorageModifiedMsg(msgContent.filter_type));

			for(let tabId of YT_TAB_IDS.keys()){
				browser.tabs.sendMessage(Number(tabId), createContentFilterStorageModifiedMsg());
			}
		}
	}

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "is_blocked_request"){

			if(msg.sender === "content_is_blocked_lib"){
				return new Promise((resolve) => {
					resolve(storageManager.isBlocked(msg.content));
				});
			}
		}

		if(msg.info === "add_blocked_user"){

			if(msg.sender === "content_block_button_lib"){
				onAddMsg({
					info: "add",
					filter_type: FilterType.BLOCKED_USERS,
					user_channel_name: msg.content.user_channel_name
				});
			}
		}

		if(msg.info === "add"){

			if(msg.sender === "config_filter_user_interaction" || msg.sender === "config_savefile_import" || msg.sender === "popup_config_user_interaction"){
				onAddMsg(msg.content);
			}
		}

		if(msg.info === "delete"){

			if(msg.sender === "config_filter_user_interaction" || msg.sender === "popup_config_user_interaction"){
				onDelMsg(msg.content);
			}
		}

		if(msg.info === "filter_values_request"){

			if(msg.sender === "config_filter_user_interaction" || msg.sender === "popup_config_user_interaction"){
				return new Promise((resolve) => {
					resolve(Object.assign({}, storageManager.getHashSet(msg.content.filter_type)));
				});
			}
		}
	});
}
