function createIsBlockedRequestMsg(userChannelName){
	return {
		sender: "content_is_blocked_lib",
		receiver: "background_storage_filter",
		info: "is_blocked_request",
		content: {
			user_channel_name: userChannelName
		}
	};
}

async function isUserChannelNameBlocked(userChannelName){
	return await browser.runtime.sendMessage(createIsBlockedRequestMsg(userChannelName));
}

async function isVideoTitleBlocked(userChannelName, videoTitle){
	let msg = createIsBlockedRequestMsg(userChannelName);
	msg.content.additional = {
		type: "title",
		content: videoTitle
	};

	return await browser.runtime.sendMessage(msg);
}

async function isCommentContentBlocked(userChannelName, commentContent){
	let msg = createIsBlockedRequestMsg(userChannelName);
	msg.content.additional = {
		type: "comment",
		content: commentContent
	};

	return await browser.runtime.sendMessage(msg);
}
