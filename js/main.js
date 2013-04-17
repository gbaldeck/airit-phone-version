window.ether = 1;
(function() {

$.ajaxSetup({timeout:5000});

if( localStorage.getItem('loggedIn') != 'false' ){
    window.ether = localStorage.getItem('loggedIn');
}

window.App = {
	Models: {},
	Collections: {},
	Views: {},
    Vars: {},
	Router: {}
};

App.Models.LoginStatus = Backbone.Model.extend({

    defaults: {
        loggedIn: 'false',
        username: '',
        pass: '',
        page: 'campus',
        valid: 'false',
        offline: 'off',
        utils: 'utils',
        camps: 'camp',
		ether: '0'
    },

    initialize: function () {
        //this.on( 'change:valid', this.userValidate, this );
        this.set({'loggedIn': localStorage.getItem('loggedIn')});
        this.set({'username': localStorage.getItem('username')});
        this.set({'pass': localStorage.getItem('pass')}); 
		this.on( 'change:ether', this.refetch, this );
        
        if(localStorage.getItem('camps') == null){
            this.set({'camps': 'camp'});
        }else{
            this.set({'camps': localStorage.getItem('camps')});
        }
        
        if(localStorage.getItem('utils') == null){
            this.set({'utils': 'utils'});
        }else{
            this.set({'utils': localStorage.getItem('utils')});
        }
        
        var self = this;
	/*this.fetch({ 
                    data: $.param({ nm: this.get('username'), ps: this.get('pass') }) 
                  }).complete(function(){
                    self.userValidate(self);
                  });
        */
       
       if( this.get('username') != '' && this.get('username') != null ){ 
            if( window.ether > 0 ){ 
                this.fetch({ 
                    data: $.param({ nm: this.get('username'), ps: this.get('pass') }) 
                }).complete(function(){
                    self.userValidate(self);
                });
            }else{
                if( this.get('loggedIn') == "true" ){
                    window.setTimeout(function() {
                        //$('.goOffline').click();
                        window.appi.app.offline();
                    }, 10);
                    
                }
            }
       }else{
            localStorage.setItem('loggedIn', 'false');
            this.set({'loggedIn': 'false' });
       }
        
    },
	
	refetch: function( username, pass ) {
        
        var self = this;
        
        if( this.get('username') != '' && this.get('username') != null ){ 
            if( window.ether > 0 ){ 
                v.getColl( self.get('username'), self.get('pass') );
            }
       }
    },

    setUser: function( username, pass ) {
        
        if( localStorage.getItem('loggedIn') != 'false' ){
            this.set({'loggedIn': localStorage.getItem('loggedIn')});
        }
        localStorage.setItem('username', username)
        this.set({'username': username});
        localStorage.setItem('pass', pass)
        this.set({'pass': pass});
        
        var self = this;
        
        $('.loaderLogin').removeClass('hid');
        
        console.log(window.ether);
        
        
        if( this.get('username') != '' && this.get('username') != null ){ 
            if( window.ether > 0 ){
                this.fetch({ 
                    data: $.param({ nm: this.get('username'), ps: this.get('pass') }) 
                }).complete(function(){
                    self.userValidate(self);
                });
            }else{
                if( this.get('loggedIn') == "true" ){
                   appi.app.offline();
                   appi.app.render();
                   appi.app.campus.render(); 
                   $('.loader').addClass('hid');
                   
                }
            }
       }else{
            $('.loaderLogin').addClass('hid');
            $('.response').removeClass('hid');
            localStorage.setItem('loggedIn', 'false');
            this.set({'loggedIn': 'false' });
       }
        
        /*
        this.fetch({ 
            data: $.param({ nm: username, ps: pass }) 
        }).complete(function(){
            //self.userValidate(self);
            $('.response').removeClass('hid');
            $('.loaderLogin').addClass('hid');
            
            if( self.get('loggedIn') == "true" ){
                
                //Login from OFFLINE ADD HERE
                self.set({'offline': 'on'});
                       
            }
            
            //self.set({'loggedIn': 'false' });
        });
        /*this.fetch({ data: $.param({ nm: username, ps: pass }), success: function() {
                $('.loaderLogin').addClass('hid');
        }});*/
        
    },
    	
    userValidate: function( username, pass ) {
        if( this.get('valid') == "Success" ){
            localStorage.setItem('loggedIn', 'true')
            this.set({'loggedIn': 'true' });
            v.getColl( this.get('username'), this.get('pass') );
			appi.app.render();
            
        }else{
            localStorage.setItem('loggedIn', 'false')
            this.set({'loggedIn': 'false' });
            appi.navigate('', true);
            appi.app.render();
            $('.response').removeClass('hid');
        }
    },
    
    url: function() {
        if(window.pwloc){
            return window.pwloc+"PWmeter/checkBB.jsp";
        }else{
            return "../checkBB.jsp";
        }
    },
	
    clearLogin: function() {      
        this.set(this.defaults);
    }

});

App.Views.AppView = Backbone.View.extend({

    _loggedInTemplate: _.template($('#logged_in').html()),
    _notLoggedInTemplate: _.template($('#not_logged_in').html()),

    initialize: function () {
        //this.model.bind('change:loggedIn', this.render, this);
        this.model.bind('change:valid', this.render, this);
        this.model.bind('change:page', this.renderNav, this);
        this.model.bind('change:offline', this.offlineInit, this);
    },

    events: {
        'submit .login': 'onLoginSubmit',
	'click a.logout': 'logout',
        'click .changeutil': 'changeutil',
        'click .sett': 'sett',
        'click .goOffline': 'offline',
        'click select':'propigate',
        'submit .meterInput': 'woops',
		'click #sendM': 'sendM',
        'click #updateM': 'updateM',
        'click .sync': 'syncUp',
        'click .sortM': 'sortM',
        'click .changecamps': 'changecamps',
		'click .noSubmit': 'noSubmit',
        'click .yesSubmit': 'yesSubmit',
		'click #subM.sendMe': 'onMeterSubmit',
        'click #subM.updateMe': 'onMeterUpdate',
		'click .closestat': 'syncstat'
    },
	
	sendM: function(e) {
        e.preventDefault();
        $(".inputCont").removeClass('hid');
        $(".date").removeClass('hid');
        $("#subM").removeClass('hid');
        $("#subM").removeClass('updateMe');
        $("#subM").addClass('sendMe');
		$("#subM").attr('value','SUBMIT ADD');
        $("#subM").css('background','#7f354a');
    },
    
    updateM: function(e) {
        e.preventDefault();
        $(".inputCont").removeClass('hid');
        $(".date").addClass('hid');
        $("#subM").removeClass('hid');
        $("#subM").removeClass('sendMe');
        $("#subM").addClass('updateMe');
		$("#subM").attr('value','SUBMIT UPDATE');
        $("#subM").css('background','#015486');
    },
	
	woops: function(e) {
        e.preventDefault();
    },
	
	noSubmit: function() {
        $("#result").text('');
    },
    
    sortM: function(){
        if( $('.sortM').hasClass('abc') ){
            $('.sortM').removeClass('abc');
            $('.sortM span').text('Sort By ABC');
            this.meters.collection.models = this.meters.collection.sortBy(
                function(model){
                        return model.cid;
                });
            this.meters.render();
        }else{
            $('.sortM').addClass('abc');
            $('.sortM span').text('Sort By Sequence Number');
            this.meters.collection.models = this.meters.collection.sortBy("name");
            this.meters.render();
        }
    },
	
	syncstat: function(){
        if( $('.syncstat').hasClass('hid') ){
            $('.syncstat').removeClass('hid');
        }else{
            $('.syncstat').addClass('hid');
            $('#result').html('');
        }
    },
    
    syncUp: function(){
        console.log('sync');
        $('.syncstat').removeClass('hid');
        var str=appi.app.offstorage;
        str = str.substring(1);
        var arr=str.split("~");
        
        $.ajaxSetup ({  
            cache: false  
        });  
        var ajax_load = "<img class='hid loader' src='imgs/loader.gif' alt='loading...' />"; 
        var newLoadUrl;
        
        if(appi.app.offstorage != ""){
            var errors = 0;
            var vari = new Array(); 
            var errvars = "";
            var county = -1;
            for( var i = 0; i < arr.length; i++ ){
                //this.fetch();
                if(window.pwloc){
                    newLoadUrl = window.pwloc+"PWmeter/sendReadBB.jsp?"+arr[i]+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
                }
                else{
                    newLoadUrl = "../sendReadBB.jsp?"+arr[i]+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
                }
                var ii = i;
                var ss = arr.length;
                vari[i] = arr[i];

                $("#result").html(ajax_load).load(newLoadUrl, function(response, status, xhr) {
                    county=county+1;
                    if( response.indexOf("<div class='response red'>Failed</div>") != -1 ){
                        errors = errors+1; 
                        errvars = errvars+"~"+vari[county];
                        console.log(county+" "+errvars);
                    }if(ii == arr.length-1){
                        
                        $('body .syncstat').html("<span class='closestat'>Close Status Page</span><span class='title'>Syncing Status</span><span class='green'>Successful Syncs: "+(ss-errors)+"</span><span class='red'>Errors: "+errors+"</span><span class='errlist'></span>");      
                        var temp1=errvars.split("~");
                        var str1 = "<li>Failed Readings:</li>";
                        for( var j = 1; j < temp1.length; j++ ){
                            str1 = str1+"<li>Meter: "+temp1[j].substr(temp1[j].indexOf("mNum=",0)+5)+"  |  Reading:"+
                                temp1[j].substr( temp1[j].indexOf("read=",0)+5, temp1[j].indexOf("&readT=")-5);
                                +"</li>";
                        }
                        $('body .syncstat .errlist').html('<ul>'+str1+'</ul>');
                
                    }
                });
                
                
                
            }
            appi.app.offstorage = "";
        
        }else{
            $('body .syncstat').html("<span class='closestat'>Close Status Page</span>");
        }
    },
    
    onMeterSubmit: function(e){
        e.preventDefault();
		$('input').blur();
		
        var readT = $("#readT option:selected").val();
        var read = $("#reading"+readT).val();
        var date = $("#scroller.hid").val();
        //var loadUrl = "sendRead.jsp?read="+read+"&readT="+readT+"&rDate="+date+"&camp="+this.meter.model.attributes.campus+"&util="+this.meter.model.attributes.util+"&mNum="+this.meter.model.attributes.name;
        var loadUrl = "read="+read+"&readT="+readT+"&rDate="+date+"&camp="+this.meter.model.attributes.campus+"&util="+this.meter.model.attributes.util+"&mNum="+this.meter.model.attributes.name;
        //appi.app.offstorage = appi.app.offstorage +"~"+ loadUrl;
        //Check percentage threshold
        if( appi.app.prevRead.collection.where({name: this.meter.model.attributes.name }).length > 0 ) {
            var percy = appi.app.prevRead.collection.where({name: this.meter.model.attributes.name });
            if( Number(percy[0].attributes.val) + (Number(percy[0].attributes.val)*(Number(percy[0].attributes.aPerc)/100)) <= Number(read) && percy[0].attributes.aPerc != "null" ){
                $("#result").html("<div class='response'>Exceeded Percentage Threshold, Reading Too High</div><span class='respCont'><span class='yesSubmit'>Submit Anyways</span><span class='noSubmit'>Don't Submit</span></span>");
            }else if( read < Number(percy[0].attributes.val) ){
                $("#result").html("<div class='response'>Your Reading is lower than the pevious reading</div><span class='respCont'><span class='yesSubmit'>Submit Anyways</span><span class='noSubmit'>Don't Submit</span></span>");          
            }else{
                
                if( window.ether == 0 ){
                    appi.app.offstorage = appi.app.offstorage +"~"+ loadUrl;  
                    $("#result").html("<div class='response'>Saved into storage</div>");
                }else{
                    $.ajaxSetup ({  
                      cache: false  
                    }); 
                    var ajax_load = "<img class='hid loader' src='imgs/loader.gif' alt='loading...' />"; 
                    var newLoadUrl;
                    if(window.pwloc){
                        newLoadUrl = window.pwloc+"PWmeter/sendReadBB.jsp?"+loadUrl+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
                    }
                    else{
                        newLoadUrl = "sendReadBB.jsp?"+loadUrl+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
                    }
                    $("#result").html(ajax_load).load(newLoadUrl, function() {
                        if( $(".response").hasClass("green") ){
                            percy[0].set('val', read);
                            percy[0].set('type', readT);
                            percy[0].set('date', date+" 00:00:00.0");
                        }
                    });
                }
            }
        }
        $('body').scrollTop(0);
        
        localStorage.setItem('date', date);
        window.date = date;
        console.log(loadUrl);        
    },
	
	yesSubmit: function(e){
        e.preventDefault();
        $('input').blur();
        
        var readT = $("#readT option:selected").val();
        var read = $("#reading"+readT).val();
        var date = $("#scroller.hid").val();
        //var loadUrl = "sendRead.jsp?read="+read+"&readT="+readT+"&rDate="+date+"&camp="+this.meter.model.attributes.campus+"&util="+this.meter.model.attributes.util+"&mNum="+this.meter.model.attributes.name;
        var loadUrl = "read="+read+"&readT="+readT+"&rDate="+date+"&camp="+this.meter.model.attributes.campus+"&util="+this.meter.model.attributes.util+"&mNum="+this.meter.model.attributes.name;
        //appi.app.offstorage = appi.app.offstorage +"~"+ loadUrl;
        
        if( window.ether == 0 ){
            appi.app.offstorage = appi.app.offstorage +"~"+ loadUrl;  
            $("#result").html("<div class='response'>Saved into storage</div>");
        }else{
            $.ajaxSetup ({  
              cache: false  
            }); 
            var ajax_load = "<img class='hid loader' src='imgs/loader.gif' alt='loading...' />"; 
            var newLoadUrl;
            if(window.pwloc){
                newLoadUrl = window.pwloc+"PWmeter/sendReadBB.jsp?"+loadUrl+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
            }
            else{
                newLoadUrl = "sendReadBB.jsp?"+loadUrl+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
            }
            var self = this;
            $("#result").html(ajax_load).load(newLoadUrl, function() {
                var percy = appi.app.prevRead.collection.where({name: self.meter.model.attributes.name });
                if( $(".response").hasClass("green") ){
                    percy[0].set('val', read);
                    percy[0].set('type', readT);
                    percy[0].set('date', date+" 00:00:00.0");
                }
            });
        }

        $('body').scrollTop(0);
        localStorage.setItem('date', date);
        window.date = date;        
    },
    
    onMeterUpdate: function(e){
        e.preventDefault();
        $('input').blur();
		
        var readT = $("#readT option:selected").val();
        var read = $("#reading"+readT).val();
        var date = $(".prevReads li .d").text();
        date = date.trim();
        //date = date.substring(0, date.indexOf(' '));
        var seqN = $(".prevReads li .s").text();
        var loadUrl = "read="+read+"&seqN="+seqN+"&readT="+readT+"&rDate="+date+"&camp="+this.meter.model.attributes.campus+"&util="+this.meter.model.attributes.util+"&mNum="+this.meter.model.attributes.name;
        if( window.ether == 0 ){
            $("#result").html("<div class='response'>Can't update when offline</div>");
        }else{
            $.ajaxSetup ({  
              cache: false  
            }); 
            var ajax_load = "<img class='hid loader' src='imgs/loader.gif' alt='loading...' />"; 
            var newLoadUrl;
            if(window.pwloc){
                newLoadUrl = window.pwloc+"PWmeter/updateReadBB.jsp?"+loadUrl+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
            }
            else{
                newLoadUrl = "updateReadBB.jsp?"+loadUrl+"&nm="+appi.app.model.attributes.username+"&ps="+appi.app.model.attributes.pass;
            }
            var self = this;
            $("#result").html(ajax_load).load(newLoadUrl, function() {
                var percy = appi.app.prevRead.collection.where({name: self.meter.model.attributes.name });
                if( $(".response").hasClass("green") ){
                    percy[0].set('val', read);
                    percy[0].set('type', readT);
                    percy[0].set('date', date+" 00:00:00.0");
                }
            });
        }
		$('body').scrollTop(0);
    },
    
    propigate: function(){
        $("#send").prop('disabled', false);
        if( $('#readingR').prop('disabled') == true ){
            $("#send").prop('disabled', true);
            $("#send").val('Disabled for this Read Type');
            $("#send").css('background','#D3BE4F');
        }
        $('#readT').change(function() {
            $("#send").prop('disabled', false);
            $("#send").val('ADD READING');
            $("#send").css('background','#7F354A');
            
            var readTemp = $("#readT option:selected").val();
            $('.readingInput').css("display", "none");
            $('#reading'+readTemp).css("display", "block");
            
            if( $('#reading'+readTemp).prop('disabled') == true ){
                $("#send").prop('disabled', true);
                $("#send").val('Disabled for this Read Type');
                $("#send").css('background','#D3BE4F');
            }
        });
    },
    
    offline: function(){
        console.log('go offline');
        this.model.set({'offline': 'on'});
    },
    
    offlineInit: function(){
        
        if( JSON.parse(localStorage.getItem('campusStorage')) ){ 
            var campusoffline = JSON.parse(localStorage.getItem('campusStorage'));
            for( var i = 0; i < campusoffline.length; i++ ){
                this.campus.collection.models[i] = new App.Models.campus();
                this.campus.collection.models[i].attributes = campusoffline[i];
            }
            this.campus.collection.length = this.campus.collection.models.length;

            var utilsoffline = JSON.parse(localStorage.getItem('utilsStorage'));
            for( var i = 0; i < utilsoffline.length; i++ ){
                this.utils.collection.models[i] = new App.Models.utils();
                this.utils.collection.models[i].attributes = utilsoffline[i];
            }
            this.utils.collection.length = this.utils.collection.models.length;

            var metersoffline = JSON.parse(localStorage.getItem('metersStorage'));
            for( var i = 0; i < metersoffline.length; i++ ){
                this.meters.collection.models[i] = new App.Models.meters();
                this.meters.collection.models[i].attributes = metersoffline[i];
            }
            this.meters.collection.length = this.meters.collection.models.length;
			
			var prevoffline = JSON.parse(localStorage.getItem('prevStorage'));
            for( var i = 0; i < prevoffline.length; i++ ){
                this.prevRead.collection.models[i] = new App.Models.prevRead();
                this.prevRead.collection.models[i].attributes = prevoffline[i];
            }
            this.prevRead.collection.length = this.prevRead.collection.models.length;
                
            if( this.model.get('page') == 'campus' ){
                this.campus.render();    
            }
            else if( this.model.get('page').indexOf('utils/') !== -1 ){
                this.utils.render();   
            }
            else if( this.model.get('page').indexOf('meters/') !== -1 ){
                this.meters.render();   
            }
            else if( this.model.get('page').indexOf('meter/') !== -1 ){
                this.meter.render();     
            }

            $('.loader').addClass('hid');
            window.ether = 0;
            localStorage.setItem('ether', 0);
       }
        
    },
	
    logout: function(e){
        e.preventDefault();
        localStorage.clear();
        this.model.clearLogin();
		appi.navigate('', true);
        appi.app.render();
        window.ether = 1;
    },
    
    changecamps: function(e){
        if( this.model.get('camps') == 'campus' ){
            this.model.set({'camps': 'camp'});
            $('.changecamps').text('camps on');
            localStorage.setItem('camps', 'camp');
        }else{
            this.model.set({'camps': 'campus'});
            $('.changecamps').text('camps off');
            localStorage.setItem('camps', 'campus');
        }
        this.nav.render();
        //this.campus.render();
        $(".selected").nextAll().children('a').addClass('hid');
        //appi.navigate('meters/', true);
        this.fixnav();
    },
    
    changeutil: function(e){
        if( this.model.get('utils') == 'utils' ){
            this.model.set({'utils': 'util'});
            $('.changeutil').text('util on');
            localStorage.setItem('utils', 'util');
        }else{
            this.model.set({'utils': 'utils'});
            $('.changeutil').text('util off');
            localStorage.setItem('utils', 'utils');
        }
        this.nav.render();
        //this.campus.render();
        $(".selected").nextAll().children('a').addClass('hid');
        //appi.navigate('campus', true);
        this.fixnav();
    },
    
    fixnav: function(){
        if( this.model.attributes.camps == "camp" ) {
           this.model.set('page','campus');
           appi.navigate('campus', true);
           this.campus.render(); 
        }
        else if( this.model.attributes.camps == "campus" && this.model.attributes.utils == "util" ){
           this.model.set('page','utils');
           appi.navigate('utils', true);
           this.utils.render(); 
        }
        else if( this.model.attributes.camps == "campus" && this.model.attributes.utils == "utils" ){
           this.model.set('page','meters/');
           appi.navigate('meters', true);
           this.meters.render(); 
        }
    },
    
    sett: function(e){
        if( $('#settings_cont').hasClass('hid') ){
            $('#settings_cont').removeClass('hid');
        }else{
            $('#settings_cont').addClass('hid');
        }
    },

    onLoginSubmit: function(e){
        e.preventDefault();
        
        var pwloc = this.$('input[name=pwloc]').val();
        console.log(pwloc);
        if(pwloc){
			if( pwloc.lastIndexOf("/")+1 == pwloc.length ){
				pwloc = pwloc;
			}else{
				pwloc = pwloc+"/";
			}	
        }else{
            pwloc = location.origin+"/";
        }
        pwloc = pwloc.replace("http://","");
        pwloc = "http://"+pwloc;
        localStorage.setItem('pwloc', pwloc );
        window.pwloc = pwloc;
        
        this.model.setUser(
			   this.$('input[name=username]').val() , 
                           this.$('input[name=pass]').val()
			  );
    },
    
    renderNav: function () {
        if( this.nav ){
            
            $('.sortM').addClass('hid');
            $("#result").text('');
            
            this.nav.collection.each(function(el,i){
                el.set('selected', '');
            });
        
            var ind = -1;
        
            if( this.model.get('page') == 'campus' ){
                this.nav.collection.at(0).set('selected', 'selected');
                ind = 0;
            }
            else if( this.model.get('page').indexOf('utils/') !== -1 ){
                ind = 1;
                this.nav.collection.at(1).set('selected', 'selected');
            }
            else if( this.model.get('page').indexOf('meters/') !== -1 ){
                ind = 2;
                this.nav.collection.at(2).set('selected', 'selected');
                $('.sortM').removeClass('hid');
            }
            else if( this.model.get('page').indexOf('meter/') !== -1 ){
                ind = 3;
                this.nav.collection.at(3).set('selected', 'selected');   
            }
            
            if( ind >= 0 ){
                var addon = "";
                if( ind == 3 ){
                    addon = " "+this.meter.model.attributes.name;
                }
                
                $('h1 span').html( 
                this.nav.collection.at(ind).attributes.title+addon );
            }
            
            this.nav.render();
            
            if( ind >= 1 ){
                if( appi.app.model.attributes.camps == "campus" ) {
                    $('.nav .utils a').attr('href','#utils/');
                }else{
                    $('.nav .utils a').attr('href','#utils/'+this.utils.options.constraint);
                }
            }
            if( ind >= 2 ){
                if( appi.app.model.attributes.utils == "util" ) {
                    $('.nav .meters a').attr('href','#meters/'+this.meters.options.constraint+"/"+this.meters.options.uconstraint);
                }else if( appi.app.model.attributes.camps == "campus" ) {
                    $('.nav .meters a').attr('href','#meters/');
                }else{
                    $('.nav .meters a').attr('href','#meters/'+this.meters.options.constraint+"/");
                }
            }
            if( ind >= 3 ){
                if( appi.app.model.attributes.utils == "util" ) {
                    $('.nav .meter a').attr('href','#'+this.model.attributes.page);
                }else{
                    $('.nav .meter a').attr('href','#'+this.model.attributes.page);
                }
            }
            
            $(".selected").nextAll().children('a').addClass('hid');
            
            //this.renderView();
        
        }
    },
    
    renderView: function () {
        if( this.model.get('page').indexOf('campus') !== -1 ){
            this.campus.render();
        }
        else if( this.model.get('page').indexOf('utils/') !== -1 ){
            this.utils.render();
        }
        else if( this.model.get('page').indexOf('meters/') !== -1 ){
            this.meters.render();
        }
        else if( this.model.get('page').indexOf('meter/') !== -1 ){
            //this.meter.render();
        }
    },

    render: function () {
            
        if ( this.model.get('loggedIn') == "true" ) {
            $(this.el).empty().html(this._loggedInTemplate(this.model));

            this.nav = new App.Views.navColl({ collection: nav });
            
            this.renderNav();
            
            if ( this.model.get('valid') == "Success" ) {
                
                appi.navigate( this.model.get('page') , true);
                   
            }
        } else {
            $("#main_cont").empty();
            $(this.el).empty().html(this._notLoggedInTemplate(this.model));
        }
        
        return this;
    }
});

//New campuses
App.Views.campus = Backbone.View.extend({
    tagName: 'li',
    
    _campusView: _.template($('#campus_view').html()),
    
    initialize: function () { 
    },
    
    render: function(){ 
        //this.$el.html( this.model.get('name') );
        $(this.el).empty().html(this._campusView(this.model));
        return this;
    }
});
App.Models.campus = Backbone.Model.extend({

    defaults: {
        name: '',
        desc: ''
    }
    
});
App.Collections.campusColl = Backbone.Collection.extend({
    model: App.Models.campus,
    
    initialize: function () {  
        //this.fetch({ data: $.param({ nm: 'administrator', ps: 'airit' }) });
    },
    
    getColl: function( user, pass ) {
        //this.fetch({ data: $.param({ nm: user, ps: pass }) });
        var self = this;
        this.fetch({ data: $.param({ nm: user, ps: pass }), success: function() {
                u.getColl( user, pass, 'EXE' );
                
                var campusStorage = JSON.stringify(self.toJSON());
                localStorage.setItem( 'campusStorage', campusStorage );
                
                //appi.app.campus.collection.models = JSON.parse(localStorage.getItem('campusStorage'));
                
                //w.getColl( user, pass, 'EXE' );
        }});
        
    },
    
    url: function() {
 
        if(window.pwloc){
            return window.pwloc+"PWmeter/campusCallBB.jsp";
        }else{
            return "../campusCallBB.jsp";
        }
    }
});
App.Views.campusColl = Backbone.View.extend({
    tagName: 'ul',
    
    initialize: function () {
        $(this.el).addClass('campus_list'); 
        
        //_.bindAll(this, "render");
        
        //Render offline
        //this.render();
        
        // Once the collection is fetched re-render the view
        //this.collection.bind("reset", this.render);
        //this.collection.on('add', this.addOne, this);
        
    },
    
    render: function(){
        this.$el.empty();
        
        this.collection.each( function(campus){
            var _CampusView = new App.Views.campus({model: campus });
            this.$el.append( _CampusView.render().el );
        }, this);

        $('.campus_cont').html( this.$el );  
       
        return this;
    },
    
    addOne: function( campus ) {
        var _CampusView = new App.Views.campus({model: new App.Models.campus() });
        this.$el.append( _CampusView.render().el );
    }
    
});
var v = new App.Collections.campusColl([
    { name: '', desc: ''}
]);
//END NEW

//New UTILSSSS
App.Views.utils = Backbone.View.extend({
    tagName: 'li',
    
    _utilsView: _.template($('#utils_view').html()),
    
    initialize: function () { 
    },
    
    render: function(){ 
        //this.$el.html( this.model.get('name') );
        $(this.el).empty().html(this._utilsView(this.model));
        return this;
    }
});
App.Models.utils = Backbone.Model.extend({

    defaults: {
        name: '',
        desc: ''
    }
    
});
App.Collections.utilsColl = Backbone.Collection.extend({
    model: App.Models.utils,
    
    initialize: function () {  
        //this.fetch({ data: $.param({ nm: 'administrator', ps: 'airit' }) });
    },
    
    getColl: function( user, pass ) {
        //this.fetch({ data: $.param({ nm: user, ps: pass }) });
        var self = this;
        this.fetch({ data: $.param({ nm: user, ps: pass }), success: function() {
                w.getColl( user, pass, 'EXE' );
                var utilsStorage = JSON.stringify(self.toJSON());
                localStorage.setItem( 'utilsStorage', utilsStorage );
        }});
        
    },
    
    url: function() {
	
        if(window.pwloc){
            return window.pwloc+"PWmeter/utilityCallBB.jsp";
        }else{
            return "../utilityCallBB.jsp";
        }
    }
});
App.Views.utilsColl = Backbone.View.extend({
    tagName: 'ul',
    
    initialize: function () {
        $(this.el).addClass('campus_list');       
    },
    
    render: function(){
        this.$el.empty();
        
        var err = 0;
        
        this.collection.each( function(utils){
            if( utils.get('campus') == this.options.constraint || this.options.constraint == undefined ){
                var _UtilsView = new App.Views.utils({model: utils });
                this.$el.append( _UtilsView.render().el );
                err = 1;
            }
        }, this);
        
        if( err == 0 ){
            this.$el.append( "<div class='error'>No Utilities in this Campus</div>" );
        }

        $('.campus_cont').html( this.$el );  
       
        return this;
    }
    
});
var u = new App.Collections.utilsColl([
    { name: '', desc: ''}
]);
// End Utils

//NAV
App.Views.nav = Backbone.View.extend({
    tagName: 'li',
    
    _navView: _.template($('#nav_view').html()),
    
    initialize: function () { 
    },
    
    render: function(){
        
        //$(this.el).empty().html(this._navView(this.model));
        $(this.el).empty().html(this._navView(this.model));
        $(this.el).addClass(this.model.get('selected')+" "+this.model.get('page'));
        
        return this;
    }
});
App.Models.nav = Backbone.Model.extend({

    defaults: {
        loc: '',
        title: '',
        page: '',
        selected : ''
    }
    
});
App.Collections.navColl = Backbone.Collection.extend({
    model: App.Models.nav,
    
    initialize: function () {  
        
    }
});
App.Views.navColl = Backbone.View.extend({
    tagName: 'ul',
    
    initialize: function () {
        
        $(this.el).addClass('nav'); 
        
        _.bindAll(this, "render");
        this.collection.bind("reset", this.render);   
    },
    
    render: function(){
        this.$el.empty();
        
        if( appi.app.model.attributes.utils == "utils" ){
            $(this.el).addClass('utils');
        }else{
            $(this.el).removeClass('utils');
        }
        
        if( appi.app.model.attributes.camps == "campus" ){
            $(this.el).addClass('camps');
        }else{
            $(this.el).removeClass('camps');
        }
          
        this.collection.each( function(navi){
            if( navi.get('page') != appi.app.model.get('camps') ){
                if( navi.get('page') != appi.app.model.get('utils') ){
                    var _naviView = new App.Views.nav({model: navi });
                    this.$el.append( _naviView.render().el );   
                }
            }
        }, this);
        
        $('.nav_cont').html( this.$el ); 
         
        return this;
    }
});
var nav = new App.Collections.navColl([
    { loc: 'Campus List', title: 'Select a Campus', page: 'campus', selected: '' },
    { loc: 'Utility List', title: 'Select a Utility', page: 'utils', selected: '' },
    { loc: 'Meter List', title: 'Select a Meter', page: 'meters', selected: '' },
    { loc: 'Meter', title: 'Edit Meter', page: 'meter', selected: '' }
]);
//END NAV

//Meters all
App.Views.meters = Backbone.View.extend({
    tagName: 'li',
    
    _metersView: _.template($('#meters_view').html()),
    
    initialize: function () { 
    },
    
    render: function(){ 
        //this.$el.html( this.model.get('name') );
		
		//Already exist prev reading			
		var tt = this.model.get('name');			
	    if( appi.app.prevRead.collection.where({name: tt }).length > 0 ) {			
			var ttt = appi.app.prevRead.collection.where({name: tt });			
			var dt = new Date()			
			var dm = dt.getMonth();			
			var dy = dt.getFullYear();			
				for( var i=0; i<ttt.length; i++){			
				var tttt = ttt[i].get('date').substring(0,11);			
				var tfifth = tttt.split('-');			
	                			
	        	if( dm > 1 && parseInt(tfifth[0])==dy && parseInt(tfifth[1])>dm ){			
	            	$(this.el).addClass('red');			
	        	}else if( dm == 1 && parseInt(tfifth[0])>=dy-1 && parseInt(tfifth[1])>=12 ){			
	            	$(this.el).addClass('red');			
	        	}			
	        }  			
	    }
		
        $(this.el).empty().html(this._metersView(this.model));
        return this;
    }
});
App.Models.meters = Backbone.Model.extend({

    defaults: {
        name: '',
        desc: '',
        util: '',
        campus: ''
    }
    
});
App.Collections.metersColl = Backbone.Collection.extend({
    model: App.Models.meters,
    
    initialize: function () {  
        //this.fetch({ data: $.param({ nm: 'administrator', ps: 'airit' }) });
    },
    
    getColl: function( user, pass, camp ) {
        //this.fetch({ data: $.param({ nm: user, ps: pass, camp: camp }) });
        var self = this;
        this.fetch({ data: $.param({ nm: user, ps: pass, camp: camp }), success: function() {
                t.getColl( user, pass );
				var metersStorage = JSON.stringify(self.toJSON());
                localStorage.setItem( 'metersStorage', metersStorage );
                appi.app.renderView();
                $('.loader').addClass('hid');
        }});
    },
    
    url: function() {
        if(window.pwloc){
            return window.pwloc+"PWmeter/meterCallBB.jsp";
        }else{
            return "../meterCallBB.jsp";
        }
    }
});
App.Views.metersColl = Backbone.View.extend({
    tagName: 'ul',
    
    initialize: function () {
        $(this.el).addClass('campus_list'); 
        
        //_.bindAll(this, "render");
        
        //render offline
        //this.render();
        // Once the collection is fetched re-render the view
        //this.collection.bind("reset", this.render);
        //this.collection.on('add', this.addOne, this);
        
    },
    
    render: function(){
        this.$el.empty();
        
        var err = 0;
        
        this.collection.each( function(meter){
            if( meter.get('campus') == this.options.constraint ){
                var _MetersView;
                if( this.options.uconstraint == '' ){
                    _MetersView = new App.Views.meters({model: meter });
                    this.$el.append( _MetersView.render().el );
                    err = 1;
                }else{
                    if( meter.get('util') == this.options.uconstraint ){
                        _MetersView = new App.Views.meters({model: meter });
                        this.$el.append( _MetersView.render().el );
                        err = 1;
                    }
                }
            }else if( this.options.constraint == undefined ){
                _MetersView = new App.Views.meters({model: meter });
                this.$el.append( _MetersView.render().el );
                err = 1;
            }
        }, this);
        
        if( err == 0 ){
            this.$el.append( "<div class='error'>No Meters in this Campus</div>" );
        }
        
        $('.campus_cont').html( this.$el );  
       
        return this;
    }
    
});
var w = new App.Collections.metersColl([
    { 
        name: '', 
        desc: '',
        util: '',
        campus: ''
    }
]);

//Meter page
App.Views.meter = Backbone.View.extend({
  
    _aMeterView: _.template($('#meter_view').html()),
    
    initialize: function () { 
        
        //this.render();  

    },
    
    render: function(){ 
        //this.$el.html( this.model.get('name') );
        $(this.el).empty().html(this._aMeterView(this.model));
        
        $('.campus_cont').html( this.$el );
		var dt = new Date();
        var dy = dt.getFullYear();
        $("#scroller").scroller({ mode: "scroller", display: "inline", theme: "android-ics light", preset: 'date', dateFormat: "yy-mm-dd", endYear: dy,
                monthNamesShort: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'] });
        
        //localStorage.setItem('date', 'true');
        
        return this;
    }
});
App.Models.meter = Backbone.Model.extend({

    defaults: {
        name: '',
        util: '',
        campus: '',
        val: ''
    }
    
});
//End Meter

//Prev Readings
App.Views.prevRead = Backbone.View.extend({
  
    //_prevView: _.template($('#prevRead_view').html()),
    
    initialize: function () {  

    },
    
    render: function(){ 
       // $(this.el).empty().html(this._prevView(this.model));
        
        return this;
    }
});
App.Models.prevRead = Backbone.Model.extend({

    defaults: {
        campus: '',
        util: '',
        name: '',
        val: '',
        type: '',
        date: '',
        aPerc: '',
        aDir: '',
        seqN: ''
    }
    
});
App.Views.prevReadColl = Backbone.View.extend({
    tagName: 'ul',
    
    initialize: function () {
      
    },
    
    render: function(){
        this.$el.empty();
        
        this.collection.each( function(meter){
            _PrevView = new App.Views.meters({model: meter });
            this.$el.append( _PrevView.render().el );
        }, this);
       
        return this;
    }
    
});
App.Collections.prevReadColl = Backbone.Collection.extend({
    model: App.Models.prevRead,
    
    initialize: function () {  
        
    },
    
    getColl: function( user, pass ) {
        //this.fetch({ data: $.param({ nm: user, ps: pass, camp: camp }) });
        var self = this;
        this.fetch({ data: $.param({ nm: user, ps: pass }), success: function() {
                var prevStorage = JSON.stringify(self.toJSON());
                localStorage.setItem( 'prevStorage', prevStorage );
                
                //localStorage.setItem( 'metersStorage', metersStorage );
                //appi.app.renderView();
        }});
    },
    
    url: function() {
        if(window.pwloc){
            return window.pwloc+"PWmeter/prevReadBB.jsp";
        }else{
            return "prevReadBB.jsp";
        }
    }
    
});
var t = new App.Collections.prevReadColl([
    {
        campus: '',
        util: '',
        name: '',
        val: '',
        type: '',
        date: '',
        aPerc: '',
        aDir: '',
        seqN: ''
    }
]);
// End Prev Readings

App.Router = Backbone.Router.extend({
    
    initialize: function () {
 
        this.app = new App.Views.AppView({model: new App.Models.LoginStatus() });
        
        var campusV = v;
        this.app.campus = new App.Views.campusColl({ collection: campusV });
        var utilsV = u;
        this.app.utils = new App.Views.utilsColl({ collection: utilsV });
        var metersV = w;
        var id = '';
        this.app.meters = new App.Views.metersColl({ collection: metersV, constraint: id });
        this.app.meter = new App.Views.meter({ model: new App.Models.meter({name: id}) }); 

		var prevReadV = t;
        this.app.prevRead = new App.Views.prevReadColl({ collection: prevReadV }); 
		
        $('body').html(this.app.el);
        
        //this.app.render();
        
    },
    
    routes: {
        '': 'index',
        'campus': 'campusAll',
        'utils': 'utilsAll',
        'utils/': 'utilsAll',
        'utils/:id': 'utilsAll',
        'meters': 'metersAll',
        'meters/': 'metersAll',
        'meters/:id': 'metersAll',
        'meters/:id/': 'metersAll',
        'meters/:id/:id2': 'metersAll',
        //'meter/:id2/:id': 'meter',
        'meter/:id2/:id3/:id': 'meterWutil',
        'in/campus/:id': 'campus',
        'in/campus/:id/*other': 'campus',
        '*other': 'defaults'
    }, 

    index: function() {
        //appi.navigate('campus', true);
        //console.log('woo');
        //this.app.model.set('page','meters/');
        //this.app.meters.render();
    },
    
    campusAll: function() {
        this.app.model.set('page','campus');
        if ( this.app.model.get('loggedIn') == "true" ) {  
            //v.getColl( this.app.model.get('username'), this.app.model.get('pass') );
            this.app.campus.render();
        }
        else{
            appi.navigate('', true);
        }
        
    },
    
    utilsAll: function(id) {
        if ( id != "" ) { 
            
            this.app.utils.options.constraint = id ;
            
            this.app.model.set('page','utils/'+id);
            //v.getColl( this.app.model.get('username'), this.app.model.get('pass') );
            this.app.utils.render();
        }
        else{
            this.app.model.set('page','utils/');
            this.app.utils.render();
            //appi.navigate('', true);
        }
        
    },
    
    metersAll: function(id, id2) {
        if ( id != "" ) { 
            if( id2 ){
                this.app.utils.options.constraint = id ;
                this.app.meters.options.constraint = id ;
                this.app.meters.options.uconstraint = id2;
                this.app.model.set('page','meters/'+id+'/'+id2);
                this.app.meters.render();
            }else{
                this.app.meters.options.constraint = id ;
                this.app.meters.options.uconstraint = '';

                this.app.model.set('page','meters/'+id);
                localStorage.setItem('last',id);
                //w.getColl( this.app.model.get('username'), this.app.model.get('pass'), id ); 
                //var h = w;
                //this.app.meters = new App.Views.metersColl({ collection: h, constraint: id }); 

                //this.app.meters.collection = id ;
                this.app.meters.render();
            }
        }
        else{
            appi.navigate('', true);
            //this.app.model.set('page','meters/');
           // this.app.meters.render();
        }
        
    },
    
    meter: function(id2, id) {
        if ( id != "" ) {
            //this.app.meter = new App.Views.meter({ model: new App.Models.meter({name: id}) }); 
            this.app.utils.options.constraint = id2;
            this.app.meters.options.constraint = id2 ;
            this.app.meters.options.uconstraint = '';
            
            this.app.meter.model.attributes.name = id ;
            this.app.meter.model.attributes.campus = id2;
            
            this.app.model.set('page','meter/'+id2+'/'+id);
            
            this.app.meter.render();
   
        }
        else{
            appi.navigate('', true);
        }
 
    },
    
    meterWutil: function(id2, id3, id) {
        if ( id != "" ) {

            //this.app.model.attributes.utils = "util";
            //this.app.meter = new App.Views.meter({ model: new App.Models.meter({name: id}) }); 
            this.app.utils.options.constraint = id2;
            this.app.meters.options.constraint = id2 ;
            this.app.meters.options.uconstraint = id3;
            
            this.app.meter.model.attributes.name = id ;
            this.app.meter.model.attributes.campus = id2;
            this.app.meter.model.attributes.util = id3;
            
            this.app.model.set('page','meter/'+id2+'/'+id3+'/'+id);
            
            this.app.meter.render();
   
        }
        else{
            appi.navigate('', true);
        }
 
    },

    campus: function(id) {
        console.log( id );
    },

    defaults: function(other) {
        //alert('You got lost trying to find ' + other);
        appi.navigate('', true);
    }

});
var appi = new App.Router;
this.appi = appi;
window.ether = 1;
var d = new Date();
window.date = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
if( localStorage.getItem('date') != null ){
    window.date = localStorage.getItem('date');
}
if( localStorage.getItem('pwloc') != null ){
    window.pwloc = localStorage.getItem('pwloc');
}else{
    window.pwloc = location.origin;
}
appi.app.offstorage = "";
appi.app.render();

Backbone.history.start();

//Load last visited campus
if( localStorage.getItem('last') && localStorage.getItem('last') != 'undefined' ){
    appi.navigate('meters/'+localStorage.getItem('last') , true);
}

})();

