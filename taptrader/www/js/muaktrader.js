/**
 * Barta's Tap Trading(R) screen for single product.
 */
function MuakTrader(options) {
    this.model = null;
    this.chart=null;
    this.symbol = null;
    this.ratio = 1;
    this.height = 250;
    this.midp = 20;
    this.default_size = 1;
    this.debug = true;

    $.extend(this, options);

    this._mybid = null;
    this._myoffer = null;

    this._debug = function() {
	if (this.debug) {
	    var args = Array.prototype.slice.call(arguments);
	    console.debug.apply(console, args);
	}
    },

    this.action = function(ev) {
	this._debug("ACTION", ev);
	var t = $(ev.target);
	if (t.hasClass("send") && t.parents(".muaker-mybid").length > 0) {
	    // this._debug("SEND BID");
	    var b = $('.muaker-mybid.clone');
	    var price = b.find(".price").text();
	    var size = b.find(".msize").text();
	    if (parseInt(size) <= 0) {
		return;
	    }
	    var acc = this.model.account;
	    // this._debug("sendorder", muakerinstrument, price, size, acc);
	    playSound("send");
	    this.model.sendOrder({symbol:this.symbol,price:price,orderQty:size,side:"Buy",account:acc});

	} else if (t.hasClass("send") && t.parents(".muaker-myask").length > 0) {
	    // this._debug("SEND ASK");
	    var b = $('.muaker-myask.clone');
	    var price = b.find(".price").text();
	    var size = b.find(".msize").text();
	    if (parseInt(size) <= 0) {
		return;
	    }
	    var acc = this.model.account;
	    // this._debug("sendorder", muakerinstrument, price, size, acc);
	    playSound("send");
	    this.model.sendOrder({symbol:this.symbol,price:price,orderQty:size,side:"Sell",account:acc});
	} else if (t.hasClass("cancel") && t.parents(".muaker-mybid").length > 0) {
	    if (this._mybid) {
		playSound("send");
		this.model.cancelOrder(this._mybid);
	    }
	} else if (t.hasClass("cancel") && t.parents(".muaker-myask").length > 0) {
	    if (this._myoffer) {
		playSound("send");
		this.model.cancelOrder(this._myoffer);
	    }
	} else if (t.parents(".muaker-bid").length > 0 && (t.hasClass("killer") || t.hasClass("price")) ) {
	    var price = $('.muaker-bid .price').text();
	    var size = parseInt($('.muaker-bid .ksize').text());
	    if (size == 0) {
		return;
	    }
	    var acc = this.model.account;
	    // this._debug("sendorder", muakerinstrument, price, size, acc);
	    playSound("get");
	    this.model.sendIOCOrder({symbol:this.symbol,price:price,orderQty:size,side:"Sell",account:acc});
	} else if (t.parents(".muaker-ask").length > 0 && (t.hasClass("killer") || t.hasClass("price")) ) {
	    var price = $('.muaker-ask .price').text();
	    var size = parseInt($('.muaker-ask .ksize').text());
	    if (size == 0) {
		return;
	    }
	    var acc = this.model.account;
	    // this._debug("sendorder", muakerinstrument, price, size, acc);
	    playSound("get");
	    this.model.sendIOCOrder({symbol:this.symbol,price:price,orderQty:size,side:"Buy",account:acc});
	} else if (t.hasClass("msize") && t.parents(".muaker-quote").length > 0) {
	    t.parent().find(".ksize").text(t.text());
	}
    };
    this.calcHeight = function(val) {
	return this.chart._chart.series[0].yAxis.toPixels(val)-this.midp/2;
    };
    this.calcVal = function(h) {
	// TODO: redondear segun decimales
	//console.debug("muaktrader chart",this.chart);
	return parseInt(this.chart._chart.series[0].yAxis.toValue(h-this.midp/2));
    };
    
    this.adjustvalues = function() {
	//this._debug("adjustValues", this);
	quote = this.model.getQuote(this.symbol);
	this._debug("adjustValues", quote);
	try {
	    var askb = this.calcHeight(quote.getOffer().price);
	    var bidb = this.calcHeight(quote.getBid().price);
	    var minn=this.height - this.midp;
	    this._debug("adjustValues ab", askb,bidb);
	    if (quote.hasOffer()) {
		$('.muaker-ask').css('top', Math.max(askb,-1));
	    } else {
		$('.muaker-ask').css('top', -1);
	    }
	    if (quote.hasBid()) {
		$('.muaker-bid').css('top', Math.min(bidb,minn));
	    } else {
		$('.muaker-bid').css('top', minn);
	    }

	    if (this._mybid) {
		var o = this.model.getOrder(this._mybid);
		$('.muaker-mybid').css('top', Math.min(this.calcHeight(o.price),minn));
	    } else {
		$('.muaker-mybid').css('top', minn);
	    }
	    if (this._myoffer) {
		var o = this.model.getOrder(this._myoffer);
		$('.muaker-myask').css('top', Math.max(this.calcHeight(o.price),-1));
	    } else {
		$('.muaker-myask').css('top', - 1);
	    }
	    
	    var dis = this; // wrap 'this'
	    $(".muaker-orders .clone").each(function(idx, node) {
		// this._debug("each",idx,node);
		var clone = $(node);
		clone.css('top', dis.calcHeight(clone.find(".price").text()));
	    });
	} catch (e) {
	    console.error("Error al ajustar values", e, this);
	}
    };
    this.mordererror = function(event, data) {
	// this._debug("mordererror",data,event);
	playSound("error");
    };
    this.morder = function(event, order) {
	this._debug("morder", order.side,order.status,order.price);
	if (order.instrumentId.symbol == this.symbol) {
	    if (order.side == "BUY") {
		this._debug(order.orderId,this._mybid);
		if (order.status == "NEW") {
		    // Accepted
		    $(".muaker-mybid.clone").remove();
		    $(".muaker-mybid").find(".price").text(order.price);
		    $(".muaker-mybid").find(".msize").text(order.leavesQty);
		    this._mybid = order.orderId;
		} else if (order.status == "PARTIALLY_FILLED") {
		    // Partial
		    $(".muaker-mybid").not(".clone").find(".price").text(order.price);
		    $(".muaker-mybid").not(".clone").find(".msize").text(order.leavesQty);
		    this._mybid = order.orderId;
		} else if (order.orderId == this._mybid) {
		    this._mybid = null;
		    $(".muaker-mybid").not(".clone").find(".price").text(0);
		    $(".muaker-mybid").not(".clone").find(".msize").text(this.default_size);
		}
	    } else if (order.side == "SELL") {
		this._debug(order.orderId,this._myoffer);
		if (order.status == "NEW") {
		    // Accepted
		    $(".muaker-myask.clone").remove();
		    $(".muaker-myask").find(".price").text(order.price);
		    $(".muaker-myask").find(".msize").text(order.leavesQty);
		    this._myoffer = order.orderId;
		} else if (order.status == "PARTIALLY_FILLED") {
		    // Partial
		    $(".muaker-myask").find(".price").text(order.price);
		    $(".muaker-myask").find(".msize").text(order.leavesQty);
		    this._myoffer = order.orderId;
		} else if (order.orderId == this._myoffer) {
		    this._myoffer = null;
		    $(".muaker-myask").not(".clone").find(".price").text(0);
		    $(".muaker-myask").not(".clone").find(".msize").text(this.default_size);
		}
	    }
	    this.adjustvalues();
	}
    };
    this.mquote = function(event, quote) {
	this._debug("mquote", this.symbol, quote.symbol, this);
	if (this.symbol == quote.symbol) {
	    $('.muaker .symbol').text(quote.symbol);
	    $('.muaker .last_price').text(quote.LA.price);
	    $('.muaker .last_size').text(quote.LA.size);
	    $('.muaker .change').text(quote.getChangeField());
	    $('.muaker-bid .price').text(quote.getBid().price);
	    $('.muaker-bid .msize').text(quote.getBid().size);
	    $('.muaker-ask .price').text(quote.getOffer().price);
	    $('.muaker-ask .msize').text(quote.getOffer().size);
	    
// TODO: para imlementar con profundidad. La API rest no trae.	    
//	    $('.muaker-ask-book').hide()
//	    for (var i = 1; i < 3; i++) {
//		if (i < quote.offer_book.length) {
//		    $('.muaker-ask-book.book' + i + " .price").text(quote.offer_book[i][0]);
//		    $('.muaker-ask-book.book' + i + " .msize").text(quote.offer_book[i][1]);
//		    $('.muaker-ask-book.book' + i).show();
//		} else {
//		    $('.muaker-ask-book.book' + i).hide();
//		}
//
//	    }
//	    for (var i = 1; i < 3; i++) {
//		if (i < quote.bid_book.length) {
//		    $('.muaker-bid-book.book' + i + " .price").text(quote.bid_book[i][0]);
//		    $('.muaker-bid-book.book' + i + " .msize").text(quote.bid_book[i][1]);
//		    $('.muaker-bid-book.book' + i).show();
//		} else {
//		    $('.muaker-bid-book.book' + i).hide();
//		}
//	    }

	    this.adjustvalues();

	}
    };
    
    // TODO: Hacer los incrementos exponenciales.
    this.dragging = function(ev, ui) {
	var clone = $(ui.helper);
	var ref = ui.position.top;
	if (clone.hasClass("muaker-myask")) {
	    ref = ref + this.midp;
	}
	var newval = this.calcVal(ref);
	var price = clone.find('.price');
	price.text("" + newval);
    };
    this.size_dragging = function(ev, ui) {
	var clone = $(ui.helper);
	var orig = $(ev.target);
	var size = parseInt(orig.text()) + parseInt((ui.originalPosition.top - ui.position.top) / 3);
	clone.text("" + Math.max(size, 0));
    };
    this.size_dragged_stop = function(ev, ui) {
	var orig = $(ev.target);
	var size = parseInt(orig.text()) + parseInt((ui.originalPosition.top - ui.position.top) / 3);
	orig.text("" + Math.max(size, 0));
    };
    this.dragged_start = function(ev, ui) {
	var orig = $(ev.target);
	var orig_class = null;
	if (orig.hasClass('muaker-myask')) {
	    orig_class = ".muaker-myask";
	} else if (orig.hasClass('muaker-mybid')) {
	    orig_class = ".muaker-mybid";
	}
	$(orig_class + ".clone").remove();
    };
    this.dragged_stop = function(ev, ui) {
	var clone = $(ui.helper).clone(true).removeClass('muaker-slide ui-draggable ui-draggable-dragging ui-draggable-handle')
		.addClass('clone').appendTo('.muaker-orders');
	clone.find(".cancel").removeClass("cancel glyphicon-remove-circle").addClass("send glyphicon-send");
	this.makeDraggableClone(clone);
	this.makeDraggableSize(clone.find('.badge.msize'));

    };
    this.makeDraggableSize = function(jq) {
	jq.draggable({
	    axis : "y",
	    helper : "clone",
	    stop : $.proxy(this.size_dragged_stop, this),
	    drag : $.proxy(this.size_dragging, this),
	});
	jq.addClass("muaker-draggable");
    };
    this.makeDraggableClone = function(jq) {
	jq.draggable({
	    axis : "y",
	    drag : $.proxy(this.dragging, this),
	});
    };
    $('.muaker-slide').draggable({
	axis : "y",
	containment : "parent",
	start : $.proxy(this.dragged_start, this),
	stop : $.proxy(this.dragged_stop, this),
	drag : $.proxy(this.dragging, this),
	helper : "clone",
    });
    this.cleanClones = function() {
	$(".muaker-orders .clone").remove();
    };

    this.cleanClone = function(ev, el) {
	console.debug("clean clone", ev, el);
	$(ev.target).parent(".clone").remove();
    };

    $(".muaker-quote").css("min-height",this.height);
    $(".muaker-orders").css("min-height",this.height);
    
    this.makeDraggableSize($(".muaker-quote .ksize"));
    this.model.bind("quote", $.proxy(this.mquote, this));
    this.model.bind("order", $.proxy(this.morder, this));
    this.model.bind("ordererror", $.proxy(this.mordererror, this));
    this.model.bind("position", $.proxy(this.mposition, this));
    $(".muaker").on("click", ".glyphicon", $.proxy(this.action, this));
    $(".muaker-quote").on("dblclick", ".price", $.proxy(this.action, this));
    $(".muaker-quote").on("click", ".msize", $.proxy(this.action, this));
    $(".muaker-mybid").css("top", this.height-19);
    $(".muaker-myask").css("top", - 1);
    $(".muaker-ask").css("top", -1);
    $(".muaker-bid").css("top", this.height - 19);
    $(".muaker-orders").on("click", ".clone .price", $.proxy(this.cleanClone, this));
}