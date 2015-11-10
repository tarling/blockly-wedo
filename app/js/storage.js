define(function(){

	var isApp = typeof chrome != "undefined" && chrome.storage != null;

	var setProxy, getProxy;

	return {

		setProxies: function(getProxy_, setProxy_) {
			setProxy = setProxy_;
			getProxy = getProxy_;
		},

		set: function(data, callback) {

			console.log("storage set", isApp);

			if (isApp)
			{
				if (setProxy)
				{
					setProxy(data, callback);
				} else {
					chrome.storage.local.set(data, callback);
				}
			} else {

				if (!window.localStorage)
				{
					console.warn("no local storage available");
					return;
				}
				for (var prop in data)
				{
					window.localStorage.setItem(prop, data[prop]);
				}
				if (callback) callback();
			}
		},

		get: function(keys, callback) {

			if (isApp)
			{
				if (getProxy)
				{
					getProxy(keys, callback);
				} else {
					chrome.storage.local.get(keys, callback);
				}
			} else {
				if (!window.localStorage)
				{
					console.warn("no local storage available");
					return;
				}
				var data = {}
				keys.forEach(function(key){
					var val = window.localStorage.getItem(key);
					if (val == "true") val = true;
					else if (val == "false") val = false;

					data[key] = val;
				})
				callback(data);
			}
		}
	}
});
