
class CreepsBase {

  suicide(creep) {
    // unable to move?
    creep.say('💀 suicide');
    console.log(`${creep}${creep.pos} is suiciding`);
    creep.busy = 1;
    creep.suicide();
  }

  travelTo(creep, target, color) {
    let opts = {};
    let code;

    if (color) {
      opts.visualizePathStyle = { stroke: color, opacity: 1, lineStyle: 'dotted' };
    }

    code = creep.moveTo(target, opts);

    if (code === ERR_NO_BODYPART) {
      // unable to move?
      this.suicide(creep);
    }

    return code;
  }
}

module.exports = CreepsBase;