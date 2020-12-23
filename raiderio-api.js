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

RaiderIO.prototype.getCharacter = function(region, realm, name, fields) {
    return this.get(`${this.CHARACTER_URL}?region=${region}&realm=${realm}&name=${name}${fields && fields !== '' ? `&fields=${fields}` : ''}`);
};

RaiderIO.prototype.getHighestWeeklyMythicPlus = function(region, realm, name) {
    return this.getCharacter(region, realm, name, 'mythic_plus_weekly_highest_level_runs,gear,mythic_plus_scores_by_season:current,mythic_plus_best_runs');
};
