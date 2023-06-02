let cookieString = document.cookie;
// console.log(cookieString);
let videoId = cookieString.split("=")[1];
console.log(videoId);

// let firstScript = document.getElementsByTagName("script")[0];
// firstScript.addEventListener("load", onLoadScript);

// function onLoadScript(){
//     if(YT){
//         new YT.Player("video-player", {
//             width: "1000",
//             height: "600",
//             videoId,
//             events: {
//                 onReady: (event) => {
//                     document.title = event.target.videoTitle;
//                 }
//             }
//         })
//     }
// }
setTimeout(() => {
    if(YT){
        new YT.Player("video-player", {
            width: "1000",
            height: "600",
            videoId,
            events: {
                onReady: (event) => {
                    document.title = event.target.videoTitle;
                }
            }
        })
    }
}, 1000)