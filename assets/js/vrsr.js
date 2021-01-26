var json;
var currentType;

var lastId;

var tabs;
var mainTable;
var firstTab;

var totalBoards;
var loadedBoards;
var loadedLatestWRs;

var totalTabs;

var root;

var justChangedMode;

var defaultId;

var infoModal;

var gameYearRelease;
var gamePlatformList;
var platformsList;

function onLoad()
{
	root = document.documentElement;
	
	tabs = document.getElementById("tabs");
	mainTable = document.getElementById("main-table");

	infoModal = document.getElementById("info-modal");
	gameYearRelease = document.getElementById("game-year-release");
	gamePlatformList = document.getElementById("game-platforms-list");

	loadedLatestWRs = 0;

	platformsList = [];
	platformsList["w89rwwel"] = "Vive";
	platformsList["4p9zq09r"] = "Oculus";
	platformsList["83exvv9l"] = "Index";
	platformsList["w89r4d6l"] = "WMR";
	platformsList["8gej2n93"] = "PC";
	platformsList["nzelkr6q"] = "PS4";
	platformsList["wxeo2d6r"] = "PSN";
	platformsList["nzeljv9q"] = "PS4 Pro";

	if (getCookie("ilwarning") != "")
	{
		closeILWarning();
	}
	
	if (window.location.hash)
	{
		if (window.location.hash.startsWith("#il-"))
		{
			document.getElementById("type-switch").checked = true;
			loadType("level");
		}
		else loadType("game");
	}
	else loadType("game");
	
	loadStats();
	loadLatestWRs();
}

function loadType(type)
{
	currentType = type; 
	if (type == "game")
	{
		document.getElementById("level-select-cols").style.display = "none"; 
		
		document.getElementById("switch-left").style.color = "#eee";
		document.getElementById("switch-right").style.color = "";
		
		get("https://bigft.io/assets/other/boards.json?" + randomInt(100))
		.then((data) => {
			json = JSON.parse(data);
			
			var dropdown = document.getElementById("dropdown-select");
			dropdown.innerHTML = "";
			for (var i = 0; i < json.length; i++)
			{
				if (json[i].site_id == "hla") defaultId = i;
				
				dropdown.innerHTML += "<option value=\""+i+"\">" + json[i].name + "</option>";
			}
			
			justChangedMode = true;
			
			if (window.location.hash)
			{
				for (var i = 0; i < json.length; i++)
				{	
					if ("#" + json[i].site_id == window.location.hash || "#il-" + json[i].site_id == window.location.hash)
					{
						document.getElementById("dropdown-select").value = i;
						loadGame(i);
						return;
					}
				}
			}
			else
			{
				document.getElementById("dropdown-select").value = defaultId;
				loadGame(defaultId);
			}
			
		});
	}
	else
	{
		document.getElementById("level-select-cols").style.display = "block"; 
		
		document.getElementById("switch-right").style.color = "#eee";
		document.getElementById("switch-left").style.color = "";
		
		get("https://bigft.io/assets/other/il-boards.json?" + randomInt(100))
		.then((data) => {
			json = JSON.parse(data);
			
			var dropdown = document.getElementById("dropdown-select");
			dropdown.innerHTML = "";
			for (var i = 0; i < json.length; i++)
			{
				dropdown.innerHTML += "<option value=\""+i+"\">" + json[i].name + "</option>";
			}
			
			justChangedMode = true;
			
			if (window.location.hash)
			{
				for (var i = 0; i < json.length; i++)
				{
					if ("#" + json[i].site_id == window.location.hash || "#il-" + json[i].site_id == window.location.hash)
					{
						document.getElementById("dropdown-select").value = i;
						loadGameLevels(0);
						return;
					}
				}
			}
			loadGameLevels(0);
		});
	}
}

