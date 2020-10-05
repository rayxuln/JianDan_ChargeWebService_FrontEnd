

export default {
    getCookie: function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i=0; i<ca.length; i++) {
            var c = ca[i].trim();
            if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
        }
        return "";
      },
    setCookie: function(cname, value, expirehours){
        var exdate=new Date();
        exdate.setHours(exdate.getHours() + expirehours);
        document.cookie=cname+ "=" + escape(value) + ((expirehours==null) ? "" : ";expires="+exdate.toGMTString()) + ";path=/";
    },
    deleteCookie: function(cname){
        this.setCookie(cname, "", -1)
    },
    // convert "2020-9" to "2020/9"
    stringToDate: function(string_date){
        let date = new Date(Date.parse(string_date.replace(/-/g, "/")))
        console.log(date)
        return date
    },
    // Input: "2020-9"
    calcAgeFromBirth: function(string_date){
        let date = this.stringToDate(string_date)
        let current_date = new Date()
        return parseInt(current_date.getFullYear()) - parseInt(date.getFullYear())
    },
    logoutAndJumpToLoginPage: function(that){
        that.$store.commit("logout")
        this.deleteCookie("token")
        that.$router.push({name: "Login"})
    }
}


