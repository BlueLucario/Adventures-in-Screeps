const baseCreep = require('./BaseCreep');

var roleAttacker = {

    /** @param {Creep} creep **/
    run: function(creep) {
        try {
            var target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (target != null) {
                if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                    creep.say('Exterminate!');
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#f50a0a'}});
                }
            } else {
                target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
                if (target != null) {
                    if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#f50a0a'}});
                    }
                } else {
                    //creep.say('Done!');
                }
            
            }
		} catch(error) {
            console.log(error.stack);
			creep.say('☠️');
		}
        
	}
};

module.exports = roleAttacker;
