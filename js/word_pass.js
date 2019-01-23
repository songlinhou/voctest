current_pass_voc_list = [{key:'keyexp'},{mist:'mistexp'},{im:'im1',ir:'ir2'}];
current_pass_data = undefined;
word_num_per_unit=5;
training_data = undefined;
current_unit_id = 0; // need more care. do not tamper with it
current_word_start_id = undefined;
users_latest_unit = 0;
LEARNING =0;
QUIZ = 0;
all_meanings = undefined;
audioElement = undefined;
//during = LEARNING;
Cookies.set("during","LEARNING");
Cookies.set("list_index_in_unit",0);
user_quiz_error = {};
correct_word_in_list = [];
word_in_progress = '';
last_record_mistake_word = '';
view_history_card = false;
list_index_in_history_card = 0;

setup_audio = function(src){
    audioElement = document.createElement('audio');
    audioElement.setAttribute('src', src);
    audioElement.addEventListener('ended', function() {
        //this.play();
    }, false);
}

play_sound = function(src){
    console.log("play sound:",src);
    setup_audio(src);
    audioElement.play();
}


// accross files
update_learning_nav_status = function(text,btn_visible,btn1_active,btn2_active){
    var status = {};
    if(text != '$keep'){
        status['text'] = text;
    }
    if(btn_visible != '$keep'){
        status['btn_visible'] = btn_visible;
    }
    if(btn1_active != '$keep'){
        status['btn1_active'] = btn1_active;
    }
    if(btn2_active != '$keep'){
        status['btn2_active'] = btn2_active;
    }
    Cookies.set("learn_nav_status",status);
}



get_word_explanation = function(word){
        var url = 'https://fastapi--songlinhou.repl.co/meaning?word=' + word; // this is faster
        //var url = 'https://voctest--songlinhou.repl.co/meaning?word=' + word;
        return $.ajax({
            type: 'POST',
            url: url,
            dataType: 'jsonp',
            jsonp:'callback',
            jsonpCallback:"callback",
        });
    }


random_sort = function(thing){
      return (0.5 - Math.random() );
}



get_list_word_url = function(fromId,toId){
    return "https://voctest--songlinhou.repl.co/get_uncor_unit?from=" + fromId + "&to=" + toId;
}

get_unit_word_url = function(unitID){
    //cardID=0 --> 0 - 4
    //cardID=1 --> 5 - 9
    //cardID=2 --> 10 - 14
    return get_list_word_url(word_num_per_unit*unitID,word_num_per_unit*unitID+4);
}

get_unit_data = function(unitID){
    //http://voctest--songlinhou.repl.co/get_uncor_unit?from=0&to=2
    return $.ajax({
            type: 'POST',
            url: get_unit_word_url(unitID),
            dataType: 'jsonp',
            jsonp:'callback',
            jsonpCallback:"callback"
        });
}

generate_unit_training_list = function(index){
    var ret_list = [];
    var quiz_list = [];
    var default_error_time = 3;
    ret_list_id = 0;
    quiz_list_id = 0;
    for(i=index;i<index+word_num_per_unit;i++){
        var unit_words = current_pass_data[i];
        ret_list.push([]);
        quiz_list = [];
        //console.log("unit-"+i,unit_words);
        $.each(unit_words,function(word,meaning){
            data = {};
            data[word] = meaning;
            ret_list[ret_list_id].push(data);
        });
        ret_list_id ++;
        console.log("ret_list",ret_list);
    }
    //ret_list = [[{},{},{}],[{},{},{}]]
    //now add some random practices
    for(i=index;i<index+word_num_per_unit;i++){
        var unit_words = current_pass_data[i];
        quiz_list.push([]);
        $.each(unit_words,function(word,meaning){
            data = {};
            data[word] = "[?word]" + meaning;

            quiz_list[quiz_list_id].push(data);
            data = {};
            data[word] = "[?meaning]" + meaning;
            quiz_list[quiz_list_id].push(data);
        });
        quiz_list_id ++;
    }
    for(i=0;i<quiz_list.length;i++){
            quiz_list[i] = quiz_list[i].sort(random_sort);
        }
    //quiz_list = [[{},{},{}],[{},{},{}]]
    console.log("quiz_list",quiz_list);
    
    //console.log("generate_unit_training_list",ret_list);
    return {"word_list":ret_list,"quiz_list":quiz_list};
}

