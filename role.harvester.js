const baseCreep = require('./BaseCreep');

var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			var moving = false;

			if (creep.memory.target == 404) {
				var sources = creep.room.find(FIND_SOURCES_ACTIVE);
				creep.memory.target = sources[Game.time % sources.length];
			}

			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				var sources = creep.room.find(FIND_SOURCES_ACTIVE);
				creep.memory.target = sources[Game.time % sources.length];
				creep.memory.working = false;
				delete creep.memory.myPath;
				creep.say('⚡');
			}
			if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.working = true;
				delete creep.memory.myPath;
				creep.say('🚧');
			}

			if (creep.memory.working) {
				
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
								structure.structureType == STRUCTURE_SPAWN ||
								structure.structureType == STRUCTURE_TOWER) && 
								structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
					}
				})
				creep.memory.target = targets[0];

				if(targets.length > 0) {
					if(creep.transfer(creep.memory.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						moving = true;
						var movingTo = creep.memory.target;
						creep.say('📦');
					}
				} else {
					if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						moving = true;
						var movingTo = creep.room.controller;
						creep.say('📦');
					}
				}

			} else {

				if(!creep.memory.target) {
					var sources = creep.room.find(FIND_SOURCES_ACTIVE);
					creep.memory.target = sources[Game.time % sources.length];
				}

				if(creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
					moving = true;
					var movingTo = creep.memory.target;
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

module.exports = roleHarvester;
