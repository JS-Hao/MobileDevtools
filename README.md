# fast-console 便捷控制台

### version 
v1.0.1
### feature
* ##### Console 控制台
	* 可打印log、error、warn和info信息，并分颜色显示
	* 错误捕捉：文件加载错误、js执行错误以及ajax请求错误
	* 清除所有输出信息
* ##### Network 控制台
	* 显示timeline，包括：loadTime、domReadyTime、redirectTime、appcacheTime、unloadEventTime、lookupDomainTime、connectTime、requestTime、initDomTreeTime和loadEventTime
	* 显示资源加载相关信息
	* 显示所有XHR请求的request与response信息
* ##### Element 控制台
	* 显示html元素及内容

### Use
为捕获更完整的信息，请在所有加载文件前加载此文件
```html
<script src="../build/fast-console.js"></script>
```
启动：
``` javascript
	// 若未传入相应参数，默认情况下为打开控制台
	tooltip.start({
		console: true,        // 打开console控制台
		network: false,      // 关闭network控制台
		element: true        // 打开element控制台
	})
```