get_training_data_for_one_list = function(list_id){
    var word_list = training_data['word_list'][list_id]; // [{},{},{}]
    var quiz_list = training_data['quiz_list'][list_id]; // [{},{},{}]
    return {"words":word_list,"quiz":quiz_list};
}

get_all_meanings = function(){
    // training_data must be provided first
    var all_meaning = [];
    var all_word_lists = training_data['word_list'];
    $.each(all_word_lists,function(id,word_list){
        $.each(word_list,function(word_id,word_map){
            var word_key = Object.keys(word_map)[0];
            var meaning = word_map[word_key];
            all_meaning.push(meaning);
        });
    });
    all_meaning = all_meaning.sort(random_sort);
    //console.log('get_all_meanings',all_meaning);
    return all_meaning;
}

get_word_and_meaning_in_list = function(list_id){
    var list_meaning = [];
    var list_word = [];
    var word_list = training_data['word_list'][list_id];
    $.each(word_list,function(word_id,word_map){
        var word_key = Object.keys(word_map)[0];
        var meaning = word_map[word_key];
        list_meaning.push(meaning);
        list_word.push(word_key);
    });
    return {"meanings":list_meaning,"words":list_word};
}

populate_dict_data = function(word,show_meaning=true){
    $("#word_pass_meaning_from_dict").hide();
    get_word_explanation(word).done(function(resp){
                console.log("word information is fetched!",resp);
                var resp_word = resp['word'];
                var definition_list = resp['defs'];
                var meaning_str = "";
                var meaning = "";
                $.each(definition_list,function(index,content){
                    var pos = content['pos'];
                    var def = content['def'];
                    meaning += (pos+""+def+";");
                    meaning_str += ("<span style='color:gray;margin-right:5px;'>["+pos+"]</span>" + def + "<br/>");
               });
                if($('#unit_pass_word').html().toLowerCase() != resp_word.toLowerCase()){
                    console.log(`get meaning from ${resp_word} but current word is ${$('#unit_pass_word').html().toLowerCase()}`);
                    return;
                }
                $("#word_pass_meaning_from_dict").html(meaning_str);
                var pronunciation_dict = resp['pronunciation'];
                var ame_src = pronunciation_dict['AmEmp3'];
                var bre_src = pronunciation_dict['BrEmp3'];
                //ame
                var html_ame = "<span style='font-size:12px;color:gray'>AmE</span><span onclick='play_sound(\"" + ame_src +"\")' style='margin-right:5px;font-size:14px'>&lt;" + pronunciation_dict['AmE'] + "&gt;</span>"
                var html_bre = "<span style='font-size:12px;color:gray'>BrE</span><span onclick='play_sound(\""+ bre_src +"\")' style='font-size:14px'>&lt;" + pronunciation_dict['BrE'] + "&gt;</span>";
                
                $("#unit_pass_pronounce").html(html_ame + html_bre);
            
                $("#unit_pass_pronounce").fadeIn("slow");
                if(show_meaning){
                    $("#word_pass_meaning_from_dict").fadeIn("slow");
                }
                else{
                    $("#word_pass_meaning_from_dict").hide();
                }
                /*
                $("#wordTranslate_ok").fadeIn("slow");
                $("#wordTranslate_ok").on("click",function(){
                    save_word(word,meaning);
                });
                */
    });
}

get_next_word_id = function(){
    var during = Cookies.get("during");
    if(during == "LEARNING")
    {
        current_word_start_id ++;
        update_learning_nav_status("Learn "+(current_word_start_id+1),true,true,true);
        if(current_word_start_id >= 10){
            current_word_start_id = 0;
            //during = QUIZ;
            Cookies.set("during","QUIZ");
            console.log("now change to quiz");
        }
    }
    else if(during == "QUIZ"){
        current_word_start_id ++;
        update_learning_nav_status("Quiz "+(current_word_start_id+1),false,false,false);
        if(current_word_start_id >= 20){
            current_word_start_id = 0;
            //during = LEARNING;
            Cookies.set("during","SUMMARY");
            console.log("now change to summary");
            // here i need to do review and prepare new list
            show_list_summary();
            current_word_start_id = 0;
        }
    }
    /*
    else if(during == "SUMMARY"){
        // here i need to do review and prepare new list
        
        Cookies.set("during","LEARNING");
        console.log("now change to learning");
        
    }
    */
    console.log("current_word_start_id=",current_word_start_id);
}


