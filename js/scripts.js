var project;
var donation;
var donationData = {};
var index;
var id = location.search ? location.search.replace('?id=', '') : 0;


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }

// xhr.withCredentials = true;
//   xhr.setRequestHeader('Authorization' , "Basic " + btoa(username + ":" + password));

  return xhr;
}

function makeCorsRequest(url) {

    $('#loader').css({display: 'block'})
    $('#welcome h3').css({display: 'none'})
    $('#welcome h4').css({display: 'none'})
  // All HTML5 Rocks properties support CORS.

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    result = JSON.parse(xhr.response);
    // PROJECT INFORMATION IS IN 'result.results'
    project = result.results[index];
    window.project = project;
    showProject(project);
    $('#loader').css({display: 'none'})
    $('#welcome h3').css({display: 'inline-block'})
    $('#welcome h4').css({display: 'inline-block'})
  };

  xhr.onerror = function(err) {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();

}

function makeCorsRequestDonation(ProjectId, successCallback) {
  var projectCount = 'sol-y-frutas';
  var count = [];
  var test;

  // All HTML5 Rocks properties support CORS.
  var url = 'https://testing.onepercentclub.com/api/donations/project/?project=' + ProjectId;

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    result = JSON.parse(xhr.response);
    // PROJECT INFORMATION IS IN 'result.results'
    console.log(result)
    window.donations = result;
    successCallback(result.length);
  };

  xhr.onerror = function(err) {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}

function calcDays(start, end) {
    var startCampaign = new Date(start),
        deadline = new Date(end),
        oneDay = 86400000;

    var diffDays = Math.round(Math.abs((startCampaign.getTime() - deadline.getTime())/(oneDay)));

    return diffDays;
}

function showProject(project){
    $('.mainTitle').html(project.title)

    $('.campaigner').html('My name is ' + project.owner.first_name)
    // $('.campaignerGoal').html(project.owner.first_name + ' has a mission in ' + project.country.name + ':')
    $('.pitch').html(project.pitch)
    $('.campaignerHow').html('So ' + project.owner.first_name + ' started a crowdfunding campaign at 1%Club')

    $('.raised').html('I managed to raise' + '<font color="#FF619A">' + ' €' + project.amount_donated + '</font>')
    $('.days').html('In only ' + '<font color="#FF619A">' + calcDays(project.created, project.deadline) + '</font>' + ' days')
    
  
    var img = document.createElement('img');
    $('#overview .background .background-image').css('background-image', 'url(' + project.image.large + ')') 
    $('#fullscreen .background-image').css('background-image', 'url(' + project.image.full + ')')
    $('.avatarCampaigner').css('background-image', 'url(' + project.owner.avatar + ')')
    $('#pictures ul li #polaroid #picture').css('background-image', 'url(' + project.image.large + ')')

    makeCorsRequestDonation(project.id, function (count) {
        $('.supporters').html('With the help of ' + '<font color="#FF619A">' + count + '</font>' + ' supporters')

        // Do something with your donations and user avatars here
        for (var i=0; i<window.donations.length; i++) {
          // IF the donation has a user, and the avatar key is not empty, do something
          if (window.donations[i].user) {
            console.log("Avatar: ", window.donations[i].user.avatar);
            $('.supporters-list').append('<li><p>' + window.donations[i].user.full_name + '</p><img src="' + window.donations[i].user.avatar + '" </img></li>');
          }
        }
    });

    mapUrl = 'https://maps.googleapis.com/maps/api/staticmap?size=640x450&language=english&scale=2&zoom=6&maptype=roadmap&key=AIzaSyCtV9YdifhUTWLtOoC1T-JNew34FelyuBk&';
    mapUrl += 'center=' + project.latitude + ',' + project.longitude;

 // + '&markers=color:red%7Clabel:P%7C' + project.latitude + ',' + project.longitude

    //debugger

    $(img).attr('src', mapUrl);

    $('#map-static').append(img);
}



$(document).ready(function(){

    $('.curtains').curtain({
        scrollSpeed:1200
    });

    $('.curtains>li').css('position', 'fixed');

   
    var scrollorama = $.scrollorama({
        blocks:'.curtains'
    });
    
    // scrollorama.animate('#welcome h3, #welcome p',{
    //  duration:200, property:'top', end:400
    // });

    scrollorama.animate('#overview li:nth-child(1)',{
        delay: 4250, duration:150, property:'left', start:-800, end:219
    });

    scrollorama.animate('#overview li:nth-child(2)',{
        delay: 4300, duration:150, property:'left', start:-800, end:219
    });

    scrollorama.animate('#overview li:nth-child(3)',{
        delay: 4350, duration:150, property:'left', start:-800, end:219
    });

    scrollorama.animate('#how #icon',{
        delay: 3200, duration:800, property:'left', start:-300, end:1300
    });
    
    // scrollorama.animate('#pictures ul li:nth-child(1)',{
    //  delay: 1600, duration:200, property:'left', start:-620, end:0
    // });

    // scrollorama.animate('#pictures ul li:nth-child(2)',{
    //  delay: 1600, duration:200, property:'right', start:-620, end:0
    // });

    // scrollorama.animate('#pictures ul li:nth-child(3)',{
    //  delay: 1600, duration:200, property:'top', start:620, end:0
    // });

    // scrollorama.animate('#fullscreen ul li',{
    //  delay: 2400, duration:200, property:'top', start:900, end:500
    // });

    // scrollorama.animate('#thankyou h3, #thankyou p',{
    //  delay: 3600, duration:200, property:'top', start:250, end:450
    // });
    
  
    //Get Project details
    var page = parseInt(id/10);
    index = (id % 10);
    var projectPageUrl = 'https://testing.onepercentclub.com/api/bb_projects/projects/?page=' + page;
    makeCorsRequest(projectPageUrl);


});
