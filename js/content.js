  
  function getWebsite(u){
      url = document.location.href;
      for (var i in websites){
          if (url.toLowerCase().indexOf(websites[i][0].toLowerCase())===0){
              return websites[i];
          }
      }            
  }
  
  function addButton(){
      site = getWebsite();
      if (site){
          site[1]();
          if (DEBUG) console.log("button added");
      }     
  }
  
  function fillToken(l, t){
      site = getWebsite();
      if (site){
          if (DEBUG) console.log("token filled");
          site[2](l, t);
      }     
  }
  
    function clickcb(e) { 
        if (DEBUG) console.log(e);
        chrome.storage.sync.get({login:"", activation_key:"", token_index:""},
        function(o) {
            if (o.login == "" || o.activation_key == "" || o.token_index == "") {
                if (DEBUG) console.log("wtf");
                alert("Check the options !");
            }else if (!checkLogin(o.login)){
                if (DEBUG) console.log("wtf login");
            }else if (!checkKey(o.activation_key)){
                if (DEBUG) console.log("wtf activation_key");
            }else if (!checkIndex(o.token_index)){
                if (DEBUG) console.log("wtf token_index");
            }else{
                fillToken(o.login, generate_mobilepass_token(o.activation_key, o.token_index));
                chrome.storage.sync.set({ token_index:parseInt(o.token_index)+1 },
                    function() {
                        if (chrome.runtime.error) {
                            if (DEBUG) console.log("Enable to update token index");
                        }else{
                            if (DEBUG) console.log("tokenIndex updated");
                        }
                    }
                );
            }
            e.target.parentNode.removeChild(e.target);
        });
    };
  
  if (DEBUG) console.log("start");
  addButton();
  