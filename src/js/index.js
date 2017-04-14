import Console from './console';
import Element from './element';
import Network from './network';
import '../css/style.css';


var tooltip = {

	// 记录tooltip未加载前的文件加载错误信息
	records: [],

	props: {
		console: true,
		element: true,
		network: true
	},

	html: '' +
		'<div id="tooltip">' +
		'	<div id="t-btnBox">' +
		'		<button class="t-btn" id="t-btn-main">tooltip</button>' +
		'		<button class="t-btn" id="t-btn-console">console</button>' +
		'		<button class="t-btn" id="t-btn-network">network</button>' +
		'		<button class="t-btn" id="t-btn-element">element</button>' +
		'	</div>' +
		'	<div id="t-content">' +
		'		<ul class="fn-clear t-navBox">' +
		'			<li class="t-nav" id="t-nav-back"><a>Back</a></li>' +
		'			<li class="t-nav" id="t-nav-console"><a>Console</a></li>' +
		'			<li class="t-nav" id="t-nav-network"><a>Network</a></li>' +
		'			<li class="t-nav" id="t-nav-element"><a>Element</a></li>' +
		'		</ul>' +
		'		<ul id="t-contentBox">' +
		'			<li id="t-content-console"><content class="t-content"></content></li>' +
		'			<li id="t-content-network"><content class="t-content"></content></li>' +
		'			<li id="t-content-element"><content class="t-content"></content></li>' +
		'		</ul>' +
		'	</div>' +
		'</div>',

	components: {
		console: Console,
		element: Element,
		network: Network
	},

	start: function(options) {
		for (var i in options) {
			if (this.props[i] !== undefined) {
				this.props[i] = typeof options[i] === 'boolean' ?
					options[i] :
					true;
			}
		}
		this.init();
	},

	init: function() {
		var div = document.createElement('div');
		div.innerHTML = this.html;
		document.body.append(div);

		// 初始化
		this.initialElement();
		this.initialEventListener();
		this.initialComponent();

		// 启动ajax监听
		this.ajaxErrorListener(
			this.components.console.reportConsole.bind(this.components.console),
			this.components.network.renderXhr.bind(this.components.network));

		// 其他函数
		this.other();
	},

	initialElement: function() {
		this.$el = {};
		this.$el.container = document.getElementById('tooltip');
		this.$el.btn_box = document.getElementById('t-btnBox');
		this.$el.btn_main = document.getElementById('t-btn-main');
		this.$el.btn_console = document.getElementById('t-btn-console');
		this.$el.btn_network = document.getElementById('t-btn-network');
		this.$el.btn_element = document.getElementById('t-btn-element');
		this.$el.content = document.getElementById('t-content');
		this.$el.nav_back = document.getElementById('t-nav-back');
		this.$el.nav_console = document.getElementById('t-nav-console');
		this.$el.nav_network = document.getElementById('t-nav-network');
		this.$el.nav_element = document.getElementById('t-nav-element');
		this.$el.cnt_console = document.getElementById('t-content-console');
		this.$el.cnt_network = document.getElementById('t-content-network');
		this.$el.cnt_element = document.getElementById('t-content-element');
		this.$el.cntBox = document.getElementById('t-contentBox');
		this.$el.navBox = document.querySelector('.t-navBox');
	},

	initialEventListener: function() {
		// 主按钮展示/隐藏子按钮
		this.$el.btn_main.addEventListener('touchstart', this.switchItemBtn.bind(this), false);

		// 打开/关闭控制台
		this.$el.btn_element.addEventListener('touchstart', this.openTooltip.bind(this), false);
		this.$el.btn_console.addEventListener('touchstart', this.openTooltip.bind(this), false);
		this.$el.btn_network.addEventListener('touchstart', this.openTooltip.bind(this), false);
		this.$el.nav_back.addEventListener('touchstart', this.closeTooltip.bind(this), false);

		// 控制台标签切换
		this.$el.nav_console.addEventListener('touchstart', this.switchContent.bind(this), false); 
		this.$el.nav_element.addEventListener('touchstart', this.switchContent.bind(this), false); 
		this.$el.nav_network.addEventListener('touchstart', this.switchContent.bind(this), false); 
	},

	initialComponent: function() {
		!this.props.console || this.components.console.init(this.$el.cnt_console, this.records);
		!this.props.network || this.components.network.init(this.$el.cnt_network);
		!this.props.element || this.components.element.init(this.$el.cnt_element);
	},

	openTooltip: function(e) {
		e = e || window.event;
		var id = e.target.id.split('-').pop();
		this.$el.btn_box.style.display = 'none';
		this.$el.content.style.display = 'block';
		this.$el['cnt_' + id].style.display = 'block';
	},

	closeTooltip: function() {
		this.$el.content.style.display = 'none';
		this.$el.cnt_element.style.display = 'none';
		this.$el.cnt_console.style.display = 'none';
		this.$el.cnt_network.style.display = 'none';
		this.$el.btn_box.style.display = 'block';
	},

	switchItemBtn: function(e) {
		e = e || window.event;
		var isShow = e.currentTarget.isShow;
		if (!isShow) {
			// 显示子按钮
			this.$el.btn_element.style.display = 'block';
			this.$el.btn_console.style.display = 'block';
			this.$el.btn_network.style.display = 'block';

			// 移动动画
			this.animation(this.$el.btn_console, -250, -280, 200);
			this.animation(this.$el.btn_element, -120, -400, 200);
			this.animation(this.$el.btn_network, -120, -160, 200);

			e.currentTarget.isShow = 1;
		} else {
			// 移动动画
			this.animation(this.$el.btn_console, -120, -280, 200, (function() {
				this.$el.btn_element.style.display = 'none';
			}).bind(this));
			this.animation(this.$el.btn_element, -120, -280, 200, (function() {
				this.$el.btn_console.style.display = 'none';
			}).bind(this));
			this.animation(this.$el.btn_network, -120, -280, 200, (function() {
				this.$el.btn_network.style.display = 'none';
			}).bind(this));

			e.currentTarget.isShow = 0;
		}
	},

	animation: function(target, tLeft, tTop, time, func) {
		clearInterval(target._timer);
		// 获取目标当前位置
		var left = target.offsetLeft;
		var top = target.offsetTop;

		// 在60帧的标准情况下共能运行多少次
		var num = time / (1000 / 60);

		// 步长
		var lStep = (tLeft - left) / num;
		var tStep = (tTop - top) / num;

		// 启动定时器
		target._timer = setInterval(function() {
			if (num <= 0) {
				target.style.left = tLeft + 'px';
				target.style.top = tTop + 'px';
				clearInterval(target._timer);
				func && func();
			} else {
				target.style.left = target.offsetLeft + lStep + 'px';
				target.style.top = target.offsetTop + tStep + 'px';
				num--;
			}
		}, 1000 / 60);

	},

	switchContent: function(e) {
		e = e || window.event;
		// 显示专门的控制台
		var id = e.currentTarget.id.split('-').pop();
		this.$el.cnt_element.style.display = 'none';
		this.$el.cnt_console.style.display = 'none';
		this.$el.cnt_network.style.display = 'none';
		this.$el['cnt_' + id].style.display = 'block';
	},

	ajaxErrorListener: function(consoleFunc, netWorkFunc) {
		var that = this;

		// 重写send和open方法，对xhr进行监控
		var ajaxListener = new Object();
		ajaxListener.send = XMLHttpRequest.prototype.send;
		ajaxListener.open = XMLHttpRequest.prototype.open;

		XMLHttpRequest.prototype.open = function(method, url, boolean) {
			ajaxListener.open.call(this, method, url ,boolean);
			this._url = url;
			this._method = method;

			// 获取xhr发送的时间
			this.addEventListener('loadstart', function() {
				this._start = Date.now();
			}, false);


		}

		XMLHttpRequest.prototype.send = function(data) {
			ajaxListener.send.call(this, data);
						
			// 获取数据
			this._params = {};	
			if (this._method.toLowerCase() === 'get') {
				var query = this._url.split('?')[1].split('&');
				for (var i = 0, length = query.length; i < length; i++) {
					var key = query[i].split('=')[0];
					var value = query[i].split('=')[1];
					this._params[key] = value;
				}
			} else {
				this._params = data;
			}

			this.addEventListener('loadend', function() {
				this._end = Date.now();
				
				var obj = {
					url: this._url,
					text: this.statusText,
					status: this.status,
					method: this._method,
					params: this._params
				};
				
				if (this.status >= 200 && this.status < 300) {
					!that.props.network || (netWorkFunc && netWorkFunc(this));
					return true;
				} else {
					!that.props.console || (consoleFunc && consoleFunc({
						url: this._url,
						text: this.statusText,
						status: this.status,
						method: this._method
					}, 'ajaxError'));

					!that.props.network || (netWorkFunc && netWorkFunc(this));
				}
			}, false);
		}
	},

	other: function() {
		var HEIGHT = window.innerHeight;
		var navBoxHeight = parseFloat(document.getElementsByTagName('html')[0].style.fontSize) * 1.3;
		console.log(navBoxHeight);
		this.$el.cntBox.style.height = HEIGHT - navBoxHeight + 'px';
		this.$el.cntBox.style.overflow = 'scroll';
	},

	errorListner: function(e) {
		e = e || window.event;
		if (e.target !== window) {
			tooltip.records.push({
				target: e.target.localName,
				type: e.type,
				resourceUrl: e.target.src || e.target.href
			});	
		}
	}
}

// 在tooltip未启动前记录下文件的加载错误信息
window.addEventListener('error', tooltip.errorListner, true);

window.tooltip = tooltip;