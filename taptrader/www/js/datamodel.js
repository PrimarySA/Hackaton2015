function DataModel(options) {
    this.container_id = "DataModel";
    this.logged = false;
    this.url = "http://demo-api.primary.com.ar:8081/pbcp/";
    this.marketId="ROFX;"
    this.user = null;
    this.password = null;
    /**
     * Tiempo entre actualizaciones de quotes, en milisegundos.
     * Si es cero, no hay actualizaciones.
     */
    this.updateRate=3000;
    
    this.instruments = [];
    this.account = null;
    this.quotes = {};
    
    /**
     * Por discrepancias en los mensajes, orders tiene como key el orderId
     * y sentOrders el clOrdId (o tambien clientId en algunos mensajes).
     */
    this.orders = {};
    this.sentOrders = {};
    
    this.ORDER_DEFAULTS = {
		marketId : "ROFX",
		ordType : "Limit",
		timeInForce : "Day"
    };

    $.extend(this, options);

    this._node = null;
    this._intervalHandler=null;
    

    this.init = function() {
	this._node = $("<div id='" + this.container_id + "'></div>").addClass("datamodel").appendTo(document.body);
    };
    this.startUpdate=function(){
	try{
	    console.debug("iniciando update",this.updateRate);
	    if (this.updateRate < 0){
		this._intervalHandler = setInterval($.proxy(this.fetchQuotes, this),this.updateRate);
	    }
    	} catch(e) {
    	    console.error("No se pudo iniciar el update. " + e);
    	}
    };
    this.stopUpdate=function() {
	clearInterval(this._intervalHandler);
    };
    
    this.bind = function(eventType, handler) {
	this._node.bind(eventType, handler);
    };
    this.sendEvent = function(eventname, data) {
	//console.debug("enviando evento", eventname, data);
	this._node.trigger(eventname, data);
    },

    // TODO: usar los datos almacenados.
    this.login = function() {
	var data = {
	    j_username : this.user,
	    j_password : this.password
	};
	var lurl = this.url + "j_spring_security_check";
	
	var dis = this; // wrap this
	$.ajax({
	    type : "POST",
	    url : lurl,
	    data : data,
	    dataType : "text",
	    success : function(data, textStatus, jqXHR) {
		this.logged = true;
	    },
	    error : function(jqXHR, textStatus, errorThrown) {
		this.logged = false;
	    },
	    complete : function(jqXHR, textStatus) {
		console.debug("login complete", this.logged);
		dis.sendEvent("login", this.logged);
	    }
	})
    };

    this.sendIOCOrder = function(options) {
	options["timeInForce"] = "IOC";
	this.sendOrder(options);
    };
    
    this.sendFOKOrder = function(options) {
	// No funciona. El server reporta tipo de orden no soportado.
	options["timeInForce"] = "FOK";
	this.sendOrder(options);
    };
    
    this.sendOrder = function(options) {
	var lurl = this.url + "rest/order/newSingleOrder";
	var order = $.extend({}, this.ORDER_DEFAULTS, options)
	
	console.debug("sendOrder", order);
	
	var dis = this; // wrap this.
	
	$.ajax({
	    url : lurl,
	    type : "GET",
	    dataType : "json",
	    data : order,
	    success : function(data, textStatus, jqXHR) {
		$.extend(order, data.order);
		dis.sentOrders[order.clientId] = order;
		dis.sendEvent("ordersent", order);
		dis.checkOrder(order.clientId); // requiero el estado de la orden de nuevo, acorde a la documentacion de la  API.
	    },
	    error : function(jqXHR, textStatus, errorThrown) {
		console.error("ORDER FAILED", jqXHR.status, textStatus,order);
		dis.sendEvent("ordererror", order);
	    },
	    xhrFields : {
		withCredentials : true
	    }
	});
    };
    this.cancelOrder = function(oid) {
	var order = this.getOrder(oid);
	var lurl = this.url + "rest/order/cancelById";
	console.debug("cancelOrder", oid, order);
	var data = {
	    proprietary : "api",
	    clOrdId : order.clOrdId
	};

	var dis = this; // wrap
	$.ajax({
	    url : lurl,
	    type : "GET",
	    dataType : "json",
	    data : data,
	    success : function(data, textStatus, jqXHR) {
		console.debug("cancelOrder success", data);
		dis.checkOrder(data.order.clientId);
	    },
	    error : function(jqXHR, textStatus, errorThrown) {
		console.error("CANCEL FAILED", jqXHR.status, jqXHR);
	    },
	    xhrFields : {
		withCredentials : true
	    }
	});
    };

    this.checkActiveOrders = function() {
	for (i in this.orders) {
	    var order = this.orders[i];
	    // Seria bueno que viniera el OrdStatus como un entero...
	    if (order.status == "NEW" || order.status == "PARTIALLY_FILLED") { 
		// console.debug("checking order", order);
		this.checkOrder(order.clOrdId);
	    }
	}
    }

    this.checkOrders = function() {
	var lurl = this.url + "rest/order/all";
	var data = {
	    accountId : this.account
	};
	var dis = this; // wrap
	$.ajax({
	    url : lurl,
	    type : "GET",
	    dataType : "json",
	    data : data,
	    success : function(data, textStatus, jqXHR) {
		if (data.status == "OK") {
		    for (i in data.orders) {
			var order = data.orders[i];
			// console.debug("checkOrder", order, dis.instruments);
			if (dis.instruments.indexOf(order.instrumentId.symbol) >= 0) {
			    dis.orders[order.orderId] = order;
			    try {
				delete dis.sentOrders[order.clOrdId];
			    } catch (e) {

			    }
			    dis.sendEvent("order", order);
			}
		    }
		}
	    },
	    error : function(jqXHR, textStatus, errorThrown) {
		console.error("ORDERS STATUS FAILED", jqXHR.status, jqXHR);
	    },
	    xhrFields : {
		withCredentials : true
	    }
	});
    };
    this.checkOrder = function(id) {
	var lurl = this.url + "rest/order/allById";
	var data = {
	    proprietary : "api",
	    clOrdId : id
	};
	var dis = this; // wrap
	console.debug("checkOrder id:", id);
	$.ajax({
	    url : lurl,
	    type : "GET",
	    dataType : "json",
	    data : data,
	    success : function(data, textStatus, jqXHR) {
		if (data.status == "OK") {
		    for ( var i in data.orders) {
			var order = data.orders[i];
			// console.debug("checkOrder order:", order);
			if (order.orderId) {
			    dis.orders[order.orderId] = order;
			    delete dis.sentOrders[order.clOrdId];
			    dis.sendEvent("order", order);
			}
		    }
		    dis.fetchQuote(order.instrumentId.symbol);
		} else {
		    console.debug("checkOrder status not ok", data);
		    dis.sendEvent("ordererror", id);
		}
	    },
	    error : function(jqXHR, textStatus, errorThrown) {
		console.error("CHECK ORDER FAILED", jqXHR.status, jqXHR);
	    },
	    xhrFields : {
		withCredentials : true
	    }
	});
    };
    
    this.saveQuote = function(symbol, md) {
	// console.debug("md", md);
	var q = new Quote(symbol, md);
	
	/* Solo publico si hay cambios. Esto con una conexion ws no es necesario.*/
	var quote = this.quotes[symbol];
	var changed = !quote || q.LA.price != quote.LA.price || q.LA.size != quote.LA.size
		|| q.getBid().price != quote.getBid().price || q.getOffer().price != quote.getOffer().price
		|| q.getBid().size != quote.getBid().size || q.getOffer().size != quote.getOffer().size;
	// console.debug("saveQuote", changed, quote, q);
	if (changed) {
	    this.quotes[symbol] = q;
	    this.sendEvent("quote", q);
	}
    };
    
    this.fetchQuote = function(symbol) {
	var lurl = this.url + "rest/marketdata/get";
	var data = {
	    marketId : this.marketId,
	    symbol : symbol,
	    entries : "BI,OF,LA,SE",
	}
	var dis = this;
	$.ajax({
	    url : lurl,
	    type : "GET",
	    dataType : "json",
	    data : data,
	    success : function(data, textStatus, jqXHR) {
		// console.debug("q", data);
		if (data.status && data.status == "OK") {
		    var md = data.marketData;
		    dis.saveQuote(symbol, md);
		} else {
		    dis.quotes[symbol]=new Quote(symbol,{});
		}
	    },
	    error : function(jqXHR, textStatus, errorThrown) {
		dis.quotes[symbol]=new Quote(symbol,{});
		console.error("QUOTE FAILED", jqXHR.status, jqXHR);
		
	    },
	    xhrFields : {
		withCredentials : true
	    }

	});
    }
    /**
     * Solicita quote por cada instrumento configurado en <i>instruments</i>
     */
    this.fetchQuotes = function() {
	for (i in this.instruments) {
	    this.fetchQuote(this.instruments[i]);
	}
    };
    this.getOrder = function(id) {
	return this.orders[id];
    };
    this.getQuote = function(symbol) {
	return this.quotes[symbol];
    };

};

