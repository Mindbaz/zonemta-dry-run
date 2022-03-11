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


export const title = 'Dry Run mode';
export function init(app, done) {
    app.addHook('message:headers', (envelope, messageInfo, next) => {
        if (envelope.headers.getFirst(app.config.header) !== "yes")
            next(new Error('no dry run'));
        let receivers = app.config.receivers;
        receivers.push(app.config.fakeReceivers);
        let sender = 'data@mindbaz.com';
        let mailToUse = receivers[Math.random() * (receivers.length) | 0];
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