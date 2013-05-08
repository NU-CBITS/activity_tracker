//Calendar
//Depends on fullcalendar.js

jQuery.fn.openForm = function() {
  var container = $(this);
  var body = container.find(".accordion-body");
  if (body.length === 1) { body.show() };
  if (container.find('i.icon-caret-right').length === 1) {
    container.find('i.icon-caret-right').removeClass('icon-caret-right').addClass('icon-caret-down');
  } else {
    container.find('i.icon-caret-down').removeClass('icon-caret-down').addClass('icon-caret-right');
  }
  return $(this);
};

window.PurpleCalendar = (function() {

  function Calendar(container, eventsFn) {
    this.currentlyRendered = false;
    this.container = container;
    this.filteredEventsFn = eventsFn;
  };

  Calendar.prototype.load = function() {
    var self = this;
    var schedulerHTML = '<div id="scheduler_here" class="dhx_cal_container" style="width:100%; height:500px;""><div class="dhx_cal_navline"><div class="dhx_cal_prev_button">&nbsp;</div><div class="dhx_cal_next_button">&nbsp;</div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div></div>'
    $(this.container).prepend(schedulerHTML);

    scheduler.attachEvent("onClick", function (event_id, native_event_object){
      var _event = scheduler.getEvent(event_id);
      var newModel = new ActivityCalEvent();
      newModel.set_field('start', 'datetime', _event.start_date);
      newModel.set_field('end', 'datetime', _event.end_date);
      editEventView.updateModel(newModel);
      $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
    });

    scheduler.attachEvent("onEmptyClick", function (date, native_event_object){
      var y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate(),
        h = date.getHours(),
        min = date.getMinutes();

      // if (allDay) {
      //   h = 12;
      //   min = 0;
      // };

      var newModel = new ActivityCalEvent(),
          s = new Date(y, m, d, h, min),
          e = new Date(y, m, d, h+1, min);
      newModel.set_field('start', 'datetime', s);
      newModel.set_field('end', 'datetime', e);
      //m should have the correct start time.
      editEventView.updateModel(newModel);
      //editEventView should have an updated start time
      //and an updated 'currentState'
      $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
    });

    // if ((screen.width < 480) || (screen.height < 480)) {
    if ((document.width < 480) || (document.height < 480)) {

      scheduler.init('scheduler_here',null,"day");

    } else {

      scheduler.init('scheduler_here',null,"month");

      // $(this.container).prepend('<div id="calendar"></div>');
      // this.$el = $(this.container).find('div#calendar');
      // var height = $("#visualizations-outer-container").height() - 40;

      // this.$el.fullCalendar({
      //   height:height,
      //   header: {
      //     left: 'agendaDay,agendaWeek,month',
      //     center: 'title',
      //     right: 'prev,next today'
      //   },
      //   // 
      //   selectable: true,
      //   editable: true,
      //   events: function(start, end, callback) {

      //     var eventsInPeriod, eventObjs;

      //     var filtered_events = self.filteredEventsFn();

      //     eventsInPeriod = filtered_events.filter(function(event) { 
      //       return (
      //         ( event.get_field_value('start') >= start && event.get_field_value('start') <= end ) || 
      //         ( event.get_field_value('end') >= start && event.get_field_value('end') <= end )
      //       );
      //     });

      //     eventObjs = eventsInPeriod.map(function(event) { 
      //       return _.extend({id: event.cid}, event.get_fields_as_object()) 
      //     });

      //     callback(eventObjs);
      //   },
        
      //   eventClick: function(calEvent, jsEvent, view) {
      //     var acEvent = ActivityCalEvents.get(calEvent.id);
      //     editEventView.updateModel( acEvent );
      //     //editEventView should have an updated start time and an updated 'currentState'
      //     $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
      //   },

      //   dayClick: function(timeClicked, allDay, jsEvent, view) {
      //     var y = timeClicked.getFullYear(),
      //         m = timeClicked.getMonth(),
      //         d = timeClicked.getDate(),
      //         h = timeClicked.getHours(),
      //         min = timeClicked.getMinutes();

      //     if (allDay) {
      //       h = 12;
      //       min = 0;
      //     };

      //     var newModel = new ActivityCalEvent(),
      //         s = new Date(y, m, d, h, min),
      //         e = new Date(y, m, d, h+1, min);
      //     newModel.set_field('start', 'datetime', s);
      //     newModel.set_field('end', 'datetime', e);
      //     //m should have the correct start time.
      //     editEventView.updateModel(newModel);
      //     //editEventView should have an updated start time
      //     //and an updated 'currentState'
      //     $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
      //   }    
      // });

    }

  };

  Calendar.prototype.reload = function() {
    this.$el.fullCalendar( 'refetchEvents' );
  };

  Calendar.prototype.remove = function() {
    this.currentlyRendered = false;
    this.$el.remove();
  };   

  Calendar.prototype.render = function() {

    if (!this.currentlyRendered) {
      this.load();
      this.currentlyRendered = true;
    } else {
      this.reload();
    }

  };

  return Calendar;

}) ();