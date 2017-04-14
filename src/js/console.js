import utils from './utils';

var console = {

	init: function(container, records) {
		if (container) {
			container.innerHTML = this.html;
			this.initialElement();
			this.initialEventListener();
			// 资源加载监控
			this.resErrorListener();
			// js代码错误监控
			window.onerror = this.jsErrorListener.bind(this);
			
			this.consoleRewrite();

			// 将错误记录输出到console台上
			for (var i = 0, length = records.length; i < length; i++) {
				this.reportConsole(records[i], 'resError');
			}
		}
	},

	html: '' +
		'<div class="t-console">' +
		'	<header class="fn-clear">' +
		'		<button class="t-console-btn t-clear"></button>' +
		'		<ul class="fn-clear">' +
		'			<li><button class="t-console-btn t-all">All</button></li>' +
		'			<li><button class="t-console-btn t-error">Error</button></li>' +
		'			<li><button class="t-console-btn t-warn">Warning</button></li>' +
		'			<li><button class="t-console-btn t-info">Info</button></li>' +
		'			<li><button class="t-console-btn t-log">Log</button></li>' +
		'		</ul>' +
		'	</header>' +
		'	<content>' +
		'		<ul class="t-console-cnt"></ul>' +
		'	</content>' +
		'</div>',

	initialElement: function() {
		this.$el = {};
		this.$el.container = document.querySelector('.t-console');
		this.$el.btn_all = document.querySelector('.t-console-btn.t-all');
		this.$el.btn_clear = document.querySelector('.t-console-btn.t-clear');
		this.$el.btn_error = document.querySelector('.t-console-btn.t-error');
		this.$el.btn_warn = document.querySelector('.t-console-btn.t-warn');
		this.$el.btn_info = document.querySelector('.t-console-btn.t-info');
		this.$el.btn_log = document.querySelector('.t-console-btn.t-log');
		this.$el.cnt = document.querySelector('.t-console-cnt');
	}, 

	initialEventListener: function() {
		this.$el.btn_all.addEventListener('touchstart', this.handleClick.bind(this), false);
		this.$el.btn_error.addEventListener('touchstart', this.handleClick.bind(this), false);
		this.$el.btn_warn.addEventListener('touchstart', this.handleClick.bind(this), false);
		this.$el.btn_log.addEventListener('touchstart', this.handleClick.bind(this), false);
		this.$el.btn_clear.addEventListener('touchstart', this.handleClick.bind(this), false);
		this.$el.btn_info.addEventListener('touchstart', this.handleClick.bind(this), false);

	},

	handleClick: function(e) {
		e = e || window.event;
		var type = e.currentTarget.className.split('-').pop();
		if (type === 'all') {
			var lis = document.querySelectorAll('.t-console-cnt-li');
			for (var i = 0; i < lis.length; i++) {
				lis[i].style.display = 'block';
			}
		} else if (type === 'clear') {
			this.$el.cnt.innerHTML = '';
		} else {
			var lis = document.querySelectorAll('.t-console-cnt-li');
			var targets = document.querySelectorAll('.t-console-cnt-li.t-cnt-' + type);
			for (var i = 0; i < lis.length; i++) {
				lis[i].style.display = 'none';
			}
			for (var i = 0; i < targets.length; i++) {
				targets[i].style.display = 'block';
			}
		}
		
	},

	resErrorListener: function() {
		var that = this;
		window.addEventListener('error', function(e){
			e = e || window.event;
			if (e.target !== window) {
				that.reportConsole({
					target: e.target.localName,
					type: e.type,
					resourceUrl: e.target.src || e.target.href
				}, 'resError');
			}		
		}, true);
	},

	// js执行错误监听
	jsErrorListener: function(message, url, line, col, error) {
		col = col || (window.event && window.event.errorCharacter) || 0;
		this.reportConsole({
			message: message,
			script: url,
			line: line,
			column: col,
			stack: error
		}, 'error');
	},

	// Console重写
	consoleRewrite: function() {
		var that = this;
		var oldLog = window.console.log;
		var oldWarn = window.console.warn;
		var oldErr = window.console.error;
		var oldInfo = window.console.info;

		window.console.log = function() {
			var arr = Array.prototype.slice.call(arguments);
			oldLog.apply(console, arr);
			var types = that.type.apply(that, arr);
			for (var i = 0, length = types.length; i < length; i++) {
				that.reportConsole.apply(that, [arr[i], 'log', types[i]]);
			}
		};

		window.console.warn = function () {
			var arr = Array.prototype.slice.call(arguments);
			oldWarn.apply(console, arr);
			var types = that.type.apply(that, arr);
			for (var i = 0, length = types.length; i < length; i++) {
				that.reportConsole.apply(that, [arr[i], 'warn', types[i]]);
			}
			
		};

		window.console.error = function() {
			var arr = Array.prototype.slice.call(arguments);
			oldErr.apply(console, arr);
			var types = that.type.apply(that, arr);
			for (var i = 0, length = types.length; i < length; i++) {
				that.reportConsole.apply(that, [arr[i], 'logError', types[i]]);
			}
		};

		window.console.info = function() {
			var arr = Array.prototype.slice.call(arguments);
			oldInfo.apply(console, arr);
			var types = that.type.apply(that, arr);
			for (var i = 0, length = types.length; i < length; i++) {
				that.reportConsole.apply(that, [arr[i], 'info', types[i]]);
			}
		}
	},

	type: function() {
		var arr = Array.prototype.slice.call(arguments);
		var result = [];
		var types = {};
		"Boolean Number String Function Array Date RegExp Object Error".split(' ').forEach(function(e, i) {
			types['[object ' + e + ']'] = e.toLowerCase();
		});

		for (var i = 0, length = arr.length; i < length; i++) {

			if (arr[i] == null) {
				result.push(String(arr[i]));
			}
			result.push(typeof arr[i] === 'object' || typeof arr[i] === 'function' ?
				types[types.toString.call(arr[i])] || "object" :
				typeof arr[i]);
		}
		return result;		
	},

	reportConsole(data, type) {
		type = type || 'log';
		switch (type) {
			case 'error':
				var li = '<li class="t-console-cnt-li t-cnt-error">' +
					'[Err]  ' + data.message + '  ' + data.script + ' :' + data.line + ':' + data.column +
					'</li>';
				break;
			case 'log': 
			case 'warn':
			case 'info':
			case 'logError':
				var type2 = arguments[2] || 'undefined',
					text = type2 == 'object' || type2 == 'array' ?
						utils.obj2string(data) :
						data.toString(); 
				var li = '<li class="t-console-cnt-li t-cnt-' + type + '">' +
					'[Log]  ' + type2 + ':  ' + text +  
					'</li>';
				break;
			case 'ajaxError': 
				var li = '<li class="t-console-cnt-li t-cnt-error">' +
					'[Err]  ' + data.method + '  ' + data.status + '(' + data.text + ')  ' + data.url +
					'</li>';
				break;
			case 'resError':
				var li = '<li class="t-console-cnt-li t-cnt-error">' +
					'[Err]  GET  ' + data.target + '  ' + data.type + '  ' + data.resourceUrl +
					'</li>';
				break;
			default:
				break;
		}
		this.$el.cnt.innerHTML += li;
	}
};

export default console;