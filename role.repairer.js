const baseCreep = require('./BaseCreep');

var roleRepairer = {
	
	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			moving = false;
			var movingTo;

			if (creep.memory.target == 404) {
				creep.memory.lastSource = creep.pos.findClosestByPath(FIND_SOURCES);
				creep.memory.think_work_upgrade = 0;
				creep.memory.target = false;
				creep.say('I Live!');
			}

			if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				delete creep.memory.myPath;
				creep.memory.working = false;
				creep.say('🔄');
			}
			if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.think_work_upgrade = 0;
				delete creep.memory.myPath;
				creep.memory.working = true;
				creep.say('🧀');
			}

			if(creep.memory.working) {
				
				if (creep.memory.think_work_upgrade == 0) {
					if (creep.store.getFreeCapacity() == 0 || Game.getObjectById(creep.memory.target.id).hits >= Game.getObjectById(creep.memory.target.id).hitsMax) {
						if (false) { // do not fix roads
							var targets = creep.room.find(FIND_STRUCTURES, {
								filter: (structure) => {
									return (structure.my ||
											structure.structureType == STRUCTURE_WALL) && 
											structure.hits < (structure.hitsMax*0.8);
								}
							})
						} else {
							var targets = creep.room.find(FIND_STRUCTURES, {
								filter: object => object.hits < (object.hitsMax*0.8)
							});
						}
						targets.sort((a,b) => a.hits - b.hits);
						if(targets.length > 0) {
							creep.memory.target  = targets[0];
							creep.memory.think_work_upgrade = 1;
						} else {
							creep.memory.think_work_upgrade = 2;
						}
					}
				}
				if (creep.memory.think_work_upgrade == 1) {
					var code = creep.repair(Game.getObjectById(creep.memory.target.id));
					if(code == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.memory.target;
						creep.say('🔧');
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}
				} else if (creep.memory.think_work_upgrade == 2) {
					if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.room.controller;
						creep.say('🏛️');
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}
				}
				
			
			} else { //!creep.memory.working

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

module.exports = roleRepairer;
