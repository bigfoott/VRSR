var json;
var currentType;

var lastId;

var tabs;
var mainTable;

var totalTabs;

var root;

function onLoad()
{
	root = document.documentElement;
	
	tabs = document.getElementById("tabs");
	mainTable = document.getElementById("main-table");
	
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
}

function loadType(type)
{
	currentType = type; 
	if (type == "game")
	{
		//document.getElementById("level-select-cols").style.display = "none"; 
		
		document.getElementById("switch-left").style.color = "#eee";
		document.getElementById("switch-right").style.color = "";
		
		get('https://bigft.io/assets/other/boards.json')
		.then((data) => {
			json = JSON.parse(data);
			
			var dropdown = document.getElementById("dropdown-select");
			dropdown.innerHTML = "";
			for (var i = 0; i < json.length; i++)
			{
				dropdown.innerHTML += "<option value=\""+i+"\">" + json[i].name + "</option>";
			}
			
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
			loadGame(0);
		});
	}
	else
	{
		//document.getElementById("level-select-cols").style.display = "block"; 
		
		document.getElementById("switch-right").style.color = "#eee";
		document.getElementById("switch-left").style.color = "";
		
		get('https://bigft.io/assets/other/il-boards.json')
		.then((data) => {
			json = JSON.parse(data);
			
			var dropdown = document.getElementById("dropdown-select");
			dropdown.innerHTML = "";
			for (var i = 0; i < json.length; i++)
			{
				dropdown.innerHTML += "<option value=\""+i+"\">" + json[i].name + "</option>";
			}
			
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
	var tblTemplate = '<tbody id="tbody-[ID]" style="display: none;">[RUNS]</tbody>';
	var runTemplate = '<tr data-target="[RUNLINK]" title="Click to view run on Speedrun.com"><th>[PLACE]</th><td>[USER]</td><td>[TIME]</td><td class="table-hardware is-hidden-touch">[HARDWARE]</td><td class="table-platform is-hidden-touch">[PLATFORM]</td><td>[DATE]</td></tr>';
	var tabTemplate = '<li id="tab-[ID]"><a onclick="loadTab([ID]);">[NAME]</a></li>';
	var imgTemplate = 'https://www.speedrun.com/themes/[ID]/cover-256.png';
	
	mainTable.innerHTML = '<thead><tr><th style="width: 3rem;">#</th><th>Runner</th><th>Time</th><th class="table-hardware is-hidden-touch" style="width: 22rem;">Hardware</th><th class="table-platform is-hidden-touch">Platform</th><th>Date</th></tr></thead>';
	
	tabs.innerHTML = '';
	
	totalTabs = json[id].boards.length;
	
	root.style.setProperty('--primary-color', json[id].color);
	
	for (var i = 0; i < json[id].boards.length; i++)
	{
		get(json[id].boards[i].link + "?embed=players,platforms,variables")
		.then((data) => {
			var j = JSON.parse(data);
			var jruns = j.data.runs;
			
			if (jruns.length !== 0) 
			{
				var table = tblTemplate;
				var runs = '';
				
				var index = json[id].board_indexes[j.data.category];
				
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
						player = '<a href="https://www.speedrun.com/' + player + '" target="_blank" title="Click to view user on Speedrun.com">' + player + '</a>'
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
					
					var date = new Date();
					if (jruns[k].run.date != null)
						date = new Date(jruns[k].run.date);
					else
						date = new Date(jruns[k].run.submitted);
					
					var options = { year: 'numeric', month: 'long', day: 'numeric' };
					
					run = run.replace("[RUNLINK]", jruns[k].run.weblink)
							 .replace("[PLACE]", nth(addedRuns + 1))
							 .replace("[USER]", player)
							 .replace("[TIME]", time)
							 .replace("[HARDWARE]", hardware)
							 .replace("[PLATFORM]", platforms[jruns[k].run.system.platform])
							 .replace("[DATE]", '<p title="' + date.toLocaleDateString("en-US", options) + '">' + timeAgo(date) + '</p>');				
					
					runs += run;
					addedRuns++;
				}
				
				if (addedRuns > 0)
				{
					var tab = tabTemplate;
					tabs.innerHTML += tab.replace("[ID]", index).replace("[ID]", index).replace("[NAME]", json[id].boards[index].name);
					
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
				
				mainTable.innerHTML += table;
				
				var lines = document.getElementsByTagName('tr');
				for (var i = 0; i < lines.length; i++)
				{
					if (lines[i].dataset.target)
					{
						lines[i].addEventListener('click', event => {
							if (event.path[1].dataset.target)
								window.open(event.path[1].dataset.target);
						});
					}					
				}
			}
		});
	}
	
	document.getElementById("table-img").src = imgTemplate.replace("[ID]", json[id].id);
	window.location.hash = "#" + json[id].site_id;
	document.getElementById("src-url").href = "https://www.speedrun.com/" + json[id].id;
	
	loadTab(0);
}

function loadGameLevels(levelindex)
{
	var tblTemplate = '<tbody id="tbody-[ID]" style="display: none;">[RUNS]</tbody>';
	var runTemplate = '<tr data-target="[RUNLINK]" title="Click to view run on Speedrun.com"><th>[PLACE]</th><td>[USER]</td><td>[TIME]</td><td class="table-hardware is-hidden-touch">[HARDWARE]</td><td class="table-platform is-hidden-touch">[PLATFORM]</td><td>[DATE]</td></tr>';
	var tabTemplate = '<li id="tab-[ID]"><a onclick="loadTab([ID]);">[NAME]</a></li>';
	var imgTemplate = 'https://www.speedrun.com/themes/[ID]/cover-256.png';
	
	var id = document.getElementById("dropdown-select").selectedIndex;
	
	mainTable.innerHTML = '<thead><tr><th style="width: 3rem;">#</th><th>Runner</th><th>Time</th><th class="table-hardware is-hidden-touch" style="width: 22rem;">Hardware</th><th class="table-platform is-hidden-touch">Platform</th><th>Date</th></tr></thead>';
	
	root.style.setProperty('--primary-color', json[id].color);
	
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
	
	if (lastId !== id)
	{
		var levelSelect = document.getElementById("level-select");
		levelSelect.innerHTML = '';
		for (var i = 0; i < json[id].levels.length; i++)
		{
			levelSelect.innerHTML += '<option value="' + i + '">' + json[id].levels[i].name + '</option>';
		}
		
		lastId = id;
	}
	
	console.log(levelindex);
	get(json[id].levels[levelindex].link + "?embed=players,platforms,variables")
	.then((data) => {
		var j = JSON.parse(data);
		
		for (var i = 0; i < j.data.length; i++)
		{
			var jruns = j.data[i].runs;
			if (jruns.length !== 0)
			{
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
					
					var date = new Date();
					if (jruns[k].run.date != null)
						date = new Date(jruns[k].run.date);
					else
						date = new Date(jruns[k].run.submitted);
					
					var options = { year: 'numeric', month: 'long', day: 'numeric' };
					
					run = run.replace("[RUNLINK]", jruns[k].run.weblink)
							 .replace("[PLACE]", nth(addedRuns + 1))
							 .replace("[USER]", player)
							 .replace("[TIME]", time)
							 .replace("[HARDWARE]", hardware)
							 .replace("[PLATFORM]", platforms[jruns[k].run.system.platform])
							 .replace("[DATE]", '<p title="' + date.toLocaleDateString("en-US", options) + '">' + timeAgo(date) + '</p>');				
					
					runs += run;
					addedRuns++;
				}
				if (addedRuns > 0)
				{
					var tab = tabTemplate;
					tabs.innerHTML += tab.replace("[ID]", i).replace("[ID]", i).replace("[NAME]", json[id].categories[i].name);
					
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
			
				mainTable.innerHTML += table;
				
				var lines = document.getElementsByTagName('tr');
				for (var _i = 0; _i < lines.length; _i++)
				{
					if (lines[_i].dataset.target)
					{
						lines[_i].addEventListener('click', event => {
							if (event.path[1].dataset.target)
								window.open(event.path[1].dataset.target);
						});
					}					
				}
			}
		}
	});
	
	document.getElementById("table-img").src = imgTemplate.replace("[ID]", json[id].id);
	window.location.hash = "#il-" + json[id].site_id;
	document.getElementById("src-url").href = "https://www.speedrun.com/" + json[id].id + "/individual_levels";
	
	loadTab(0);
}

function loadTab(index)
{
	if (document.getElementById("tbody-0") == null)
		setTimeout(function(){ loadTab(index); }, 250);
	else
	{
		for (var i = 0; i < totalTabs; i++)
		{
			if (document.getElementById("tbody-" + i) && document.getElementById("tab-" + i))
			{
				document.getElementById("tbody-" + i).style.display = "none";
				document.getElementById("tab-" + i).classList.remove("is-active");
			}
		}
		document.getElementById("tbody-" + index).style.display = "table-row-group"; 
		document.getElementById("tab-" + index).classList.add("is-active");
	}
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
    var diff = Math.round((NOW - date) / 1000)
    for (var t = 0; t < times.length; t++) {
        if (diff < times[t][1]) {
            if (t == 0) {
                return "Today"
            } else {
                diff = Math.round(diff / times[t - 1][1])
                return diff + " " + times[t - 1][0] + (diff == 1?" ago":"s ago")
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