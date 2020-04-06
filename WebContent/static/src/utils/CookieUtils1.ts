class CookieUtils{

    /***************************************
    # write var to cookie
    ***************************************/
    public static setCookie(name:string, value:string) {
        document.cookie = name + "=" + value;
    }
    
    /***************************************
    # delete cookie
    ***************************************/
    public static deleteCookie(name:string) {
        var d = new Date();
        d.setTime(d.getTime() - (24*60*60*1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = name + "=; " + expires;	
    } 
    
    /***************************************
    # load cookie
    ***************************************/
    public static getCookie(name:string) : string {
        var cName = name + "=";
        
        //alert("cookie: " + document.cookie);
        
        // get all cookies
        var cookieArray = document.cookie.split(';');
        
        // loop all cookies
        for(var i=0; i<cookieArray.length; i++) {
            var cookie = cookieArray[i];
            // leerzeichen wegschneiden
            while (cookie.charAt(0)==' ') cookie = cookie.substring(1);
            // prüfen ob das cookie gefuden wurde und returnen
            if (cookie.indexOf(cName) == 0) return cookie.substring(cName.length, cookie.length);
        }
        return "";
    } 

}



