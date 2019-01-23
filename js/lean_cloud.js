
    
lean_cloud_get = function(route,withCredential=false)
{
    var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
    var key = "nRjAAmtjBPlswOwtXwUdxy0x";
    var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1' + route;
    info = {
        type: 'GET',
        url: request_url,
        headers:{'X-LC-Id':appId,'X-LC-Key':key,"Content-Type":"text/plain;charset=UTF-8"}
        //xhrFields: {withCredentials: true}
    };
    if(withCredential){
        info['xhrFields'] = {withCredentials: true};
    }
    promise = $.ajax(info);
    return promise;
}
    
lean_cloud_post = function(route,data,withCredential=false){
    var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
    var key = "nRjAAmtjBPlswOwtXwUdxy0x";
    var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1' + route;
    var info = {
        type: 'POST',
        url: request_url,
        headers:{'X-LC-Id':appId,'X-LC-Key':key,"Content-Type":"application/json;charset=UTF-8"},
        data:JSON.stringify(data),
        dataType: "json"
        //xhrFields: {withCredentials: true}
    };
    if(withCredential){
        info['xhrFields'] = {withCredentials: true};
    }
    var promise = $.ajax(info);
    return promise;
}
    
     lean_cloud_put = function(class_name,objectID,data,withCredential=false){
        var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
        var key = "nRjAAmtjBPlswOwtXwUdxy0x";
        var route = class_name + "/" + objectID 
        var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1/classes/' + route;
        var info = {
            type: 'PUT',
            url: request_url,
            headers:{'X-LC-Id':appId,'X-LC-Key':key,"Content-Type":"application/json;charset=UTF-8"},
            data:JSON.stringify(data),
            dataType: "json"
            //xhrFields: {withCredentials: true}
        };
        if(withCredential){
            info['xhrFields'] = {withCredentials: true};
        } 
        var promise = $.ajax(info);
        return promise;
    }
     
     
lean_cloud_delete = function(delete_class,delete_id,data){
    var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
    var key = "nRjAAmtjBPlswOwtXwUdxy0x";
    var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1/' + delete_class + '/' + delete_id;
    var info = {
        type: 'DELETE',
        url: request_url,
        headers:{'X-LC-Id':appId,'X-LC-Key':key,"Content-Type":"application/json;charset=UTF-8"},
        dataType: "json"
        //xhrFields: {withCredentials: true}
    };
    var promise = $.ajax(info);
    return promise;
} 
     
    lean_cloud_get_ex = function(route,data){
        var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
        var key = "nRjAAmtjBPlswOwtXwUdxy0x";
        var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1' + route;
        var info = {
            type: 'POST',
            url: request_url,
            headers:{"Content-Type":"text/plain;charset=UTF-8"},
            data: {
            '_method':'GET',
            '_ApplicationId':appId,
            '_ApplicationKey':key
            
        }
            //xhrFields: {withCredentials: true}
        };
        
        var promise = $.ajax(info);
        return promise;
    }
    
    