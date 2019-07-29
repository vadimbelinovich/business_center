var App = App || {};
App.building = {
    root: $(".building-app"),
    handle: $(".building-app polygon"),
    bubbleContainer: $(".homepage__building"),

    txtFloor: '',
    txtLink: '',

    init: function() {
        var self = this;

        this.txtFloor = this.root.attr('data-floor');
        this.txtLink = this.root.attr('data-link');

        this.handle
            .on("mouseenter", function(){
                var id = $(this).attr("id");
                var image = $("#over-"+id);
                var polygon = $(this);

                $(".bubble").removeClass("show");

                self.root.find("image:not(#bg)").css("opacity", 0);
                image.css("opacity", 1);

                self.createBubble(polygon, id);
            })
            .on("click", function(){
                self.openDetail($(this).attr("data-href"))
            });
    },

    createBubble: function(polygon, id) {
        var self = this;

        var ID = "bubble-"+id;
        var top = polygon.position().top;
        var height = polygon.height();

        var l = "60%";
        var t = parseInt(top + height / 2 + 80);

        if ($("#"+ID).length === 0) {
            var bubble = $("<a id='" + ID + "' href='" + polygon.attr("data-href") + "' class='bubble'><div class='bubble__floor'>" + polygon.attr("data-floor") + "</div><div class='bubble__label'>"+this.txtFloor+"</div><div class='bubble__cta'>"+this.txtLink+"</div></a>");
            bubble.appendTo(this.bubbleContainer);
            bubble.on("click", function(e){
                e.preventDefault();
                self.openDetail(polygon.attr("data-href"));
            })
        } else {
            var bubble = $("#"+ID);
        }

        bubble.css({left: l, top: t});
        setTimeout(function(){
            bubble.addClass("show");
        })
    },

    openDetail: function(url) {
        console.log(url)
        location.href = url
    }
};
App.buildingPhone = {
    root: $("[data-role='floor-select']"),

    init: function() {
        var self = this;

        this.root.on("change", function(){
            var url = $(this).val();

            if (url !== "") {
                location.href = url;
            }
        });
    }
};
App.gallery = {

    root: $("[data-gallery]"),
    //state: $(".gallery__state"),

    init: function () {
        if (this.root.length == 0) {
            return
        }

        $("[data-fancybox='images-preview']").fancybox({
            buttons: ["close"],
            arrows: true
        });

        $("[data-gallery]").masonry({
            // options
            itemSelector: '.gallery__item',
        });

    /*var len = $(".gallery__item").length;

    var that = this;
    var $car = this.root.flickity({
        prevNextButtons: false,
        pageDots: false,
        cellAlign: "left",
        wrapAround: true
    });

    var flkty = $car.data("flickity");

    $car.on( 'select.flickity', function() {
        update(flkty.selectedIndex + 1)
    });

    function update(index) {
        that.state.html( "<strong>" + (index < 10 ? '0' : '') + index.toString() + '</strong> / ' + (len < 10 ? '0' : '') + len.toString() );
    }
    update(1);
    */
    }
};
App.layout = {

    init: function() {

        // LAYOUT STATES
        $('[data-layout-handle]').click(function(){
            var state = $(this).attr('data-layout-handle'),
                htmlState = $('html').attr('data-layout-state');

            if(state == htmlState) {
                $('html').removeAttr('data-layout-state');
            } else {
                $('html').attr('data-layout-state', state);
                if(state == 'has-search') {
                    $('#frm-quickSearch-form-search').focus();
                }
            }

            
        });
    }

};
App.map = {
    run: function() {
        if ($(window).width() > 600) {
            $("html").attr("data-has-map", "");
        }

        center = new google.maps.LatLng(50.101724,14.433452);

        var map = new google.maps.Map(document.getElementById('gmap'), {
            zoom: 17,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
                {
                    featureType: "poi",
                    stylers: [
                        { visibility: "off" }
                    ]
                }
            ]
        });

        new google.maps.Marker({
            position: center,
            map: map
        });

        $("[data-place]").each(function(){
            var lat = $(this).data("lat");
            var lng = $(this).data("lng");
            var type = $(this).data("type");
            var name = $(this).data("name");

            var markerOptions = {
                title: name,
                position: new google.maps.LatLng(lat, lng),
                map: map,
                icon: {
                    url: "/images/map/"+type+".png",
                    size: new google.maps.Size(50, 60),
                    scaledSize: new google.maps.Size(50, 60)
                }
            }
            new google.maps.Marker(markerOptions);
        })
    }
}

var App = App || {};

App.modal = {
	init: function() {
        var self = this;
        
        $('[data-role="modal-create"]').click(function(e){
            e.preventDefault();

            var tgt = $(this).attr('href');

            self.create($(tgt));
        })
	},

    create: function(target) {
        var self = this;

        this.destroy();

        $('html').addClass('has-modal');

        if(!target) {
            target = $('');
        }

        $('<div id="modal-milk" />').appendTo('body');
        target.show();
        var mod = target.wrap('<div class="modal__holder" />');
        var hold = mod.wrap('<div class="modal__content" />');
        $('<div class="modal__close" />').appendTo('.modal__content').click(function(){
            self.destroy();
        });
    },

    destroy: function() {
        $('html').removeClass('has-modal');
        $('#modal-milk').remove();
        $('.modal__close').remove();
        $('.modal__content > *').hide().unwrap().unwrap();
    }
}
App.sticky = {

    init: function() {
        if($('#main__categories').is(':visible')) {
            $('#main__categories > .menu').stick_in_parent({offset_top: 70});
        }
    }

};
App.work = {

    item: ".work-list__item__title",

    init: function() {
        var self = this;

        $("body").on('click', this.item, function(){
            $(this).next('.work-list__item__description').slideToggle();
        });
    }

};
App.workFilter = {

    root: $('.work-filter'),

    init: function() {
        var self = this;

        if(this.root.length == 0) {
            return;
        }

        $.nette.init();

        this.updateView();

        this.root.find('input[type="checkbox"]').change(function(){
            self.updateView();
            if($(this).parents('[class*="__label"]').length != 0) {
                $(this).parents('[class*="__label"]').next('[class*="__options"] input[type="checkbox"]').prop('checked', true);
            }
        });
        
        this.root.find('input').change(function(){
            self.root.submit();
        });

    },

    updateView: function() {
        var self = this;

        this.root.find('input[type="checkbox"]').each(function(){
            if($(this).prop('checked') == true) {
                $(this).parents('[class*="__label"]').addClass('checked');
            } else {
                $(this).parents('[class*="__label"]').removeClass('checked');
            }
        });

        this.root.find('[data-year].month').hide();
        this.root.find('[data-year] input[type="radio"]:checked').each(function(){
            var year = $(this).parents('[data-year]').attr('data-year');

            self.root.find('[data-year="'+year+'"].month').show();
        });

    }

};
var App = App || {};

$(function(){

	$.each(App, function(index, value){
		if(App[index] != undefined && typeof App[index].init == 'function') {
			App[index].init();
		}
		if(App[index] != undefined && typeof App[index].scroll == 'function') {
			App[index].scroll();
			$(window).scroll(function(){
				App[index].scroll();
			})
		}
		if(App[index] != undefined && typeof App[index].resize == 'function') {
			App[index].resize();
			$(window).resize(function(){
				App[index].resize();
			})
		}
	})

	$(document).ajaxSuccess(function(event, xhr, settings) {
		$.each(App, function(index, value){
			if(App[index] != undefined && typeof App[index].ajax == 'function') {
				setTimeout(function(){
					App[index].ajax();
				}, 400);
			}
		})
	});

});