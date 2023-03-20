"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        var textArr = this.text.split(" ");
        if (textArr[0] === "Just" && textArr[1] === "completed" || textArr[0] === "Just" && textArr[1] === "posted") {
            return "completed_event";
        }
        else if (textArr[0] === "Watch" && textArr[1] === "my") {
            return "live_event";
        }
        else if (textArr[0] === "Achieved") {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        if (this.source === "miscellaneous") {
            return true;
        }
        var textArr = this.text.split(" ");
        for (var i = 0; i < textArr.length; i++) {
            if (textArr[i] === "-") {
                return true;
            }
        }
        return false;
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        if (this.source === "miscellaneous") {
            return this.text;
        }
        //TODO: parse the written text from the tweet
        var output = this.text.slice(this.text.indexOf("-") + 2, this.text.length - 35);
        /*
        var textArr = this.text.split("-")[1].split(" ");
        var startIdx = 0; //inclusive
        var endIdx = textArr.length - 2; // exclusive
        var output = "";
        for (var i = startIdx; i < endIdx; i++) {
            output += textArr[i];
            if (i != endIdx - 1) {
                output += " ";
            }
        }
        */
        return output.trim();
    }
    get activityType() {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        // strip of everything after "-" and "with"
        var textArr = this.text.split("-")[0].split("with")[0].split(" ");
        var startIdx = 0; //inclusive
        var endIdx = 0; // exclusive
        if (textArr.indexOf("in") != -1) {
            // case 1: "Just posted a .... in ?:?? with @runkeeper"
            startIdx = 3;
            endIdx = textArr.indexOf("in");
        }
        else {
            // case 2: "Just posted/completed a ??? km/mi .... with @runkeeper"
            startIdx = 5;
            endIdx = textArr.length;
        }
        var output = "";
        for (var i = startIdx; i < endIdx; i++) {
            output += textArr[i];
            if (i != endIdx - 1) {
                output += " ";
            }
        }
        if (output.trim() === "activity" || output.trim() === "sports") {
            return "unknown";
        }
        return output.trim();
    }
    get distance() {
        if (this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        // strip of everything after "-" and "with"
        var textArr = this.text.split("-")[0].split("with")[0].split(" ");
        if (textArr.indexOf("in") != -1) {
            // case 1: "Just posted a .... in ?:?? with @runkeeper"
            return 0;
        }
        else {
            // case 2: "Just posted/completed a ??? km/mi .... with @runkeeper"
            if (textArr[4] === "km") {
                return parseFloat(textArr[3]) / 1.609;
            }
            if (textArr[4] === "mi") {
                return parseFloat(textArr[3]);
            }
        }
        return 0;
    }
    //Define another function for bonus part.
    //Mining sentiment from the text.
    get sentiment() {
        /*
        var posAdjs = ["nice", "glad", "good", "well", "easy", "best", "great", "happy", "excited"];
        var negAdjs = ["rude", "nothing", "hurt", "automatic", "impersonal", "slow", "annoyed"];
        */
        var posScore = 0;
        var negScore = 0;
        posScore += (this.writtenText.toLowerCase().match(/nice/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/glad/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/good/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/well/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/easy/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/best/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/great/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/happy/g) || []).length;
        posScore += (this.writtenText.toLowerCase().match(/excited/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/rude/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/nothing/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/automatic/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/impersonal/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/slow/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/annoyed/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/poor/g) || []).length;
        negScore += (this.writtenText.toLowerCase().match(/bad/g) || []).length;
        if (posScore > negScore) {
            return "positive";
        }
        if (posScore < negScore) {
            return "negative";
        }
        return "unknown";
    }
    getHTMLTableRow(rowNumber) {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
