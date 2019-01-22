var tried_times = 0;

init_remote_call = function(){
    let data = {};
    data['occupied'] = false;
    data['funcnames'] = [];
    if(!Cookies.get("$received_func")){
        Cookies.set("$received_func",data);
    }
}

release_lock = function(){
    let received = JSON.parse(Cookies.get("$received_func"));
    received['occupied'] = false;
    Cookies.set("$received_func",received);
}

clear_remote_calls = function(){
    let data = {};
    data['occupied'] = false;
    data['funcnames'] = [];
    Cookies.set("$received_func",data);
}


listen = function(name_to_function){
    var accessible = false;
    if(!Cookies.get("$received_func")){
        console.log("remote call is not ready.");
        return;
    }
    setInterval(function(){
        let received = JSON.parse(Cookies.get("$received_func"));
        accessible = !received['occupied'];
        
        if(accessible)
        {
            received['occupied'] = true;
            Cookies.set("$received_func",received);
            let funcnames = received['funcnames'];
            if(funcnames.length > 0){
                let funcname = funcnames.shift();
                let func = name_to_function[funcname];
                func();
            }
            received['occupied'] = false;
            Cookies.set("$received_func",received);
        }
        else{
            console.log("waiting for access");
            tried_times++;
            if(tried_times >=3){
                release_lock();
                tried_times = 0;
            }
        }
        
    },500);
}

remote_call = function(funcname){
    if(!Cookies.get("$received_func")){
        console.log("remote call is not ready.");
        return;
    }
    let received = JSON.parse(Cookies.get("$received_func"));
    var accessible = !received['occupied'];
    var trying = setInterval(function(){
        if(accessible)
        {
            received['occupied'] = true;
            Cookies.set("$received_func",received);
            let funcnames = received['funcnames'];
            funcnames.push(funcname);
            Cookies.set("$received_func",received);
            console.log("remote add successfully.");
            received['occupied'] = false;
            Cookies.set("$received_func",received);
            clearInterval(trying);
        }
        else{
            console.log("remote add trying...");
        }
        
    },500);
    
}


bind_callback_function = function(funcname,callback){
    Cookies.set("$received_func",[]);
}

