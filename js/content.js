const ENDPOINT = 'https://sukubhattu.pythonanywhere.com/';
let ad_data;

function get_website() {
	const host_name = window.location.hostname;
	let website_name = host_name.split('.');
	website_name = website_name[website_name.length - 2];
	return website_name;
}

let website = get_website();
class RemoveAds {
	constructor(...class_array) {
		this.class_array = class_array;
	}
	removeAds() {
		for (let ads in this.class_array) {
			try {
				document.querySelectorAll(`.${this.class_array[ads]}`).forEach((ad) => ad.remove());
			} catch (e) {
				console.log(e);
			}
		}
	}
}

function afterDOMLoaded() {
  setTimeout(function () {
    // console.log("afterDOMLoaded is running to remove dom and ad_data is ", ad_data);
    website_data = ad_data.find((data_) => data_.website_name == website);
    if (website_data) {
      // console.log("Website matches with db and its data is ", website_data);
			remove_ads = new RemoveAds(...website_data.ad_lists);
			remove_ads.removeAds();
    }
	}, 1500);
}

function removeAdsAfterDOMLoaded() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', afterDOMLoaded);
  } else {
    afterDOMLoaded();
  }
}

// NOTE: To clear data
function clearLocalStorage() {
  // console.log("I am clearing local storage");
  chrome.storage.local.clear();
  // console.log("I cleared local storage");
}

// clearLocalStorage();

function saveToLocalStorage(data) {
  chrome.storage.local.set({ "ad_block_data": data }, function () {
    // console.log("Data is saved", data);
    ad_data = data;
  });
}

function get_data() {
  fetch(ENDPOINT)
    .then((res) => { return res.json() })
    .then((data) => {
      let current_day = String(new Date());
      data.unshift({ "previous_pulled_time": current_day})
      // console.log("Saving to local storage", data);
      saveToLocalStorage(data);
    })
    .catch((err)=>{console.log(err)})
}

function getFromLocalStorage() {
  chrome.storage.local.get('ad_block_data', function (result) {
    let data_from_storage = result.ad_block_data;
    if (data_from_storage) {
      ad_data = data_from_storage;
      let today = String(new Date());
      previous_pulled_time = data_from_storage[0].previous_pulled_time;
      let diff_in_pulled_time = new Date(today) - new Date(previous_pulled_time);
      if (diff_in_pulled_time > 7200000) {
        // 86400000
        // console.log("Pulling data as it is 2 hours old");
        get_data();
      }
    }
    else {
      // console.log("There is no data so fetching data");
      get_data();
    }
    removeAdsAfterDOMLoaded();
	});
}

getFromLocalStorage();
