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
  Header must include 'X-Mass-Dry-Run="yes"' to trigger action
*/


module.exports.title = 'Dry Run mode';

/**
 * 
 * 
 * 
 * @param {Object} app 
 * @param {Object} done 
 */
module.exports.init = (app, done) => {
    app.addHook('message:headers', (envelope, messageInfo, next) => {
        // console.log(envelope.headers)
        if (envelope.headers.getFirst(app.config.header) !== "yes") {
            console.log('Nok')
            next();
        }
        let receivers = app.config.receivers;
        receivers.push(app.config.fakeReceivers);
        let receiverNumber = receivers.length;
        if (receiverNumber < 2) {
            next(new Error('No receivers found in config'));
        }
        let sender = app.config.sender;
        let mailToUse = receivers[Math.random() * (receiverNumber - 1) | 0];
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