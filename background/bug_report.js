{
    const SENDER = "background_bug_report";

    function createHTMLDataRequestMsg(){
        return {
            sender: SENDER,
            receiver: "content_controller",
            info: "html_data_request"
        };
    }

    browser.contextMenus.create({
        id: "cb_bug_report",
        title: "Report a bug on this page",
        contexts: ["all"],
        documentUrlPatterns: ["*://www.youtube.com/*"]
    });

	let bugToYtMap = {};

    browser.contextMenus.onClicked.addListener(async function(info, contentTab){
        if(info.menuItemId === "cb_bug_report") {

            let bugReportTab = await browser.tabs.create({
                url:"/ui/bug/html/bugreport.html"
            });

			bugToYtMap[bugReportTab.id] = {
				htmlData: await browser.tabs.sendMessage(contentTab.id, createHTMLDataRequestMsg()),
				url: contentTab.url
			};
        }
    });

	browser.tabs.onRemoved.addListener((tabId) => {
		delete bugToYtMap[tabId];
	});

	browser.runtime.onMessage.addListener((msg, sender) => {
		if(msg.receiver !== SENDER)
			return;

		if(msg.info === "url_request"){

			if(msg.sender === "bug_user_interaction"){
				return new Promise((resolve) => {
					resolve(bugToYtMap[sender.tab.id].url);
				});
			}
		}

		if(msg.info === "html_data_request"){

			if(msg.sender === "bug_user_interaction"){
				return new Promise((resolve) => {
					resolve(bugToYtMap[sender.tab.id].htmlData);
				});
			}
		}
	});
}
