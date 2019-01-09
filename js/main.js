    
    //globals
word_data = undefined;
loop_check_filled = undefined;
number_of_test = 10
GET_WORD_URL = "https://voctest--songlinhou.repl.co/get_words?number=6"
practice_rounds = 0
user_dictionary = undefined;
user_states = undefined;
user_db_word_list = undefined;
practice_request_success = false;
from_user_list = false;

    
    
    
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
    info = {
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
    promise = $.ajax(info);
    return promise;
}
    
     lean_cloud_put = function(route,data,withCredential=false){
        var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
        var key = "nRjAAmtjBPlswOwtXwUdxy0x";
        var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1' + route;
        info = {
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
        promise = $.ajax(info);
        return promise;
    }
     
     
lean_cloud_delete = function(delete_class,delete_id,data){
    var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
    var key = "nRjAAmtjBPlswOwtXwUdxy0x";
    var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1/' + delete_class + '/' + delete_id;
    info = {
        type: 'DELETE',
        url: request_url,
        headers:{'X-LC-Id':appId,'X-LC-Key':key,"Content-Type":"application/json;charset=UTF-8"},
        dataType: "json"
        //xhrFields: {withCredentials: true}
    };
    promise = $.ajax(info);
    return promise;
} 
     
    lean_cloud_get_ex = function(route,data){
        var appId = "S5KA3LxWxrgyz0VN6ghbAHXV-gzGzoHsz";
        var key = "nRjAAmtjBPlswOwtXwUdxy0x";
        var request_url = 'https://' + appId.substr(0,8) +'.api.lncld.net/1.1' + route;
        info = {
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
        
        promise = $.ajax(info);
        return promise;
    }
    
    
    //user login/signup
     
    lean_login = function(username,password){
        return lean_cloud_get("/login?username="+username+"&password="+password);
    }
    
    lean_signup = function(username,password){
        data = {username:username,password:password};
        return lean_cloud_post("/users",data);
    }
    
    
    //word starred
    
    lean_add_word = function(username,word,meaning){
        data = {word:word,meaning:meaning,user:username};
        return lean_cloud_post("/classes/StarredWord",data);
    }
    
    
    auto_set_current_dict = function(auto){
        if(!auto){return;}
        console.log('auto_set_current_dict');
        if(Cookies.get('chosen_book_file') == 'SYS:USER'){
            $('#current_book_name').html("用户单词本");
            from_user_list = true;
            console.log('current_book_name html 用户单词本');
        }
        else if(Cookies.get('chosen_book_file') == 'voc3000.xlsx'){
            $('#current_book_name').html("GRE 3000");
            console.log('current_book_name html GRE');
            from_user_list = false;
        }
        else{
            console.log('chosen_book_file default!');
            $('#current_book_name').html("GRE 3000");
            console.log('current_book_name html GRE default');
            from_user_list = false;
        }
    }
    
    
    
    get_word_fetch_url = function(number,book){
        url = "https://voctest--songlinhou.repl.co/get_words?number=" + number + "&book=" + book;
        return url;
    }
    
    
    
    logout_user = function(){
        $("#loginModal").modal("hide");
        $("#user_label span").html("用户名");
        $("#user_label").fadeOut("slow");
        $("#login_sign_menu_btn").show();
        user_states = undefined;
        Cookies.set("login_status",'');
    }
    
    update_user_login_state = function(data){
        $("#loginModal").modal("hide");
        $("#user_label span").html(username);
        $("#user_label").fadeIn("slow");
        $("#login_sign_menu_btn").hide();
        user_states = data;
        Cookies.set("login_status",data);
    }
    
    directly_login_from_cookie = function(auto_login){
        if(!auto_login){
            return;
        }
        login_data = Cookies.get("login_status");
        /*
        objectId: "5c34b50b7565710067ff4b10"
        sessionToken: "s5mhnmgpgj2c5q6phi1gkfmje"
        updatedAt: "2019-01-08T14:34:51.922Z"
        username: "meko"
        createdAt: "2019-01-08T14:34:51.922Z"
        emailVerified: false
        mobilePhoneVerified: false
        */
        if(login_data){
            try{
                login_data = JSON.parse(login_data);
            
                $("#loginModal").modal("hide");
                $("#user_label span").html(login_data['username']);
                $("#user_label").fadeIn("slow");
                $("#login_sign_menu_btn").hide();
                user_states = login_data;
                console.log("last time login data");
                console.log(login_data);
            }
            catch(err){
                console.log("autologin err",err);
                $("#user_label span").html("");
                $("#user_label").hide();
                Cookies.set("login_status",'');
            }
        }
    }
    
    
    /*success: function(data, status, xhr){
               console.log(data);
            },
            error: function(xhr, type){
                //window.location.reload();
                console.log(xhr.responseJSON);
            }
    */
    directly_add_word = function(){
        content = $("#directly_add_input").val();
        data = split_chinese_english(content);
        console.log(data);
        return data;
    }
    
    save_word_from_bookmark = function(word,meaning,marked){
        if(marked){
            console.log('marked');
            save_word(word,meaning);
        }
        else{
            //to delete
            console.log('unmarked');
            delete_word(word);
        }
    }
    
    delete_word = function(word){
        word = word.replace("<#>","#");
        Cookies.remove("<#>"+word);
        console.log(word +' is removed from cookies');
    }
    
    save_word = function(word,meaning){
        console.log("save:" + word + ":" + meaning);

        word = word.replace("<#>","#");
        Cookies.set("<#>"+word, meaning);
        console.log("current user_words=");
        console.log(Cookies.get()); //not function yet
        $("#directly_add_word_btn").addClass("disabled");
        //using firebase
        login_data = Cookies.get("login_status");
        //"fas fa-bookmark"
        
        try{
            if(login_data){
                login_data = JSON.parse(login_data);
            }
            username = login_data['username']
            lean_add_word(username,word,meaning)
                .done(function(resp){
                console.log("[DB]added to lean:" + username + "," + word + "," + meaning,resp);
                
                //ui update
                $("#alert_div").html('<div id="top_alert" class="alert alert-primary alert-dismissible fade show" role="alert"><strong>新单词加入云端</strong><br/>单词：' + word+ '<br/>词义：' + meaning + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            setTimeout(function(){
                console.log("close it");
                $('#directly_add_input').val("");
                $("#top_alert").alert('close');
            },2000);
                $("#directly_add_word_btn").removeClass("disabled");
                
            }).fail(function(err){
                console.log("[DB]failed to add to lean:" + username + "," + word + "," + password,err);
                
                //ui update
                $("#alert_div").html('<div id="top_alert" class="alert alert-success alert-dismissible fade show" role="alert"><strong>新单词加入本地</strong><br/>单词：' + word+ '<br/>词义：' + meaning + '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>');
            setTimeout(function(){
                console.log("close it");
                $('#directly_add_input').val("");
                $("#top_alert").alert('close');
            },2000);
                $("#directly_add_word_btn").removeClass("disabled");
                
            }).always(function(){
               console.log("[DB]save operation done."); 
            });
            
        }
        catch(err){
            console.log("save to lean error",err);
            Cookies.set("login_status",'');
        }
    }
    
    split_chinese_english = function(content){
        // need update
        cnStr = "";
        enStr = "";
        for(var i=0;i<content.length;i++){
            if(content.charCodeAt(i)>255){
                cnStr += content[i];
            }
            else{
                enStr += content[i];
            }
        }

        return {'cn':cnStr,'en':enStr}
    }
    
    show_confirm_window = function(title,information,cancel,ok,cancel_func,ok_func){
        $("#warningModalLabel").html(title);
        $("#warningModalText").html(information);
        $("#warning_cancel").html(cancel);
        $("#warning_ok").html(ok);
        $("#warningModal").modal('show');
        $("#warning_ok").on("click",function(){
            if(ok_func){
                ok_func();
            }
            $("#warningModal").modal('hide');
        });
        $("#warning_cancel").on("click",function(){
            if(cancel_func){
                cancel_func();
            }
            $("#warningModal").modal('hide');
        });
    }
    
    set_bookmark = function(index){
        if($("#save_word_btn_"+ index).hasClass("far")){
            $("#save_word_btn_"+ index).removeClass("far");
            $("#save_word_btn_"+ index).addClass("fas");
            return true;
        }
        else if($("#save_word_btn_"+ index).hasClass("fas")){
            $("#save_word_btn_"+ index).removeClass("fas");
            $("#save_word_btn_"+ index).addClass("far");
            return false;
        }
    }
    
    generate_card_html = function(word,correct_ans,your_ans,peer_ans,index,saved){
        save_status_html = "far fa-bookmark"
        if(saved){
            save_status_html = "fas fa-bookmark"
        }
        
        word = to_literal_str(word);
        correct_ans = to_literal_str(correct_ans);
        
        //style="font-family: 'Font Name', serif;"
        practice_card_html = '<!-- card start -->'+
        '<div class="col col-md-4 col-sm-6 col-xs-12 col-12">'+ 
        '<div class="card bg-light mb-3" style="max-width: 20rem;">'+
        '<div class="card-body">'+
        '<h5 class="card-title">' + '<a href="#"><i class="' + save_status_html + '" style="margin-right:10px;" id="save_word_btn_'+ index + '" onclick="event.preventDefault();marked=set_bookmark('+ index +');save_word_from_bookmark(\''+ word+'\',\''+ correct_ans +'\',marked);"></i></a>' + '<span style="font-family: \'' + "Raleway" + '\', serif;">'+ word + '</span></h5>' +
        '<input type="text" class="form-control ans_input" id="ans_input_'+index+'" aria-describedby="input word meaning" placeholder="意思是？">' +
        '</div>' +
        '<ul class="list-group list-group-flush result">' +
        '<li class="list-group-item word_ans d-none">正确答案 ' + correct_ans + '</li>';
        if (your_ans){
            practice_card_html +='<li class="list-group-item your_ans">你的答案 ' + your_ans +'</li>';
        }
        else{
            practice_card_html +='<li class="list-group-item d-none your_ans">你的答案 ' + your_ans +'</li>';
        }
        if (peer_ans){
            practice_card_html +='<li class="list-group-item peer_answer">他的答案 '+ peer_ans +'</li>';
        }
        else{
            practice_card_html +='<li class="list-group-item peer_answer d-none">他的答案 '+ peer_ans +'</li>';
        }
        practice_card_html +='</ul></div></div><!-- card end -->'
        return practice_card_html
    }
    
    check_all_inputs = function(){
        filled = true;
        $(".ans_input").each(function(index,ans_input){
            value = ans_input.value;
            //console.log(value);
            if (value.trim().length == 0){
                //console.log("input " + index + " is not filled");
                filled &= false;
            }
            else{
                filled &= true;
            }
            
        });
        if (filled){
            //console.log("filled");
            $('#finish_btn').removeClass('disabled');
        }
        else{
            $('#finish_btn').addClass('disabled');
        }
    }
    
    dict_list_key_combine = function(dict_obj){
        console.log('dict_list_key_combine=',dict_obj);
        ret_hash = {};
        for(var number in dict_obj) {
            content_hash = dict_obj[number];
            for(var key in content_hash){
                ret_hash[key] = content_hash[key];
            }
        }
        return ret_hash;
    }
    
    first_time_show_word_list = function(book_file_name='voc3000.xlsx'){
        $("#practiceModal").modal('show');
        time_left = 0;
        connection_str = "建立连接中";
        time_estimated = setInterval(function(){
            if(time_left <=3){
                connection_str += ".";
                time_left ++;
            }
            else{
                time_left = 0;
                connection_str = "建立连接中"; 
            }
            
            $("#word_practice_status").html(connection_str);
            //$("#practice_sec_left").html(""+time_left);
        },1000);
        
        if(book_file_name.startsWith("SYS:")){
            console.log("using lean cloud");
            promise = get_all_db_words();
            if(promise){
            promise.done(function(data){
                console.log("get data!!!",data);
                clearInterval(time_estimated);
                results = data['results'];
                html = "";
                index = 0;
                word_list = []
                $.each(results,function(index,record){
                    word = record['word'];
                    meaning = record["meaning"];
                    element = {};
                    element[word] = meaning;
                    word_list.push(element);
                    //console.log('word_list=',word_list);
                });
                console.log('word_list=',word_list);
                sampled_words = get_random_from_array(6,word_list);
                word_data = dict_list_key_combine(sampled_words);
                Cookies.set("db_word_hash",word_data);
                practice_request_success = true;
                setTimeout(function(){
                    $("#practiceModal").modal('hide');
                    practice_rounds ++;
                    $('#bottom_left_text').html("列表 " + practice_rounds);
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                },1000);
                
            return;
        }).fail(function(err){
                console.log("err in getting db practice",err);
                practice_request_success = false;
            
            });
            return;
            }
            else{
                //user not login
                console.log("use cache word list since user doesn't login");
                clearInterval(time_estimated);
                all_words = get_cookie_word_hash();
                word_data = get_random_from_hash(6,all_words);
                Cookies.set("db_word_hash",word_data);
                practice_request_success = true;
                practice_rounds ++;
                $('#bottom_left_text').html("列表 " + practice_rounds);
                setTimeout(function(){
                    $("#practiceModal").modal('hide');
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                },1000);
                
                
                //manu
                
            }
            return;
        }
        
        
        //https://vocabcardgame--songlinhou.repl.co/get_word
        try_fetch_word = setInterval(function(){
            $.ajax({
                type: 'POST',
                url: get_word_fetch_url(6,book_file_name),
                dataType: 'jsonp',
                jsonp:'callback',
                jsonpCallback:"callback",
                success: function(data){
                    console.log(data);
                    clearInterval(try_fetch_word);
                    word_data = data;
                    practice_request_success = true;
                    clearInterval(time_estimated);
                    setTimeout(function(){
                        $("#practiceModal").modal('hide');
                        //console.log("hide");
                        practice_request_success = true;
                        practice_rounds ++;
                        $('#bottom_left_text').html("列表 " + practice_rounds);
                        time_left = 5;
                        //back to top
                        $("html, body").animate({ scrollTop: 0 }, "slow");
                    },500);
                },
                error:function(){
                    console.log('retrying...');
                    practice_request_success = false;
                }
            });
        },1000);
    }
    
    to_literal_str = function(str){
        try{
        str = str.replace(/\n/g, '\\n').replace(/\'/g, "\\'").replace(/\"/g, '\\"');
        return str;
        }catch(err){
            console.log('to_literal_str:',str);
        }
    }
    
    get_cookie_word_hash = function(){
        all_cookie_data = Cookies.get();
        ret = {}
        $.each(all_cookie_data,function(word,meaning){
            if(word.indexOf('<#>') == 0){
                _word = word.replace("<#>","");
                ret[_word] = meaning;
            }
        });
        console.log('get_cookie_word_hash=',ret);
        return ret;
    }
    
    
    show_cookie_word_list = function(){
        console.log("show_cookie_word_list");
        all_cookie_data = Cookies.get();
        html = "";
        index = 0;
        $.each(all_cookie_data,function(word,meaning){
            //console.log(word + ":" + meaning);
            if(word.indexOf("<#>") != 0){
                //continue;
            }
            else{
                word = word.replace("<#>","");
                meaning_html = "<span class='meaning_in_list' style='font-size:10pt;padding-left:10px;color:grey'>"+meaning+"</span>";
                html += '<li class="list-group-item word_piece" id="word_piece_'+ index +'" onclick="click_word_piece('+index+');">' +'<span class="word_in_list" style="color:black">'+ word + '</span>' + meaning_html + "</li>";
                index ++;
            }
        });
        html += "<div style='height:15rem;'></div>";
        $('#word_list_contents').html(html);
    }
    
    click_word_piece = function(index){
        $(".word_piece").removeClass("active");
        $(".word_in_list").css("color",'black');
        $(".meaning_in_list").css("color",'grey');
        //$(".word_piece span").css("color","grey");
        $(".word_piece").css("color","grey");
        $("#word_piece_"+index).addClass("active");
        $("#word_piece_"+index +" span").css("color","white");
    }
    
    get_random_from_array = function(number,items){
        ret = [];
        for(i=0;i<number;i++){
            var item = items[Math.floor(Math.random()*items.length)];
            ret.push(item);
        }
        return ret;
    }
    
    get_random_from_hash = function(number,hash){
        var ret = {};
        var keys = [];
        for(var key in hash){
            keys.push(key);
        }
        sampled_keys = get_random_from_array(number,keys);
        console.log('sampled_keys=',sampled_keys);
        for(i=0; i<sampled_keys.length;i++){
            sampleKey = sampled_keys[i];
            ret[sampleKey] = hash[sampleKey];
        }
        console.log('sampled_hash=',ret);
        return ret;
    }
    
    get_all_db_words = function(){
        login_status = Cookies.get("login_status");
        if(login_status)
        {
            login_status = JSON.parse(login_status);
            console.log("get db list from user");
            url = "/classes/StarredWord";
            url += ("?where=" + JSON.stringify({user:login_status['username']}));
            user_comp_dict = {"user":login_status['username']};
            return lean_cloud_get(url);
      }
        else{
            console.log('not login!');
        }
    }
    
    
    
    show_db_word_list = function(){
        login_status = Cookies.get("login_status");
        if(login_status)
        {
            login_status = JSON.parse(login_status);
            console.log("get db list from user");
            url = "/classes/StarredWord";
            url += ("?where=" + JSON.stringify({user:login_status['username']}));
            user_comp_dict = {"user":login_status['username']};
            lean_cloud_get(url).done(function(data){
                console.log("get data!!!",data);
                results = data['results'];
                html = "";
                index = 0;
                $.each(results,function(index,record){
                    //console.log(index+":"+record);
                    word = record['word'];
                    meaning = record["meaning"];
                    //html
                    meaning_html = "<span style='font-size:10pt;padding-left:10px;color:grey' class='meaning_in_list'>"+meaning+"</span>";
                    html += '<li class="list-group-item word_piece" id="word_piece_'+ index +'" onclick="click_word_piece('+index+');">' +'<span class="word_in_list" style="color:black">'+ word + '</span>' + meaning_html + "</li>";
                    index ++;
                });
                html += "<div style='height:15rem;'></div>";
                $('#word_list_contents').html(html);
                $('.list-group-item').fadeIn("slow");
            }).fail(function(error){
                console.log("error data",data);
                //just display the cookie
                show_cookie_word_list();
            });
            /*
            lean_cloud_get_ex(url,user_comp_dict).done(function(data){
                console.log("get user data from db",data);
                
            }).fail(function(err){
                console.log("get user data err",err);
            });
            */
        }
        else{
            show_cookie_word_list();
        }
        
    }
    
    
    
    show_firebase_word_list = function(){
        test_co = firestore.collection("test");
        test_co.get().then(function(querySnapshot) {
            
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                console.log(doc.id, " => ", doc.data());
            });
            //console.log(querySnapshot[0]);
        
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });

    }
    
    generate_html_for_data_hash = function(data,try_fetch_word,from_user_dict){
        console.log(data);
        practice_rounds ++;
        if(try_fetch_word)
            clearInterval(try_fetch_word);
        word_data = data;
        card_html = "";
        index = 0;
        $.each(data, function(word, meaning) {
            console.log(word + ":" + meaning);
            card_html += generate_card_html(word,meaning,undefined,undefined,index,from_user_dict);
            index ++;
        });
        card_html += "<div style='height:15rem;'></div>"
        // animation here
        $( ".card" ).fadeOut( "slow", function() {
            // Animation complete.
            $("#practice_list").html(card_html);
            $('#finish_btn').html("检查");
            $('#finish_btn').addClass("btn-primary");
            $('#finish_btn').removeClass("btn-success");


            $('#bottom_left_text').html("列表 " + practice_rounds);
            loop_check_filled = setInterval(function(){
                check_all_inputs();
            });
            // back to top
            $("html, body").animate({ scrollTop: 0 }, "slow");
        });
    }
    
    show_word_list = function(book_file_name='voc3000.xlsx'){
        if(book_file_name.startsWith("SYS:USER")){
            console.log("using data cached from lean cloud");
            word_list = JSON.parse(Cookies.get("db_word_hash"));
            word_data = get_random_from_hash(6,word_list);
            practice_request_success = true;
            setTimeout(function(){
                $("#practiceModal").modal('hide');
                practice_rounds ++;
                $('#bottom_left_text').html("列表 " + practice_rounds);
                $("html, body").animate({ scrollTop: 0 }, "slow");
                generate_html_for_data_hash(word_data,undefined,true);
            },1000);
            return;
        }
        
        
        try_fetch_word = setInterval(function(){
        $.ajax({
            type: 'POST',
            url: get_word_fetch_url(6,book_file_name),
            dataType: 'jsonp',
            jsonp:'callback',
            jsonpCallback:"callback",
            success: function(data){
                generate_html_for_data_hash(data,try_fetch_word,false);
            },
            error:function(){
                console.log('error');
            }
        });
        },1000);
    }
    
    fetch_answers = function(){
        all_user_inputs = [];
        your_ans_labels = [];
        $('.ans_input').each(function(index,obj){
            if ($(obj).is(":hidden")){}
            else{
                all_user_inputs.push(obj);
            }
        });
        $('.your_ans').each(function(index,obj){
            if ($(obj).is(":hidden")){}
            else{
                your_ans_labels.push(obj);
            }
        });
        for(i=0;i<all_user_inputs.length;i++){
            $(your_ans_labels[i]).html("你的答案 "+ all_user_inputs[i].value);
        }
    }
    
    show_index = function(){
        //$('.pageview').addClass('d-none');
        $('.pageview').hide();
        //$('#user_dict').addClass('d-none');
        //$('#user_dict').hide();
        //$('#menu').removeClass('d-none');
        $('#menu').fadeIn("slow");
        //$("#game").addClass('d-none');
        //$("#bottom_nav").addClass("d-none");
        $("#bottom_nav").fadeOut();
        $("#bottom_nav").hide(); //bug fix
        //$("#practice").addClass("d-none");
        $("#top_nav").collapse("hide");
        /*
        if($("#top_nav").hasClass("show")){
            $("#top_nav").removeClass("show");
        }
        */
    }
    
    auto_login_check = function(){
        auto_login = Cookies.get("auto_login");
        if (auto_login){
            $("#auto_login").attr("checked", true);
            return true;
        }
        $("#auto_login").attr("checked", false);
        return false;
    }
    
    
    
    document_ready = function(){
        console.log("ready");
        $("#game").hide();
        $("#practice").hide();
        $("#bottom_nav").hide();
        //$('#user_dict').addClass('d-none');
        $('#user_dict').hide();
        $("#bottom_nav").hide(); //bug fix
        $("#dict_nav").hide();
        $("#user_label").hide();
        $("#login_error").hide();
        auto_login = auto_login_check();
        directly_login_from_cookie(auto_login);
        auto_set_current_dict(true);
        
        //width = $(document).width() - $("#bottom_left_text").width() - 200;
        //$("#bottom_left_text").attr("style","color:white;padding-right:"+ width +"px;");
    }
    
    $("#auto_login").on("click",function(){
        //Cookies.get("auto_login")
        var isChecked = $('#auto_login').prop('checked');
        if(isChecked){
            Cookies.set("auto_login",true);
            console.log("auto_login sets to true");
        }else{
            Cookies.set("auto_login",false);
            console.log("auto_login sets to false");
        }
    })
    
    
    $("#directly_add_word_btn").on("click",function(){
        if($("#directly_add_word_btn").hasClass("disabled")){
            return;
        }
        data = directly_add_word();
        $("#top_nav").collapse("hide");
        save_word(data['en'],data['cn']); //using cookie
        
        
    });
    
    $("#menu_btn").on("click",function(){
        //set highlight of button
        $('.nav-item').removeClass('active');
        $('#menu_btn').parent().addClass('active');
        
        show_index();
    });
    
    
    $("#startNewGame").on("click",function(){
        //$("#menu").addClass('d-none');
        //$('.pageview').addClass("d-none");
        $('.pageview').hide();
        $("#game").removeClass('d-none');
        
    });
    
   $("#newPractice").on("click",function(){
        chosen_book_file = Cookies.get('chosen_book_file');
        first_time_show_word_list(chosen_book_file);
    });
    
    $("#practiceModal").on("hidden.bs.modal", function () {
        if(!practice_request_success){
            return;
        }
        // when practiceModal finishes hiding
        console.log("start trigger");
        //$('.pageview').addClass("d-none");
        $('.pageview').hide();
        //$("#practice").removeClass('d-none');
        $("#practice").show();
        //$("#menu").addClass('d-none');
        $("#bottom_nav").fadeIn("slow");
        $("#bottom_nav").show(); //bug fix
        card_html = "";
        index = 0;
        console.log('word_data=',word_data);
        $.each(word_data, function(word, meaning) {
            console.log("each",word + ":" + meaning);
            card_html += generate_card_html(word,meaning,undefined,undefined,index,from_user_list);
            index ++;
        });
        card_html += "<div style='height:15rem;'></div>"
       $("#practice_list").html(card_html);
        loop_check_filled = setInterval(function(){
            check_all_inputs();
        },1000)
    });
    
    
    
    $('#skip_button').on("click",function(){
        if($('#skip_button').hasClass("btn-outline-primary")){
            $(".word_ans").removeClass("d-none");
            $(".your_ans").removeClass("d-none");
            fetch_answers()
            $('.ans_input').addClass("d-none");
            $('#skip_button').removeClass("btn-outline-primary");
            $('#skip_button').addClass("btn-danger");
            clearInterval(loop_check_filled);

            //$('#finish_btn').removeClass('disabled');
            //back to top
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
        else if($('#skip_button').hasClass("btn-danger")){
            $('#skip_button').addClass("btn-outline-primary");
            $('#skip_button').removeClass("btn-danger");
            $('#finish_btn').removeClass('disabled');
            chosen_book_file = Cookies.get('chosen_book_file');
            show_word_list(chosen_book_file);
        }
    });
    
    $('#finish_btn').on("click",function(){
        if($('#finish_btn').hasClass("disabled")){
           return;
        }
        if($('#finish_btn').hasClass("btn-primary")){
            $(".word_ans").removeClass("d-none");
            $(".your_ans").removeClass("d-none");
            fetch_answers()
            $('.ans_input').addClass("d-none");
            $('#finish_btn').html("检查");
            $('#finish_btn').removeClass("btn-primary");
            $('#finish_btn').addClass("btn-success");
            clearInterval(loop_check_filled);
            //back to top
            $("html, body").animate({ scrollTop: 0 }, "slow");
        }
        else if($('#finish_btn').hasClass("btn-success")){
            if(!$('#finish_btn').hasClass("disabled"))
                $("#finish_btn").addClass("disabled");
            chosen_book_file = Cookies.get('chosen_book_file');
            show_word_list(chosen_book_file);
        }
    });
    
    $('#user_dict_btn').on("click",function(){
        //show_cookie_word_list();
        show_db_word_list();
        show_dict = function(){
                $('.nav-item').removeClass('active');
                $('#user_dict_btn').parent().addClass('active');
                $('.pageview').hide();
                $('#user_dict').fadeIn("slow");
                //$('#dict_nav').faceIn("slow");
                $("#top_nav").collapse("hide");
                $("#warningModal").modal('hide');
                //$("#dict_nav").show(); //when i need this, uncomment it
                //console.log('$("#dict_nav").show()');
        }
        
        if($("#practice").is(":visible")){
            console.log("you are practising now");
            show_confirm_window("注意","结束词义默写练习并进入单词本吗？","取消","结束",undefined,show_dict);
            return;
        }
        if($("#game").is(":visible")){
            console.log("you are gaming now");
            $("#warningModal").modal('show');
            return;
        }
        //console.log("user-dict");
        //set highlight of button
        /*
        $('.nav-item').removeClass('active');
        $('#user_dict_btn').parent().addClass('active');
        
        //$('.pageview').addClass("d-none");
        $('.pageview').hide();
        //$('#user_dict').removeClass("d-none");
        $('#user_dict').fadeIn("slow");
        //$('#dict_nav').removeClass("d-none");
        $('#dict_nav').faceIn("slow");
        $("#dict_nav").show(); //bug fix
        $("#top_nav").collapse("hide");
        */
        show_dict();
        //$("#dict_nav").removeClass("d-none"); when i need it uncomment it
    });
    
    $("#loginWindowBtn").on("click",function(){
        $(".rewards_of_login").hide();
        $("#loginModal").modal("show");
        $("#login_part").show();
        $("#signin_part").hide();
        $("#signin_error").hide();
    });
    
    $(".why_login").on("click",function(){
        $(".rewards_of_login").toggle("slow");
    });
    
    $('#go_to_reg_btn').on("click",function(){
        $(".rewards_of_login").hide();
        //$("#loginModal").modal("show");
        $("#login_part").hide();
        $("#signin_part").fadeIn("slow");
    });
    
     $('#go_to_login_btn').on("click",function(){
        $(".rewards_of_login").hide();
        //$("#loginModal").modal("show");
        $("#signin_part").hide();
        $("#login_part").fadeIn("slow");
    });
    
    $('#login_btn').on("click",function(){
        if($('#login_btn').hasClass("disabled")){
            return;
        }
        username_correct = false;
        
        username = $("#username_login").val();
        password = $("#inputPassword_login").val();
        
        $("#login_btn").addClass("disabled");
        $("#go_to_reg_btn").addClass("disabled");
        
        if(username.trim() == ''){
            $("#login_error").html("账号不能为空");
            $("#login_error").fadeIn();
            $('#login_btn').removeClass("disabled")
            return;
        }
        if(password.trim() == ''){
            $("#login_error").html("密码不能为空");
            $("#login_error").fadeIn();
            $('#login_btn').removeClass("disabled")
            return;
        }
        $("#login_error").hide();
        $('#login_btn').addClass("disabled");
        lean_login(username,password)
        .done(function(data){
            console.log("success!",data);
            update_user_login_state(data);
            
        }).fail(function(err){
            console.log(err.responseJSON);
            res = err.responseJSON;
            //code: 210, error: "The username and password mismatch."
            error_text = "登录失败";
            if(res['code'] == 210){
                error_text = "账号密码不符";
            }
            else if(res['code'] == 219){
                error_text = "失败次数太多，请稍后再试";
            }
            $("#login_error").html(error_text);
            $("#login_error").fadeIn();
        }).always(function(){
            $("#login_btn").removeClass("disabled");
            $("#go_to_reg_btn").removeClass("disabled");
        });
    
    });
    
    $('#signin_btn').on("click",function(){
        if($('#signin_btn').hasClass("disabled")){
            return;
        }
        username_correct = false;
        password_correct = false;
        
        username = $("#username_sign").val();
        password = $("#inputPassword_sign").val();
        password2 = $("#inputPassword2").val();
        
        if(username.trim().length < 4){   
            $("#signin_error").html("账号长度至少4位");
            $("#signin_error").fadeIn("slow");
            return;
        }
        if(username.trim() != username){
            $("#signin_error").html("账号前后不能有空格");
            $("#signin_error").fadeIn("slow");
            return;
        }
        
        if(password != password2){
            // dismatch
            $("#signin_error").html("两次密码需保持一致");
            $("#signin_error").fadeIn("slow");
            return;
        }
        if(password.trim() != password){
            //contain whitespace
            $("#signin_error").html("密码前后不能有空格");
            $("#signin_error").fadeIn("slow");
            return;
        }
        if(password.length < 8){
            //too short
            $("#signin_error").html("密码长度至少8位");
            $("#signin_error").fadeIn("slow");
            return;
        }
        $("#signin_error").hide();
        $("#signin_btn").addClass("disabled");
        $("#go_to_login_btn").addClass("disabled");
        lean_signup(username,password)
        .done(function(data){
            console.log("success!",data);
            //update ui
            update_user_login_state(data);
            
            
        }).fail(function(err){
            console.log(err.responseJSON);
            
        }).always(function(){
            $("#signin_btn").removeClass("disabled");
            $("#go_to_login_btn").removeClass("disabled");
        });
    
    });
    
    $("#user_label").on("click",function(){
        console.log("show logout prompt");
        show_confirm_window("退出登录","是否要注销当前用户？","返回","退出",undefined,logout_user);
    })
    
    $('#selected_word_list_menu_btn').on("click",function(){
        $('#book_list_modal').modal("show");
        var book_list_selection_content = $("#book_list_selection").contents();
        login_status = Cookies.get("login_status");
        var num_of_user_list = 0;
        if(login_status){
            get_all_db_words().done(function(data){
                num_of_user_list = $(data['results']).length;
                $('#user_word_number_span',book_list_selection_content).html('单词数 '+num_of_user_list);
            });
        }else
        {
            cookie_word_hash = get_cookie_word_hash();
            num_of_user_list = Object.keys(cookie_word_hash).length;
            $('#user_word_number_span',book_list_selection_content).html('单词数 '+num_of_user_list);
        }
        
    });

    $('#book_select_confirm').on("click",function(){
        console.log("book_select_confirm onclick");
        current_book_file = Cookies.get('chosen_book_file');
        console.log('now confirm book=' + current_book_file);
        auto_set_current_dict(true);
    });

    $('#book_select_cancel').on("click",function(){
        console.log("book_select_cancel onclick");
        // we don't do anything.
    });

   

    
    
    //callbacks

    callback_set_current_book = function(book_name){
        
    }


    
    
    
