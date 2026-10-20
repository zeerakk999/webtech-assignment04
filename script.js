
var mdBox        = document.getElementById("md");
var preview      = document.getElementById("preview");
var presentSlide = document.getElementById("presentSlide");
var previewCount = document.getElementById("previewCount");
var presentCount = document.getElementById("presentCount");
var presentBox   = document.getElementById("present");
var msg          = document.getElementById("msg");

var slides = [];
var index  = 0;

function splitMd(text) {
  var parts = [];
  var current = [];

  var lines = text.split("\n");
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() === "---") {
      parts.push(current.join("\n"));
      current = [];
    } else {
      current.push(lines[i]);
    }
  }
  parts.push(current.join("\n"));
  return parts;
}

function mdToHtml(md) {
  var html = "";
  var lines = md.split("\n");

  for (var i = 0; i < lines.length; i++) {
    var t = lines[i].trim();
    if (t === "") continue;

    if (t.indexOf("## ") === 0) {
      html += "<h2>" + t.slice(3) + "</h2>";
    } else if (t.indexOf("# ") === 0) {
      html += "<h1>" + t.slice(2) + "</h1>";
    } else {
      html += "<p>" + t + "</p>";
    }
  }
  return html;
}

// rebuild the slides array from the textarea
function update() {
  var raw = splitMd(mdBox.value);

  slides = [];
  for (var i = 0; i < raw.length; i++) {
    slides.push(mdToHtml(raw[i]));
  }

  if (index > slides.length - 1) index = slides.length - 1;
  if (index < 0) index = 0;

  draw();
}

// push the current slide into both screens
function draw() {
  var html = slides[index] || "";

  preview.innerHTML = html;
  presentSlide.innerHTML = html;

  previewCount.innerHTML = (index + 1) + " / " + slides.length;
  presentCount.innerHTML = (index + 1) + " / " + slides.length;

  setDisabled(".prev", index === 0);
  setDisabled(".next", index === slides.length - 1);
}

function setDisabled(selector, state) {
  var btns = document.querySelectorAll(selector);
  for (var i = 0; i < btns.length; i++) {
    btns[i].disabled = state;
  }
}

function next() {
  if (index < slides.length - 1) {
    index++;
    draw();
  }
}

function prev() {
  if (index > 0) {
    index--;
    draw();
  }
}

function toggleFull() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}

function save() {
  localStorage.setItem("slidesData", mdBox.value);
  msg.innerHTML = "Saved";
  setTimeout(function () {
    msg.innerHTML = "";
  }, 1500);
}

function startPresent() {
  presentBox.classList.remove("hidden");
}

function stopPresent() {
  presentBox.classList.add("hidden");
}


mdBox.addEventListener("input", update);

document.getElementById("saveBtn").addEventListener("click", save);
document.getElementById("presentBtn").addEventListener("click", startPresent);
document.getElementById("closeBtn").addEventListener("click", stopPresent);

var prevBtns = document.querySelectorAll(".prev");
for (var i = 0; i < prevBtns.length; i++) {
  prevBtns[i].addEventListener("click", prev);
}

var nextBtns = document.querySelectorAll(".next");
for (var j = 0; j < nextBtns.length; j++) {
  nextBtns[j].addEventListener("click", next);
}

var fsBtns = document.querySelectorAll(".fs");
for (var k = 0; k < fsBtns.length; k++) {
  fsBtns[k].addEventListener("click", toggleFull);
}

document.addEventListener("fullscreenchange", function () {
  var text = document.fullscreenElement ? "Exit Full Screen" : "Full Screen";
  var all = document.querySelectorAll(".fs");
  for (var i = 0; i < all.length; i++) {
    all[i].innerHTML = text;
  }
});

document.addEventListener("keydown", function (e) {

  if (e.ctrlKey && e.key.toLowerCase() === "s") {
    e.preventDefault();
    save();
    return;
  }

  if (e.key === "F11") {
    e.preventDefault();
    toggleFull();
    return;
  }

  if (e.target.tagName === "TEXTAREA") return;

  if (e.key === "ArrowRight") next();
  if (e.key === "ArrowLeft")  prev();
  if (e.key === "Escape")     stopPresent();
});


var saved = localStorage.getItem("slidesData");
if (saved !== null) {
  mdBox.value = saved;
}

if (mdBox.value.trim() === "") {
  mdBox.value =
    "# Slide 01\n" +
    "## Heading 02 in slide 01\n" +
    "This is your content on slide 01\n" +
    "---\n" +
    "# Slide 02\n" +
    "## Heading 02 in slide 02\n" +
    "This is your content on slide 02";
}

update();