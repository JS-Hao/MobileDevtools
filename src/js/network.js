import utils from './utils';

var network = {
	init: function(dom) {
		dom.innerHTML = this.html;

		// 初始化dom与监听器
		this.initialElement();
		this.initialEventListener();

		// 异步渲染Timeline
		setTimeout((function() {
			this.renderTime(this.getTimeline(), this.$el.timelineUl);
		}).bind(this), 100);

		// 渲染Resource Timing 
		this.renderTime(this.getResTime(), this.$el.resourceUl);
	},

	html: '' +
		'<div class="t-network">' +
		'  <section class="t-network-timeline">' +
		'       <h3>Timeline</h3>' +
		'       <ul></ul>' +
		'   </section>' +
		'   <section class="t-network-resource">' +
		'       <h3>Resource Timing</h3>' +
		'       <ul></ul>' +
		'   </section>' +
		'   <section class="t-network-xhr">' +
		'       <h3>XMLHttpRequest</h3>' +
		'       <ul></ul>' +
		'   </section>' +
		'	<section class="t-network-xhrCnt">' +
		'		<div class="fn-clear t-network-xhrCnt-header"><button class="t-network-xhrCnt-back"></button><div class="t-network-xhrCnt-url"></div></div>' +
		'		<div class="t-network-xhrCnt-detail"></div>' +
		'	</section>' +
		'</div>',

	initialElement: function() {
		this.$el = {};
		this.$el.container = document.querySelector('.t-network');
		this.$el.timeline = document.querySelector('.t-network-timeline');
		this.$el.resource = document.querySelector('.t-network-resource');
		this.$el.xhr = document.querySelector('.t-network-xhr');
		this.$el.timelineUl = document.querySelector('.t-network-timeline ul');
		this.$el.resourceUl = document.querySelector('.t-network-resource ul');
		this.$el.xhrUl = document.querySelector('.t-network-xhr ul');
		this.$el.xhrCnt = document.querySelector('.t-network-xhrCnt');
		this.$el.xhrUrl = document.querySelector('.t-network-xhrCnt-url');
		this.$el.xhrDetail = document.querySelector('.t-network-xhrCnt-detail');
		this.$el.xhrBack = document.querySelector('.t-network-xhrCnt-back');
	},

	initialEventListener: function() {
		this.$el.xhrUl.addEventListener('touchend', (function(e){
			e = e || window.event;
			var className = e.target.className.split(' ')[0];
			var arr = ['t-network-xhr-p', 't-network-xhr-name', 't-network-xhr-status', 't-network-xhr-method', 't-network-xhr-time', 't-network-xhr-url'];

			if (arr.indexOf(className) !== -1) {
				var dataId = e.target.getAttribute('data-id');

				// 显示xhr detail部分
				this.$el.xhrCnt.style.display = 'block';
				// 隐藏其余部分
				this.$el.timeline.style.display = 'none';
				this.$el.resource.style.display = 'none';
				this.$el.xhr.style.display = 'none';

				// 获取所有xhrCnt detail信息并隐藏, 仅显示对应的detail
				var xhrDetails = this.$el.xhrDetail.getElementsByTagName('ul');
				for (var i = 0, length = xhrDetails.length; i < length; i++) {
					if (xhrDetails[i].getAttribute('data-id') === dataId) {
						xhrDetails[i].style.display = 'block';
					} else {
						xhrDetails[i].style.display = 'none';
					}			
				}
				// 获取所有xhrCnt url信息并隐藏, 仅显示对应的url
				var xhrUrls = this.$el.xhrUrl.getElementsByTagName('span');
				for (var i = 0, length = xhrUrls.length; i < length; i++) {
					if (xhrUrls[i].getAttribute('data-id') === dataId) {
						xhrUrls[i].style.display = 'block';
					} else {
						xhrUrls[i].style.display = 'none';
					}
				}				
			}
		}).bind(this), false);

		this.$el.xhrBack.addEventListener('touchstart', (function() {
			// 隐藏xhr detail部分
			this.$el.xhrCnt.style.display = 'none';
			// 显示其余部分
			this.$el.timeline.style.display = 'block';
			this.$el.resource.style.display = 'block';
			this.$el.xhr.style.display = 'block';
		}).bind(this), false);
	},

	getTimeline: function() {
		var performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;

		if (performance === undefined) return false;

		var timing = performance.timing,
			api = {};

		if (timing) {
            api.loadTime = timing.loadEventEnd - timing.fetchStart;
            api.domReadyTime = timing.domComplete - timing.domInteractive;
            api.redirectTime = timing.redirectEnd - timing.redirectStart;
            api.appcacheTime = timing.domainLookupStart - timing.fetchStart;
            api.unloadEventTime = timing.unloadEventEnd - timing.unloadEventStart;
            api.lookupDomainTime = timing.domainLookupEnd - timing.domainLookupStart;
            api.connectTime = timing.connectEnd - timing.connectStart;
            api.requestTime = timing.responseEnd - timing.requestStart;
            api.initDomTreeTime = timing.domInteractive - timing.responseEnd;
            api.loadEventTime = timing.loadEventEnd - timing.loadEventStart;
		}
		return api;				
	},

	getResTime: function() {
		var performance = window.performance || window.webkitPerformance || window.msPerformance || window.mozPerformance;

		if (performance === undefined) return false;

		var resTime = performance.getEntries();
		console.log(resTime);
		var api = {};

		if (resTime) {
			for (var k in resTime) {
				var name = resTime[k].name.split('/').pop();

				api[name] = {
					url: resTime[k].name,
					time: resTime[k].entryType === 'navigation' ? resTime[k].responseStart - resTime[k].fetchStart : resTime[k].duration
				}
			}
		}

		return api;
	},

	renderTime: function(time, dom) {
		var arr = [];
		for (var k in time) {
			if (typeof time[k] === 'number') {
				arr.push('<li>' + k + ': ' + time[k] + '</li>');
			} else if (typeof time[k] === 'object') {
				arr.push('' +
					'<li>' + 
						'<p class="t-network-resource-p">' +
							'<span class="t-network-resource-name">' + k + '</span>' + 
							'<span class="t-network-resource-time">' + Math.round(time[k].time) + 'ms</span>' + 
							'<span class="t-network-resource-url">' + time[k].url + '</span>' +
						'</p>' +
					'</li>');
			}
			
		}
		dom.innerHTML = arr.join('');
	},

	renderXhr: function(obj) {
		var className = '';
		if (!(obj.status >= 200 && obj.status < 300)) {
			className += 't-error';
		}
		var html1 = '<span data-id="' + obj._url + '">[' + obj._method + '] ' + obj._url + '</span>'; 

		var html2 = '' +
			'<ul class="t-network-xhrCnt-detailUl" data-id="' + obj._url + '">' +
			'	<li>' + 
			'		<h4>Request</h4>' + 
			'		<p>URL: ' + obj._url + '</p>' +
			'		<p>Method: ' + obj._method + '</p>' +
			'		<p>params: ' + utils.obj2string(obj._params) + '</p>' + 
			'	</li>' +
			'	<li>' +
			'		<h4>Response</h4>' +
			'		<p>StatusCode: ' + obj.status + '</p>' +
			'		<p>Body: \n' + utils.obj2string(obj.response) + '</p>' +
			'	</li>' +
			'</ul>';

		var html3 = '' + 
			'<li>' + 
				'<p class="t-network-xhr-p" data-id="' + obj._url + '">' +
					'<span class="t-network-xhr-name ' + className + '" data-id="' + obj._url + '">' + obj._url + '</span>' + 
					'<span class="t-network-xhr-status" data-id="' + obj._url + '">' + obj.status + '</span>' + 
					'<span class="t-network-xhr-method" data-id="' + obj._url + '">' + obj._method + '</span>' + 
					'<span class="t-network-xhr-time" data-id="' + obj._url + '">' + (obj._end - obj._start) + 'ms</span>' +
					'<span class="t-network-xhr-url" data-id="' + obj._url + '">' + obj._url + '</span>' +
				'</p>' +
			'</li>';
		
		this.$el.xhrUrl.innerHTML += html1;
		this.$el.xhrDetail.innerHTML += html2;
		this.$el.xhrUl.innerHTML += html3;
	}
};

export default network;