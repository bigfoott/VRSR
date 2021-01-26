<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<link rel="icon" href="/images/vrsrfavicon.png">
		
		<title>VRSR</title>
		
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
				<div class="columns">
					<div class="column is-half">
						<h1 class="title is-2" style="margin-bottom: 1rem">VR Speedrunning Leaderboards</h1>
					</div>
					<div class="column is-half" style="text-align: right; font-size: 2rem">
						<a onclick="openInfoModal()"><i class="fas fa-info-circle"></i></a>
					</div>
				</div>
			</div>
			<div id="info-modal" class="modal">
				<div class="modal-background" onclick="closeInfoModal()"></div>
				<div class="modal-content">
					<div class="box">
						<p>A central hub to view the leaderboards for the largest VR speedgames.</p>
						<br>
						<p>If you'd like to hang out and discuss VR speedrunning, consider joining the <a href="https://discord.gg/7PKWZuW">VR Speedrunning Discord server</a>!</p>
						<br>
						<p>Only main categories with runs are displayed. If there is a game or category that you believe belongs here, ping me (bigfoot#0001) in the VR Speedrunning Discord server.</p>
						<p>In order to minimize the amount of API calls to SRC, some details are hard-coded. If changes are made to games or categories that don't reflect here, ping me and I will fix it.</p>
						<br>
						<p>For the latest VR world records, check out the <a href="https://twitter.com/VRSpeedruns">VR Speedruns Twitter bot</a>!</p>
						<p>All the code is open source and available on Github. For this site, check out <a href="https://github.com/bigfoott/VRSR">bigfoott/VRSR</a> and for the bot, check out <a href="https://github.com/bigfoott/VRSpeedrunsTwitterBot">bigfoott/VRSpeedrunsTwitterBot</a>.</p>
					</div>
				</div>
				<button class="modal-close is-large" aria-label="close" onclick="closeInfoModal()"></button>
			</div>
			<div class="container is-hidden-touch" style="display: none"> <!-- temporarily disabled till i can get around to fully implementing it :) -->
				<div class="box" style="margin-bottom: 1.5rem;">
					<h1 style="font-weight: bold; font-size: 1.5rem; margin-bottom: 1.2rem; margin-top: -0.4rem">LATEST WORLD RECORDS</h1>
					<div class="columns" id="topDiv" style="display: none;">
						<div class="column is-3" id="latestWR-1">
							<table class="latest-wr"><tr><td>--</td></tr><tr><td>--</td></tr><tr><td>--</td></tr></table>
						</div>
						<div class="column is-3" id="latestWR-2">
							<table class="latest-wr"><tr><td>--</td></tr><tr><td>--</td></tr><tr><td>--</td></tr></table>
						</div>
						<div class="column is-3" id="latestWR-3">
							<table class="latest-wr"><tr><td>--</td></tr><tr><td>--</td></tr><tr><td>--</td></tr></table>
						</div>
						<div class="column is-3" id="latestWR-4">
							<table class="latest-wr"><tr><td>--</td></tr><tr><td>--</td></tr><tr><td>--</td></tr></table>
						</div>
					</div>
					<div id="topLoadingDiv" style="display: block;">
						<div>
							<div class="spinner"></div>
							<div class="belowspinner">Loading...</div>
						</div>
					</div>
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
									<p id="switch-left">Full</p>
									<input type="checkbox" id="type-switch" onclick="handleSwitchClick(this);">
									<span class="slider"></span>
									<p id="switch-right">ILs</p>
								</label>
							</div>
							<div class="table-img-container is-hidden-touch"><img id="table-img" src=""></div>
							<div id="game-year-release" class="is-hidden-touch">...</div>
							<div id="game-platforms-list" class="is-hidden-touch">...</div>
							<div class="buttonlist">
								<a class="button is-dark is-fullwidth" id="button-src" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-trophy"></i></span>
									<span>Full Leaderboard</span>
								</a>
								<a class="button is-dark is-fullwidth is-hidden-touch" id="button-guides" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-book"></i></span>
									<span>Guides</span>
								</a>
								<a class="button is-dark is-fullwidth is-hidden-touch" id="button-resources" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-link"></i></span>
									<span>Resources</span>
								</a>
								<a class="button is-dark is-fullwidth is-hidden-touch" id="button-forums" href="#" target="_blank">
									<span class="icon is-small"><i class="fas fa-comments"></i></span>
									<span>Forums</span>
								</a>
								<a class="button is-dark is-fullwidth is-hidden-touch" id="button-stats" href="#" target="_blank">
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
							<div id="loadingDiv" style="display: block;">
								<div>
									<div class="spinner"></div>
									<div class="belowspinner">Loading...</div>
								</div>
							</div>
							<div id="runsDiv" style="display: none;">
								<div class="tabs is-size-7-touch">
									<ul id="tabs"></ul>
								</div>
								<table class="table is-hoverable is-fullwidth" id="main-table">
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<style id="style">
				.table-platform { display: none; }
			</style>
		</section>
		<section class="section is-footer">
			<p style="color: #aaa;">Currently tracking <span id="stats-categories">...</span> categories across <span id="stats-leaderboards">...</span> leaderboards.</p>
			<br>
			<p>Made with <i class="fas fa-heart is-heart"></i> by <a href="https://github.com/bigfoott">Bigfoot</a>.</p>
			<div class="icons">
				<a href="https://github.com/bigfoott/VRSR"><i class="fab fa-github"></i></a>
				<a href="https://twitter.com/VRSpeedruns"><i class="fab fa-twitter"></i></a>
			</div>
			<script>var latestWRs = <?php echo file_get_contents('../../data/latestwrs.json'); ?>;</script>
			<script type="text/javascript" src="/assets/js/vrsrnew.js?123"></script>
		</section>
	</body>
</html>