const ENDPOINT = 'https://sukubhattu.pythonanywhere.com/';
let data;

fetch(ENDPOINT)
	.then((res) => res.json())
	.then((res_) => {
		data = res_;
	});

function get_website() {
	const host_name = window.location.hostname;
	let website_name = host_name.split('.');
	website_name = website_name[website_name.length - 2];
	return website_name;
}

class RemoveAds {
	constructor(...class_array) {
		this.class_array = class_array;
	}
	removeAds() {
		for (let ads in this.class_array) {
			document.querySelectorAll(`.${this.class_array[ads]}`).forEach((ad) => ad.remove());
		}
	}
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', afterDOMLoaded);
} else {
	afterDOMLoaded();
}

function afterDOMLoaded() {
	setTimeout(function () {
		let website = get_website();
		data = data.find((data_) => data_.website_name == website);
		if (data) {
			remove_ads = new RemoveAds(...data.ad_lists);
			remove_ads.removeAds();
		}
	}, 3000);
}