function loadGame(id)
{
	var tblTemplate = '<tbody id="tbody-[ID]" style="display: none;" class="is-size-7-touch">[RUNS]</tbody>';
	var runTemplate = '<tr data-target="[RUNLINK]" title="Click to view run on Speedrun.com" id="run-[RUNID]"><th>[PLACE]</th><td>[USER]</td><td>[TIME]</td><td class="table-hardware is-hidden-touch">[HARDWARE]</td><td class="table-platform is-hidden-touch">[PLATFORM]</td><td class="is-hidden-mobile">[DATE]</td><td data-target="[SHORTLINK]" class="is-hidden-mobile csl" title="Click to copy shortlink"><i class="far fa-copy"></i></td></tr>';
	var tabTemplate = '<li id="tab-[ID]"><a onclick="loadTab([ID]);">[NAME]</a></li>';
	var imgTemplate = 'https://www.speedrun.com/themes/[ID]/cover-256.png';
	
	mainTable.innerHTML = '<thead><tr><th style="width: 3rem;" class="is-size-7-touch">#</th><th class="is-size-7-touch">Runner</th><th style="width: 6.5em;" class="is-size-7-touch">Time</th><th class="table-hardware is-hidden-touch" style="width: 22rem;">Hardware</th><th class="table-platform is-hidden-touch">Platform</th><th class="is-hidden-mobile">Date</th><th class="is-hidden-mobile" style="width: 3rem;"></th></tr></thead>';
	
	tabs.innerHTML = '';
	gameYearRelease.innerText = '...'
	gamePlatformList.innerText = '...';
	firstTab = 9999;
	
	totalTabs = json[id].boards.length;

	document.title = "VRSR - " + json[id].name;
	
	document.getElementById("loadingDiv").style.display = "block";
	document.getElementById("runsDiv").style.display = "none";

	root.style.setProperty('--primary-color', json[id].color);
	
	document.getElementById("table-img").src = "";
	
	totalBoards = json[id].boards.length;
	loadedBoards = 0;

	get("https://www.speedrun.com/api/v1/games/" + json[id].id + "?embed=platforms")
	.then((data) => {
		var plats = [];

		var jj = JSON.parse(data);

		gameYearRelease.innerText = jj.data.released;

		for (var kk = 0; kk < jj.data.platforms.data.length; kk++)
		{
			var plat = jj.data.platforms.data[kk];
			
			if (plat.id in platformsList)
			{
				plats.push(platformsList[plat.id]);
			}
			else
			{
				plats.push(plat.name);
			}
		}

		gamePlatformList.innerText = plats.join(", ");
	});

	for (var i = 0; i < json[id].boards.length; i++)
	{
		var specificVar = "";
		
		if (json[id].specific_var_for_cats != null && json[id].boards[i].variableval != null)
		{
			specificVar = "&var-" + json[id].specific_var_for_cats[i].variable + "=" + json[id].specific_var_for_cats[i].value;
		}
		
		get(json[id].boards[i].link + "?embed=players,platforms,variables" + specificVar)
		.then((data) => {
			var j = JSON.parse(data);
			var jruns = j.data.runs;
			
			if (jruns.length !== 0) 
			{
				var table = tblTemplate;
				var runs = '';
				
				var index = json[id].board_indexes[j.data.category];;
				if (json[id].specific_var_for_cats != null && json[id].boards[index].variableval != null)
								{
					var targetvalue = j.data.values[Object.keys(j.data.values)[0]];
					
					for (index = 0; index < json[id].specific_var_for_cats.length; index++)
					{
						if (json[id].specific_var_for_cats[index].category == j.data.category && json[id].boards[index].variableval == targetvalue)
							break;
					}
				}
				
				var players = {};
				for (var k = 0; k < j.data.players.data.length; k++)
				{ 
					if (j.data.players.data[k].rel != 'guest')
						players[j.data.players.data[k].id] = j.data.players.data[k].names.international;
				}
				
				var platforms = {};
				for (var k = 0; k < j.data.platforms.data.length; k++)
				{
					platforms[j.data.platforms.data[k].id] = j.data.platforms.data[k].name;
				}
				
				var elem = '';
				if (json[id].hardware_var == "")
					elem = "table-hardware";
				else
					elem = "table-platform";
				document.getElementById("style").innerText = "." + elem + " { display: none; }";
				
				var addedRuns = 0;
				for (var k = 0; k < jruns.length; k++)
				{
					if (jruns[k].place == 0) continue;
					
					var hasIgnoredValue = false ;
					if (json[id].ignored_var_values != null)
					{
						if (jruns[k].run.values != null)
						{
							var p = json[id].ignored_var_values;
							for (var key in p)
							{
								if (p.hasOwnProperty(key))
								{
									if (jruns[k].run.values[key] == p[key])
									{
										hasIgnoredValue = true;
										break;
									}
								}
							}
							if (hasIgnoredValue)
								continue;
						}
					}
					
					var run = runTemplate;
					
					var player = '';
					if (jruns[k].run.players[0].rel != 'guest')
					{
						player = players[jruns[k].run.players[0].id];
						player = '<a href="https://www.speedrun.com/user/' + player + '" target="_blank" title="Click to view user on Speedrun.com">' + player + '</a>'
					} 
					else
						player = jruns[k].run.players[0].name;
					
					var time = (jruns[k].run.times.primary).replace('PT','').replace('H','h ').replace('M','m ').replace('S','s');
					
					var hardware = "--";
					for (var m = 0; m < j.data.variables.data.length; m++)
					{
						if (j.data.variables.data[m].id == json[id].hardware_var)
						{
							var hardware_id = jruns[k].run.values[json[id].hardware_var];
							hardware = j.data.variables.data[m].values.values[hardware_id].label;
							
							break; 
						}
					}
					
					var platform = platforms[jruns[k].run.system.platform];
					if (platform == undefined) platform = "Not Specified";
					
					var date = new Date();
					//if (jruns[k].run.date != null)
					//	date = new Date(jruns[k].run.date);
					//else
						date = new Date(jruns[k].run.submitted);
					
					var options = { year: 'numeric', month: 'long', day: 'numeric' };
					
					var run_id = jruns[k].run.id;
					
					run = run.replace("[RUNLINK]", jruns[k].run.weblink)
							 .replace("[RUNID]", jruns[k].run.id)
						 	 .replace("[PLACE]", nth(addedRuns + 1))
							 .replace("[USER]", player)
							 .replace("[TIME]", time)
							 .replace("[HARDWARE]", hardware)
							 .replace("[PLATFORM]", platform)
							 .replace("[DATE]", '<p title="' + date.toLocaleDateString("en-US", options) + '">' + timeAgo(date) + '</p>')
							 .replace("[SHORTLINK]", "https://bigft.io/src?" + run_id);	
					
					runs += run;
					addedRuns++;
				}
				
				if (addedRuns > 0)
				{
					var tab = tabTemplate;
					
					var indexreplace = "" + index;
					if (index < 10)
						indexreplace = "0" + index;
					
					tabs.innerHTML += tab.replace("[ID]", indexreplace).replace("[ID]", index).replace("[NAME]", json[id].boards[index].name);
					
					var tosort = tabs.children;
					var listitems = [];
					for (var i = 0; i < tosort.length; i++) {
						listitems.push(tosort.item(i));
					}
					listitems.sort(function(a, b) {
						var compA = a.getAttribute('id').toUpperCase();
						var compB = b.getAttribute('id').toUpperCase();
						return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
					});
					
					tabs.innerHTML = '';
					for (var i = 0; i < listitems.length; i++)
						tabs.appendChild(listitems[i]);
				}
				
				table = table.replace("[ID]", index).replace("[RUNS]", runs);
				
				if (firstTab > index)
					firstTab = index;

				mainTable.innerHTML += table;
				
				var lines = document.getElementsByTagName('tr');
				for (var i = 0; i < lines.length; i++)
				{
					if (lines[i].dataset.target)
					{
						lines[i].addEventListener('click', event => {
							if (event.path[1].dataset.target)
							{
								if (event.path[1].className == "is-hidden-mobile csl")
									copyToClipboard(event.path[1].dataset.target);
								else
									window.open(event.path[1].dataset.target);
							}
						});
					}					
				}

				for (var k = 0; k < jruns.length; k++)
				{
					var temp = document.getElementById("run-" + jruns[k].run.id);
					if (temp !== null)
					{
						temp.addEventListener('touchstart', e => {
							if (e.path[1].dataset.target)
							{
								//console.log("touchend");
								window.open(event.path[1].dataset.target);
							}
						});
					}
				}

				loadedBoards++;
			}
			else
			{
				loadedBoards++;
			}
		});
	}
	
	document.getElementById("table-img").src = imgTemplate.replace("[ID]", json[id].id);
	window.location.hash = "#" + json[id].site_id;
	
	document.getElementById("button-src").href = "https://www.speedrun.com/" + json[id].id + "/full_game";
	document.getElementById("button-guides").href = "https://www.speedrun.com/" + json[id].id + "/guides";
	document.getElementById("button-resources").href = "https://www.speedrun.com/" + json[id].id + "/resources";
	document.getElementById("button-forums").href = "https://www.speedrun.com/" + json[id].id + "/forum";
	document.getElementById("button-stats").href = "https://www.speedrun.com/" + json[id].id + "/gamestats";
	
	loadTab(9999);
}

