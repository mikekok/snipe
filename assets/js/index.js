// Requirements
const fs = require('fs')
const clipboard = require('electron').clipboard
const remote = require('electron').remote
const youtubedl = require('youtube-dl')
const Menu = remote.Menu

// Add right click menu to inputs
const InputMenu = Menu.buildFromTemplate([{
  label: 'Undo',
  role: 'undo',
}, {
  label: 'Redo',
  role: 'redo',
}, {
  type: 'separator',
}, {
  label: 'Cut',
  role: 'cut',
}, {
  label: 'Copy',
  role: 'copy',
}, {
  label: 'Paste',
  role: 'paste',
}, {
  type: 'separator',
}, {
  label: 'Select all',
  role: 'selectall',
}, ])

document.body.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  e.stopPropagation()

  let node = e.target

  while (node) {
    if (node.nodeName.match(/^(input|textarea)$/i) || node.isContentEditable) {
      InputMenu.popup(remote.getCurrentWindow())
      break;
    }
    node = node.parentNode
  }
})

// When document is ready
$(document).ready(function() {
  let currentClipboard = clipboard.readText()
  if (isYoutubeURL(currentClipboard)) {
    $('.url').val(currentClipboard)
    getInfo(currentClipboard)
  }
})

// Exit Button
$('.exit').click(function() {
  var window = remote.getCurrentWindow()
  window.close()
})

// Minimize Button
$('.mini').click(function() {
  var window = remote.getCurrentWindow()
  window.minimize()
})

// Download Button
$('.download').click(function() {
  let currentURL = $('.url').val()
  download(currentURL)
})

// On URL input paste
$(".url").on("paste", function() {
  let currentURL = $(this).val()
  download(currentURL)
})

// Get YouTube Video Information
function getInfo(url) {
  youtubedl.getInfo(url, function(err, info) {
    if (err) throw err
    $('.video > h3').text(info.title)
    $('.info').slideToggle()
  })
}

// Download Function
function download(url) {
  if (isYoutubeURL(url)) {
    let format = $('.format').val()
    if (format == 'MP4') {
      downloadVideo(url)
    } else {
      downloadMP3(url)
    }
  }
}

// Download YouTube Video
function downloadVideo(url) {
  var video = youtubedl(url, ['--format=22/17/18'], {
    cwd: __dirname
  })
  video.on('info', function(info) {
    video.pipe(fs.createWriteStream(info.title + '.mp4'))
  })
}

function downloadMP3(url) {
  var video = youtubedl(url, ['--format=bestaudio'], {
    cwd: __dirname
  })
  video.on('info', function(info) {
    video.pipe(fs.createWriteStream(info.title + '.mp3'))
  })
}

// YouTube Video URL Validation
function isYoutubeURL(url) {
  var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return url.match(p)[1];
  }
  return false;
}

// KB to MB Convertion
function convertBytes(bytes) {
  if (bytes >= 1073741824) {
    bytes = (bytes / 1073741824).toFixed(2) + ' GB'
  } else if (bytes >= 1048576) {
    bytes = (bytes / 1048576).toFixed(2) + ' MB'
  } else if (bytes >= 1024) {
    bytes = (bytes / 1024).toFixed(2) + ' KB'
  } else if (bytes > 1) {
    bytes = bytes + ' bytes'
  } else if (bytes == 1) {
    bytes = bytes + ' byte'
  } else {
    bytes = '0 byte'
  }
  return bytes
}
