const baseCreep = require('./BaseCreep');

var roleRoadWorker = {

	run: function(creep) 
	{
		try {
			var homeRoom = creep.memory.homeRoom;
			/*for (var creepName in Game.creeps) {
				creep.say(Game.spawns['Spawn1'].pos.x + ':P');
				Game.rooms.sim.createConstructionSite(Game.creeps[creepName].pos.x, Game.creeps[creepName].pos.y, STRUCTURE_ROAD);
			}*/
			if (creep.memory.target == 404) {
				creep.memory.target = creep.room.find(FIND_SOURCES_ACTIVE)[0];
			}
			if(creep.memory.building) {
			    creep.say('🚧 '+Game.cpu.bucket);
				if(creep.store[RESOURCE_ENERGY] == 0) {
					creep.memory.building = false;
					creep.say('🔄 harvest');
				}
			
				var targets = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 13);
				if(!targets.length) {
					targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				}
				if(targets.length) {
					if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
					}
				} else {
			    
					for (var creepName in Game.creeps) {
						Game.spawns['Spawn1'].room.createConstructionSite(Game.creeps[creepName].pos.x, Game.creeps[creepName].pos.y, STRUCTURE_ROAD);
					}
				}
			} else { /** !building **/
				if(creep.store.getFreeCapacity() == 0) {
					creep.memory.building = true;
					creep.say('🚧 build');
				}
			
				if(creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
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
module.exports = roleRoadWorker;