function loadGameLevels(levelindex)
{
	var tblTemplate = '<tbody id="tbody-[ID]" style="display: none;" class="is-size-7-touch">[RUNS]</tbody>';
	var runTemplate = '<tr data-target="[RUNLINK]" title="Click to view run on Speedrun.com"><th>[PLACE]</th><td>[USER]</td><td>[TIME]</td><td class="table-hardware is-hidden-touch">[HARDWARE]</td><td class="table-platform is-hidden-touch">[PLATFORM]</td><td class="is-hidden-mobile">[DATE]</td><td data-target="[SHORTLINK]" class="is-hidden-mobile csl" title="Click to copy shortlink"><i class="far fa-copy"></i></td></tr>';
	var tabTemplate = '<li id="tab-[ID]"><a onclick="loadTab([ID]);">[NAME]</a></li>';
	var imgTemplate = 'https://www.speedrun.com/themes/[ID]/cover-256.png';
	
	var id = document.getElementById("dropdown-select").selectedIndex;
	
	mainTable.innerHTML = '<thead><tr><th style="width: 3rem;" class="is-size-7-touch">#</th><th class="is-size-7-touch">Runner</th><th class="is-size-7-touch">Time</th><th class="table-hardware is-hidden-touch" style="width: 22rem;">Hardware</th><th class="table-platform is-hidden-touch">Platform</th><th class="is-hidden-mobile">Date</th><th class="is-hidden-mobile" style="width: 3rem;"></th></tr></thead>';
	
	gameYearRelease.innerText = '...'
	gamePlatformList.innerText = '...';
	firstTab = 9999;

	root.style.setProperty('--primary-color', json[id].color);
	
	document.title = "VRSR - " + json[id].name;

	document.getElementById("loadingDiv").style.display = "block";
	document.getElementById("runsDiv").style.display = "none";

	get("https://www.speedrun.com/api/v1/games/" + json[id].id + "?embed=platforms")
	.then((data) => {
		var plats = [];

		var jj = JSON.parse(data);

		gameYearRelease.innerText = jj.data.released;

		for (var kk = 0; kk < jj.data.platforms.data.length; kk++)
		{
			var plat = jj.data.platforms.data[kk];
			
			if (plat.id in platformsList)
			{
				plats.push(platformsList[plat.id]);
			}
			else
			{
				plats.push(plat.name);
			}
		}

		gamePlatformList.innerText = plats.join(", ");
	});

	var newTabs = false;
	if (tabs.children.length == json[id].levels.length)
	{
		for (var i = 0; i < tabs.children.length; i++)
		{
			if (tabs.children[i].innerText != json[id].levels[i ].name)
			{
				newTabs = true;
				break;
			}
		}
	}
	else newTabs = true;
	
	if (newTabs)
	{
		tabs.innerHTML = '';
		totalTabs = json[id].levels.length;
	}
	
	if (lastId !== id || justChangedMode)
	{
		justChangedMode = false;
		
		var levelSelect = document.getElementById("level-select");
		levelSelect.innerHTML = '';
		for (var i = 0; i < json[id].levels.length; i++)
		{
			levelSelect.innerHTML += '<option id="lvldropdown-' + i + '" value="' + i + '">' + json[id].levels[i].name + '</option>';
		}
		
		lastId = id;
	}
	
	totalBoards = json[id].categories.length;
	loadedBoards = 0;

	get(json[id].levels[levelindex].link + "?embed=players,platforms,variables")
	.then((data) => {
		var j = JSON.parse(data);
		
		var catsWithRuns = 0;
		for (var i = 0; i < j.data.length; i++)
		{
			var jruns = j.data[i].runs;
			if (jruns.length !== 0)
			{
				catsWithRuns++;
				
				var table = tblTemplate;
				var runs = '';
				
				var players = {};
				for (var k = 0; k < j.data[i].players.data.length; k++)
				{ 
					if (j.data[i].players.data[k].rel != 'guest')
						players[j.data[i].players.data[k].id] = j.data[i].players.data[k].names.international;
				}
				
				var platforms = {};
				for (var k = 0; k < j.data[i].platforms.data.length; k++)
				{
					platforms[j.data[i].platforms.data[k].id] = j.data[i].platforms.data[k].name;
				}
				
				var elem = '';
				if (json[id].hardware_var == "")
					elem = "table-hardware";
				else
					elem = "table-platform";
				document.getElementById("style").innerText = "." + elem + " { display: none; }";
				
				var addedRuns = 0;
				for (var k = 0; k < jruns.length; k++)
				{
					if (jruns[k].place == 0) continue;
					
					var hasIgnoredValue = false ;
					if (json[id].ignored_var_values != null)
					{
						if (jruns[k].run.values != null)
						{
							var p = json[id].ignored_var_values;
							for (var key in p)
							{
								if (p.hasOwnProperty(key))
								{
									if (jruns[k].run.values[key] == p[key])
									{
										hasIgnoredValue = true;
										break;
									}
								}
							}
							if (hasIgnoredValue)
								continue;
						}
					}
					
					var run = runTemplate;
					
					var player = '';
					if (jruns[k].run.players[0].rel != 'guest')
					{
						player = players[jruns[k].run.players[0].id];
						player = '<a href="https://www.speedrun.com/' + player + '" target="_blank" title="Click to view user on Speedrun.com">' + player + '</a>'
					} 
					else
						player = jruns[k].run.players[0].name;
					
					var time = (jruns[k].run.times.primary).replace('PT','').replace('H','h ').replace('M','m ').replace('S','s');
					
					var hardware = "--";
					for (var m = 0; m < j.data[i].variables.data.length; m++)
					{
						if (j.data[i].variables.data[m].id == json[id].hardware_var)
						{
							var hardware_id = jruns[k].run.values[json[id].hardware_var];
							hardware = j.data[i].variables.data[m].values.values[hardware_id].label;
							
							break; 
						}
					}
					
					var platform = platforms[jruns[k].run.system.platform];
					if (platform == undefined) platform = "Not Specified";
					
					var date = new Date();
					//if (jruns[k].run.date != null)
					//	date = new Date(jruns[k].run.date);
					//else
						date = new Date(jruns[k].run.submitted);
					
					var options = { year: 'numeric', month: 'long', day: 'numeric' };
					
					run = run.replace("[RUNLINK]", jruns[k].run.weblink)
							 .replace("[PLACE]", nth(addedRuns + 1))
							 .replace("[USER]", player)
							 .replace("[TIME]", time)
							 .replace("[HARDWARE]", hardware)
							 .replace("[PLATFORM]", platform)
							 .replace("[DATE]", '<p title="' + date.toLocaleDateString("en-US", options) + '">' + timeAgo(date) + '</p>');				
					
					runs += run;
					addedRuns++;
				}
				
				if (addedRuns > 0)
				{
					var ireplace = "" + i;
					if (i < 10)
						ireplace = "0" + i; 
					
					var tab = tabTemplate;
					
					tabs.innerHTML += tab.replace("[ID]", ireplace).replace("[ID]", i).replace("[NAME]", json[id].categories[i].name);
					
					var tosort = tabs.children;
					var listitems = [];
					for (var _i = 0; _i < tosort.length; _i++) {
						listitems.push(tosort.item(_i));
					}
					listitems.sort(function(a, b) {
						var compA = a.getAttribute('id').toUpperCase();
						var compB = b.getAttribute('id').toUpperCase();
						return (compA < compB) ? -1 : (compA > compB) ? 1 : 0;
					});
					
					tabs.innerHTML = '';
					for (var _i = 0; _i < listitems.length; _i++)
						tabs.appendChild(listitems[_i]);
				}
				
				table = table.replace("[ID]", i).replace("[RUNS]", runs);
				
				if (firstTab > i)
					firstTab = i;

				mainTable.innerHTML += table;
				
				var lines = document.getElementsByTagName('tr');
				for (var _i = 0; _i < lines.length; _i++)
				{
					if (lines[_i].dataset.target)
					{
						lines[_i].addEventListener('click', event => {
							if (event.path[1].dataset.target)
							{
								if (event.path[1].className == "is-hidden-mobile csl")
									copyToClipboard(event.path[1].dataset.target);
								else
									window.open(event.path[1].dataset.target);
							}
						});
					}					
				}

				loadedBoards++;
			}
			else
			{
				loadedBoards++;
			}
		}
		
		if (catsWithRuns == 0)
		{
			mainTable.innerHTML += '<tbody><tr style="cursor: auto"><td colspan="5"><center>There are no runs of this level available.</center></td></tr></tbody>';
		}
	});
	
	document.getElementById("table-img").src = imgTemplate.replace("[ID]", json[id].id);
	window.location.hash = "#il-" + json[id].site_id;
	
	document.getElementById("button-src").href = "https://www.speedrun.com/" + json[id].id + "/individual_levels";
	document.getElementById("button-guides").href = "https://www.speedrun.com/" + json[id].id + "/guides";
	document.getElementById("button-resources").href = "https://www.speedrun.com/" + json[id].id + "/resources";
	document.getElementById("button-forums").href = "https://www.speedrun.com/" + json[id].id + "/forum";
	document.getElementById("button-stats").href = "https://www.speedrun.com/" + json[id].id + "/gamestats";
	
	loadTab(9999);
}

