const _ = require('lodash');
const columnify = require('columnify');

module.exports = ({ config, utils }, done) => {
  const { logger, loadFile } = utils;
  const { filePath, ignored } = config.data.dubtrackFm;

  const songs = [];

  const sets = loadFile(filePath);
  if (!sets || sets.length === 0) {
    return done(null);
  }

  sets.forEach(set => {
    // _id, name, images, type, fkid, streamUrl, songLength
    set.data.forEach(({ _song }) => {
      songs.push({
        name: _song.name,
        type: _song.type,
        fkid: _song.fkid,
        duration: _song.songLength
      });
    });
  });

  const sorted = _.sortBy(songs, 'name');
  logger.debug(columnify(sorted));
  return done(null, sorted);
};
