{
	const SENDER = "background_savefile_export";

	async function exportSaveFile() {
		let jFile = await STORAGE.get();

		return JSON.stringify(jFile, null, 2);
	}

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "savefile_export_request"){

			if(msg.sender === "config_config_user_interaction" || msg.sender === "bug_user_interaction"){
				return exportSaveFile();
			}
		}
	});
}
