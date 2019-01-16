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
        // console.log(name, args);
    });

    $remove.click(function () {
        var ids = getIdSelections();
        $table.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });
        $remove.prop('disabled', true);
        var message = 'a ';
        $table.bootstrapTable('getSelections').forEach(obj => {
            $.ajax({
                url: "/games",
                method: "delete",
                data: {id: obj._id}
            })
                .done(function (response) {
                    if (response.success_msg != null) {
                        $.jnoty(response.success_msg, {
                            theme: 'jnoty-success',
                              life: 3000,
                              icon: 'fa fa-check-circle',
                              position: 'top-right'
                            });
                    }
                    else {
                        response.errors.forEach(err => {
                            $.jnoty(err.msg, {
                                theme: 'jnoty-warning',
                                  life: 3000,
                                  icon: 'fa fa-check-circle',
                                  position: 'top-right'
                                });
                        });
                    }
                });
        });
        $('#table').bootstrapTable('refresh');
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
        '<a class="edit" href="javascript:void(0)" title="Edit">',
        '<i class="fa fa-edit"></i>',
        '</a>  ',
        '<a class="remove" href="javascript:void(0)" title="Remove">',
        '<i class="fa fa-trash"></i>',
        '</a>'
    ].join('');
}
CKEDITOR.replace('addDescription');
CKEDITOR.replace('editDescription');


window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        document.getElementById('editId').value = row._id;
        document.getElementById('editName').value = row.name;
        var options = [];
        $.ajax({
            url: "games/category"
          }).done(function(cate) {
              var selectedItemCate = [];
              row.category.forEach(element => {
                  console.log(element);
                  selectedItemCate.push(element);
              });
              
            cate.forEach(element => {
                if(selectedItemCate.includes(element.name)){
                    options.push({label: element.name, title: element.name, value: element.name, selected: true});
                }else{
                    options.push({label: element.name, title: element.name, value: element.name});
                }
                
            });
            $('#editCategory').multiselect('dataprovider', options);
        });
        document.getElementById('editLinkDownload').value = row.downloadLink;
        document.getElementById('editSystemRequirements').value = row.systemRequirements;
        CKEDITOR.instances['editDescription'].setData(row.description)
        document.getElementById('editSeri').value = row.seri;
        $('#editModal').modal('show')
    },
    'click .remove': function (e, value, row, index) {
        $table.bootstrapTable('remove', {
            field: '_id',
             values: [row._id]
          });

        $.ajax({
            url: "/games",
            method: "delete",
            data: {id: row._id}
        })
            .done(function (response) {
                if (response.success_msg != null) {
                    alert(response.success_msg);
                }
                else {
                    response.errors.forEach(err => {
                        alert('error:' + err.msg);
                    });
                }
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

$()

$(function () {
    initTable();
});

// end table init
