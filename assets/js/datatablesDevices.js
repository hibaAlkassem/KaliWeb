/* Webarch Admin Dashboard 
/* This JS is only for DEMO Purposes - Extract the code that you need
-----------------------------------------------------------------*/	
/* Set the defaults for DataTables initialisation */
var oTable;
$.extend( true, $.fn.dataTable.defaults, {
	"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span12'p i>>",
	"sPaginationType": "bootstrap",
	"oLanguage": {
		"sLengthMenu": "_MENU_"
	}
} );


/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sWrapper": "dataTables_wrapper form-inline"
} );


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    oSettings._iDisplayLength === -1 ?
			0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};


/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).addClass('pagination').append(
				'<ul>'+
					'<li class="prev disabled"><a href="#"><i class="fa fa-chevron-left"></i></a></li>'+
					'<li class="next disabled"><a href="#"><i class="fa fa-chevron-right"></i></a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, ien=an.length ; i<ien ; i++ ) {
				// Remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );


/*
 * TableTools Bootstrap compatibility
 * Required TableTools 2.1+
 */

	// Set the classes that TableTools uses to something suitable for Bootstrap
	$.extend( true, $.fn.DataTable.TableTools.classes, {
		"container": "DTTT ",
		"buttons": {
			"normal": "btn btn-white",
			"disabled": "disabled"
		},
		"collection": {
			"container": "DTTT_dropdown dropdown-menu",
			"buttons": {
				"normal": "",
				"disabled": "disabled"
			}
		},
		"print": {
			"info": "DTTT_print_info modal"
		},
		"select": {
			"row": "active"
		}
	} );

	// Have the collection use a bootstrap compatible dropdown
	$.extend( true, $.fn.DataTable.TableTools.DEFAULTS.oTags, {
		"collection": {
			"container": "ul",
			"button": "li",
			"liner": "a"
		}
	} );
	
$(".select2-wrapper").select2({minimumResultsForSearch: -1});	

/* Table initialisation */
$(document).ready(function() {
    var responsiveHelper = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone : 480
    };    
	var tableElement = $('#example');

    tableElement.dataTable( {
		"sDom": "<'row'<'col-md-6'l T><'col-md-6'f>r>t<'row'<'col-md-12'p i>>",
			"oTableTools": {
			"aButtons": [
				{
					"sExtends":    "collection",
					"sButtonText": "<i class='fa fa-cloud-download'></i>",
					"aButtons":    [ "csv", "xls", "pdf", "copy"]
				}
			]
		},
		"sPaginationType": "bootstrap",
		 "aoColumnDefs": [
          { 'bSortable': false, 'aTargets': [ 0 ] }
		],
		"aaSorting": [[ 1, "asc" ]],
		"oLanguage": {
			"sLengthMenu": "_MENU_ ",
			"sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
		},
		 bAutoWidth     : false,
        fnPreDrawCallback: function () {
            // Initialize the responsive datatables helper once.
            if (!responsiveHelper) {
                responsiveHelper = new ResponsiveDatatablesHelper(tableElement, breakpointDefinition);
            }
        },
        fnRowCallback  : function (nRow) {
            responsiveHelper.createExpandIcon(nRow);
        },
        fnDrawCallback : function (oSettings) {
            responsiveHelper.respond();
        }
	});
	
	$('#example_wrapper .dataTables_filter input').addClass("input-medium "); // modify table search input
    $('#example_wrapper .dataTables_length select').addClass("select2-wrapper span12"); // modify table per page dropdown

	
	
	$('#example input').click( function() {
        $(this).parent().parent().parent().toggleClass('row_selected');
    });
	
	
	$('#quick-access .btn-cancel').click( function() {
		$("#quick-access").css("bottom","-115px");
    });
	$('#quick-access .btn-add').click( function() {
		fnClickAddRow();
		$("#quick-access").css("bottom","-115px");
    });
	
    /*
     * Insert a 'details' column to the table
     */
    //var nCloneTh = document.createElement( 'th' );
    //var nCloneTd = document.createElement( 'td' );
    //nCloneTd.innerHTML = '<i class="fa fa-plus-circle"></i>';
    //nCloneTd.className = "center";
     
    //$('#example2 thead tr').each( function () {
    //    this.insertBefore( nCloneTh, this.childNodes[0] );
    //} );
     
    //$('#example2 tbody tr').each( function () {
    //    this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    //} );
     

     oTable = $('#datatable_devices').dataTable({
         "bFilter": false,
         "bServerSide": false,
         "iDisplayLength": 25,
         "aLengthMenu": [[5, 10, 25, 50, 10000], [5, 10, 25, 50, "All"]],
         "sDom": "<'row'<'col-md-10'f <'insight_toolbar'>><'col-md-2'l >r>t<'row'<'col-md-12'p i >>",
         
         "aaSorting": [[1, "desc"]],
         "oLanguage": {
             "sLengthMenu": "_MENU_ ",
             "sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
         },
         "fnDrawCallback": showGraphs(),
         "createdRow": console.log("created row"),
     });
     oTable.fnSetColumnVis(4, false);

     $("div.insight_toolbar").html('<a class="btn btn-white datatable_buttons tip play" data-toggle="tooltip" title="" data-original-title="Click to resume real time stream"  id="play" name="Play"  href="#"><i class="fa fa-play"></i> Play</a><a id="ButtonExport1" class="btn btn-white download_margin datatable_buttons"><i class="fa fa-cloud-download"></i> Download</a>');

     $('#datatable_devices').on('draw.dt', function () {
         console.log('Redraw occurred at: ' + new Date().getTime());
         showGraphs();
     });

    var timerId = 0;
    $('#play').click(function () {
        console.log("click Play");
        var myClasses = this.classList;
        if (myClasses[4] == 'play') {
            $(this).html('<i class="fa fa-pause"></i> Pause');
            $(this).removeClass("play");
            $(this).addClass('pause');
            $(this).attr('data-original-title', 'Click to hold real time stream')
            timerId = window.setInterval(function () {
                tryRefresh();
            }, 20000);
        }
        else {
            $(this).html('<i class="fa fa-play"></i> Play');
            $(this).removeClass("pause");
            $(this).addClass('play');
            $(this).attr('data-original-title', 'Click to resume real time stream')
            clearInterval(timerId);
        }
    });
    
    var openRows = 0;
    function tryRefresh() {
        if (openRows < 1) {
            console.log("UpdateTable");
            oTable.fnReloadAjax();
        }
        else {
            console.log("NoUpdateTable");
        }
    }

    $("#play").trigger("click");

    $('#ButtonExport1').click(function () {
        window.location.href = "ExportFiles.aspx?type=Dev";
    });

	 
	$("div.toolbar").html('<div class="table-tools-actions"><button class="btn btn-primary" style="margin-left:12px" id="test2">Add</button></div>');
	
	$('#test2').on( "click",function() {
		$("#quick-access").css("bottom","0px");
    });
	
	$('#example2_wrapper .dataTables_filter input').addClass("input-medium ");
    $('#example2_wrapper .dataTables_length select').addClass("select2-wrapper span12"); 
	
	$('#example3_wrapper .dataTables_filter input').addClass("input-medium ");
    $('#example3_wrapper .dataTables_length select').addClass("select2-wrapper span12"); 
	

    //$('#datatable_devices tbody td i').live('click', function () {

    //    var nTr = $(this).parents('tr')[0];
    //    if (oTable.fnIsOpen(nTr)) {
    //        /* This row is already open - close it */
    //        $(this).removeClass("fa-minus-circle");
    //        $(this).addClass("fa-plus-circle");


    //        oTable.fnClose(nTr);
    //    }
    //    else {
    //        /* Open this row */
    //        $(this).removeClass("fa-plus-circle");
    //        $(this).addClass("fa-minus-circle");
    //        oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
    //        showDetailGraph();
    //    }
    //});


    $('#datatable_devices tbody tr').live('click', function (event) {
        var nTr = $(this)[0];
        var countTD = $("datatable_devices tr:first > td").length
        console.log('number of children:' + countTD);
        if (oTable.fnIsOpen(nTr)) {
            /* This row is already open - close it */
            $(this).find("i").removeClass("fa-minus-circle");
            $(this).find("i").addClass("fa-plus-circle");
            openRows--;
            oTable.fnClose(nTr);
        }
        else {
            /* Open this row */
            $(this).find("i").removeClass("fa-plus-circle");
            $(this).find("i").addClass("fa-minus-circle");
            openRows++;
            console.log('open rows:' + openRows);
            oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
        }
    });
	
		$(".select2-wrapper").select2({minimumResultsForSearch: -1});

	function fnClickAddRow() {
    $('#example3').dataTable().fnAddData( [
        $("#val1 option:selected").text(),
        $("#val2 option:selected").text(),
        "Windows",
        "789.","A" ] );     
	}	

fillDevicesTable(devicesData);
});