function loadTab(index)
{
	//console.log(loadedBoards + " - " + totalBoards);

	if (index == 9999)
	{
		if (loadedBoards < totalBoards)
		{
			setTimeout(function(){ loadTab(index); }, 250);
			return;
		}

		index = firstTab;
	}
	
	if (document.getElementById("loadingDiv").style.display == "block")
	{
		document.getElementById("loadingDiv").style.display = "none";
		document.getElementById("runsDiv").style.display = "block";
	}

	for (var i = 0; i < totalTabs; i++)
	{
		if (i < 10)
		{
			if (document.getElementById("tbody-" + i) && document.getElementById("tab-0" + i))
			{
				document.getElementById("tbody-" + i).style.display = "none";
				document.getElementById("tab-0" + i).classList.remove("is-active");
			}
		}
		else
		{
			if (document.getElementById("tbody-" + i) && document.getElementById("tab-" + i))
			{
				document.getElementById("tbody-" + i).style.display = "none";
				document.getElementById("tab-" + i).classList.remove("is-active");
			}
		}
	}
	
	document.getElementById("tbody-" + index).style.display = "table-row-group";
	
	if (index < 10)
	{
		document.getElementById("tab-0" + index).classList.add("is-active");
	}
	else
	{
		document.getElementById("tab-" + index).classList.add("is-active");
	}
}

