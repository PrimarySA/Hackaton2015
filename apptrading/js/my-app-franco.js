// variables gobales

var actualsymbol;
var globalacount=10;
var ultimocierre = 0;
var globalBI;

var globalOF;
var tmpsymbolo;
var qrcode;


function setStoreData(pKey,pValue)
{
	if (window.localStorage) {
	  localStorage.setItem(pKey, pValue);
	  return true;
	}
	else {
	  return false;
	}
}

function getStoreData(pKey)
{
	if (window.localStorage) {
	 return localStorage.getItem(pKey);
	  
	}
	else {
	  return "";
	}
}

function removeStoreData(pKey)
{
	if (window.localStorage) {
	  localStorage.removeItem(pKey);
	  return true;
	}
	else {
	  return false;
	}
}




function shareOperacion(pOperacionTipo,pSimbolo,pPrecio,pCantidad)
{
 var user_id=getStoreData("user_id");
 
 $.ajax({
   url: "http://104.131.109.227/apptrading/setComOp.php?callback=?&id="+user_id+"&tipo="+pOperacionTipo+"&simbolo="+pSimbolo+"&precio=" + pPrecio + "&cant="+pCantidad,
   jsonp: "callback",
   dataType: "jsonp"
  })
  .done(function( data ) {
   if (data.error==0){
    console.log("operacion almacenada en comunidad");
   }
  });
}


// funciondicadores
function linear (xData, yData, periods) {

		var		lineData = [],
				step1,
				step2 = 0,
				step3 = 0,
				step3a = 0,
				step3b = 0,
				step4 = 0,
				step5 = 0,
				step5a = 0,
				step6 = 0,
				step7 = 0,
				step8 = 0,
				step9 = 0;


		// Step 1: The number of data points.
		step1 = xData.length;

		// Step 2: "step1" times the summation of all x-values multiplied by their corresponding y-values.
		// Step 3: Sum of all x-values times the sum of all y-values. 3a and b are used for storing data.
		// Step 4: "step1" times the sum of all squared x-values.
		// Step 5: The squared sum of all x-values. 5a stores data.
		// Step 6: Equation to calculate the slope of the regression line.
		// Step 7: The sum of all y-values.
		// Step 8: "step6" times the sum of all x-values (step5).
		// Step 9: The equation for the y-intercept of the trendline.
		for ( var i = 0; i < step1; i++) {
			step2 = (step2 + (xData[i] * yData[i]));
			step3a = (step3a + xData[i]);
			step3b = (step3b + yData[i]);
			step4 = (step4 + Math.pow(xData[i], 2));
			step5a = (step5a + xData[i]);
			step7 = (step7 + yData[i]);
		}
		step2 = (step1 * step2);
		step3 = (step3a * step3b);
		step4 = (step1 * step4);
		step5 = (Math.pow(step5a, 2));
		step6 = ((step2 - step3) / (step4 - step5));
		step8 = (step6 * step5a);
		step9 = ((step7 - step8) / step1);

		// Step 10: Plotting the trendline. Only two points are calulated.
		// The starting point.
		// This point will have values equal to the first X and Y value in the original dataset.
		lineData.push([xData[0] , yData[0]]);

		// Calculating the ending point.
		// The point X is equal the X in the original dataset.
		// The point Y is calculated using the function of a straight line and our variables found.
		step10 = ( ( step6 * xData[step1 - 1] ) + step9 );
		lineData.push([ ( xData[step1 - 1] ), step10 ]);

		return lineData;
	}
	
	
	
	function arrayAvg (arr) {
		var sum = 0,
			arrLength = arr.length,
			i = arrLength;

		while (i--) {
			sum = sum + arr[i];
		}

		return (sum / arrLength);
	}
	
	
function SMA (xData, yData, periods) {
		var periodArr = [],
			smLine = [],
			length = yData.length,
			pointStart = xData[0];

		// Loop through the entire array.
		for (var i = 0; i < length; i++) {

			// add points to the array.
			periodArr.push(yData[i]);

			// 1: Check if array is "filled" else create null point in line.
			// 2: Calculate average.
			// 3: Remove first value.
			if (periods == periodArr.length) {

				smLine.push([ xData[i] , arrayAvg(periodArr)]);
				periodArr.splice(0,1);

			}  else {
				smLine.push([ xData[i] , null]);
			}
		}
		return smLine;
	}
	
	
