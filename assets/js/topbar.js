var headElement = document.getElementById("topbar")
var topbarElement = document.createElement("div");
var currentPage = "topbar-" + document.currentScript.getAttribute('page');
var currentButton = document.getElementById(currentPage);

topbarElement.innerHTML = '' +
		'<ul class="topbar">' +
			'<div style="float:left;">' +
				'<li><img src="https://avatars3.githubusercontent.com/u/38215111?s=42&v=4"></li>' +
				'<li><a>SebaUbuntu</a></li>' +
			'</div>' +
			'<div style="float:right;">' +
				'<li><a id="topbar-home" href="index.html">Home</a></li>' +
				'<li><a id="topbar-blog" href="https://blog.sebaubuntu.dev">Blog</a></li>' +
				'<li><a id="topbar-downloads" href="downloads.html">Downloads</a></li>' +
				'<li><a id="topbar-files" href="https://files.sebaubuntu.dev">Files</a></li>' +
				'<li><a id="topbar-contact" href="https://t.me/SebaUbuntu">Contact</a></li>' +
			'</div>' +
		'</ul>';

headElement.appendChild(topbarElement);

currentButton.setAttribute("class", "active");
