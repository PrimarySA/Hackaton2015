function TradingChart(options) {
    this.container_id = null;
    this.symbol = null;
    this.height = 250;
    this.maxpoints=30;

    $.extend(this, options);

    this._chart = null;

    this.create = function() {
	console.debug("creando chart", this);
	var yAxis = {
	    plotLines : [ {
		value : 0,
		width : 2,
		color : 'silver',

	    } ],
	    labels : {
		enabled : false
	    }
	};
	var cc = $("#" + this.container_id).highcharts('StockChart', {
	    chart : {
		height : this.height,
	    },

	    scrollbar : {
		enabled : false
	    },
	    navigator : {
		enabled : false,
	    },
	    rangeSelector : {
		enabled : false,
	    },
	    title : {
		enabled : false,
		text : ""
	    },
	    yAxis : yAxis,
	    tooltip : {
		pointFormat : '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
		valueDecimals : 0
	    },
	});
	this._chart = $("#" + this.container_id).highcharts();
	var sbidd = {
	    type : "line",
	    name : "Bid",
	    color: "#4A93F4",
	    id : "1",
	    connectNulls : true,
	    dataGrouping : {
		enabled : false
	    },
	}
	this._chart.addSeries(sbidd);
	var sofferd = {
	    type : "line",
	    name : "Offer",
	    color: "#DE5D4F",
	    id : "2",
	    connectNulls : true,
	    dataGrouping : {
		enabled : false
	    },
	}
	this._chart.addSeries(sofferd);
	//.yAxis.setExtremes(13500,13900);
	

	console.debug("charts:", cc, this._chart);
    };

    this.quoteReceived = function(event, quote) {
	if (!this.symbol || this.symbol != quote.symbol) {
	    console.debug("ttchart. ignorando quote", this.symbol, quote);
	    return;
	}
	if (!this._chart) {
	    this.create();
	}
	var lastd = quote.date.getTime();
	var shift = false;
	if (quote.hasBid()) {
	    var sbid = this._chart.get("1");
	    shift = sbid.data.length >= this.maxpoints;
	    sbid.addPoint([ lastd, quote.getBid().price ], false, shift);
	}
	if (quote.hasOffer()) {
	    var soffer = this._chart.get("2");
	    shift = soffer.data.length >= this.maxpoints;
	    soffer.addPoint([ lastd, quote.getOffer().price ], false, shift);
	}
	this._chart.redraw();
    }
    dataModel.bind("quote", $.proxy(this.quoteReceived, this));
}