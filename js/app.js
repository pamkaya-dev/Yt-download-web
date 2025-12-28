async function fetchVideo() {
  const yt = document.getElementById("yturl").value;
  if (!yt) return alert("Paste YouTube link");

  document.getElementById("title").innerText = "Loading...";
  document.getElementById("videoList").innerHTML = "";
  document.getElementById("audioList").innerHTML = "";

  const API = `https://api.bk9.dev/download/yt?url=${encodeURIComponent(yt)}`;

  try {
    const res = await fetch(API);
    const json = await res.json();

    if (!json.status) {
      document.getElementById("title").innerText = "Error";
      return;
    }

    const data = json.BK9;
    const formats = data.formats;

    document.getElementById("title").innerText = data.title;

    /* VIDEO */
    formats
      .filter(f => f.type === "video")
      .forEach(v => {
        const btn = document.createElement("button");
        btn.className = "download-btn";
        btn.innerText = `${v.quality} | ${v.fps}fps | ${v.bitrate}`;
        btn.onclick = () => forceDownload(v.url, "video.mp4");
        document.getElementById("videoList").appendChild(btn);
      });

    /* AUDIO */
    formats
      .filter(f => f.type !== "video")
      .forEach(a => {
        const btn = document.createElement("button");
        btn.className = "download-btn";
        btn.innerText = `Audio | ${a.bitrate || "unknown"}`;
        btn.onclick = () => forceDownload(a.url, "audio.mp3");
        document.getElementById("audioList").appendChild(btn);
      });

  } catch (e) {
    document.getElementById("title").innerText = "Failed";
  }
}

/* 🔥 FORCE DOWNLOAD FUNCTION */
function forceDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
