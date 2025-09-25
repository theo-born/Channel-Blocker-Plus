const blockBtnPaddingRight = 0.5;

function createAddBlockedUserMsg(userChannelName) {
    return {
        sender: "content_block_button_lib",
        receiver: "background_storage_filter",
        info: "add_blocked_user",
        content: {
            user_channel_name: userChannelName,
        },
    };
}

function createBlockBtnSVG() {
	let svgURI = "http://www.w3.org/2000/svg"
	let svg = document.createElementNS(svgURI, "svg")

	svg.setAttribute("viewBox", "0 0 100 100")

	let path = document.createElementNS(svgURI, "path")
	path.setAttribute(
		"d",
		"M49.998 93.334c23.934 0 43.336-19.402 43.336-43.336 0-23.934-19.402-43.337-43.336-43.337-23.934 0-43.337 19.403-43.337 43.337 0 23.934 19.403 43.336 43.337 43.336ZM19.355 80.645l61.29-61.29"
	)
	path.setAttribute(
		"style",
		"fill: transparent;stroke-linecap: round;stroke-width: 13.323; stroke-miterlimit=10;"
	)

	svg.appendChild(path)

	return svg
}

function createBlockBtnElement(userChannelName, style) {
	let btn = document.createElement("button")
	btn.setAttribute("class", "cb_block_button")
	btn.setAttribute("type", "button")
	btn.setAttribute("title", "Block '" + userChannelName + "' (Channel Blocker Plus)")

	if (style !== undefined) {
		$.extend(btn.style, style)
	}

	$(btn).on("click", () => {
		browser.runtime.sendMessage(createAddBlockedUserMsg(userChannelName))
		return false
	})

	btn.appendChild(createBlockBtnSVG())

	return btn
}

function insertBlockBtnBefore(element, userChannelName, style) {
	if ($(element).prev("button.cb_block_button").length > 0) {
		let blockBtn = $(element).prev("button.cb_block_button")[0]

		blockBtn.setAttribute("title", "Block '" + userChannelName + "' (Channel Blocker Plus)")

		$(blockBtn).off("click")

		$(blockBtn).on("click", () => {
			browser.runtime.sendMessage(createAddBlockedUserMsg(userChannelName))
			return false
		})
	} else {
		$(element).before(createBlockBtnElement(userChannelName, style))
	}
}

function insertBlockBtnAfter(element, userChannelName, style) {
	if ($(element).next("button.cb_block_button").length > 0) {
		let blockBtn = $(element).next("button.cb_block_button")[0]

		blockBtn.setAttribute("title", "Block '" + userChannelName + "' (Channel Blocker Plus)")

		$(blockBtn).off("click")

		$(blockBtn).on("click", () => {
			browser.runtime.sendMessage(createAddBlockedUserMsg(userChannelName))
			return false
		})
	} else {
		$(element).after(createBlockBtnElement(userChannelName, style))
	}
}

function initBlockBtnCSS() {
	if (document.getElementById("cb_style") === null) {
		let style = document.createElement("style")
		style.id = "cb_style"
		document.head.appendChild(style)
	}

	updateBlockBtnCSS()
}

function updateBlockBtnCSS() {
	let style = document.getElementById("cb_style")

	while (style.sheet.rules.length > 0) {
		style.sheet.deleteRule(0)
	}

	width = contentUIConfig[ContentUI.BLOCK_BTN_SIZE] * 0.01 + blockBtnPaddingRight + "rem"
	strokeColor = contentUIConfig[ContentUI.BLOCK_BTN_COLOR]
	if (contentUIConfig[ContentUI.BLOCK_BTN_VISIBILITY]) {
		display = "inline-flex"
	} else {
		display = "none"
	}

	style.sheet.insertRule(`
		.cb_block_button {
			padding-left: 0em;
			padding-right: ${blockBtnPaddingRight}rem;
			border: none;
			background-color: Transparent;
			cursor: pointer;
			width: ${width};
			stroke: ${strokeColor};
			display: ${display};
			flex-shrink: 0;
			justify-content: center;
    		align-items: center;
            opacity: 0.25;
            transition-property: opacity;
            transition-timing-function: ease-out;
            transition-duration: 0.05s;
            // position: absolute;
            // translate: -1.5rem 0.25%;
		}
	`)

	style.sheet.insertRule(`
		.cb_block_button svg{
			display: block;
		}
	`)

	style.sheet.insertRule(`
		.cb_block_button:hover{
            opacity: 1;
		}
	`)
}