function loadLatestWRs()
{
	for (var index = 0; index < latestWRs.length; index++)
	{
		get("https://www.speedrun.com/api/v1/runs/" + latestWRs[index] + "?embed=players,platforms,variables,game,category")
		.then((data) => {
			var j = JSON.parse(data);
			var i = latestWRs.indexOf(j.data.id)
			
			var game = j.data.game.data.names.international;
			var category = j.data.category.data.name;
			var subcat = ''; //TODO (eventually lol)
			var time = (j.data.times.primary).replace('PT','').replace('H','h ').replace('M','m ').replace('S','s');

			var runner = '';
			if (j.data.players.data[0].rel != 'guest')
			{
				runner = j.data.players.data[0].names.international;
			}
			else
			{
				runner = j.data.players.data[0].name;
			}

			var date = '';
			var dateObj = new Date();
			//if (j.data.date != null)
			//{
			//	dateObj = new Date(j.data.date);
			//}
			//else
			//{
				dateObj = new Date(j.data.submitted);
			//}
			date = timeAgo(dateObj);

			var template = '<table class="latest-wr"><tr><td><a>[GAME]</a> - <a>[CATEGORY][SUBCAT]</a></td></tr><tr><td>in <a>[TIME]</a> by <a>[RUNNER]</a></td></tr><tr><td>[DATE]</td></tr></table>';
			var ele = document.getElementById("latestWR-" + (i + 1));
			ele.innerHTML = template.replace("[GAME]", game)
									.replace("[CATEGORY]", category)
									.replace("[SUBCAT]", subcat)
									.replace("[TIME]", time)
									.replace("[RUNNER]", runner)
									.replace("[DATE]", date);

			document.getElementById("latestWR-" + (i + 1)).style.background = 
				"linear-gradient(to right, rgba(46, 49, 54, 1) 1%, rgba(46, 49, 54, 0.8), rgba(46, 49, 54, 1)) 1%, url(https://www.speedrun.com/themes/" + j.data.game.data.abbreviation + "/cover-256.png) no-repeat center/cover";

			loadedLatestWRs++;

			if (loadedLatestWRs == 4)
			{
				document.getElementById("topLoadingDiv").style.display = "none";
				document.getElementById("topDiv").style.display = "flex";
			}
		});
	}
}

