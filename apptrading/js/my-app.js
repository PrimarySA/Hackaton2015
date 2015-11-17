// Initialize your app
var myApp = new Framework7({
    animateNavBackIcon: true,
    // Enable templates auto precompilation
    precompileTemplates: true,
    // Enabled pages rendering using Template7
	swipeBackPage: false,
	swipeBackPageThreshold: 1,
	swipePanel: false,
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
function setestrategia(o){


	
//gggggggggggggggggggggggggg

$.ajax({
		url: "http://104.131.109.227/apptrading/compartir/tc.php?callback=?&id=" + o  ,
		jsonp: "callback",
		dataType: "jsonp"
		})
		.done(function( data ) {
	
			if (data.error==0){
		
		//francoooooooooooooo	
			
		 var jest  = {}; //JSON.parse(localStorage.getItem("stmisestrategias"));
		 

jest[o] = data.id;
  localStorage.setItem("stmisestrategias", JSON.stringify(jest));
  cargarestrategias();
    myApp.showTab('#tab1');
	
		
			}
			
		})
		
		


}

// variables GLOBALES
var conf_tipo= "Limit";
var conf_timeInForce = "Day";
var conf_cantidad = 30 ;

var actualsymbol="";
var globalacount=10;
var ultimocierre = 0;
var globalBI;

var globalOF;
var tmpsymbolo;
var qrcode;
var chart1 ;
var chartprincipal;

//FUNCIONES GLOBALES


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



function logIn()
{
	//setTimeout(function(){
		//mainView.router.reloadPage("login.html");
	//	window.location.href="http://104.131.109.227/apptrading/indexgabi.html#!/login.html";
	
		mainView.router.loadPage("login.html");
	//},5000);
}

function logOut()
{
	try
	{
		removeStoreData("user_id");
		mainView.router.loadPage("login.html");
		
	}
	catch(ex)
	{}
}

function checkLogin()
{
	try
	{
		var id=getStoreData("user_id");
		id=parseInt(id);
		
		if (id>0) return true;
		
	}
	catch(ex)
	{}
	
	return false;
}
	

	function agregarsymboloconindicador(s,m,t,c){
	 var botonmacd;
	 var botoncruce;
	 var botontrend;
	 var iconomacd;
	 var iconocruce;
	 var iconotrend;
	 
	 
	 
	 

	 if (m == "a"){
	botonmacd = "<p><a href='' style='margin-bottom: 0px;margin-top: -8px;' class='button'>COMPRAR</a></p>";
	 iconomacd =  "<div style='width: 30px;background: lightgreen;height: 30px;border-radius: 50%;'></div>";
	 }
	 
	  if (m == "b"){
	botonmacd =  "<p><a href='' style='margin-bottom: 0px;margin-top: -8px;' class='button'>VENDER</a></p>";
		 iconomacd =  "<div style='width: 30px;background: lightcoral;height: 30px;border-radius: 50%;'></div>";
	 }
	  if (m == "n"){
	botonmacd =  "";
		 iconomacd =  "<div style='width: 30px;background: lightyellow;height: 30px;border-radius: 50%;'></div>";
	 }
	 
	 if (t == "a"){
	botontrend = "<p><a href='' style='margin-bottom: 0px;margin-top: -8px;'  class='button'>COMPRAR</a></p>";
 iconotrend =  "<div style='width: 30px;background: lightgreen;height: 30px;border-radius: 50%;'></div>";
		
	}
	 
	  if (t == "b"){
	botontrend =  "<p><a href='' style='margin-bottom: 0px;margin-top: -8px;'  class='button'>VENDER</a></p>";
		 iconotrend =  "<div style='width: 30px;background: lightcoral;height: 30px;border-radius: 50%;'></div>";
	 }
	  if (t == "n"){
	botontrend =  "";
	 iconotrend=  "<div style='width: 30px;background: lightyellow;height: 30px;border-radius: 50%;'></div>";
	 }
	 
	 if (c == "a"){
	botoncruce = "<p><a href='' style='margin-bottom: 0px;margin-top: -8px;'  class='button'>COMPRAR</a></p>";
		 iconocruce=  "<div style='width: 30px;background: lightgreen;height: 30px;border-radius: 50%;'></div>";
	 }
	 
	  if (c == "b"){
	botoncruce =  "<p><a href='' style='margin-bottom: 0px;margin-top: -8px;'  class='button'>VENDER</a></p>";
	 iconocruce=  "<div style='width: 30px;background: lightcoral;height: 30px;border-radius: 50%;'></div>";
	 }
	  if (c == "n"){
	botoncruce =  "";
	 iconocruce=  "<div style='width: 30px;background: lightyellow;height: 30px;border-radius: 50%;'></div>";
	 }
	 
	 
	 
	 
	 
	 
	 
	var shtml =  "<div class='content-block-title'>" + s  + "</div><div class='list-block'><ul>" + 
       " <li class='item-content'>" + 
        "  <div class='item-media'>"+ iconomacd + "</div>" + 
         " <div class='item-inner'>" + 
          "  <div class='item-title'>MACD</div>" + 
           " <div class='item-after'>"+botonmacd+"</div>" + 
          "</div>" + 
      "  </li>" + 
        "<li class='item-content'>" + 
       "   <div class='item-media'>"+ iconotrend + "</div>" + 
       "   <div class='item-inner'>" + 
         "   <div class='item-title'>Tendencia</div>" + 
        "    <div class='item-after'>"+botontrend+"</div>" + 
        "  </div>" + 
       " </li>" + 
      "  <li class='item-content'>" + 
       "   <div class='item-media'>" + iconocruce + "</div>" + 
        "  <div class='item-inner'>" + 
        "   <div class='item-title'>Cruce</div>" + 
         "   <div class='item-after'>"+botoncruce+"</div>" + 
          "</div>" + 
       " </li>" + 
     " </ul>";
	  return shtml;
	  
	  
	 
	 
	 }
	 

	//----------------------------




$$(document).on('ajaxStart',function(e){myApp.showIndicator();});
$$(document).on('ajaxComplete',function(){
	
	myApp.hideIndicator();
	
	
	});																																																																		


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



$$(document).on('pageInit', function (e) {
	 var page = e.detail.page;
	
    
	if (!checkLogin()){
		setStoreData("user_id",1);
		setStoreData("user_acc",10);
	} 
		
	
if (page.url=="tickers.html")
 {	







var mySearchbar = myApp.searchbar('.searchbar', {
    searchList: '.list-block-search',
    searchIn: '.item-title'
});   

	get("instruments/all",0,function(data){
		var syms = [];
		
		$.each( data.instruments, function( key, val ) {
			syms.push(val.instrumentId.symbol);
		});
	
		syms.sort();
		
		var i;
		var rta="";
		for(i=0;i<syms.length;i++)
		{
			rta=rta + "<li class='item-content'><div class='item-inner'><div class='item-title'><a class='tickers_simbol' data='" + syms[i]  + "' href='#'>" + syms[i] + "</a></div></div></li>";
		}
		$("#tickers_listado").html(rta);
		
		$(".tickers_simbol").click(function(){
			
			var symb=$(this).attr("data");
			actualsymbol=symb;
			mainView.router.loadPage("chart.html");
			
		});
	});
	
}
	
	if(page.url=="balance.html")
	{
		
		
		
		
		
		var acc=getStoreData("user_acc");
		
		if (!acc) acc=10;
		
		get("order/all?accountId=" + acc,0,function(data){
			
			var list_cancel="<li class='table_row'><div class='table_section'>Fecha</div><div class='table_section'>Tipo</div><div class='table_section'>Inst</div><div class='table_section'>$xCant</div><div class='table_section'>Saldo</div><div class='table_section'>Acciones</div></li>";
			var list_new="<li class='table_row'><div class='table_section'>Fecha</div><div class='table_section'>Tipo</div><div class='table_section'>Inst</div><div class='table_section'>$xCant</div><div class='table_section'>Saldo</div><div class='table_section'>Acciones</div></li>";
			var list_filled="<li class='table_row'><div class='table_section'>Fecha</div><div class='table_section'>Tipo</div><div class='table_section'>Inst</div><div class='table_section'>$xCant</div><div class='table_section'>Saldo</div><div class='table_section'>Acciones</div></li>";
			
			$.each( data.orders, function( key, val ) {
				
				
				
				val.transactTime=val.transactTime.substring(6, 8) + "-" + val.transactTime.substring(4, 6) + "-" + val.transactTime.substring(0, 4);
				
				
				if (val.status=="CANCELLED")
				{
					list_cancel+="<li data-prop='" + val.proprietary+ "' data-id='" + val.clOrdId + "' class='table_row'><div class='table_section'>" + val.transactTime + "</div><div class='table_section'>" + val.ordType + "-" +  val.side + "</div><div class='table_section'>" + val.instrumentId.symbol + "</div>";
					list_cancel+="<div class='table_section'>" + val.price + "x" + val.orderQty + "</div><div class='table_section'>" + val.avgPx + "x" + val.cumQty + "</div><div class='table_section'></div></li>";
				}
			
				if (val.status=="NEW")
				{
					list_new+="<li  class='table_row'><div class='table_section'>" + val.transactTime + "</div><div class='table_section'>" + val.ordType + "-" +  val.side + "</div><div class='table_section'>" + val.instrumentId.symbol + "</div>";
					list_new+="<div class='table_section'>" + val.price + "x" + val.orderQty + "</div><div class='table_section'>" + val.avgPx + "x" + val.cumQty + "</div><div class='table_section'><a data-prop='" + val.proprietary+ "' data-id='" + val.clOrdId + "' class='cancelar' href='#'>CANCELAR</a></div></li>";
				}
				
				//val.status.toLowerCase().indexOf("fill") >= 0
				if (val.status=="FILLED")
				{
					list_filled+="<li data-prop='" + val.proprietary+ "' data-id='" + val.clOrdId + "' class='table_row'><div class='table_section'>" + val.transactTime + "</div><div class='table_section'>" + val.ordType + "-" +  val.side + "</div><div class='table_section'>" + val.instrumentId.symbol + "</div>";
					list_filled+="<div class='table_section'>" + val.price + "x" + val.orderQty + "</div><div class='table_section'>" + val.avgPx + "x" + val.cumQty + "</div><div class='table_section'></div></li>";
				}
				
			});
			
			console.log(data.orders);
			
			$("#balance_tabla_new").html(list_new);
			$("#balance_tabla_filled").html(list_filled);
			$("#balance_tabla_cancelled").html(list_cancel);
			
			
			$(".cancelar").click(function(e){
				e.preventDefault();	
				var prop=$(this).attr("data-prop");
				var clOrdId=$(this).attr("data-id");
				
				get("order/cancelById?clOrdId="+clOrdId+"&proprietary="+prop,0,function(data){
					console.log(data);
					mainView.router.reloadPage("balance.html");
				});
			});
		});  
		
	}
	
	if(page.url=="login.html")
	{
			if (checkLogin()) logOut();
			
			
			$("#login_enviar").click(function(){
				$("#login_error").hide();
				$("#login_loader").show();
				
				
				var user=$("#username").val();
				var pwd=$("#password").val();
			
				$.ajax({
					url: "http://104.131.109.227/apptrading/login.php?callback=?&usuario="+user+"&clave="+pwd,
					jsonp: "callback",
					dataType: "jsonp"
				})
				.done(function( data ) {
					if (data.error==0){
							$("#login_loader").hide();
							setStoreData("user_id",data.id);
							setStoreData("user_acc",data.cuenta);
							
							globalacount=data.cuenta;
							mainView.router.loadPage("tickers.html");
					}else{
						$("#login_error").show();
						$("#login_loader").hide();
					}
				})

			});
	}
	
	      
	if(page.url=="perfil.html")
	{
			var id=getStoreData("user_id");
			
			$.ajax({
					url: "http://104.131.109.227/apptrading/getPerfil.php?callback=?&id="+id,
					jsonp: "callback",
					dataType: "jsonp"
				})
				.done(function( data ) {
					if (data.error==0){
							$("#perfil_loader").hide();
							
							if (data.usuario.comunidad_comparte==1){
								$("#perfil_comunidad").attr("checked","true");
							}else{
								
								$("#perfil_comunidad").removeAttr("checked");
							}
							
							$("#perfil_cuenta").val(data.usuario.rofex_cuenta);
							$("#perfil_perfil").val(data.usuario.perfil);
							$("#perfil_nombre").val(data.usuario.nombre);
							$("#perfil_correo").val(data.usuario.email);
							
							$("#perfil_submit").click(function(e){
								e.preventDefault();
								
								$("#perfil_loader").show();
								
								var com="1";
								if (!($('#perfil_comunidad').is(":checked")))
								{
									com="0";
								} 
								
								var perfil_cuenta=$("#perfil_cuenta").val();
								var perfil_perfil=$("#perfil_perfil").val();
								var perfil_nombre=$("#perfil_nombre").val();
								var perfil_correo=$("#perfil_correo").val();
								
							
								$.ajax({
									url: "http://104.131.109.227/apptrading/setPerfil.php?callback=?&id="+ id + "&com=" + com +"&cuenta=" + perfil_cuenta + "&perfil=" + perfil_perfil + "&nombre=" + perfil_nombre + "&correo=" +perfil_correo ,
									jsonp: "callback",
									dataType: "jsonp"
								})
								.done(function( data ) {
									$("#perfil_loader").hide();
									
									if (data.error==0){
										setStoreData("user_acc",perfil_cuenta);
										globalacount=perfil_cuenta;
										mainView.router.reloadPage("perfil.html");
									}
								})
								
								
							});
							
							
					}
				});
		
		
		$("#perfil_cerrar_sesion").click(function(){
			logOut();
		});	
	}
      
	 if(page.url=="comunidad.html")
	{
		var id=getStoreData("user_id");
		
		$.ajax({
					url: "http://104.131.109.227/apptrading/getCom.php?callback=?&id="+id,
					jsonp: "callback",
					dataType: "jsonp"
				})
				.done(function( data ) {
					
					
					if (data.error==0){
						
						var rta="";
						
						$.each( data.ops, function( key, val ) {
								
								rta+="<li style='border-top:3px #ececec solid !important;border-bottom:0px !important'>";
								rta+="<div class='post_entry'>";
								rta+="<div class='post_date' style='width:35% !important;color:#3AA6E6;text-align:none'>";
								
								if (val.tipo.toUpperCase()=="BUY"){
									rta+="<span class='day' style=' color: lightgreen;' >"+val.tipo.toUpperCase()+"</span>";
								}else{
									rta+="<span class='day' style=' color: lightsalmon;' >"+val.tipo.toUpperCase()+"</span>";
								}
								rta+="<br>";
								rta+="<div style=' margin: 5px;'>";
								rta+="<span class='month' style='line-height:0px'>"+val.simbolo+"</span><br/><br/>";
								rta+="<span class='month' style='color:darkgray;line-height:0px'>"+val.cantidad+" contratos</span>";
								rta+="</div>";
								rta+="</div>";
								rta+="<div class='post_title' style='width:55% !important' >";
								rta+="<h3 style='margin: -10px 0px 0px 0px;'><a href='#'><strong style='color:;'>"+val.usuario+"</strong> </a></h3><br>";
								rta+="<h4 style='margin: -10px 0px 0px 0px;'>Opero " + val.cantidad+" contratos a $" + val.precio + " en la fecha " + val.fecha_hora + "</h4>";
								rta+="<br/>";
								rta+="<a href='#tab3p' style='border-radius: 6px;float: left;background: lightskyblue;color: white;padding: 5px 3px 5px 3px;margin-right:5px' class='tab-link  active category-link generar_operacion' data-tipo='"+val.tipo+"' data-simbolo='"+val.simbolo+"'  data-cant='"+val.cantidad+"'  ><strong>COPIAR OPERACIÓN</strong></a>";
								rta+="</div>";
								rta+="</div>";
								rta+="</li>";
								
						});
						
						$("#comunidad_listado").html(rta);
						
							$(".generar_operacion").click(function(e){
								e.preventDefault();
								
								var tipo=$(this).attr("data-tipo");
								var simbolo=$(this).attr("data-simbolo");
								var cantidad=$(this).attr("data-cant");
								
								myApp.alert("Se ejecutó la operación " +  tipo + " de "  + cantidad + " contratos de " + simbolo,"Operación exitosa!");
								  
							});
					}
					
				});
		
	} 
	
		    
 if (page.url=="noticias.html")
 {
 
$.ajax({
  url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent('http://ambito.com/rss/noticias.asp?s=Econom%EDa'),
  dataType : 'json',
  success  : function (data) {
  $('.posts').html('');
  
    if (data.responseData.feed && data.responseData.feed.entries) {
      $.each(data.responseData.feed.entries, function (i, e) {
	
var feedd;
	  var dt = new Date(e.publishedDate);
	  var mes, mesnombre;
	  mes = dt.getMonth() ;
	  var monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
	  
	  
	feedd = '<li> <div class="post_entry"> <div class="post_date"><span class="day">'+dt.getDate()  + '</span><br><span class="month">' +  monthNames[mes]  + '</span></div> <div class="post_title">';
	
           feedd =feedd + '<h2><a href="blog-single.html">' +  e.title + '</a></h2></div></div></li>';
		    console.log($('.post'));
			
				
	  $('.posts').append(feedd);
	  console.log(e);
	
	  
console.log(dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate());

        console.log("------------------------");
        console.log("title      : " + e.title);
        console.log("author     : " + e.author);
        console.log("description: " + e.description);
      });
    }
  }
});
 
} 
 
 
 if ( page.url == "indicadores.html"){
	var syms = [];
 	get("instruments/all",1,function(data){	
		$.each( data.instruments, function( key, val ) {
			syms.push(val.instrumentId.symbol);
		});
		syms.sort();
		var i;
		var rta="";
		
		for(i=0;i<syms.length;i++)
		{
		//syms[i] = "DoMar16";
			get("Trades/" +  syms[i] +"/2015-07-10/2015-11-20",1,function(data2){
			var mh = data2["marketDataH"];
			var symtest = data2["security"];
			var puntosx  = [];
			var puntosy  = [];
			jQuery.each(mh, function(i, val) {
			var d1 = new Date(val.datetime)
			puntosx.push(Math.floor(d1));   // time
			puntosy.push(parseFloat(val.price) + 0); //precio
			if (i==100) {
console.log("llego a 100");
			return ;
			}

			});

var indmacd, indtrend, indcruce;


var trendresul = linear (puntosx,puntosy,100);


if ( trendresul[1][1]  > trendresul[0][1]) {
// tendencia alza
console.log("tendencia alta");
indtrend ="a";

}else{


if ( trendresul[0][1] > trendresul[1][1] ) {
// tendencia baja
console.log("tendencia baja");
indtrend ="b";
}else{
//tendencia neutra
indtrend ="n";
}
}



var SMAresul10 = SMA (puntosx,puntosy,10);


var SMAresul100 = SMA (puntosx,puntosy,100);
var tam ;
tam = SMAresul10.length-1;
console.log("SMAresul10 - 5   " + SMAresul10[tam-5][1]);
var ultimos4media10 = (SMAresul10[tam-5][1] + SMAresul10[tam-4][1] +SMAresul10[tam-3][1] +SMAresul10[tam-2][1]) /4 ;
var ultimos8a4media10 = (SMAresul10[tam-9][1] + SMAresul10[tam-8][1] +SMAresul10[tam-7][1] +SMAresul10[tam-6][1]) /4 ;


var ultimos4media100 = (SMAresul100[tam-5][1] + SMAresul100[tam-4][1] +SMAresul100[tam-3][1] +SMAresul100[tam-2][1]) /4 ;
var ultimos8a4media100 = (SMAresul100[tam-9][1] + SMAresul100[tam-8][1] +SMAresul100[tam-7][1] +SMAresul100[tam-6][1]) /4 ;

if (  ( ultimos4media10 > ultimos4media100 ) &&   ( ultimos8a4media10 < ultimos8a4media100 )) {
// Cruce dice que va a subir
indcruce = "a";

console.log("cruce alta");

}else{


if (  ( ultimos4media10 < ultimos4media100 ) &&   ( ultimos8a4media10 > ultimos8a4media100 )) {
// Cruce dice que va a bajar
console.log("cruce baja");
indcruce = "b";

}else{
indcruce = "n";
// cruce dice neutro
}

}





var macdresul = calcMACDf (puntosx,puntosy,100);

var mc ;
mc = macdresul;


tam = macdresul.length-1;


var ultimos4macd = (mc[tam-5][1] + mc[tam-4][1] +mc[tam-3][1] +mc[tam-2][1]) /4 ;
var ultimos8macd = (mc[tam-9][1] + mc[tam-8][1] +mc[tam-7][1] +mc[tam-6][1]) /4 ;


if ( ultimos4macd > 0 && ultimos8macd < 0 ) {
// macd dice que va a subir
indmacd = "a";
console.log("macd alta");
}else{

if ( ultimos4macd < 0 && ultimos8macd > 0 ) {
console.log("macd vende");
indmacd = "b";
// vendete todo flaco 



}else{
indmacd = "n";
}

}

console.log(i);
console.log(syms[0]);


$$('#divind').append(agregarsymboloconindicador(symtest,indmacd,indtrend,indcruce));



return ;
   
   
 });

	//	rta=rta + "<li class='item-content'><div class='item-inner'><div class='item-title'><a class='tickers_simbol' data='" + syms[i]  + "' href='#'>" + syms[i] + "</a></div></div></li>";
//return ;
// despues sacar esta

		}
		$("#tickers_listado").html(rta);
		
		$(".tickers_simbol").click(function(){
			
			var symb=$(this).attr("data");
			
			mainView.router.loadPage("chart.html");
			
		});
		
		
	});
 
 
 
 }
 
 
 if (page.url=="estrategias.html"){
  
 var agid=  B4A.CallSub("getid",false);
 if (agid != ""){
setestrategia(agid); 
 //ppppppppppppphhhhhhhhhhhhhhhhh
 
 }
  
  
  function cargarestrategias(){
  

  var misestr = localStorage.getItem("stmisestrategias")
  
  if (misestr){
  //aaaaaaaaaaaaaaaaa
  
  var jestra = JSON.parse(misestr);
  $$('#ulmisestrategias').html("");
 
  $.each( jestra, function( key, val ) {
  var escompartir =  "<p><a href='' id='comp" + key +"' style='margin-bottom: 0px;margin-top: -8px;'  class='button'>COMPARTIR</a></p>";
  var escompartirqr =  "<p><a href='' id='compqr" + key +"' style='margin-bottom: 0px;margin-top: -8px;'  class='button'>QR</a></p>";
  
  var esborrar  =  "<p><a href='' style='margin-bottom: 0px;margin-top: -8px;'  class='button'>X</a></p>";
  
	var  esicono=  "<div style='height: 30px;width: 30px;border-radius: 50%;border-width: 2px;border-color: lightskyblue;border-style: solid;'></div>";
			var liestrategia =  " <li class='item-content'>" + 
        "  <div class='item-media'>"+ esicono + "</div>" + 
         " <div class='item-inner'>" + 
          "  <div id='" + key + "' class='item-title'>"+ key  +"</div>" + 
           " <div class='item-after'>"+escompartir+ escompartirqr + "</div>" + 
		  
		   
          "</div>" + 
      "  </li>" ;
	  
$$('#ulmisestrategias').append(liestrategia);


$('#comp' + key ).on('click', function() {

  var misestrqr = localStorage.getItem("stmisestrategias")
  var jestra = JSON.parse(misestrqr);

  
console.log(" llamar al basic4android y pasarle");
//tttttttttttttttttttttttttt
	
$.ajax({
		url: "http://104.131.109.227/apptrading/compartir/gc.php?callback=?&id=" + key + "&dato="  + JSON.stringify(jestra[key]) ,
		jsonp: "callback",
		dataType: "jsonp"
		})
		.done(function( data ) {
		
		
			if (data.error==0){
			
								  
			B4A.CallSub('compartirPedido',true,key);
								  
	
			}
			
		})

		



});

$('#compqr' + key ).on('click', function() {
$('#qrcode'  ).html(" <br>");

 qrcode = new QRCode('qrcode' , {
    text: "asdad",
});


  var misestrqr = localStorage.getItem("stmisestrategias")
  var jestra = JSON.parse(misestrqr);
  
  
qrcode.clear(); // clear the code.
//qrcode.makeCode(JSON.stringify(jestra[key]));
qrcode.makeCode("http://bilandapp.com/" +  key);


 myApp.popup('.popup-abou');
 
});

$('#' + key ).on('click', function() {
var jestra1 = JSON.parse(localStorage.getItem("stmisestrategias"));
  
  $('#nameestra').val(key);
  
$('#builder-basic').queryBuilder({
  plugins: ['bt-tooltip-errors'],
  
  filters: [ {
    id: 'simbolo',
    label: 'Simbolo',
    type: 'integer',
    input: 'select',
    values: {
      1: 'DOMar16',
      2: 'ORONov15',
      3: 'I.MERVMar16',
      4: 'SEFAgo15',
      5: 'SEMay16',
      6: 'SOYAbr16',
	  7: 'AA17Dic15',
      8: 'AO16Feb16',
      9: 'DONov15 BS1',
      10: 'DOJul16',
      11: 'DOJun16',
      12: 'WTINov15'
    },
    operators: ['equal']
  }, {
    id: 'iIndice',
    label: 'Indice',
    type: 'integer',
    input: 'select',
    values: {
      1: 'S&P 500',
      2: 'Nasdaq',
      3: 'Bovespa',
      4: 'Dow 30',
      5: 'EuroStoxx 50',
      6: 'Nikkei 225'
    },
    operators: ['equal']
  }, {
    id: 'Precio',
    label: 'Precio',
    type: 'double',
    validation: {
      min: 0,
      step: 0.01
    }
  },
  {
    id: 'Divisa',
    label: 'Divisa',
    type: 'integer',
    input: 'select',
    values: {
      1: 'USD/EUR',
      2: 'USD/YEN',
      3: 'USD/CAD',
      4: 'USD/GBP',
      5: 'EUR/GBP',
      6: 'USD/AUS'
    }
	}
	, {
    id: 'qmacd',
    label: 'MACD',
    type: 'integer',
    input: 'select',
    values: {
      1: 'ALZA',
      2: 'NEUTRO',
      3: 'BAJA'
    }
	}
	, {
    id: 'qcruce',
    label: 'CRUCE MEDIAS',
    type: 'integer',
    input: 'select',
    values: {
      1: 'ALZA',
      2: 'NEUTRO',
      3: 'BAJA'
    }
	}
	,{
    id: 'Qqtendencia',
    label: 'Tendencia',
    type: 'integer',
    input: 'select',
    values: {
		1: 'ALZA',
      2: 'NEUTRO',
      3: 'BAJA'
    }
	}
  ],

  rules: jestra1[key]
});


    myApp.showTab('#tab2');
 
});
 
			
			;
		});
  
  }
  
  
  }
  
$$('#tab2a').on('click', function () {
console.log("entro");
var nueva = {"condition":"OR","rules":[{"id":"Precio","field":"Precio","type":"double","input":"text","operator":"less","value":"10.25"},{"condition":"OR","rules":[{"id":"Precio","field":"Precio","type":"double","input":"text","operator":"equal","value":"2"},{"id":"iIndice","field":"iIndice","type":"integer","input":"select","operator":"equal","value":"1"}]}]};

$('#builder-basic').queryBuilder({
  plugins: ['bt-tooltip-errors'],
  
  filters: [ {
    id: 'simbolo',
    label: 'Simbolo',
    type: 'integer',
    input: 'select',
    values: {
      1: 'DOMar16',
      2: 'ORONov15',
      3: 'I.MERVMar16',
      4: 'SEFAgo15',
      5: 'SEMay16',
      6: 'SOYAbr16',
	  7: 'AA17Dic15',
      8: 'AO16Feb16',
      9: 'DONov15 BS1',
      10: 'DOJul16',
      11: 'DOJun16',
      12: 'WTINov15'
    },
    operators: ['equal']
  }, {
    id: 'iIndice',
    label: 'Indice',
    type: 'integer',
    input: 'select',
    values: {
      1: 'S&P 500',
      2: 'Nasdaq',
      3: 'Bovespa',
      4: 'Dow 30',
      5: 'EuroStoxx 50',
      6: 'Nikkei 225'
    },
    operators: ['equal']
  }, {
    id: 'Precio',
    label: 'Precio',
    type: 'double',
    validation: {
      min: 0,
      step: 0.01
    }
  },
  {
    id: 'Divisa',
    label: 'Divisa',
    type: 'integer',
    input: 'select',
    values: {
      1: 'USD/EUR',
      2: 'USD/YEN',
      3: 'USD/CAD',
      4: 'USD/GBP',
      5: 'EUR/GBP',
      6: 'USD/AUS'
    }
	}
	, {
    id: 'qmacd',
    label: 'MACD',
    type: 'integer',
    input: 'select',
    values: {
      1: 'ALZA',
      2: 'NEUTRO',
      3: 'BAJA'
    }
	}
	, {
    id: 'qcruce',
    label: 'CRUCE MEDIAS',
    type: 'integer',
    input: 'select',
    values: {
      1: 'ALZA',
      2: 'NEUTRO',
      3: 'BAJA'
    }
	}
	,{
    id: 'Qqtendencia',
    label: 'Tendencia',
    type: 'integer',
    input: 'select',
    values: {
		1: 'ALZA',
      2: 'NEUTRO',
      3: 'BAJA'
    }
	}
  ],

  rules: nueva	
});



    myApp.showTab('#tab1');
});
  
 

 

$('#estrategialimpiar').on('click', function() {
  $('#builder-basic').queryBuilder('reset');
  
  
  
});

$('#estrategiaset').on('click', function() {
console.log("borrar");

 
 $('#builder-basic').queryBuilder('reset');
 

  var misestr4 = localStorage.getItem("stmisestrategias")
  
  var jestra4 = JSON.parse(misestr4);  
  
  
  delete jestra4[$('#nameestra').val()];
  localStorage.setItem("stmisestrategias", JSON.stringify(jestra4));
 
  cargarestrategias();

    myApp.showTab('#tab1');  
  
});

console.log("linkeaaaa");
$('#estrategiaguardar').on('click', function() {
console.log("guardar");

  var result = $('#builder-basic').queryBuilder('getRules');
  
  if (!$.isEmptyObject(result)) {
  var jest = {};
  if (localStorage.getItem("stmisestrategias")){
 var jest  = JSON.parse(localStorage.getItem("stmisestrategias"));
  }else{
  
  }
  
  console.log($('#nameestra').val())

  jest[$('#nameestra').val()] = result;
  
   console.log( jest)
  localStorage.setItem("stmisestrategias", JSON.stringify(jest));
 
  cargarestrategias();
    myApp.showTab('#tab1');
  }
});

 

cargarestrategias();

 }
 if (page.url=="chartindicador.html")
 {
 
 
 

 
		
	

 
 
  if (actualsymbol=="") actualsymbol = "DOMar16";
 
 
 
 function cargarchartindicador(data1) {
    $(function() {
	
	var mh = data1["marketDataH"];
	
	var data =[];
	
	jQuery.each(mh, function(i, val) {
	
	 
	var punto  = [];
	var d1 = new Date(val.datetime)
  punto[0] = Math.floor(d1);
  punto[1] = parseFloat(val.price) + 0;
 data.push(punto);

  
  
});
	
	console.log(data);
	
        $('#chartind').highcharts('StockChart', {

            title : {
                text : 'MACD - Cruce EMA (40/15) - Tendencia'
            },
   
            yAxis: [{
                title: {
                    text: 'Price'
                },
                height: 200,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            }, {
                title: {
                    text: 'MACD'
                },
                top: 300,
                height: 100,
                offset: 0,
                lineWidth: 2
            }],
            
            tooltip: {
                crosshairs: true,
                shared: true
            },
            
            rangeSelector : {
                selected : 1
            },

            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                    }
                }
            },
            
            series : [{
                name: 'AAPL Stock Price',
                type : 'line',
                id: 'primary',
                data : data
            }, {
                name : 'MACD',
                linkedTo: 'primary',
                yAxis: 1,
                showInLegend: true,
                type: 'trendline',
                algorithm: 'MACD'

            }, {
                name : 'Signal line',
                linkedTo: 'primary',
                yAxis: 1,
                showInLegend: true,
                type: 'trendline',
                algorithm: 'signalLine'

            }, {
                name: 'Histogram',
                linkedTo: 'primary',
                yAxis: 1,
                showInLegend: true,
                type: 'histogram'

            }, {
                name: 'Linear Trendline',
                linkedTo: 'primary',
                showInLegend: true,
                enableMouseTracking: false,
                type: 'trendline',
                algorithm: 'linear'
            }, {
                name: '15-day EMA',
                linkedTo: 'primary',
                showInLegend: true,
                type: 'trendline',
                algorithm: 'EMA',
                periods: 15
            }, {
                name: '40-day EMA',
                linkedTo: 'primary',
                showInLegend: true,
                type: 'trendline',
                algorithm: 'EMA',
                periods: 40
            }]
        });
    });
}

	
get("Trades/"+ actualsymbol + "/2015-10-10/2015-11-20",1,function(data2){
   console.log("HISTORICO");
   cargarchartindicador(data2);
   console.log(data2);
 });

	$("#btnatr").click(function(e){
	e.preventDefault();
			 chart1 =  $('#chart').highcharts();	
});




$$('.open-about').on('click', function () {
console.log("popu");
  myApp.popup('.popup-about');
});



 }
	    

	
 if (page.url=="chart.html")
 {
 
$$('#lupita').on('click', function () {
console.log("popu");
 mainView.router.loadPage("tickers.html");

});
 
 
 

 function cargarchart(data1) {
    $(function() {
	
	var mh = data1["marketDataH"];
	
	if (data1.status == "ERROR") {
	
		  myApp.alert("No hay datos diposibles para el simbolo " + actualsymbol,"Rofex");
	mainView.router.loadPage("tickers.html");
	return;
	}
	
	var data =[];
	
	jQuery.each(mh, function(i, val) {
	
	 
	var punto  = [];
	var d1 = new Date(val.datetime)
  punto[0] = Math.floor(d1);
  punto[1] = parseFloat(val.price) + 0;

  
  //data.push(punto);
  
  	var x=punto[0];
			var y =	 punto[1];
			if( ultimocierre == 0  ){
				
				ultimocierre = parseFloat(y);
			}

				if (ultimocierre>parseFloat(y))
				{
					//series.addPoint([x, ultimocierre,ultimocierre,y,y],false);
					data.push([ parseFloat(x),ultimocierre,ultimocierre,parseFloat(y),parseFloat(y)]);	
				}else{
					data.push([parseFloat( x),ultimocierre,parseFloat(y),ultimocierre,parseFloat(y)]);	
					//series.addPoint([x, ultimocierre,y,ultimocierre,y],false);
				}
				
				ultimocierre = parseFloat(y); 
	
				
				
  
});
	
	
	
        $('#chart').highcharts('StockChart', {

            title : {
                text :  actualsymbol ,
				style: {
                color: '#87CEFA',
                fontWeight: 'bold'
            }
            },
   plotOptions: {
 candlestick: {
            color: 'red',
            upColor: 'green	'
        }
    },
            yAxis: [{
                title: {
                    text: 'Price'
                },
                height: 200,
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            }, {
                title: {
                    text: 'Precio'
                },
                top: 300,
                height: 100,
                offset: 0,
                lineWidth: 2
            }],
            
            tooltip: {
                crosshairs: true,
                shared: true
            },
            	rangeSelector: {
         buttons: [{
              count: 1,
              type: 'day',
              text: '1D'
          },{
              count: 2,
              type: 'day',
              text: '2D'
          }, {
              count: 10,
              type: 'day',
              text: '6D'
          }, 
		  {
              type: 'all',
              text: 'All'
          }], 
          inputEnabled: false,
          selected: 4
      }
       ,

            legend: {
                enabled: false,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },

            plotOptions: {
                series: {
                    marker: {
                        enabled: false,
                    }
                }
            },
             exporting: {
            buttons: {
                customButton: {
                    x: -42,
					symbolFill: "#87CEFA",
                    text: "Indicadores",
                    onclick: function () {
					mainView.router.loadPage("chartindicador.html");        
					},
                    symbol: 'circle'
                }
            }
        },
            series : [{
                name: actualsymbol,
                type : 'candlestick',
                id: 'idchartprincipal',
                data : data,
				  dataGrouping: {                      
		                        enabled: true,
		                        forced: true,
		                        smoothed:true,
		                        units: [[
                                    'day',
                                    [1]
		                        ], [
	                                'day',
	                                [5]
		                        ], [
	                                'day',
	                                [10]
		                        ]]
		                    }
            }]
        });
    });
}

if (actualsymbol=="") actualsymbol = "DOMar16";

	//franco
get("Trades/" +  actualsymbol +"/2015-10-10/2015-11-20",1,function(data2){
   cargarchart(data2);
 });
	


	
	get("marketdata/get?marketId=ROFX&symbol="+ actualsymbol  +"&entries=BI,OF",0,function(data){
if ( data.marketData.BI[0] ){
globalBI = data.marketData.BI[0].price;

globalOF = data.marketData.OF[0].price;
    $("#btncompra").html("BUY " + data.marketData.OF[0].price );
	      $("#btnventa").html("SELL " + data.marketData.BI[0].price );	   
		  
		  }else{
		  
//		  myApp.alert("No hay datos diposibles para el simbolo " + actualsymbol,"Rofex");
	
//mainView.router.loadPage("tickers.html");
	
		  }
 });
	
$$('#btnindicadores').on('click', function () {
console.log("lanza pantalla de indicadores");
//  myApp.popup('.popup-about');
});

$$('#btncompra').on('click', function () {

$("#modalsymbolo").val(actualsymbol);
 $("#modalprecio").val(globalBI);
 
 $("#modalside").val("Buy");

 myApp.loginScreen() ;

 
 });



$$('#btncompragatillo').on('click', function () {
$("#modalsymbolo").val(actualsymbol);
 $("#modalprecio").val(globalBI);
 $("#modalside").val("Buy");
 var urlgetnew;
 urlgetnew = "order/newSingleOrder?marketId=ROFX&symbol=" +  actualsymbol + "&price=" + globalBI  + 
	"&orderQty=" +conf_cantidad  +"&ordType=" +  conf_tipo   + "&side="+ "Buy"   + "&timeInForce=" + conf_timeInForce    + "&account="+globalacount;
	console.log(urlgetnew);
	get(urlgetnew,0,function(data){
	console.log(data);
	if (data.status == "OK"){
	myApp.alert("Transaccion realizada con Exito","Rofex");
	shareOperacion(  "Buy" , actualsymbol,globalBI,10  );
	console.log("se termino de llamar");
	}else{
	myApp.alert("Hubo un error en la transaccion","Rofex");
	}
	});
 });

 
 $$('#btnventagatillo').on('click', function () {
$("#modalsymbolo").val(actualsymbol);
 $("#modalprecio").val(globalBI);
 $("#modalside").val("Sell");
 var urlgetnew;
 urlgetnew = "order/newSingleOrder?marketId=ROFX&symbol=" +  actualsymbol + "&price=" + globalBI  + 
	"&orderQty=" +conf_cantidad  +"&ordType=" +  conf_tipo   + "&side="+ "Sell"   + "&timeInForce=" + conf_timeInForce    + "&account="+globalacount;
	console.log(urlgetnew);
	get(urlgetnew,0,function(data){
	console.log(data);
	if (data.status == "OK"){
	myApp.alert("Transaccion realizada con Exito","Rofex");
	shareOperacion(  "Buy" , actualsymbol,globalBI,10  );
	console.log("se termino de llamar");
	}else{
	myApp.alert("Hubo un error en la transaccion","Rofex");
	}
	});
 });



 
 
$$('#modalaceptar').on('click', function () {
 
 //order/newSingleOrder?marketId=ROFX&symbol=DOEne15&price=12.01&orderQty=2400&ordType=Limit&side=Buy&timeInForce=Day&account=30
 
 var urlgetnew;
 
 urlgetnew = "order/newSingleOrder?marketId=ROFX&symbol=" +  $("#modalsymbolo").val() + "&price=" + $("#modalprecio").val()  + 
	"&orderQty=" +$("#modalcantidad").val()   +"&ordType=" +  $("#modaltipo").val()   + "&side="+ $("#modalside").val()   + "&timeInForce=" + $("#modaltimeInForce").val()    + "&account="+globalacount;
	console.log(urlgetnew);
	
	get(urlgetnew,0,function(data){
	console.log(data);
	
	if (data.status == "OK"){
	myApp.alert("Transaccion realizada con Exito","Rofex");
	
	shareOperacion( $("#modalside").val() , $("#modalsymbolo").val(),$("#modalprecio").val(),$("#modalcantidad").val()  );
	console.log("se termino de llamar");
	
	}else{
	myApp.alert("Hubo un error en la transaccion","Rofex");
	
	}
	
	});
 
 myApp.closeModal();
 
 
});


$$('#btnventa').on('click', function () {
 

 
$("#modalsymbolo").val(actualsymbol);
 $("#modalprecio").val(globalOF);
 $("#modalside").val("Sell");

 
 myApp.loginScreen() ;


});






 }
	    

	
	
	});	
	
	document.addEventListener('touchmove', function(event) {
	   if(event.target.parentNode.className.indexOf('navbarpages') != -1 || event.target.className.indexOf('navbarpages') != -1 ) {
		event.preventDefault(); }
	}, false);
	