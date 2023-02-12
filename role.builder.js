const baseCreep = require('./BaseCreep');

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			var moving = false;
			var movingTo;

			if(!creep.memory.mySpawn) {
				creep.say('Where was my spawn again?');
				creep.memory.mySpawn = Game.spawns['Spawn1']


				/*for(const i in Game.spawns) {
					if (Game.spawns[i].pos.room == creep.memory.homeRoom) {
						creep.memory.mySpawn = Game.spawns[i].pos;
						creep.say(Game.spawns[i].pos.x);
						i += 100;
					}
				}*/
			}

			var xx = creep.memory.mySpawn.pos.x;
			var yy = creep.memory.mySpawn.pos.y;
			for (var i = 0; i < 3; i++) {
				for (var j = 0; j < 3; j++) {
					Game.spawns['Spawn1'].room.createConstructionSite(xx-1+i, yy-1+j, STRUCTURE_RAMPART);
				}
				Game.spawns['Spawn1'].room.createConstructionSite(xx+2, yy, STRUCTURE_TOWER);
				Game.spawns['Spawn1'].room.createConstructionSite(xx-2, yy, STRUCTURE_TOWER);
			}

			if (creep.memory.target == 404) {
				creep.memory.target = creep.room.find(FIND_SOURCES_ACTIVE)[0];

			}

			if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				
				creep.memory.working = false;
				creep.say('🔄 harvest');
			}
			if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
				
				creep.memory.working = true;
				creep.say('🏗️ build');
			}

			if(creep.memory.working) {
				

				

				var targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 13);
				if(!targets.length) {
					targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				}
				

				if(targets.length) {
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = targets[0];
					}
				} else {
					targets = creep.room.find(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION ||
									structure.structureType == STRUCTURE_SPAWN ||
									structure.structureType == STRUCTURE_TOWER) && 
									structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
						}
					});
					if(targets.length > 0) {
						if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
							moving = true;
							movingTo = targets[0];
							creep.say('🏗️');
						}
					}
				}
				

			} else {
				if(creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
					moving = true;
					movingTo = creep.memory.target;
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

module.exports = roleBuilder;
