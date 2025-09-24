let contentUIConfig;

{
	SENDER = "content_config";

	function createContentUIConfigRequestMsg(){
		return {
			sender: SENDER,
			receiver: "background_storage_content_ui",
			info: "content_ui_config_request"
		};
	}

	contentUIConfig = Object.assign({}, DEFAULT_CONTENT_UI_CONFIG);

	initBlockBtnCSS();

	browser.runtime.sendMessage(createContentUIConfigRequestMsg())
	.then((updatedContentUIConfig) => {
		contentUIConfig = updatedContentUIConfig;

		updateBlockBtnCSS();
	});

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "content_ui_storage_modified"){

			if(msg.sender === "background_storage_content_ui"){
				contentUIConfig[msg.content.content_ui_id] = msg.content.content_ui_config_val;

				updateBlockBtnCSS();
			}
		}
	});
}
