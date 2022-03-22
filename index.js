'use strict';

/*
    Copyright (C) 2022 Mindbaz
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
    
    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
    
    --
    
    Change receivers in header for dryrun purpose
    Header must include 'configured header' = 'yes' to be triggered
*/


module.exports.title = 'Dry Run mode';

/**
 * Send mail to differrent user by changing header based on configuration file
 * If multiples users are provided in configuration file, function will randomly choose
 * one from read and fake receivers concatanated
 * 
 * @param {Object} app 
 * @param {Object} done 
 */
module.exports.init = (app, done) => {
    app.addHook('message:headers', (envelope, messageInfo, next) => {
        if (envelope.headers.getFirst(app.config.header) !== "yes") {
            next();
        }
        let realReceivers = app.config.receivers;
        let receivers = realReceivers.concat(app.config.fakeReceivers);
        let receiverNumber = receivers.length;
        if (receiverNumber < 2) {
            next(new Error('No receivers found in config'));
        }
        let sender = app.config.sender;
        let mailToUse = receivers[Math.random() * (receiverNumber) | 0];
        envelope['from'] = sender;
        envelope['to'] = [mailToUse];
        envelope['parsedEnvelope']['to'] = [mailToUse];
        envelope['parsedEnvelope']['from'] = sender;
        envelope.headers.update('to', [mailToUse]);
        envelope.headers.update('from', sender);
        envelope.headers.update('Delivered-To', [mailToUse]);
        next();
    });
    done();
}