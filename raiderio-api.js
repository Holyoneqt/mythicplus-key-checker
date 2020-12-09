function RaiderIO() {

    this.API_URL = 'https://raider.io/api/v1';
    this.CHARACTER_URL = 'characters/profile';
    this.AFFIXES_URL = 'mythic-plus/affixes';

}

RaiderIO.prototype.get = function(requestUrl) {
    return fetch(`${this.API_URL}/${requestUrl}`)
        .then(r => {
            if (r.ok) {
                return r.json()
            } else {
                throw r.json();
            }
        });
};

RaiderIO.prototype.getAffixes = function() {
    return this.get(`${this.AFFIXES_URL}?region=eu&locale=en`);
}

RaiderIO.prototype.getCharacter = function(realm, name, fields) {
    return this.get(`${this.CHARACTER_URL}?region=eu&realm=${realm}&name=${name}${fields && fields !== '' ? `&fields=${fields}` : ''}`);
};

RaiderIO.prototype.getHighestWeeklyMythicPlus = function(realm, name) {
    return this.getCharacter(realm, name, 'mythic_plus_weekly_highest_level_runs,gear');
};
