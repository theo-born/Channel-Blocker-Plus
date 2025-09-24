{
	const SENDER = "content_controller";

	let curObservers = [];

	let curContext;

	function createContextRequestMsg(){
		return {
			sender: SENDER,
			receiver: "background_url_update",
			info: "context_request"
		};
	}

	function updateObservers(){

		while(curObservers.length > 0){
			curObservers.pop().disconnect();
		}

		if(curContext === YTContext.HOME){
			curObservers = createHomeObservers();
		}

		if(curContext === YTContext.TRENDING){
			curObservers = createTrendingObservers();
		}

		if(curContext === YTContext.SEARCH){
			curObservers = createSearchObservers();
		}

		if(curContext === YTContext.CHANNEL_HOME){
			curObservers = createChannelHomeObservers();
		}

		if(curContext === YTContext.CHANNEL_VIDEOS){
			curObservers = createChannelVideosObservers();
		}

		if(curContext === YTContext.VIDEO){
			curObservers = createVideoObservers();
		}
	}

	async function init(){
		curContext = await browser.runtime.sendMessage(createContextRequestMsg());

		$(document).ready(updateObservers());
	}

	browser.runtime.onMessage.addListener((msg) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "filter_storage_modified"){

			if(msg.sender === "background_storage_filter"){
				$(document).ready(updateObservers());
			}
		}

		if(msg.info === "context_switch"){

			if(msg.sender === "background_url_update"){
				curContext = msg.content.context;

				$(document).ready(updateObservers());
			}
		}

		if(msg.info === "html_data_request"){

			if(msg.sender === "background_bug_report"){
				return new Promise((resolve) => {
                    resolve(document.querySelector("html").outerHTML);
                });
			}
		}
	});

	init();
}
