/*
search url =  https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=travel&key=AIzaSyDG023jwDUJ6V8yXCjQES9QfVKl0GPtjO8

spacific video details url = https://www.googleapis.com/youtube/v3/videos?part=statistics,player&id=NAFewEYL05o&key=AIzaSyDG023jwDUJ6V8yXCjQES9QfVKl0GPtjO8

spacific video comment url = https://www.googleapis.com/youtube/v3/commentThreads?key=AIzaSyDG023jwDUJ6V8yXCjQES9QfVKl0GPtjO8&part=snippet&videoId=NAFewEYL05o


{
    part: "snippet",
    maxResult: 10, 
    q: "travel",
    key: "AIzaSyDG023jwDUJ6V8yXCjQES9QfVKl0GPtjO8"
}

1. We have search API to get the list of videos based on the search we make.
2. We have another API to get/fetch the details/statistics of a specific video.
3. We have another API to fetch the list of comments of a particular video.

*/

const searchInput = document.getElementById("search-input");
const videosContainer = document.getElementById("videos-container");
const apiKey = "AIzaSyC15sqmePkAyRBN0kOqu5wp_ZuBSCQIuFM";

/* AIzaSyDG023jwDUJ6V8yXCjQES9QfVKl0GPtjO8 */ //this api is not working 1st api
/* AIzaSyC15sqmePkAyRBN0kOqu5wp_ZuBSCQIuFM */ // created 2nd api

function searchVideos() {
  // alert("search button is active.");
  let searchValue = searchInput.value;
  fetchVideos(searchValue);
  // fetchVideoDetails(searchValue);
}

async function fetchVideos(searchValue) {
  let endPoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${searchValue}&key=${apiKey}`;
  try {
    let response = await fetch(endPoint); // videos fetching by using url..(response is the instance of built in Response javascript class. we dont have direnctly data with us to fetch the readable data we have to use json())
    let result = await response.json(); // converting data by using json()
    // console.log(result);
    for (let i = 0; i < result.items.length; i++) {
      // we are running this for loop to fetch the videoId of every 'i' item(every video)(items[i] == one video)
      let video = result.items[i];
      // console.log(video.id.videoId);
      let videoStats = await fetchVideoDetails(video.id.videoId);
      // console.log(videoStats);
      if (videoStats.items.length > 0)
        // videoDuration = videoStats.items[0].contentDetails.duration;
        // console.log(videoStats.items[0].contentDetails.duration);
        result.items[i].videoStats = videoStats.items[0].statistics;
      // result.items[i].duration = videoStats.items[0].contentDetails.duration;
      // here we are adding one key inside (search api) of video-details. which we got from (videoDetails api).

      if (videoStats.items.length > 0) {
        result.items[i].duration = videoStats.items[0].contentDetails.duration;
        // console.log(result.items[i].duration);
      }
    }
    // console.log(result);
    videosContainer.innerHTML = "";
    showThumbnails(result.items);
  } catch (e) {
    console.log("something went wrong", e);
  }
}

function showThumbnails(items) {
  for (let i = 0; i < items.length; i++) {
    let videoItem = items[i];
    let imageUrl = videoItem.snippet.thumbnails.high.url;
    // console.log(imageUrl);
    let videoElement = document.createElement("div");
    videoElement.id = videoItem.id.videoId;
    videoElement.className = "thumb-image";
    videoElement.style.backgroundImage = `url(${imageUrl})`;
    // let title = document.createElement("p");
    // title.className = "title";
    // title.innerText = videoItem.snippet.title;
    // let channelName = document.createElement("p");
    // channelName.className = "channel-name";
    // channelName.innerText = videoItem.snippet.channelTitle;
    let titleAndDetails = document.createElement("div");
    titleAndDetails.className = "title-and-details";
    let videoContainer = document.createElement("div");
    videoContainer.className = "video-container";
    videoContainer.addEventListener("click", () => {
      navigateToVideoPlayer(videoItem.id.videoId);
    });

    let videoDuration = document.createElement("p");
    videoDuration.className = "video-duration";
    videoDuration.innerText = vidDuration(videoItem.duration);
    let footer = document.createElement("div");
    footer.className = "footer-container";
    let channelLogo = document.createElement("div");
    channelLogo.className = "channel-logo";

    const elements = `
        <p class="title">${videoItem.snippet.title}</p>  
        <p class="channel-name">${videoItem.snippet.channelTitle}</p>
        <p class="views">${
          videoItem.videoStats
            ? getViews(videoItem.videoStats.viewCount) + " views"
            : "Playlist"
        }</p>
        `;
    // <b>${videoItem.duration}</b>

    // titleAndDetails.append(title);
    // titleAndDetails.append(channelName);
    videoElement.append(videoDuration);
    titleAndDetails.innerHTML = elements;
    videoContainer.append(videoElement);
    footer.append(titleAndDetails);
    footer.append(channelLogo);
    videoContainer.append(footer);
    videosContainer.append(videoContainer);
  }
}

async function fetchVideoDetails(videoId) {
  let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoId}&key=${apiKey}`;

  let response = await fetch(endpoint);
  let result = await response.json();
  return result;
  // console.log(result);
}
// fetchVideoDetails();
//

// function to convert number views into 10K, 10M like this..
function getViews(n) {
  if (n < 1000) return n;
  else if (n >= 1000 && n <= 999999) {
    n /= 1000;
    n = parseInt(n);
    return n + "K";
  }
  return parseInt(n / 1000000) + "M";
}

