
function save_options() {
  if (DEBUG) console.log("save");
  var log = document.getElementById('login').value;
  var key = document.getElementById('activation_key').value;
  var index = document.getElementById('token_index').value;
  
  if (!checkLogin(log)){
    document.getElementById('login').setAttribute("style", "width:100%; border-color:#ff0000;");  
  }else{
      chrome.storage.sync.set({login: log}, function(){ document.getElementById('login').setAttribute("style", "width:100%; border-color:#00ff00;"); });  
  }
  
  if (!checkKey(key)){
      document.getElementById('activation_key').setAttribute("style", "width:100%; border-color:#ff0000;");  
  }else{
      chrome.storage.sync.set({activation_key: key}, function(){ document.getElementById('activation_key').setAttribute("style", "width:100%; border-color:#00ff00;"); });  
  }

  if (!checkIndex(index)){
    document.getElementById('token_index').setAttribute("style", "width:100%; border-color:#ff0000;"); 
  }else{
      chrome.storage.sync.set({token_index: index}, function(){ document.getElementById('token_index').setAttribute("style", "width:100%; border-color:#00ff00;"); });  
  }
  
  setTimeout(function() {
      document.getElementById('activation_key').setAttribute("style", "width:100%;");
      document.getElementById('token_index').setAttribute("style", "width:100%;");
      document.getElementById('login').setAttribute("style", "width:100%;");
    }, 500);
}

function restore_options() {
  if (DEBUG) console.log("restore");
  chrome.storage.sync.get({activation_key:"", login:"", token_index:""},
  function(items) {
    document.getElementById('activation_key').value = items.activation_key;
    document.getElementById('token_index').value = items.token_index;
    document.getElementById('login').value = items.login;
  });
}

function get_my_token(){
    var i=0;
    var curr = document.getElementById('curr_token_index').value;
    var activ = document.getElementById('activation_key').value;
       
    if (curr != "" && activ != ""){   
    for (i=0; i<5000; i++){
        if (generate_mobilepass_token(activ, i) === curr) break;
    }
    }else{
        i = 5000;
    }
    if (i==5000){
        i = "";
        document.getElementById('curr_token_index').setAttribute("style", "width:100%; border-color:#ff0000;");
        document.getElementById('activation_key').setAttribute("style", "width:100%; border-color:#ED7F10;");
    }
    else {
        document.getElementById('token_index').setAttribute("style", "width:100%; border-color:#00ff00;");
    }
    document.getElementById('token_index').value = i;
    setTimeout(function() {
      document.getElementById('curr_token_index').setAttribute("style", "width:100%;");
      document.getElementById('activation_key').setAttribute("style", "width:100%;");
      document.getElementById('token_index').setAttribute("style", "width:100%;");
    }, 500);
}

function next_token(){
    if (checkIndex(document.getElementById('token_index').value)){
        document.getElementById('token_index').value = parseInt(document.getElementById('token_index').value) + 1;
    }
    if (DEBUG) console.log("next");
}

function get_token(){
    var tok = document.getElementById('token_index').value;
    var activ = document.getElementById('activation_key').value;
    if (checkKey(activ) && checkIndex(tok)){
        document.getElementById('gen_token').textContent = generate_mobilepass_token(activ, tok);
        document.getElementById('gen_token').style.borderColor = "#cccccc";
        document.getElementById('token_index').value = parseInt(tok)+1;
        chrome.storage.sync.set({ token_index:parseInt(tok)+1 },
            function() {
                if (chrome.runtime.error) {
                    if (DEBUG) console.log("Enable to update token index");
                }else{
                    if (DEBUG) console.log("tokenIndex updated");
                }
            }
        );
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(function() {
          document.getElementById('gen_token').style.borderColor = "#ffffff";
          document.getElementById('gen_token').textContent = "";
        }, 5000);
    }
    if (DEBUG) console.log("get token");
}

timeout = null;

if (DEBUG) console.log("options start");
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('getmytoken').addEventListener('click', get_my_token);
document.getElementById('next').addEventListener('click', next_token);
document.getElementById('get_token').addEventListener('click', get_token);
document.getElementById('clear').addEventListener('click', function(){
    document.getElementById('activation_key').value = "";
    document.getElementById('token_index').value = "";
    document.getElementById('login').value = "";   
});