show_list_summary = function(){
    //find the wrong words
    let wrong_words = Object.keys(user_quiz_error);
    let content = '';
    $.each(wrong_words,function(index,word){
        content += `<li class="list-group-item list-group-item-danger">${word}</li>`;
    });
    let list_set = new Set(correct_word_in_list);
    correct_word_in_list = Array.from(list_set);
    $.each(correct_word_in_list,function(index,cword){
        content += `<li class="list-group-item list-group-item-success">${cword}</li>`;
    });
    
    
    $('#learning_list_for_review').html(content);
    //$('#learning_list_summary').fadeIn('slow');
    update_learning_nav_status("summary",true,false,true);
    
    
}

update_unit_learning_status = function(bookname,unit_num,list_num_in_unit){
    let data = Cookies.get('unit_learning_status');
    if(data == undefined)
    {
        data = {};
    }
    else{
        data = JSON.parse(data);
    }
    if(bookname){
        data['current_book'] = bookname;
    }
    else{
        data['current_book'] = 'SYS:GRE3000';
    }
    if(unit_num != undefined)
    {
        data['current_unit'] = unit_num;
    }
    if(list_num_in_unit != undefined)
    {
        data['current_list'] = list_num_in_unit;
    }
    Cookies.set('unit_learning_status',data);
    return data;
}

show_unit_pass_menu = function(){
    $("#word_pass_meaning_from_dict").hide();
    $("#meaning_questions").hide();
    $("#pass_question").hide();
    $("#unit_pass_menu").hide();
    $('#learning_list_summary').hide();
    
    if(!Cookies.get('unit_learning_status')){
        let unit_total_number = $('.pass_unit').length;
        for(let i=0;i<unit_total_number;i++){
            let unit_id = i+1;
            let progress_bar = $('#pass_unit_'+unit_id).children().find('.progress-bar');
            let lock_icon = $('#pass_unit_'+unit_id).children().find('.lock_status');
            if(i==0){
                lock_icon.addClass('fa-lock-open');
                lock_icon.removeClass('fa-lock'); 
            }
            else{
                lock_icon.removeClass('fa-lock-open');
                lock_icon.addClass('fa-lock'); //add lock
            }
            progress_bar.css('width',"0%");
            progress_bar.attr('aria-valuenow',"0");
        }
        
        $('#unit_pass_menu').fadeIn('slow');
        console.log('unit_learning_status not found');
        return;
    }
    let data = JSON.parse(Cookies.get('unit_learning_status'));
    //change ui
    let current_unit = data['current_unit'];//starts from 1
    if(current_unit == undefined || current_unit <1)
    {
        current_unit = 1;
        data  = update_unit_learning_status('',current_unit,undefined);
    }
    let current_list = data['current_list'];
    if(current_list == undefined){
        current_list = 0;
        data = update_unit_learning_status('',undefined,current_list);
        
    }
    console.log('current_list',current_list);
    let unit_total_number = $('.pass_unit').length;
    for(let i=0;i<unit_total_number;i++){
        let unit_id = i+1;
        if(unit_id<current_unit){
            let progress_bar = $('#pass_unit_'+unit_id).children().find('.progress-bar');
            progress_bar.css('width',"100%");
            progress_bar.attr('aria-valuenow',"100");
            let lock_icon = $('#pass_unit_'+unit_id).children().find('.lock_status');

            lock_icon.addClass('fa-lock-open');
            lock_icon.removeClass('fa-lock'); 
            
        }
        else if(unit_id == current_unit){
            let progress_bar = $('#pass_unit_'+unit_id).children().find('.progress-bar');
            let progress_num = Math.floor((current_list) / 5.0 * 100.0); //todo- may not be 5.0
            progress_bar.css('width',progress_num+"%");
            progress_bar.attr('aria-valuenow',""+progress_num);
            let lock_icon = $('#pass_unit_'+unit_id).children().find('.lock_status');
            lock_icon.addClass('fa-lock-open');
            lock_icon.removeClass('fa-lock'); 
        }
        else{
            let progress_bar = $('#pass_unit_'+unit_id).children().find('.progress-bar');
            progress_bar.css('width',"0%");
            progress_bar.attr('aria-valuenow',"0");
            let lock_icon = $('#pass_unit_'+unit_id).children().find('.lock_status');
            lock_icon.removeClass('fa-lock-open');
            lock_icon.addClass('fa-lock'); 
        }
    }
    $('#unit_pass_menu').fadeIn('slow');
}


