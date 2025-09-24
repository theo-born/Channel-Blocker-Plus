
{
	const SENDER = "background_storage_settings_ui";

	let settingsUIConfig = {};
	initSettingsUIConfig();

	function createSettingsUIStorageModifiedMsg(settingsUIID){
		return {
			sender: SENDER,
			receiver: "config_config_user_interaction",
			info: "settings_ui_storage_modified",
			content: {
				settings_ui_id: settingsUIID,
				settings_ui_config_val: settingsUIConfig[settingsUIID]
			}
		};
	}

	function changeBrowserActionFunc(){
		if(settingsUIConfig[SettingsUI.POPUP]){
			browser.browserAction.setPopup({popup: "ui/popup/html/popup.html"});
		}else{
			browser.browserAction.setPopup({popup: ""});
		}
	}

	async function initSettingsUIConfig() {
		let storage = await STORAGE.get(SETTINGS_UI_STORAGE_ID);

		if(storage[SETTINGS_UI_STORAGE_ID] !== undefined){
			settingsUIConfig = storage[SETTINGS_UI_STORAGE_ID];
		}

		for(let settingsUIID of Object.values(SettingsUI)){
			if(settingsUIConfig[settingsUIID] === undefined){
				settingsUIConfig[settingsUIID] = DEFAULT_SETTINGS_UI_CONFIG[settingsUIID];
			}
		}

		updateSettingsUIConfigStorage();

		changeBrowserActionFunc();
	}

	async function updateSettingsUIConfigStorage(){
		await STORAGE.set({
			[SETTINGS_UI_STORAGE_ID]: settingsUIConfig
		});
	}

	function setSettingsUIConfigVal(settingsUIID, val) {
		if(settingsUIConfig[settingsUIID] !== val){
			settingsUIConfig[settingsUIID] = val;

			if(configTabId !== null){
				browser.tabs.sendMessage(configTabId, createSettingsUIStorageModifiedMsg(settingsUIID));
			}

			updateSettingsUIConfigStorage();

			changeBrowserActionFunc();
		}
	}

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "settings_ui_config_value_set"){

			if(msg.sender === "config_savefile_import" || msg.sender === "config_config_user_interaction"){
				setSettingsUIConfigVal(msg.content.settings_ui_id, msg.content.settings_ui_config_val);
			}
		}

		if(msg.info === "settings_ui_config_value_request"){

			if(msg.sender === "config_config_user_interaction"){
				return new Promise((resolve) => {
					resolve(settingsUIConfig[msg.content.settings_ui_id]);
				});
			}

			if(msg.sender === "shared_design_controller"){
				if(msg.content.settings_ui_id === SettingsUI.PAGE_DESIGN){
					return new Promise((resolve) => {
						resolve(settingsUIConfig[msg.content.settings_ui_id]);
					});
				}
			}
		}
	});
}
