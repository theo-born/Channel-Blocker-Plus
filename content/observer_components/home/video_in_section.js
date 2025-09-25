const VIDEO_IN_SECTION_CONFIG = Object.freeze({
	anchorSelector: ["ytd-rich-item-renderer[class='style-scope ytd-rich-grid-renderer']"],
	characterDataSelectors: {
		videoTitle: [
			"span[class='yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap']"
		],
		userChannelName: [
			"a[class='yt-core-attributed-string__link yt-core-attributed-string__link--call-to-action-color yt-core-attributed-string--link-inherit-color']"
		]
	}
})
