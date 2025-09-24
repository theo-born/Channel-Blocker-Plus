
{
	const SENDER = "background_storage_content_ui";

	let contentUIConfig = {};
	initContentUIConfig();

	function createContentUIStorageModifiedMsg(receiver, contentUIID){
		return {
			sender: SENDER,
			receiver: receiver,
			info: "content_ui_storage_modified",
			content: {
				content_ui_id: contentUIID,
				content_ui_config_val: contentUIConfig[contentUIID]
			}
		};
	}

	async function initContentUIConfig() {
		let storage = await STORAGE.get(CONTENT_UI_STORAGE_ID);

		if(storage[CONTENT_UI_STORAGE_ID] !== undefined){
			contentUIConfig = storage[CONTENT_UI_STORAGE_ID];
		}

		for(let contentUIID of Object.values(ContentUI)){
			if(contentUIConfig[contentUIID] === undefined){
				contentUIConfig[contentUIID] = DEFAULT_CONTENT_UI_CONFIG[contentUIID];
			}
		}

		updateContentUIConfigStorage();
	}

	async function updateContentUIConfigStorage(){
		await STORAGE.set({
			[CONTENT_UI_STORAGE_ID]: contentUIConfig
		});
	}

	function setContentUIConfigVal(contentUIID, val) {
		if(contentUIConfig[contentUIID] !== val){
			contentUIConfig[contentUIID] = val;

			if(configTabId !== null){
				browser.tabs.sendMessage(configTabId, createContentUIStorageModifiedMsg("config_config_user_interaction", contentUIID));
			}

			for(let tabId of YT_TAB_IDS.keys()){
				browser.tabs.sendMessage(Number(tabId), createContentUIStorageModifiedMsg("content_config", contentUIID));
			}

			updateContentUIConfigStorage();
		}
	}

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "content_ui_config_value_set"){

			if(msg.sender === "config_savefile_import" || msg.sender === "config_config_user_interaction"){
				setContentUIConfigVal(msg.content.content_ui_id, msg.content.content_ui_config_val);
			}
		}

		if(msg.info === "content_ui_config_value_reset"){

			if(msg.sender === "config_config_user_interaction"){
				setContentUIConfigVal(ContentUI.BLOCK_BTN_COLOR, DEFAULT_CONTENT_UI_CONFIG[ContentUI.BLOCK_BTN_COLOR]);
				setContentUIConfigVal(ContentUI.BLOCK_BTN_SIZE, DEFAULT_CONTENT_UI_CONFIG[ContentUI.BLOCK_BTN_SIZE]);
			}
		}

		if(msg.info === "content_ui_config_value_request"){

			if(msg.sender === "config_config_user_interaction" || msg.sender === "content_controller"){
				return new Promise((resolve) => {
					resolve(contentUIConfig[msg.content.content_ui_id]);
				});
			}
		}

		if(msg.info === "content_ui_config_request"){

			if(msg.sender === "content_config"){
				return new Promise((resolve) => {
					resolve(Object.assign({}, contentUIConfig));
				});
			}
		}
	});
}
