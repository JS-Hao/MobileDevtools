var element = {
	init: function(dom) {
		setTimeout((function() {
			var domTree = this.getDomTree();
			dom.appendChild(this.render(domTree));
		}).bind(this), 100);		
	},

	// loadRewrite: function(func) {
	// 	if (window.onload) {
	// 		var oldFunc = window.onload;
	// 		window.onload = function() {
	// 			oldFunc.call(window);
	// 			func.apply(this);
	// 		}
	// 	} else {
	// 		window.onload = func.bind(this);
	// 	}
	// },

	getDomTree: function() {
		var html = document.getElementsByTagName('html');
		var domTree = {};
		function _getDomTree(nodes, dom) {
			for (var i = 0, length = nodes.length; i < length; i++) {
				var nodeType = nodes[i].nodeType;
				var nodeName = nodes[i].nodeName;
				var nodeValue = nodes[i].nodeValue;
				if (nodeType === 1) {
					// 向虚拟dom中添加该节点
					dom['$' + nodeName + i] = {
						name: nodeName,
						value: nodeValue,
						type: nodeType
					};

					// 在节点中添加它的属性
					dom['$' + nodeName + i].attr = {};
					for (var j in nodes[i].attributes) {
						if (nodes[i].attributes[j].nodeValue) {
							dom['$' + nodeName + i].attr[nodes[i].attributes[j].name] = nodes[i].attributes[j].nodeValue;
						}		
					}
					_getDomTree.call(null, nodes[i].childNodes, dom['$' + nodeName + i]);
				} else if (nodeType === 3) {
					if (nodeValue === '') return;
					dom.text = nodeValue;
				}
			}
			return dom;
		}
		return _getDomTree(html, domTree);
	},

	render: function(dom) {
		var div = document.createElement('div');
		return _render(dom, div);

		function _render(obj, dom) {
			var ul = document.createElement('ul');
			for (var i in obj) {
				if ((i).indexOf('$') === 0) {
					var attr = _renderAttr(obj[i].attr);
					var li = document.createElement('li');

					var span1 = document.createElement('span');
					span1.innerHTML = obj[i].name;
					span1.className = "t-element-tag";

					var span2 = document.createElement('span');
					span2.innerHTML = '' + attr;
					span2.className = 't-element-attr';

					li.appendChild(span1);
					li.appendChild(span2);
					ul.appendChild(li);

					_render.call(null, obj[i], li);

				} else if (i === 'text') {
					if (obj[i].trim() === '') continue;
					var li = document.createElement('li');

					var span = document.createElement('span');
					span.className = 't-element-cnt';
					span.appendChild(document.createTextNode('content: ' + obj[i].trim()));

					li.appendChild(span);
					ul.appendChild(li);
				}
			}
			dom.appendChild(ul);
			return dom;
		}

		function _renderAttr(attr) {
			var text = '';
			for (var i in attr) {
				text += '<i>' + i + '</i>' + ': ' + attr[i];
			}
			return text;
		}
	} 
};

export default element;