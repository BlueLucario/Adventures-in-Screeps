const baseCreep = require('./BaseCreep');

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			var moving = false;
			var movingTo;

			
			/*
			var xx = creep.memory.mySpawn.pos.x;
			var yy = creep.memory.mySpawn.pos.y;
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					Game.spawns[mySpawn].room.createConstructionSite(xx-1+i, yy-1+j, STRUCTURE_RAMPART);
				}
			}
			Game.spawns[mySpawn].room.createConstructionSite(xx+2, yy, STRUCTURE_TOWER);
			Game.spawns[mySpawn].room.createConstructionSite(xx-2, yy, STRUCTURE_TOWER);
			*/


			if (creep.memory.target == 404) {
				creep.memory.thinking_building_harvesting_placing = 0;
				creep.memory.target = false;
				creep.memory.lastSource = creep.pos.findClosestByPath(FIND_SOURCES);
				creep.say('I Live!');

			}

			if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.thinking_building_harvesting_placing = 0;
				delete creep.memory.myPath;
				creep.memory.working = false;
				creep.say('⚡');
			}
			if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				creep.memory.thinking_building_harvesting_placing = 0;
				delete creep.memory.myPath;
				creep.memory.working = true;
				creep.say('🏗️ build');
			}

			if(creep.memory.working) {
				

				creep.memory.target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
				if (creep.memory.thinking_building_harvesting_placing = 0) {
					creep.memory.target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
					//if (creep.memory.target == )


				}
				if (creep.memory.thinking_building_harvesting_placing = 1) {
					var code = creep.build(creep.memory.target);
					if(code == ERR_NOT_IN_RANGE) {
						creep.say('🏗️');
						moving = true;
						movingTo = creep.memory.target;
					} else if (code == ERR_INVALID_TARGET) {
						creep.memory.think_work_upgrade = 0;
						creep.say('😿');
					}

				} else if (creep.memory.thinking_building_harvesting_placing = 2) {
					targets = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION ||
									structure.structureType == STRUCTURE_SPAWN ||
									structure.structureType == STRUCTURE_TOWER) && 
									structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					});
					if(targets.length > 0) {
					var code = creep.transfer(targets[0], RESOURCE_ENERGY);
						if(code == ERR_NOT_IN_RANGE) {
							moving = true;
							movingTo = targets[0];
							creep.say('🚛');
						} else if (code == ERR_INVALID_TARGET) {
							creep.memory.think_work_upgrade = 0;
							creep.say('😿');
						}
					}
				} else if (creep.memory.thinking_building_harvesting_placing = 3) {

					
					/*for(const i in Game.spawns) {
						if (Game.spawns[i].pos.room == creep.memory.homeRoom) {
							creep.memory.mySpawn = Game.spawns[i].pos;
							creep.say(Game.spawns[i].pos.x);
							i += 100;
						}
					}*/
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
				} 
				if (creep.memory.myPath == ERR_NO_PATH) {
					creep.say('ERR_NO_PATH');
					var sources = creep.room.find(FIND_SOURCES_ACTIVE);
					creep.memory.target = sources[Game.time % sources.length];

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

module.exports = roleBuilder;
