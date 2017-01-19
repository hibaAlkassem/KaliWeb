/// <reference path="importedData.js" />
542/* Webarch Admin Dashboard 
/* This JS is only for DEMO Purposes - Extract the code that you need
-----------------------------------------------------------------*/	
/* Set the defaults for DataTables initialisation */
var source;

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
});
(function ($) {
$.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {
    // check that we have a column id
    if ( typeof iColumn == "undefined" ) return new Array();
     
    // by default we only want unique data
    if ( typeof bUnique == "undefined" ) bUnique = true;
     
    // by default we do want to only look at filtered data
    if ( typeof bFiltered == "undefined" ) bFiltered = true;
     
    // by default we do not want to include empty values
    if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;
     
    // list of rows which we're going to loop through
    var aiRows;
     
    // use only filtered rows
    if (bFiltered == true) aiRows = oSettings.aiDisplay;
    // use all rows
    else aiRows = oSettings.aiDisplayMaster; // all row numbers
 
    // set up data array   
    var asResultData = new Array();
     
    for (var i=0,c=aiRows.length; i<c; i++) {
        iRow = aiRows[i];
        var aData = this.fnGetData(iRow);
        var sValue = aData[iColumn];
         
        // ignore empty values?
        if (bIgnoreEmpty == true && sValue.length == 0) continue;
 
        // ignore unique values?
        else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;
         
        // else push the value onto the result data array
        else asResultData.push(sValue);
    }
     
    return asResultData;
}}(jQuery));


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
	


//var source = new EventSource('GetInsight.aspx');
var lastid = 0;
var leastid = 0;
var paused = 1;
var oTable;
var myInsightsArray = [];
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
     
    $('#example2 thead tr').each( function () {
        this.insertBefore( nCloneTh, this.childNodes[0] );
    } );
     
    $('#example2 tbody tr').each( function () {
        this.insertBefore(  nCloneTd.cloneNode( true ), this.childNodes[0] );
    } );
     
    var userid = $('#inputUserId').val();
    var insightsurl = "InsightsHandler.ashx?uid=" + userid + "&listcount=25";
    var mid = getParameterByName('mid');
    if (mid.length>0)
        insightsurl = "InsightsHandler.ashx?uid=" + userid + "&listcount=25&mid=" + mid;
    /*
     * Initialse DataTables, with no sorting on the 'details' column
     */
    oTable = $('#example2').dataTable({
        "iDisplayLength": 1000,
        "aLengthMenu": [[5, 10, 25, 50, 10000], [5, 10, 25, 50, "All"]],
        //"sDom": "<'row'<'select-toolbar filter-texts col-md-8' ><'col-md-4  toolbar-direction' l <'insight_toolbar'>  >r>t<'row'<'col-md-12'p i >>",
        "sDom": "t<'row'<'col-md-12'p i >>",
        "aaSorting": [[1, "desc"]],
        "oLanguage": {
            "sLengthMenu": "_MENU_ ",
            "sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
        },
        "aoColumnDefs": [
                            { "sWidth": "30px", "aTargets": [0] },
                            { "bSortable": false, "aTargets": [ 0 ] },
                            { "sWidth": "200px", "aTargets": [1] },
                            { "sWidth": "200px", "aTargets": [2] },
                            { "bVisible": false, "aTargets": [3] },
                            //{ "sWidth": "300px", "aTargets": [4] }, //insights
                            { "bVisible": false, "aTargets": [5] },
                            { "bVisible": false, "aTargets": [6] },
                            { "bVisible": false, "aTargets": [7] },
                            { "bVisible": false, "aTargets": [8] }
                        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            leastid = aData[5];
 
        },
        "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
            // Bold the grade for all 'A' grade browsers
            //console.log(aData[1] + ' -> ' + getDate(aData[1].replace(/\T/g, ' ') + " UTC"));
            var s = '<span class="hidden"> ' + aData[1] + ' </span> <abbr class="timeago tip" data-toggle="tooltip" title="' + aData[1] + ' UTC">' + getDate(aData[1]) + '</abbr>';
            $('td:eq(1)', nRow).html(s);
    
        },
        "fnDrawCallback": console.log("Draw Done"),
    });
    


    function createSelect(data) {

       
    }

    $('#example2').on('draw.dt', function () {
        //console.log('Redraw occurred at: ' + new Date().getTime());
        //console.log(oTable.fnGetColumnData(2));
        var data = oTable.fnGetData($('#example2 tbody tr:eq(0)')[1]);
        //lastid = oTable.fnGetData($('#example2 tbody tr:eq(0)')[0])[0][5];
        //console.log('new id is: ' + lastid);
        //console.log(lastid = oTable.fnGetData($('#example2 tbody tr:eq(0)')[0])[0][5]);
        $("[data-toggle='tooltip']").tooltip();
        if (loaded == 0) {
            loaded = 1;
            createSelect(oTable.fnGetColumnData(2));
            startListening();
        }
    });
    
    var timerId = 0;
   

   

    $('#example2 tbody tr').live('click', function (event) {
        var nTr = $(this)[0];
        var nTr = $(this)[0];
        if (oTable.fnIsOpen(nTr)) {
            /* This row is already open - close it */
            $(this).find("i").removeClass("fa-minus-circle");
            $(this).find("i").addClass("fa-plus-circle");
            $(this).removeClass("table-row-selected");
            oTable.fnClose(nTr);
        }
        else {
            /* Open this row */
            $(this).find("i").removeClass("fa-plus-circle");
            $(this).find("i").addClass("fa-minus-circle");
            $(this).addClass("table-row-selected");
            oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'table-row-selected');
        }
    });


	$("div.toolbar").html('<div class="table-tools-actions"><button class="btn btn-primary" style="margin-left:12px" id="test2">Add</button></div>');
	
	$('#test2').on( "click",function() {
		$("#quick-access").css("bottom","0px");
    });
	
	$('#example2_wrapper .dataTables_filter input').addClass("input-medium ");
    $('#example2_wrapper .dataTables_length select').addClass("select2-wrapper span12"); 
	
	
		$(".select2-wrapper").select2({minimumResultsForSearch: -1});

	function fnClickAddRow() {
    $('#example3').dataTable().fnAddData( [
        $("#val1 option:selected").text(),
        $("#val2 option:selected").text(),
        "Windows",
        "789.","A" ] );     
	}	
});



