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

var lastid = 0;
var paused = 1;
var oTable;
var myActivitiesArray = [];
var loaded = 0;
/* Table initialisation */
$(document).ready(function () {
    jQuery("abbr.timeago").timeago();
    var responsiveHelper = undefined;
    var breakpointDefinition = {
        tablet: 1024,
        phone : 480
    };    
	
	
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
    var nCloneTh = document.createElement( 'th' );
    var nCloneTd = document.createElement( 'td' );
    nCloneTd.innerHTML = '<i class="fa fa-plus-circle"></i>';
    nCloneTd.className = "center";
     
    $('#datatable_activities thead tr').each(function () {
        this.insertBefore( nCloneTh, this.childNodes[0] );
    } );
     
    $('#datatable_activities tbody tr').each(function () {
        this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    } );
     
    /*
     * Initialse DataTables, with no sorting on the 'details' column
     */
    oTable = $('#datatable_activities').dataTable({
        "iDisplayLength": 25,
        "aLengthMenu": [[5, 10, 25, 50, 10000], [5, 10, 25, 50, "All"]],
        "sDom": "<'row'<'select-toolbar filter-texts col-md-8' ><'col-md-4  toolbar-direction' l <'insight_toolbar'>  >r>t<'row'<'col-md-12'p i >>",
        "aaSorting": [[1, "desc"]],
        "oLanguage": {
            "sLengthMenu": "_MENU_ ",
            "sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries",
        },
        "aoColumnDefs": [
                            { "sWidth": "90px", "aTargets": [0] },
                            { "bVisible": false, "aTargets": [4] },
                            { "bVisible": false, "aTargets": [5] }
        ],
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            var s = '<span class="hidden"> ' + aData[1] + ' </span> <abbr class="timeago tip" data-toggle="tooltip" title="' + aData[1] + ' UTC">' + getDate(aData[1]) + '</abbr>';
            $('td:eq(1)', nRow).html(s);
        },
        "fnDrawCallback": console.log("Draw Done"),
	});

	//lastid = oTable.fnGetData($('#example_table tbody tr:eq(0)')[0])[4];
	//console.log(lastid);
	//oTable.fnSetColumnVis(4, false);

	$("div.insight_toolbar").html(
        '<a visible="true" id="ButtonExport1" class="btn btn-white download_margin datatable_buttons">Download <i class="fa fa-cloud-download icon-margin"></i></a>' +
        '<a class="btn btn-white tip datatable_buttons play" data-toggle="tooltip" title="" data-original-title="Click to resume real time stream" id="play" name="Play"  href="#"> Play <i class="fa fa-play icon-margin"></i></a>');

	var timerId = 0;
	$('#play').click(function () {
	    //console.log("click Play");
	    var myClasses = this.classList;
	    if (myClasses[4] == 'play') {
	        paused = 0;
	        $(this).html('Pause <i class="fa fa-pause icon-margin"></i>');
	        $(this).removeClass("play");
	        $(this).addClass('pause');
	        $(this).attr('data-original-title', 'Click to hold real time stream')
	        addArrayItems();
	        $("[data-toggle='tooltip']").tooltip();
	    }
	    else {
	        paused = 1;
	        $(this).html('Play <i class="fa fa-play icon-margin"></i>');
	        $(this).removeClass("pause");
	        $(this).addClass('play');
	        $(this).attr('data-original-title', 'Click to resume real time stream')
	        clearInterval(timerId);
	        $("[data-toggle='tooltip']").tooltip();
	    }
	});

    $('#ButtonExport1').click(function () {
 processActivitiesFile();

       
    });

    $('#datatable_activities tbody tr').live('click', function (event) {
        var nTr = $(this)[0];
        var nTr = $(this)[0];
        if (oTable.fnIsOpen(nTr)) {
            /* This row is already open - close it */
            $(this).find("i").removeClass("fa-minus-circle");
            $(this).find("i").addClass("fa-plus-circle");
            oTable.fnClose(nTr);
        }
        else {
            /* Open this row */
            $(this).find("i").removeClass("fa-plus-circle");
            $(this).find("i").addClass("fa-minus-circle");
            oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
        }
    });

	$("div.toolbar").html('<div class="table-tools-actions"><button class="btn btn-primary" style="margin-left:12px" id="test2">Add</button></div>');
	
	$('#datatable_activities').on('draw.dt', function () {
	   // console.log('Redraw occurred at: ' + new Date().getTime());
	    //console.log(oTable.fnGetColumnData(2));
	    //var data = oTable.fnGetData($('#example2 tbody tr:eq(0)')[1]);
	    //lastid = oTable.fnGetData($('#example2 tbody tr:eq(0)')[0])[0][5];
	    //console.log('new id is: ' + lastid);
	    //console.log(lastid = oTable.fnGetData($('#example2 tbody tr:eq(0)')[0])[0][5]);
	    $("[data-toggle='tooltip']").tooltip();
	    if (loaded == 0) {
	        loaded = 1;
	        //createSelect(oTable.fnGetColumnData(2));
	        startListening();
	    }
	});

	$('#test2').on( "click",function() {
		$("#quick-access").css("bottom","0px");
    });
	
	$('#datatable_activities_wrapper .dataTables_filter input').addClass("input-medium ");
	$('#datatable_activities_wrapper .dataTables_length select').addClass("select2-wrapper span12");
	
	$('#example3_wrapper .dataTables_filter input').addClass("input-medium ");
    $('#example3_wrapper .dataTables_length select').addClass("select2-wrapper span12"); 
	
	
    /* Add event listener for opening and closing details
     * Note that the indicator for showing which row is open is not controlled by DataTables,
     * rather it is done here
     */
    //$('#example2 tbody td i').live('click', function () {
        
    //    var nTr = $(this).parents('tr')[0];
    //    if ( oTable.fnIsOpen(nTr) )
    //    {
    //        /* This row is already open - close it */
    //        $(this).removeClass("fa-minus-circle");
    //        $(this).addClass("fa-plus-circle");

            
    //        oTable.fnClose( nTr );
    //    }
    //    else
    //    {
    //        /* Open this row */
    //        $(this).removeClass("fa-plus-circle");
    //        $(this).addClass("fa-minus-circle");
    //        oTable.fnOpen( nTr, fnFormatDetails(oTable, nTr), 'details' );
    //    }
    //});
	
		$(".select2-wrapper").select2({minimumResultsForSearch: -1});


fillActivitiesTable(activitiesHandlerData);
	
});


