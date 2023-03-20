function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if (runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	//Get each unique activity and not count in the activity that is "Unknown".
	var uniqueActivities = new Set(); //using set to avoid duplicates.
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType !== "unknown") {
			uniqueActivities.add(tweet_array[i].activityType);
		}
	}
	document.getElementById('numberActivities').innerText = uniqueActivities.size;

	//Get the three most popular activities.
	var acts = [];
	var actsVis = [];
	for (var act of uniqueActivities) {
		acts.push({
			"name": act,
			"num": 0
		});
		actsVis.push({
			"Activity": act,
			"Frequency": 0
		});
	}
	for (var i = 0; i < tweet_array.length; i++) {
		for (var j = 0; j < acts.length; j++) {
			if (acts[j].name === tweet_array[i].activityType) {
				acts[j].num++;
			}
			if (actsVis[j].Activity === tweet_array[i].activityType) {
				actsVis[j].Frequency++;
			}
		}
	}

	var highestNum = 0;
	var highestPos = 0;
	var act1 = "";
	for (var i = 0; i < acts.length; i++) {
		if (acts[i].num > highestNum) {
			highestNum = acts[i].num;
			act1 = acts[i].name;
			highestPos = i;
		}
	}
	acts.splice(highestPos, 1);
	highestNum = 0;
	highestPos = 0;
	var act2 = "";
	for (var i = 0; i < acts.length; i++) {
		if (acts[i].num > highestNum) {
			highestNum = acts[i].num;
			act2 = acts[i].name;
			highestPos = i;
		}
	}
	acts.splice(highestPos, 1);
	highestNum = 0;
	highestPos = 0;
	var act3 = "";
	for (var i = 0; i < acts.length; i++) {
		if (acts[i].num > highestNum) {
			highestNum = acts[i].num;
			act3 = acts[i].name;
			highestPos = i;
		}
	}
	document.getElementById('firstMost').innerText = act1;
	document.getElementById('secondMost').innerText = act2;
	document.getElementById('thirdMost').innerText = act3;

	//Get the longest and the shortest distance of activities.
	var dist1 = 0;
	var dist2 = 0;
	var dist3 = 0;
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType === act1) {
			dist1 += tweet_array[i].distance;
		}
		if (tweet_array[i].activityType === act2) {
			dist2 += tweet_array[i].distance;
		}
		if (tweet_array[i].activityType === act3) {
			dist3 += tweet_array[i].distance;
		}
	}
	var longestActivityType = "";
	if (Math.max(dist1, dist2, dist3) == dist1) {
		longestActivityType = act1;
	}
	if (Math.max(dist1, dist2, dist3) == dist2) {
		longestActivityType = act2;
	}
	if (Math.max(dist1, dist2, dist3) == dist3) {
		longestActivityType = act3;
	}
	var shortestActivityType = "";
	if (Math.min(dist1, dist2, dist3) == dist1) {
		shortestActivityType = act1;
	}
	if (Math.min(dist1, dist2, dist3) == dist2) {
		shortestActivityType = act2;
	}
	if (Math.min(dist1, dist2, dist3) == dist3) {
		shortestActivityType = act3;
	}
	document.getElementById('longestActivityType').innerText = longestActivityType;
	document.getElementById('shortestActivityType').innerText = shortestActivityType;

	//Get the result of whether users like doing their activies on weekdays or weekends.
	var weekdaysTotal = 0;
	var weekendsTotal = 0;
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType === longestActivityType) {
			if (tweet_array[i].time.getDay() === 0 || tweet_array[i].time.getDay() === 6) {
				weekendsTotal += tweet_array[i].distance;
			} else {
				weekdaysTotal += tweet_array[i].distance;
			}
		}
	}
	if (weekdaysTotal / 5 > weekendsTotal / 2) {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekdays";
	} else {
		document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";
	}

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	//First histogram: How many of each type of activity exists in the dataset.
	activity_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the number of Tweets containing each type of activity.",
		"data": {
			"values": actsVis
		},
		"mark": "bar",
		"encoding": {
			"x": {
				"field": "Activity",
				"type": "nominal",
				"axis": {
					"labelAngle": 90
				},
				"sort": "descending"
			},
			"y": {
				"field": "Frequency",
				"type": "quantitative",
			}
		}
	};
	vegaEmbed('#activityVis', activity_vis_spec, { actions: false });

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	//A plot of the distances by day of the week for all of the three most tweeted-about activities
	var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
	var distVday = [];
	for (var i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].activityType === act1 || tweet_array[i].activityType === act2 || tweet_array[i].activityType === act3) {
			distVday.push({
				"time (day)": days[tweet_array[i].time.getDay()],
				"distance": tweet_array[i].distance,
				"Activity": tweet_array[i].activityType
			});
		}
	}

	distance_vis_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph which group the three most-tweeted activities by the day of the week.",
		"data": {
			"values": distVday
		},
		"mark": "point",
		"encoding": {
			"x": {
				"field": "time (day)",
				"type": "nominal",
				"axis": {
					"labelAngle": 0
				},
				"sort": days //from Sunday to Saturday, in the order.
			},
			"y": {
				"field": "distance",
				"type": "quantitative",
			},
			"color": {
				"field": "Activity",
				"type": "nominal",
			}
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });

	//A plot of the distances by day of the week for all of the three most tweeted-about activities, 
	//aggregating the activities by the mean.
	var distVdayAgg = [];
	for (var i = 0; i < days.length; i++) {
		distVdayAgg.push({
			"Time": days[i],
			"Mean_distance": 0,
			"Activity": act1,
			"num": 0
		});
		distVdayAgg.push({
			"Time": days[i],
			"Mean_distance": 0,
			"Activity": act2,
			"num": 0
		});
		distVdayAgg.push({
			"Time": days[i],
			"Mean_distance": 0,
			"Activity": act3,
			"num": 0
		});
	}
	for (var i = 0; i < tweet_array.length; i++) {
		for (var j = 0; j < distVdayAgg.length; j++) {
			if (tweet_array[i].activityType === distVdayAgg[j].Activity && days[tweet_array[i].time.getDay()] === distVdayAgg[j].Time) {
				distVdayAgg[j].Mean_distance += tweet_array[i].distance;
				distVdayAgg[j].num++;
			}
		}
	}

	distance_vis_agg_spec = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph which group the three most-tweeted activities by the day of the week.",
		"data": {
			"values": distVdayAgg
		},
		"mark": "point",
		"encoding": {
			"x": {
				"title": "time (day)",
				"field": "Time",
				"type": "nominal",
				"axis": {
					"labelAngle": 0
				},
				"sort": days
			},
			"y": {
				"title": "Mean distance",
				"field": "Mean_distance",
				"type": "quantitative",
			},
			"color": {
				"field": "Activity",
				"type": "nominal",
			}
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_agg_spec, { actions: false });
	document.getElementById("distanceVisAggregated").style.display = "none"; 

	var aggregated = false;
	document.getElementById('aggregate').style.display = "block"; 
	document.getElementById('aggregate').onclick = function () {
		if (!aggregated) {
			aggregated = true;
			document.getElementById("distanceVis").style.display = "none"; 
			document.getElementById("distanceVisAggregated").style.display = "block"; 
			document.getElementById('aggregate').innerText = "Show all activities";
		} else {
			aggregated = false;
			document.getElementById("distanceVis").style.display = "block"; 
			document.getElementById("distanceVisAggregated").style.display = "none"; 
			document.getElementById('aggregate').innerText = "Show means";
		}
	}
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});