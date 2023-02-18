const baseCreep = require('./BaseCreep');

var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			//creep.say("debug: "+creep.fatigue);
			var moving = false;
			var movingTo;

			if (creep.memory.target == 404) {
				creep.memory.target = false;
				creep.memory.lastSource = creep.pos.findClosestByPath(FIND_SOURCES);
				creep.memory.think_charg_uprgade_harvest = 0;
				creep.say('I Live!');
			}

			if (creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.think_charg_uprgade_harvest = 0;
				creep.memory.working = false;
				delete creep.memory.myPath;
				creep.say('⚡');
			}
			if (!creep.memory.working && creep.store.getFreeCapacity() == 0) {

				creep.memory.think_charg_uprgade_harvest = 0;
				creep.memory.working = true;
				delete creep.memory.myPath;
				creep.say('🚧');
			}

			if (creep.memory.working) {

				if (creep.memory.think_charg_uprgade_harvest == 0) {
					var targets = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION ||
									structure.structureType == STRUCTURE_SPAWN ||
									structure.structureType == STRUCTURE_TOWER) && 
									structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					})
					if (targets.length > 0) {
						creep.memory.target = targets[0];
						creep.memory.think_charg_uprgade_harvest = 1;
					} else {
						creep.memory.think_charg_uprgade_harvest = 2;
					}
				}
				if (creep.memory.think_charg_uprgade_harvest == 1) {
					var code = creep.transfer(Game.getObjectById(creep.memory.target.id), RESOURCE_ENERGY);
					if(code == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.memory.target;
						creep.say('📦');
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}
				} else if (creep.memory.think_charg_uprgade_harvest == 2) {
					var code = creep.upgradeController(creep.room.controller);
					if(code == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.room.controller;
						creep.say('🚚');
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}
				} else if (creep.memory.think_charg_uprgade_harvest == 3) {}


			} else {

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
										creep.memory.target = sources[Game.time % sources.length];
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

module.exports = roleHarvester;