function loadStats()
{	
	get("https://bigft.io/assets/other/boards.json?" + randomInt(100))
	.then((data) => {
		var statsjson = JSON.parse(data);
		
		var categories = 0;
		var leaderboards = statsjson.length;
		
		for (var i = 0; i < statsjson.length; i++)
		{
			categories += statsjson[i].boards.length;
		}
		
		document.getElementById("stats-categories").innerHTML = categories;
		document.getElementById("stats-leaderboards").innerHTML = leaderboards;
	});
}

var descContent;
var descButton;
function toggleDesc()
{
	if (descContent == null)
	{
		descContent = document.getElementById("desc-content");
	}
	if (descButton == null)
	{
		descButton = document.getElementById("desc-button");
	}
	
	if (descButton.innerText == "Show more ▼")
	{
		descContent.style.display = "block";
		descButton.innerText = "Show less ▲";
	}
	else
	{
		descContent.style.display = "none";
		descButton.innerText = "Show more ▼";
	}
}

function openInfoModal()
{
	infoModal.classList.add("is-active");
}
function closeInfoModal()
{
	infoModal.classList.remove("is-active");
}

function dropdownChange(value)
{
	if (currentType == "game") loadGame(value);
	else loadGameLevels(0);
}

function handleSwitchClick(e)
{
	if (e.checked) loadType("level");
	else loadType("game");
}