/* Formating function for row details */
function fnFormatDetails ( oTable, nTr )
{
    var aData = oTable.fnGetData(nTr);
    var dat = new Date(aData[1]);

    var sOut = '';
    sOut += '<div style="margin-left:70px;">';
    sOut += '<p><strong>ID:</strong> /activity/' + aData[4] + '</p>';
    sOut += '<p><strong>Reckon:</strong> /reckons/000001</p>';
    sOut += '<p><strong>Time.created:</strong> ' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + '  ' + getTimeString(dat) + '</p>';
    sOut += '<p><strong>Data:</strong></p>';

    sOut += '<div style="margin-left:50px;">';
    sOut += '<p ><strong>ID:</strong> /data/568524</p>';
    sOut += '<p ><strong>Source:</strong> ' + aData[2] + '/sensors/' + aData[5] + '</p>';
    sOut += '<p ><strong>Time.start:</strong> ' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + '  ' + getTimeString(dat) + '</p>';
    sOut += '<p ><strong>Time.end:</strong> ' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + '  ' + getTimeString(dat) + '</p>';
    sOut += '<p ><strong>Data:</strong> ' + aData[3] + '</p>';
    sOut += '</div>';

    //sOut += '<p><strong>Data:</strong></p>';

    //sOut += '<div style="margin-left:50px;">';
    //sOut += '<p >' + aData[3] + '</p>';
    //sOut += '</div>';

    sOut += '</div>';
     
    return sOut;
}


function startListening() {

    $("#play").trigger("click");
    lastid = oTable.fnGetData($('#example_table tbody tr:eq(0)')[0])[0][4];
   // console.log('started listening: lastid is' + lastid);
    var source = new EventSource(serversrc + '/GetActivities.aspx?lastid=' + lastid);


    source.onopen = function (event) {
       // console.log('Connection Opened');
    };

    source.onerror = function (event) {
       // console.log('error: ' + event.data);
    };

    source.onmessage = function (e) {
       // console.log(e.data);
        if (paused == 0) {
           // console.log('data not paused, data will be added');
            var obj = jQuery.parseJSON(e.data);
            for (var i = 0 ; i < obj.length ; i++) {
                var activity = obj[i];
                $('#datatable_activities').dataTable().fnAddData([
                    "<i class=\"fa fa-plus-circle\"></i>",
                    obj[i].TimeStamp,
                    '/devices/' + obj[i].DeviceId,
                    "<div class='innerDetails'>" + obj[i].ActivitySummary + "</div>",
                    obj[i].ActivityId,
                    obj[i].SensorId]
                  ).hidden = true;
                if (obj[i].ActivityId > lastid)
                    lastid = obj[i].ActivityId;
                //console.log('added row');

                $(".hid").fadeIn();
                $(".hid").last().fadeIn();
                $(".hid").first().fadeIn();
            }
            jQuery("abbr.timeago").timeago();
        }
        else {
           // console.log('data paused nothing added');
            showErrorMessage('New activities available, press Play to show them');
            myActivitiesArray.push(e.data);
        }
    }
}
//window.addEventListener("DOMContentLoaded", contentLoaded, false);

function showTimeago() {
    jQuery("abbr.timeago").timeago();
}

$('#example2').on('draw.dt', function () {
    showTimeago();
});

function addArrayItems() {

    //console.log('array length: ' + myActivitiesArray.length);
    //console.log('array content: ' + myActivitiesArray.toString());
    for (var j = 0; j < myActivitiesArray.length; j = j + 1) {

       // console.log('trying to add item ' + j);
        var obj = jQuery.parseJSON(myActivitiesArray[j]);
        for (var i = 0 ; i < obj.length ; i++) {
            var activity = obj[i];
            $('#datatable_activities').dataTable().fnAddData([
                "<i class=\"fa fa-plus-circle\"></i>",
                obj[i].TimeStamp,
                '/devices/' + obj[i].DeviceId,
                "<div class='innerDetails'>" + obj[i].ActivitySummary + "</div>",
                obj[i].ActivityId,
                    obj[i].SensorId]
              ).hidden = true;
            if (obj[i].ActivityId > lastid)
                lastid = obj[i].ActivityId;
            //console.log('added row');

            $(".hid").fadeIn();
            $(".hid").last().fadeIn();
            $(".hid").first().fadeIn();
        }
        jQuery("abbr.timeago").timeago();
        //console.log('done adding row ' + i);

    }

    myActivitiesArray.length = 0;
    myActivitiesArray = [];

}

$('#datatable_activities').on('draw.dt', function () {
    showTimeago();
});
