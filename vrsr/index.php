<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<link rel="icon" href="/images/vrsrfavicon.png">
		
		<title>VR Speedrunning</title>
		
		<meta content="Bigft.io" property="og:site_name">
		<meta content="VR Speedrunning Leaderboards" property="og:title">
		<meta content="A central hub to view the leaderboards for the largest VR speedgames." property="og:description">
		<meta content="https://bigft.io/images/vrsricon.png" property="og:image">
		<meta content="#0165fe" name="theme-color">
		
		<meta name="description" content="A central hub to view the leaderboards for the largest VR speedgames.">
		<meta name="keywords" content="VR Speedrun,VR,Speedrun,Speedrunning,VR Speedrunning,VR Running,Super Hot VR,Super Hot Speedrun, Super Hot VR Speedrun">
		
		<script src="https://kit.fontawesome.com/d16c543bf8.js" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
		<link rel="stylesheet" href="/assets/css/vrsr.css"> 
	</head>
	<body onload="onLoad();">
		<section class="section">
			<div class="container">
				<div class="box" style="margin-bottom: 1.5rem;">
					<h1 class="title is-2">VR Speedrunning Leaderboards</h1>
					<p>A central hub to view the leaderboards for the largest VR speedgames.</p>
					<span id="desc-content" style="display: none;">
					<p>If you'd like to hang out and discuss VR speedrunning, consider joining the <a href="https://discord.gg/7PKWZuW">VR Speedrunning Discord server</a>!</p>
					<br>
					<p>Only main categories with runs are displayed. If there is a game or category that you believe belongs here, ping me (bigfoot#0001) in the VR Speedrunning Discord server.</p>
					<p>In order to minimize the amount of API calls to SRC, some details are hard-coded. If changes are made to games or categories that don't reflect here, ping me and I will fix it.</p>
					<br>
					<p>For the latest VR world records, check out the <a href="https://twitter.com/VRSpeedruns">VR Speedruns Twitter bot</a>!</p>
					<p>All the code is open source and available on Github. For this site, check out <a href="https://github.com/bigfoott/VRSR">bigfoott/VRSR</a> and for the bot, check out <a href="https://github.com/bigfoott/VRSpeedrunsTwitterBot">bigfoott/VRSpeedrunsTwitterBot</a>.</p>
					</span>
					<br>
					<a id="desc-button" onclick="toggleDesc()">Show more ▼</a>
				</div>
			</div>
			<div class="container">
				<div class="columns">
					<div class="column is-3 has-text-centered">
						<div class="box">
							<div class="select">
								<select id="dropdown-select" onchange="dropdownChange(this.value)">
								</select>
							</div>
							<div class="switch-container">
								<label class="switch">
									<p id="switch-left">Full Game</p>
									<input type="checkbox" id="type-switch" onclick="handleSwitchClick(this);">
									<span class="slider"></span>
									<p id="switch-right">Ind. Levels</p>
								</label>
							</div>
							<div class="table-img-container"><img id="table-img" src=""></div>
							<div class="buttonlist">
								<a class="button is-dark is-fullwidth" id="button-src" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-trophy"></i></span>
									<span>Full Leaderboard</span>
								</a>
								<a class="button is-dark is-fullwidth" id="button-guides" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-book"></i></span>
									<span>Guides</span>
								</a>
								<a class="button is-dark is-fullwidth" id="button-resources" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-link"></i></span>
									<span>Resources</span>
								</a>
								<a class="button is-dark is-fullwidth" id="button-forums" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-comments"></i></span>
									<span>Forums</span>
								</a>
								<a class="button is-dark is-fullwidth" id="button-stats" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-chart-line"></i></span>
									<span>Statistics</span>
								</a>
							</div>
						</div>
					</div>
					<div class="column is-9">
						<div class="box equal-height">
							<div class="columns is-multiline" id="level-select-cols" style="display: none;">
								<div class="column is-12" id="il-warning">
									<div class="notification is-danger">
										<button class="delete" onclick="closeILWarning();"></button>
										<b>NOTICE</b>:  In order to minimize API calls to SRC, only the top three runs for each category for ILs will be displayed.
									</div>
								</div>
								<div class="column is-4">
									<div class="select">
										<select id="level-select" onchange="loadGameLevels(this.value)">
										</select>
									</div>
								</div>
							</div>
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
			<p style="color: #aaa;">Currently tracking <span id="stats-categories">...</span> categories across <span id="stats-leaderboards">...</span> leaderboards.</p>
			<br>
			<p>Made with <i class="fas fa-heart is-heart"></i> by Bigfoot</p>
			<div class="icons">
				<a href="https://github.com/bigfoott"><i class="fab fa-github"></i></a>
				<a href="https://www.speedrun.com/user/bigfoot"><i class="fas fa-trophy"></i></a>
				<a href="https://twitter.com/bigfoootttt"><i class="fab fa-twitter"></i></a>
				<a href="https://twitch.tv/bigfooott"><i class="fab fa-twitch"></i></a>
				<a href="https://youtube.com/bigfoott" class="end"><i class="fab fa-youtube"></i></a>
			</div>
		</section>
		<style id="style">.table-platform { display: none; }</style>
		<script type="text/javascript" src="/assets/js/vrsr.js"></script>
	</body>
</html>