/* Formating function for row details */
function fnFormatDetails(oTable, nTr) {
    var aData = oTable.fnGetData(nTr);
    var sOut = '';
    var dat = new Date(aData[1]);
    sOut += '<div style="margin-left:40px;font-weight:normal !important;">';
    //sOut += '<p><strong>Insight Id:</strong> /insights/' + aData[5] + '/</p>';
    sOut += '<div class="row"> <div class="col-md-1"><strong>Insight</strong></div> <div class="col-md-2">' + getFullMonth(dat.getMonth()) + ' ' + dat.getDate() + ', ' + dat.getFullYear() + '</div> ' +
                '<div class="col-md-2">' + getTimeString(dat) + '</div> <div class="col-md-2">' + aData[4] + '</div> <div class="col-md-3">ID: /insight/' + aData[5] + '/</div> </div>';
    sOut += '<div class="row">' +
                '<div class="col-md-1"><strong>Rule</strong></div>' +
                '<div class="col-md-2"></div>' +
                '<div class="col-md-2"></div>' +
                '<div class="col-md-2">' + aData[6] + '</div>' +
                '<div class="col-md-3">ID: /rule/' + aData[7] + '/</div>' +
            '</div>';
    //'<div class="col-md-1"> <strong>Rule:</strong> /rules/' + aData[7] + ' [' + aData[6] + ']  </div>' +
    $.ajax({
        url: config_apiserver + "api/insights/"+aData[5]+"/activities" ,
        //force to handle it as text
        dataType: "text",
        async: true,
        success: function (data) {

            var json = $.parseJSON(data);

          

            for (var i = 0; i < json.length; i++) {
                var activity = json[i];
                var desc = "Activity";
                if (i > 0) desc = "";
                var tempdat = new Date(activity.TimeStamp);
                var value = activity.Value;
                value = value * 90;
                var direction = "Down";
                if (value < 0)
                    direction = "Up";
                var result = activity.ActivitySummary;
                if (activity.ActivityTypeName == "Device Rotation")
                    result = activity.ActivityTypeName + ", Angle=" + (~~value).toString() + " " + direction;
                sOut += '<div class="row">' +
                            '<div class="col-md-1"><strong>' + desc + '</strong></div>' +
                            '<div class="col-md-2">' + getFullMonth(tempdat.getMonth()) + ' ' + tempdat.getDate() + ', ' + tempdat.getFullYear() + '</div>' +
                            '<div class="col-md-2">' + getTimeString(tempdat) + '</div>' +
                            '<div class="col-md-2">' + activity.ActivitySummary + '</div>' +
                            '<div class="col-md-3">ID: /activity/' + activity.ActivityId + '/</div>' +
                        '</div>';
            }
        }
    });

    sOut += '</td></tr>';
    sOut += '</table>';
    sOut += '</div>';

    return sOut;
}
    var userid = myval;

