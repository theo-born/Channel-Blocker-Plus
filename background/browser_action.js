let configTabId = null;

{
	const SENDER = "background_browser_action";

	async function openConfig(){
		if(configTabId === null){
			let tab = await browser.tabs.create({
				active: true,
				url: "/ui/config/html/config.html"
			});

			configTabId = tab.id;
		}else{
			let tab = await browser.tabs.update(
				configTabId,
				{
					active: true
				}
			);

			await browser.windows.update(
				tab.windowId,
				{
					focused: true
				}
			);
		}
	}

	browser.browserAction.onClicked.addListener(openConfig);

	browser.tabs.onRemoved.addListener((tabId) => {
		if(tabId === configTabId)
			configTabId = null;
	});

	browser.tabs.onUpdated.addListener((tabId, ci) => {
		if(ci.url){
			let configURL = browser.runtime.getURL("/ui/config/html/config.html");

			if(tabId === configTabId){
				if(ci.url !== configURL)
					configTabId = null;
			}else{
				if(ci.url === configURL)
					configTabId = tabId;
			}
		}
	});

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "open_config"){

			if(msg.sender === "popup_config_user_interaction"){
				openConfig();
			}
		}
	});
}