get_list_index_in_unit = function(unit_learning_status){
    if(view_history_card){
        return list_index_in_history_card;
    }
    else{
        return unit_learning_status['current_list'];
    }
}


show_pass_training = function(){
    
    
    let unit_learning_status = JSON.parse(Cookies.get('unit_learning_status'));
    if(users_latest_unit > unit_learning_status['current_unit']){
        // you cannot access that
        console.log('users_latest_unit',users_latest_unit);
        console.log('unit_learning_status[current_unit]',unit_learning_status['current_unit']);
        console.log("cannot access");
        return;
    }
    else if(users_latest_unit == unit_learning_status['current_unit']){
        console.log('view current unit');
        view_history_card = false;
    }
    else{
        console.log('view history history');
        view_history_card = true;
    }
    
    
    var during = Cookies.get("during");
    //let list_index_in_unit = parseInt(Cookies.get("list_index_in_unit")); // list index in current unit
    
    //let list_index_in_unit = unit_learning_status['current_list'];
    let list_index_in_unit = get_list_index_in_unit(unit_learning_status);
    console.log('list_index_in_unit',list_index_in_unit);
    $("#word_pass_meaning_from_dict").hide();
    $("#meaning_questions").hide();
    $("#pass_question").hide();
    $("#unit_pass_menu").hide();
    $('#learning_list_summary').hide();
    
    $(".pass_item").removeClass("active");
    $(".pass_item").removeClass("list-group-item-danger");
    $(".pass_item").removeClass("list-group-item-success");
    
    
    if(list_index_in_unit<0){
        // this unit is completed
        console.log("this unit is completed");
        //let book_used = Cookies.get('chosen_book_file');
        let book_used = 'SYS:GRE3000';
        update_unit_learning_status('',users_latest_unit+1,0);
        // show unit selection view
        //$('#unit_pass_menu').fadeIn('slow');
        show_unit_pass_menu();
        //Cookies.set("list_index_in_unit",0);
        
        return;
    }
    
    
    if(during == "LEARNING"){
        console.log("show_pass_training in learning");
        if(current_word_start_id == 0){
            update_learning_nav_status("Learn 1",true,false,true);
        }
        var index = (users_latest_unit - 1) * 5;
        var word_id = current_word_start_id;
        $("#pass_question").hide();
        $("#unit_pass_menu").hide();
        $("#unit_pass_pronounce").hide();
        //current_word_id = 0;
        // get the list id
        if(!training_data){
            training_data = generate_unit_training_list(index); // set to global var
            all_meanings = get_all_meanings();
        }
        var first_word_list = get_training_data_for_one_list(list_index_in_unit); //first_word_list = words:[{},{},{}],quiz:[{},{}]
        console.log('first_word_list',first_word_list);
        var first_word = (Object.keys(first_word_list["words"][word_id]))[current_unit_id];
        var first_meaning = first_word_list["words"][word_id][first_word];
        console.log("first_word_list['words']["+word_id+"]=",first_word_list["words"][word_id]);
        console.log("show-pass",first_word,first_meaning);
        word_in_progress = first_word;
        $("#word_pass_meaning_from_dict").hide();

        $("#unit_pass_word").html(first_word);
        $("#unit_pass_main_exp").html(first_meaning);
        //$('#unit_pass_train').animateCss('fadeInRight');
        if( $("#unit_pass_main_exp").is(':hidden') ){
            $("#unit_pass_main_exp").show();
        }
        $("#unit_pass_train").fadeIn("slow");
        $("#word_pass_meaning_from_dict").fadeIn("slow");

        // use api
        populate_dict_data(first_word);
    }
    else if(during == "QUIZ"){
        if(current_word_start_id == 0){
            update_learning_nav_status("Quiz 1",false,false,false);
        }
        var word_id = current_word_start_id;
        console.log("show_pass_training in quiz");
        console.log("now start quiz of",current_word_start_id);
        var first_word_list = get_training_data_for_one_list(list_index_in_unit);
        var first_word = (Object.keys(first_word_list["quiz"][word_id]))[current_unit_id];
        var first_meaning = first_word_list["quiz"][word_id][first_word];
        console.log("first_word_list['words']["+word_id+"]=",first_word_list["words"][word_id]);
        console.log("show-quiz",first_word,first_meaning);
        $("#word_pass_meaning_from_dict").hide();
        $("#unit_pass_train").hide();
        word_in_progress = first_word;
    

        //$("#unit_pass_word").html(first_word);
        //$("#unit_pass_main_exp").html(first_meaning);
        $("#unit_pass_main_exp").hide();
        if(first_meaning.startsWith('[?word]')){
            // test the word
            //$("#unit_pass_word").html(first_word);
            var data = get_word_and_meaning_in_list(current_unit_id);
            var meanings = data['meanings'];
            var words = data['words'];
            meanings = meanings.sort(random_sort);
            words = words.sort(random_sort);
            
            
            
            
            $("#pass_question_word").html(first_meaning.replace("[?word]",""));
            $("#pass_question_word").css("font-size","20px");
            $("#pass_question").fadeIn("slow");
            
            var word_choices = [];

            word_choices.push(first_word); // add the correct one
            var index = 0;
            //console.log("all_meanings=",all_meanings);
            while(word_choices.length < 4){
                var bad_word = words[index];
                console.log("confusion word added:",bad_word);
                if(bad_word.trim() != first_word){
                    word_choices.push(bad_word);
                }
                index ++;
            }
            word_choices = word_choices.sort(random_sort);
            for(var i=0;i<word_choices.length;i++){
                $("#meaning_"+(i+1)+"_btn").html(word_choices[i]);
                if(word_choices[i] == first_word){
                    $("#meaning_"+(i+1)+"_btn").parent().attr("answer","yes");
                }
                else{
                    $("#meaning_"+(i+1)+"_btn").parent().attr("answer","no");
                }
            }
            $("#meaning_questions").fadeIn("slow");
        }
        else if(first_meaning.startsWith('[?meaning]')){
            // test the meaning
            $("#pass_question_word").html(first_word);
            $("#pass_question_word").css("font-size","40px");
            $("#pass_question").fadeIn("slow");
            all_meanings = all_meanings.sort(random_sort);
            
            var meaning_choices = [];
            var real_meaning = first_meaning.replace("[?meaning]","")
            meaning_choices.push(real_meaning);
            var index = 0;
            console.log("all_meanings=",all_meanings);
            while(meaning_choices.length < 4){
                var meaning = all_meanings[index];
                console.log("confusion meaning added:",meaning);
                if(meaning.trim() != real_meaning){
                    meaning_choices.push(meaning);
                }
                index ++;
            }
            meaning_choices = meaning_choices.sort(random_sort);
            for(var i=0;i<meaning_choices.length;i++){
                $("#meaning_"+(i+1)+"_btn").html(meaning_choices[i]);
                if(meaning_choices[i] == real_meaning){
                    $("#meaning_"+(i+1)+"_btn").parent().attr("answer","yes");
                }
                else{
                    $("#meaning_"+(i+1)+"_btn").parent().attr("answer","no");
                }
            }
            $("#meaning_questions").fadeIn("slow");
        }
        //$('#unit_pass_train').animateCss('fadeInRight');

        



        // use api
        //populate_dict_data(first_word);
    }else if(during == "SUMMARY"){
        $('#learning_list_summary').fadeIn('slow');
    }
    
}


