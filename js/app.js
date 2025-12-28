async function fetchVideo() {
  const yt = document.getElementById("yturl").value;
  if (!yt) return alert("Paste YouTube link");

  document.getElementById("title").innerText = "Loading...";
  document.getElementById("thumb").src = "";
  document.getElementById("videoList").innerHTML =
  videos.map(v => {
    const sizeMB = v.filesize ? (v.filesize / 1024 / 1024).toFixed(2) : 'Unknown';
    return `
      <a class="download-btn" href="${v.url}" target="_blank" download>
        ${v.quality} | ${v.fps}fps | ${v.bitrate} | ~${sizeMB}MB
      </a>
    `;
  }).join("");
  document.getElementById("audioList").innerHTML = "";

  try {
    const API = `https://api.bk9.dev/download/yt?url=${encodeURIComponent(yt)}`;
    const res = await fetch(API);
    const json = await res.json();

    if (!json.status) {
      document.getElementById("title").innerText = "Error fetching data";
      return;
    }

    const data = json.BK9;
    document.getElementById("title").innerText = data.title;
    document.getElementById("thumb").src = data.thumbnail || "";

    const formats = data.formats;

    // VIDEO
    /* VIDEO */
const videos = formats.filter(f => f.type === "video");

document.getElementById("videoList").innerHTML =
  videos.map(v => `
    <a class="download-btn" href="${v.url}" target="_blank">
      ${v.quality} | ${v.fps}fps | ${v.bitrate}
    </a>
  `).join("");
    // AUDIO
    const audios = formats.filter(f => f.type !== "video");
    document.getElementById("audioList").innerHTML = audios.length
      ? audios.map(a => {
          const sizeMB = a.filesize ? (a.filesize / 1024 / 1024).toFixed(2) : 'Unknown';
          return `
            <a class="download-btn" href="${a.url}" target="_blank" download>
              Audio | ${a.bitrate || "Unknown"} | ~${sizeMB}MB
            </a>
          `;
        }).join("")
      : "<p>No audio formats</p>";

  } catch (err) {
    console.log(err);
    document.getElementById("title").innerText = "Error fetching data";
  }
}
