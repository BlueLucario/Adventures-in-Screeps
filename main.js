/* eslint indent: [ "error", 4 ], no-undef: 0 */
const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
const roleBuilder = require("role.builder");
const roleRoadWorker = require("role.roadworker");
const roleAttacker = require("role.attacker");
const roleRepairer = require("role.repairer");

// _.sum will count the number of creeps for each role
const countCreeps = creepRole =>
    _.sum(Game.creeps, c => c.memory.role == creepRole)
const countStructures = structureType =>
    _.sum(Game.structures, s => s.structureType == structureType)

module.exports.loop = () => {
    
    if (Game.cpu.bucket >= 10000) {
        Game.cpu.generatePixel();
    }

    for (var thisRoom in Game.rooms) {
        
        var towers = Game.rooms.thisRoom.find(FIND_MY_STRUCTURES, {
            filter: (s) => {
                return s.structureType === STRUCTURE_TOWER;
            }
        });
        if (towers) {
            for (var tower in towers) {
                if(tower) {
                    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(closestHostile) {
                        tower.attack(closestHostile);
                    }

                    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => structure.hits < structure.hitsMax
                    });
                    if(closestDamagedStructure) {
                        tower.repair(closestDamagedStructure);
                    }
                }
            }
        }
        
    
        // check for memory entries of died creeps & delete the memory entry if not alive
        for (let name in Memory.creeps) {
            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }
        }

        // for every creep name in Game.creeps
        for (let name in Game.creeps) {
            let creep = Game.creeps[name];
            // get the creep role
            let {role} = creep.memory;

            // assign creep tasks based on roles
            role == "harvester" && roleHarvester.run(creep);
            role == "upgrader" && roleUpgrader.run(creep);
            role == "builder" && roleBuilder.run(creep);
            role == "roadworker" && roleRoadWorker.run(creep);
            role == "attacker" && roleAttacker.run(creep);
            role == "repairer" && roleRepairer.run(creep);
        }


    }
        for( thisSpawn in Game.spawns ) {

         


        
        var minimumNoOfExtensions = 0;
        var energyAtRoomLvl = 300;
        switch (Game.rooms[thisRoom].controller.level) {
            case 0:
                minimumNoOfExtensions = 0;
                break;
            case 1:
                minimumNoOfExtensions = 0;
                break;
            case 2:
                minimumNoOfExtensions = 5;
                break;
            case 3:
                minimumNoOfExtensions = 10;
                break;
            case 4:
                minimumNoOfExtensions = 20;
                break;
            case 5:
                minimumNoOfExtensions = 30;
                break;
            case 6:
                minimumNoOfExtensions = 40;
                break;
            case 7:
                minimumNoOfExtensions = 50;
                break;
            case 8:
                minimumNoOfExtensions = 60;
                break;
        }
        
        if (true || Game.spawns[thisSpawn].store.getUsedCapacity() == energyAtRoomLvl) {

            // goal: set the minimum numbers of creeps required for each role
            const minimumNoOfHarvesters = 3;
            const minimumNoOfUpgraders = 4;
            const minimumNoOfBuilders = 2;
            const minimumNoOfRoadWorkers = 1;
            const minimumNoOfRepairers = 1;

            // currently active creeps for each role
            let currentHarvesters = countCreeps("harvester");
            let currentUpgraders = countCreeps("upgrader");
            let currentBuilders = countCreeps("builder");
            let currentRoadWorkers = countCreeps("roadworker");
            let currentRepairers = countCreeps("repairer");
            // default creep name
            let name = undefined;

            // var rooms[roomName];
            var target = 404;
            var hostiles = false;

            // try spawning creeps if enough for each role isn't available
            if (currentHarvesters < minimumNoOfHarvesters) {
                name = Game.spawns[thisSpawn].createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    "Harvester: " + Game.time,
                    { role: "harvester", working: false, target: target, homeRoom: thisRoom}
                )
            } else if (currentUpgraders < minimumNoOfUpgraders) {
                name = Game.spawns[thisSpawn].createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    "Upgrader: " + Game.time,
                    { role: "upgrader", working: false, target: target, homeRoom: thisRoom}
                )
            } else if (currentRoadWorkers < minimumNoOfRoadWorkers) {
                name = Game.spawns[thisSpawn].createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    "Roadworker: " +Game.time,
                    { role: "roadworker", working: false, target: target, homeRoom: thisRoom}
                )
            } else if (currentBuilders < minimumNoOfBuilders) {
                name = Game.spawns[thisSpawn].createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    "Builder: " + Game.time,
                    { role: "builder", working: false, target: target, homeRoom: thisRoom}
                )
            } else if (currentRepairers < minimumNoOfRepairers) {
                name = Game.spawns[thisSpawn].createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    "Repairer: " + Game.time,
                    { role: "repairer", working: false, target: target, homeRoom: thisRoom}
                )
            } else if (hostiles) {
                name = Game.spawns[thisSpawn].createCreep(
                    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
                    MOVE, RANGED_ATTACK],
                    "Attacker: " +Game.time,
                    { role: "attacker", homeRoom: thisRoom}
                )
            } else if (currentUpgraders < (minimumNoOfUpgraders*2)) {
                // default case: try to spawn upgraders
                name = Game.spawns[thisSpawn].createCreep(
                    [WORK, CARRY, CARRY, MOVE, MOVE],
                    "Upgrader: " + Game.time,
                    { role: "upgrader", working: false, target: target, homeRoom: thisRoom}
                )
            }
        }
    }
}