$("#unit_pass_train").swipe( {
    //Generic swipe handler for all directions
    swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
        console.log("You swiped " + direction );
        if(current_word_start_id == undefined){
            current_word_start_id = 0;
        }
        switch(direction){
                case "left":
                    //next
                    //$("#unit_pass_train").fadeOut("slow");
                    //$('#unit_pass_train').addClass('animated fadeOutLeft');
                    update_learning_nav_status("$keep","$keep","$keep",false);
                    go_to_next_learning_word();
                    break;
                    
                case "right":
                    //back
                    console.log("back to last");
                    break;
                case "up":
                    //do not show this
                    break;
        }
    }
});



go_to_next_learning_word = function(){
    //update_learning_nav_status("$keep","$keep","$keep",false);
    var during = Cookies.get("during");
    if(during == 'LEARNING'){
        $('#unit_pass_train').animateCss('fadeOutLeft', function() {
            // Do something after animation
            get_next_word_id();
            show_pass_training();
            //update_learning_nav_status("$keep",true,true,true);
        });
    }
    else if(during == 'QUIZ'){
        var correct_option = undefined;
        $('.pass_item').each(function(id,obj){
            let correct = $(obj).attr("answer");
            if(correct.trim() == 'yes'){
                correct_option = obj;
            }
        });
        $(correct_option).click();
    }
    else if(during == 'SUMMARY'){
        //go to next list
        get_next_word_id();
        get_next_word_list_in_current_unit();
        Cookies.set("during","LEARNING");
        show_pass_training();
    }
    save_current_unit_progress();
}


