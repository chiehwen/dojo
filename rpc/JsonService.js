dojo.provide("dojo.rpc.JsonService");
dojo.require("dojo.rpc.RpcService");

dojo.declare("dojo.rpc.JsonService", dojo.rpc.RpcService, {
		bustCache: false,
		contentType: "application/json-rpc",
		lastSubmissionId: 0,

		callRemote: function(method, params){
			// summary:
			// 		call an arbitrary remote method without requiring it to be
			// 		predefined with SMD
			var deferred = new dojo.Deferred();
			this.bind(method, params, deferred);
			return deferred;
		},

		bind: function(method, parameters, deferredRequestHandler, url){
			//summary:
			//		JSON-RPC bind method. Takes remote method, parameters,
			//		deferred, and a url, calls createRequest to make a JSON-RPC
			//		envelope and passes that off with bind.
			var def = dojo.rawXhrPost({
				url: url||this.serviceUrl,
				postData: this.createRequest(method, parameters),
				contentType: this.contentType,
				timeout: this.timeout, 
				handleAs: "json-comment-optional"
			});
			def.addCallbacks(this.resultCallback(deferredRequestHandler), this.errorCallback(deferredRequestHandler));
		},

		createRequest: function(method, params){
			// summary:
			//	create a JSON-RPC envelope for the request
			var req = { "params": params, "method": method, "id": ++this.lastSubmissionId };
			var data = dojo.toJson(req);
			return data;
		},

		parseResults: function(/*anything*/obj){
			//summary:
			//		parse the result envelope and pass the results back to
			//		the callback function
			if(dojo.isObject(obj)){
				if("result" in obj){
					return obj.result;
				}
				if("Result" in obj){
					return obj.Result;
				}
				if("ResultSet" in obj){
					return obj.ResultSet;
				}
			}
			return obj;
		}
	}
);
