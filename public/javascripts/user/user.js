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
                    field: 'profileimage',
                    title: 'Profileimage',
                    sortable: true,
                    rowspan: 2,
                    align: 'center',
                    valign: 'middle',
                    footerFormatter: totalPriceFormatter
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
                    colspan: 5,
                    align: 'center'
                }
            ],
            [
                {
                    field: 'email',
                    title: 'Email',
                    sortable: true,
                    footerFormatter: totalNameFormatter,
                    align: 'center'
                }, {
                    field: 'username',
                    title: 'Username',
                    sortable: true,
                    align: 'center',
                    footerFormatter: totalPriceFormatter
                }, {
                    field: 'userType',
                    title: 'UserType',
                    sortable: true,
                    align: 'center',
                    footerFormatter: totalPriceFormatter
                },
                {
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
                url: "/users",
                method: "delete",
                data: { id: obj._id }
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

window.operateEvents = {
    'click .edit': function (e, value, row, index) {
        document.getElementById('editId').value = row._id;
        document.getElementById('editName').value = row.name;
        document.getElementById('editEmail').value = row.email;
        document.getElementById('editUserName').value = row.username;
        document.getElementById('editPassword').value = '******';
        document.getElementById('editPassword2').value = '******';
        document.getElementById('editLevel').value = row.userType;
        document.getElementById('editAvatar').value = row.profileimage;
        $('#resultEdit').empty();
        $('#resultEdit').append('<div class="img-item"><i class="close fa fa-remove" onclick="removeImageEdit()"></i><img src="' + row.profileimage + '" width="200px"/></div>');
        $('#editModal').modal('show');
    },
    'click .remove': function (e, value, row, index) {
        $table.bootstrapTable('remove', {
            field: '_id',
            values: [row._id]
        });

        $.ajax({
            url: "/users",
            method: "delete",
            data: { id: row._id }
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