/* Formating function for row details */
function fnFormatDetails(oTable, nTr) {
    var aData = oTable.fnGetData(nTr);

    //var sOut = '<table cellpadding="2" cellspacing="0" border="0" style="margin-left:50px;" class="inner-table">';
    //sOut += '<tr><td><strong>Status:</strong></td><td></td></tr>';
    //sOut += '<tr><td><strong>Type:</strong></td><td></td></tr>';
    //sOut += '<tr><td><strong>First use:</strong></td><td></td></tr>';
    //sOut += '<tr><td><strong>Proximity Sensor:</strong></td><td></td></tr>';
    //sOut += '<tr><td><strong>Position sensor:</strong></td><td></td></tr>';
    //sOut += '<tr><td><strong>Pressure sensor:</strong></td><td></td></tr>';
    //sOut += '<tr><td><strong>Battery:</strong></td><td></td></tr>';
    //sOut += '</table>';
    var sOut = 'missing data';

    $.ajax({
        url: config_apiserver + "/api/device/bykey/" + aData[4],
        //force to handle it as text
        dataType: "text",
        async: true,
        success: function (data) {
var tdstyle = "style='padding-top: 0px !important; padding-bottom: 0px !important'";
	var result;
	   result = "<table cellpadding='2' cellspacing='0' border='0' style='margin-left:50px;' class='inner-table'>";

            result += "<tr><td " + tdstyle + "><strong>Status:</strong></td><td " + tdstyle + ">" + data.DeviceStatus + "</td></tr>";
            result += "<tr><td "+tdstyle+"><strong>Type:</strong></td><td "+tdstyle+">ID: /device/eyedropper/000000021</td></tr>";
            result += "<tr><td " + tdstyle + "><strong></strong></td><td " + tdstyle + ">" + data.DeviceTypeName + "</td></tr>";
            result += "<tr><td "+tdstyle+"><strong>First use:</strong></td><td "+tdstyle+">May 28, 2014 08:14:55 AM</td></tr>";
            result += "<tr><td "+tdstyle+"><strong>Proximity Sensor:</strong></td><td "+tdstyle+">ID: /modelid/0000001</td></tr>";
            result += "<tr><td "+tdstyle+"><strong></strong></td><td "+tdstyle+">Last state: 0</td></tr>";
            result += "<tr><td "+tdstyle+"><strong>Position sensor:</strong></td><td "+tdstyle+">ID: /modelid/000000002</td></tr>";
            result += "<tr><td "+tdstyle+"><strong></strong></td><td "+tdstyle+">Last state X: 125</td></tr>";
            result += "<tr><td "+tdstyle+"><strong></strong></td><td "+tdstyle+">Last state Y: 0</td></tr>";
            result += "<tr><td "+tdstyle+"><strong></strong></td><td "+tdstyle+">Last state Z: 180</td></tr>";
            result += "<tr><td "+tdstyle+"><strong>Pressure sensor:</strong></td><td "+tdstyle+">ID: /modelid/00000000003</td></tr>";
            result += "<tr><td "+tdstyle+"><strong></strong></td><td "+tdstyle+">Last state: 421</td></tr>";
            result += "<tr><td "+tdstyle+"><strong>Battery:</strong></td><td "+tdstyle+">ID: /modelid/000000000012</td></tr>";
            result += "<tr><td " + tdstyle + "></td><td " + tdstyle + ">3.6V Li</td></tr>";
            result += "<tr><td " + tdstyle + "></td><td " + tdstyle + ">Last state: 10%</td></tr>";
            result += "<tr><td "+tdstyle+"></td> <td "+tdstyle+"><div class='customer-sparkline-details' id='sparkgraph1' data-sparkline-color='#f35958' data-sparkline-type='line'><!-- 1,2,3,5,4,6,5,4,4,4,5,4,6,6,5,6,4 --></div></td></tr> ";
            result += "</table>";
		console.log(aData[4]);
		
            sOut = result;
        }
    });
    return sOut;
}

function showGraphs() {
    //console.log('asd');
    //$("#customer-sparkline").sparkline([5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
    //    type: 'bar'
    //});

    $('.customer-sparkline').each(function () {
        $(this).sparkline('html', { type: $(this).attr("data-sparkline-type"), barColor: $(this).attr("data-sparkline-color"), enableTagOptions: true });
    });
    $("[data-toggle='tooltip']").tooltip();
}


function showDetailGraph() {
    $('.customer-sparkline-details').each(function () {
        $(this).sparkline('html', { type: $(this).attr("data-sparkline-type"), barColor: $(this).attr("data-sparkline-color"), enableTagOptions: true });
    });

}
