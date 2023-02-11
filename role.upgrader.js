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
					creep.say('⚡');
				}
			
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					if(!creep.memory.myPath) {
						creep.say('New Path...');
						var targetPos = creep.room.controller;
						creep.memory.myPath = creep.pos.findPathTo(targetPos);
					} else {
						var cur = _.find(creep.memory.myPath, (function(i) {
							if (i.x - i.dx == creep.pos.x && i.y - i.dy == creep.pos.y) {
								const look = creep.room.lookAt(i.x, i.y);
								//creep.say(look[0].type);
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


			} else {
				if(creep.store.getFreeCapacity() == 0) {

					delete creep.memory.myPath;
					creep.memory.upgrading = true;
					creep.say('🧀');
				}

				if(creep.harvest(Game.getObjectById(creep.memory.target.id)) == ERR_NOT_IN_RANGE) {
				
					if(!creep.memory.myPath) {
						creep.say('New Path...');
						creep.memory.myPath = creep.pos.findPathTo(creep.memory.target.pos.x, creep.memory.target.pos.y);
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
				
			}
		} catch(error) {
            console.log(error);
			creep.say('☠️');
		}
	}
};

module.exports = roleUpgrader;
