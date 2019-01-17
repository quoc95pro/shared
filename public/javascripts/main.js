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
    document.getElementById("seach-result").style.display = "none";
}

function resultMouseOut() {
    document.getElementById("txtSearch").setAttribute("onfocusout", "outfocusSearch()");
}

function resultMouseOver() {
    document.getElementById("txtSearch").setAttribute("onfocusout", "");
}

function search() {
    var keyWord = document.getElementById("txtSearch").value;
    var listResult = document.getElementById("list-result");
    listResult.innerHTML = '';
    if (keyWord != '') {
        $.ajax({
            url: "/search/" + keyWord
        }).done(function (data) {
            if (data) {
                data.forEach(element => {
                    listResult.innerHTML += "<a href='/detail/" + element._id + "'><li class='li-result'>" + "<div class='search-item'>" +
                        "<div class='search-item-avatar'><img src='/images/game/" + element.avatar + "' /></div>" +
                        "<div class='search-item-meta'>" +
                        "<div class='search-item-title'>" + element.name + "</div>" +
                        "<div class='search-item-description'>" + element.category + "</div>" +
                        "<div class='search-item-statistics'>" +
                        "<div class='search-item-seri'><i class='fa fa-th-list'></i> " + element.seri + "</div>" +
                        "<div class='search-item-download'><i class='fa fa-cloud-download'></i> " + element.downloads + " Downloads</div>" +
                        "<div class='search-item-view'><i class='fa fa-eye'></i> " + element.views + " Views</div>" +
                        "</div>" +
                        "</div></div></li></a>";
                });
            }
        })
    }
}


// left-menu

var menu = document.querySelector('.nav__list');
var burger = document.querySelector('.burger');
var doc = $(document);
var l = $('.scrolly');
var panel = $('.panel');
var vh = $(window).height();

var openMenu = function () {
    burger.classList.toggle('burger--active');
    menu.classList.toggle('nav__list--active');
};

// reveal content of first panel by default
panel.eq(0).find('.panel__content').addClass('panel__content--active');

var scrollFx = function () {
    var ds = doc.scrollTop();
    var of = vh / 4;

    // if the panel is in the viewport, reveal the content, if not, hide it.
    for (var i = 0; i < panel.length; i++) {
        if (panel.eq(i).offset().top < ds + of) {
            panel
                .eq(i)
                .find('.panel__content')
                .addClass('panel__content--active');
        } else {
            panel
                .eq(i)
                .find('.panel__content')
                .removeClass('panel__content--active')
        }
    }
};

var scrolly = function (e) {
    e.preventDefault();
    var target = this.hash;
    var $target = $(target);

    $('html, body').stop().animate({
        'scrollTop': $target.offset().top
    }, 300, 'swing', function () {
        window.location.hash = target;
    });
}

var init = function () {
    burger.addEventListener('click', openMenu, false);
    window.addEventListener('scroll', scrollFx, false);
    window.addEventListener('load', scrollFx, false);
    $.ajax({
        url: "/cateAll"
    }).done(function (cate) {
        var classColor = ['b-yellow', 'b-green', 'b-blue', 'b-red'];
        var previousColor = '';
        var random_class = '';
        cate.forEach(element => {
            do {
                random_class = classColor[Math.floor(Math.random() * classColor.length)];
            } while (random_class == previousColor);
            previousColor = random_class;
            $(".nav__list").append("<li class='nav__item'>" +
                "<a href='/category/" + element.name + "/1' class='nav__link " + random_class + "'>" +
                "<div>" +
                "<i style='width:100%;text-align:center;' class='fa fa-gamepad'>" +
                "</i>" +
                "<p style='font-size: 1.5vh;text-align: center;'>" + element.name +
                "</p></div></a></li");
        });
    });

    $('a[href^="#"]').on('click', scrolly);
};

doc.on('ready', init());

