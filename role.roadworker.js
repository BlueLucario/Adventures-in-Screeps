const baseCreep = require('./BaseCreep');

var roleRoadWorker = {

	run: function(creep) 
	{
		try {
			var moving = false;
			var movingTo;

			/*for (var creepName in Game.creeps) {
				creep.say(Game.spawns['Spawn1'].pos.x + ':P');
				Game.rooms.sim.createConstructionSite(Game.creeps[creepName].pos.x, Game.creeps[creepName].pos.y, STRUCTURE_ROAD);
			}*/
			if (creep.memory.target == 404) {
				creep.memory.think_build_fix_upgrad_harvest = 0;
				var sources = creep.room.find(FIND_SOURCES_ACTIVE);
				creep.memory.target = sources[Game.time % sources.length];
			}
			
			if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
				creep.memory.think_build_fix_upgrad_harvest = 4;
				creep.memory.working = false;
				delete creep.memory.myPath;
				creep.say('⚡');
			}
			if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.think_build_fix_upgrad_harvest = 0;
				creep.memory.working = true;
				delete creep.memory.myPath;
				creep.say('🚧 build');
			}

			if(creep.memory.working) {

			    if(creep.memory.think_build_fix_upgrad_harvest == 0) {
					creep.say('What to do...');
					for (var creepName in Game.creeps) {
						Game.spawns['Spawn1'].room.createConstructionSite(Game.creeps[creepName].pos.x, Game.creeps[creepName].pos.y, STRUCTURE_ROAD);
					}
				
					var targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 13);
					if(!targets.length) {
						targets = creep.room.find(FIND_CONSTRUCTION_SITES);
					}
					if(targets.length) {
						creep.memory.target = targets[0];
						creep.memory.think_build_fix_upgrad_harvest = 1;

					} else {

						let allRoads = Game.rooms[creep.memory.homeRoom].find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_ROAD}});
						var minHP = 1;
						var target;
						for (road in allRoads) {
							if (road.hits/road.hitsMax < minHP) {
								target = road;
							}
						}
						if (target) {
							creep.memory.think_build_fix_upgrad_harvest = 2;
							creep.memory.target = target;
						} else {
							creep.memory.think_build_fix_upgrad_harvest = 3;
						}
					}
				} 
				if(creep.memory.think_build_fix_upgrad_harvest == 1) {

					var code = creep.build(Game.getObjectById(creep.memory.target.id));
					if(code == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.memory.target;
						creep.say('🚧 '+Game.cpu.bucket);
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}
					
				} else if(creep.memory.think_build_fix_upgrad_harvest == 2) {
					
					var code = creep.repair(Game.getObjectById(creep.memory.target.id));
					if(code == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.memory.target;
						creep.say('🚧 '+Game.cpu.bucket);
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}

				} else if(creep.memory.think_build_fix_upgrad_harvest == 3) {

					var code = creep.upgradeController(creep.room.controller);
					if(code == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.room.controller;
						creep.say('🃏');
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}
				}

			} else { /** !working **/

			
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
								
								if (!creep.memory.working) {
									var sources = creep.room.find(FIND_SOURCES_ACTIVE);
									creep.memory.target = sources[Game.time % sources.length];
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
module.exports = roleRoadWorker;
