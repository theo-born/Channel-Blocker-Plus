const COMMENT_CONFIG = Object.freeze({
	anchorSelector: ["ytd-comment-thread-renderer"],
	characterDataSelectors: {
		commentContent: ["yt-attributed-string#content-text"]
	}
})

const REPLY_COMMENT_CONFIG = Object.freeze({
	anchorSelector: ["ytd-comment-view-model"],
	characterDataSelectors: {
		userChannelName: ["a#author-text", "span"],
		commentContent: ["yt-attributed-string#content-text"]
	}
})

async function onCommentObserved(comment, characterDatas){
	let authorText = $(comment).find("a#author-text")[0];
	let userChannelName;

	if(authorText.hidden){

		userChannelName = $(comment)
			.find(
				"span[class=' style-scope ytd-comment-view-model style-scope ytd-comment-view-model']"
			)[0]
			.innerText.trim()
	}else{
		userChannelName = $(authorText).find("span")[0].innerText.trim();
	}

	authorText.style.display = "inline";

	insertBlockBtnBefore(authorText, userChannelName);

	toggleVisibiltyHorizontal(comment, await isCommentContentBlocked(userChannelName, characterDatas.commentContent));
}

async function onReplyCommentObserved(replyComment, characterDatas){
	let channelNameElem = $(replyComment).find(
		"span[class='yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap']"
	)[0]

	channelNameElem.style.display = "inline";
	
	insertBlockBtnBefore(channelNameElem, characterDatas.userChannelName);

	toggleVisibiltyHorizontal(replyComment, await isCommentContentBlocked(characterDatas.userChannelName, characterDatas.commentContent));
}
