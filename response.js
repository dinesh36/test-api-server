function Response(){
	this.handler    =function(){
		return function(req,res,next){
			var resp_handler       =new ResponseHandler(req,res);
			resp_handler.start_time=(new Date()).getTime();
			res.sendResponse       =resp_handler.sendResponse;
			res.sendError          =resp_handler.sendError;
			return next();
		};
	};
}

function ResponseHandler(req,resp){
	var response     =resp;
	this.path        ='';
	this.user        ='';
	this.sendResponse=function(resp,not_send_no_records){
		if(Object.keys(resp).length>0 || not_send_no_records){
			response.send({
				Status:'success',
				Data  :resp
			});
		}
		else{
			response.send({
				Status :'success',
				Data   :resp,
				Message:'No records found'
			});
		}
	};
	
	this.sendError   =function(e){
		var err;
		if(e.http_code){
			response.status(e.http_code);
		}else{
			response.status(400);
		}
		err=e;
		response.json({
			Status:'failure',
			Error :err
		});
	}
}

module.exports=Response;
