const baseCreep = require('./BaseCreep');

var roleMiner = {

	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			if (creep.memory.target == 404) {
				creep.memory.target = false;
				creep.memory.lastSource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
				creep.say('I Live!');
			}
			


			if(creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
				if (creep.moveTo( Game.getObjectById(creep.memory.target.id), {visualizePathStyle: {stroke: '#ffaa00'}}) == ERR_NO_PATH) {
					var sources = creep.room.find(FIND_SOURCES_ACTIVE);
					creep.memory.target = sources[Game.time % sources.length];
				}
			} else {
				Game.spawns[mySpawn].room.createConstructionSite(creep.pos, STRUCTURE_CONTAINER);
			}
			
		} catch(error) {
            console.log(error.stack);
			creep.say('☠️');
		}
	}
};

module.exports = roleMiner;
