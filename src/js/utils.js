var utils = {
	obj2string: function(obj){
		var r = []; 
		if (obj == null) {
			return String(obj);
		}
		if (typeof obj == "string") { 
			return "\"" + obj
				.replace(/([\'\"\\])/g,"\\$1")
				.replace(/(\n)/g,"\\n")
				.replace(/(\r) /g,"\\r")
				.replace(/(\t) /g,"\\t")
				+ "\""; 
		
		} 

	 	if (typeof obj == "object") { 
			if (!obj.sort) { 
		 		for(var i in obj){ 
					r.push(i + ":" + utils.obj2string.call(this, (obj[i]))); 
		 		} 
				if(!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(obj.toString)) { 
					r.push("toString:" + obj.toString.toString()); 
				} 
		    	r = "{" + r.join() + "}"; 
			} else { 
				for (var i = 0; i < obj.length; i++){ 
					r.push(utils.obj2string.call(this, (obj[i]))); 
				} 
				r = "[" + r.join() + "]"; 
			} 
			return r; 
		} 
	 	return obj.toString(); 
	}
}

export default utils;