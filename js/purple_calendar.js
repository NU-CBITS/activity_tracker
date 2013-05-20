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

jQuery.fn.closeForm = function() {
  var container = $(this);
  var body = container.find(".accordion-body");
  if (body.length === 1) { body.hide() };
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

  Calendar.prototype.createEventAndOpenForm = function(event_id) {
    var calEvent = this.purpleScheduler.getEvent(event_id);
    var newModel = new ActivityCalEvent({
      xelement_id: "ACTIVITY-CALENDAR-EVENTS-GUID",
      user_id: Dynamo.CURRENT_USER_ID,
      group_id: Dynamo.CURRENT_GROUP_ID
    });

    newModel.set_field('title', 'string', calEvent.text);
    newModel.set_field('start', 'datetime', calEvent.start_date);
    newModel.set_field('end', 'datetime', calEvent.end_date);
    
    newModel.save(null, { async: false });
    ActivityCalEvents.add(newModel, { merge: true });

    editEventView.updateModel(newModel);
    $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
  };

  Calendar.prototype.initScheduler = function() {
    var self = this;

    // self.purpleScheduler = dhx; //relies on dhxscheduler_mobile.js
    scheduler.config.hour_date="%h:%i %A"; //relies on dhtmlxscheduler.js
    self.purpleScheduler = scheduler;

    // if ((screen.width < 480) || (screen.height < 480)) {
    // if ((document.width < 480) || (document.height < 480)) {
    if (($(window).width() < 767) || ($(window).height() < 767)) {
      self.purpleScheduler.init('purple-scheduler', null, "day");
    } else {
      self.purpleScheduler.init('purple-scheduler', null, "month");
    }

    // 'onEmptyClick' - occurs when the user clicks on an empty space (not on events) i.e., user is creating a new event
    self.purpleScheduler.attachEvent("onEmptyClick", function (date, native_event_object){

      var y = date.getFullYear(),
        m = date.getMonth(),
        d = date.getDate(),
        h = date.getHours(),
        min = date.getMinutes();

      // if (allDay) {
      //   h = 12;
      //   min = 0;
      // };

      var newModel = new ActivityCalEvent({
            xelement_id: "ACTIVITY-CALENDAR-EVENTS-GUID",
            user_id: Dynamo.CURRENT_USER_ID,
            group_id: Dynamo.CURRENT_GROUP_ID
          }),
          s = new Date(y, m, d, h, min),
          e = new Date(y, m, d, h+1, min);

      newModel.set_field('start', 'datetime', s);
      newModel.set_field('end', 'datetime', e);
      editEventView.updateModel(newModel);
      $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
    });

    // 'onEventAdded' - occurs when the user adds a new event
    self.purpleScheduler.attachEvent("onEventAdded", function(event_id, event_object) {
      self.createEventAndOpenForm(event_id)
    });

    // 'onClick' - occurs when the user clicks the left mouse button on an event
    self.purpleScheduler.attachEvent("onClick", function (event_id, native_event_object){
      self.updateEventAndOpenForm(event_id);
    });

    // 'onDblClick' - occurs when the user dbl-clicks on an event
    self.purpleScheduler.attachEvent("onDblClick", function (event_id, native_event_object){
      self.updateEventAndOpenForm(event_id);
    });

    // 'onBeforeLightbox' - details form opening
    self.purpleScheduler.attachEvent("onBeforeLightbox", function (event_id){
      self.createEventAndOpenForm(event_id) // Hides lightbox form, but creates it!
    });

    // Event occurs when a new “event” was added or existing one changed, by drag-n-drop action.
    self.purpleScheduler.attachEvent("onBeforeEventChanged", function(event_object, native_event, is_new, unmodified_event){
      console.warn('event_object', event_object)
      var cps = self, event_id = event_object.id;
      if (is_new === true) {
        self.createEventAndOpenForm(event_id)
      } else {
        // When dragging to update an already existing event
        var calEvent = cps.purpleScheduler.getEvent(event_id);
        var acEvent = ActivityCalEvents.get(calEvent.id);
        acEvent.set_field('start', "datetime", event_object.start_date)
        acEvent.set_field('end', "datetime", event_object.end_date)
        editEventView.updateModel(acEvent);
        editEventView.saveModel();
        $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
      }
      return true;
    });
  };

  Calendar.prototype.load = function() {

    var schedulerHTML = '<div id="purple-scheduler" class="dhx_cal_container" style="width:100%; height:500px;""><div class="dhx_cal_navline"><div class="dhx_cal_prev_button">&nbsp;</div><div class="dhx_cal_next_button">&nbsp;</div><div class="dhx_cal_today_button"></div><div class="dhx_cal_date"></div><div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div><div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div><div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div></div><div class="dhx_cal_header"></div><div class="dhx_cal_data"></div></div>'

    $(this.container).html(schedulerHTML);

    this.initScheduler()
    this.loadJSONData();
  
  };

  Calendar.prototype.loadJSONData = function() {

    var eventObjs, filtered_events = this.filteredEventsFn();

    eventObjs = filtered_events.map(function(calEvent) { 
      var startDate = calEvent.get_field_value('start');
      var startMonth = startDate.getMonth() + 1;
      var startDateString = ((startMonth<10?'0':'') + startMonth)+"."+( (startDate.getDate()<10?'0':'') + startDate.getDate())+"."+startDate.getFullYear()+" "+startDate.getHours()+":"+( (startDate.getMinutes()<10?'0':'') + startDate.getMinutes() );
      var endDate = calEvent.get_field_value('end');
      var endMonth = endDate.getMonth() + 1;
      var endDateString = ((endMonth<10?'0':'') + endMonth)+"."+( (endDate.getDate()<10?'0':'') + endDate.getDate())+"."+endDate.getFullYear()+" "+endDate.getHours()+":"+( (endDate.getMinutes()<10?'0':'') + endDate.getMinutes() );
      return _.extend({id: calEvent.cid, text: calEvent.get_field_value('title'), start_date:startDateString, end_date:endDateString }, calEvent.get_fields_as_object());
    });

    this.purpleScheduler.parse(eventObjs,"json");

  };

  Calendar.prototype.reload = function() {
    this.purpleScheduler.clearAll();
    this.loadJSONData();
  };

  Calendar.prototype.remove = function(model) {
    this.currentlyRendered = false;
    this.$el.remove();
  };   

  Calendar.prototype.render = function() {
    if (!this.currentlyRendered) {
      this.load();
      this.currentlyRendered = true;
    } else {
      this.reload();
    };
  };

  Calendar.prototype.updateEventAndOpenForm = function(event_id) {
    var calEvent = this.purpleScheduler.getEvent(event_id);
    var acEvent = ActivityCalEvents.get(calEvent.id);
    editEventView.updateModel(acEvent);
    $('div#edit-event-container').openForm().effect("highlight", {}, 1000);
  };

  return Calendar;

})();