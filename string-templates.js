function getCharacterTemplate(char, animationDelay, initialDraw) {
    let topMythicLevel, topMythicDungeon;
    let weeklyHighest = char.mythic_plus_weekly_highest_level_runs[0]
    if (weeklyHighest) {
        topMythicDungeon = weeklyHighest.dungeon;
        topMythicLevel = "+" + weeklyHighest.mythic_level;
    } else {
        topMythicDungeon = '--';
        topMythicLevel = '--';
    }
    console.log(animationDelay);

    return `
        <div id="${clean(char.realm)}-${clean(char.name)}" class="character ${char.class.toLowerCase()} ${initialDraw ? '' : 'no-animation'}" ${animationDelay ? `style="animation-delay: ${animationDelay}ms"` : ''}>
            <div>
                <div class="thumbnail">
                    <div style="--bg-image: url('${char.thumbnail_url}');">
                </div>
                </div>
                <div>
                    <p style="font-size: 12px; margin-bottom: -6px;">${char.realm}</p>
                    <p>${char.name}</p>
                    <p style="font-size: 12px">${char.gear.item_level_equipped} equipped</p>
                    <a href=${char.profile_url} target="_blank">${char.mythic_plus_scores_by_season[0].scores.all} RIO Score</a>
                </div>
                <div>
                    <p style="font-size: 12px">Highest M+ this week</p>
                    <p>${topMythicDungeon} ${topMythicLevel}</p>
                    <p style="font-size: 12px">Weekly Chest</p>
                    <p>${getWeeklyChestLoot(char.mythic_plus_weekly_highest_level_runs)}</p>
                </div>
            </div>
            <div>
                <div id="${clean(char.realm)}-${char.name}-runs" class="runs"></div>
                <button id="delete${clean(char.realm)}-${clean(char.name)}" class="button button-delete" title="remove">X</button>
            </div>
        </div>
    `;
}

function getDungeonRunTemplate(run, animate, animationDelay) {
    return `
        <div class="tooltip ${animate ? 'tooltip-animate' : ''}" ${animationDelay ? `style="animation-delay: ${animationDelay}ms"` : ''}>
            <p>${run.short_name} +${run.mythic_level}</p>
            <p style="font-size: 12px; text-align: center">${run.num_keystone_upgrades == 0 ? 'depleted' : `upgraded +${run.num_keystone_upgrades}`}</p>
            <a class="default" style="font-size: 12px; display: block; margin: 2px; text-align: center" href="${run.url}" target="_blank">${run.score}</a>
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