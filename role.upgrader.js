const baseCreep = require('./BaseCreep');

var roleUpgrader = {
	
	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			var moving = false;
			var movingTo;

			if (!creep.memory.working) {creep.memory.working = false;}
			if (creep.memory.target == 404) {
				creep.memory.target = false;
				creep.memory.lastSource = creep.room.find(FIND_SOURCES)[0];
				creep.say('I Live!');
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

				if(creep.harvest(Game.getObjectById(creep.memory.lastSource.id)) == ERR_NOT_IN_RANGE) {
					moving = true;
					movingTo = creep.memory.lastSource;
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
							if(look[0].type == 'creep' && creep.fatigue == 0) {
								if ((Game.time % 3) == 0) {
									delete creep.memory.myPath;
								
									if (!creep.memory.working) {
										var sources = creep.room.find(FIND_SOURCES_ACTIVE);
										creep.memory.lastSource = sources[Game.time % sources.length];
									}
								} else {
									creep.say('😾');
								}
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
            console.log(error.stack);
			creep.say('☠️');
		}
	}
};

module.exports = roleUpgrader;
