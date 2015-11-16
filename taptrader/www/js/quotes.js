function QuoteTable(options) {
    this.container_id = null;
    this.model = null;

    $.extend(this, options);
    
    this.createRow = function(quote) {
	// Obtiene un template, lo clona y modifica el ID.
	// De esta forma independizamos el codigo de la presentacion, pudiendose
	// utilizar este modelo con distintos codigos html
	var iid = quote.symbol.replace(".","");
	
	var r = $("#q_" + "row" + "-" + 'XXX').clone();
	
	// template debe ser una clase CSS que tenga display:none;
	r.removeClass("template");
	
	r.attr("id", r.attr("id").replace("XXX", iid));
	r.attr("data-symbol", quote.symbol);
	r.find('[id]').each(function() {
	    node = $(this);
	    node.attr('id', node.attr('id').replace('XXX',iid));
	});
	r.appendTo("#" + this.container_id);
    };

    this.fillRow = function(quote) {
	var iid = quote.symbol.replace(".","");
	var r = $("#q_" + "row" + "-" + iid);
	
	r.find(".symbol").html(quote.symbol);
	r.find(".last").html(quote.LA.price);
	r.find(".bid_price").html(quote.getBid().price);
	r.find(".bid_size").html(quote.getBid().size);
	r.find(".offer_price").html(quote.getOffer().price);
	r.find(".offer_size").html(quote.getOffer().size);
	r.find(".change").html(quote.getChangeField());
	
	r.removeClass("up").removeClass("down");
	var chv = quote.getChange(); 
	if (chv <0) {
	    r.addClass("down");
	} else if (chv > 0) {
	    r.addClass("up");
	}
    };
    this.quoteArrived = function(event, quote) {
	console.debug("quote arrived", quote);
	var iid = quote.symbol.replace(".","");
	if ($("#q_" + "row" + "-" + iid).length <= 0) {
	    this.createRow(quote);
	}
	this.fillRow(quote);

    };
    
    try {
	console.debug("quotetable",this.model.instruments);
	for (i in this.model.instruments) {
	    var q = this.model.getQuote(this.model.instruments[i]);
	    if (q) {
		this.quoteArrived("",q);
	    } else {
		this.quoteArrived("",new Quote(this.model.instruments[i],{}));
	    }
	}
    } catch (e) {
	console.error("No se pudo inicializar la tabla de quotes. " + e);
    }
}