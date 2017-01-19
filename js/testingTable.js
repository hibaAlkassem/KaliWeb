var oTable;
$(document).ready(function(){
console.log(devicesData);
oTable = $('#datatable_devices').dataTable({
         "bFilter": false,
     });

console.log(devicesData);
fillDevicesTable(devicesData);


}


);
