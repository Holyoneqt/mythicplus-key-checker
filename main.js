let preloadChars = [
    { realm: 'Alleria', name: 'Nerià' },
    { realm: 'Alleria', name: 'Anonià' },
    { realm: 'Alleria', name: 'Aenlin' },
    { realm: 'Alleria', name: 'Nokh' },
    { realm: 'Alleria', name: 'Beat' }
];

const lootTable = {
    2: "905",
    3: "910",
    4: "915",
    5: "920",
    6: "920",
    7: "925",
    8: "925",
    9: "930",
    10: "935",
    11: "940",
    12: "945",
    13: "950",
    14: "955",
    15: "960"
};

let myCharacters = [];
const raiderio = new RaiderIO();

$(document).ready(function() {
    // Preload
    for(let i = 0; i < preloadChars.length; i++) {
        const char = preloadChars[i];
        raiderio.getHighestWeeklyMythicPlus(char.realm, char.name);
    }

    $('#addNewChar').click(function() {
        const realm = $('#newCharRealm').val();
        const name = $('#newCharName').val();
        raiderio.getHighestWeeklyMythicPlus(realm, name);
    });

    $('#refresh').click(loadCharacters);
});

loadCharacters = function() {
    for(let i = 0; i < myCharacters.length; i++) {
        const char = myCharacters[i];
        raiderio.getHighestWeeklyMythicPlus(char.realm, char.name);
    }
};

drawCharacter = function(char) {
    if( document.getElementById(`${char.realm}-${char.name}`) ) {
        // TODO: Update
    } else {
        let topMythicLevel, topMythicDungeon, weeklyLoot;
        let weeklyHighest = char.mythic_plus_weekly_highest_level_runs[0]
        if(weeklyHighest) {
            topMythicDungeon = weeklyHighest.dungeon;
            topMythicLevel = "+" + weeklyHighest.mythic_level;
            weeklyLoot = `-> Itemlevel ${lootTable[weeklyHighest.mythic_level]} in Weekly Chest`;
        } else {
            topMythicDungeon = '--';
            topMythicLevel = '--';
            weeklyLoot = '';
        }

        $('#myCharacters').append(
            `
            <div id="${char.realm}-${char.name}" class="character ${char.class.toLowerCase()}">
                <img class="thumbnail" src="${char.thumbnail_url}" alt="char" />
                ${char.realm}-${char.name} <span style="font-size: 12px">${char.gear.item_level_equipped} equipped</span> || ${topMythicDungeon} ${topMythicLevel} ${weeklyLoot}
                <button id="delete${char.realm}-${char.name}" class="button button-delete" title="remove">X</button>
            </div>
            `
        );

        $(`#delete${char.realm}-${char.name}`).click({ char: char }, function(event) {
            myCharacters = myCharacters.filter(i => {
                return !(i.realm.toLowerCase() === event.data.char.realm.toLowerCase() &&
                         i.name.toLowerCase() === event.data.char.name.toLowerCase());
            });
            $(`#${char.realm}-${char.name}`).remove();
        });
    }
};
