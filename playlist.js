let CurrentSong = new Audio();
let songs;
function formatTime(seconds) {
    // floor minutes
    let minutes = Math.floor(seconds / 60);
    // remaining seconds
    let secs = seconds % 60;

    // pad with leading zero if needed
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(secs).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


//---------------------------------------------------------------------------------------------------------


// getting songs from songs folder using fetch 
async function GetSongs() {

    let a = await fetch("http://127.0.0.1:3002/song/");
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split("/song/")[1])
        }
    }
    return songs;

}


//---------------------------------------------------------------------------------------------------------



//play the music
const PlayMusic = (track, pause = false) => {
    // let audio = new Audio("/song/" + track)
    CurrentSong.src = "/song/" + track;
    if (!pause) {
        CurrentSong.play();
        play.className = "hgi-stroke hgi-play"
    }
    document.querySelector(".song_info").innerHTML = decodeURI(track);
    document.querySelector(".song_time").innerHTML = "00:00 / 00:00";
}

//---------------------------------------------------------------------------------------------------------

//show all the songs in the playlist
async function main() {

    songs = await GetSongs()
    PlayMusic(songs[0], true)
    // console.log(songs);

    let songUL = document.querySelector(".songlist").getElementsByTagName("ol")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
        <i style="font-size: 25px;" class="hgi-stroke hgi-music-note-01"></i>
            <div class="artist_info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Hammad</div>
             </div>
             <div class="play_now">
             <span>Play now</span>
             <i style="font-size: 25px;" class="hgi-stroke hgi-play"></i>
            </div>
        </li>`
    }

    // //play the first song
    // var audio = new Audio(songs[0])
    // audio.play();

    // audio.addEventListener("loadeddata", () => {
    //     // let duration = audio.duration;
    //     console.log(audio.duration, audio.currentSrc, audio.currentTime);

    // })

    //---------------------------------------------------------------------------------------------------------

    // onclick play songs
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector('.artist_info').firstElementChild.innerHTML);
            PlayMusic(e.querySelector('.artist_info').firstElementChild.innerHTML.trim());
        })

    })

    // play the song
    let play = document.getElementById("play")
    play.addEventListener("click", () => {
        if (CurrentSong.paused) {
            CurrentSong.play()
            play.className = "hgi-stroke hgi-pause"
        }
        else {
            CurrentSong.pause()
            play.className = "hgi-stroke hgi-play"

        }
    })

    //---------------------------------------------------------------------------------------------------------

    // Added eventlistener for timeupdate events
    CurrentSong.addEventListener("timeupdate", () => {
        console.log(CurrentSong.currentTime, CurrentSong.duration);

        document.querySelector(".song_time").innerHTML = `${formatTime(Math.floor(CurrentSong.currentTime))} / ${formatTime(Math.floor(CurrentSong.duration))}`

        document.querySelector(".circle").style.left = (CurrentSong.currentTime / CurrentSong.duration) * 100 + "%";
    })

    //---------------------------------------------------------------------------------------------------------

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        CurrentSong.currentTime = ((CurrentSong.duration) * percent) / 100;
        // console.log(e.offsetX);
        // console.log(e.target.getBoundingClientRect().width);

    })
    //---------------------------------------------------------------------------------------------------------

    //hamburger controls to pop up library section
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    //hamburger controls to close library section
    document.querySelector(".right").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%";
    })

    //---------------------------------------------------------------------------------------------------------

    document.querySelector("#previous").addEventListener("click", () => {
        console.log('previous click');
        CurrentSong.pause()
        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            PlayMusic(songs[index - 1]);
        }
    })
    // next song button
    document.querySelector("#next").addEventListener("click", () => {
        console.log('next click');
        CurrentSong.pause()
        let index = songs.indexOf(CurrentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            PlayMusic(songs[index + 1]);
        }

    })

}
main()

