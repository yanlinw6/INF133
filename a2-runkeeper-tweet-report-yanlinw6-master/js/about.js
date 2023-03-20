function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length; 
	
	//Get the Tweet dates.
	var firstDate = null;
	var lastDate = null;
	var firstDateMS = null;
	var lastDateMS = null;
	for (var i = 0; i < tweet_array.length; i++) {
		var date = tweet_array[i].time;
		var time = Date.parse(date);
		if (i == 0) {
			firstDate = date;
			lastDate = date;
			firstDateMS = time;
			lastDateMS = time;
			continue;
		}
		if (time < firstDateMS) {
			firstDate = date;
			firstDateMS = time;
		}
		if (time > lastDateMS) {
			lastDate = date;
			lastDateMS = time;
		}
	}
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = firstDate.toLocaleDateString(undefined, options);
	document.getElementById('lastDate').innerText = lastDate.toLocaleDateString(undefined, options);
	
	//Get the Tweet categories, and how many of each.
	var numCompleted = 0;
	var numLive = 0;
	var numAchievement = 0;
	var numMiscellaneous = 0; 
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].source === "completed_event") {
			numCompleted++;
		} 
		if (tweet_array[i].source === "live_event") {
			numLive++;
		}
		if (tweet_array[i].source === "achievement") {
			numAchievement++;
		}
		if (tweet_array[i].source === "miscellaneous") {
			numMiscellaneous++;
		}
	}

	//Percentage of completed events, live events, achievements, and miscellaneous.
	document.getElementsByClassName('completedEvents')[0].innerText = numCompleted;
	document.getElementsByClassName('completedEventsPct')[0].innerText = Math.round(numCompleted*10000/tweet_array.length)/100 + "%";
	document.getElementsByClassName('liveEvents')[0].innerText = numLive;
	document.getElementsByClassName('liveEventsPct')[0].innerText = Math.round(numLive*10000/tweet_array.length)/100 + "%";
	document.getElementsByClassName('achievements')[0].innerText = numAchievement;
	document.getElementsByClassName('achievementsPct')[0].innerText = Math.round(numAchievement*10000/tweet_array.length)/100 + "%";
	document.getElementsByClassName('miscellaneous')[0].innerText = numMiscellaneous;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = Math.round(numMiscellaneous*10000/tweet_array.length)/100 + "%";

	//Get the total user-written text on completed events.
	var numWritten = 0;
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written) {
			numWritten++;
		}
	}
	document.getElementsByClassName('completedEvents')[1].innerText = numCompleted;
	document.getElementsByClassName('written')[0].innerText = numWritten;
	document.getElementsByClassName('writtenPct')[0].innerText = Math.round(numWritten*10000/numCompleted)/100 + "%";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});