const baseCreep = require('./BaseCreep');

var roleRoadWorker = {

	run: function(creep) 
	{
		try {
			var moving = false;
			var movingTo;

			var homeRoom = creep.memory.homeRoom;
			/*for (var creepName in Game.creeps) {
				creep.say(Game.spawns['Spawn1'].pos.x + ':P');
				Game.rooms.sim.createConstructionSite(Game.creeps[creepName].pos.x, Game.creeps[creepName].pos.y, STRUCTURE_ROAD);
			}*/
			if (!creep.memory.working) {creep.memory.working = false;}
			if (creep.memory.target == 404) {
				var sources = creep.room.find(FIND_SOURCES_ACTIVE);
				creep.memory.target = sources[Game.time % sources.length];
			}
			
			if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.working = false;
				creep.say('⚡');
			} else if(creep.store.getFreeCapacity() == 0) {
				creep.memory.working = true;
				creep.say('🚧 build');
			}

			if(creep.memory.working) {

			    

				if(!creep.memory.target) {
					creep.say('What to do...');
					var buildStuff = false;
					var fixStuff = false;

					var targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 13);
					if(!targets.length) {
						targets = creep.room.find(FIND_CONSTRUCTION_SITES);
					}
					if(targets.length) {
						creep.memory.target = targets[0];
							buildStuff = true;
						
					} else {
						for (var creepName in Game.creeps) {
							creep.memory.looked = creep.room.lookAt(creepName.x, creepName.y);
						
							Game.spawns['Spawn1'].room.createConstructionSite(Game.creeps[creepName].pos.x, Game.creeps[creepName].pos.y, STRUCTURE_ROAD);
							}


							/*
						if (creep.store.getFreeCapacity() == 0 || Game.getObjectById(creep.memory.target.id).hits >= Game.getObjectById(creep.memory.target.id).hitsMax) {
						var targets = creep.room.find(FIND_STRUCTURES, {
							if(s.structureType == STRUCTURE_ROAD) {
								filter: object => object.hits < (object.hitsMax*0.8)
							}
						});

						targets.sort((a,b) => a.hits - b.hits);
						if(targets.length > 0) {
							creep.memory.target  = targets[0];
						}*/
					}
				}
				//if (buildStuff) {
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						moving = true;
						movingTo = creep.memory.target;
						creep.say('🚧 '+Game.cpu.bucket);
					}
				//}

			} else { /** !working **/
				var sources = creep.room.find(FIND_SOURCES_ACTIVE);
				creep.memory.target = sources[Game.time % sources.length];

			
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
module.exports = roleRoadWorker;
