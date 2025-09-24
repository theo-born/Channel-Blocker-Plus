
const YT_TAB_IDS = new HashSet();

{
	const SENDER = "background_url_update";

	const YTRegEx = new RegExp("^https://www\\.youtube\\.com(.)*$");

	const RegExToContextMapping = Object.freeze({
		"^https://www\\.youtube\\.com/watch\\?(.)*$":							YTContext.VIDEO,
		"^https://www\\.youtube\\.com/results\\?search_query=(.)*$":			YTContext.SEARCH,
		"^https://www\\.youtube\\.com/user/[^/]*(\\?(.)*|)$":					YTContext.CHANNEL_HOME,
		"^https://www\\.youtube\\.com/channel/[^/]*(\\?(.)*|)$":				YTContext.CHANNEL_HOME,
		"^https://www\\.youtube\\.com/user/[^/]+/featured(\\?(.)*|)$":			YTContext.CHANNEL_HOME,
		"^https://www\\.youtube\\.com/channel/[^/]+/featured(\\?(.)*|)$":		YTContext.CHANNEL_HOME,
		"^https://www\\.youtube\\.com/user/[^/]+/videos(\\?(.)*|)$":			YTContext.CHANNEL_VIDEOS,
		"^https://www\\.youtube\\.com/channel/[^/]+/videos(\\?(.)*|)$":			YTContext.CHANNEL_VIDEOS,
		"^https://www\\.youtube\\.com/feed/trending(\\?(.)*|)$":				YTContext.TRENDING,
		"^https://www\\.youtube\\.com/feed/explore(\\?(.)*|)$":					YTContext.TRENDING,
		"^https://www\\.youtube\\.com/(\\?(.)*|)$":								YTContext.HOME
	});

	function createContextSwitchMsg(context){
		return {
			sender: SENDER,
			receiver: "content_controller",
			info: "context_switch",
			content: {
				context: context
			}
		};
	}

	function urlToContext(url){
		for(let regEx of Object.keys(RegExToContextMapping)){
			if((new RegExp(regEx)).test(url)){
				return RegExToContextMapping[regEx];
			}
		}

		if(YTRegEx.test(url))
			return YTContext.OTHER;
	}

	browser.tabs.onUpdated.addListener((tabId, cInfo, tab) => {
		if(YT_TAB_IDS.contains(tabId) && cInfo.status === "complete"){
			let context = urlToContext(tab.url);

			if(context !== undefined){
				browser.tabs.sendMessage(tabId, createContextSwitchMsg(context));
			}else{
				YT_TAB_IDS.remove(tabId);
			}
		}
	});

	browser.tabs.onRemoved.addListener((tabId) => {
		YT_TAB_IDS.remove(tabId);
	});

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "context_request"){

			if(msg.sender === "content_controller"){
				let context = urlToContext(sender.tab.url);

				if(context !== undefined){
					YT_TAB_IDS.add(sender.tab.id);
				}

				return new Promise((resolve) => {
					resolve(context);
				});
			}
		}
	});
}
