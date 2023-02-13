const baseCreep = require('./BaseCreep');

var roleRepairer = {
	
	/** @param {Creep} creep **/
	run: function(creep) {
		try {
			moving = false;
			var movingTo;

			if (creep.memory.target == 404) {

				creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
			}

			if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
				creep.memory.target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
				delete creep.memory.myPath;
				creep.memory.working = false;
				creep.say('🔄');
			}
			if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
					
				delete creep.memory.myPath;
				creep.memory.working = true;
				creep.say('🧀');
			}

			if(creep.memory.working) {
				
			
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
					
					moving = true;
					movingTo = creep.memory.target;
				}
				
			
			} else { //!creep.memory.working

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
								
								if (!creep.memory.working) {
									var sources = creep.room.find(FIND_SOURCES_ACTIVE);
									creep.memory.target = sources[Game.time % sources.length];
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

module.exports = roleRepairer;
