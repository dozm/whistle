var rules = require('../../../../lib/rules/util').rules;
var recycleBin = require('../../../../lib/rules/util').rules.recycleBin;
var isGroup = require('../../../../lib/util/common').isGroup;

module.exports = function(req, res) {
  var body = req.body;
  var list;
  if (rules.add(body.name, body.value, body.clientId, body.groupName) && isGroup(body.name)) {
    if (body.addToTop) {
      rules.moveToTop(body.name, body.clientId);
    } else {
      var group = rules.getFirstGroup();
      group && rules.moveTo(body.name, group.name, body.clientId);
    }
  }
  if (req.body.recycleFilename) {
    recycleBin.remove(req.body.recycleFilename);
    list = recycleBin.list();
  }
  res.json({
    ec: 0,
    list: list
  });
};