function EMA (xData, yData, periods) {

		var t,
			y = false,
			n = periods,
			k = (2 / (n + 1)),
			ema,	// exponential moving average.
			emLine = [],
			periodArr = [],
			length = yData.length,
			pointStart = xData[0];

		// loop through data
		for (var i = 0; i < length; i++) {


			// Add the last point to the period arr, but only if its set.
			if (yData[i-1]) {
				periodArr.push(yData[i]);
			}
			

			// 0: runs if the periodArr has enough points.
			// 1: set currentvalue (today).
			// 2: set last value. either by past avg or yesterdays ema.
			// 3: calculate todays ema.
			if (n == periodArr.length) {


				t = yData[i];

				if (!y) {
					y = arrayAvg(periodArr);
				} else {
					ema = (t * k) + (y * (1 - k));
					y = ema;
				}

				emLine.push([xData[i] , y]);

				// remove first value in array.
				periodArr.splice(0,1);

			} else {

				emLine.push([xData[i] , null]);
			}

		}

		return emLine;
	}
	
	
function calcMACDf (xData, yData, periods) {

		var chart = this,
			shortPeriod = 12,
			longPeriod = 26,
			signalPeriod = 9,
			shortEMA,
			longEMA,
			MACD = [], 
			xMACD = [],
			yMACD = [],
			signalLine = [],
			histogram = [];


		// Calculating the short and long EMA used when calculating the MACD
		shortEMA = EMA(xData, yData, 12);
		longEMA = EMA(xData, yData, 26);

		// subtract each Y value from the EMA's and create the new dataset (MACD)
		for (var i = 0; i < shortEMA.length; i++) {

			if (longEMA[i][1] == null) {

				MACD.push( [xData[i] , null]);

			} else {
				MACD.push( [ xData[i] , (shortEMA[i][1] - longEMA[i][1]) ] );
			}
		}

		// Set the Y and X data of the MACD. This is used in calculating the signal line.
		for (var i = 0; i < MACD.length; i++) {
			xMACD.push(MACD[i][0]);
			yMACD.push(MACD[i][1]);
		}

		// Setting the signalline (Signal Line: X-day EMA of MACD line).
		signalLine = EMA(xMACD, yMACD, signalPeriod);

		// Setting the MACD Histogram. In comparison to the loop with pure MACD this loop uses MACD x value not xData.
		for (var i = 0; i < MACD.length; i++) {

			if (MACD[i][1] == null) {

				histogram.push( [ MACD[i][0], null ] );
			
			} else {

				histogram.push( [ MACD[i][0], (MACD[i][1] - signalLine[i][1]) ] );

			}
		}
		/*
var resul;
resul['macd'].MACD;
resul['signalLine'].signalLine;
resul['macd'].MACD;
*/
	//	return [MACD, signalLine, histogram];
	return MACD;
	
	}
	
	
	
	//


//
// Initialize your app

var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipeBackPageThreshold: 1,
	swipePanel: "left",
	swipePanelCloseOpposite: true,
	pushState: true,
	pushStateRoot: undefined,
	pushStateNoAnimation: false,
	pushStateSeparator: '#!/',
    template7Pages: true
});

	var chart1 

	// Export selectors engine
var $$ = Dom7;

// Add main View
var mainView = myApp.addView('.view-main', {
    // Enable dynamic Navbar
    dynamicNavbar: false
});

$$(document).on('ajaxStart',function(e){myApp.showIndicator();});
$$(document).on('ajaxComplete',function(){myApp.hideIndicator();});		


function get(pApi,pModo,pCallback)
{
 var base="http://demo-api.primary.com.ar:8081/pbcp/rest/";
 if (pModo==1) base="http://h-api.primary.com.ar/MHD/";
  
  
 $.ajax({
  url: "http://104.131.109.227/apptrading/api.php?callback=?&url=" + encodeURIComponent(base + pApi),
  jsonp: "callback",
  dataType: "jsonp"
  })
  .done(function( data ) {
   if (data.error==0){
     var obj = jQuery.parseJSON( data.respuesta);
     pCallback(obj);
   }
   
  })
}

$$(document).on('pageInit', function (e) {
	 
	 
	 

	 
	 
	 
 var page = e.detail.page;

	});	
	
	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);
	