/*
 * Sounds
 * TODO: Incorporar archivos de audio.
 */
var sounds = {};
// sounds['accepted']=new Audio("/sounds/send.ogg");
// sounds['send']=new Audio("/sounds/accepted.ogg");
// sounds['error']=new Audio("/sounds/illegal.ogg");
// sounds['cancelled']=new Audio("/sounds/foot3.ogg");
// sounds['get']=new Audio("/MedCan.ogg");
// sounds['fill']=new Audio("/sounds/bonus.ogg");

function playSound(action) {
    var snd = sounds[action];
    if (snd != null) {
	snd.play();
    }
}

function Quote(symbol, md) {
    this.symbol = symbol;
    this.date = new Date();
    this.BI = [];
    this.OF = [];
    this.LA = {
	price : 0,
	size : 0
    };
    this.SE = {
	price : 0
    };

    /*
     * ENHANCE: Si el mensaje de market data viniese con los datos vacios en vez
     * de venir SIN datos, se podria hacer algo mas elegante como por ej:
     * $.extend(this,md); Lamentablemente, no queda otro recurso que hacer
     * varios "if".
     */
    if (md.date) {
	this.date = md.date;
    }
    if (md.BI && md.BI.length > 0) {
	this.BI = md.BI;
    }
    if (md.OF && md.OF.length > 0) {
	this.OF = md.OF;
    }
    if (md.LA) {
	this.LA = md.LA;
    }
    if (md.SE) {
	this.SE = md.SE;
    }
    this.hasBid = function() {
	return (this.BI && this.BI.length > 0);
    }
    this.getBid = function() {
	if (this.hasBid()) {
	    return this.BI[0];
	} else {
	    return {
		price : 0,
		size : 0
	    };
	}
    }
    this.hasOffer = function() {
	return (this.OF && this.OF.length > 0);
    }
    this.getOffer = function() {
	if (this.hasOffer()) {
	    return this.OF[0];
	} else {
	    return {
		price : 0,
		size : 0
	    };
	}
    };
    this.getChange = function() {
	if (this.LA.price == 0 || this.SE.price == 0) {
	    // Imposible calcular el change sin los dos datos.
	    return 0;
	}
	return this.LA.last_price - this.SE.price;

    }
    /**
     * Obtiene el cambio como un string porcentual (ej: "+0.23%")
     */
    this.getChangeField = function() {
	var change = this.getChange();
	chpct = change * 100 / this.SE.price;
	chpct = chpct.toFixed(2);
	if (chpct > 0) {
	    return "+" + chpct + "%";
	} else if (chpct < 0) {
	    return "" + chpct + "%";
	} else {
	    return "";
	}
    };

}