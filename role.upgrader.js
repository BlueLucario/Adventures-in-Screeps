const baseCreep = require('./BaseCreep');

var roleUpgrader = {
	
	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			var moving = false;
			var movingTo;

			if (!creep.memory.working) {creep.memory.working = false;}
			if (creep.memory.target == 404) {
				creep.memory.target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
			}

			if(creep.memory.working) {

				if(creep.store[RESOURCE_ENERGY] == 0) {

					delete creep.memory.myPath;
					creep.memory.working = false;
					creep.say('⚡');
				}
			
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					moving = true;
					movingTo = creep.room.controller;
					creep.say('🏛️');
				}


			} else {
				if(creep.store.getFreeCapacity() == 0) {

					delete creep.memory.myPath;
					creep.memory.working = true;
					creep.say('🧀');
				}

				if(creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
					moving = true;
					movingTo = creep.memory.target;
				}
				
			}
			if (moving) {
				if(!creep.memory.myPath) {
					creep.say('🗺️');
					creep.memory.myPath = creep.pos.findPathTo(movingTo.pos.x, movingTo.pos.y);
				} else {
					var cur = _.find(creep.memory.myPath, (function(i) {
						if (i.x - i.dx == creep.pos.x && i.y - i.dy == creep.pos.y) {
							const look = creep.room.lookAt(i.x, i.y);
							if(look[0].type == 'creep') {
								delete creep.memory.myPath;

								var sources = creep.room.find(FIND_SOURCES_ACTIVE);
								creep.memory.target = sources[Game.time % sources.length];
							}
							return i.x - i.dx == creep.pos.x && i.y - i.dy == creep.pos.y;
						}
					}));
					if (cur) {
						creep.move(cur.direction);
					} else {delete creep.memory.myPath;}
				}
			}

		} catch(error) {
            console.log(error);
			creep.say('☠️');
		}
	}
};

module.exports = roleUpgrader;