get_next_word_list_in_current_unit = function(){

    let unit_learning_status = JSON.parse(Cookies.get('unit_learning_status'));
    if(view_history_card){
        list_index_in_history_card ++;
        if(list_index_in_history_card < training_data['word_list'].length){
            console.log('[history card]update list index to',list_index_in_history_card);
        }
        else{
            list_index_in_history_card = -1;
            console.log('[history card]update list index to',-1);
        }
        return;
    }
    let list_index_in_unit = unit_learning_status['current_list'];
    list_index_in_unit ++;
    if(list_index_in_unit < training_data['word_list'].length){//<5
        update_unit_learning_status('',undefined,list_index_in_unit);
        console.log('update list index to',list_index_in_unit);
        //Cookies.set("list_index_in_unit",list_index_in_unit);
    }
    else{
        update_unit_learning_status('',undefined,-1);
        console.log('update list index to',-1);
        //Cookies.set("list_index_in_unit",-1);
    }
}



retrieve_current_unit_words = function(unit_id){
    var trying = setInterval(
    get_unit_data(unit_id).done(function(data){
        clearInterval(trying);
        console.log("retrieve_current_unit_words",data);
        //result = $("#pass_unit_" + (unit_id+1)+" input").val();
        //Cookies.set("pass_training_data",data);
        current_pass_data = data;
        //current_word_start_id = unit_id*word_num_per_unit;
        current_word_start_id = 0;
        show_pass_training();
    }).fail(function(err){
        console.log("trying",err);
    }),1000);
}





on_word_pass_ready = function(){
    console.log("word pass ready");
    init_remote_call();
    //$("#unit_pass_train").hide();
    //$("#unit_pass_menu").hide();
    //$("#unit_pass_train").fadeIn("slow");
}


$(".pass_unit").on("click",function(event){
    console.log("clicked",event.target);
    list_index_in_history_card = 0;
    training_data = undefined;
    let chosen_unit = $(event.target).parent().closest(".col-lg-4").attr("id");
    chosen_unit = parseInt(chosen_unit.replace("pass_unit_",""));
    console.log("chosen=",chosen_unit);
    retrieve_current_unit_words(chosen_unit-1);
    if(!Cookies.get('unit_learning_status')){
        update_unit_learning_status('',1,0);
    }
    let unit_learning_status = JSON.parse(Cookies.get('unit_learning_status'));
    if(chosen_unit > unit_learning_status['current_unit']){
        // you cannot access that
        users_latest_unit = chosen_unit;
        console.log("cannot access");
        //bounce
        let lock_icon = $('#pass_unit_'+chosen_unit).children().find('.lock_status');
        lock_icon.animateCss('flash');
        console.log('lock_icon',lock_icon);
        return;
    }
    //current_unit_id = chosen_unit;
    users_latest_unit = chosen_unit;
    update_learning_nav_status("Unit " + chosen_unit,true,false,true);
    correct_word_in_list = [];
    user_quiz_error = {};
    //show_practice_nav_bar();
    //console.log("parent=",$('#word_pass_doc_body').parent().parent());
});