function closeILWarning()
{
	var warning = document.getElementById("il-warning");
	warning.parentNode.removeChild(warning);
	
	if (getCookie("ilwarning") == "")
	{
		setCookie("ilwarning", "closed", 7);
	}
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function get(url) {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
    req.onerror = (e) => reject(Error(`Network Error: ${e}`));
    req.send();
  });
}

const NOW = new Date()
const times = [["day", 86400], ["month", 2592000], ["year", 31536000]]

function timeAgo(date) {

	var seconds = Math.floor((new Date() - date) / 1000);
  
	var interval = seconds / 31536000;
	var _s = "s";

	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " year" + _s + " ago";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " month" + _s + " ago";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " day" + _s + " ago";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " hour" + _s + " ago";
	}
	interval = seconds / 60;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " minute" + _s + " ago";
	}
	return "Just now";
}

function timeAgoOLD(date) {
    var diff = Math.round((NOW - date) / 1000)
    for (var t = 0; t < times.length; t++) {
        if (diff < times[t][1]) {
            if (t == 0) {
                return "Today";
            } else {
                diff = Math.round(diff / times[t - 1][1]);
                return diff + " " + times[t - 1][0] + (diff == 1?" ago":"s ago");
            }
        }
		else if (diff >= 31536000)
		{
			diff = Math.round(diff / 31536000);
            return diff + " year" + (diff == 1?" ago":"s ago");
		}
    }
}

function nth(d) {
  if (d > 3 && d < 21) return d + 'th'; 
  switch (d % 10) {
    case 1:  return d + "st";
    case 2:  return d + "nd";
    case 3:  return d + "rd";
    default: return d + "th";
  }
}

function openlink(url)
{
	window.open(url, "_blank");
}

function copyToClipboard(val){
	var dummy = document.createElement("input");
    //dummy.style.display = 'none';
    document.body.appendChild(dummy);

    dummy.setAttribute("id", "dummy_id");
    document.getElementById("dummy_id").value=val;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
	
	console.log("Copied URL to clipboard: " + val);
}

function randomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}