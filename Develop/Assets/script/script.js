//current date/time in the header of the page.
function displayTime() {
  var todayTimeHeader = dayjs();
  $("#currentDay").text(todayTimeHeader.format("dddd, MMMM D h:mm:ss A"));
}

// get 
function getEvent(block) {
  return JSON.parse(localStorage.getItem(block)) || "";
}

function textBoxColor (number, hour, textBox) {
  if (number > hour) {
    textBox.addClass("future");
    textBox.removeClass("past");
    textBox.removeClass("present");
  } else if (number === hour) {
    textBox.addClass("present");
    textBox.removeClass("past");
    textBox.removeClass("future");
  } else {
    textBox.addClass("past");
    textBox.removeClass("future");
    textBox.removeClass("present");
  }
}

$(function () {
  var template = document.querySelector("#time-block-template");
  // for-loop to rotate through hours of workday
  var today = dayjs().format();
  var number = 9;
  for (var i = 0; i < 9; i++) {
    var timeBlock = template.content.cloneNode(true);
    // select save button
    var $saveButton = $(timeBlock).find("button");
    // select DOM element with "hour of day" time and add one onto the time each loop
    var $timeNumber = $(timeBlock).find("#hour");
    var textBox = $(timeBlock).find("textarea");
    if (number >= 9 && number < 12) {
      var hourMilitary = parseInt(dayjs(today).format("H"));
      textBoxColor(number, hourMilitary, textBox);
      $timeNumber.text(number + "AM");
      number++;
    } else if (number === 12) {
      textBoxColor(number, hourMilitary, textBox);
      $timeNumber.text(number + "PM");
      number = 1;
    } else if (number >= 1 && number <= 5) {
      var hourStandard = parseInt(dayjs(today).format("h"));
      textBoxColor(number, hourStandard, textBox)
      $timeNumber.text(number + "PM");
      number++;
    } else {
      return;
    }
    textBox.text(getEvent($timeNumber.text()));
    $saveButton.attr("data-block", $timeNumber.text());
    $("#time-block-container").append(timeBlock);
  }

  $("#time-block-container").on("click", "button", function () {
    const eventInput = $(this).siblings("textarea").val();
    if (!eventInput) {
      return;
    }
    const timeBlockInput = $(this).attr("data-block");
    localStorage.setItem(timeBlockInput, JSON.stringify(eventInput));
  });

  displayTime();
  setInterval(displayTime, 1000);
});