function startListening() {
 
   var url = serversrc + '/GetInsights.aspx?id=' + userid + '&lastid='+  lastid + '&mid=' + $('#selectUser').val();
 console.log(url);

 if (source)
 {
 if (source.readyState == 0 || source.readyState == 1)
 source.close();
 }
 else $("#play").trigger("click");

 source = new EventSource(url); 
    

    source.onopen = function (event) {
        console.log('Connection Opened with last id: ' + lastid);
    };

    source.onerror = function (event) {
        //console.log('error: ' + event.data);
    };

    source.onmessage = function (e) {
        console.log(e.data);
        if (e.data == 'start')
            return;
        if (paused == 0) {
            console.log('data not paused, data will be added');
            var obj = jQuery.parseJSON(e.data);
            for (var i = 0 ; i < obj.length ; i++) {
                var activity = obj[i];
                var propability = (obj[i].Confidence * 100) + ' %';
                $('#example2').dataTable().fnAddData([
                    "<i class=\"fa fa-plus-circle\"></i>",
                    //'<abbr class="timeago tip" data-toggle="tooltip" data-original-title="title" title="' + obj[i].TimeStamp + '">' + obj[i].TimeStamp + '</abbr>',
                    obj[i].TimeStamp,
                    obj[i].DeviceUserName,
                    obj[i].DeviceId,
                    "<div class='innerDetails'>" + obj[i].Summary + "</div>",
                    obj[i].InsightId,
                    obj[i].RuleName,
                    obj[i].RuleId,
                    propability]
                  ).hidden = true;
                if (obj[i].InsightId > lastid)
                    lastid = obj[i].InsightId;
                console.log('added row, new id: ' + obj[i].InsightId + ', last id: ' + lastid);

                $(".hid").fadeIn(2500);
                //$(".hid").last().fadeIn(3000);
                //$(".hid").first().fadeIn(3000);
            }
            jQuery("abbr.timeago").timeago();
        }
        else {
            console.log('data paused nothing added');
            showErrorMessage('New insights available, press Play to show them');
            myInsightsArray.push(e.data);
        }
    }
}
//window.addEventListener("DOMContentLoaded", contentLoaded, false);

function showTimeago() {
    jQuery("abbr.timeago").timeago();
}

function addArrayItems() {

    console.log('array length: ' + myInsightsArray.length);
    console.log('array content: ' + myInsightsArray.toString());
    for (var j = 0; j < myInsightsArray.length; j = j + 1) {

        console.log('trying to add item ' + j);
        var obj = jQuery.parseJSON(myInsightsArray[j]);
        for (var i = 0 ; i < obj.length ; i++) {
            var activity = obj[i];
            var propability = (obj[i].Confidence * 100) + ' %';
            console.log('item is: ' + obj[i].Summary);
            $('#example2').dataTable().fnAddData([
                "<i class=\"fa fa-plus-circle\"></i>",
                //'<abbr class="timeago tip" data-toggle="tooltip" title="' + obj[i].TimeStamp + '">' + obj[i].TimeStamp + '</abbr>',
                obj[i].TimeStamp,
                obj[i].DeviceUserName,
                obj[i].DeviceId,
                "<div class='innerDetails'>" + obj[i].Summary + "</div>",
                obj[i].InsightId,
                obj[i].RuleName,
                obj[i].RuleId,
                propability]
              ).hidden = true;
            if (obj[i].InsightId > lastid)
                lastid = obj[i].InsightId;

            $(".hid").fadeIn(2500);
            //$(".hid").last().fadeIn(3000);
            //$(".hid").first().fadeIn(3000);
        }
        jQuery("abbr.timeago").timeago();
        console.log('done adding row ' + i);

    }

    myInsightsArray.length = 0;
    myInsightsArray = [];

}

$('#example2').on('draw.dt', function () {
    showTimeago();
});

function showTooltip() {
    $("[data-toggle='tooltip']").tooltip();
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
