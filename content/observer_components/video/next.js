const NEXT_CHARACTER_DATA_SELECTORS = Object.freeze({
	// videoTitle: ["span#video-title"],
	videoTitle: [
		"span[class='yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap']"
	],
	userChannelName: [
		"span[class='yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color']"
	]
})

const NEXT_AUTOPLAY_CONFIG = Object.freeze({
	anchorSelector: [
		"ytd-compact-autoplay-renderer[class='style-scope ytd-watch-next-secondary-results-renderer']"
	],
	characterDataSelectors: NEXT_CHARACTER_DATA_SELECTORS
})

const NEXT_VIDEO_CONFIG = Object.freeze({
	anchorSelector: [
		"yt-lockup-view-model[class='ytd-watch-next-secondary-results-renderer lockup yt-lockup-view-model--wrapper']"
	],
	characterDataSelectors: NEXT_CHARACTER_DATA_SELECTORS
})

const NEXT_PLAYLIST_CONFIG = Object.freeze({
	anchorSelector: ["ytd-compact-playlist-renderer[class='style-scope ytd-watch-next-secondary-results-renderer']"],
	characterDataSelectors: NEXT_CHARACTER_DATA_SELECTORS
});

const NEXT_ITEM_SECTION_VIDEO_CONFIG = Object.freeze({
	anchorSelector: [
		"ytd-item-section-renderer[class='style-scope ytd-watch-next-secondary-results-renderer']",
		"ytd-compact-video-renderer[class='style-scope ytd-item-section-renderer']"
	],
	characterDataSelectors: NEXT_CHARACTER_DATA_SELECTORS
});

const NEXT_ITEM_SECTION_PLAYLIST_CONFIG = Object.freeze({
	anchorSelector: [
		"ytd-item-section-renderer[class='style-scope ytd-watch-next-secondary-results-renderer']",
		"ytd-compact-playlist-renderer[class='style-scope ytd-item-section-renderer']"
	],
	characterDataSelectors: NEXT_CHARACTER_DATA_SELECTORS
});

async function onNextObserved(next, characterDatas, characterDataParents, config){
	insertBlockBtnBefore(
		$(next).find(
			"span[class='yt-core-attributed-string yt-content-metadata-view-model__metadata-text yt-core-attributed-string--white-space-pre-wrap yt-core-attributed-string--link-inherit-color']"
		)[0],
		characterDatas.userChannelName
	)

	toggleVisibiltyHorizontal(next, await isVideoTitleBlocked(characterDatas.userChannelName, characterDatas.videoTitle));
}
