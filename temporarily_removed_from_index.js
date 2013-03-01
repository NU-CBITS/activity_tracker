// temporarily_removed_from_index.js

// Setup Activity Calendar Goals  

// ActivityCalGoals = new XelementCollection(XELEMENTS.filter(function(xel) {
//  return (xel.get_field_value("title") == "Activity Calendar Goal")
// })); 

// ActivityCalGoalData = new DataCollection(null);

// ActivityCalGoals.each(function(goal_xel) {
//   var data;

//   // Fetch any existing data on the server for this user and goal.
//   var dc = new DataCollection(null, {
//     xelement_id: goal_xel.id,
//     user_id: Dynamo.CURRENT_USER_ID,
//     group_id: Dynamo.CURRENT_GROUP_ID      
//   });
//   dc.fetch({async: false});

//   if (dc.length > 0) {
//     data = dc.first();
//   }
//   else {
//     // if length is 0, then no data exists, create new object.
//     data = new Dynamo.Data({
//       server_url: Dynamo.TriremeURL,
//       xelement_id: goal_xel.id,
//       user_id: Dynamo.CURRENT_USER_ID,
//       group_id: Dynamo.CURRENT_GROUP_ID       
//     });
//   };

//   ActivityCalGoalData.add(data); 
//   // Either way, it gets added to the collection of user data about calendar goals.
// });

// goalsView = new GoalsView({
//   goals:  ActivityCalGoals,
//   goalData: ActivityCalGoalData
// });

  // render goals
  // $('div#log-tracking').html(goalsView.render().$el);


<!-- // NO TO-DO's For Now...
          <div class="accordion-container header-well swell">
            <div class="row-fluid accordion-header">
               <legend class="span11"><span class="legend-header">To Do</span></legend>
              <div class="span1 caret-icons">
                <i class="icon-caret-down pull-right"></i>
              </div> 
            </div>
            <div id="to-do-body" class="accordion-body">
              <div class="well-white well well-small" style="margin-bottom:0px;">
                <ol>
                  <li>Watch the "Monitor Activities" Guide <i class="icon-question-sign"></i></li>
                  <li>Completely monitor your yesterday <i class="icon-question-sign"></i></li>
                  <li>Monitor activities over the course of today <i class="icon-question-sign"></i></li>
                  <li>Come back tomorrow!</li>
                </ol>
              </div>
            </div>
          </div>
-->
<!-- // NO Goals For Now...          
          <div id="log-tracking" class="accordion-container header-well swell">
            <ul id="goals"></ul>
          </div>
<div class="swell header-well accordion-container">
  My Values, My Progress
</div>
-->