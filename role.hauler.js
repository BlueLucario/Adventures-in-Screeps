﻿const baseCreep = require('./BaseCreep');

var roleHarvester = {

	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			var myRoom = creep.memory.homeRoom;


			if (creep.memory.target == 404) {
				creep.say('I Live!');
			}
			
			let ramparts = Game.rooms.myRoom.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});

				creep.memory.target = creep.room.find(STRUCTURE_CONTAINER)[0];
			}
			if(creep.store.getFreeCapacity() > 0) {
				if(creep.harvest( Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
					if (creep.moveTo( Game.getObjectById(creep.memory.target.id), {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH) {
						var sources = creep.room.find(FIND_SOURCES_ACTIVE);
						creep.memory.target = sources[Game.time % sources.length];
					}
				}
			} else {
				var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION ||
								structure.structureType == STRUCTURE_SPAWN ||
								structure.structureType == STRUCTURE_STORAGE ||
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
		} catch(error) {
            console.log(error.stack);
			creep.say('☠️');
		}
	}
};

module.exports = roleHarvester;
