{
	const SENDER = "config_config_user_interaction";

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

	function createContentUIConfigValueResetMsg() {
		return {
			sender: SENDER,
			receiver: "background_storage_content_ui",
			info: "content_ui_config_value_reset"
		};
	}

	function createContentUIConfigValueRequestMsg(contentUIID) {
		return {
			sender: SENDER,
			receiver: "background_storage_content_ui",
			info: "content_ui_config_value_request",
			content: {
				content_ui_id: contentUIID
			}
		};
	}

	function createSettingsUIConfigValueRequestMsg(settingsUIID) {
		return {
			sender: SENDER,
			receiver: "background_storage_settings_ui",
			info: "settings_ui_config_value_request",
			content: {
				settings_ui_id: settingsUIID
			}
		};
	}

	function createSavefileExportRequestMsg() {
		return {
			sender: SENDER,
			receiver: "background_savefile_export",
			info: "savefile_export_request"
		};
	}

	function configPageDesignSelectHandler(e) {
		e.preventDefault();

		browser.runtime.sendMessage(createSettingsUIConfigValueSetMsg(SettingsUI.PAGE_DESIGN, Number(document.getElementById("DesignSelect").value)));
	}

	function configAdvancedViewCheckboxHandler(e) {
		e.preventDefault();

		browser.runtime.sendMessage(createSettingsUIConfigValueSetMsg(SettingsUI.ADVANCED_VIEW, document.getElementById("configAdvancedViewCheckbox").checked));
	}

	function configPopupCheckboxHandler(e) {
		e.preventDefault();
		browser.runtime.sendMessage(createSettingsUIConfigValueSetMsg(SettingsUI.POPUP, document.getElementById("configPopupCheckbox").checked));
	}

	function configBtnVisibilityCheckboxHandler(e) {
		e.preventDefault();
		browser.runtime.sendMessage(createContentUIConfigValueSetMsg(ContentUI.BLOCK_BTN_VISIBILITY, document.getElementById("configBtnVisibilityCheckbox").checked));
	}

	function configBtnColorHandler(e) {
		e.preventDefault();
		browser.runtime.sendMessage(createContentUIConfigValueSetMsg(ContentUI.BLOCK_BTN_COLOR, document.getElementById("configBtnColor").value));
	}

	function configAnimationSpeedSliderHandler(e) {
		e.preventDefault();
		browser.runtime.sendMessage(createContentUIConfigValueSetMsg(ContentUI.ANIMATION_SPEED, Number(document.getElementById("configAnimationSpeedSlider").value)));
	}

	function configBtnSizeSliderHandler(e) {
		e.preventDefault();
		browser.runtime.sendMessage(createContentUIConfigValueSetMsg(ContentUI.BLOCK_BTN_SIZE, Number(document.getElementById("configBtnSizeSlider").value)));
	}

	async function exportBtnHandler() {
		let d = new Date();
		let savefileJSON = await browser.runtime.sendMessage(createSavefileExportRequestMsg());
		download(savefileJSON, "ChannelBlocker " + d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + ".save" ,".save");
	}

	function resetBtnHandler() {
		browser.runtime.sendMessage(createContentUIConfigValueResetMsg());
	}

	function containerSelectHandler() {
		document.getElementById("0").style.display = "none";
		document.getElementById("1").style.display = "none";
		document.getElementById("2").style.display = "none";
		document.getElementById("3").style.display = "none";
		document.getElementById("4").style.display = "none";

		let selectValue = document.getElementById("containerSelect").value;
		document.getElementById(selectValue).style.display = "block";
	}

	function changePageDesign(configValue) {
		document.getElementById("DesignSelect").value = configValue;
		if(configValue === 0){
            document.getElementById("css").href = "../../shared/css/dark_root.css";
        }else if(configValue === 1){
            document.getElementById("css").href = "../../shared/css/light_root.css";
		}
	}

	function changeAdvancedView(configValue) {
		document.getElementById("configAdvancedViewCheckbox").value = configValue;
		if (configValue) {
			document.getElementById("containerHeadline").style.display = "none";
			document.getElementById("containerSelect").style.display = "block";
			containerSelectHandler();
		} else {
			document.getElementById("containerHeadline").style.display = "block";
			document.getElementById("containerSelect").style.display = "none";

			document.getElementById("0").style.display = "block";
			document.getElementById("1").style.display = "none";
			document.getElementById("2").style.display = "none";
			document.getElementById("3").style.display = "none";
			document.getElementById("4").style.display = "none";
		}
		document.getElementById("configAdvancedViewCheckbox").checked = configValue;
	}

	function changePopup(configValue) {
		document.getElementById("configPopupCheckbox").value = configValue;
		document.getElementById("configPopupCheckbox").checked = configValue;
	}

	function changeBtnVisibility(configValue) {
		document.getElementById("configBtnVisibilityCheckbox").value = configValue;
		document.getElementById("configBtnVisibilityCheckbox").checked = configValue;
	}

	function changeBtnColor(configValue) {
		document.getElementById("configBtnColor").value = configValue;
		document.getElementById("cpBtn").style.background = configValue;
		document.getElementById("showColorBtn").style.stroke = configValue;
	}

	function changeAnimationSpeed(configValue) {
		document.getElementById("configAnimationSpeedSlider").value = configValue;
		document.getElementById("configAnimationSpeedSlider").title = configValue;
	}

	function changeBtnSize(configValue) {
		document.getElementById("configBtnSizeSlider").value = configValue;
		document.getElementById("showSizeBtn").style.width = configValue * 0.01 + "em";
		document.getElementById("configBtnSizeSlider").title = configValue;
	}

	document.getElementById("DesignSelect").onchange = configPageDesignSelectHandler;

	document.getElementById("configAdvancedViewCheckbox").addEventListener('click', configAdvancedViewCheckboxHandler);

	document.getElementById("configPopupCheckbox").addEventListener('click', configPopupCheckboxHandler);

	document.getElementById("configBtnVisibilityCheckbox").addEventListener('click', configBtnVisibilityCheckboxHandler);

	document.getElementById("configBtnColor").onchange = configBtnColorHandler;

	document.getElementById("configBtnSizeSlider").onchange = configBtnSizeSliderHandler;

	document.getElementById("configAnimationSpeedSlider").onchange = configAnimationSpeedSliderHandler;

	document.getElementById("containerSelect").onchange = containerSelectHandler;

	document.getElementById("exportBtn").addEventListener('click', exportBtnHandler);

	document.getElementById("resetBtn").addEventListener('click', resetBtnHandler);

	async function initRequests() {
		let val = await browser.runtime.sendMessage(createSettingsUIConfigValueRequestMsg(SettingsUI.PAGE_DESIGN));
		changePageDesign(val);

		val = await browser.runtime.sendMessage(createSettingsUIConfigValueRequestMsg(SettingsUI.ADVANCED_VIEW));
		changeAdvancedView(val);

		val = await browser.runtime.sendMessage(createSettingsUIConfigValueRequestMsg(SettingsUI.POPUP));
		changePopup(val);

		val = await browser.runtime.sendMessage(createContentUIConfigValueRequestMsg(ContentUI.BLOCK_BTN_VISIBILITY));
		changeBtnVisibility(val);

		val = await browser.runtime.sendMessage(createContentUIConfigValueRequestMsg(ContentUI.BLOCK_BTN_COLOR));
		changeBtnColor(val);

		val = await browser.runtime.sendMessage(createContentUIConfigValueRequestMsg(ContentUI.BLOCK_BTN_SIZE));
		changeBtnSize(val);

		val = await browser.runtime.sendMessage(createContentUIConfigValueRequestMsg(ContentUI.ANIMATION_SPEED));
		changeAnimationSpeed(val);
	}

	initRequests();

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "settings_ui_storage_modified"){

			if(msg.sender === "background_storage_settings_ui"){
				switch(msg.content.settings_ui_id){
					case SettingsUI.PAGE_DESIGN:
						changePageDesign(msg.content.settings_ui_config_val);
						break;

					case SettingsUI.ADVANCED_VIEW:
						changeAdvancedView(msg.content.settings_ui_config_val);
						break;

					case SettingsUI.POPUP:
						changePopup(msg.content.settings_ui_config_val);
						break;
				}
			}
		}

		if(msg.info === "content_ui_storage_modified"){

			if(msg.sender === "background_storage_content_ui"){
				switch(msg.content.content_ui_id){
					case ContentUI.BLOCK_BTN_VISIBILITY:
						changeBtnVisibility(msg.content.content_ui_config_val);
						break;

					case ContentUI.BLOCK_BTN_COLOR:
						changeBtnColor(msg.content.content_ui_config_val);
						break;

					case ContentUI.BLOCK_BTN_SIZE:
						changeBtnSize(msg.content.content_ui_config_val);
						break;

					case ContentUI.ANIMATION_SPEED:
						changeAnimationSpeed(msg.content.content_ui_config_val);
						break;
				}
			}
		}
	});
}
