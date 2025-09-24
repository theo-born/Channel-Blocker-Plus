const HOME_VIDEO_CONFIG = Object.freeze({
	anchorSelector: ["ytd-rich-item-renderer[class='style-scope ytd-rich-grid-renderer']"],
	characterDataSelectors: {
		videoTitle: [
			"span[class='yt-core-attributed-string yt-core-attributed-string--white-space-pre-wrap'"
		],
		userChannelName: ["a[class='yt-core-attributed-string__link']"]
	}
})

const HOME_VIDEO_CONFIG_V2 = Object.freeze({
	anchorSelector: ["ytd-rich-item-renderer[class='style-scope ytd-rich-grid-row']"],
	characterDataSelectors: {
        videoTitle: ["yt-formatted-string#video-title"],
        userChannelName: ["a[class='yt-simple-endpoint style-scope yt-formatted-string']"]
	}
});
