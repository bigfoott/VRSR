<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<link rel="icon" href="images/vrsrfavicon.png">
		
		<title>VR Speedrunning</title>
		
		<meta content="Bigft.io" property="og:site_name">
		<meta content="VR SPeedrunning" property="og:title">
		<meta content="#4cd1ff" name="theme-color">
		
		<script src="https://kit.fontawesome.com/d16c543bf8.js" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
		<link rel="stylesheet" href="assets/css/vrsr.css"> 
	</head>
	<body onload="onLoad();">
		<section class="section">
			<div class="container">
				<div class="box">
					<h1 class="title is-2">VR Speedrunning Leaderboards</h1>
					<p>A central hub to view the leaderboards for the largest VR speedgames.</p>
					<p>Only main categories with runs are displayed. If there is a game or category that you believe belongs here, ping me (bigfoot#0001) in the VR Speedrunning Discord server.</p>
					<p>In order to minimize the amount of API calls to SRC, some details are hard-coded. If changes are made to games or categories that don't reflect here, ping me and I will fix it.</p>
					<br>
					<p>For the latest VR world records, check out the <a href="https://twitter.com/VRSpeedruns">VR Speedruns Twitter bot</a>!</p>
					<p>All the code is open source and available on Github. For this site, check out <a href="https://github.com/bigfoott/VRSR">bigfoott/VRSR</a> and for the bot, check out <a href="https://github.com/bigfoott/VRSpeedrunsBot">bigfoott/VRSpeedrunsBot</a>.</p>
				</div>
			</div>
			<div class="container">
				<div class="columns">
					<div class="column is-3 has-text-centered">
						<div class="box">
							<div class="select">
								<select id="dropdown-select" onchange="loadGame(this.value)">
								</select>
							</div>
							<img id="table-img" src="">
							<p>View on <a id="src-url" href="" target="_blank">Speedrun.com</a></p>
						</div>
					</div>
					<div class="column is-9">
						<div class="box">
							<div class="tabs">
								<ul id="tabs"></ul>
							</div>
							<table class="table is-hoverable is-fullwidth" id="main-table">
							</table>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="section is-footer">
			<p>Made with <i class="fas fa-heart is-heart"></i> by Bigfoot</p>
			<div class="icons">
				<a href="https://github.com/bigfoott"><i class="fab fa-github"></i></a>
				<a href="https://www.speedrun.com/user/bigfoott"><i class="fas fa-trophy"></i></a>
				<a href="https://twitter.com/bigfoootttt"><i class="fab fa-twitter"></i></a>
				<a href="https://twitch.tv/bigfooott"><i class="fab fa-twitch"></i></a>
				<a href="https://youtube.com/bigfoott" class="end"><i class="fab fa-youtube"></i></a>
			</div>
		</section>
		<style id="style">.table-platform { display: none; }</style>
		<script type="text/javascript" src="assets/js/vrsr.js"></script>
	</body>
</html>