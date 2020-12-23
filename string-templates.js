function getCharacterTemplate(char) {
    let topMythicLevel, topMythicDungeon;
    let weeklyHighest = char.mythic_plus_weekly_highest_level_runs[0]
    if (weeklyHighest) {
        topMythicDungeon = weeklyHighest.dungeon;
        topMythicLevel = "+" + weeklyHighest.mythic_level;
    } else {
        topMythicDungeon = '--';
        topMythicLevel = '--';
    }

    return `
        <div id="${clean(char.realm)}-${clean(char.name)}" class="character ${char.class.toLowerCase()}">
            <img class="thumbnail" src="${char.thumbnail_url}" alt="char" />
            <div>
                <p>${char.realm}-${char.name}</p>
                <p style="font-size: 12px">${char.gear.item_level_equipped} equipped</p>
                <a href=${char.profile_url} target="_blank">${char.mythic_plus_scores_by_season[0].scores.all} RIO Score</a>
            </div>
            <div style="border-right: 2px solid black">
                <p style="font-size: 12px">Highest M+ this week</p>
                <p>${topMythicDungeon} ${topMythicLevel}</p>
                <p style="font-size: 12px">Weekly Chest</p>
                <p>${getWeeklyChestLoot(char.mythic_plus_weekly_highest_level_runs)}</p>
            </div>
            <div id="${char.realm}-${char.name}-runs" class="runs"></div>
            <button id="delete${clean(char.realm)}-${clean(char.name)}" class="button button-delete" title="remove">X</button>
        </div>
    `;
}

function getDungeonRunTemplate(run) {
    return `
        <div class="tooltip">
            <p>${run.short_name} +${run.mythic_level}</p>
            <p style="font-size: 12px; text-align: center">${run.num_keystone_upgrades == 0 ? 'depleted' : `upgraded +${run.num_keystone_upgrades}`}</p>
            <span class="tooltiptext">
                ${run.dungeon} </br>
                Time: ${millisToMinutesAndSeconds(run.clear_time_ms)} </br>
                Cleared at: ${new Date(run.completed_at).toDateString()}
            </span>
        </div>`;
}

function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}