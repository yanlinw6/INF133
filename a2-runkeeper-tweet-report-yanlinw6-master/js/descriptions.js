function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: Filter to just the written tweets
	document.getElementById('searchCount').innerText = "0";
	document.getElementById('textFilter').value = "";
	document.getElementById('searchText').innerText = "";
	document.getElementsByClassName('table table-striped')[0].style.tableLayout = "auto";
	//return string to modify html.
	document.getElementsByClassName('table table-striped')[0].firstElementChild.firstElementChild.innerHTML += "<th scope='col'>Sentiment</th>";
	//Get results while there is an input.
	document.getElementById('textFilter').oninput = function (event) {
		var txt = this.value;
		var count = 0;
		var inner = "";
		for (var i = 0; i < tweet_array.length; i++) {
			if (tweet_array[i].writtenText.toLowerCase().indexOf(txt.toLowerCase()) > -1) {
				count++;
				inner += "<tr>";
				inner += "<td style='width:1px;white-space:nowrap;'>";
				inner += count;
				inner += "</td>";
				inner += "<td style='width:1px;white-space:nowrap;'>";
				inner += tweet_array[i].activityType;
				inner += "</td>";
				inner += "<td>";
				inner += tweet_array[i].text;
				inner += "</td>";
				inner += "<td>";
				inner += tweet_array[i].sentiment;
				inner += "</td>";
				inner += "</tr>";
			}
		}
		if (document.getElementById('textFilter').value === "") {
			inner = "";
		}
		document.getElementById('searchCount').innerText = count;
		document.getElementById('searchText').innerText = txt;
		document.getElementById('tweetTable').innerHTML = inner;
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});