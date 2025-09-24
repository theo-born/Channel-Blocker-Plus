{
	const SENDER = "config_savefile_import";

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

	function createContentUIConfigValueSetMsg(contentUIID, contentUIConfigVal) {
		return {
			sender: SENDER,
			receiver: "background_storage_content_ui",
			info: "content_ui_config_value_set",
			content: {
				content_ui_id: contentUIID,
				content_ui_config_val: contentUIConfigVal
			}
		};
	}

	function createSettingsUIConfigValueSetMsg(settingsUIID, settingsUIConfigVal) {
		return {
			sender: SENDER,
			receiver: "background_storage_settings_ui",
			info: "settings_ui_config_value_set",
			content: {
				settings_ui_id: settingsUIID,
				settings_ui_config_val: settingsUIConfigVal
			}
		};
	}

	function startRead(event) {
		let file = document.getElementById('fileLoaderBtn').files[0];
		if (file) {
			let fileReader = new FileReader();

			fileReader.readAsText(file, "UTF-8");

			fileReader.onload = onLoad;
		}
	}

	function onLoad(event) {
		let fileString = event.target.result;
		let jsonSaveFile = JSON.parse(fileString);

		for(let filterType of Object.values(FilterType)){
			for(let userChannelNameOrRegEx in jsonSaveFile[filterType]){
				if(filterType === FilterType.BLOCKED_USERS || filterType === FilterType.EXCLUDED_USERS){
					browser.runtime.sendMessage(createAddMsg(filterType, userChannelNameOrRegEx));
				}else{
					browser.runtime.sendMessage(createAddMsg(filterType, userChannelNameOrRegEx, jsonSaveFile[filterType][userChannelNameOrRegEx]));
				}
			}
		}

		if(jsonSaveFile[CONTENT_UI_STORAGE_ID] !== undefined && jsonSaveFile[SETTINGS_UI_STORAGE_ID] !== undefined){

			for(let contentUIID of Object.values(ContentUI)){
				browser.runtime.sendMessage(createContentUIConfigValueSetMsg(contentUIID, jsonSaveFile[CONTENT_UI_STORAGE_ID][contentUIID]));
			}

			for(let settingsUIID of Object.values(SettingsUI)){
				browser.runtime.sendMessage(createSettingsUIConfigValueSetMsg(settingsUIID, jsonSaveFile[SETTINGS_UI_STORAGE_ID][settingsUIID]));
			}

		}else if(jsonSaveFile["config"] !== undefined){

			for(deprecatedID of Object.values(DeprecatedConfig)){
				let mappedConfig = DeprecatedConfigToConfigMapping[deprecatedID];

				if(mappedConfig.storageID === SETTINGS_UI_STORAGE_ID){
					if(deprecatedID === DeprecatedConfig.PAGE_DESIGN){
						browser.runtime.sendMessage(createSettingsUIConfigValueSetMsg(mappedConfig.ID, Number(jsonSaveFile["config"][deprecatedID])));
					}else{
						browser.runtime.sendMessage(createSettingsUIConfigValueSetMsg(mappedConfig.ID, jsonSaveFile["config"][deprecatedID]));
					}
				}else if(mappedConfig.storageID === CONTENT_UI_STORAGE_ID){
					if(deprecatedID === DeprecatedConfig.ANIMATION_SPEED || deprecatedID === DeprecatedConfig.BLOCK_BTN_SIZE){
						browser.runtime.sendMessage(createContentUIConfigValueSetMsg(mappedConfig.ID, Number(jsonSaveFile["config"][deprecatedID])));
					}else{
						browser.runtime.sendMessage(createContentUIConfigValueSetMsg(mappedConfig.ID, jsonSaveFile["config"][deprecatedID]));
					}
				}
			}
		}
	}

	if (window.File && window.FileReader && window.FileList && window.Blob) {
		document.getElementById('fileLoaderBtn').addEventListener('change', startRead, false);
	} else {
		alert('The file-APIs are not supported. You are not able to import.');
	}

	document.getElementById('visibleFileLoaderBtn').addEventListener('click', () => {
		document.getElementById('fileLoaderBtn').click();
	});
}
