// table init
var $table = $('#table'),
                        $remove = $('#remove'),
                        selections = [];
                
                    function initTable() {
                        $table.bootstrapTable({
                            height: getHeight(),
                            columns: [
                                [
                                    {
                                        field: 'state',
                                        checkbox: true,
                                        rowspan: 2,
                                        align: 'center',
                                        valign: 'middle'
                                    }, {
                                        title: 'Name',
                                        field: 'name',
                                        rowspan: 2,
                                        align: 'center',
                                        valign: 'middle',
                                        sortable: true,
                                        footerFormatter: totalTextFormatter
                                    }, {
                                        title: 'Detail',
                                        colspan: 3,
                                        align: 'center'
                                    }
                                ],
                                [
                                    {
                                        field: 'views',
                                        title: 'Views',
                                        sortable: true,
                                        footerFormatter: totalNameFormatter,
                                        align: 'center'
                                    }, {
                                        field: 'downloadLink',
                                        title: 'Download Link',
                                        sortable: true,
                                        align: 'center',
                                        footerFormatter: totalPriceFormatter
                                    }, {
                                        field: 'operate',
                                        title: 'Item Operate',
                                        align: 'center',
                                        events: operateEvents,
                                        formatter: operateFormatter
                                    }
                                ]
                            ]
                        });
                        // sometimes footer render error.
                        setTimeout(function () {
                            $table.bootstrapTable('resetView');
                        }, 200);
                        $table.on('check.bs.table uncheck.bs.table ' +
                                'check-all.bs.table uncheck-all.bs.table', function () {
                            $remove.prop('disabled', !$table.bootstrapTable('getSelections').length);
                
                            // save your data, here just save the current page
                            selections = getIdSelections();
                            // push or splice the selections if you want to save all data selections
                        });
                       
                        $table.on('all.bs.table', function (e, name, args) {
                            console.log(name, args);
                        });
                        $remove.click(function () {
                            var ids = getIdSelections();
                            $table.bootstrapTable('remove', {
                                field: 'id',
                                values: ids
                            });
                            $remove.prop('disabled', true);
                        });
                        $(window).resize(function () {
                            $table.bootstrapTable('resetView', {
                                height: getHeight()
                            });
                        });
                    }
                
                    function getIdSelections() {
                        return $.map($table.bootstrapTable('getSelections'), function (row) {
                            return row.id
                        });
                    }
                
                    function responseHandler(res) {
                        $.each(res.rows, function (i, row) {
                            row.state = $.inArray(row.id, selections) !== -1;
                        });
                        return res;
                    }
                
                    function detailFormatter(index, row) {
                        var html = [];
                        $.each(row, function (key, value) {
                            html.push('<p><b>' + key + ':</b> ' + value + '</p>');
                        });
                        return html.join('');
                    }
                
                    function operateFormatter(value, row, index) {
                        return [
                            '<a class="like" href="javascript:void(0)" title="Edit">',
                            '<i class="fa fa-edit"></i>',
                            '</a>  ',
                            '<a class="remove" href="javascript:void(0)" title="Remove">',
                            '<i class="fa fa-trash"></i>',
                            '</a>'
                        ].join('');
                    }
                
                    window.operateEvents = {
                        'click .like': function (e, value, row, index) {
                            $('#editModal').modal('show')
                            //alert('You click like action, row: ' + JSON.stringify(row));
                        },
                        'click .remove': function (e, value, row, index) {
                            $table.bootstrapTable('remove', {
                                field: '_id',
                                values: [row._id]
                            });
                        }
                    };
                
                    function totalTextFormatter(data) {
                        return 'Total';
                    }
                
                    function totalNameFormatter(data) {
                        return data.length;
                    }
                
                    function totalPriceFormatter(data) {
                        var total = 0;
                        $.each(data, function (i, row) {
                            total += +(row.price.substring(1));
                        });
                        return '$' + total;
                    }
                
                    function getHeight() {
                        return $(window).height() - $('h1').outerHeight(true);
                    }
                
                    $(function () {
                        initTable();
                    });

// end table init

// add
function addGame(){

      $.ajax({
        url: "/games/addGame",
        method: 'POST',
        enctype: 'multipart/form-data',
        processData: false, 
        contentType: false,
        cache: false,
        data: { 
            name: document.getElementById("addName").value, 
            category: document.getElementById("addCategory").value,
            downloadLink: document.getElementById("addDownloadLink").value,
            systemRequirements: document.getElementById("addSystemRequirements").value,
            description: document.getElementById("addDescription").value,
            seri: document.getElementById("addSeri").value,
            avatar: document.getElementById("addAvatar").value,
        }
      })
        .done(function( msg ) {
          if(msg.success_msg != null) alert( "Data Saved: " + msg.success_msg )
          else{
            // alert("Errors: " + msg.errors);
            msg.errors.forEach(err => {
                console.log(err.msg);
            });
          }
        });

}