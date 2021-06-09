/* eslint-disable */

/** Back key handler **/
(function () {
	window.addEventListener("tizenhwkey", function (ev) {
		var activePopup = null,
			page = null,
			pageId = "";

		if (ev.keyName === "back") {
			activePopup = document.querySelector(".ui-popup-active");
			page = document.getElementsByClassName("ui-page-active")[0];
			pageId = page ? page.id : "";

			if (pageId === "main" && !activePopup) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				window.history.back();
			}
		}
	});
}());

/** Circle helper **/
/*global tau */
/*jslint unparam: true */
(function (tau) {

	// This logic works only on circular device.
	if (tau.support.shape.circle) {
		/**
		 * pagebeforeshow event handler
		 * Do preparatory works and adds event listeners
		 */
		document.addEventListener("pagebeforeshow", function (event) {
			/**
			 * page - Active page element
			 * list - NodeList object for lists in the page
			 */
			let page,
				list;

			page = event.target;
			if (page.id !== "page-snaplistview" && page.id !== "page-swipelist" && page.id !== "page-marquee-list") {
				list = page.querySelector(".ui-listview");
				if (list) {
					tau.widget.ArcListview(list);
				}
			}
		});
	}
}(tau));

/** Low battery check **/
(function () {
	var systeminfo = {

		systeminfo: null,

		lowThreshold: 0.04,

		listenBatteryLowState: function () {
			var self = this;

			try {
				this.systeminfo.addPropertyValueChangeListener(
					"BATTERY",
					function change(battery) {
						if (!battery.isCharging) {
							try {
								tizen.application.getCurrentApplication().exit();
							} catch (ignore) {
							}
						}
					},
					{
						lowThreshold: self.lowThreshold
					},
					function onError(error) {
						console.warn("An error occurred " + error.message);
					}
				);
			} catch (ignore) {
			}
		},

		checkBatteryLowState: function () {
			var self = this;

			try {
				this.systeminfo.getPropertyValue(
					"BATTERY",
					function (battery) {
						if (battery.level < self.lowThreshold && !battery.isCharging) {
							try {
								tizen.application.getCurrentApplication().exit();
							} catch (ignore) {
							}
						}
					},
					null);
			} catch (ignore) {
			}
		},

		init: function () {
			if (typeof tizen === "object" && typeof tizen.systeminfo === "object") {
				this.systeminfo = tizen.systeminfo;
				this.checkBatteryLowState();
				this.listenBatteryLowState();
			}			else {
				console.warn("tizen.systeminfo is not available.");
			}
		}
	};

	systeminfo.init();
}());
