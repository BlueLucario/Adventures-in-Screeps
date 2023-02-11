const baseCreep = require('./BaseCreep');

var roleUpgrader = {
	
	/** @param {Creep} creep **/
	run: function(creep) {
		try {

			if (creep.memory.target == 404) {
				creep.memory.target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
			}
			if(creep.memory.upgrading) {
				if(creep.store[RESOURCE_ENERGY] == 0) {

					delete creep.memory.myPath;
					creep.memory.upgrading = false;
					creep.say('🔄 harvest');
				}
			
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					if(!creep.memory.myPath) {
						creep.say('New Path...');
						var targetPos = creep.room.controller;
						creep.memory.myPath = creep.pos.findPathTo(targetPos);
					} else {
						let code = creep.moveByPath(creep.memory.myPath);

						switch (code) {
							case ERR_NO_PATH:		 // -2
							case ERR_INVALID_TARGET: // -7
							case ERR_NOT_FOUND:		 // -5
							case ERR_INVALID_ARGS:	 //-10
									delete creep.memory.myPath;
									break;

							default: 
									//creep.say('🤪');
									break;
						}
						/*if (code == ERR_TIRED) { //-11,
							Game.rooms[homeRoom].createConstructionSite(creep.pos, STRUCTURE_ROAD);
						}*/
						creep.say(code);
					}
				}


			} else {
				if(creep.store.getFreeCapacity() == 0) {

					delete creep.memory.myPath;
					creep.memory.upgrading = true;
					creep.say('⚡ upgrade');
				}

				const droppedEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, {filter: (s) => s.resourceType === RESOURCE_ENERGY /* && s.projectedEnergy > 25,*/});
            	    if (droppedEnergy) {
					if(creep.transfer(droppedEnergy[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(droppedEnergy[0], {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleUpgrader;
