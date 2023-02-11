const baseCreep = require('./BaseCreep');

var roleBuilder = {

	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			if (creep.memory.target == 404) {
				creep.memory.target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
			}
			Game.spawns['Spawn1'].room.createConstructionSite( 23, 22, STRUCTURE_TOWER );

			if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.building = false;
				creep.say('🔄 harvest');
			}
			if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
				creep.memory.building = true;
				creep.say('🚧 build');
			}

			if(creep.memory.building) {
				creep.say('🚧');
				
				var targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 13);
				if(!targets.length) {
					targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				}
				if(targets.length) {
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
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
							creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
						}
					}
				}
			} else {
				if(creep.harvest( Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
					if (creep.moveTo( Game.getObjectById(creep.memory.target.id), {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH) {
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

module.exports = roleBuilder;
