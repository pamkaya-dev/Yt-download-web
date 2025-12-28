async function fetchVideo() {
  const url = document.getElementById("yturl").value;
  if (!url) return alert("Paste YouTube link");

  document.getElementById("title").innerText = "Loading...";
  document.getElementById("thumb").src = "";
  document.getElementById("videoList").innerHTML = "";
  document.getElementById("audioList").innerHTML = "";
  document.getElementById("player").src = "";

  try {
    const API = `https://api.bk9.dev/download/yt?url=${encodeURIComponent(url)}`;
    const res = await fetch(API);
    const data = await res.json();

    if (!data.status) {
      document.getElementById("title").innerText = "Error fetching data";
      return;
    }

    const info = data.BK9;
    document.getElementById("title").innerText = info.title;
    document.getElementById("thumb").src = info.thumbnail;

    // Video list
    const videos = info.formats.filter(f => f.type === "video");
    document.getElementById("videoList").innerHTML = videos.map(v => `
      <a class="download-btn" href="${v.url}" target="_blank" onclick="playVideo('${v.url}'); return false;">
        ${v.quality} | ${v.fps}fps | ${v.bitrate}
      </a>
    `).join("");

    // Audio list
    const audios = info.formats.filter(f => f.type !== "video");
    document.getElementById("audioList").innerHTML = audios.length
      ? audios.map(a => `
          <a class="download-btn" href="${a.url}" target="_blank">
            Audio | ${a.bitrate || "Unknown"}
          </a>
        `).join("")
      : "<p>No audio formats</p>";

  } catch (err) {
    console.log(err);
    document.getElementById("title").innerText = "Error fetching qualities";
  }
}

// Play selected video in player
function playVideo(url) {
  const player = document.getElementById("player");
  player.src = url;
  player.play();
}
