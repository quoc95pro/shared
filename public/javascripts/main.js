var theToggle = document.getElementById('toggle-header');
var menu = document.getElementById('menu-header');

// hasClass
function hasClass(elem, className) {
    return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
}

// toggleClass
function toggleClass(elem, className) {
    var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, " ") + ' ';
    if (hasClass(elem, className)) {
        while (newClass.indexOf(" " + className + " ") >= 0) {
            newClass = newClass.replace(" " + className + " ", " ");
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}

theToggle.onclick = function () {
    toggleClass(this, 'on');
    toggleClass(menu, 'menu-header-toggled');

    return false;
}

function toggleMenu(elem) {

    if (hasClass(elem, 'on')) {
        while (newClass.indexOf(" " + className + " ") >= 0) {
            newClass = newClass.replace(" " + className + " ", " ");
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
        elem.className += ' ' + className;
    }
}

// right menu category

$(function () {
    var Accordion = function (el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;

        // Variables privadas
        var links = this.el.find('.link');
        // Evento
        links.on('click', { el: this.el, multiple: this.multiple }, this.dropdown)
    }

    Accordion.prototype.dropdown = function (e) {
        var $el = e.data.el;
        $this = $(this),
            $next = $this.next();

        $next.slideToggle();
        $this.parent().toggleClass('open');

        if (!e.data.multiple) {
            $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        };
    }

    var accordion = new Accordion($('#accordion'), false);
});

// search

function onfocusSearch() {
    document.getElementById("seach-result").style.display = "block";
}

function outfocusSearch() {
    document.getElementById("seach-result").style.display = "block";
}

function search() {
    var keyWord =  document.getElementById("txtSearch").value;
    var listResult =  document.getElementById("list-result");
    listResult.innerHTML = '';
   if(keyWord != ''){
    $.ajax({
        url: "/search/"+keyWord
      }).done(function(data) {
        if(data){
            data.forEach(element => {
                listResult.innerHTML+= "<li class='li-result'>"+"<div class='select2-result-repository'>" +
                "<div class='select2-result-repository__avatar'><img src='/images/game/" + element.avatar + "' /></div>" +
                "<div class='select2-result-repository__meta'>" +
                  "<div class='select2-result-repository__title'>" + element.name + "</div>"+"<div class='select2-result-repository__statistics'>" +
                  "<div class='select2-result-repository__forks'><i class='fa fa-flash'></i> " + element.views + " Forks</div>" +
                  "<div class='select2-result-repository__stargazers'><i class='fa fa-star'></i> " + element.views + " Stars</div>" +
                  "<div class='select2-result-repository__watchers'><i class='fa fa-eye'></i> " + element.views + " Watchers</div>" +
                "</div>" +
                "</div></div></li>";
            });
        }
      })
   }
}