$(".pass_item").on("click",function(event){
    $(".pass_item").removeClass("active");
    $(".pass_item").removeClass("list-group-item-danger");
    $(".pass_item").removeClass("list-group-item-success");
    
    //$(event.target).addClass("active");
    if($(event.target).attr('answer'))
    {
        var correct = $(event.target).attr("answer");    
    }
    else{
        var correct = $(event.target).parent().attr('answer');
    }
    
    console.log("correct?"+correct);
    console.log('event.target=',event.target);
    if(correct == "yes"){
        console.log("you are right");
        //$(event.target).addClass("active");
        if($(event.target).hasClass("pass_item")){
            $(event.target).addClass("list-group-item-success");
        }
        else{
            $(event.target).parent().addClass("list-group-item-success");
        }
        update_learning_nav_status('$keep',false,false,false);
        setTimeout(function(){
            //add a combo hit
            get_next_word_id();
            show_pass_training();
            $(".pass_item").removeClass("active");
            $(".pass_item").removeClass("list-group-item-danger");
            $(".pass_item").removeClass("list-group-item-success");
        },1500);
        
        correct_word_in_list.push(word_in_progress);
    }
    else if(correct == "no"){
        console.log("you are wrong");
        
        
        update_learning_nav_status('$keep',true,false,true);
        
        $('.pass_item').each(function(id,obj){
            let correct = $(obj).attr("answer");
            console.log("correct=",correct);
            if(correct.trim() == 'yes'){
                $(obj).addClass('list-group-item-success');
                console.log('add success');
            }
        });
        if($(event.target).hasClass("pass_item")){
            $(event.target).addClass("list-group-item-danger");
        }
        else{
            $(event.target).parent().addClass("list-group-item-danger");
        }
        
        var current_word = word_in_progress;
        if(!((Object.keys(user_quiz_error)).includes(current_word))){
            user_quiz_error[current_word] = [];
        }
        let content = $(event.target).html();
        if(content.trim() == current_word){
            // grap the meaning elsewhere
            let error_meaning = $("#pass_question_word").html();
            user_quiz_error[current_word].push(error_meaning);
        }
        else if($("#pass_question_word").html().trim() == current_word){
            let error_meaning = '';
            if($(event.target).hasClass('pass_item')){
                error_meaning = $(event.target).closest('.opt_word').html();
            }
            else if($(event.target).hasClass('opt_word'))
            {
                error_meaning = $(event.target).html();    
            }
            else if($(event.target).hasClass('badge')){
                error_meaning = $(event.target).parent().closest('.opt_word').html();
            }
            if(last_record_mistake_word != current_word){
                user_quiz_error[current_word].push(error_meaning);
                last_record_mistake_word = current_word;
            }
        }
        //user_quiz_error[current_word].push();
        // i need to know what type of question currently is
        
        var data = get_word_and_meaning_in_list(current_unit_id);
        var meanings = data['meanings'];
        var words = data['words'];
        meanings = meanings.sort(random_sort);
        words = words.sort(random_sort);
        console.log('user_quiz_error=',user_quiz_error);
        
        
    }
});

$('#word_pass_doc_body').keyup(function(e) {
    console.log("keyup in unit pass",e.key);
    let during = Cookies.get('during');
    if($("#learning_nav_btn1").is(':visible') || during == 'LEARNING'){
        if(e.key == 'j'){
            //go back
            console.log("go to last word");
        }
        else if(e.key == 'k'){
            go_to_next_learning_word();
        }
    }
    else if($("#meaning_1_btn").is(":visible") && during == 'QUIZ'){
        if(e.key == 'j' || e.key == '1'){
            $('#meaning_1_btn').click();
        }
        else if(e.key == 'k' || e.key == '2'){
            $('#meaning_2_btn').click();
        }
        else if(e.key == 'l' || e.key == '3'){
            $('#meaning_3_btn').click();
        }
        else if(e.key == ';' || e.key == '4'){
            $('#meaning_4_btn').click();
        }
    }
});


save_current_unit_progress = function(){
    /*
    let book_used = 'SYS:GRE3000';
    let list_index_in_unit = JSON.parse(Cookies.get("list_index_in_unit"));
    update_unit_learning_status(book_used,users_latest_unit,list_index_in_unit);
    console.log('progress saved locally');
    */
}



listen({
    'go_to_next_learning_word':go_to_next_learning_word,
    'save_current_unit_progress':save_current_unit_progress,
    'show_unit_pass_menu':show_unit_pass_menu
});


