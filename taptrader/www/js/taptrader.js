	var dataModel = null;
	var chart = null;

	function exitFromApp() {
	    //console.debug("Saliendo",navigator.app);
	    navigator.app.exitApp();
	}

	function login() {
	    var user = $('#inputuser').val();
	    var pass = $('#inputpassword').val();
	    var account = $('#inputaccount').val();

	    dataModel = new DataModel({
			user : user,
			password : pass,
			account : account,
			/* TODO: traerlos de la configuracion*/
			instruments : [ "I.MERVDic15" ]
	    });
	    dataModel.init();
	    dataModel.bind("login", function(event, logged) {
			// Evento que dispara el datamodel ante una respuesta de login.
			if (logged) {
			    $("#login").fadeOut("fast");
			    console.debug("LOGGED IN");
			    try{
				$("#topnavbar").slideDown();
			    dataModel.fetchQuotes();
			    dataModel.checkOrders();
			    dataModel.startUpdate();
			    showQuotes();
			    } catch (e) {
					console.debug("ERROR init",e);
			    }
			    
			} else {
			    playSound("error");
			    showLogin();
			}
	    });
	    dataModel.login();
	}
	function showQuotes() {
	    quoter = new QuoteTable({container_id:"quotes",model:dataModel});
	    $('.quotes').on("click", ".quote", showTapTrader);
	    $("#quotes").fadeIn("slow");
	}
	function showTapTrader(ev,a) {
	    console.debug("trader",ev);
	    var target = $(ev.currentTarget);
	    var symbol = target.attr("data-symbol");
	    startTapTrader(symbol);
	}
	function startTapTrader(symbol) {
	    $(".page").fadeOut("fast");
	    
	    chart = new TradingChart({
			container_id : "chart",
			symbol : symbol
		});
	    muaker = new MuakTrader({
			model : dataModel,
			symbol : symbol,
			chart : chart
	    });
	    $("#muaker").fadeIn("slow");
	}
	function showLogin() {
	    $(".page").fadeOut("fast");
	    $("#login form")[0].reset();
	    $("#topnavbar").fadeOut("fast");
	    $("#buttonlogin").on("click",login);
		$("#login").fadeIn("slow");
	}
	$(document).ready(function() {
		showLogin();
	    

	});
	var genlast = 13650;

	function genQuote(date) {
	    var q = dataModel.getQuote("I.MERVDic15");
	    if (q) {
		genlast = q.LA.price;
	    }
	    genlast = genlast + (Math.random() - Math.random()) * 5;
	    var offer = parseInt(genlast + Math.random() * 5);
	    var bid = parseInt(genlast - Math.random() * 5);
	    console.debug("genQuote", genlast, bid, offer);
	    if (!date) {
		date = new Date();
	    }
	    var q = {
		id : 1,
		symbol : "I.MERVDic15",
		date : date,
		BI : [ {
		    price : bid,
		    size : 2
		} ],
		OF : [ {
		    price : offer,
		    size : 2
		} ],
		LA : {
		    price : parseInt(genlast),
		    size : 2
		},
		SE : {
		    price : 13600
		}
	    };
	    dataModel.saveQuote(q.symbol, q);
	}
