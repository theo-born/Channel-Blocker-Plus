{
    const SENDER = "shared_design_controller";

	function createSettingsUIPageDesignConfigValueRequestMsg() {
		return {
			sender: SENDER,
			receiver: "background_storage_settings_ui",
			info: "settings_ui_config_value_request",
			content: {
				settings_ui_id: SettingsUI.PAGE_DESIGN
			}
		};
	}

    async function requestDesignStyle(){
        let val = await browser.runtime.sendMessage(createSettingsUIPageDesignConfigValueRequestMsg());

        changePageDesign(val);
    }

    function changePageDesign(configValue){
        if(configValue === 0){
            document.getElementById("css").href = "../../shared/css/dark_root.css";
        }else if(configValue === 1){
            document.getElementById("css").href = "../../shared/css/light_root.css";
        }
    }

    requestDesignStyle();
}
