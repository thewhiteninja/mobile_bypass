  var websites = [
    ["https://site/CookieAuth.dll?GetLogon", function(){
      buttonOrig = document.getElementById("SubmitCreds");
      button = buttonOrig.cloneNode();
      button.innerHTML = buttonOrig.innerHTML;
      setProp(button);   
      buttonOrig.parentNode.appendChild(button);  
    }, function(l, t){
      document.getElementById("username").value = l;
      document.getElementById("passcode").value = t;        
    }],
  ["https://site/Authent/authent_form.asp", function(){
      buttonOrig = document.getElementsByName("Imagefield")[0];
      button = buttonOrig.cloneNode();
      button.innerHTML=document.getElementsByName("Imagefield")[0].innerHTML;
      setProp(button, true); 
      buttonOrig.parentNode.insertBefore(button, buttonOrig.nextSibling);  
    }, function(l, t){
      document.getElementsByName("cookie_user_name")[0].value = l;
      document.getElementsByName("cookie_user_password")[0].value = t;        
    }],
  ["https://site/opensso/UI/Login?service", function(){
      buttonOrig = document.getElementsByName("Login.Submit")[0];
      var button = document.createElement("input");
      setProp(button, true);
      button.value = " " + button.value + " ";
      button.className = "Btn1Def";
      button.onmouseover = function(){ this.className='Btn1DefHov'; };
      button.onmouseout = function(){ this.className='Btn1Def'; };
      buttonOrig.parentNode.insertBefore(button, buttonOrig.nextSibling);  
    }, function(l, t){
      document.getElementById("IDToken1").value = l;
      document.getElementById("IDToken2").value = t;        
    }]
  ];
  
  function setProp(b, margin){
      b.id = "FillToken";
      b.name = "FillToken";
      b.value = "Fill token";
      if (margin) b.style["margin-left"] = "10px";
      b.type = "button"; 
      b.onclick = clickcb;     
  }
