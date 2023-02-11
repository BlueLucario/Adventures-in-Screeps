const baseCreep = require('./BaseCreep');

var roleRepairer = {
	
	/** @param {Creep} creep **/
	run: function(creep) {
		try {

			if (creep.memory.target == 404) {

				Game.spawns['Spawn1'].room.createConstructionSite(Game.spawns['Spawn1'].pos, STRUCTURE_RAMPART);
				creep.memory.target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
				creep.memory.myPath = spawn.room.findPath(spawn, source);
			}

			if(creep.memory.working) {
				if(creep.store[RESOURCE_ENERGY] == 0) {

					creep.memory.working = false;
					creep.say('🔄');
				}
			
				if (creep.store.getFreeCapacity() == 0 || Game.getObjectById(creep.memory.target.id).hits >= Game.getObjectById(creep.memory.target.id).hitsMax) {
					var targets = creep.room.find(FIND_STRUCTURES, {
						filter: object => object.hits < (object.hitsMax*0.8)
					});

					targets.sort((a,b) => a.hits - b.hits);
					if(targets.length > 0) {
						creep.memory.target  = targets[0];
					}
				}
				/*
				var targetStructure = Game.getObjectById(creep.memory.target.id);
				if (targetStructure) {
					creep.memory.repairId = creep.memory.target.id;

					let code = creep.repair(targetStructure);
					this.emote(creep, '🔧 repair', code);

					if (code == ERR_NOT_IN_RANGE) {
						this.travelTo(creep, targetStructure, '#FF0000'); // red
					} else if (code === ERR_INVALID_TARGET) {
						console.log(`${creep} cannot repair ${targetStructure}`);
						delete creep.memory.repairId;
					} else if (code === ERR_NO_BODYPART) {
						// unable to move?
						this.suicide(creep);
					}
				}*/



				if(creep.repair(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.memory.target);
					/*
					let code = creep.moveByPath(creep.memory.myPath);
					switch (code) {
						case ERR_INVALID_TARGET:
						case ERR_INVALID_ARGS:
						case ERR_NOT_FOUND:
						case ERR_NO_PATH:
								creep.say('New Path...');
								var targetPos = creep.memory.target.pos;
								creep.memory.myPath = creep.pos.findPathTo(creep.memory.target);
								break;

						default: 
								creep.say('😸');
								break;
					}
					if (code == ERR_TIRED) {
						Game.rooms['homeRoom'].createConstructionSite(creep.pos, STRUCTURE_ROAD);
					}
					creep.say(code);*/
				}
				
			
			} else {

				if(creep.store.getFreeCapacity() == 0) {
					creep.memory.myPath = 404;
					creep.memory.working = true;
					creep.say('⚡ Repair');
				}

				creep.memory.target = creep.room.find(FIND_SOURCES_ACTIVE)[0];

				const droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, {filter: (s) => s.resourceType === RESOURCE_ENERGY /* && s.projectedEnergy > 25,*/});
            	if (droppedEnergy) {
					if(creep.transfer(droppedEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#fa0505'}});
					}
            	}

				//resource = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {filter: (s) => s.resourceType === RESOURCE_ENERGY && s.projectedEnergy > 25,});

				if(creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
				
					if (creep.moveTo(Game.getObjectById(creep.memory.target.id), {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH) {
						var sources = creep.room.find(FIND_SOURCES_ACTIVE);
						creep.memory.target = sources[Game.time % sources.length];
					}
				}
				
			}
		} catch(error) {
            console.log(error);
			creep.say('☠️');
		}
	}
};

module.exports = roleRepairer;