function vidDuration(duration) {
  if (!duration) return "Playlist";
  let hoursIndex = duration.indexOf("H");
  let minutesIndex = duration.indexOf("M");
  let secondsIndex = duration.indexOf("S");
  let hours;
  let minutes;
  let seconds;
  let str;
  if (hoursIndex !== -1 && minutesIndex === -1 && secondsIndex === -1) {
    hours = duration.substring(2, hoursIndex);
    // console.log(hours);
    minutes = "00";
    seconds = "00";
    str = `${hours}:${minutes}:${seconds}`;
    return str;
  } else if (hoursIndex !== -1 && minutesIndex !== -1 && secondsIndex !== -1) {
    hours = duration.substring(2, hoursIndex);
    minutes = duration.substring(hoursIndex + 1, minutesIndex);
    seconds = duration.substring(minutesIndex + 1, secondsIndex);
    str = `${hours}:${minutes}:${seconds}`;
    return str;
  } else if (
    duration.length === 6 &&
    minutesIndex !== -1 &&
    secondsIndex !== -1
  ) {
    minutes = duration.substring(2, minutesIndex);
    seconds = duration.substring(minutesIndex + 1, secondsIndex);
    str = `${minutes}:0${seconds}`;
    return str;
  } else if (minutesIndex !== -1 && secondsIndex !== -1) {
    minutes = duration.substring(2, minutesIndex);
    seconds = duration.substring(minutesIndex + 1, secondsIndex);
    str = `${minutes}:${seconds}`;
    return str;
  } else if (secondsIndex === -1) {
    hours = duration.substring(2, hoursIndex);
    minutes = duration.substring(hoursIndex + 1, minutesIndex);
    seconds = "00";
    str = `${hours}:${minutes}:${seconds}`;
    return str;
  } else if (secondsIndex !== -1) {
    seconds = duration.substring(2, secondsIndex);
    minutes = "00";
    str = `${minutes}:${seconds}`;
    return str;
  }
}

// let obj = {
//     "kind": "youtube#searchResult",
//     "etag": "61V67y3y4sYB17bdqhuCQokyAko",
//     "id": {
//         "kind": "youtube#playlist",
//         "playlistId": "PLu0W_9lII9ahR1blWXxgSlL4y9iQBnLpR"
//     },
//     "snippet": {
//         "publishedAt": "2022-07-14T12:51:40Z",
//         "channelId": "UCeVMnSShP_Iviwkknt83cww",
//         "title": "JavaScript Tutorials for Beginners in Hindi",
//         "description": "JavaScript Course in Hindi: This Javascript tutorial in Hindi course is designed for beginners with an aim to take JavaScript/ES6 ...",
//         "thumbnails": {
//             "default": {
//                 "url": "https://i.ytimg.com/vi/ER9SspLe4Hg/default.jpg",
//                 "width": 120,
//                 "height": 90
//             },
//             "medium": {
//                 "url": "https://i.ytimg.com/vi/ER9SspLe4Hg/mqdefault.jpg",
//                 "width": 320,
//                 "height": 180
//             },
//             "high": {
//                 "url": "https://i.ytimg.com/vi/ER9SspLe4Hg/hqdefault.jpg",
//                 "width": 480,
//                 "height": 360
//             }
//         },
//         "channelTitle": "CodeWithHarry",
//         "liveBroadcastContent": "none",
//         "publishTime": "2022-07-14T12:51:40Z"
//     }
// }

// for search response(1st one)
// let obj = {
//     "kind": "youtube#searchResult",
//     "etag": "61V67y3y4sYB17bdqhuCQokyAko",
//     "id": {
//         "kind": "youtube#playlist",
//         "playlistId": "PLu0W_9lII9ahR1blWXxgSlL4y9iQBnLpR"
//     },
//     "snippet": {
//         "publishedAt": "2022-07-14T12:51:40Z",
//         "channelId": "UCeVMnSShP_Iviwkknt83cww",
//         "title": "JavaScript Tutorials for Beginners in Hindi",
//         "description": "JavaScript Course in Hindi: This Javascript tutorial in Hindi course is designed for beginners with an aim to take JavaScript/ES6 ...",
//         "thumbnails": {
//             "default": {
//                 "url": "https://i.ytimg.com/vi/ER9SspLe4Hg/default.jpg",
//                 "width": 120,
//                 "height": 90
//             },
//             "medium": {
//                 "url": "https://i.ytimg.com/vi/ER9SspLe4Hg/mqdefault.jpg",
//                 "width": 320,
//                 "height": 180
//             },
//             "high": {
//                 "url": "https://i.ytimg.com/vi/ER9SspLe4Hg/hqdefault.jpg",
//                 "width": 480,
//                 "height": 360
//             }
//         },
//         "channelTitle": "CodeWithHarry",
//         "liveBroadcastContent": "none",
//         "publishTime": "2022-07-14T12:51:40Z"
//     }
// }

function navigateToVideoPlayer(videoId) {
  let path = "video.html";
  if(videoId){
    document.cookie = `video_id=${videoId}; path = ${path}`;
    let linkPlayer = document.createElement("a");
    linkPlayer.href = "video.html";
    linkPlayer.target = "_blank";
    linkPlayer.click();
  }
  else{
    alert("Go and watch on Youtube");
  }
}
